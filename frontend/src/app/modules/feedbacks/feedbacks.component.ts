import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from '@components/error/error.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '@services/order/order.service';
import { CatService } from '@services/cat/cat.service';
import { EStatus, IOrder, TStatus } from '@models/order.model';
import { Observable} from 'rxjs';

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  orderId: number;
}

interface Requisition {
   id: number;
   status: number;
   created: string;
   fields: string;
   result: any[];
}

interface RequisitionItem {
  id?: number;
  cat?: string;
  course?: string;
  date?: string;
  time?: string;
  teacher?: string;
  teacherInfo?: string;
  owner?: string;
  telephone?: string;
  email?: string;
}

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [
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
    public requisition: Requisition[] = [];
    public selectedFeedbackOrderId: number | null = null;
    public selectedFeedback: any = null;

    public parsedArray: any[] = [];
    public resultReq: any[] = [];

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
      this.loadRequisition();
    }

    getDateTimeFromResult(result: any[]): string {
      let dateStr = '';
      let timeStr = '';

      for (let r of result) {
        if (r.date) {
          dateStr = r.date;
        }
        if (r.time) {
          timeStr = r.time;
        }
      }
      return `${dateStr} Время: ${timeStr}`;
    }

    public loadRequisition(): void {
      this.http.get<Requisition[]>('/api/requisition/list')
        .subscribe(
          data => {
            this.requisition = data;

            this.requisition.forEach(req => {
              // console.log('req.fields:', req.fields);

              if (typeof req.fields === 'string') {
                try {
                  let parsedData = JSON.parse(req.fields);
                  if (typeof parsedData === 'string') {
                    // Если после первого парсинга результат — строка, парсим снова
                    parsedData = JSON.parse(parsedData);
                   }
                  // console.log('Распарсенные данные:', parsedData);
                  // console.log('Тип и содержимое parsedData:', typeof parsedData, parsedData);
                  if (Array.isArray(parsedData)) {
                    req.result = parsedData; // сохраняем как массив
                  } else {
                    // console.warn('Данные не являются массивом:', parsedData);
                    req.result = [];
                  }
                } catch (e) {
                  // console.error('Ошибка парсинга JSON:', e);
                  req.result = [];
                }
              } else {
                // console.warn('req.fields не является строкой:', req.fields);
                req.result = [];
              }
            });
          },
          error => {
            console.error('Ошибка при получении данных', error);
          }
        );
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
          if (data === 'Отзыв добавлен!') {
            alert('Отзыв успешно добавлен!');
          }
          else {
            alert('Отзыв для выбранной записи уже существует!');
          }
          // alert("Вы успешно оставили свой отзыв. Нажмите 'OK'");

        })
        .catch(error => {
          // alert("Произошла ошибка. Проверьте правильность введенных данных и попробуйте еще раз.");
        });
      }
}
