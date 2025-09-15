import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuariosService {

  private apiUrl = environment.apiUrl + '/usuarios';

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
    console.log('[UsuariosService] Obteniendo usuario por ID:', id);
    console.log('[UsuariosService] URL:', `${this.apiUrl}/${id}`);
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

  // ✅ Cambiar estado de usuario (activar/desactivar)
  cambiarEstadoUsuario(id: string, activo: boolean): Observable<any> {
    const url = `${this.apiUrl}/${id}/estado`;
    const data = { activo };
    console.log('[UsuariosService] Cambiando estado de usuario:', { id, activo, url, data });
    return this.http.patch<any>(url, data);
  }

  // ✅ Obtener historial completo de un usuario (entregas + canjes)
  obtenerHistorialUsuario(usuarioId: string): Observable<any> {
    console.log('[UsuariosService] Obteniendo historial para usuario:', usuarioId);
    console.log('[UsuariosService] URL:', `${this.apiUrl}/${usuarioId}/historial`);
    return this.http.get<any>(`${this.apiUrl}/${usuarioId}/historial`);
  }

  // ✅ Obtener solo historial de entregas de reciclaje
  obtenerHistorialEntregas(usuarioId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${usuarioId}/historial`).pipe(
      map(response => response.entregas || [])
    );
  }

  // ✅ Obtener solo historial de canjes de premios
  obtenerHistorialCanjes(usuarioId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${usuarioId}/historial`).pipe(
      map(response => response.canjes || [])
    );
  }

  // ✅ Buscar vecinos por criterios
  buscarVecinos(criterios: { dni?: string, telefono?: string, nombre?: string }): Observable<any[]> {
    const params = new URLSearchParams();
    if (criterios.dni) params.append('dni', criterios.dni);
    if (criterios.telefono) params.append('telefono', criterios.telefono);
    if (criterios.nombre) params.append('nombre', criterios.nombre);
    
    return this.http.get<any[]>(`${this.apiUrl}/buscar-vecinos?${params.toString()}`);
  }

  // ✅ Obtener solo usuarios vecinos
  getVecinos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vecinos`);
  }

  // ✅ Obtener usuarios que no son vecinos (encargados y administradores)
  getUsuariosNoVecinos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/no-vecinos`);
  }
}
