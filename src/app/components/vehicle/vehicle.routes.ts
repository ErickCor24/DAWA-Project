import { Routes } from "@angular/router";
import { CreateVehicleComponent } from "./create-vehicle/create-vehicle.component";
import { UpdateVehicleComponent } from "./update-vehicle/update-vehicle.component";
import { ViewClientVehiclesComponent } from "./view-client-vehicles/view-client-vehicles.component";
import { ViewCompanyVehiclesComponent } from "./view-company-vehicles/view-company-vehicles.component";
import { authGuardGuard } from "../../Core/guards/auth-guard.guard";

export const VehicleRoutes: Routes = [
    { path: 'view-client-vehicles', component: ViewClientVehiclesComponent, canActivate: [authGuardGuard], data: {role: 'client'} },
    { path: 'view-company-vehicles', component: ViewCompanyVehiclesComponent, canActivate: [authGuardGuard], data: {role: 'company'} },
    { path: 'create', component: CreateVehicleComponent, canActivate: [authGuardGuard], data: {role: 'company'} },
    { path: 'update/:id', component: UpdateVehicleComponent, canActivate: [authGuardGuard], data: {role: 'company'} },
    { path: '', redirectTo: '/', pathMatch: 'full' }
];
