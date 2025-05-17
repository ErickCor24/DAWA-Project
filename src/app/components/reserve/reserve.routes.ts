import { Routes } from "@angular/router";
import { RegisterReserveComponent } from "./register-reserve/register-reserve.component";

import { UpdateReserveComponent } from "./update-reserve/update-reserve.component";
import { ListReserveComponent } from "./list-reserve/list-reserve.component";


export const ReserveRoutes: Routes = [
 {path: 'register',component: RegisterReserveComponent},
  
 {path: 'list',component: ListReserveComponent},

{ path: 'update/:id', component: UpdateReserveComponent },
{ path: '', redirectTo: 'list', pathMatch: 'full' }    
]