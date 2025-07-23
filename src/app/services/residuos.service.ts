import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ResiduosService {

  private apiUrl = environment.apiUrl + '/tipos-residuo';

  constructor(private http: HttpClient) {}

  getResiduos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  actualizarResiduo(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  crearResiduo(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  eliminarResiduo(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
} 