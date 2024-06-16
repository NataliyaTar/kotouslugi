// Файл не трогаем

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselComponent } from '@components/carousel/carousel.component';
import { BannerService } from '@services/banner/banner.service';
import { IBanner } from '@models/banner.model';
import { ServiceComponent } from '@components/service/service.component';
import { CatalogService } from '@services/catalog/catalog.service';
import { IService } from '@models/service.model';
import { RouterModule } from '@angular/router';
import { CatService } from '@services/cat/cat.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CarouselComponent,
    ServiceComponent,
    RouterModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  public search = '';
  public banners: IBanner[];
  public services: IService[];
  public showServices = false;

  public get filteredService(): IService[] {
    return this.services.filter((item) => item.title.match(new RegExp(this.search, 'i')));
  }

  constructor(
    private bannerService: BannerService,
    private catalogService: CatalogService,
    private catService: CatService,
  ) {
  }

  public ngOnInit(): void {
    this.bannerService.getBanners('main').pipe(
      take(1)
    ).subscribe((res) => {
      this.banners = res;
    });

    this.catService.getCatList().pipe(
      take(1)
    ).subscribe(res => {
      this.showServices = res.length >= 1;
    });

    this.catalogService.getServices().pipe(
      take(1)
    ).subscribe((res) => {
      this.services = res;
    })
  }

}
