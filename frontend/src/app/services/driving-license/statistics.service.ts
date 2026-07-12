import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IDrivingStatistics } from '@models/driving-license.model';
import { DrivingCategory } from '@models/driving-license.model';

@Injectable({
  providedIn: 'root'
})
export class DrivingStatisticsService {
  private readonly STATS_KEY = 'driving_statistics';
  private statisticsSubject = new BehaviorSubject<IDrivingStatistics[]>([]);

  constructor() {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    const data = localStorage.getItem(this.STATS_KEY);
    if (data) {
      this.statisticsSubject.next(JSON.parse(data));
    }
  }

  getStatistics(): Observable<IDrivingStatistics[]> {
    return this.statisticsSubject.asObservable();
  }

  getTopSchools(): Observable<IDrivingStatistics[]> {
    return new Observable(observer => {
      this.statisticsSubject.subscribe(stats => {
        const sorted = [...stats].sort((a, b) => b.averageRating - a.averageRating);
        observer.next(sorted);
      });
    });
  }

  getCategoryStats(): Observable<Record<DrivingCategory, number>> {
    return new Observable(observer => {
      this.statisticsSubject.subscribe(stats => {
        const total: Record<DrivingCategory, number> = { A: 0, B: 0, C: 0, D: 0 };
        stats.forEach(entry => {
          Object.keys(entry.categoryStats).forEach(cat => {
            total[cat as DrivingCategory] += entry.categoryStats[cat as DrivingCategory];
          });
        });
        observer.next(total);
      });
    });
  }
}
