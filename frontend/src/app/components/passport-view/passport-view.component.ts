import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ERelationMap, IPassportDetail } from '@models/passport.model';

@Component({
  selector: 'app-passport-view',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './passport-view.component.html',
  styleUrl: './passport-view.component.scss'
})
export class PassportViewComponent {
  @Input() passport: IPassportDetail;

  public getRelationLabel(type: string): string {
    return ERelationMap[type as keyof typeof ERelationMap] || type;
  }

  public display(value: string | null | undefined): string {
    return value?.trim() ? value : '—';
  }
}
