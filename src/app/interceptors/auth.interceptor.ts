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

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        // Ajustamos las cabeceras para CORS
        const headers: any = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };

        if (token) {
          headers['x-token'] = token;
        }

        request = request.clone({
          setHeaders: headers,
          withCredentials: false
        });

        // Comprobar si es una operación que requiere mostrar carga
        const isLongOperation = this.isLongRunningOperation(request);
        let loadingElement: HTMLIonLoadingElement | null = null;

        if (isLongOperation) {
          // Creamos un control de tiempo para evitar que el loading se quede abierto demasiado tiempo
          from(this.showLoading()).subscribe(loading => {
            loadingElement = loading;
            this.activeLoaders.push(loading);
            
            // Establecemos un timeout de seguridad para cerrar el loading
            this.loadingTimeout = setTimeout(() => {
              this.dismissLoader(loading);
            }, 5000); // 5 segundos máximo
          });
        }

        return next.handle(request).pipe(
          tap(event => {
            // Si la respuesta es exitosa y es final (no es un evento de progreso), cerramos el loader
            if (event instanceof HttpResponse && loadingElement) {
              clearTimeout(this.loadingTimeout);
              this.dismissLoader(loadingElement);
            }
          }),
          retry(1),
          catchError((error: HttpErrorResponse) => {
            // Cancelamos el timeout y cerramos el loader
            if (this.loadingTimeout) {
              clearTimeout(this.loadingTimeout);
            }
            
            if (loadingElement) {
              this.dismissLoader(loadingElement);
            }

            // Manejar errores específicos
            if (error.status === 0) {
              this.showErrorToast('Error de conexión. Compruebe su conexión a internet o contacte con el administrador.');
              console.error('Error de conexión:', error);
              return throwError(() => 'Error de conexión con el servidor. Por favor, compruebe su conexión a internet.');
            }
            
            if (error.status === 401) {
              this.authService.logout();
              this.router.navigate(['/auth/login']);
              return throwError(() => 'Sesión expirada. Por favor, inicie sesión nuevamente.');
            }
            
            if (error.status === 429) {
              this.showErrorToast('Demasiadas solicitudes. Por favor, espere unos momentos.');
              return throwError(() => 'Demasiadas solicitudes. Por favor, intente más tarde.');
            }

            if (error.status === 403) {
              this.showErrorToast('No tiene permisos para realizar esta acción.');
              return throwError(() => 'No tiene permisos para realizar esta acción.');
            }

            if (error.status >= 500) {
              this.showErrorToast('Error en el servidor. Por favor, inténtelo de nuevo más tarde.');
              return throwError(() => 'Error interno del servidor. Por favor, intente nuevamente más tarde.');
            }

            // Para otros errores
            const errorMsg = error.error?.message || error.message || 'Error desconocido';
            this.showErrorToast(errorMsg);
            return throwError(() => errorMsg);
          }),
          finalize(() => {
            // Asegurarnos de que el loader se cierre al finalizar, sea error o éxito
            if (this.loadingTimeout) {
              clearTimeout(this.loadingTimeout);
            }
            
            if (loadingElement) {
              this.dismissLoader(loadingElement);
            }
          })
        );
      })
    );
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