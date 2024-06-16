// Файл не трогаем

import { Component, OnInit } from '@angular/core';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { IStep } from '@models/step.model';
import { take } from 'rxjs';
import { StepsComponent } from '@components/steps/steps.component';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { CheckInfoComponent } from '@components/check-info/check-info.component';

@Component({
  selector: 'app-add-cat',
  standalone: true,
  imports: [
    StepsComponent,
    ReactiveFormsModule,
    CheckInfoComponent,
  ],
  templateUrl: './add-cat.component.html',
  styleUrl: './add-cat.component.scss'
})
export class AddCatComponent implements OnInit {

  public steps: IStep[];
  public active = 0;
  public form: UntypedFormGroup;

  private idService = 'add_cat';

  public getResult() {
    return this.form.getRawValue();
  }

  constructor(
    private serviceInfo: ServiceInfoService,
    private fb: FormBuilder,
  ) {
  }

  public ngOnInit() {
    this.serviceInfo.getSteps(this.idService).pipe(
      take(1)
    ).subscribe(res => {
      this.steps = res;
    });

    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['а', [Validators.required, Validators.pattern(/^[А-яЁё]+$/)]],
      age: ['1', [Validators.required, Validators.pattern(/^[\d]+$/)]]
    });
  }

  public getControl(id: string): FormControl {
    return this.form.get(id) as FormControl;
  }

  public isValidStep(): boolean {
    return this.form?.valid;
  }

  public next(): void {
    this.active++;
  }

  public prev(): void {
    this.active--;
  }

  public save(): void {

  }

}
