import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response.model';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  code?: string;
  phone?: string;
  role?: string;
  junior?: boolean;
}
// src/app/services/user.service.ts
export interface ApiEnvelope<T> { ok: boolean; data?: T; error?: string; }

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  /** helpers */
  private async opts() { return this.auth.getHeaders(); }

  createUser(u: User) {
    return this.http.post<any>(`${this.baseUrl}/create`, u);
  }

  async updateUser(u: User) {
    const opts = await this.opts();
    return this.http.put<ApiEnvelope<{user: User; token: string}>>(`${this.baseUrl}/update`, u, opts);
  }

  getUserById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  getLoggedUser() {
    return this.http.get<any>(this.baseUrl);
  }

  getAllUsers() {
    return this.http.get<any>(`${this.baseUrl}/list`);
  }

  getWorkers() {
    return this.http.get<any>(`${this.baseUrl}/worker`);
  }

  /** NEW */
  async deleteUser(id: string) {
    const opts = await this.opts();
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`, opts);
  }
}

