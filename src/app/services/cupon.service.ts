import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cupon } from '../models/cupon.model';

@Injectable({ providedIn: 'root' })
export class CuponService {
  private apiUrl = environment.apiUrl + '/cupones';

  constructor(private http: HttpClient) {}

  listar(): Observable<Cupon[]> {
    return this.http.get<Cupon[]>(this.apiUrl);
  }

  crear(cupon: Cupon): Observable<Cupon> {
    return this.http.post<Cupon>(this.apiUrl, cupon);
  }

  actualizar(id: string, cupon: Cupon): Observable<Cupon> {
    return this.http.put<Cupon>(`${this.apiUrl}/${id}`, cupon);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 