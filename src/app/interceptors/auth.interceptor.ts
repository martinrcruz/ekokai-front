import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap, retry, finalize, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private activeLoaders: HTMLIonLoadingElement[] = [];
  private loadingTimeout: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    
    // Clonar la request y agregar headers de autorización si hay token
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    // Mostrar loading para operaciones largas
    let loader: HTMLIonLoadingElement | null = null;
    if (this.isLongRunningOperation(req)) {
      this.showLoading().then(l => loader = l);
    }

    return next.handle(authReq).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          // Manejar respuesta exitosa
          this.handleSuccessResponse(event);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Manejar errores
        return this.handleError(error, req);
      }),
      finalize(() => {
        // Limpiar loading
        if (loader) {
          this.dismissLoader(loader);
        }
      })
    );
  }

  private handleSuccessResponse(response: HttpResponse<any>) {
    // Aquí puedes agregar lógica para manejar respuestas exitosas
    console.log('Response success:', response.status);
  }

  private handleError(error: HttpErrorResponse, request: HttpRequest<any>): Observable<never> {
    console.error('HTTP Error:', error);

    // Manejar diferentes tipos de errores
    if (error.status === 401) {
      // Token expirado o inválido
      this.authService.logout();
      this.showErrorToast('Sesión expirada. Por favor, inicie sesión nuevamente.');
      this.router.navigate(['/auth/login']);
    } else if (error.status === 403) {
      // Sin permisos
      this.showErrorToast('No tiene permisos para realizar esta acción.');
    } else if (error.status === 404) {
      // Recurso no encontrado
      this.showErrorToast('Recurso no encontrado.');
    } else if (error.status === 500) {
      // Error del servidor
      this.showErrorToast('Error interno del servidor. Intente nuevamente más tarde.');
    } else if (error.status === 0) {
      // Error de conexión
      this.showErrorToast('No se pudo conectar con el servidor. Verifique su conexión a internet.');
    } else {
      // Otros errores
      const errorMessage = error.error?.message || error.message || 'Error desconocido';
      this.showErrorToast(errorMessage);
    }

    return throwError(() => error);
  }

  private dismissLoader(loader: HTMLIonLoadingElement) {
    if (loader) {
      // Removemos el loader de la lista de activos
      const index = this.activeLoaders.indexOf(loader);
      if (index > -1) {
        this.activeLoaders.splice(index, 1);
      }
      
      // Cerramos el loader
      loader.dismiss().catch(err => console.error('Error al cerrar el loader:', err));
    }
  }

  private isLongRunningOperation(request: HttpRequest<unknown>): boolean {
    return request.method === 'POST' || request.method === 'PUT' || 
           request.url.includes('upload') || request.url.includes('create');
  }

  private async showLoading(): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      duration: 3000, // Duración reducida a 3 segundos
      spinner: 'crescent'
    });
    await loading.present();
    this.activeLoaders.push(loading);
    return loading;
  }

  private async showErrorToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      buttons: ['OK']
    });
    await toast.present();
  }
} 