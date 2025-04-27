import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private apiUrl = `${environment.apiUrl}/contract`;

  constructor(private http: HttpClient) { }

  getContracts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getContractById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createContract(contract: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, contract);
  }

  updateContract(id: string, contract: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, contract);
  }

  deleteContract(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
