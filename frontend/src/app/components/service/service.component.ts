// Файл не трогаем

import { Component, Input } from '@angular/core';
import { IService } from '@models/service.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {

  @Input() public service: IService;
}
