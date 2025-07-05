import { Routes } from '@angular/router';

import { ClientRegistrationComponent } from './client-registration/client-registration.component';
import { ClientLoginComponent } from './client-login/client-login.component';
import { ClientProfileViewComponent } from './client-profile-view/client-profile-view.component';
import { ClientSearchComponent } from './client-search/client-search.component';
import { ClientProfileEditComponent } from './client-profile-edit/client-profile-edit.component';


export const clientRoutes: Routes = [
  { path: 'register', component: ClientRegistrationComponent },
  { path: 'login', component: ClientLoginComponent },
  { path: 'profile', component: ClientProfileViewComponent, /* canActivate: [ClientAuthGuard] */ },
  { path: 'search', component: ClientSearchComponent, /* canActivate: [companyGuard] */ },
  { path: 'edit-profile', component: ClientProfileEditComponent, /* canActivate: [ClientAuthGuard]  */},
  {path:'', redirectTo:'/', pathMatch:'full'}
];
