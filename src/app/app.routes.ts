import { Routes } from '@angular/router';

export const routes: Routes = [
    //Agency

    //Client

    //Company
    {path: 'company', loadChildren: () =>  import('./components/company/company.routes').then(m => m.CompanyRoutes)}

    // Reserve

    //Vehicle
];
