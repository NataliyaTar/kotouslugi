import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFitnessClub } from '@models/fitness.model';

@Injectable({
  providedIn: 'root'
})
export class FitnessService {
  private fitnessApi = 'api/fitness_club/';

  constructor(private http: HttpClient) {}

  /**
   * Получить список фитнес-клубов
   */
  public getFitnessClubs(): Observable<IFitnessClub[]> {
    return this.http.get<IFitnessClub[]>(`${this.fitnessApi}list`);
  }

  /**
   * Получить фитнес-клуб по id
   */
  public getFitnessClub(id: number): Observable<IFitnessClub> {
    return this.http.get<IFitnessClub>(`${this.fitnessApi}get?id=${id}`);
  }
}
