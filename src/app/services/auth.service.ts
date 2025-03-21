import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/user`;
  private _storage: Storage | null = null;

  // BehaviorSubject para indicar si el usuario está logueado
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router
  ) {
    this.init();
  }

  /**
   * Se llama al crear el servicio.
   * Carga (o crea) la instancia de Storage.
   * Revisa si existe un token en Storage y si es así, actualiza el estado de login.
   */
  async init() {
    const store = await this.storage.create();
    this._storage = store;
    const token = await this._storage?.get('token');
    console.log(" token 1 ")
    if (token) {
      console.log(" token 2 ")
      // decodificar
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000); // en segundos
      console.log(" token 3 ")

      if (decoded.exp && decoded.exp > now) {
        console.log(" token 4 ")
        this.isLoggedInSubject.next(true);
        this.router.navigateByUrl('/calendario');
      } else {
        console.log(" token 5 ")
        // Token expirado
        await this.removeToken();
      }
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  /**
   * Emite el estado actual de "¿Está logueado?" para que
   * AuthGuard y otros componentes puedan suscribirse.
   */
  isLoggedIn() {
    return this.isLoggedInSubject.asObservable();
  }

  /**
   * Guarda el token y actualiza el BehaviorSubject
   */
  async setToken(token: string) {
    await this._storage?.set('token', token);
    this.isLoggedInSubject.next(true);
  }

  /**
   * Obtiene el token almacenado
   */
  async getToken(): Promise<string | null> {
    return await this._storage?.get('token');
  }

  /**
   * Elimina el token y emite false en isLoggedInSubject
   */
  async removeToken() {
    await this._storage?.remove('token');
    this.isLoggedInSubject.next(false);
  }

  // ---------------------------------
  // EJEMPLOS DE MÉTODOS DE AUTENTICACIÓN
  // ---------------------------------

  // Registro
  register(userData: any) {
    return this.http.post(`${this.baseUrl}/create`, userData);
  }

  // Login
  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/login`, credentials)
      .pipe(
        map(async (resp: any) => {
          if (resp.ok && resp.tokenU) {
            await this.setToken(resp.tokenU);
          }
          return resp;
        })
      );
  }

  /**
   * Retorna cabeceras con x-token para peticiones protegidas
   */
  async getHeaders() {
    const token = await this.getToken();
    if (token) {
      return {
        headers: new HttpHeaders({
          'x-token': token
        })
      };
    }
    return {};
  }

  // Logout
  async logout() {
    await this.removeToken();
  }
}
