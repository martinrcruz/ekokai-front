import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEncargados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(usuarios => usuarios.filter(usuario => usuario.rol === 'encargado'))
    );
  }

  registrarEncargado(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar-encargado`, data);
  }

  registrarVecino(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, data);
  }

  // ✅ Obtener un usuario por ID
  obtenerUsuario(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // ✅ Actualizar un usuario por ID
  actualizarUsuario(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // ✅ Eliminar un usuario por ID
  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
