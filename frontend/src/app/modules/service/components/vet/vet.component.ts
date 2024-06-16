import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IValue } from '@models/cat.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CatService } from '@services/cat/cat.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';

@Component({
  selector: 'app-vet',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent
  ],
  templateUrl: './vet.component.html',
  styleUrl: './vet.component.scss'
})
export class VetComponent implements OnInit, OnDestroy {

  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValue[] = [];
  public doctors: IValue[] = [
    {
      id: 0,
      text: 'Терапевт'
    },
    {
      id: 1,
      text: 'Ортопед'
    },
    {
      id: 2,
      text: 'Офтальмолог'
    },
    {
      id: 3,
      text: 'Хирург'
    },
    {
      id: 4,
      text: 'Дерматолог'
    }
  ];

  private idService: string;
  private subscriptions: Subscription[] = [];

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
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
        cat: ['а', [Validators.required]],
        telephone: ['11111111111', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        email: ['dd@ff.ff', [Validators.email]]
      }),
      1: this.fb.group({
        anamnesis: ['', [Validators.required, Validators.max(256)]]
      }),
      2: this.fb.group({
        doctor: ['', [Validators.required, Validators.pattern(/^[а-яА-ЯёЁ\d\s]+$/)]],
        date: ['', [Validators.required]],
        time: ['', [Validators.required]]
      })
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.form.get('2.date').valueChanges.subscribe(res => {
      console.log(res);
    })
  }

}
