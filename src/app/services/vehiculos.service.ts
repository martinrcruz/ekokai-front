import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { BaseService } from './base.service';

export interface Vehicle {
  _id?: string;
  name: string;
  plate: string;
  type: string;
  state: string;
  eliminado?: boolean;
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

  getVehicles(): Observable<Vehicle[]> {
    return this.get<Vehicle[]>(this.endpoint);
  }

  createVehicle(data: Partial<Vehicle>): Observable<Vehicle> {
    return this.post<Vehicle>(`${this.endpoint}/create`, data);
  }

  getVehicleById(id: string): Observable<Vehicle> {
    return this.get<Vehicle>(`${this.endpoint}/${id}`);
  }

  updateVehicle(data: Partial<Vehicle>): Observable<Vehicle> {
    return this.put<Vehicle>(`${this.endpoint}/update`, data);
  }

  deleteVehicle(id: string): Observable<Vehicle> {
    return this.delete<Vehicle>(`${this.endpoint}/${id}`);
  }
} 