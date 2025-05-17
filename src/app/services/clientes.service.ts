import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';

export interface Cliente {
  _id: string;
  name: string;
  email: string;
  nifCif: string;
  phone: string;
  address: string;
  zone?: {
    _id: string;
    name: string;
  };
  tipo?: string;
  code?: string;
  contactName?: string;
  MI?: number;
  photo?: string;
}

export interface ClientesResponse {
  customers: Cliente[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<ApiResponse<ClientesResponse>> {
    return this.http.get<ApiResponse<ClientesResponse>>(this.apiUrl);
  }

  getCustomerById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: any): Observable<any> {
    return this.http.post<ApiResponse<Cliente>>(`${this.apiUrl}/create`, customer);
  }

  updateCustomer(id: string, customer: any): Observable<any> {
    return this.http.put<ApiResponse<Cliente>>(`${this.apiUrl}/update`, { ...customer, _id: id });
  }

  deleteCustomer(id: string): Observable<ApiResponse<Cliente>> {
    return this.http.delete<ApiResponse<Cliente>>(`${this.apiUrl}/${id}`);
  }
} 