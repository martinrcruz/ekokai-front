import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { BaseService } from './base.service';

export interface Material {
  _id?: string;
  name: string;
  description: string;
  type: string;
  state: string;
  eliminado?: boolean;
}

export interface MaterialParte {
  _id?: string;
  material: Material;
  cantidad: number;
  ruta: string;
  eliminado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialesService extends BaseService {
  private readonly endpoint = '/material';
  private readonly materialParteEndpoint = '/materialparte';

  constructor(
    http: HttpClient,
    authService: AuthService
  ) {
    super(http, authService);
  }

  getMaterials(): Observable<Material[]> {
    return this.get<Material[]>(this.endpoint);
  }

  createMaterial(data: Partial<Material>): Observable<Material> {
    return this.post<Material>(`${this.endpoint}/create`, data);
  }

  getMaterialById(id: string): Observable<Material> {
    return this.get<Material>(`${this.endpoint}/${id}`);
  }

  updateMaterial(data: Partial<Material>): Observable<Material> {
    return this.put<Material>(`${this.endpoint}/update`, data);
  }

  deleteMaterial(id: string): Observable<Material> {
    return this.delete<Material>(`${this.endpoint}/${id}`);
  }

  getMaterialPartes(): Observable<MaterialParte[]> {
    return this.get<MaterialParte[]>(this.materialParteEndpoint);
  }

  createMaterialParte(data: Partial<MaterialParte>): Observable<MaterialParte> {
    return this.post<MaterialParte>(`${this.materialParteEndpoint}/create`, data);
  }

  getMaterialParteByRuta(rutaId: string): Observable<MaterialParte[]> {
    return this.get<MaterialParte[]>(`${this.materialParteEndpoint}/${rutaId}`);
  }
} 