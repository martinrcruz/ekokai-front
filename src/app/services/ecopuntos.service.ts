import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
    console.log(`[EcopuntosService] DELETE ecopunto → ${this.apiUrl}/${id}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: (resp) => console.log('[EcopuntosService] DELETE response:', resp),
        error: (err) => console.error('[EcopuntosService] DELETE error:', err)
      }),
      map((response: any) => response.data || response)
    );
  }

  enrolarEncargado(ecopuntoId: string, encargadoId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${ecopuntoId}/enrolar`, {
      encargadoId: encargadoId
    });
  }

  getTotalKgPorId(ecopuntoId: string): Observable<number> {
    const url = `${this.apiUrl}/${ecopuntoId}/total-kg`;
    console.log('[EcopuntosService] GET total-kg by id →', url);
    return this.http.get<any>(url).pipe(
      tap({
        next: (resp) => console.log('[EcopuntosService] total-kg response:', resp),
        error: (err) => console.error('[EcopuntosService] total-kg error:', err)
      }),
      map((response: any) => {
        const value = response?.data?.totalKg ?? response?.totalKg ?? response?.data ?? response;
        if (typeof value === 'number') return value;
        const parsed = Number(value?.totalKg ?? value?.total_kilos ?? value);
        return isNaN(parsed) ? 0 : parsed;
      })
    );
  }

  getTotalKgPorNombre(nombre: string): Observable<number> {
    const url = `${this.apiUrl}/total-kg`;
    console.log('[EcopuntosService] GET total-kg by name →', url, 'nombre=', nombre);
    return this.http.get<any>(url, { params: { nombre } }).pipe(
      tap({
        next: (resp) => console.log('[EcopuntosService] total-kg(nombre) response:', resp),
        error: (err) => console.error('[EcopuntosService] total-kg(nombre) error:', err)
      }),
      map((response: any) => {
        const value = response?.data?.totalKg ?? response?.totalKg ?? response?.data ?? response;
        if (typeof value === 'number') return value;
        const parsed = Number(value?.totalKg ?? value?.total_kilos ?? value);
        return isNaN(parsed) ? 0 : parsed;
      })
    );
  }

  getTotalVecinosPorId(ecopuntoId: string): Observable<number> {
    const url = `${this.apiUrl}/${ecopuntoId}/total-vecinos`;
    console.log('[EcopuntosService] GET total-vecinos by id →', url);
    return this.http.get<any>(url).pipe(
      tap({
        next: (resp) => console.log('[EcopuntosService] total-vecinos response:', resp),
        error: (err) => console.error('[EcopuntosService] total-vecinos error:', err)
      }),
      map((response: any) => {
        const value = response?.data?.totalVecinos ?? response?.totalVecinos ?? response?.data ?? response;
        if (typeof value === 'number') return value;
        const parsed = Number(value?.totalVecinos ?? value);
        return isNaN(parsed) ? 0 : parsed;
      })
    );
  }

  getTotalVecinosPorNombre(nombre: string): Observable<number> {
    const url = `${this.apiUrl}/total-vecinos`;
    console.log('[EcopuntosService] GET total-vecinos by name →', url, 'nombre=', nombre);
    return this.http.get<any>(url, { params: { nombre } }).pipe(
      tap({
        next: (resp) => console.log('[EcopuntosService] total-vecinos(nombre) response:', resp),
        error: (err) => console.error('[EcopuntosService] total-vecinos(nombre) error:', err)
      }),
      map((response: any) => {
        const value = response?.data?.totalVecinos ?? response?.totalVecinos ?? response?.data ?? response;
        if (typeof value === 'number') return value;
        const parsed = Number(value?.totalVecinos ?? value);
        return isNaN(parsed) ? 0 : parsed;
      })
    );
  }

  getKilosMensualesPorId(ecopuntoId: string): Observable<number[]> {
    const url = `${this.apiUrl}/${ecopuntoId}/total-kg-mensual`;
    console.log('[EcopuntosService] GET total-kg-mensual by id →', url);
    return this.http.get<any>(url).pipe(
      tap({
        next: (resp) => console.log('[EcopuntosService] total-kg-mensual(id) response:', resp),
        error: (err) => console.error('[EcopuntosService] total-kg-mensual(id) error:', err)
      }),
      map((response: any) => {
        const raw = response?.data?.series ?? response?.data?.valores ?? response?.data?.meses ?? response?.data ?? response?.series ?? response?.valores ?? response?.meses ?? response;
        const mesesMap: Record<string, number> = {
          enero: 0, ene: 0,
          febrero: 1, feb: 1,
          marzo: 2, mar: 2,
          abril: 3, abr: 3,
          mayo: 4, may: 4,
          junio: 5, jun: 5,
          julio: 6, jul: 6,
          agosto: 7, ago: 7,
          septiembre: 8, sep: 8,
          octubre: 9, oct: 9,
          noviembre: 10, nov: 10,
          diciembre: 11, dic: 11,
        };

        const buildArrayFromObject = (obj: any) => {
          const mapBy = (k: any) => Number(obj[k] ?? 0) || 0;
          const mesesNum1a12 = [1,2,3,4,5,6,7,8,9,10,11,12].map(k => mapBy(String(k)));
          const mesesNum0a11 = [0,1,2,3,4,5,6,7,8,9,10,11].map(k => mapBy(String(k)));
          const mesesEs = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
            .map(k => mapBy(k) || mapBy(k.toUpperCase()) || mapBy({ene:'enero',feb:'febrero',mar:'marzo',abr:'abril',may:'mayo',jun:'junio',jul:'julio',ago:'agosto',sep:'septiembre',oct:'octubre',nov:'noviembre',dic:'diciembre'}[k] as string));
          const candidates = [mesesNum1a12, mesesNum0a11, mesesEs];
          const best = candidates.find(arr => arr.some(v => v > 0)) || mesesNum1a12;
          return best;
        };

        // Array
        if (Array.isArray(raw)) {
          // If items are plain numbers
          if (raw.every((x: any) => typeof x === 'number')) {
            const nums = raw as number[];
            return nums.length === 12
              ? nums
              : new Array(12).fill(0).map((_, i) => (typeof nums[i] === 'number' && !isNaN(nums[i]) ? nums[i] : 0));
          }
          // If items are objects with month + value
          const out = new Array(12).fill(0);
          for (const item of raw as any[]) {
            if (!item || typeof item !== 'object') continue;
            // month index
            let idx = -1;
            const monthNum = item.mes ?? item.month ?? item.mesNumero ?? item.mesIndex ?? item.mes_numero ?? item.mes_index ?? item.monthIndex;
            const monthName = (item.mesNombre ?? item.nombreMes ?? item.monthName ?? item.mes_nombre ?? item.nombre_mes ?? item.month_name)?.toString()?.toLowerCase?.();
            if (typeof monthNum === 'number') {
              idx = monthNum >= 1 && monthNum <= 12 ? monthNum - 1 : (monthNum >= 0 && monthNum <= 11 ? monthNum : -1);
            } else if (typeof monthNum === 'string') {
              const asNum = Number(monthNum);
              if (!isNaN(asNum)) {
                idx = asNum >= 1 && asNum <= 12 ? asNum - 1 : (asNum >= 0 && asNum <= 11 ? asNum : -1);
              }
            }
            if (idx < 0 && monthName && monthName in mesesMap) {
              idx = mesesMap[monthName];
            }
            // Mongo group: {_id:{month:6}, totalKg: 12} o {_id:6, totalKg:12}
            if (idx < 0 && item._id) {
              const m = (typeof item._id === 'object') ? item._id.month : item._id;
              const mNum = Number(m);
              if (!isNaN(mNum)) idx = mNum >= 1 && mNum <= 12 ? mNum - 1 : (mNum >= 0 && mNum <= 11 ? mNum : -1);
            }
            if (idx < 0 || idx > 11) continue;
            // value
            const valueCandidate = item.totalKg ?? item.total_kilos ?? item.kilos ?? item.total ?? item.valor ?? item.value ?? item.kg ?? item.sum;
            const v = Number(valueCandidate);
            out[idx] = isNaN(v) ? 0 : v;
          }
          return out;
        }

        // Object
        if (raw && typeof raw === 'object') {
          return buildArrayFromObject(raw);
        }
        return new Array(12).fill(0);
      })
    );
  }

  getKilosMensualesPorNombre(nombre: string): Observable<number[]> {
    const url = `${this.apiUrl}/total-kg-mensual`;
    console.log('[EcopuntosService] GET total-kg-mensual by name →', url, 'nombre=', nombre);
    return this.http.get<any>(url, { params: { nombre } }).pipe(
      tap({
        next: (resp) => console.log('[EcopuntosService] total-kg-mensual(nombre) response:', resp),
        error: (err) => console.error('[EcopuntosService] total-kg-mensual(nombre) error:', err)
      }),
      map((response: any) => {
        const raw = response?.data?.series ?? response?.data?.valores ?? response?.data?.meses ?? response?.data ?? response?.series ?? response?.valores ?? response?.meses ?? response;
        const mesesMap: Record<string, number> = {
          enero: 0, ene: 0,
          febrero: 1, feb: 1,
          marzo: 2, mar: 2,
          abril: 3, abr: 3,
          mayo: 4, may: 4,
          junio: 5, jun: 5,
          julio: 6, jul: 6,
          agosto: 7, ago: 7,
          septiembre: 8, sep: 8,
          octubre: 9, oct: 9,
          noviembre: 10, nov: 10,
          diciembre: 11, dic: 11,
        };

        const buildArrayFromObject = (obj: any) => {
          const mapBy = (k: any) => Number(obj[k] ?? 0) || 0;
          const mesesNum1a12 = [1,2,3,4,5,6,7,8,9,10,11,12].map(k => mapBy(String(k)));
          const mesesNum0a11 = [0,1,2,3,4,5,6,7,8,9,10,11].map(k => mapBy(String(k)));
          const mesesEs = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
            .map(k => mapBy(k) || mapBy(k.toUpperCase()) || mapBy({ene:'enero',feb:'febrero',mar:'marzo',abr:'abril',may:'mayo',jun:'junio',jul:'julio',ago:'agosto',sep:'septiembre',oct:'octubre',nov:'noviembre',dic:'diciembre'}[k] as string));
          const candidates = [mesesNum1a12, mesesNum0a11, mesesEs];
          const best = candidates.find(arr => arr.some(v => v > 0)) || mesesNum1a12;
          return best;
        };

        if (Array.isArray(raw)) {
          if (raw.every((x: any) => typeof x === 'number')) {
            const nums = raw as number[];
            return nums.length === 12
              ? nums
              : new Array(12).fill(0).map((_, i) => (typeof nums[i] === 'number' && !isNaN(nums[i]) ? nums[i] : 0));
          }
          const out = new Array(12).fill(0);
          for (const item of raw as any[]) {
            if (!item || typeof item !== 'object') continue;
            let idx = -1;
            const monthNum = item.mes ?? item.month ?? item.mesNumero ?? item.mesIndex ?? item.mes_numero ?? item.mes_index ?? item.monthIndex;
            const monthName = (item.mesNombre ?? item.nombreMes ?? item.monthName ?? item.mes_nombre ?? item.nombre_mes ?? item.month_name)?.toString()?.toLowerCase?.();
            if (typeof monthNum === 'number') {
              idx = monthNum >= 1 && monthNum <= 12 ? monthNum - 1 : (monthNum >= 0 && monthNum <= 11 ? monthNum : -1);
            } else if (typeof monthNum === 'string') {
              const asNum = Number(monthNum);
              if (!isNaN(asNum)) {
                idx = asNum >= 1 && asNum <= 12 ? asNum - 1 : (asNum >= 0 && asNum <= 11 ? asNum : -1);
              }
            }
            if (idx < 0 && monthName && monthName in mesesMap) {
              idx = mesesMap[monthName];
            }
            if (idx < 0 && item._id) {
              const m = (typeof item._id === 'object') ? item._id.month : item._id;
              const mNum = Number(m);
              if (!isNaN(mNum)) idx = mNum >= 1 && mNum <= 12 ? mNum - 1 : (mNum >= 0 && mNum <= 11 ? mNum : -1);
            }
            if (idx < 0 || idx > 11) continue;
            const valueCandidate = item.totalKg ?? item.total_kilos ?? item.kilos ?? item.total ?? item.valor ?? item.value ?? item.kg ?? item.sum;
            const v = Number(valueCandidate);
            out[idx] = isNaN(v) ? 0 : v;
          }
          return out;
        }

        if (raw && typeof raw === 'object') {
          return buildArrayFromObject(raw);
        }
        return new Array(12).fill(0);
      })
    );
  }

  getEntregasDetallePorId(ecopuntoId: string, limit: number = 10): Observable<any[]> {
    const url = `${this.apiUrl}/${ecopuntoId}/entregas-detalle`;
    console.log('[EcopuntosService] GET entregas-detalle by id →', url, 'limit=', limit);
    return this.http.get<any>(url, { params: { limit } as any }).pipe(
      tap({
        next: (resp) => console.log('[EcopuntosService] entregas-detalle(id) response:', resp),
        error: (err) => console.error('[EcopuntosService] entregas-detalle(id) error:', err)
      }),
      map((response: any) => this.normalizeEntregasDetalle(response))
    );
  }

  getEntregasDetallePorNombre(nombre: string, limit: number = 10): Observable<any[]> {
    const url = `${this.apiUrl}/entregas-detalle`;
    console.log('[EcopuntosService] GET entregas-detalle by name →', url, 'nombre=', nombre, 'limit=', limit);
    return this.http.get<any>(url, { params: { nombre, limit } as any }).pipe(
      tap({
        next: (resp) => console.log('[EcopuntosService] entregas-detalle(nombre) response:', resp),
        error: (err) => console.error('[EcopuntosService] entregas-detalle(nombre) error:', err)
      }),
      map((response: any) => this.normalizeEntregasDetalle(response))
    );
  }

  private normalizeEntregasDetalle(response: any): any[] {
    const raw = response?.data?.entregas ?? response?.entregas ?? response?.data ?? response;
    const arr = Array.isArray(raw) ? raw : [];

    const toDate = (v: any): Date => {
      if (!v) return new Date(0);
      if (v instanceof Date) return v;
      const n = Number(v);
      if (!isNaN(n)) return new Date(n);
      const d = new Date(v);
      return isNaN(d.getTime()) ? new Date(0) : d;
    };

    const getNombre = (o: any): string => {
      const vecino = o?.vecino || o?.usuario || o?.user || {};
      const nombreDirecto = o?.vecinoNombre || o?.nombreVecino || o?.nombre || '';
      const nombre = vecino?.nombre || vecino?.firstName || '';
      const apellido = vecino?.apellido || vecino?.lastName || '';
      const joined = `${(nombre || '').trim()} ${(apellido || '').trim()}`.trim();
      return (nombreDirecto || joined || 'Vecino');
    };

    const getKilos = (o: any): number => {
      const val = o?.kilos ?? o?.peso ?? o?.pesoKg ?? o?.totalKg ?? o?.total_kilos ?? o?.kg ?? o?.valor ?? o?.value ?? 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    };

    const getFecha = (o: any): Date => {
      const v = o?.fecha || o?.fechaEntrega || o?.fechaRegistro || o?.createdAt || o?.timestamp || o?.hora || o?.datetime;
      // Caso agregación: si viene separado fecha y hora
      if (!v && o?.dia && o?.mes && o?.anio) {
        const iso = `${o.anio}-${String(o.mes).padStart(2, '0')}-${String(o.dia).padStart(2, '0')}T${(o.hora || '00:00')}:00`;
        return toDate(iso);
      }
      return toDate(v);
    };

    const normalized = arr.map((o: any) => ({
      fecha: getFecha(o),
      vecinoNombre: getNombre(o),
      kilos: getKilos(o)
    }));

    normalized.sort((a, b) => (b.fecha?.getTime?.() || 0) - (a.fecha?.getTime?.() || 0));
    return normalized;
  }

  // === Metas mensuales ===
  getMetaMensualPorId(ecopuntoId: string, year: number, month: number): Observable<{ objetivoKg: number; year: number; month: number }> {
    const url = `${this.apiUrl}/${ecopuntoId}/meta-mensual`;
    console.log('[EcopuntosService] GET meta-mensual by id →', url, 'year=', year, 'month=', month);
    return this.http.get<any>(url, { params: { year, month } as any }).pipe(
      tap({
        next: (resp) => console.log('[EcopuntosService] meta-mensual(id) response:', resp),
        error: (err) => console.error('[EcopuntosService] meta-mensual(id) error:', err)
      }),
      map((response: any) => {
        const meta = response?.meta || response?.data?.meta || response?.data || response;
        const objetivoKg = Number(meta?.objetivoKg ?? meta?.objetivo ?? meta?.targetKg ?? meta?.obj ?? 0);
        const y = Number(meta?.year ?? year);
        const m = Number(meta?.month ?? month);
        return { objetivoKg: isNaN(objetivoKg) ? 0 : objetivoKg, year: y, month: m };
      })
    );
  }

  upsertMetaMensualPorId(ecopuntoId: string, payload: { year: number; month: number; objetivoKg: number }): Observable<any> {
    const url = `${this.apiUrl}/${ecopuntoId}/meta-mensual`;
    console.log('[EcopuntosService] PUT meta-mensual by id →', url, payload);
    return this.http.put<any>(url, payload).pipe(
      tap({
        next: (resp) => console.log('[EcopuntosService] meta-mensual PUT response:', resp),
        error: (err) => console.error('[EcopuntosService] meta-mensual PUT error:', err)
      })
    );
  }

  deleteMetaMensualPorId(ecopuntoId: string, year: number, month: number): Observable<any> {
    const url = `${this.apiUrl}/${ecopuntoId}/meta-mensual`;
    console.log('[EcopuntosService] DELETE meta-mensual by id →', url, 'year=', year, 'month=', month);
    return this.http.delete<any>(url, { params: { year, month } as any }).pipe(
      tap({
        next: (resp) => console.log('[EcopuntosService] meta-mensual DELETE response:', resp),
        error: (err) => console.error('[EcopuntosService] meta-mensual DELETE error:', err)
      })
    );
  }
} 