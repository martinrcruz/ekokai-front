import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-historial-usuario',
  templateUrl: './historial-usuario.component.html',
  styleUrls: ['./historial-usuario.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HistorialUsuarioComponent implements OnInit {
  usuarioId!: string;
  loading = true;
  entregas: any[] = [];
  canjes: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.usuarioId = this.route.snapshot.paramMap.get('id')!;
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.loading = true;
    this.http.get<any>(`/api/usuarios/${this.usuarioId}/historial`).subscribe({
      next: (data) => {
        this.entregas = data.entregas || [];
        this.canjes = data.canjes || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
} 