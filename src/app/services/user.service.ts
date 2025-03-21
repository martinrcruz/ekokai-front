import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  code?: string;
  phone?: string;
  role?: string;
  junior?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Ajusta la URL base a la de tu API
  private baseUrl = environment.apiUrl + '/user';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private async getHeaders() {
    return await this.authService.getHeaders();
  }

  /**
   * Crea un nuevo usuario.
   */
  createUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, user);
  }

  /**
   * Actualiza un usuario existente.
   * Se envía el token en las cabeceras para la verificación.
   */
  async updateUser(data: User){
    const opts = await this.getHeaders();
    return this.http.put(`${this.baseUrl}/update`, data, opts);
  }

  /**
   * Obtiene un usuario por su ID.
   */
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtiene el usuario logueado (según el token enviado).
   */
  getLoggedUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get(`${this.baseUrl}`, { headers });
  }

  /**
   * Obtiene la lista de todos los usuarios.
   */
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`);
  }

  /**
   * Obtiene los usuarios cuyo role es "worker".
   */
  getWorkers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/worker`);
  }
}
