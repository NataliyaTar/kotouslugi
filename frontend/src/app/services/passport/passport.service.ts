import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ESexMap, IPassport, TSex } from '@models/passport.model';

@Injectable({
  providedIn: 'root'
})
export class PassportService {

  private passportApi = 'api/foreign-passport/';

  constructor(
    public http: HttpClient,
  ) { }

  public addCatPassport(catInfo: any): Observable<IPassport> {
    const prepared = this.prepareInfo(catInfo);

    return this.http.post<IPassport>(
      `${this.passportApi}add-statement-for-passport`,
      prepared
    );
  }

  private prepareInfo(catInfo: any): any {
    const result: any = {};

    for (const key in catInfo) {
      let value = catInfo[key];

      if (key === 'cat') {
        try {
          const parsed = JSON.parse(value);
          result[key] = parsed.text;
          continue;
        } catch {
          result[key] = value;
          continue;
        }
      }

      if (key === 'mvd_place') {
        try {
          const parsed = JSON.parse(value);
          result[key] = parsed.text;
          continue;
        } catch {
          result[key] = value;
          continue;
        }
      }

      try {
        const parsed = JSON.parse(value);
        value = parsed.id ?? value;
      } catch {}

      result[key] = value;
    }

    return {
      name: result.cat,
      sex: result.sex,
      dateOfBirth: result.date_of_birth,
      placeBorn: result.place_born,
      regAdress: result.reg_adress,
      children: result.children === 0,
      mvdPlace: result.mvd_place,
      timeReception: this.getDatePlusDays(7, result.time),
      poshlina: true
    };
  }


  //формирование даты выдачи документа
  private getDatePlusDays(days: number, time: string): string {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');

    const fixedTime = time;

    return `${year}-${month}-${day}T${fixedTime}`;
  }
}
