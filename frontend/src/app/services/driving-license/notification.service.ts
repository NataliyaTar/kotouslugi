import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDrivingApplication } from '@models/driving-license.model';

@Injectable({
  providedIn: 'root'
})
export class DrivingNotificationService {
  private notifications: string[] = [];
  private notificationsSubject = new BehaviorSubject<string[]>([]);

  addNotification(message: string): void {
    this.notifications.unshift(`[${new Date().toLocaleString()}] ${message}`);
    if (this.notifications.length > 50) {
      this.notifications.pop();
    }
    this.notificationsSubject.next(this.notifications);
  }

  getNotifications() {
    return this.notificationsSubject.asObservable();
  }

  notifyConfirmation(application: IDrivingApplication): void {
    this.addNotification(
      `Подтверждение записи на экзамен: Кот ${application.catName} (${application.category}), ${new Date(application.examDate).toLocaleDateString()} в ${application.examTime}`
    );
  }

  notifyStatusChange(application: IDrivingApplication): void {
    this.addNotification(
      `Изменение статуса заявки ${application.id?.slice(0, 8)}: ${application.status} (Кот: ${application.catName})`
    );
  }
}
