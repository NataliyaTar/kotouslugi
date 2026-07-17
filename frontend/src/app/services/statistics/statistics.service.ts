// src/app/services/statistics/statistics.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { IDrivingStatistics } from '@models/driving-license.model';
import { DrivingCategory } from '@models/driving-license.model';
import { DrivingSchoolService } from '@services/driving-school/driving-school.service';
import { ReviewService, IReviewResponse } from '@services/review/review.service';
import { DrivingLicenseService } from '@services/driving-license/driving-license.service';

@Injectable({
  providedIn: 'root'
})
export class DrivingStatisticsService {
  private statisticsSubject = new BehaviorSubject<IDrivingStatistics[]>([]);

  constructor(
    private drivingSchoolService: DrivingSchoolService,
    private reviewService: ReviewService,
    private drivingLicenseService: DrivingLicenseService
  ) {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    combineLatest([
      this.drivingSchoolService.getSchools(),
      this.reviewService.getReviews(),
      this.drivingLicenseService.getApplications()
    ]).pipe(
      map(([schools, reviews, licenses]: [any[], IReviewResponse[], any[]]) => {
        const schoolRatings: Record<string, number[]> = {};
        reviews.forEach((review: IReviewResponse) => {
          if (!schoolRatings[review.schoolName]) {
            schoolRatings[review.schoolName] = [];
          }
          schoolRatings[review.schoolName].push(review.schoolRating);
        });

        const categoryCounts: Record<string, Record<string, number>> = {};
        licenses.forEach((license: any) => {
          const schoolName = license.drivingSchool || 'Неизвестная школа';
          if (!categoryCounts[schoolName]) {
            categoryCounts[schoolName] = { A: 0, B: 0, C: 0, D: 0 };
          }
          const cat = license.categories?.includes('A') ? 'A' :
            license.categories?.includes('B') ? 'B' :
              license.categories?.includes('C') ? 'C' : 'D';
          categoryCounts[schoolName][cat] = (categoryCounts[schoolName][cat] || 0) + 1;
        });

        return schools.map((school: any) => {
          const ratings = schoolRatings[school.name] || [];
          const avgRating = ratings.length > 0
            ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
            : 0;

          return {
            schoolName: school.name,
            licensesIssued: licenses.filter((l: any) => l.drivingSchool === school.name).length,
            categoryStats: categoryCounts[school.name] || { A: 0, B: 0, C: 0, D: 0 },
            averageRating: Math.round(avgRating * 10) / 10
          } as IDrivingStatistics;
        });
      })
    ).subscribe({
      next: (stats: IDrivingStatistics[]) => {
        this.statisticsSubject.next(stats);
      },
      error: (err: any) => {
        console.error('Ошибка загрузки статистики:', err);
        this.statisticsSubject.next([]);
      }
    });
  }

  getStatistics(): Observable<IDrivingStatistics[]> {
    return this.statisticsSubject.asObservable();
  }

  getTopSchools(): Observable<IDrivingStatistics[]> {
    return this.statisticsSubject.pipe(
      map((stats: IDrivingStatistics[]) => [...stats].sort((a, b) => b.averageRating - a.averageRating))
    );
  }

  getCategoryStats(): Observable<Record<DrivingCategory, number>> {
    return this.statisticsSubject.pipe(
      map((stats: IDrivingStatistics[]) => {
        const total: Record<DrivingCategory, number> = { A: 0, B: 0, C: 0, D: 0 };
        stats.forEach((entry: IDrivingStatistics) => {
          Object.keys(entry.categoryStats).forEach((cat: string) => {
            total[cat as DrivingCategory] += entry.categoryStats[cat as DrivingCategory] || 0;
          });
        });
        return total;
      })
    );
  }
}
