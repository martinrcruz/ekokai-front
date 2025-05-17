import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';

export interface Vehicle {
  _id?: string;
  brand: string;
  modelo: string;
  matricula: string;
  fuel: string;
  type: string;
  photo?: string;
  lastMaintenance?: Date;
  kilometraje?: number;
  assignedTo?: {
    _id: string;
    name: string;
  };
  status?: string;
  eliminado?: boolean;
  createdDate?: string;
  __v?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VehiculosService extends BaseService {
  private readonly endpoint = '/vehicle';

  constructor(
    http: HttpClient,
    authService: AuthService
  ) {
    super(http, authService);
  }

  getVehicles(): Observable<any> {
    return this.get<any>(this.endpoint).pipe(
      map(response => ({
        ok: true,
        data: response.data.vehicles,
        message: 'Vehículos obtenidos correctamente'
      }))
    );
  }

  createVehicle(data: Partial<Vehicle>): Observable<any> {
    return this.post<any>(`${this.endpoint}/create`, data);
  }

  getVehicleById(id: string): Observable<any> {
    return this.get<any>(`${this.endpoint}/${id}`);
  }

  updateVehicle(data: Partial<Vehicle>): Observable<any> {
    return this.put<any>(`${this.endpoint}/update`, data);
  }

  deleteVehicle(id: string): Observable<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
} 