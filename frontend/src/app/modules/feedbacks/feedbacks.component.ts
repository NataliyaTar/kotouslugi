import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from '@components/error/error.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '@services/order/order.service';
import { EStatus, IOrder, TStatus } from '@models/order.model';

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  orderId: number;
}

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [
    ThrobberComponent,
    ErrorComponent,
    HttpClientModule,
    CommonModule,
    FormsModule
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
    public feedbacks: Feedback[] = [];
    public selectedFeedbackOrderId: number | null = null;
    public selectedFeedback: any = null;

    public onSelect() {
      this.selectedFeedback = this.feedbacks.find(
        f => f.orderId === this.selectedFeedbackOrderId
      );
    }

    constructor(
        private orderService: OrderService,
        private http: HttpClient,
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
        this.loadFeedbacks();
      }

    public loadFeedbacks(): void {
        this.http.get<Feedback[]>('/api/ethicsFeedback/all')
          .subscribe(
            data => {
              this.feedbacks = data;
              this.feedbacks.sort((a, b) => a.orderId - b.orderId);
            },
            error => {
              console.error('Ошибка при получении отзывов', error);
            }
          );
      }

     public submitFeedback() {
        if (this.rating === null) {
          alert('Выберите оценку');
          return;
        }
        // console.log('Comment = ', this.comment);
        const data = {
          rating: this.rating,
          comment: this.comment,
          orderId: this.orderId
        };

        const jsonData = JSON.stringify(data);
        // console.log(jsonData);

        fetch('/api/ethicsFeedback/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: jsonData
        })

        .then(response => response.text())
        .then(data => {
          this.loadFeedbacks();
          // alert("Вы успешно оставили свой отзыв. Нажмите 'OK'");

        })
        .catch(error => {
          // alert("Произошла ошибка. Проверьте правильность введенных данных и попробуйте еще раз.");
        });
      }
}
