import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceComponent } from './service.component';
import { BornComponent } from './components/born/born.component';
import { VetComponent } from './components/vet/vet.component';

const routes: Routes = [
  {
    path: '',
    component: ServiceComponent,
    children: [
      {
        path: 'born',
        pathMatch: 'full',
        data: {
          idService: 'born'
        },
        component: BornComponent
      },
      {
        path: 'vet',
        pathMatch: 'full',
        data: {
          idService: 'vet'
        },
        component: VetComponent
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
