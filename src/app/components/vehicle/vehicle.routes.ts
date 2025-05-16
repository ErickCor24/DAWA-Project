import { Routes } from "@angular/router";
import { CreateVehicleComponent } from "./create-vehicle/create-vehicle.component";
import { ViewVehiclesComponent } from "./view-vehicles/view-vehicles.component";
import { UpdateVehicleComponent } from "./update-vehicle/update-vehicle.component";
import { companyGuard } from "../auth/company.guard";

export const VehicleRoutes: Routes = [
    { path: '', component: ViewVehiclesComponent },
    { path: 'view', component: ViewVehiclesComponent },
    { path: 'create', component: CreateVehicleComponent, canActivate: [companyGuard] },
    { path: 'update/:id', component: UpdateVehicleComponent, canActivate: [companyGuard] }

];