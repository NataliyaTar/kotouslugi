import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // ← ДОБАВИТЬ
import { DrivingLicenseComponent } from './driving-license.component';
import { ThrobberComponent } from '@components/throbber/throbber.component'; // ← ДОБАВИТЬ (путь может отличаться)

const routes: Routes = [
  { path: '', component: DrivingLicenseComponent }
];

@NgModule({
  declarations: [DrivingLicenseComponent],
  imports: [
    CommonModule,           // для *ngIf, *ngFor, date pipe
    RouterModule.forChild(routes),
    ReactiveFormsModule,    // для formGroup, formControlName
    FormsModule,           // для ngModel
    ThrobberComponent      // если throbber - standalone компонент
  ]
})
export class DrivingLicenseModule { }
