import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { JsonPipe } from '@angular/common';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { IFitnessClub, TrainingType, IMembership, ICatTrainer } from '@models/fitness.model';
import { FitnessService } from '@services/fitness/fitness.service';
import { CommonModule } from '@angular/common';
import { CatService } from '@services/cat/cat.service';
import { ICat } from '@models/cat.model';
import { OrderService } from '@services/order/order.service';
import { IRequisition } from '@models/order.model';

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe,
    ThrobberComponent,
  ],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.scss'
})
export class WorkoutComponent implements OnInit, OnDestroy {
  public loading = true;
  public form: UntypedFormGroup;
  public fitnessClubs: IFitnessClub[] = [];
  public memberships: IMembership[] = [];
  public trainers: ICatTrainer[] = [];
  public trainingTypes: TrainingType[] = [];

  public selectedClub: IFitnessClub | null = null;
  public selectedType: TrainingType | null = null;
  public selectedMembership: IMembership | null = null;

  public active: number = 0;
  public step: number = 1;
  public buyerCats: ICat[] = [];
  public selectedBuyer: ICat | null = null;
  public confirmData: any = null;
  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private constantService: ConstantsService,
    private route: ActivatedRoute,
    private serviceInfo: ServiceInfoService,
    private fitnessService: FitnessService,
    private catService: CatService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.fitnessService.getFitnessClubs().pipe(take(1)).subscribe((clubs) => {
      this.fitnessClubs = clubs;
      this.initForm();
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  public nextStep() {
    if (this.step === 1) {
      // Фильтруем котиков-покупателей (не тренеров выбранного клуба)
      this.catService.getCatList().pipe(take(1)).subscribe((cats) => {
        const trainerIds = this.trainers.map(t => t.id);
        this.buyerCats = cats.filter(cat => !trainerIds.includes(cat.id));
        this.step = 2;
      });
    } else if (this.step === 2) {
      // Подтверждение
      this.selectedBuyer = this.buyerCats.find(c => c.id === +this.form.get('buyer')?.value) || null;
      this.confirmData = {
        club: this.selectedClub?.name,
        trainingType: this.selectedType,
        membership: this.memberships.find(m => m.id === +this.form.get('membership')?.value),
        trainer: this.trainers.find(t => t.id === +this.form.get('trainer')?.value),
        buyer: this.selectedBuyer
      };
      this.step = 3;
    }
  }

  public prevStep() {
    if (this.step > 1) this.step--;
  }

  public saveRequisition() {
    const payload: IRequisition = {
      clubId: this.selectedClub?.id!,
      trainingType: this.selectedType!,
      membershipId: this.form.get('membership')?.value!,
      trainerId: this.form.get('trainer')?.value || undefined,
      buyerId: this.form.get('buyer')?.value!
    };
    this.orderService.createRequisition(payload).subscribe({
      next: () => {
        alert('Заявка успешно отправлена!');
        // Можно сбросить форму или перейти на другую страницу
      },
      error: () => {
        alert('Ошибка при отправке заявки');
      }
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      club: [null, Validators.required],
      trainingType: [null, Validators.required],
      membership: [null, Validators.required],
      trainer: [null],
      buyer: [null, Validators.required],
    });
    this.form.get('club')?.valueChanges.subscribe((clubId: number) => {
      this.selectedClub = this.fitnessClubs.find(c => c.id === +clubId) || null;
      this.trainingTypes = this.selectedClub?.trainingTypes || [];
      this.memberships = this.selectedClub?.memberships || [];
      this.trainers = this.selectedClub?.trainers || [];
      this.form.get('trainingType')?.reset();
      this.form.get('membership')?.reset();
      this.form.get('trainer')?.reset();
    });
    this.form.get('trainingType')?.valueChanges.subscribe((type: TrainingType) => {
      this.selectedType = type;
      if (type === 'FREE') {
        this.form.get('trainer')?.clearValidators();
        this.form.get('trainer')?.reset();
      } else {
        this.form.get('trainer')?.setValidators(Validators.required);
      }
      this.form.get('trainer')?.updateValueAndValidity();
    });
  }

  public getControl(id: string): FormControl {
    return this.form.get(id) as FormControl;
  }
}
