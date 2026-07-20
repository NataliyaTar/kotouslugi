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

  public steps: IStep[];
  public active: number;

  private idService: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private serviceInfo: ServiceInfoService,
    private orderService: OrderService,
  ) {
  }

  public ngOnInit() {
    this.subscriptions.push(
      this.route.children[0].data.subscribe(res => {
        this.idService = res['idService'];

        this.serviceInfo.getSteps(this.idService).pipe(
          take(1)
        ).subscribe(res => {
          this.steps = res;
        });

        this.serviceInfo.setActiveStep(this.idService, 0);
      })
    );

    this.subscriptions.push(
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

  public isValidStep(): boolean {
    return this.serviceInfo.servicesForms$?.value?.[this.idService]?.get(this.active.toString())?.valid || false;
  }

  public next(): void {
    this.active++;
    this.serviceInfo.setActiveStep(this.idService, this.active);
  }

  public prev(): void {
    this.active--;
    this.serviceInfo.setActiveStep(this.idService, this.active);
  }

  /**
   * Сохранение результатов заполнения формы
   */
  public save(): void {
    const rawValue = this.serviceInfo.servicesForms$?.value?.[this.idService].getRawValue();

    let dataToSave = rawValue;

    // Для услуги "driving-license" сохраняем полные данные о коте
    if (this.idService === 'driving-license' && rawValue?.['0']?.cat) {
        const catData = JSON.parse(rawValue['0'].cat);

        dataToSave = {
          '0': {
            catName: catData.text || catData.name || 'Кот',
            catAge: catData.age || 1,
            catBreed: catData.breed || 'Не указана',
            catSex: catData.sex || 'Не указан'
          },
          '1': rawValue['1'] || {},
          '2': rawValue['2'] || {}
        };
    }
    this.orderService.saveOrder(
      this.idService,
      dataToSave
    ).subscribe({
      next: (res) => {
        console.log('✅ Заявка сохранена, ответ:', res);
        alert('Ваша заявка зарегистрирована\nНажмите «OK» для перехода на предыдущую страницу портала');
        window.history.back();
      },
      error: (error) => {
        console.error('❌ Ошибка сохранения:', error);
        alert('Произошла ошибка, повторите попытку позже\nНажмите «OK» для перехода на предыдущую страницу портала');
        window.history.back();
      }
    });
  }

}
