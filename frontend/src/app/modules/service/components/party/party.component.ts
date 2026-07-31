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
import { PassportService } from '@services/passport/passport.service';
import { PartyService } from '@services/party/party.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';

export enum FormMap {
  name = 'Название',
  description = 'Описание',
  logoUrl = 'Логотип',
  cat = 'Кандидат',
  passportNumber = 'Номер паспорта',
}

@Component({
  selector: 'app-party',
  standalone: true,
  imports: [ReactiveFormsModule, CheckInfoComponent, ThrobberComponent],
  templateUrl: './party.component.html',
  styleUrl: './party.component.scss'
})
export class PartyComponent implements OnInit, OnDestroy {

  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[];
  public candidateError: string | null = null;
  public passportError: string | null = null;
  public nameError: string | null = null;

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];
  private catsById = new Map<number, ICat>();
  private passportsByNumber = new Map<string, IPassportDocument>();
  private partyNames = new Set<string>();
  private candidateCatIds = new Set<number>();

  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
    private catService: CatService,
    private passportService: PassportService,
    private partyService: PartyService,
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
      this.catsById.clear();
      (cats ?? []).forEach(cat => this.catsById.set(cat.id, cat));

      this.passportsByNumber.clear();
      (passports ?? []).forEach(passport => {
        if (passport.passportNumber) {
          this.passportsByNumber.set(passport.passportNumber, passport);
        }
      });

      this.partyNames.clear();
      this.candidateCatIds.clear();
      (parties ?? []).forEach(party => {
        if (party.name) {
          this.partyNames.add(party.name.trim().toLowerCase());
        }
        if (party.candidateCatId != null) {
          this.candidateCatIds.add(Number(party.candidateCatId));
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
        name: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            (control: AbstractControl) => this.partyNameValidator(control),
          ],
        ],
        description: ['', [Validators.required]],
        logoUrl: [''],
        cat: [
          JSON.stringify(this.optionsCat[0]),
          [
            Validators.required,
            (control: AbstractControl) => this.candidateValidator(control),
          ],
        ],
        passportNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[\d]{4} [\d]{6}$/),
            (control: AbstractControl) => this.partyPassportValidator(control),
          ],
        ],
      }),
    });

    this.subscriptions.push(
      this.getControl(0, 'name').valueChanges.subscribe(() => this.refreshNameError()),
      this.getControl(0, 'passportNumber').valueChanges.subscribe(() => this.refreshPassportError()),
      this.getControl(0, 'cat').valueChanges.subscribe(() => {
        this.getControl(0, 'passportNumber').updateValueAndValidity({ emitEvent: false });
        this.refreshCandidateError();
        this.refreshPassportError();
      }),
    );

    this.refreshNameError();
    this.refreshCandidateError();
    this.refreshPassportError();

    const catControl = this.getControl(0, 'cat');
    if (catControl.invalid) {
      catControl.markAsTouched();
    }

    const passportControl = this.getControl(0, 'passportNumber');
    if (passportControl.invalid) {
      passportControl.markAsTouched();
    }

    this.serviceInfo.servicesForms$.next({ [this.idService]: this.form });
    this.loading = false;
  }

  /** Название не должно совпадать с уже существующей партией. */
  private partyNameValidator(control: AbstractControl): ValidationErrors | null {
    const name = String(control.value ?? '').trim().toLowerCase();
    if (!name) {
      return null;
    }
    return this.partyNames.has(name) ? { duplicateName: true } : null;
  }

  /** Кот не должен уже быть кандидатом другой партии; возраст ≥ 4. */
  private candidateValidator(control: AbstractControl): ValidationErrors | null {
    const option = this.parseCatOption(control.value);
    if (!option?.id) {
      return null;
    }

    if (this.candidateCatIds.has(option.id)) {
      return { alreadyCandidate: true };
    }

    const cat = this.catsById.get(option.id);
    const age = Number.parseInt(cat?.age ?? '', 10);
    if (Number.isFinite(age) && age < 4) {
      return { tooYoung: true };
    }

    return null;
  }

  private refreshNameError(): void {
    const errors = this.getControl(0, 'name').errors;
    this.nameError = errors?.['duplicateName']
      ? 'Партия с таким названием уже существует'
      : null;
  }

  private refreshCandidateError(): void {
    const errors = this.getControl(0, 'cat').errors;
    if (errors?.['alreadyCandidate']) {
      this.candidateError = 'Этот кот уже является кандидатом другой партии';
    } else if (errors?.['tooYoung']) {
      this.candidateError = 'Кандидат должен быть старше 3 лет';
    } else {
      this.candidateError = null;
    }
  }

  private refreshPassportError(): void {
    const errors = this.getControl(0, 'passportNumber').errors;
    if (errors?.['passportNotFound'] || errors?.['passportOwnerMismatch']) {
      this.passportError = 'Неверный паспорт';
    } else {
      this.passportError = null;
    }
  }

  private parseCatOption(value: unknown): IValueCat | null {
    if (typeof value !== 'string' || !value) {
      return null;
    }
    try {
      return JSON.parse(value) as IValueCat;
    } catch {
      return null;
    }
  }

  /**
   * Паспорт должен существовать в списке одобренных и принадлежать выбранному коту-кандидату.
   */
  private partyPassportValidator(control: AbstractControl): ValidationErrors | null {
    const number = String(control.value ?? '').trim();
    if (!number || !/^[\d]{4} [\d]{6}$/.test(number)) {
      return null; // формат отлавливает pattern
    }

    const passport = this.passportsByNumber.get(number);
    if (!passport) {
      return { passportNotFound: true };
    }

    const option = this.parseCatOption(this.getControl(0, 'cat').value);
    if (!option?.id) {
      return null;
    }

    if (passport.catId !== option.id) {
      return { passportOwnerMismatch: true };
    }

    return null;
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

  public getItem(index: number): string {
    return JSON.stringify(this.optionsCat[index]);
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }
}
