import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PartesService } from 'src/app/services/partes.service';
import { UserService } from 'src/app/services/user.service';

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
    private _usuario: UserService,
    private _parte: PartesService,
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
    const req = await this._usuario.getUserById(id);
    req.subscribe((res: any) => {
      if (res.ok) {
        this.usuario = res.user;
      }
    });
  }

  async cargarPartesAsignados(userId: string) {
    // Ajusta según tu backend para obtener los partes que tengan userId = X y asignado = true
    const req = await this._parte.getPartes();
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
