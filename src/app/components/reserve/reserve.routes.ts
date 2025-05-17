import { Routes } from "@angular/router";
import { RegisterReserveComponent } from "./register-reserve/register-reserve.component";
import { ClientAuthGuard } from "../auth/clientguard/client-auth.guard";
import { UpdateReserveComponent } from "./update-reserve/update-reserve.component";
import { ListReserveComponent } from "./list-reserve/list-reserve.component";


export const ReserveRoutes: Routes = [
 {path: 'register',component: RegisterReserveComponent,canActivate: [ClientAuthGuard]},
  
 {path: 'list',component: ListReserveComponent,canActivate: [ClientAuthGuard]},

{ path: 'update/:id', component: UpdateReserveComponent },
{ path: '', redirectTo: 'list', pathMatch: 'full' }    
]