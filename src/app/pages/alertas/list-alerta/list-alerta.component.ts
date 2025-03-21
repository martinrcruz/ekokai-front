import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-alerta',
  standalone: false,
  templateUrl: './list-alerta.component.html',
  styleUrls: ['./list-alerta.component.scss'],
})
export class ListAlertaComponent  implements OnInit {
  alertas: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

  async cargarAlertas() {
    const req = await this.apiService.getAlertas(); 
    req.subscribe((res: any) => {
      if (res.ok) {
        this.alertas = res.alertas;
      }
    });
  }

  async cambiarEstado(alerta: any, nuevoEstado: string) {
    const req = await this.apiService.updateAlerta(alerta._id, { state: nuevoEstado });
    req.subscribe((res: any) => {
      if (res.ok) {
        alerta.state = nuevoEstado;
      }
    });
  }
}
