import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { IDrivingApplication, IDrivingFeedback, IDrivingStatistics } from '@models/driving-license.model';
import { ApplicationStatus, DrivingCategory } from '@models/driving-license.model';

@Injectable({
  providedIn: 'root'
})
export class DrivingApplicationService {
  private readonly STORAGE_KEY = 'driving_applications';
  private applications: IDrivingApplication[] = [];
  private applicationsSubject = new BehaviorSubject<IDrivingApplication[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      this.applications = JSON.parse(data);
      this.applicationsSubject.next(this.applications);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.applications));
    this.applicationsSubject.next(this.applications);
  }

  getApplications(): Observable<IDrivingApplication[]> {
    return this.applicationsSubject.asObservable();
  }

  getApplication(id: string): Observable<IDrivingApplication | undefined> {
    return of(this.applications.find(app => app.id === id));
  }

  createApplication(data: Omit<IDrivingApplication, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'feedback'>): Observable<IDrivingApplication> {
    const newApplication: IDrivingApplication = {
      id: uuidv4(),
      ...data,
      status: ApplicationStatus.SUBMITTED,
      createdAt: new Date(),
      updatedAt: new Date(),
      feedback: undefined
    };

    this.applications.push(newApplication);
    this.saveToStorage();
    return of(newApplication);
  }

  updateStatus(id: string, status: ApplicationStatus): Observable<IDrivingApplication | undefined> {
    const app = this.applications.find(a => a.id === id);
    if (app) {
      app.status = status;
      app.updatedAt = new Date();
      this.saveToStorage();
      return of(app);
    }
    return of(undefined);
  }

  addFeedback(applicationId: string, feedback: Omit<IDrivingFeedback, 'createdAt'>): Observable<IDrivingApplication | undefined> {
    const app = this.applications.find(a => a.id === applicationId);
    if (app) {
      app.feedback = {
        ...feedback,
        createdAt: new Date()
      };
      app.updatedAt = new Date();
      this.saveToStorage();
      this.updateStatistics(feedback.schoolName, feedback.rating);
      return of(app);
    }
    return of(undefined);
  }

  private updateStatistics(schoolName: string, rating: number): void {
    const statsKey = 'driving_statistics';
    let stats: IDrivingStatistics[] = JSON.parse(localStorage.getItem(statsKey) || '[]');

    const existingSchool = stats.find(s => s.schoolName === schoolName);
    if (existingSchool) {
      const totalRatings = existingSchool.averageRating * (stats.length - 1) + rating;
      existingSchool.averageRating = totalRatings / stats.length;
    } else {
      stats.push({
        schoolName,
        licensesIssued: 0,
        categoryStats: { A: 0, B: 0, C: 0, D: 0 },
        averageRating: rating
      });
    }

    localStorage.setItem(statsKey, JSON.stringify(stats));
  }
}
