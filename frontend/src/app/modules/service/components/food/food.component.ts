import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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

export enum FormMap {
  cat = 'Кличка кота',
  ownerName = 'Имя владельца',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
  city = 'Город',
  street = 'Улица',
  house = 'Дом',
  apartment = 'Квартира',
  shop = 'Магазин',
  deliveryType = 'Тип доставки',
  deliveryDate = 'Дата доставки',
  deliveryTime = 'Время доставки',
  products = 'Выбранные товары',
  comment = 'Комментарий к заказу'
}

interface IProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
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
  public optionsCat: IValueCat[] = [];
  public cityOptions: { id: number; name: string }[] = [];
  public streetOptions: { id: number; name: string }[] = [];
  public shopOptions: { id: number; name: string }[] = [];
  public productOptions: IProduct[] = [];
  public selectedProducts: IProduct[] = [];

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    const formData = this.form.getRawValue();
    const result = {
      ...formData,
      products: this.selectedProducts,
      totalPrice: this.getTotalPrice()
    };
    return this.serviceInfo.prepareDataForPreview(result, this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private catService: CatService,
    private constantService: ConstantsService
  ) {}

  public ngOnInit(): void {
    this.getCatOption();
    this.loadStaticData();
  }

  private loadStaticData(): void {
    // Временные данные - потом заменим на API
    this.cityOptions = [
      { id: 1, name: 'Москва' },
      { id: 2, name: 'Санкт-Петербург' },
      { id: 3, name: 'Новосибирск' }
    ];

    this.shopOptions = [
      { id: 1, name: 'Зоомагазин "Котофей"' },
      { id: 2, name: 'Зоомагазин "Мурмаркет"' },
      { id: 3, name: 'Зоомагазин "КотБатон"' }
    ];

    this.productOptions = [
      {
        id: 1,
        name: 'Сухой корм для взрослых',
        price: 1200,
        description: 'Премиум качество, 5 кг'
      },
      {
        id: 2,
        name: 'Влажный корм для котят',
        price: 850,
        description: 'Нежные кусочки, 12 пакетиков'
      },
      {
        id: 3,
        name: 'Лакомства для кошек',
        price: 350,
        description: 'Ассорти 5 видов, 100 г'
      },
      {
        id: 4,
        name: 'Наполнитель древесный',
        price: 600,
        description: 'Экологичный, 10 л'
      }
    ];
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  private getCatOption(): void {
    this.constantService.getCatOptionsAll().pipe(take(1)).subscribe((res: IValueCat[]) => {
      this.optionsCat = res;
      this.prepareService();
    });
  }

  private prepareService(): void {
    this.route.data.pipe(take(1)).subscribe(res => {
      this.idService = res['idService'];

      this.serviceInfo.getSteps(this.idService).pipe(take(1)).subscribe(res => {
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
        ownerName: ['', [Validators.required]],
        telephone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        email: ['', [Validators.required, Validators.email]]
      }),
      1: this.fb.group({
        city: ['', [Validators.required]],
        street: ['', [Validators.required]],
        house: [null, [Validators.required, this.positiveNumberValidator]],
        apartment: [null, this.optionalPositiveNumberValidator]
      }),
      2: this.fb.group({
        shop: ['', [Validators.required]],
        deliveryType: ['delivery', [Validators.required]],
        deliveryDate: ['', [Validators.required, this.dateValidator]],
        deliveryTime: ['']
      }),
      3: this.fb.group({
        products: [[], [Validators.required, Validators.minLength(1)]]
      }),
      4: this.fb.group({
        comment: ['']
      })
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  private dateValidator(control: AbstractControl): ValidationErrors | null {
    if (new Date(control.value) < new Date()) {
      return { minDate: true };
    }
    return null;
  }

  private positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = Number(control.value);
    return value >= 1 ? null : { positive: true };
  }

  private optionalPositiveNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return Number(value) >= 1 ? null : { positive: true };
  }

  public getItem(type: 'cat' | 'city' | 'street' | 'shop', index: number): string {
    switch (type) {
      case 'cat': return JSON.stringify(this.optionsCat[index]);
      case 'city': return JSON.stringify(this.cityOptions[index]);
      case 'street': return JSON.stringify(this.streetOptions[index]);
      case 'shop': return JSON.stringify(this.shopOptions[index]);
      default: return '';
    }
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public onCitySelect(cityId: number): void {
    // Здесь будет запрос к API для получения улиц
    // Временные данные
    this.streetOptions = [
      { id: 1, name: 'Ленина' },
      { id: 2, name: 'Пушкина' },
      { id: 3, name: 'Гагарина' },
      { id: 4, name: 'Центральная' }
    ];
  }

  public toggleProduct(product: IProduct): void {
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index >= 0) {
      this.selectedProducts.splice(index, 1);
    } else {
      this.selectedProducts.push(product);
    }
    this.form.get('3.products').setValue(this.selectedProducts);
  }

  public isProductSelected(product: IProduct): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

  public getTotalPrice(): number {
    return this.selectedProducts.reduce((sum, product) => sum + product.price, 0);
  }
}
