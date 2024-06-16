// Файл не трогаем

import { Component, Input, OnInit } from '@angular/core';
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
export class CheckInfoComponent implements OnInit {

  @Input() public steps: IStep[];
  @Input() public data: any;

  public ngOnInit() {
    console.log(this.steps);
    console.log(this.data);
  }

  public getStepInfo(index: number) {
    console.log(Array(this.data[index]))
    return Array(this.data[index]);
  }
}
