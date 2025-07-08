import { Routes } from "@angular/router";
import { RegisterCompanyComponent } from "./register-company/register-company.component";
import { LoginUserCompanyComponent } from "./login-user-company/login-user-company.component";
import { ViewCompanyComponent } from "./view-company/view-company.component";
import { ListCompaniesComponent } from "./list-companies/list-companies.component";
import { authGuardGuard } from "../../Core/guards/auth-guard.guard";

export const CompanyRoutes: Routes = [
  { path: 'register', component: RegisterCompanyComponent },
  { path: 'login', component: LoginUserCompanyComponent },
  { path: 'profile', component: ViewCompanyComponent, canActivate: [authGuardGuard], data: {role: 'company'} },
  { path: 'companies', component: ListCompaniesComponent, canActivate: [authGuardGuard], data: {role: 'client'}  },
  { path: '', redirectTo: '/', pathMatch: 'full' }
]
