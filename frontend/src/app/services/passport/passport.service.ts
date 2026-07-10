import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { IPassportDocument } from '@models/passport.model';
import { IOrder } from '@models/order.model';
import { ICat } from '@models/cat.model';
import { OrderService } from '@services/order/order.service';
import { CatService } from '@services/cat/cat.service';

/**
 * Бэкенд-контракт (ещё не реализован на сервере):
 *
 * POST /api/passport/approve
 * Body: { requisitionId: number }
 * Действия сотрудника:
 *   1. Найти заявку по requisitionId (mnemonic = "passport")
 *   2. Создать PassportDetail из данных заявки
 *   3. Установить requisition.status = DONE
 *
 * Опционально в будущем:
 * GET /api/passport/list — список выданных паспортов
 * GET /api/passport/{requisitionId} — паспорт по заявке
 */
@Injectable({
  providedIn: 'root'
})
export class PassportService {

  private passportApi = '/api/passport/';

  constructor(
    private http: HttpClient,
    private orderService: OrderService,
    private catService: CatService,
  ) {}

  /**
   * Одобрение паспорта сотрудником (вызов с админ-интерфейса / Postman).
   * На бэке эндпоинт пока отсутствует.
   */
  public approvePassport(requisitionId: number): Observable<unknown> {
    return this.http.post(`${this.passportApi}approve`, { requisitionId });
  }

  /**
   * Паспорта, доступные пользователю: заявки passport со статусом DONE.
   * Пока данные берутся из /api/requisition/list + парсинг fields.
   */
  public getApprovedPassports(): Observable<IPassportDocument[]> {
    return forkJoin({
      orders: this.orderService.getOrdersList(),
      cats: this.catService.getCatList(),
    }).pipe(
      map(({ orders, cats }) => this.mapApprovedPassports(orders, cats)),
    );
  }

  private mapApprovedPassports(orders: IOrder[], cats: ICat[]): IPassportDocument[] {
    const catMap = new Map(cats.map(cat => [cat.id, cat.name]));

    return orders
      .filter(order => order.mnemonic === 'passport' && order.status === 'DONE')
      .map(order => {
        const fields = this.parseFields(order.fields);
        const catId = Number(fields['cat']);
        const validCatId = Number.isFinite(catId) ? catId : null;

        return {
          requisitionId: order.id,
          approvedAt: order.created,
          catId: validCatId ?? 0,
          catName: validCatId !== null ? (catMap.get(validCatId) ?? `Кот #${validCatId}`) : 'Кот',
          passportNumber: String(fields['passportNumber'] ?? ''),
          issueDate: String(fields['issueDate'] ?? ''),
          country: 'РФ',
          ownerPhone: String(fields['ownerPhone'] ?? ''),
          ownerEmail: String(fields['ownerEmail'] ?? ''),
          photoUrl: String(fields['photoUrl'] ?? ''),
          chipNumber: fields['chipNumber'] ? String(fields['chipNumber']) : undefined,
          specialMarks: fields['specialMarks'] ? String(fields['specialMarks']) : undefined,
        };
      });
  }

  private parseFields(fields: string): Record<string, string | number> {
    try {
      const steps = this.unwrapFieldsArray(fields);
      const result: Record<string, string | number> = {};

      steps.forEach(step => {
        Object.keys(step).forEach(key => {
          if (key !== 'id') {
            result[key] = step[key];
          }
        });
      });

      return result;
    } catch {
      return {};
    }
  }

  /**
   * Бэкенд иногда отдаёт fields как дважды закодированную JSON-строку.
   */
  private unwrapFieldsArray(fields: string): Record<string, string | number>[] {
    let current: unknown = fields;

    while (typeof current === 'string') {
      current = JSON.parse(current);
    }

    return Array.isArray(current) ? current : [];
  }
}
