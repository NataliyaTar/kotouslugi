import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-check-info',
  standalone: true,
  imports: [],
  templateUrl: './check-info.component.html',
  styleUrl: './check-info.component.scss'
})
export class CheckInfoComponent {

  @Input() public data: any;
}
