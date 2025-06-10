import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {
  private readonly endpoint = '/customers';

  /**
   * Obtener todos los clientes (GET /customers)
   */
  getCustomers(): Observable<any> {
    return this.get<any>(this.endpoint);
  }

  /**
   * Crear cliente (POST /customers/create)
   */
  createCustomer(data: any): Observable<any> {
    return this.post<any>(`${this.endpoint}/create`, data);
  }

  /**
   * Obtener cliente por ID (GET /customers/:id)
   */
  getCustomerById(id: string): Observable<any> {
    return this.get<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Actualizar cliente (PUT /customers/:id)
   */
  updateCustomer(id: string, data: any): Observable<any> {
    return this.put<any>(`${this.endpoint}/${id}`, data);
  }

  /**
   * Eliminar cliente (DELETE /customers/:id)
   */
  deleteCustomer(id: string): Observable<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}
