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

export type TForm = 'name' | 'age' | 'sex' | 'breed'; // поля в форме
export enum FormMap { // маппинг поля с наименованием по-русски
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

  public steps: IStep[]; // шаги формы
  public active = 0; // активный шаг
  public form: UntypedFormGroup; // форма
  public sexOptions = this.constantsService.sexOptions; // список полов
  public breedOptions = this.constantsService.breedOptions; // список пород

  private idService = 'add_cat';

  /**
   * Возвращает преобразованное значение формы для отображения заполненных данных
   */
  public get getResult(): Array<IPreview[]> {
    return this.serviceInfo.prepareDataForPreview({0: this.form.getRawValue()}, this.steps, FormMap);
  }

  constructor(
    private serviceInfo: ServiceInfoService,
    private fb: FormBuilder,
    private constantsService: ConstantsService,
    private catService: CatService,
  ) {
  }

  public ngOnInit() {
    // Получение списка шагов
    this.serviceInfo.getSteps(this.idService).pipe(
      take(1)
    ).subscribe(res => {
      this.steps = res;
    });

    this.initForm();
  }

  /**
   * Инициализация формы
   * @private
   */
  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[А-яЁё]+$/)]],
      age: ['', [Validators.required, Validators.pattern(/^[\d]+$/)]],
      sex: [JSON.stringify(this.sexOptions[0]), [Validators.required]],
      breed: [JSON.stringify(this.breedOptions[0]), [Validators.required]],
      birthDate: ['', [Validators.required]],
      ownerPhone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]]
    });
  }

  /**
   * Возвращает контрол формы
   * @param id - идентификатор контролла
   */
  public getControl(id: string): FormControl {
    return this.form.get(id) as FormControl;
  }

  /**
   * Возвращает json в виде строки
   * @param type - по какому массиву ищем
   * @param index - индекс в массиве
   */
  public getItem(type: 'sex' | 'breed', index: number): string {
    if (type === 'sex') {
      return JSON.stringify(this.sexOptions[index]);
    }

    return JSON.stringify(this.breedOptions[index]);
  }

  /**
   * Валидна ли форма
   */
  public isValidStep(): boolean {
    return this.form?.valid;
  }

  /**
   * Переход на следующий шаг формы
   */
  public next(): void {
    this.active++;
  }

  /**
   * Переход на предыдущий шаг формы
   */
  public prev(): void {
    this.active--;
  }

  /**
   * Сохранение кота в БД
   */
  public save(): void {
    this.catService.addCat(this.form.getRawValue()).subscribe(res => {
      alert('Кот зарегистрирован\nНажмите «OK» для перехода на предыдущую страницу портала');
      window.history.back();
    }, error => {
      alert('Произошла ошибка, повторите попытку позже\nНажмите «OK» для перехода на предыдущую страницу портала');
      window.history.back();
    });
  }

}
