import { Component, Input } from '@angular/core';
import { NgxTCarouselComponent } from 'ngx-tcarousel';
import { IBanner } from '@models/banner.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    CommonModule,
    NgxTCarouselComponent,
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {

  @Input() public banners: IBanner[];

}
