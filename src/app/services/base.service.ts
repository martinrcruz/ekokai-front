import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected baseUrl = environment.apiUrl;

  constructor(
    protected http: HttpClient,
    protected authService: AuthService
  ) {}

  protected async getHeaders(): Promise<{ headers: HttpHeaders }> {
    const token = await this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': token || '',
        'Accept': 'application/json'
      })
    };
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la petición:', error);

    if (error.status === 429) {
      return throwError(() => 'Demasiadas peticiones. Por favor, intente nuevamente en unos momentos.');
    }

    if (error.status === 401) {
      this.authService.logout();
      return throwError(() => 'Sesión expirada. Por favor, inicie sesión nuevamente.');
    }

    if (error.status === 403) {
      return throwError(() => 'No tiene permisos para realizar esta acción.');
    }

    if (error.status === 500) {
      return throwError(() => 'Error interno del servidor. Por favor, intente nuevamente más tarde.');
    }

    return throwError(() => error.error?.message || 'Error en el servidor');
  }

  protected get<T>(url: string): Observable<T> {
    return from(this.getHeaders()).pipe(
      switchMap(opts => 
        this.http.get<T>(`${this.baseUrl}${url}`, opts)
      ),
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Error en la petición');
      }),
      catchError(this.handleError.bind(this))
    );
  }

  protected post<T>(url: string, data: any): Observable<T> {
    return from(this.getHeaders()).pipe(
      switchMap(opts => 
        this.http.post<T>(`${this.baseUrl}${url}`, data, opts)
      ),
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Error en la petición');
      }),
      catchError(this.handleError.bind(this))
    );
  }

  protected put<T>(url: string, data: any): Observable<T> {
    return from(this.getHeaders()).pipe(
      switchMap(opts => 
        this.http.put<T>(`${this.baseUrl}${url}`, data, opts)
      ),
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Error en la petición');
      }),
      catchError(this.handleError.bind(this))
    );
  }

  protected delete<T>(url: string): Observable<T> {
    return from(this.getHeaders()).pipe(
      switchMap(opts => 
        this.http.delete<T>(`${this.baseUrl}${url}`, opts)
      ),
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Error en la petición');
      }),
      catchError(this.handleError.bind(this))
    );
  }
} 