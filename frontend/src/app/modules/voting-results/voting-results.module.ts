import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VotingResultsComponent } from './voting-results.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: VotingResultsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class VotingResultsModule { }
