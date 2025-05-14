import { Routes } from '@angular/router';

export const routes: Routes = [
    //Agency

    //Client

    //Company
    {path: 'company', loadChildren: () =>  import('./components/company/company.routes').then(m => m.CompanyRoutes)}
    ,
    // Reserve
    {path: 'reserve', loadChildren: () =>  import('./components/reserve/reserve.routes').then(m => m.ReserveRoutes)}
    //Vehicle
];
