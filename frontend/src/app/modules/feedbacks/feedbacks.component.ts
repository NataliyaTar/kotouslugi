import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from '@components/error/error.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http'; // Добавьте этот импорт
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

export class FeedbacksComponent {
    public rating: number;
    public comment: String;
    constructor(private http: HttpClient) {}
     submitFeedback() {
        if (this.rating === null || this.comment.trim() === '') {
          alert('Пожалуйста, заполните все поля');
          return;
        }

        const data = {
          rating: this.rating,
          comment: this.comment
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

        .then(response => response.json())
        .then(data => {
          console.log('Ответ сервера:', data);
        })
        .catch(error => {
          console.error('Ошибка:', error);
        });
      }
}
