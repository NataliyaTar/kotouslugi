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
import { FoodService } from '@services/food/food.service';

export enum FormMap {
  cat = 'Кличка',
  ownerName = 'Имя владельца',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
  city = 'Город',
  street = 'Улица',
  house = 'Дом',
  apartment = 'Квартира',
  shop = 'Магазин',
  products = 'Продукты',
  deliveryDate = 'Дата доставки',
  deliveryTime = 'Время доставки',
  comment = 'Комментарий'
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
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit, OnDestroy {

  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[];
  public shops: any[] = [];
  public products: any[] = [];

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
    private foodService: FoodService
  ) {}

  public ngOnInit(): void {
    this.getCatOption();
    this.loadShops();
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
        email: ['', [Validators.email]]
      }),
      1: this.fb.group({
        city: ['', [Validators.required, this.capitalizeValidator]],
        street: ['', [Validators.required, this.capitalizeValidator]],
        house: ['', [Validators.required, Validators.min(1)]],
        apartment: ['']
      }),
      2: this.fb.group({
        shop: ['', [Validators.required]],
        products: [[], [Validators.required]],
        deliveryDate: ['', [Validators.required, this.dateValidator]],
        deliveryTime: ['']
      }),
      3: this.fb.group({
        comment: ['']
      })
    });

    this.form.get('2.shop')?.valueChanges.subscribe(shopId => {
      if (shopId) this.loadProducts(shopId);
    });

    this.serviceInfo.servicesForms$.next({ [this.idService]: this.form });
    this.loading = false;
  }

  private loadShops(): void {
    this.foodService.getShops().subscribe(shops => {
      this.shops = shops;
    });
  }

  private loadProducts(shopId: number): void {
    this.foodService.getProducts(shopId).subscribe(products => {
      this.products = products;
    });
  }

  private dateValidator(control: FormControl) {
    return new Date(control.value) < new Date() ? { minDate: true } : null;
  }

  private capitalizeValidator(control: FormControl) {
    const value = control.value;
    if (value && value[0] !== value[0]?.toUpperCase()) {
      return { capitalize: true };
    }
    return null;
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public submitOrder(): void {
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      const orderData = {
        cat: JSON.parse(formData[0].cat),
        ownerName: formData[0].ownerName,
        telephone: formData[0].telephone,
        email: formData[0].email,
        address: {
          city: formData[1].city,
          street: formData[1].street,
          house: formData[1].house,
          apartment: formData[1].apartment
        },
        shopId: formData[2].shop,
        products: formData[2].products,
        deliveryDate: formData[2].deliveryDate,
        deliveryTime: formData[2].deliveryTime,
        comment: formData[3].comment
      };

      this.foodService.createOrder(orderData).subscribe(() => {
        const nextStep = this.active + 1;
        this.serviceInfo.setActiveStep(this.idService, nextStep);
      });
    }
  }
}
