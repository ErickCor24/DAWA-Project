import { Routes } from "@angular/router";
import { RegisterReserveComponent } from "./register-reserve/register-reserve.component";
import { ClientAuthGuard } from "../auth/clientguard/client-auth.guard";


export const ReserveRoutes: Routes = [
    { path: 'register-reserve',
        loadComponent: () =>
            import('./register-reserve/register-reserve.component').then(m => m.RegisterReserveComponent),
         canActivate: [ClientAuthGuard]
        
    },
     { path: 'list-reserve',
        loadComponent: () =>
            import('./list-reserve/list-reserve.component').then(m => m.ListReserveComponent)
        
    }
    
]