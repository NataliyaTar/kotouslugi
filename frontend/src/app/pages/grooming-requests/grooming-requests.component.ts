import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IValueCat } from '@models/cat.model';
import { IGroomingAppointment } from '@models/grooming.model';
import { ConstantsService } from '@services/constants/constants.service';
import { GroomingService } from '@services/grooming/grooming.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-grooming-requests',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './grooming-requests.component.html',
  styleUrl: './grooming-requests.component.scss'
})
export class GroomingRequestsComponent implements OnInit {
  public loading = true;
  public appointmentsLoading = false;
  public optionsCat: IValueCat[] = [];
  public selectedCat = '';
  public allAppointments: IGroomingAppointment[] = [];
  public reviewTargetId: number | null = null;
  public reviewRating = 5;
  public reviewComment = '';
  public reviewSuccess = '';
  public reviewError = '';

  constructor(
    private constantService: ConstantsService,
    private groomingService: GroomingService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.constantService.getCatOptionsAll().pipe(take(1)).subscribe((cats: IValueCat[]) => {
      this.optionsCat = cats || [];
      const queryCatId = Number(this.route.snapshot.queryParamMap.get('catId'));
      const catByQuery = this.optionsCat.find(item => item.id === queryCatId);
      const fallback = catByQuery || this.optionsCat[0];
      this.selectedCat = fallback ? this.toJson(fallback) : '';
      this.loading = false;
      this.loadAppointments();
    });
  }

  public loadAppointments(): void {
    this.reviewSuccess = '';
    this.reviewError = '';
    this.reviewTargetId = null;
    this.appointmentsLoading = true;
    const cat = this.getSelectedCat();
    if (!cat) {
      this.allAppointments = [];
      this.appointmentsLoading = false;
      return;
    }
    this.groomingService.getAppointments(cat.id).pipe(take(1)).subscribe(list => {
      this.allAppointments = list || [];
      this.appointmentsLoading = false;
    }, () => {
      this.allAppointments = [];
      this.appointmentsLoading = false;
      this.reviewError = 'Не удалось загрузить заявки';
    });
  }

  public openReviewForm(appointmentId: number): void {
    this.reviewTargetId = appointmentId;
    this.reviewRating = 5;
    this.reviewComment = '';
    this.reviewSuccess = '';
    this.reviewError = '';
  }

  public submitReview(): void {
    this.reviewSuccess = '';
    this.reviewError = '';
    if (!this.reviewTargetId) {
      this.reviewError = 'Выберите заявку для отзыва';
      return;
    }
    if (!this.reviewComment.trim()) {
      this.reviewError = 'Добавьте комментарий к отзыву';
      return;
    }
    this.groomingService.submitReview(this.reviewTargetId, this.reviewRating, this.reviewComment)
      .pipe(take(1))
      .subscribe(() => {
        this.reviewSuccess = 'Отзыв отправлен';
        this.reviewComment = '';
      }, () => {
        this.reviewError = 'Не удалось отправить отзыв. Попробуйте еще раз';
      });
  }

  public canReviewAppointment(appointment: IGroomingAppointment): boolean {
    if (appointment.status !== 'SALON_CONFIRMED' || !appointment.visitDate) {
      return false;
    }
    const visit = new Date(appointment.visitDate);
    visit.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return visit < today;
  }

  public getStatusLabel(status: IGroomingAppointment['status']): string {
    if (status === 'SALON_CONFIRMED') {
      return 'Подтверждена';
    }
    if (status === 'SALON_REJECTED') {
      return 'Отклонена';
    }
    if (status === 'PENDING') {
      return 'В обработке';
    }
    return 'Отменена';
  }

  public getStatusClass(status: IGroomingAppointment['status']): string {
    if (status === 'SALON_CONFIRMED') {
      return 'status-ok';
    }
    if (status === 'SALON_REJECTED') {
      return 'status-error';
    }
    if (status === 'PENDING') {
      return 'status-pending';
    }
    return 'status-cancelled';
  }

  public toJson(value: unknown): string {
    return JSON.stringify(value);
  }

  private getSelectedCat(): IValueCat | null {
    try {
      return JSON.parse(this.selectedCat);
    } catch {
      return null;
    }
  }
}
