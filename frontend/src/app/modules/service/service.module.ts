import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceComponent } from './service.component';
import { NewFamilyComponent } from './components/new-family/new-family.component';
import { VetComponent } from './components/vet/vet.component';
import { InsuranceCatComponent } from './components/insurance-cat/insurance-cat.component';
import { ExamsComponent} from "./components/exams/exams.component";
import { VaccineComponent } from './components/vaccine/vaccine.component';
import {ClubComponent} from './components/club/club.component'

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
        path: 'insurance',
        pathMatch: 'full',
        data: {
          idService: 'insurance'
        },
        component: InsuranceCatComponent
      },
      {
        path: 'exams',
        pathMatch: 'full',
        data: {
          idService: 'exams'
        },
        component: ExamsComponent
      },
      {
        path: 'vaccine',
        pathMatch: 'full',
        data: {
          idService: 'vaccine'
        },
        component: VaccineComponent
      },
      {
        path: 'club',
        pathMatch: 'full',
        data:{
          idService: 'club'
        },
        component: ClubComponent
      }
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
