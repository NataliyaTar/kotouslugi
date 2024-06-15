import { Component, Input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { IStep } from '@models/step.model';

@Component({
  selector: 'app-check-info',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './check-info.component.html',
  styleUrl: './check-info.component.scss'
})
export class CheckInfoComponent {

  @Input() public steps: IStep[];
  @Input() public data: any;
}
