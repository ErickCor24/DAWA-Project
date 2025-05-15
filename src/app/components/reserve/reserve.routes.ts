import { Routes } from "@angular/router";
import { RegisterReserveComponent } from "./register-reserve/register-reserve.component";

export const ReserveRoutes: Routes = [
    { path: 'register-reserve',
        loadComponent: () =>
            import('./register-reserve/register-reserve.component').then(m => m.RegisterReserveComponent)
        
    },
     { path: 'list-reserve',
        loadComponent: () =>
            import('./list-reserve/list-reserve.component').then(m => m.ListReserveComponent)
        
    }
    
]