import { Routes } from "@angular/router";
import { RegisterCompanyComponent } from "./register-company/register-company.component";
import { companyGuard } from "../auth/company.guard";
import { LoginUserCompanyComponent } from "./login-user-company/login-user-company.component";
import { ViewCompanyComponent } from "./view-company/view-company.component";
import { ListCompaniesComponent } from "./list-companies/list-companies.component";

export const CompanyRoutes: Routes = [
    {path: 'register', component: RegisterCompanyComponent},
    {path:'login', component: LoginUserCompanyComponent},
    {path:'profile', component: ViewCompanyComponent, canActivate: [companyGuard]},
    {path:'companies', component: ListCompaniesComponent, canActivate: [companyGuard]}
]
