// Файл не трогаем

import { Component, Input } from '@angular/core';
import { IStep } from '@models/step.model';

@Component({
  selector: 'app-steps',
  standalone: true,
  imports: [],
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.scss'
})
export class StepsComponent {

  @Input() public steps: IStep[];
  @Input() public activeStep: number;

}
