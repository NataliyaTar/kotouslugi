import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from '@components/error/error.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [ThrobberComponent, ErrorComponent,],
  templateUrl: './feedbacks.component.html',
  styleUrl: './feedbacks.component.scss'
})

export class FeedbacksComponent {
   public loading = true; // Загружены ли данные для страницы
   public error = false; // Произошла ли ошибка реста
}
