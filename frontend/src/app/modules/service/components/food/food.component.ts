import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { Subscription, take } from 'rxjs';
import { CommonModule, JsonPipe, AsyncPipe } from '@angular/common';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CatService } from '@services/cat/cat.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { IPreview, IValue } from '@models/common.model';

export enum FormMap {
  cat = 'Кличка кота',
  orderName = 'Имя для заказа',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
  city = 'Город',
  street = 'Улица',
  floor = 'Дом',
  entrance = 'Квартира',
  shop = 'Магазин',
  deliveryType = 'Тип доставки',
  deliveryDate = 'Дата доставки',
  deliveryTime = 'Время доставки',
  products = 'Продукты',
  comment = 'Комментарий к заказу',
}

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    CommonModule,
    JsonPipe,
    ThrobberComponent,
    AsyncPipe
  ],
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit, OnDestroy {
  public loading = true;
  public form!: UntypedFormGroup;
  public active: number = 0;

  public optionsCat: IValueCat[] = [];
  public cityOptions: IValue[] = [];
  public streetOptions: IValue[] = [];
  public shopOptions: IValue[] = [];
  public deliveryTypeOptions: IValue[] = [];
  public productOptions: IValue[] = [];

  public idService: string = '';
  public steps: IStep[] = [];
  private subscriptions: Subscription[] = [];

  public FormMap = FormMap;


  public get getResult(): IPreview[][] {
    const rawValue = this.form.getRawValue();

    const preparedForPreview: any = {};

    preparedForPreview[0] = {
      cat: rawValue[0].cat,
      orderName: rawValue[0].orderName,
      telephone: rawValue[0].telephone,
      email: rawValue[0].email
    };

    preparedForPreview[1] = {
      city: rawValue[1].city,
      street: rawValue[1].street,
      floor: rawValue[1].floor,
      entrance: rawValue[1].entrance
    };

    preparedForPreview[2] = {
      shop: rawValue[2].shop,
      deliveryType: rawValue[2].deliveryType,
      deliveryDate: rawValue[2].deliveryDate,
      deliveryTime: rawValue[2].deliveryTime
    };

    const selectedProductsRaw = Array.isArray(rawValue[3].products)
      ? rawValue[3].products
      : [];

    const productNamesForPreview = selectedProductsRaw
      .map((jsonString: string) => {
        try {
          return JSON.parse(jsonString)?.text;
        } catch (e) {
          return null;
        }
      })
      .filter((name: string | null) => name !== null)
      .join(', ');

    preparedForPreview[3] = {
      products: productNamesForPreview || '-'
    };

    preparedForPreview[4] = {
      comment: rawValue[4].comment
    };

    const stepsForPreview = this.steps.slice(0, this.steps.length - 1);

    return this.serviceInfo.prepareDataForPreview(preparedForPreview, stepsForPreview, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    public serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private catService: CatService,
    private constantService: ConstantsService,
  ) { }

  public ngOnInit(): void {
    this.getInitialData();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public getControl(step: number, id: ''): UntypedFormGroup;
  public getControl(step: number, id: string): FormControl;
  public getControl(step: number, id: string): UntypedFormGroup | FormControl {
    if (id === '') {
      return this.form.get(step.toString()) as UntypedFormGroup;
    }
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public getItem(type: 'cat' | 'shop' | 'deliveryType' | 'product' | 'city' | 'street', index: number): string {
    let item: IValue | IValueCat | undefined;
    switch (type) {
      case 'cat': item = this.optionsCat[index]; break;
      case 'shop': item = this.shopOptions[index]; break;
      case 'deliveryType': item = this.deliveryTypeOptions[index]; break;
      case 'product': item = this.productOptions[index]; break;
      case 'city': item = this.cityOptions[index]; break;
      case 'street': item = this.streetOptions[index]; break;
      default: item = undefined;
    }
    return item ? JSON.stringify(item) : '';
  }

  private dateValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) { return null; }
    const today = new Date();
    const inputDate = new Date(control.value);
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate >= today ? null : { minDate: true };
  };

  private nonNegativeNumberValidator = (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') {
      return null;
    }
    const value = Number(control.value);
    return !isNaN(value) && value >= 0 ? null : { nonNegative: true };
  };

  private getInitialData(): void {
    this.constantService.getCatOptionsAll().pipe(
      take(1)
    ).subscribe({
      next: (catsRes: IValueCat[]) => {
        this.optionsCat = catsRes.map(cat => ({ id: cat.id, text: cat.text }));
        this.shopOptions = this.constantService.shopOptions;
        this.deliveryTypeOptions = this.constantService.deliveryTypeOptions;
        this.productOptions = this.constantService.productOptions;
        this.cityOptions = this.constantService.cityOptions;
        this.streetOptions = this.constantService.streetOptions;

        this.prepareService();
      },
      error: (error) => {
        console.error('Ошибка при загрузке начальных данных:', error);
        this.loading = false;
      }
    });
  }

  private prepareService(): void {
    this.route.data.pipe(
      take(1)
    ).subscribe((res: { [key: string]: any }) => {
      this.idService = res['idService'];

      this.serviceInfo.getSteps(this.idService).pipe(
        take(1)
      ).subscribe(stepsRes => {
        this.steps = stepsRes;
        this.initForm();
        this.loading = false;

        this.subscriptions.push(
          this.serviceInfo.activeStep.subscribe(activeRes => {
            if (activeRes && activeRes[this.idService] !== undefined) {
              this.active = activeRes[this.idService];
            }
          })
        );
      });
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [this.optionsCat.length > 0 ? JSON.stringify(this.optionsCat[0]) : null, [Validators.required]],
        orderName: ['', [Validators.required, Validators.maxLength(100)]],
        telephone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        email: ['', [Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
      }),
      1: this.fb.group({
        city: [this.cityOptions.length > 0 ? JSON.stringify(this.cityOptions[0]) : null, [Validators.required]],
        street: [this.streetOptions.length > 0 ? JSON.stringify(this.streetOptions[0]) : null, [Validators.required]],
        floor: ['', [this.nonNegativeNumberValidator]],
        entrance: ['', [this.nonNegativeNumberValidator]]
      }),
      2: this.fb.group({
        shop: [this.shopOptions.length > 0 ? JSON.stringify(this.shopOptions[0]) : null, [Validators.required]],
        deliveryType: [this.deliveryTypeOptions.length > 0 ? JSON.stringify(this.deliveryTypeOptions[0]) : null, [Validators.required]],
        deliveryDate: ['', [Validators.required, this.dateValidator]],
        deliveryTime: ['', [Validators.required]],
      }),
      3: this.fb.group({
        products: [this.productOptions.length > 0 ? [JSON.stringify(this.productOptions[0])] : [], [Validators.required]]
      }),
      4: this.fb.group({
        comment: ['']
      }),
      5: this.fb.group({})
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });
  }

  private getPayloadForBackend(): any {
    const rawValueFromForm = this.form.getRawValue();

    const allFields: { [key: string]: any } = {};

    Object.keys(rawValueFromForm).forEach(groupKey => {
      if (typeof rawValueFromForm[groupKey] === 'object' && rawValueFromForm[groupKey] !== null) {
        Object.assign(allFields, rawValueFromForm[groupKey]);
      }
    });


    ['cat', 'city', 'street', 'shop', 'deliveryType'].forEach(key => {
      if (allFields[key]) {
        try {
          const parsed = JSON.parse(allFields[key]);
          if (parsed && typeof parsed === 'object' && parsed.hasOwnProperty('id')) {
            allFields[key] = parsed.id;
          }
        } catch (e) {
        }
      }
    });

    if (Array.isArray(allFields['products'])) {
      allFields['products'] = allFields['products'].map((jsonString: string) => {
        try {
          return JSON.parse(jsonString)?.id;
        } catch (e) {
          return null;
        }
      }).filter((id: number | null) => id !== null);
    }

    if (allFields['deliveryDate']) {
      const date = new Date(allFields['deliveryDate']);
      allFields['deliveryDate'] = date.toISOString().split('T')[0];
    }

    if (allFields['floor'] !== '' && allFields['floor'] !== null) {
      allFields['floor'] = Number(allFields['floor']);
    } else {
      allFields['floor'] = null;
    }
    if (allFields['entrance'] !== '' && allFields['entrance'] !== null) {
      allFields['entrance'] = Number(allFields['entrance']);
    } else {
      allFields['entrance'] = null;
    }

    return {
      mnemonic: this.idService,
      fields: allFields
    };
  }


  public isCurrentStepValid(): boolean {
    const currentStepFormGroup = this.form.get(this.active.toString()) as UntypedFormGroup;
    if (currentStepFormGroup) {
      return currentStepFormGroup.valid;
    }
    return false;
  }


  public markCurrentStepAsTouched(): void {
    const currentStepFormGroup = this.form.get(this.active.toString()) as UntypedFormGroup;
    if (currentStepFormGroup) {
      currentStepFormGroup.markAllAsTouched();
    }
  }


  public getFormPayload(): any {
    return this.getPayloadForBackend();
  }

}
