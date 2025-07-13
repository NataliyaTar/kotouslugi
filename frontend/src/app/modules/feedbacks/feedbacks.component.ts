import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from '@components/error/error.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http'; // Добавьте этот импорт
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '@services/order/order.service';
import { EStatus, IOrder, TStatus } from '@models/order.model';

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [
    ThrobberComponent,
    ErrorComponent,
    HttpClientModule,
    CommonModule,
    FormsModule // добавьте сюда
  ],
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss']
})

export class FeedbacksComponent implements OnInit {
    public loading = true; // Загружены ли данные для страницы
    public error = false; // Произошла ли ошибка реста
    public rating: number | null = null;
    public comment: String | null = "";
    public orderId: number | null = null;
    public orders: IOrder[]; // Список заявок

    constructor(
        private orderService: OrderService,
        ) {}

    public ngOnInit() {
        // получаем список заявок
        this.orderService.getOrdersList().subscribe(res => {
          this.orders = res;
          this.loading = false;
        }, error => {
          this.loading = false;
          this.error = true;
        })
      }

     public submitFeedback() {
        if (this.rating === null) {
          alert('Выберите оценку');
          return;
        }
        console.log('Comment = ', this.comment);
        const data = {
          rating: this.rating,
          comment: this.comment,
          orderId: this.orderId
        };

        const jsonData = JSON.stringify(data);
        console.log(jsonData);

        fetch('/api/ethicsFeedback/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: jsonData
        })

        .then(response => response.text())
        .then(data => {
          console.log('Ответ сервера:', data);
        })
        .catch(error => {
          console.error('Ошибка:', error);
        });
      }
}
