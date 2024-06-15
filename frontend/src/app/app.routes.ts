import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./modules/main/main.module').then(mod => mod.MainModule)
  },
  {
    path: 'orders',
    pathMatch: 'full',
    loadChildren: () => import('./modules/orders/orders.module').then(mod => mod.OrdersModule)
  },
  {
    path: 'service',
    loadChildren: () => import('./modules/service/service.module').then(mod => mod.ServiceModule)
  },
  {
    path: '**',
    loadChildren: () => import('./modules/not-found/not-found.module').then(mod => mod.NotFoundModule)
  }
];
