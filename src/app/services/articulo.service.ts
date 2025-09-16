import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { BaseService } from './base.service';

export interface Articulo {
  _id?: string;
  cantidad: number;
  codigo: string;
  grupo: string;
  familia: string;
  descripcionArticulo: string;
  precioVenta: number;
  createdAt?: Date;
  updatedAt?: Date;
  eliminado?: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ArticulosResponse {
  ok: boolean;
  articulos: Articulo[];
  pagination: PaginationInfo;
}

@Injectable({
  providedIn: 'root'
})
export class ArticuloService extends BaseService {
  private readonly endpoint = '/articulos';

  constructor(
    http: HttpClient,
    authService: AuthService
  ) {
    super(http, authService);
  }

  getArticulos(page: number = 1, limit: number = 100, search: string = '', grupo: string = '', familia: string = ''): Observable<ArticulosResponse> {
    let url = `${this.endpoint}?page=${page}&limit=${limit}`;

    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    if (grupo.trim()) {
      url += `&grupo=${encodeURIComponent(grupo.trim())}`;
    }
    if (familia.trim()) {
      url += `&familia=${encodeURIComponent(familia.trim())}`;
    }

    return this.get<ArticulosResponse>(url);
  }

  createArticulo(data: Partial<Articulo>): Observable<any> {
    return this.post<any>(this.endpoint, data);
  }

  getArticuloById(id: string): Observable<any> {
    return this.get<any>(`${this.endpoint}/${id}`);
  }

  updateArticulo(id: string, data: Partial<Articulo>): Observable<any> {
    return this.put<any>(`${this.endpoint}/${id}`, data);
  }

  deleteArticulo(id: string): Observable<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
} 