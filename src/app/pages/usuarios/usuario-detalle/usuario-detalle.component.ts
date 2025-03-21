import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-usuario-detalle',
  standalone: false,
  templateUrl: './usuario-detalle.component.html',
  styleUrls: ['./usuario-detalle.component.scss']
})
export class UsuarioDetalleComponent implements OnInit {

  userId: string | null = null;
  usuario: any;
  partesAsignados: any[] = [];
  tabSelected: string = 'perfil'; // puede ser 'perfil' o 'partes'

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.cargarUsuario(this.userId);
      this.cargarPartesAsignados(this.userId);
    }
  }

  async cargarUsuario(id: string) {
    const req = await this.apiService.getUserById(id);
    req.subscribe((res: any) => {
      if (res.ok) {
        this.usuario = res.user;
      }
    });
  }

  async cargarPartesAsignados(userId: string) {
    // Ajusta según tu backend para obtener los partes que tengan userId = X y asignado = true
    const req = await this.apiService.getPartes();
    req.subscribe((res: any) => {
      if (res.ok) {
        this.partesAsignados = res.partes;
      }
    });
  }

  seleccionarTab(tab: any) {
    this.tabSelected = tab;
  }

  goBack() {
    this.navCtrl.back();
  }

  verParteDetalle(parteId: string) {
    this.navCtrl.navigateForward(`/partes/detalle/${parteId}`);
  }
}
