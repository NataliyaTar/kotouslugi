// Файл не трогаем

import { Component, Input } from '@angular/core';
import { IPreview } from '@models/common.model';

@Component({
  selector: 'app-check-info',
  standalone: true,
  imports: [],
  templateUrl: './check-info.component.html',
  styleUrl: './check-info.component.scss'
})
export class CheckInfoComponent {

  @Input() public data: Array<IPreview[]>;

}
