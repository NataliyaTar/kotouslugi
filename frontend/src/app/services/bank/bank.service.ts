import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  private bankApi = 'api/bank/'

  constructor(
    public http: HttpClient,
  ) { }


}
