import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, FormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ConstantsService } from '@services/constants/constants.service';
import { IValueCat } from '@models/cat.model';
import { IStep } from '@models/step.model';

export enum FormMap {
  cat = 'Кот',
  document = 'Номер документа',
  fines = 'Выбранные штрафы'
}

@Component({
  selector: 'app-fine-payment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CheckInfoComponent,
    ThrobberComponent
  ],
  templateUrl: './fine-payment.component.html',
  styleUrl: './fine-payment.component.scss'
})

export class FinePaymentComponent implements OnInit, OnDestroy {
  public loading = true;
  public form!: UntypedFormGroup;
  public active = 0;
  public optionsCat: IValueCat[] = [];

  // ЗАМЕНИТЬ!!!
  public fines = [
    {
      id: 1,
      number: 'ШТ-10001',
      date: '12.05.2026',
      reason: 'Превышение скорости',
      amount: 500,
      dueDate: '25.07.2026',
      status: 'Не оплачен',
      selected: false
    },
    {
      id: 2,
      number: 'ШТ-10002',
      date: '18.05.2026',
      reason: 'Неправильная парковка',
      amount: 1200,
      dueDate: '30.07.2026',
      status: 'Не оплачен',
      selected: false
    },
    {
      id: 3,
      number: 'ШТ-10002',
      date: '18.05.2026',
      reason: 'Неправильная парковка',
      amount: 1200,
      dueDate: '30.07.2026',
      status: 'Не оплачен',
      selected: false
    },
    {
      id: 4,
      number: 'ШТ-10002',
      date: '18.05.2026',
      reason: 'Неправильная парковка',
      amount: 1200,
      dueDate: '30.07.2026',
      status: 'Не оплачен',
      selected: false
    }
  ];

  public totalAmount = 0;
  public paymentSuccess = false;
  public paymentError = false;

  private idService!: string;
  private steps: IStep[] = [];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(
      this.form.getRawValue(),
      this.steps,
      FormMap
    );
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCats();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  //Список котов
  private loadCats(): void {
    this.constantService.getCatOptionsAll()
      .pipe(take(1))
      .subscribe(res => {
        this.optionsCat = res;
        this.prepareService();
      });
  }


  private prepareService(): void {

    this.route.data
      .pipe(take(1))
      .subscribe(res => {

        this.idService = res['idService'];

        this.serviceInfo.getSteps(this.idService)
          .pipe(take(1))
          .subscribe(steps => {
            this.steps = steps;
          });

        this.subscriptions.push(
          this.serviceInfo.activeStep.subscribe(step => {
            this.active = step?.[this.idService] || 0;
          })
        );

        this.initForm();
      });

  }

  //Формаг
  private initForm(): void {

    this.form = this.fb.group({

      0: this.fb.group({
        cat: [
          JSON.stringify(this.optionsCat[0]),
          [Validators.required]
        ],
        document: [
          '',
          [
            Validators.required,
            Validators.minLength(5)
          ]
        ]
      }),

      1: this.fb.group({
        fines: ['']
      })

    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  //Control
  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  //получает кота
  public getItem(index: number): string {
    return JSON.stringify(this.optionsCat[index]);
  }

  //сумма штр
  public calculateTotal(): void {
    this.totalAmount = this.fines
      .filter(fine => fine.selected)
      .reduce((sum, fine) => sum + fine.amount, 0);
  }

  //оплата штрафов
  public paySelected(): void {

    const selected = this.fines.filter(fine => fine.selected);

    if (!selected.length) {
      this.paymentError = true;
      return;
    }

    this.paymentError = false;

    selected.forEach(fine => {
      fine.status = 'Оплачен';
      fine.selected = false;
    });

    this.calculateTotal();
    this.paymentSuccess = true;



    alert('Оплата прошла успешно!');

  }

  //меняемчекбокс
  public changeFine(): void {
    this.calculateTotal();

    if (this.totalAmount > 0) {
      this.paymentError = false;
    }
  }

  //открываем чек
  public openReceipt(): void {
    this.router.navigate(['/service/receipt']);
  }
}

