import { Routes } from '@angular/router';

import { ClientRegistrationComponent } from './client-registration/client-registration.component';
import { ClientLoginComponent } from './client-login/client-login.component';
import { ClientProfileViewComponent } from './client-profile-view/client-profile-view.component';
import { ClientAuthGuard } from '../auth/clientguard/client-auth.guard';
import { ClientSearchComponent } from './client-search/client-search.component';

export const clientRoutes: Routes = [
  { path: 'register', component: ClientRegistrationComponent },
  { path: 'login', component: ClientLoginComponent },
  { path: 'profile', component: ClientProfileViewComponent, canActivate: [ClientAuthGuard] },
  { path: 'search', component: ClientSearchComponent }
];