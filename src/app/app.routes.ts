import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { VendedoresComponent } from './vendedores/vendedores.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { PropiedadesFormComponent } from './propiedades/propiedades-form/propiedades-form.component'; // Importar el nuevo componente
import { RentasComponent } from './rentas/rentas.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] }, 
  { path: 'vendedores', component: VendedoresComponent, canActivate: [AuthGuard] }, 
  { path: 'propiedades', component: PropiedadesComponent, canActivate: [AuthGuard] }, 
  { path: 'propiedades-form', component: PropiedadesFormComponent, canActivate: [AuthGuard] }, // Nueva ruta
  { path: 'rentas', component: RentasComponent, canActivate: [AuthGuard] }, 
  { path: '', redirectTo: '/login', pathMatch: 'full' } 
];