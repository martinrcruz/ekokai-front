import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

/**
 * ApiService
 * Centraliza los métodos para consumir el backend (Endpoints distintos a auth).
 * Utiliza authService para obtener el token y adjuntarlo a las peticiones que lo requieran.
 */

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Metodo auxiliar para adjuntar cabeceras con el x-token
   */
  private async getHeaders() {
    return await this.authService.getHeaders();
  }

  // -----------------------------------------------------
  // USERS (excepto login y registro, que van en auth.service)
  // -----------------------------------------------------

  /**
   * Obtener lista completa de usuarios (GET /user/list)
   */
  async getUsers() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/user/list`, opts);
  }

  /**
   * Obtener lista de usuarios con role: worker (GET /user/worker)
   */
  async getWorkers() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/user/worker`, opts);
  }

  /**
   * Obtener datos de un usuario por ID (GET /user/:id)
   */
  async getUserById(id: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/user/${id}`, opts);
  }

  /**
   * Actualizar un usuario (PUT /user/update). 
   * Nota: En tu backend, la ruta es '/update', y usa verificarToken. 
   * Sin embargo, en el código que muestras está implementado con app.put('/update', ...)
   * El body debe incluir los datos a actualizar.
   * 
   * Ojo: tu backend en userRoutes utiliza `userRoutes.put('/update', verificarToken, ...)`.
   * Pero en el snippet se ve que la implementación final está en userRoutes con "userRoutes.post('/update')"? 
   * Ajusta según tu implementación real. Aquí se asume PUT.
   */
  async updateUser(data: any) {
    const opts = await this.getHeaders();
    return this.http.put(`${this.baseUrl}/user/update`, data, opts);
  }

  /**
   * Obtener datos de usuario logueado (GET /user), 
   * que retorna la info del token. (Opcional, si tu backend lo implementa)
   */
  async getMyUser() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/user`, opts);
  }

  // -----------------------------------------------------
  // VEHICLES
  // -----------------------------------------------------

  /**
   * Obtener todos los vehículos (GET /vehicle)
   */
  async getVehicles() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/vehicle`, opts);
  }

  /**
   * Crear vehículo (POST /vehicle/create)
   */
  async createVehicle(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/vehicle/create`, data, opts);
  }

  /**
   * Obtener vehículo por ID (GET /vehicle/:id)
   */
  async getVehicleById(id: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/vehicle/${id}`, opts);
  }

  /**
   * Actualizar vehículo (PUT /vehicle/update) - 
   * En tu código, la ruta existe pero no está implementada en el snippet. 
   * Ajusta si la tienes.
   */
  async updateVehicle(data: any) {
    const opts = await this.getHeaders();
    return this.http.put(`${this.baseUrl}/vehicle/update`, data, opts);
  }

  /**
   * Eliminar vehículo (DELETE /vehicle/:id)
   */
  async deleteVehicle(id: string) {
    const opts = await this.getHeaders();
    return this.http.delete(`${this.baseUrl}/vehicle/${id}`, opts);
  }

  // -----------------------------------------------------
  // RUTAS
  // -----------------------------------------------------

  /**
   * Obtener todas las rutas (GET /rutas)
   */
  async getRutas() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/rutas`, opts);
  }

  /**
   * Crear ruta (POST /rutas/create)
   */
  async createRuta(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/rutas/create`, data, opts);
  }

  /**
   * Obtener ruta por ID (GET /rutas/:id)
   */
  async getRutaById(id: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/rutas/${id}`, opts);
  }

  /**
   * Actualizar ruta (POST /rutas/update)
   * En tu snippet, la ruta de actualización se hace con 
   * `rutaRoutes.post('/update', verificarToken, ...)`.
   * Ajusta a PUT si lo cambias en tu backend.
   */
  async updateRuta(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/rutas/update`, data, opts);
  }

  /**
   * Obtener rutas por fecha (GET /rutas/fecha/:date)
   * @param date Fecha en formato YYYY-MM-DD (según tu backend)
   */
  async getRutasByDate(date: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/rutas/fecha/${date}`, opts);
  }

  // -----------------------------------------------------
  // RUTAS N (RutaN)
  // -----------------------------------------------------

  /**
   * Obtener todas las rutas N (GET /rutasn)
   */
  async getRutasN() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/rutasn`, opts);
  }

  /**
   * Crear RutaN (POST /rutasn/create)
   */
  async createRutaN(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/rutasn/create`, data, opts);
  }

  /**
   * Eliminar RutaN por ID (DELETE /rutasn/:id)
   */
  async deleteRutaN(id: string) {
    const opts = await this.getHeaders();
    return this.http.delete(`${this.baseUrl}/rutasn/${id}`, opts);
  }

  // -----------------------------------------------------
  // CUSTOMERS
  // -----------------------------------------------------

  /**
   * Obtener todos los clientes (GET /customers)
   */
  async getCustomers() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/customers`, opts);
  }

  /**
   * Crear cliente (POST /customers/create)
   */
  async createCustomer(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/customers/create`, data, opts);
  }

  /**
   * Obtener cliente por ID (GET /customers/:id)
   */
  async getCustomerById(id: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/customers/${id}`, opts);
  }

  // -----------------------------------------------------
  // ZONE
  // -----------------------------------------------------

  /**
   * Obtener todas las zonas (GET /zone)
   */
  async getZones() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/zone`, opts);
  }

  /**
   * Crear zona (POST /zone/create)
   */
  async createZone(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/zone/create`, data, opts);
  }

  // -----------------------------------------------------
  // PARTES
  // -----------------------------------------------------

  /**
   * Obtener todas las partes (GET /partes)
   */
  async getPartes() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/partes`, opts);
  }

  /**
   * Crear parte (POST /partes/create)
   */
  async createParte(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/partes/create`, data, opts);
  }

  /**
   * Actualizar parte (POST /partes/update)
   * Notar que en el backend se llama a "parteRoutes.post('/update', ...)" para la actualización
   */
  async updateParte(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/partes/update`, data, opts);
  }

  /**
   * Eliminar parte (DELETE /partes/:id)
   */
  async deleteParte(id: string) {
    const opts = await this.getHeaders();
    return this.http.delete(`${this.baseUrl}/partes/${id}`, opts);
  }

  /**
   * Obtener partes no asignadas (GET /partes/noasignados)
   */
  async getPartesNoAsignados() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/partes/noasignados`, opts);
  }

  /**
   * Subir archivo a parte (POST /partes/upload)
   * Requiere enviar 'archivo' en FormData
   */
  async uploadParteFile(formData: FormData) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/partes/upload`, formData, opts);
  }

  // -----------------------------------------------------
  // MATERIAL
  // -----------------------------------------------------

  /**
   * Obtener todos los materiales (GET /material)
   */
  async getMaterials() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/material`, opts);
  }

  /**
   * Crear material (POST /material/create)
   */
  async createMaterial(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/material/create`, data, opts);
  }

  // -----------------------------------------------------
  // MATERIAL PARTE
  // -----------------------------------------------------

  /**
   * Obtener todos los materialPartes (GET /materialparte)
   */
  async getMaterialPartes() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/materialparte`, opts);
  }

  /**
   * Crear materialParte (POST /materialparte/create)
   */
  async createMaterialParte(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/materialparte/create`, data, opts);
  }

  /**
   * Obtener materialParte por ruta (GET /materialparte/:ruta)
   */
  async getMaterialParteByRuta(rutaId: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/materialparte/${rutaId}`, opts);
  }

  // -----------------------------------------------------
  // FACTURACION
  // -----------------------------------------------------

  /**
   * Obtener toda la facturación (GET /facturacion)
   */
  async getFacturacion() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/facturacion`, opts);
  }

  /**
   * Crear facturación (POST /facturacion/create)
   */
  async createFacturacion(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/facturacion/create`, data, opts);
  }

  /**
   * Obtener facturación por ruta (GET /facturacion/ruta/:ruta)
   */
  async getFacturacionByRuta(rutaId: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/facturacion/ruta/${rutaId}`, opts);
  }

  /**
   * Eliminar facturación (DELETE /facturacion/:id)
   */
  async deleteFacturacion(id: string) {
    const opts = await this.getHeaders();
    return this.http.delete(`${this.baseUrl}/facturacion/${id}`, opts);
  }

  // -----------------------------------------------------
  // ANOMALY
  // -----------------------------------------------------

  /**
   * Obtener anomalías (GET /anomaly)
   * Nota: La ruta exacta en tu snippet es anomalyRouter.get('/', ...)
   */
  async getAnomalies() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/anomaly`, opts);
  }

  /**
   * Crear anomalía (POST /anomaly/create)
   */
  async createAnomaly(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/anomaly/create`, data, opts);
  }

  // -----------------------------------------------------
  // SOLUTION
  // -----------------------------------------------------

  /**
   * Obtener soluciones (GET /solution)
   */
  async getSolutions() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/solution`, opts);
  }

  /**
   * Crear solución (POST /solution/create)
   */
  async createSolution(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/solution/create`, data, opts);
  }

  // -----------------------------------------------------
  // CONTRACT
  // -----------------------------------------------------

  /**
   * Obtener todos los contratos (GET /contract)
   */
  async getContracts() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/contract`, opts);
  }

  /**
   * Obtener contrato por ID (GET /contract/:id)
   */
  async getContractById(id: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/contract/${id}`, opts);
  }

  /**
   * Crear contrato (POST /contract)
   */
  async createContract(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/contract`, data, opts);
  }

  /**
   * Actualizar contrato (PUT /contract/:id)
   */
  async updateContract(id: string, data: any) {
    const opts = await this.getHeaders();
    return this.http.put(`${this.baseUrl}/contract/${id}`, data, opts);
  }

  /**
   * Eliminar contrato (DELETE /contract/:id)
   */
  async deleteContract(id: string) {
    const opts = await this.getHeaders();
    return this.http.delete(`${this.baseUrl}/contract/${id}`, opts);
  }

  // -----------------------------------------------------
  // DOCUMENTS CUSTOMER
  // -----------------------------------------------------

  /**
   * Obtener todos los documentos de clientes (GET /documentscustomer)
   */
  async getDocumentsCustomers() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/documentscustomer`, opts);
  }

  /**
   * Crear documento de cliente (POST /documentscustomer/create)
   */
  async createDocumentCustomer(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/documentscustomer/create`, data, opts);
  }

  // -----------------------------------------------------
  // DOCUMENTS PARTE
  // -----------------------------------------------------

  /**
   * Obtener todos los documentos de parte (GET /documentsparte)
   */
  async getDocumentsPartes() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/documentsparte`, opts);
  }

  /**
   * Crear documento de parte (POST /documentsparte/create)
   */
  async createDocumentParte(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/documentsparte/create`, data, opts);
  }

  // -----------------------------------------------------
  // ZIPCODE
  // -----------------------------------------------------

  /**
   * Obtener todos los zipcodes (GET /zipcode)
   */
  async getZipcodes() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/zipcode`, opts);
  }

  /**
   * Crear zipcode (POST /zipcode/create)
   */
  async createZipcode(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/zipcode/create`, data, opts);
  }

  // -----------------------------------------------------
  // COMMENTS (comentarios para partes, etc.)
  // -----------------------------------------------------

  /**
   * NOTA: En el snippet mostrabas un commentSchema, 
   * pero no hay rutas definidas. Ajusta si tienes un commentRouter.
   * Suponiendo que la ruta sea /comment
   */

  /**
   * Obtener comentarios (GET /comment)
   */
  async getComments() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/comment`, opts);
  }

  /**
   * Crear comentario (POST /comment/create)
   */
  async createComment(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/comment/create`, data, opts);
  }

  // -----------------------------------------------------
  // CHECKIN (si tuvieras endpoints para checkin/checkout)
  // -----------------------------------------------------

  /**
   * Tu snippet define el modelo de Checkin, pero no las rutas. 
   * Ajusta si las tienes en tu backend: /checkin
   */
  async getCheckins() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/checkin`, opts);
  }

  async createCheckin(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/checkin/create`, data, opts);
  }

  // -----------------------------------------------------
  // REPORTS
  // -----------------------------------------------------

  /**
   * Tu snippet define un schema de report, pero no incluiste 
   * las rutas. Ajusta si las tienes definidas: /report
   */
  async getReports() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/report`, opts);
  }

  async createReport(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/report/create`, data, opts);
  }


    // -----------------------------------------------------
  // 1. GET /rutas/fecha/:fecha
  //    Retorna la ruta para esa fecha (si hay una)
  // -----------------------------------------------------
  async getRutaPorFecha(fecha: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/rutas/fecha/${fecha}`, opts);
  }

  // -----------------------------------------------------
  // 3. GET /partes/noAsignadosEnMes?date=YYYY-MM-DD
  //    Devuelve partes no asignados para el mes de 'date'
  // -----------------------------------------------------
  async getPartesNoAsignadosEnMes(date: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/partes/noAsignadosEnMes?date=${date}`, opts);
  }

  // -----------------------------------------------------
  // 4. GET /rutas/:id/partes
  //    Devuelve partes asociados a la ruta con _id = id
  // -----------------------------------------------------
  async getPartesDeRuta(rutaId: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/rutas/${rutaId}/partes`, opts);
  }

  // -----------------------------------------------------
  // 5. POST /rutas/:id/asignarPartes
  //    Asigna los ids de partes a la ruta
  //    body: { parteIds: string[] }
  // -----------------------------------------------------
  async asignarPartesARuta(rutaId: string, parteIds: string[]) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/rutas/${rutaId}/asignarPartes`, 
      { parteIds }, 
      opts
    );
  }

  // -----------------------------------------------------
  // ALERTAS
  // -----------------------------------------------------
  // 6. GET /alertas
  // 7. PUT /alertas/:id
  // -----------------------------------------------------
  async getAlertas() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/alertas`, opts);
  }

  async updateAlerta(alertaId: string, data: any) {
    const opts = await this.getHeaders();
    return this.http.put(`${this.baseUrl}/alertas/${alertaId}`, data, opts);
  }

  /**
 * Obtiene todas las rutas asignadas a una fecha dada (YYYY-MM-DD).
 * Ejemplo de uso:
 *   this.apiService.getRutasPorFecha('2025-04-10').subscribe((res: any) => {
 *     if (res.ok) {
 *       console.log('Rutas del día:', res.rutas);
 *     }
 *   });
 */
