import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Роутинг для услуг
 */
const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./service.component').then(m => m.ServiceComponent),
    children: [
      {
        path: 'new-family',
        data: {
          idService: 'new-family'
        },
        loadComponent: () => import('./components/new-family/new-family.component')
          .then(m => m.NewFamilyComponent)
      },
      {
        path: 'vet',
        data: {
          idService: 'vet'
        },
        loadComponent: () => import('./components/vet/vet.component')
          .then(m => m.VetComponent)
      },
      {
        path: 'missing-cat',
        data: {
          idService: 'missing-cat'
        },
        loadComponent: () => import('./components/missing-cat/missing-cat.component')
          .then(m => m.MissingCatComponent)
      },
      {
        path: 'vet-passport',
        data: {
          idService: 'vet-passport'
        },
        loadComponent: () => import('./components/vet-passport/vet-passport.component')
          .then(m => m.VetPassportComponent)
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ServiceModule { }
