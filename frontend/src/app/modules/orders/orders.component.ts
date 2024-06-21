// Файл не трогаем

import { Component, OnInit } from '@angular/core';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { IOrder } from '@models/order.model';
import { OrderService } from '@services/order/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    ThrobberComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  public loading = true;
  public orders: IOrder[];

  constructor(
    private orderService: OrderService,
  ) {
  }

  public ngOnInit() {
    this.orderService.getOrdersList().subscribe(res => {
      this.orders = res;
      this.loading = false;
    })
  }
}
