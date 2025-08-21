import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CanjeService {
  private apiUrl = environment.apiUrl + '/entregas';

  constructor(private http: HttpClient) {}

  registrarCanje(canje: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, canje);
  }
} 