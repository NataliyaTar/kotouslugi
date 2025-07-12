import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFitness } from '@models/fitness.model';

@Injectable({
  providedIn: 'root'
})
export class FitnessService {
  private fitnessApi = 'api/fitness_club/';

  constructor(private http: HttpClient) {}

  /**
   * Получить список фитнес-клубов
   */
  public getFitnessList(): Observable<IFitness[]> {
    return this.http.get<IFitness[]>(`${this.fitnessApi}list`);
  }
}
