import { Component, OnInit } from '@angular/core';
import { PartesService } from 'src/app/services/partes.service';
import { Parte } from 'src/app/models/parte.model';
import { SegmentValue } from '@ionic/core';

@Component({
  selector: 'app-partes-tabs',
  standalone: false,
  templateUrl: './partes-tabs.component.html',
  styleUrls: ['./partes-tabs.component.scss']
})
export class PartesTabsComponent implements OnInit {

  tabSelected = 'asignados'; // 'asignados' o 'noasignados'
  partesAsignados: Parte[] = [];
  partesNoAsignados: Parte[] = [];

  constructor(private _partes: PartesService) {}

  ngOnInit() {
    this.cargarPartes();
  }

  async cargarPartes() {
    // Ajusta tu backend para filtrar
    const req1 = await this._partes.getPartes();
    req1.subscribe((partes: Parte[]) => {
      this.partesAsignados = partes;
    });

    const req2 = await this._partes.getPartesNoAsignados();
    req2.subscribe((partes: Parte[]) => {
      this.partesNoAsignados = partes;
    });
  }

  seleccionarTab(tab: SegmentValue) {
    if (tab) {
      this.tabSelected = tab.toString();
    }
  }
}
