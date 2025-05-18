import { Routes } from "@angular/router";
import { RegisterReserveComponent } from "./register-reserve/register-reserve.component";

import { UpdateReserveComponent } from "./update-reserve/update-reserve.component";
import { ListReserveComponent } from "./list-reserve/list-reserve.component";
import { ClientReservationHistoryComponent } from "./client-reservation-history/client-reservation-history.component";


export const ReserveRoutes: Routes = [
 {path: 'register',component: RegisterReserveComponent},
  
 {path: 'list',component: ListReserveComponent},

{ path: 'update/:id', component: UpdateReserveComponent },
{ path: 'client-history', component: ClientReservationHistoryComponent },
{ path: '', redirectTo: 'list', pathMatch: 'full' }    
]