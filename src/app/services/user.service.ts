import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response.model';

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
  createUser(user: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/create`, user);
  }

  /**
   * Actualiza un usuario existente.
   * Se envía el token en las cabeceras para la verificación.
   */
  async updateUser(data: User): Promise<Observable<ApiResponse<User>>> {
    const opts = await this.getHeaders();
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/update`, data, opts).pipe(
      map(response => {
        if (response.ok && response.data) {
          return response;
        }
        throw new Error(response.error || 'Error al actualizar usuario');
      })
    );
  }

  /**
   * Obtiene un usuario por su ID.
   */
  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (response.ok && response.data) {
          return response;
        }
        throw new Error(response.error || 'Error al obtener usuario');
      })
    );
  }

  /**
   * Obtiene el usuario logueado (según el token enviado).
   */
  getLoggedUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}`).pipe(
      map(response => {
        if (response.ok && response.data) {
          return response;
        }
        throw new Error(response.error || 'Error al obtener usuario logueado');
      })
    );
  }

  /**
   * Obtiene la lista de todos los usuarios.
   */
  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/list`).pipe(
      map(response => {
        if (response.ok && response.data) {
          return response;
        }
        throw new Error(response.error || 'Error al obtener usuarios');
      })
    );
  }

  /**
   * Obtiene los usuarios cuyo role es "worker".
   */
  getWorkers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/worker`).pipe(
      map(response => {
        if (response.ok && response.data) {
          return response;
        }
        throw new Error(response.error || 'Error al obtener trabajadores');
      })
    );
  }
}
