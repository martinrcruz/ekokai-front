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
    
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          'x-token': token,
          'Authorization': `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
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