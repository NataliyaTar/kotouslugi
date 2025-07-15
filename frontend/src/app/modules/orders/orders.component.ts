// Файл не трогаем

import { Component, OnInit } from '@angular/core';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { EStatus, IOrder, TStatus } from '@models/order.model';
import { OrderService } from '@services/order/order.service';
import { ErrorComponent } from '@components/error/error.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    ThrobberComponent,
    ErrorComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  public loading = true; // Загружены ли данные для страницы
  public error = false; // Произошла ли ошибка реста
  public orders: IOrder[]; // Список заявок

  constructor(
    private orderService: OrderService,
  ) {
  }

  public ngOnInit() {
    this.orderService.getAllOrders().subscribe(res => {
      this.orders = res;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.error = true;
    })
  }

  /**
   * Возвращает статус заявки человеческим значением
   * @param status
   */
  public getStatus(status: TStatus): EStatus {
    return this.orderService.getStatusMap(status);
  }

  /**
   * Возвращает путь к картинке
   * @param status
   */
  public getIconPath(status: TStatus): string {
    let path = '../../../assets/svg/icons/';
    switch(status) {
      case ('FILED'):
        return path + 'info_outline-gray.svg';
      case ('UNDER_CONSIDERATION'):
        return path + 'schedule-orange.svg';
      case ('REJECTED'):
        return path + 'highlight_off-red.svg';
      case ('ACCEPTED'):
        return path + 'check_circle_outline-green.svg';
      case ('DONE'):
        return path + 'thumb_up_alt-green.svg';
    }
  }

  public getDate(date: string): string {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

}
