import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/view/not-found/not-found.component';
import { companyGuard } from './components/auth/company.guard';
import { HomeComponent } from './components/view/home/home.component';

export const routes: Routes = [
  //Agency

  //Client

  //Company
  { path: 'company', loadChildren: () => import('./components/company/company.routes').then(m => m.CompanyRoutes), canActivate: [companyGuard] },

  // Reserve

  //Vehicle

  //Special
  {path: 'home', component: HomeComponent, canActivate: [companyGuard]},

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found'}
];
