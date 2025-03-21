import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-ruta-detalle',
  standalone: false,
  templateUrl: './ruta-detalle.component.html',
  styleUrls: ['./ruta-detalle.component.scss']
})
export class RutaDetalleComponent implements OnInit {

  rutaId: string | null = null;
  ruta: any;
  tabSelected = 'detalles'; // 'detalles','materiales','partes','facturacion'
  materiales: any[] = [];
  partesAsignados: any[] = [];
  facturaciones: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.rutaId = this.route.snapshot.paramMap.get('id');
    if (this.rutaId) {
      this.cargarRuta(this.rutaId);
    }
  }

  async cargarRuta(id: string) {
    const req = await this.apiService.getRutaById(id);
    req.subscribe((res: any) => {
      if (res.ok) {
        this.ruta = res.ruta;
        this.materiales = res.ruta.materiales || [];
        this.partesAsignados = res.ruta.partes || [];
        this.facturaciones = res.ruta.facturacion || [];
      }
    });
  }

  seleccionarTab(tab: any) {
    this.tabSelected = tab;
  }

  agregarMaterial() {
    // Mostrar modal de materiales disponibles
  }

  agregarParte() {
    // Mostrar modal de partes no asignados
  }

  goBack() {
    this.navCtrl.back();
  }
}
