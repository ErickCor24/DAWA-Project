import { Routes } from "@angular/router";
import { RegisterReserveComponent } from "./register-reserve/register-reserve.component";

import { UpdateReserveComponent } from "./update-reserve/update-reserve.component";
import { ListReserveComponent } from "./list-reserve/list-reserve.component";
import { ClientReservationHistoryComponent } from "./client-reservation-history/client-reservation-history.component";
import { authGuardGuard } from "../../Core/guards/auth-guard.guard";



export const ReserveRoutes: Routes = [
 {path: 'register',component: RegisterReserveComponent, canActivate: [authGuardGuard], data: {role: 'client'} },

 {path: 'list',component: ListReserveComponent, canActivate: [authGuardGuard], data: {role: 'client'} },

{ path: 'update/:id', component: UpdateReserveComponent, canActivate: [authGuardGuard], data: {role: 'client'}  },
{ path: 'client-history', component: ClientReservationHistoryComponent, canActivate: [authGuardGuard], data: {role: 'client'} },
{ path: '', redirectTo: '/', pathMatch: 'full' }
]
