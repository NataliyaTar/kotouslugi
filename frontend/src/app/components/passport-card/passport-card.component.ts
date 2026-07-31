import { Component, Input } from '@angular/core';
import { IPassportDocument } from '@models/passport.model';

@Component({
  selector: 'app-passport-card',
  standalone: true,
  templateUrl: './passport-card.component.html',
  styleUrl: './passport-card.component.scss'
})
export class PassportCardComponent {

  @Input() passport: IPassportDocument;

  public formatDate(date: string): string {
    if (!date) {
      return '—';
    }

    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
