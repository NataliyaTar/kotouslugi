// Файл не трогаем

/**
 * Роутинг для проекта
 * Говорит по какому url какой компонент использовать
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./modules/main/main.module').then(mod => mod.MainModule)
  },
  {
    path: 'cats',
    pathMatch: 'full',
    loadChildren: () => import('./modules/cats-list/cats-list.module').then(mod => mod.CatsListModule)
  },
  {
    path: 'add-cat',
    pathMatch: 'full',
    loadChildren: () => import('./modules/add-cat/add-cat.module').then(mod => mod.AddCatModule)
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
