import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceComponent } from './service.component';
import { NewFamilyComponent } from './components/new-family/new-family.component';
import { VetComponent } from './components/vet/vet.component';
import { AnimalPassportComponent } from './components/animal-passport/animal-passport.component';
import { GroomingBookingComponent } from './components/grooming-booking/grooming-booking.component';

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
        path: 'spa',
        pathMatch: 'full',
        data: {
          idService: 'spa'
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
        path: 'grooming_booking',
        pathMatch: 'full',
        data: {
          idService: 'grooming_booking'
        },
        component: GroomingBookingComponent
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
