import { Routes } from "@angular/router";
import { CreateVehicleComponent } from "./create-vehicle/create-vehicle.component";
import { ViewVehiclesComponent } from "./view-vehicles/view-vehicles.component";

export const VEHICLE_ROUTES: Routes = [
    { path: '', component: ViewVehiclesComponent },
    { path: 'view-vehicles', component: ViewVehiclesComponent },
    { path: 'create-vehicle', component: CreateVehicleComponent }
];