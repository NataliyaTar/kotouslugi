import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceComponent } from './service.component';
import { NewFamilyComponent } from './components/new-family/new-family.component';
import { VetComponent } from './components/vet/vet.component';
import { AnimalPassportComponent } from './components/animal-passport/animal-passport.component';
import { DrugRegistryComponent } from './components/drug-registry/drug-registry.component';

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
        path: 'animal_passport',
        pathMatch: 'full',
        data: {
          idService: 'animal_passport'
        },
        component: AnimalPassportComponent
      },
      {
        path: 'drug_registry',
        pathMatch: 'full',
        data: {
          idService: 'drug_registry'
        },
        component: DrugRegistryComponent
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
