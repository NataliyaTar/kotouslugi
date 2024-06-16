import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder, FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { Subscription, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { CatService } from '@services/cat/cat.service';
import { IValue } from '@models/cat.model';
import { IStep } from '@models/step.model';

@Component({
  selector: 'app-born',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
  ],
  templateUrl: './new-family.component.html',
  styleUrl: './new-family.component.scss'
})
export class NewFamilyComponent implements OnInit, OnDestroy {

  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValue[] = [];
  public steps: IStep[];

  private idService: string;
  private subscriptions: Subscription[] = [];

  public get getResult() {
    return this.form.getRawValue();
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private catService: CatService,
  ) {
  }

  public ngOnInit(): void {
    this.subscriptions.push(
      this.route.data.subscribe(res => {
        this.idService = res['idService'];

        this.subscriptions.push(
          this.serviceInfo.activeStep.subscribe(res => {
            this.active = res?.[this.idService] || 0;
          })
        );

        this.initForm();

        this.catService.getCatList().pipe(
          take(1)
        ).subscribe(res => {
          this.optionsCat = res.map((item) => {
            return {
              id: item.id,
              text: item.name
            }
          });
        });

        this.serviceInfo.getSteps(this.idService).pipe(
          take(1)
        ).subscribe(res => {
          this.steps = res;
        });
      })
    );
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat1: ['', [Validators.required]],
        passport: ['1111 111111', [Validators.required, Validators.pattern(/^[\d]{4} [\d]{6}$/)]]
      }),
      1: this.fb.group({
        cat2: ['', [Validators.required]],
        passport: ['1111 111111', [Validators.required, Validators.pattern(/^([\d]{4} [\d]{6})$/)]]
      }),
      2: this.fb.group({
        place: ['фф', [Validators.required, Validators.pattern(/^[а-яА-ЯёЁ\d\s]+$/)]],
        date: ['2024-11-03', [Validators.required]],
        time: ['12:30', [Validators.required]]
      })
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

}
