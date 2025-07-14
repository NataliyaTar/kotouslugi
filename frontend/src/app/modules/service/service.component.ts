// Файл не трогаем

import { Component, OnDestroy, OnInit } from '@angular/core';
import { StepsComponent } from '@components/steps/steps.component';
import { IStep } from '@models/step.model';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { AsyncPipe } from '@angular/common';
import { Subscription, take } from 'rxjs';
import { OrderService } from '@services/order/order.service';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [
    StepsComponent,
    RouterOutlet,
    AsyncPipe
  ],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent implements OnInit, OnDestroy {

  public steps: IStep[]; // список шагов формы
  public active: number; // активный шаг

  private idService: string; // мнемоника услуги
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private serviceInfo: ServiceInfoService,
    private orderService: OrderService,
  ) {
  }

  public ngOnInit() {
    this.subscriptions.push(
      // получаем мнемонику услуги
      this.route.children[0].data.subscribe(res => {
        this.idService = res['idService'];

        // по известной мнемонике запрашиваем список шагов
        this.serviceInfo.getSteps(this.idService).pipe(
          take(1)
        ).subscribe(res => {
          this.steps = res;
        });

        // сеттим значение активного шага
        this.serviceInfo.setActiveStep(this.idService, 0);
      })
    );

    this.subscriptions.push(
      // следим за активным шагом для данной услуги
      this.serviceInfo.activeStep.subscribe(res => {
        this.active = res?.[this.idService] || 0;
      })
    );
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  /**
   * Валиден ли шаг формы
   */
  public isValidStep(): boolean {
    return this.serviceInfo.servicesForms$?.value?.[this.idService]?.get(this.active.toString())?.valid || false;
  }

  /**
   * Переход к следующему шагу формы
   */
  public next(): void {
    this.active++;
    this.serviceInfo.setActiveStep(this.idService, this.active);
  }

  /**
   * Переход к предыдущему шагу формы
   */
  public prev(): void {
    this.active--;
    this.serviceInfo.setActiveStep(this.idService, this.active);
  }

  /**
   * Сохранение результатов заполнения формы
   */
  public save(): void {
    this.orderService.saveOrder(
      this.idService,
      this.serviceInfo.servicesForms$?.value?.[this.idService].getRawValue()
    ).subscribe(res => {
      alert('Ваша заявка зарегистрирована\nСтатус заказа: Оформлен\nНажмите «OK» для перехода на предыдущую страницу портала');
      window.history.back();
    }, error => {
      alert('Произошла ошибка, повторите попытку позже\nНажмите «OK» для перехода на предыдущую страницу портала');
      window.history.back();
    });
  }

}
