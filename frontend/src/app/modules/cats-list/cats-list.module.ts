import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatsListComponent } from './cats-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CatsListComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class CatsListModule { }
