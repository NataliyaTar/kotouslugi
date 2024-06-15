import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder, FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';

@Component({
  selector: 'app-born',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent
  ],
  templateUrl: './born.component.html',
  styleUrl: './born.component.scss'
})
export class BornComponent implements OnInit, OnDestroy {

  public form: UntypedFormGroup;
  public active: number;

  private idService: string;
  private subscriptions: Subscription[] = [];

  public getControl(id: string): FormControl {
    return this.form.get(`${this.active}.${id}`) as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
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
        name: ['а', [Validators.required, Validators.pattern(/^[А-яЁё]+$/)]],
        age: ['1', [Validators.required, Validators.pattern(/^[\d]+$/)]]
      })
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });
  }

}
