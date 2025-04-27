import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';

export interface Zona {
  _id: string;
  name: string;
  description?: string;
}

export interface ZonasResponse {
  zones: Zona[];
}

@Injectable({
  providedIn: 'root'
})
export class ZonasService {
  private apiUrl = `${environment.apiUrl}/zone`;

  constructor(private http: HttpClient) { }

  getZones(): Observable<ApiResponse<ZonasResponse>> {
    return this.http.get<ApiResponse<ZonasResponse>>(this.apiUrl);
  }

  getZoneById(id: string): Observable<ApiResponse<Zona>> {
    return this.http.get<ApiResponse<Zona>>(`${this.apiUrl}/${id}`);
  }

  createZone(zone: Partial<Zona>): Observable<ApiResponse<Zona>> {
    return this.http.post<ApiResponse<Zona>>(`${this.apiUrl}/create`, zone);
  }

  updateZone(id: string, zone: Partial<Zona>): Observable<ApiResponse<Zona>> {
    return this.http.put<ApiResponse<Zona>>(`${this.apiUrl}/update`, { ...zone, _id: id });
  }

  deleteZone(id: string): Observable<ApiResponse<Zona>> {
    return this.http.delete<ApiResponse<Zona>>(`${this.apiUrl}/${id}`);
  }
} 