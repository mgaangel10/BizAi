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

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'login', component: InicioSesionPageComponent },
  { path: 'crear-negocio', component: CrearNegocioComponent },
  { path: 'facturar/:idNegocio', component: FacturaComponent },
  { path: 'asistente/:idNegocio', component: AsistenteComponent },
  { path: 'ventas/:idNegocio', component: VentasComponent},
  { path: 'inventario/:idNegocio', component: InventarioComponent},
  { path: 'dash-board/:idNegocio', component: DashBoardComponent},
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
