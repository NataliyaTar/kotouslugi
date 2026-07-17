import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DrivingLicenseComponent } from './driving-license.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { CheckInfoComponent } from '@components/check-info/check-info.component';

const routes: Routes = [
  {
    path: '',
    component: DrivingLicenseComponent,
    data: {
      idService: 'driving-license',
      skipSave: true
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    ThrobberComponent,
    CheckInfoComponent
  ],
  exports: [RouterModule]
})
export class DrivingLicenseModule { }
