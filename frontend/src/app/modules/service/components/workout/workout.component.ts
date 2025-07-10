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
  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private constantService: ConstantsService,
    private route: ActivatedRoute,
    private serviceInfo: ServiceInfoService,
    private fitnessService: FitnessService
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

  private initForm(): void {
    this.form = this.fb.group({
      club: [null, Validators.required],
      trainingType: [null, Validators.required],
      membership: [null, Validators.required],
      trainer: [null],
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
