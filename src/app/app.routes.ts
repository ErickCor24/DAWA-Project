import { Routes } from '@angular/router';

export const routes: Routes = [
    //Agency
    { path: 'agency', loadChildren: () => import('./components/agency/agency.module').then(m => m.AgencyModule) },
    //Client

    //Company
    {path: 'company', loadChildren: () =>  import('./components/company/company.routes').then(m => m.CompanyRoutes)}

    // Reserve

    //Vehicle
];
