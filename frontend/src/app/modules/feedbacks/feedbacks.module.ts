import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbacksComponent } from './feedbacks.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FeedbacksComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
  ]
})
export class FeedbacksModule { }
