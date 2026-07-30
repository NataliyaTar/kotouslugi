// Файл не трогаем

import { Component, OnDestroy, OnInit } from '@angular/core';
import { StepsComponent } from '@components/steps/steps.component';
import { IStep } from '@models/step.model';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { AsyncPipe } from '@angular/common';
import { Observable, Subscription, take } from 'rxjs';
import { OrderService } from '@services/order/order.service';
import { PassportService } from '@services/passport/passport.service';
import { VotingService } from '@services/voting/voting.service';
import { PartyService } from '@services/party/party.service';

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
    private passportService: PassportService,
    private votingService: VotingService,
    private partyService: PartyService,
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
    const rawValue = this.serviceInfo.servicesForms$?.value?.[this.idService].getRawValue();
    const request$: Observable<unknown> = this.buildSaveRequest(rawValue);

    request$.subscribe({
      next: () => {
        alert('Ваша заявка зарегистрирована\nНажмите «OK» для перехода на предыдущую страницу портала');
        window.history.back();
      },
      error: (error: unknown) => {
        const message = error instanceof Error && error.message
          ? error.message
          : 'Произошла ошибка, повторите попытку позже';
        alert(`${message}\nНажмите «OK» для перехода на предыдущую страницу портала`);
        window.history.back();
      },
    });
  }

  private buildSaveRequest(rawValue: Record<string, Record<string, unknown>>): Observable<unknown> {
    switch (this.idService) {
      case 'passport':
        return this.passportService.createRequisition(rawValue);
      case 'voting':
        return this.votingService.castOnline(
          this.votingService.buildRequest(
            this.extractCatId(rawValue['0']?.['cat']),
            String(rawValue['1']?.['partyName'] ?? ''),
            String(rawValue['0']?.['passportNumber'] ?? ''),
          ),
        );
      case 'party': {
        const step = rawValue['0'] ?? {};
        const logoUrl = String(step['logoUrl'] ?? '').trim();
        return this.partyService.addParty({
          name: String(step['name'] ?? ''),
          description: String(step['description'] ?? ''),
          candidateCatId: this.extractCatId(step['cat']),
          passportNumber: String(step['passportNumber'] ?? ''),
          ...(logoUrl ? { logoUrl } : {}),
        });
      }
      default:
        return this.orderService.saveOrder(this.idService, rawValue);
    }
  }

  private extractCatId(catValue: unknown): number {
    if (typeof catValue === 'number' && Number.isFinite(catValue)) {
      return catValue;
    }

    if (typeof catValue === 'string') {
      try {
        const parsed = JSON.parse(catValue);
        const id = Number(parsed?.id ?? catValue);
        if (Number.isFinite(id)) {
          return id;
        }
      } catch {
        const id = Number(catValue);
        if (Number.isFinite(id)) {
          return id;
        }
      }
    }

    return 0;
  }

}
