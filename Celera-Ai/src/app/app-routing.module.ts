import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { InicioSesionPageComponent } from './pages/inicio-sesion-page/inicio-sesion-page.component';
import { DashBoardComponent } from './pages/dash-board/dash-board.component';
import { CrearNegocioComponent } from './pages/crear-negocio/crear-negocio.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { FacturaComponent } from './pages/factura/factura.component';
import { AsistenteComponent } from './pages/asistente/asistente.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { AuthguardService } from './service/authguard.service';
import { RegistroPageComponent } from './pages/registro-page/registro-page.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent,canActivate: [AuthguardService] },
  { path: 'login', component: InicioSesionPageComponent },
  { path: 'register', component: RegistroPageComponent },
  { path: 'crear-negocio', component: CrearNegocioComponent,canActivate: [AuthguardService] },
  { path: 'facturar/:idNegocio', component: FacturaComponent,canActivate: [AuthguardService] },
  { path: 'estadisticas/:idNegocio', component: EstadisticasComponent,canActivate: [AuthguardService] },
  { path: 'asistente/:idNegocio', component: AsistenteComponent,canActivate: [AuthguardService] },
  { path: 'ventas/:idNegocio', component: VentasComponent,canActivate: [AuthguardService]},
  { path: 'inventario/:idNegocio', component: InventarioComponent,canActivate: [AuthguardService]},
  { path: 'dash-board/:idNegocio', component: DashBoardComponent,canActivate: [AuthguardService]},
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
