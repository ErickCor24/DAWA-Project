import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/view/not-found/not-found.component';
import { HomeComponent } from './components/view/home/home.component';
import { CompanyRoutes } from './components/company/company.routes';
import { RegisterCompanyComponent } from './components/company/register-company/register-company.component';
import { LoginUserCompanyComponent } from './components/company/login-user-company/login-user-company.component';
import { ViewCompanyComponent } from './components/company/view-company/view-company.component';

export const routes: Routes = [
  //Agency
  { path: 'agency', loadChildren: () => import('./components/agency/agency.module').then(m => m.AgencyModule) },
  //Client
  { path: 'client', loadChildren: () => import('./components/client/client.routes').then(m => m.clientRoutes) },
  //Company
  { path: 'company', loadChildren: () => import('./components/company/company.routes').then(m => m.CompanyRoutes) },

  // Reserve
  { path: 'reserve', loadChildren: () => import('./components/reserve/reserve.routes').then(m => m.ReserveRoutes) },
  //Vehicle
  { path: 'vehicle', loadChildren: () => import('./components/vehicle/vehicle.routes').then(m => m.VehicleRoutes)},

  //Special
  { path: 'home', component: HomeComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found' }
];
