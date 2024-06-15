import { Component, OnDestroy, OnInit } from '@angular/core';
import { StepsComponent } from '@components/steps/steps.component';
import { IStep } from '@models/step.model';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { AsyncPipe } from '@angular/common';
import { Subscription, take } from 'rxjs';

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

  public save(): void {

  }

}
