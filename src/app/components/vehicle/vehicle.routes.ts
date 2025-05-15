import { Routes } from "@angular/router";
import { CreateVehicleComponent } from "./create-vehicle/create-vehicle.component";
import { ViewVehiclesComponent } from "./view-vehicles/view-vehicles.component";
import { ListVehiclesComponent } from "./list-vehicles/list-vehicles.component";
import { UpdateVehicleComponent } from "./update-vehicle/update-vehicle.component";

export const VehicleRoutes: Routes = [
    { path: '', component: ViewVehiclesComponent },
    { path: 'view', component: ViewVehiclesComponent },
    { path: 'create', component: CreateVehicleComponent },
    { path: 'list-vehicles', component: ListVehiclesComponent },
    { path: 'update/:id', component: UpdateVehicleComponent }

];