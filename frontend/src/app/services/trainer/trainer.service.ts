import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITrainer } from '@models/trainer.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private apiUrl = '/api/fitness_trainers';

  constructor(private http: HttpClient) {}


   public getAll(): Observable<ITrainer[]> {
      return this.http.get<ITrainer[]>(`${this.apiUrl}/list`);
    }

}
