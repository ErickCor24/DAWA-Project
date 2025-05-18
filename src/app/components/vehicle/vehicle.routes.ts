import { Routes } from "@angular/router";
import { CreateVehicleComponent } from "./create-vehicle/create-vehicle.component";
import { UpdateVehicleComponent } from "./update-vehicle/update-vehicle.component";
import { companyGuard } from "../auth/company.guard";
import { ViewClientVehiclesComponent } from "./view-client-vehicles/view-client-vehicles.component";
import { ClientAuthGuard } from "../auth/clientguard/client-auth.guard";
import { ViewCompanyVehiclesComponent } from "./view-company-vehicles/view-company-vehicles.component";

export const VehicleRoutes: Routes = [
    { path: 'view-client-vehicles', component: ViewClientVehiclesComponent, canActivate: [ClientAuthGuard] },
    { path: 'view-company-vehicles', component: ViewCompanyVehiclesComponent, canActivate: [companyGuard] },
    { path: 'create', component: CreateVehicleComponent, canActivate: [companyGuard] },
    { path: 'update/:id', component: UpdateVehicleComponent, canActivate: [companyGuard] }

];