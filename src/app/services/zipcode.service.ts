import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';

export interface Zona {
  _id: string;
  name: string;
  description?: string;
}

export interface ZonasResponse {
  zones: Zona[];
}

@Injectable({ providedIn: 'root' })
export class ZipcodesService {
  private apiUrl = `${environment.apiUrl}/zipcode`;

  constructor(private http: HttpClient) {}

  getZipcodes() {
    return this.http.get<any>(this.apiUrl);
  }

  createZipcode(payload: { codezip: string; name?: string }) {
    return this.http.post<any>(`${this.apiUrl}/create`, payload);
  }
}
