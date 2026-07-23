import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import {
  ICreatePassportRequisition,
  IPassportDocument,
  IPassportDto,
} from '@models/passport.model';
import { IOrder } from '@models/order.model';
import { ICat } from '@models/cat.model';
import { OrderService } from '@services/order/order.service';
import { CatService } from '@services/cat/cat.service';

@Injectable({
  providedIn: 'root'
})
export class PassportService {

  private passportApi = '/api/passport/';
  private requisitionApi = '/api/requisition/';

  constructor(
    private http: HttpClient,
    private orderService: OrderService,
    private catService: CatService,
  ) {}

  /**
   * Создание заявки на паспорт в формате бэкенда:
   * { mnemonic, catId, fields, passportDetail }
   */
  public createRequisition(rawValue: Record<string, Record<string, unknown>>): Observable<number> {
    return this.http.post<number>(
      `${this.requisitionApi}create`,
      this.buildCreatePayload(rawValue),
    );
  }

  public approvePassport(requisitionId: number): Observable<unknown> {
    return this.http.patch(`${this.passportApi}approve`, { requisitionId });
  }

  /**
   * Актуальные паспорта: GET /api/passport/getAll.
   * catId/имя кота подтягиваются из заявки и списка котов.
   */
  public getApprovedPassports(): Observable<IPassportDocument[]> {
    return forkJoin({
      passports: this.http.get<IPassportDto[]>(`${this.passportApi}getAll`),
      orders: this.orderService.getOrdersList(),
      cats: this.catService.getCatList(),
    }).pipe(
      map(({ passports, orders, cats }) => this.mapPassports(passports, orders, cats)),
    );
  }

  private mapPassports(
    passports: IPassportDto[],
    orders: IOrder[],
    cats: ICat[],
  ): IPassportDocument[] {
    const catMap = new Map(cats.map(cat => [cat.id, cat.name]));
    const orderMap = new Map(
      orders.map(order => [String(order.id), order as IOrder & { catId?: number; decisionAt?: string }]),
    );

    return passports.map(passport => {
      const order = orderMap.get(String(passport.requisition));
      const catId = Number(order?.catId);
      const validCatId = Number.isFinite(catId) ? catId : 0;

      return {
        requisitionId: String(passport.requisition),
        approvedAt: order?.decisionAt ?? order?.created ?? passport.issueDate,
        catId: validCatId,
        catName: validCatId ? (catMap.get(validCatId) ?? `Кот #${validCatId}`) : 'Кот',
        passportNumber: passport.passportNumber,
        issueDate: passport.issueDate,
        country: passport.country || 'РФ',
        ownerPhone: passport.ownerPhone,
        ownerEmail: passport.ownerEmail,
        photoUrl: passport.photoUrl,
        chipNumber: passport.chipNumber || undefined,
        specialMarks: passport.specialMarks || undefined,
      };
    });
  }

  private buildCreatePayload(
    rawValue: Record<string, Record<string, unknown>>,
  ): ICreatePassportRequisition {
    const catStep = rawValue['0'] ?? {};
    const ownerStep = rawValue['1'] ?? {};
    const passportStep = rawValue['2'] ?? {};

    const catId = this.extractCatId(catStep['cat']);
    const chipNumber = this.optionalString(passportStep['chipNumber']);
    const specialMarks = this.optionalString(passportStep['specialMarks']);

    return {
      mnemonic: 'passport',
      catId,
      fields: JSON.stringify({}),
      passportDetail: {
        passportNumber: String(passportStep['passportNumber'] ?? ''),
        issueDate: String(passportStep['issueDate'] ?? ''),
        country: 'РФ',
        ownerPhone: String(ownerStep['ownerPhone'] ?? ''),
        ownerEmail: String(ownerStep['ownerEmail'] ?? ''),
        photoUrl: String(passportStep['photoUrl'] ?? ''),
        ...(chipNumber ? { chipNumber } : {}),
        ...(specialMarks ? { specialMarks } : {}),
      },
    };
  }

  private extractCatId(catValue: unknown): number {
    if (typeof catValue === 'number' && Number.isFinite(catValue)) {
      return catValue;
    }

    if (typeof catValue === 'string') {
      try {
        const parsed = JSON.parse(catValue);
        const id = Number(parsed?.id ?? catValue);
        if (Number.isFinite(id)) {
          return id;
        }
      } catch {
        const id = Number(catValue);
        if (Number.isFinite(id)) {
          return id;
        }
      }
    }

    return 0;
  }

  private optionalString(value: unknown): string | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    return String(value);
  }
}
