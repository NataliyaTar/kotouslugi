import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ICat, IValueCat } from '@models/cat.model';
import { IPoliticalParty } from '@models/party.model';
import { IPassportDocument } from '@models/passport.model';
import { IStep } from '@models/step.model';
import { forkJoin, of, Subscription, take } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from '@services/constants/constants.service';
import { CatService } from '@services/cat/cat.service';
import { PartyService } from '@services/party/party.service';
import { PassportService } from '@services/passport/passport.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';

export enum FormMap {
  cat = 'Кличка',
  passportNumber = 'Номер паспорта',
  partyName = 'Партия',
}

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [ReactiveFormsModule, CheckInfoComponent, ThrobberComponent],
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.scss'
})
export class VotingComponent implements OnInit, OnDestroy {

  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[];
  public parties: IPoliticalParty[] = [];
  public voterError: string | null = null;

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];
  private catsById = new Map<number, ICat>();
  private passportsByNumber = new Map<string, IPassportDocument>();

  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
    private catService: CatService,
    private partyService: PartyService,
    private passportService: PassportService,
  ) {}

  public ngOnInit(): void {
    this.loadData();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private loadData(): void {
    forkJoin({
      options: this.constantService.getCatOptionsAll().pipe(take(1)),
      cats: this.catService.getCatList().pipe(take(1), catchError(() => of([] as ICat[]))),
      parties: this.partyService.getParties().pipe(take(1), catchError(() => of([] as IPoliticalParty[]))),
      passports: this.passportService.getApprovedPassports().pipe(take(1), catchError(() => of([] as IPassportDocument[]))),
    }).subscribe(({ options, cats, parties, passports }) => {
      this.optionsCat = options;
      cats.forEach(cat => this.catsById.set(cat.id, cat));
      this.parties = parties ?? [];
      this.passportsByNumber.clear();
      (passports ?? []).forEach(passport => {
        if (passport.passportNumber) {
          this.passportsByNumber.set(passport.passportNumber, passport);
        }
      });
      this.prepareService();
    });
  }

  private prepareService(): void {
    this.route.data.pipe(take(1)).subscribe(res => {
      this.idService = res['idService'];

      this.serviceInfo.getSteps(this.idService).pipe(take(1)).subscribe(steps => {
        this.steps = steps;
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
        passportNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[\d]{4} [\d]{6}$/),
            (control: AbstractControl) => this.voterPassportValidator(control),
          ],
        ],
      }),
      1: this.fb.group({
        partyName: ['', [Validators.required]],
      }),
    });

    this.subscriptions.push(
      this.getControl(0, 'passportNumber').valueChanges.subscribe(() => {
        this.refreshVoterError();
      }),
      this.getControl(0, 'cat').valueChanges.subscribe(() => {
        this.getControl(0, 'passportNumber').updateValueAndValidity({ emitEvent: false });
        this.refreshVoterError();
      }),
    );

    this.serviceInfo.servicesForms$.next({ [this.idService]: this.form });
    this.loading = false;
  }

  /**
   * Паспорт должен существовать и принадлежать выбранному коту.
   * Возраст выбранного кота ≥ 3.
   */
  private voterPassportValidator(control: AbstractControl): ValidationErrors | null {
    const number = String(control.value ?? '').trim();
    if (!number || !/^[\d]{4} [\d]{6}$/.test(number)) {
      return null;
    }

    const passport = this.passportsByNumber.get(number);
    if (!passport || !passport.catId) {
      return { passportNotFound: true };
    }

    const selectedCatId = this.getSelectedCatId();
    if (!selectedCatId || passport.catId !== selectedCatId) {
      return { passportOwnerMismatch: true };
    }

    const cat = this.catsById.get(selectedCatId);
    if (!cat) {
      return { passportNotFound: true };
    }

    const age = Number.parseInt(cat.age, 10);
    if (Number.isFinite(age) && age < 3) {
      return { tooYoung: true };
    }

    return null;
  }

  private getSelectedCatId(): number | null {
    const raw = this.form?.get('0.cat')?.value;
    if (typeof raw !== 'string' || !raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as IValueCat;
      const id = Number(parsed?.id);
      return Number.isFinite(id) ? id : null;
    } catch {
      return null;
    }
  }

  private refreshVoterError(): void {
    const errors = this.getControl(0, 'passportNumber').errors;
    if (errors?.['passportNotFound'] || errors?.['passportOwnerMismatch']) {
      this.voterError = 'Неверный паспорт';
    } else if (errors?.['tooYoung']) {
      this.voterError = 'Голосование доступно только котам с 3 лет';
    } else {
      this.voterError = null;
    }
  }

  public getItem(index: number): string {
    return JSON.stringify(this.optionsCat[index]);
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public onPassportNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 10);
    const formatted = digits.length > 4
      ? `${digits.slice(0, 4)} ${digits.slice(4)}`
      : digits;

    this.getControl(0, 'passportNumber').setValue(formatted);
    input.value = formatted;
  }

  public selectParty(name: string): void {
    this.getControl(1, 'partyName').setValue(name);
    this.getControl(1, 'partyName').markAsTouched();
  }

  public isPartySelected(name: string): boolean {
    return this.getControl(1, 'partyName').value === name;
  }
}
