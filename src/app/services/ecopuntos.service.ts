import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EcopuntosService {
  private apiUrl = 'http://localhost:3000/ecopuntos';

  constructor(private http: HttpClient) {}

  getEcopuntos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearEcopunto(ecopunto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ecopunto);
  }

  actualizarEcopunto(id: number, ecopunto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, ecopunto);
  }

  eliminarEcopunto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  enrolarEncargado(ecopuntoId: string, encargadoId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${ecopuntoId}/enrolar`, {
      encargadoId: encargadoId
    });
  }
} 