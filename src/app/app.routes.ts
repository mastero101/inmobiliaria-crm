import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { VendedoresComponent } from './vendedores/vendedores.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { RentasComponent } from './rentas/rentas.component';

export const routes: Routes = [
  { path: 'clientes', component: ClientesComponent },
  { path: 'vendedores', component: VendedoresComponent },
  { path: 'propiedades', component: PropiedadesComponent },
  { path: 'rentas', component: RentasComponent },
  { path: '', redirectTo: '/clientes', pathMatch: 'full' }
];