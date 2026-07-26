import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceComponent } from './service.component';
import { NewFamilyComponent } from './components/new-family/new-family.component';
import { VetComponent } from './components/vet/vet.component';
import { PassportComponent } from './components/passport/passport.component';
import { VotingComponent } from './components/voting/voting.component';
import { PartyComponent } from './components/party/party.component';

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
        path: 'passport',
        pathMatch: 'full',
        data: {
          idService: 'passport'
        },
        component: PassportComponent
      },
      {
        path: 'voting',
        pathMatch: 'full',
        data: {
          idService: 'voting'
        },
        component: VotingComponent
      },
      {
        path: 'party',
        pathMatch: 'full',
        data: {
          idService: 'party'
        },
        component: PartyComponent
      },
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
