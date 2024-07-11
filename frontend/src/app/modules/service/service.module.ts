import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceComponent } from './service.component';
import { NewFamilyComponent } from './components/new-family/new-family.component';
import { VetComponent } from './components/vet/vet.component';
import { VaccineComponent } from './components/vaccine/vaccine.component';
/**
 * Роутинг для услуг
 */
const routes: Routes = [
  {
    path: '',
    component: ServiceComponent,
    children: [
      {
        path: 'new_family',
        pathMatch: 'full',
        data: {
          idService: 'new_family'
        },
        component: NewFamilyComponent
      },
      {
        path: 'vet',
        pathMatch: 'full',
        data: {
          idService: 'vet'
        },
        component: VetComponent
      },
      {
        path: 'vaccine',
        pathMatch: 'full',
        data: {
          idService: 'vaccine'
        },
         component: VaccineComponent
        },
      // ToDo: your router for service
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class ServiceModule { }
