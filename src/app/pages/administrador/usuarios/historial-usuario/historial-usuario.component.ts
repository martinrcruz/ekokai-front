import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-historial-usuario',
  templateUrl: './historial-usuario.component.html',
  styleUrls: ['./historial-usuario.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HistorialUsuarioComponent implements OnInit {
  usuarioId!: string;
  usuario: any = {};
  loading = true;
  entregas: any[] = [];
  canjes: any[] = [];
  estadisticas = {
    totalEntregas: 0,
    totalKilos: 0,
    totalTokens: 0,
    totalCanjes: 0,
    tokensGastados: 0
  };

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    console.log('[HistorialUsuario] ngOnInit - Iniciando componente');
    this.usuarioId = this.route.snapshot.paramMap.get('id')!;
    console.log('[HistorialUsuario] Usuario ID:', this.usuarioId);
    this.cargarDatos();
  }

  cargarDatos() {
    console.log('[HistorialUsuario] cargarDatos - Iniciando carga de datos');
    this.loading = true;
    
    // Cargar datos del usuario
    console.log('[HistorialUsuario] Cargando datos del usuario:', this.usuarioId);
    this.usuariosService.obtenerUsuario(this.usuarioId).subscribe({
      next: (usuario) => {
        console.log('[HistorialUsuario] Usuario cargado:', usuario);
        this.usuario = usuario;
      },
      error: (err) => {
        console.error('[HistorialUsuario] Error al cargar usuario:', err);
      }
    });

    // Cargar historial completo
    console.log('[HistorialUsuario] Cargando historial del usuario:', this.usuarioId);
    this.usuariosService.obtenerHistorialUsuario(this.usuarioId).subscribe({
      next: (data) => {
        console.log('[HistorialUsuario] Historial cargado:', data);
        this.entregas = data.entregas || [];
        this.canjes = data.canjes || [];
        this.calcularEstadisticas();
        this.loading = false;
      },
      error: (err) => {
        console.error('[HistorialUsuario] Error al cargar historial:', err);
        this.loading = false;
      }
    });
  }

  calcularEstadisticas() {
    this.estadisticas.totalEntregas = this.entregas.length;
    this.estadisticas.totalKilos = this.entregas.reduce((sum, e) => sum + (e.pesoKg || 0), 0);
    this.estadisticas.totalTokens = this.entregas.reduce((sum, e) => sum + (e.tokensOtorgados || 0), 0);
    this.estadisticas.totalCanjes = this.canjes.length;
    this.estadisticas.tokensGastados = this.canjes.reduce((sum, c) => sum + (c.tokens || 0), 0);
  }

  volverAUsuarios() {
    this.router.navigate(['/administrador/usuarios-gestion']);
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  obtenerEstadoColor(estado: string): string {
    return estado === 'Entregado' ? 'success' : 'warning';
  }
} 