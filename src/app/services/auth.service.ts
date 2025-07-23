import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of, throwError, from } from 'rxjs';
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
      
      if (!token) {
        console.log('[AuthService] No token found');
        this.isLoggedInSubject.next(false);
        this.userSubject.next(null);
        return;
      }

      // Verificar que el token no esté vacío
      if (token.trim() === '') {
        console.log('[AuthService] Empty token found');
        await this.removeToken();
        return;
      }

      const decoded: any = jwtDecode(token);
      console.log('[AuthService] checkToken decoded:', decoded);
      
      if (!decoded) {
        console.log('[AuthService] Invalid token structure');
        await this.removeToken();
        return;
      }

      const now = Math.floor(Date.now() / 1000); // en segundos
      
      // Verificar si el token ha expirado
      if (decoded.exp && decoded.exp > now) {
        console.log('[AuthService] Token is valid');
        this.userSubject.next(decoded);
        this.isLoggedInSubject.next(true);
      } else {
        console.log('[AuthService] Token expired');
        await this.removeToken();
      }
    } catch (error) {
      console.error('[AuthService] Error checking token:', error);
      await this.removeToken();
    }
  }

  isLoggedIn() {
    return this.isLoggedInSubject.asObservable();
  }

  /**
   * Método síncrono para verificar si el usuario está logueado
   */
  isLoggedInSync(): boolean {
    return this.isLoggedInSubject.value;
  }

  async setToken(token: string) {
    try {
      console.log('[AuthService] setToken - Starting with token:', token ? 'exists' : 'null');
      
      if (!token) {
        throw new Error('Token is empty');
      }

      // Verificar que el token no esté vacío
      if (token.trim() === '') {
        throw new Error('Token is empty string');
      }

      localStorage.setItem('token', token);
      console.log('[AuthService] setToken - Token saved to localStorage');
      
      const decoded: any = jwtDecode(token);
      console.log('[AuthService] setToken - Token decoded:', decoded);
      
      if (!decoded) {
        throw new Error('Invalid token structure');
      }

      this.userSubject.next(decoded);
      this.isLoggedInSubject.next(true);
      console.log('[AuthService] setToken - User and login state updated');
      
      return true;
    } catch (error) {
      console.error('[AuthService] Error setting token:', error);
      await this.removeToken();
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
      // Solo actualizar si el estado actual no es null
      if (this.userSubject.value !== null) {
        this.userSubject.next(null);
      }
      if (this.isLoggedInSubject.value !== false) {
        this.isLoggedInSubject.next(false);
      }
    } catch (error) {
      console.error('[AuthService] Error removing token:', error);
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
    console.log('[AuthService] login - Starting login process');
    
    return from(this.removeToken()).pipe(
      switchMap(() => {
        console.log('[AuthService] login - Token removed, making HTTP request');
        return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login`, credentials, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        });
      }),
      tap((response: any) => {
        console.log('[AuthService] login response:', response);
        // El backend devuelve {token, usuario} directamente
        if (response?.token) {
          console.log('[AuthService] login - Setting token and user data');
          this.setToken(response.token);
          if (response.usuario) {
            this.userSubject.next(response.usuario);
          }
        }
      }),
      catchError(error => {
        console.error('[AuthService] Error en login:', error);
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
    try {
      const token = localStorage.getItem('token');
      console.log('[AuthService] ensureUserFromToken - token:', token ? 'exists' : 'null');
      
      if (!token) {
        console.log('[AuthService] ensureUserFromToken - No token found');
        // Solo actualizar si el usuario actual no es null
        if (this.userSubject.value !== null) {
          this.userSubject.next(null);
          this.isLoggedInSubject.next(false);
        }
        return;
      }

      // Verificar que el token no esté vacío
      if (token.trim() === '') {
        console.log('[AuthService] ensureUserFromToken - Empty token found');
        await this.removeToken();
        return;
      }

      const decoded: any = jwtDecode(token);
      console.log('[AuthService] ensureUserFromToken - decoded:', decoded);
      
      if (!decoded) {
        console.log('[AuthService] ensureUserFromToken - Invalid token structure');
        await this.removeToken();
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      
      // Verificar si el token no ha expirado
      if (decoded.exp && decoded.exp > now) {
        console.log('[AuthService] ensureUserFromToken - Token is valid');
        
        // Crear el objeto usuario
        let userObject;
        if (decoded.user) {
          userObject = decoded.user;
          console.log('[AuthService] ensureUserFromToken - Using decoded.user');
        } else if (decoded.id) {
          userObject = {
            _id: decoded.id,
            email: decoded.email,
            rol: decoded.rol
          };
          console.log('[AuthService] ensureUserFromToken - Created user object from decoded.id');
        } else {
          userObject = decoded;
          console.log('[AuthService] ensureUserFromToken - Using full decoded as user');
        }
        
        // Solo actualizar si el usuario cambió
        const currentUser = this.userSubject.value;
        const userChanged = !currentUser || 
                          currentUser._id !== userObject._id || 
                          currentUser.rol !== userObject.rol;
        
        if (userChanged) {
          console.log('[AuthService] ensureUserFromToken - User changed, updating subject');
          this.userSubject.next(userObject);
          this.isLoggedInSubject.next(true);
        } else {
          console.log('[AuthService] ensureUserFromToken - User unchanged, skipping update');
        }
      } else {
        console.log('[AuthService] ensureUserFromToken - Token expired');
        await this.removeToken();
      }
    } catch (error) {
      console.error('[AuthService] Error en ensureUserFromToken:', error);
      await this.removeToken();
    }
  }
}
