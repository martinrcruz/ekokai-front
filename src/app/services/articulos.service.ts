import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Articulo } from '../models/articulo.model';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getArticulos(): Observable<ApiResponse<Articulo[]>> {
    return this.http.get<ApiResponse<Articulo[]>>(`${this.baseUrl}/articulos`);
  }

  getArticuloById(id: string): Observable<ApiResponse<Articulo>> {
    return this.http.get<ApiResponse<Articulo>>(`${this.baseUrl}/articulos/${id}`);
  }

  createArticulo(articulo: Articulo): Observable<ApiResponse<Articulo>> {
    return this.http.post<ApiResponse<Articulo>>(`${this.baseUrl}/articulos`, articulo);
  }

  updateArticulo(id: string, articulo: Articulo): Observable<ApiResponse<Articulo>> {
    return this.http.put<ApiResponse<Articulo>>(`${this.baseUrl}/articulos/${id}`, articulo);
  }

  deleteArticulo(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/articulos/${id}`);
  }
} 