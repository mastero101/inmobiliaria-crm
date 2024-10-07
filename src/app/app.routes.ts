import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { VendedoresComponent } from './vendedores/vendedores.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { PropiedadesFormComponent } from './propiedades/propiedades-form/propiedades-form.component';
import { RentasComponent } from './rentas/rentas.component';
import { LoginComponent } from './login/login.component';
import { MensajesComponent } from './mensajes/mensajes/mensajes.component';
import { AuthGuard } from './auth.guard';
import { ProjectManagementComponent } from './project-management/project-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] }, 
  { path: 'vendedores', component: VendedoresComponent, canActivate: [AuthGuard] }, 
  { path: 'propiedades', component: PropiedadesComponent, canActivate: [AuthGuard] }, 
  { path: 'propiedades-form', component: PropiedadesFormComponent, canActivate: [AuthGuard] },
  { path: 'rentas', component: RentasComponent, canActivate: [AuthGuard] }, 
  { path: 'mensajes', component: MensajesComponent, canActivate: [AuthGuard] },
  { path: 'project', component: ProjectManagementComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' } 
];