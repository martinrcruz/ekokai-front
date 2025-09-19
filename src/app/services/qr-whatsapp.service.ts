import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface QRWhatsapp {
  id: string;
  mensaje: string;
  fechaCreacion: string;
  fechaExpiracion: string;
  activo: boolean;
  numeroWhatsapp?: string;
  qrDataUrl?: string;
  nombre: string;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrearQRRequest {
  mensaje: string;
  fechaExpiracion: string;
  nombre: string;
  descripcion?: string;
  numeroWhatsapp?: string;
}

export interface ActualizarQRRequest {
  mensaje?: string;
  fechaExpiracion?: string;
  nombre?: string;
  descripcion?: string;
  numeroWhatsapp?: string;
}

export interface QRWhatsappResponse {
  success: boolean;
  message: string;
  data: QRWhatsapp;
}

export interface QRWhatsappListResponse {
  success: boolean;
  message: string;
  data: QRWhatsapp[];
  total: number;
}

export interface EstadisticasResponse {
  success: boolean;
  message: string;
  data: {
    totalQRs: number;
    qrsActivos: number;
    qrsExpirados: number;
    qrsEsteMes: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class QRWhatsappService {
  private apiUrl = `${environment.apiUrl}/qr-whatsapp`;

  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo código QR de WhatsApp
   * @param qrData Datos del código QR a crear
   * @returns Observable con la respuesta del servidor
   */
  crearQR(qrData: CrearQRRequest): Observable<QRWhatsappResponse> {
    return this.http.post<QRWhatsappResponse>(this.apiUrl, qrData);
  }

  /**
   * Obtiene todos los códigos QR
   * @param filtros Filtros opcionales para la búsqueda
   * @returns Observable con la lista de códigos QR
   */
  obtenerQRs(filtros?: {
    soloActivos?: boolean;
    limit?: number;
    offset?: number;
  }): Observable<QRWhatsappListResponse> {
    let params = new HttpParams();
    
    if (filtros) {
      if (filtros.soloActivos !== undefined) {
        params = params.set('soloActivos', filtros.soloActivos.toString());
      }
      if (filtros.limit) {
        params = params.set('limit', filtros.limit.toString());
      }
      if (filtros.offset) {
        params = params.set('offset', filtros.offset.toString());
      }
    }

    return this.http.get<QRWhatsappListResponse>(this.apiUrl, { params });
  }

  /**
   * Obtiene un código QR por ID
   * @param id ID del código QR
   * @returns Observable con el código QR
   */
  obtenerQRPorId(id: string): Observable<QRWhatsappResponse> {
    return this.http.get<QRWhatsappResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza un código QR
   * @param id ID del código QR
   * @param datosActualizacion Datos a actualizar
   * @returns Observable con el código QR actualizado
   */
  actualizarQR(id: string, datosActualizacion: ActualizarQRRequest): Observable<QRWhatsappResponse> {
    return this.http.put<QRWhatsappResponse>(`${this.apiUrl}/${id}`, datosActualizacion);
  }

  /**
   * Desactiva un código QR
   * @param id ID del código QR
   * @returns Observable con la respuesta del servidor
   */
  desactivarQR(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene estadísticas de códigos QR
   * @returns Observable con las estadísticas
   */
  obtenerEstadisticas(): Observable<EstadisticasResponse> {
    return this.http.get<EstadisticasResponse>(`${this.apiUrl}/estadisticas`);
  }

  /**
   * Limpia códigos QR expirados
   * @returns Observable con la respuesta del servidor
   */
  limpiarQRsExpirados(): Observable<{ success: boolean; message: string; data: { cantidadEliminados: number } }> {
    return this.http.post<{ success: boolean; message: string; data: { cantidadEliminados: number } }>(
      `${this.apiUrl}/limpiar-expirados`,
      {}
    );
  }

  /**
   * Genera el enlace de WhatsApp
   * @param mensaje Mensaje a enviar
   * @param numero Número de WhatsApp (opcional)
   * @returns Enlace de WhatsApp
   */
  generarEnlaceWhatsapp(mensaje: string, numero?: string): string {
    const mensajeCodificado = encodeURIComponent(mensaje);
    // Si no se proporciona número, usar el número del asistente por defecto
    const numeroPorDefecto = '+17017604112';
    const numeroAUsar = numero || numeroPorDefecto;
    const numeroFormateado = numeroAUsar.replace(/\D/g, '');
    return `https://wa.me/${numeroFormateado}?text=${mensajeCodificado}`;
  }

  /**
   * Verifica si un código QR está expirado
   * @param fechaExpiracion Fecha de expiración
   * @returns True si está expirado
   */
  isExpirado(fechaExpiracion: string): boolean {
    return new Date() > new Date(fechaExpiracion);
  }

  /**
   * Formatea la fecha para mostrar
   * @param fecha Fecha a formatear
   * @returns Fecha formateada
   */
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Descarga el código QR como imagen
   * @param qrDataUrl Data URL del código QR
   * @param nombre Nombre del archivo
   */
  descargarQR(qrDataUrl: string, nombre: string): void {
    if (!qrDataUrl) {
      console.error('No hay datos de QR para descargar');
      return;
    }

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qr-whatsapp-${nombre}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
