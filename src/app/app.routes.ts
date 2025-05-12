import { Routes } from '@angular/router';
import { ViewVehiclesComponent } from './components/vehicle/view-vehicles/view-vehicles.component';

export const routes: Routes = [
    //Agency

    //Client

    //Company

    // Reserve

    //Vehicle
    {
        path: 'vehicle', 
        loadChildren:() => import('./components/vehicle/vehicle.routes').then(m => m.VEHICLE_ROUTES)
    }
];
