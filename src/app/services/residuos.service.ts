import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ResiduosService {

  private apiUrl = environment.apiUrl + '/tipos-residuo';

  constructor(private http: HttpClient) {}

  getResiduos(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => {
        console.log('📋 [SERVICE] Respuesta del backend:', response);
        // Extraer el array de la respuesta estructurada
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        } else if (Array.isArray(response)) {
          // Fallback: si la respuesta es directamente un array
          return response;
        } else {
          console.error('❌ [SERVICE] Formato de respuesta inesperado:', response);
          return [];
        }
      })
    );
  }

  actualizarResiduo(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
      map((response: any) => {
        console.log('✏️ [SERVICE] Respuesta de actualización:', response);
        return response;
      })
    );
  }

  crearResiduo(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      map((response: any) => {
        console.log('➕ [SERVICE] Respuesta de creación:', response);
        return response;
      })
    );
  }

  eliminarResiduo(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => {
        console.log('🗑️ [SERVICE] Respuesta de eliminación:', response);
        return response;
      })
    );
  }
} 