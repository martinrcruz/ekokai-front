// src/app/pages/administrador/administrador-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin.guard';

// IMPORTS de componentes del área Administrador
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import{PremiosGestionComponent as PremiosComponent} from './premios-gestion/premios-gestion.component';
import { HistorialReciclajeComponent } from './historial-reciclaje/historial-reciclaje.component';
import { HistorialCanjesComponent } from './historial-canjes/historial-canjes.component';
import { CuponesActivosComponent } from './cupones-activos/cupones-activos.component';
import { ReciclajesFotosComponent } from './reciclajes-fotos/reciclajes-fotos.component';
import { TrazabilidadComponent } from './trazabilidad/trazabilidad.component';
import { TrazabilidadReciclajeComponent } from './trazabilidad-reciclaje/trazabilidad-reciclaje.component';
import { EcopuntosComponent } from './ecopuntos/ecopuntos.component';
import { MarketplaceComponent as AdminMarketplaceComponent } from './marketplace/marketplace.component';
import { ReciclarComponent as AdminReciclarComponent } from './reciclar/reciclar.component';
import { TiposResiduoGestionComponent as AdminTiposResiduosComponent } from './tipos-residuo-gestion/tipos-residuo-gestion.component';
//import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosGestionComponent } from './usuarios-gestion/usuarios-gestion.component';
import { UsuariosVecinosComponent } from './usuarios-vecinos/usuarios-vecinos.component';
import { UsuariosStaffComponent } from './usuarios-staff/usuarios-staff.component';
import { HomeComponent } from '../home/home.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full'
    // Removido canActivate: [AdminGuard] - ya se aplica en el routing principal
  },

  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'configuracion', 
    component: ConfiguracionComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'premios', 
    component: PremiosComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'historial-reciclaje', 
    component: HistorialReciclajeComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'historial-canjes', 
    component: HistorialCanjesComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'cupones-activos', 
    component: CuponesActivosComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'reciclajes-fotos', 
    component: ReciclajesFotosComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'trazabilidad', 
    component: TrazabilidadComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'trazabilidad-reciclaje', 
    component: TrazabilidadReciclajeComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'ecopuntos', 
    component: EcopuntosComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'marketplace', 
    component: AdminMarketplaceComponent,
    canActivate: [AdminGuard]
  },
  // { 
  //   path: 'reciclar', 
  //   component: AdminReciclarComponent,
  //   canActivate: [AdminGuard]
  // },
  // { 
  //   path: 'tiposresiduos', 
  //   component: AdminTiposResiduosComponent,
  //   canActivate: [AdminGuard]
  // },
  //{ path: 'usuarios', component: UsuariosComponent },
  { 
    path: 'usuarios-gestion', 
    component: UsuariosGestionComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'usuarios-vecinos', 
    component: UsuariosVecinosComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'usuarios-staff', 
    component: UsuariosStaffComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'usuarios', 
    loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
    canActivate: [AdminGuard]
  },
  { 
    path: 'qr-whatsapp', 
    loadChildren: () => import('../qr-whatsapp/qr-whatsapp.module').then(m => m.QRWhatsappModule),
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule {}
