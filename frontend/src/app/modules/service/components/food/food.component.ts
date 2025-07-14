import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CatService } from '@services/cat/cat.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { JsonPipe } from '@angular/common';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { IValue } from '@models/common.model';

export enum FormMap {
  cat = 'Кличка кота',
  orderName = 'Имя для заказа',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
  city = 'Город',
  street = 'Улица',
  floor = 'Этаж',
  entrance = 'Подъезд',
  shop = 'Магазин',
  deliveryType = 'Тип доставки',
  deliveryDate = 'Дата доставки',
  deliveryTime = 'Время доставки',
  products = 'Продукты',
  comment = 'Комментарий к заказу'
}

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe,
    ThrobberComponent,
  ],
  templateUrl: './food.component.html',
  styleUrl: './food.component.scss'
})
export class FoodComponent implements OnInit, OnDestroy {
  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[];
  public shopOptions = this.constantService.shopOptions;
  public deliveryTypeOptions = this.constantService.deliveryTypeOptions;
  public productOptions = this.constantService.productOptions;
  public cityOptions = this.constantService.cityOptions;
  public streetOptions = this.constantService.streetOptions;

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];
  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMap);
  }
  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private catService: CatService,
    private constantService: ConstantsService,
  ) {
  }
  public ngOnInit(): void {
    this.getCatOption();
  }
  public ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }
  private getCatOption(): void {
    this.constantService.getCatOptionsAll().pipe(
      take(1)
    ).subscribe((res: IValueCat[]) => {
      this.optionsCat = res;
      this.prepareService();
    });
  }
  private prepareService(): void {
    this.route.data.pipe(
      take(1)
    ).subscribe(res => {
      this.idService = res['idService'];
      this.serviceInfo.getSteps(this.idService).pipe(
        take(1)
      ).subscribe(res => {
        this.steps = res;
      });
      this.subscriptions.push(
        this.serviceInfo.activeStep.subscribe(res => {
          this.active = res?.[this.idService] || 0;
        })
      );
      this.initForm();
    });
  }
  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [JSON.stringify(this.optionsCat[0]), [Validators.required]],
        orderName: ['', [Validators.required, Validators.maxLength(100)]],
        telephone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        email: ['', [Validators.email]]
      }),
      1: this.fb.group({
        city: [JSON.stringify(this.cityOptions[0]), [Validators.required]],
        street: [JSON.stringify(this.streetOptions[0]), [Validators.required]],
        floor: [''],
        entrance: ['']
      }),
      2: this.fb.group({
        shop: [JSON.stringify(this.shopOptions[0]), [Validators.required]],
        deliveryType: [JSON.stringify(this.deliveryTypeOptions[0]), [Validators.required]],
        deliveryDate: ['', [Validators.required, this.dateValidator]],
        deliveryTime: ['', [Validators.required]],
        products: [[JSON.stringify(this.productOptions[0])], [Validators.required]]
      }),
      3: this.fb.group({
        comment: ['']
      }),
      4: this.fb.group({})
    });
    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });
    this.loading = false;
  }
  private dateValidator(control: FormControl) {
    if (new Date(control.value) < new Date()) {
      return {minDate: true};
    }
    return null;
  }
  public getItem(type: 'cat' | 'shop' | 'deliveryType' | 'product' | 'city' | 'street', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    if (type === 'shop') {
      return JSON.stringify(this.shopOptions[index]);
    }
    if (type === 'deliveryType') {
      return JSON.stringify(this.deliveryTypeOptions[index]);
    }
    if (type === 'product') {
      return JSON.stringify(this.productOptions[index]);
    }
    if (type === 'city') {
      return JSON.stringify(this.cityOptions[index]);
    }
    if (type === 'street') {
      return JSON.stringify(this.streetOptions[index]);
    }
    return '';
  }
  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }
} 