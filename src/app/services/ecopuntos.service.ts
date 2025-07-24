import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EcopuntosService {
  private apiUrl = environment.apiUrl + '/ecopuntos';

  constructor(private http: HttpClient) {}

  getEcopuntos(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => response.data || [])
    );
  }

  crearEcopunto(ecopunto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ecopunto).pipe(
      map((response: any) => response.data || response)
    );
  }

  actualizarEcopunto(id: string, ecopunto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, ecopunto).pipe(
      map((response: any) => response.data || response)
    );
  }

  eliminarEcopunto(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => response.data || response)
    );
  }

  enrolarEncargado(ecopuntoId: string, encargadoId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${ecopuntoId}/enrolar`, {
      encargadoId: encargadoId
    });
  }
} 