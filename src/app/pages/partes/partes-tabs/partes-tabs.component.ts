import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-partes-tabs',
  standalone: false,
  templateUrl: './partes-tabs.component.html',
  styleUrls: ['./partes-tabs.component.scss']
})
export class PartesTabsComponent implements OnInit {

  tabSelected = 'asignados'; // 'asignados' o 'noasignados'
  partesAsignados: any[] = [];
  partesNoAsignados: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarPartes();
  }

  async cargarPartes() {
    // Ajusta tu backend para filtrar
    const req1 = await this.apiService.getPartes();
    req1.subscribe((res: any) => {
      if (res.ok) {
        this.partesAsignados = res.partes;
      }
    });

    const req2 = await this.apiService.getPartesNoAsignados();
    req2.subscribe((res: any) => {
      if (res.ok) {
        this.partesNoAsignados = res.partes;
      }
    });
  }

  seleccionarTab(tab: any) {
    this.tabSelected = tab;
  }
}
