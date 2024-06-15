import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCatComponent } from './add-cat.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AddCatComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class AddCatModule { }
