import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { IValueCat } from '@models/cat.model';
import { IGroomingNotification } from '@models/grooming.model';
import { ConstantsService } from '@services/constants/constants.service';
import { GroomingService } from '@services/grooming/grooming.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-grooming-notifications',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './grooming-notifications.component.html',
  styleUrl: './grooming-notifications.component.scss'
})
export class GroomingNotificationsComponent implements OnInit {
  public loading = true;
  public notificationsLoading = false;
  public optionsCat: IValueCat[] = [];
  public selectedCat = '';
  public notifications: IGroomingNotification[] = [];
  public loadError = '';

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
      this.loadNotifications();
    });
  }

  public loadNotifications(): void {
    this.loadError = '';
    this.notificationsLoading = true;
    const selectedCat = this.getSelectedCat();
    if (!selectedCat) {
      this.notifications = [];
      this.notificationsLoading = false;
      return;
    }
    this.groomingService.getNotifications(selectedCat.id).pipe(take(1)).subscribe((items) => {
      this.notifications = items || [];
      this.notificationsLoading = false;
    }, () => {
      this.notifications = [];
      this.notificationsLoading = false;
      this.loadError = 'Не удалось загрузить уведомления';
    });
  }

  public getTypeLabel(type: IGroomingNotification['type']): string {
    return type === 'REMINDER' ? 'Напоминание' : 'Результат записи';
  }

  public getStatusLabel(status: IGroomingNotification['status']): string {
    return status === 'SENT' ? 'Отправлено' : 'В очереди';
  }

  public getStatusClass(status: IGroomingNotification['status']): string {
    return status === 'SENT' ? 'status-ok' : 'status-pending';
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
