import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ApiResponse } from '../interfaces/api-response.interface';
import { AlertController } from '@ionic/angular';

interface LoginResponse {
  token: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  private _storage: Storage | null = null;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<any>(null);

  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.init();
  }

  async init() {
    try {
      const store = await this.storage.create();
      this._storage = store;
      await this.checkToken();
    } catch (error) {
      console.error('Error initializing storage', error);
    }
  }

  async checkToken() {
    try {
      const token = localStorage.getItem('token');
      console.log('[AuthService] checkToken token:', token);
      if (token) {
        const decoded: any = jwtDecode(token);
        console.log('[AuthService] checkToken decoded:', decoded);
        const now = Math.floor(Date.now() / 1000); // en segundos
        this.userSubject.next(decoded.user);

        if (decoded.exp && decoded.exp > now) {
          this.isLoggedInSubject.next(true);
        } else {
          console.log('Token expired');
          await this.removeToken();
        }
      } else {
        this.isLoggedInSubject.next(false);
      }
    } catch (error) {
      console.error('Error checking token', error);
      await this.removeToken();
    }
  }

  isLoggedIn() {
    return this.isLoggedInSubject.asObservable();
  }

  async setToken(token: string) {
    try {
      if (!token) {
        throw new Error('Token is empty');
      }
      localStorage.setItem('token', token);
      const decoded: any = jwtDecode(token);
      console.log('[AuthService] setToken decoded:', decoded);
      this.userSubject.next(decoded.user);
      this.isLoggedInSubject.next(true);
      return true;
    } catch (error) {
      console.error('Error setting token', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded: any = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp > now) {
          return token;
        } else {
          console.log('Token expired when getting');
          await this.removeToken();
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting token', error);
      return null;
    }
  }

  async removeToken() {
    try {
      localStorage.removeItem('token');
      this.userSubject.next(null);
      this.isLoggedInSubject.next(false);
    } catch (error) {
      console.error('Error removing token', error);
    }
  }

  register(userData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/create`, userData)
      .pipe(
        catchError(error => {
          console.error('Error en el registro:', error);
          this.showAlert('Error', 'No se pudo completar el registro. Por favor, inténtelo de nuevo.');
          return throwError(() => error);
        })
      );
  }

  login(credentials: { email: string; password: string }): Observable<ApiResponse<LoginResponse>> {
    // Eliminamos el token anterior si existe
    this.removeToken();
    
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login`, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      tap(response => {
        if (response.ok && response.data?.token) {
          this.setToken(response.data.token);
          if (response.data.role) {
            this.userSubject.next({ ...this.userSubject.value, role: response.data.role });
          }
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        let errorMessage = 'Error al iniciar sesión';
        
        if (error.status === 401) {
          errorMessage = 'Credenciales incorrectas. Por favor, verifique su correo y contraseña.';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Compruebe su conexión a internet.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.showAlert('Error de inicio de sesión', errorMessage);
        return throwError(() => error);
      })
    );
  }

  getUser() {
    return this.userSubject.value;
  }

  async getRole() {
    const user = this.getUser();
    console.log('[AuthService] getRole user:', user);
    return user?.rol || null;
  }

  async getHeaders() {
    const token = await this.getToken();
    if (token) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-token': token,
          'Accept': 'application/json'
        })
      };
    }
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  }

  async logout() {
    try {
      this.userSubject.next(null);
      await this.removeToken();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error during logout', error);
    }
  }

  async getCurrentUserId(): Promise<string> {
    const user = this.userSubject.value;
    if (user && user._id) {
      return user._id;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.user && decoded.user._id) {
          return decoded.user._id;
        }
      } catch (error) {
        console.error('Error getting current user ID', error);
      }
    }
    
    throw new Error('No hay usuario autenticado');
  }

  private async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  /**
   * Si hay token, decodifica y setea el usuario en userSubject SIEMPRE
   */
  async ensureUserFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded && decoded.user) {
          this.userSubject.next(decoded.user);
          this.isLoggedInSubject.next(true);
        }
      } catch (e) {
        await this.removeToken();
      }
    } else {
      this.userSubject.next(null);
      this.isLoggedInSubject.next(false);
    }
  }
}
