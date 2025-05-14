import { Routes } from "@angular/router";
import { RegisterReserveComponent } from "./register-reserve/register-reserve.component";

export const ReserveRoutes: Routes = [
    { path: 'register-reserve',
        loadComponent: () =>
            import('./register-reserve/register-reserve.component').then(m => m.RegisterReserveComponent)
    }
    
    
]