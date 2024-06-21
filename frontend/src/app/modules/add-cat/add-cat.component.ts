// Файл не трогаем

import { Component, OnInit } from '@angular/core';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { IStep } from '@models/step.model';
import { take } from 'rxjs';
import { StepsComponent } from '@components/steps/steps.component';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { IPreview } from '@models/common.model';
import { ConstantsService } from '@services/constants/constants.service';
import { CatService } from '@services/cat/cat.service';

export type TForm = 'name' | 'age' | 'sex' | 'breed';
export enum FormMap {
  name = 'Кличка',
  age = 'Возраст',
  sex = 'Пол',
  breed = 'Порода'
}

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
  public sexOptions = this.constantsService.sexOptions;
  public breedOptions = this.constantsService.breedOptions;

  private idService = 'add_cat';

  public get getResult(): Array<IPreview[]> {
    return this.serviceInfo.prepareData({0: this.form.getRawValue()}, this.steps, FormMap);
  }

  constructor(
    private serviceInfo: ServiceInfoService,
    private fb: FormBuilder,
    private constantsService: ConstantsService,
    private catService: CatService,
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
      name: ['', [Validators.required, Validators.pattern(/^[А-яЁё]+$/)]],
      age: ['', [Validators.required, Validators.pattern(/^[\d]+$/)]],
      sex: [this.sexOptions[0], [Validators.required]],
      breed: [this.breedOptions[0], [Validators.required]]
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
    this.catService.addCat();
  }

}
