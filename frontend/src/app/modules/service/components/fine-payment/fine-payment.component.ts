import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, FormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take, forkJoin } from 'rxjs';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ConstantsService } from '@services/constants/constants.service';
import { FineService } from '@services/fine/fine.service';
import { IValueCat } from '@models/cat.model';
import { IStep } from '@models/step.model';
import { CommonModule } from '@angular/common';

export enum FormMap {
  cat = 'Кот',
  fines = 'Выбранные штрафы'
}

// Штраф в том виде, в каком его показывает шаблон
interface IDisplayFine {
  id: number;
  number: string;
  date: string;
  reason: string;
  amount: number;
  dueDate: string;
  status: string;
  selected: boolean;
}

@Component({
  selector: 'app-fine-payment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
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

  // штрафы выбранного кота (приходят с бэкенда)
  public fines: IDisplayFine[] = [];

  public totalAmount = 0;
  public paymentSuccess = false;
  public paymentError = false;
  public paymentHistory: any[] = [];

  // чек (заполняется при оплате)
  public receipt = {
    number: '',
    date: '',
    cat: '',
    fines: [] as { number: string; amount: number }[],
    total: 0
  };

  private idService!: string;
  private steps: IStep[] = [];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    const rawValue = this.form.getRawValue();
    return this.serviceInfo.prepareDataForPreview(
      {
        0: rawValue[0],
        1: rawValue[1]
      },
      this.steps.slice(0, 2),
      FormMap
    );
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
    private fineService: FineService,
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
            // при переходе на шаг «штрафы» подгружаем их для выбранного кота
            if (this.active === 1) {
              this.loadFines();
            }
          })
        );

        this.initForm();
      });

  }

  //Форма
  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [
          JSON.stringify(this.optionsCat[0]),
          [Validators.required]
        ]
      }),
      1: this.fb.group({
        fines: ['']
      }),
      2: this.fb.group({}), // чек
      3: this.fb.group({}), // история оплат
      4: this.fb.group({})  // проверка
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

  // загрузка неоплаченных штрафов выбранного кота с бэкенда
  private loadFines(): void {
    const raw = this.form?.get('0.cat')?.value;
    if (!raw) {
      return;
    }

    let catId: number;
    try {
      catId = JSON.parse(raw).id;
    } catch (e) {
      return;
    }

    this.fineService.getFinesByCat(catId)
      .pipe(take(1))
      .subscribe(res => {
        // показываем только неоплаченные штрафы
        this.fines = res
          .filter(fine => fine.status === 'UNPAID')
          .map(fine => ({
            id: fine.id,
            number: 'ШТ-' + fine.id,
            date: this.formatDate(fine.created),
            reason: fine.reason,
            amount: fine.amount,
            dueDate: this.formatDate(fine.created, 20),
            status: 'Не оплачен',
            selected: false
          }));
        // История оплат
        this.paymentHistory = res
          .filter(fine => fine.status === 'PAID')
          .map(fine => ({
            id: fine.id,
            number: 'ШТ-' + fine.id,
            date: this.formatDate(fine.created),
            reason: fine.reason,
            amount: fine.amount,
            status: 'Оплачен',
            paidDate: new Date(fine.created)
          }));
        this.paymentSuccess = false;
        this.calculateTotal();
      });
  }

  // дата в формате дд.мм.гггг (addDays — сдвиг для срока оплаты)
  private formatDate(iso: string, addDays = 0): string {
    const d = new Date(iso);
    if (addDays) {
      d.setDate(d.getDate() + addDays);
    }
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  //оплата штрафов
  public paySelected(): void {
    const selected = this.fines.filter(fine => fine.selected);

    this.form.get('1.fines')?.setValue(
      selected.map(f => `ШТ-${f.id} (${f.amount} ₽)`).join(', ')
    );

    if (!selected.length) {
      this.paymentError = true;
      return;
    }
    this.paymentError = false;

    // реально оплачиваем каждый выбранный штраф на бэкенде
    forkJoin(selected.map(fine => this.fineService.payFine(fine.id)))
      .subscribe(() => {
        const raw = this.form.get('0.cat')?.value;

        // чек по оплаченным
        this.receipt = {
          number: 'CHK-' + Date.now().toString().slice(-5),
          date: this.formatDate(new Date().toISOString()),
          cat: raw ? JSON.parse(raw).text : '',
          fines: selected.map(fine => ({ number: fine.number, amount: fine.amount })),
          total: selected.reduce((sum, fine) => sum + fine.amount, 0)
        };

        // история + пометка оплаченными (уходят из списка)
        selected.forEach(fine => {
          this.paymentHistory.push({ ...fine, status: 'Оплачен', paidDate: new Date() });
          fine.status = 'Оплачен';
          fine.selected = false;
        });

        this.calculateTotal();
        this.paymentSuccess = true;
      });
  }


  public changeFine(): void {
    this.calculateTotal();
    if (this.totalAmount > 0) {
      this.paymentError = false;
    }
  }
}