async getRutasPorFecha(fecha: string) {
  const opts = await this.getHeaders(); // Asumiendo tienes un método getHeaders() para token, etc.
  return this.http.get(`${this.baseUrl}/rutas/porFecha/${fecha}`, opts);
}


// -----------------------------------------------------
  // HERRAMIENTAS
  // -----------------------------------------------------

  /**
   * Obtener todas las herramientas (GET /herramientas)
   */
  async getHerramientas() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/herramientas`, opts);
  }

  /**
   * Obtener herramienta por ID (GET /herramientas/:id)
   */
  async getHerramientaById(id: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/herramientas/${id}`, opts);
  }

  /**
   * Crear herramienta (POST /herramientas/create)
   */
  async createHerramienta(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/herramientas/create`, data, opts);
  }

  /**
   * Actualizar herramienta (PUT /herramientas/update/:id)
   */
  async updateHerramienta(id: string, data: any) {
    const opts = await this.getHeaders();
    return this.http.put(`${this.baseUrl}/herramientas/update/${id}`, data, opts);
  }

  /**
   * Eliminar herramienta (DELETE /herramientas/:id)
   */
  async deleteHerramienta(id: string) {
    const opts = await this.getHeaders();
    return this.http.delete(`${this.baseUrl}/herramientas/${id}`, opts);
  }


}
