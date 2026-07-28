import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBreedingProfile, IBreedingRequestPayload } from '@models/breeding.model';

@Injectable({
  providedIn: 'root'
})
export class BreedingService {

  private baseUrl = '/api/breeding';

  constructor(
    private http: HttpClient,
  ) { }

  public createProfile(profile: IBreedingProfile): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/profile/add`, profile);
  }

  public getMatches(profileId: number): Observable<IBreedingProfile[]> {
    return this.http.get<IBreedingProfile[]>(`${this.baseUrl}/matches`, {
      params: { profileId }
    });
  }

  public sendRequest(payload: IBreedingRequestPayload): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/request/send`, payload);
  }

}
