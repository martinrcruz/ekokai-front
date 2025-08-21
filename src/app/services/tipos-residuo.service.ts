import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TiposResiduoService {
  private apiUrl = environment.apiUrl + '/tipos-residuo';

  constructor(private http: HttpClient) {}

  getTiposResiduo(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTipoResiduo(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearTipoResiduo(tipo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tipo);
  }

  actualizarTipoResiduo(id: string, tipo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tipo);
  }

  eliminarTipoResiduo(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
