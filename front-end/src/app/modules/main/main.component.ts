import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselComponent } from '@components/carousel/carousel.component';
import { BannerService } from '@services/banner/banner.service';
import { IBanner } from '@models/banner.model';
import { ServiceComponent } from '@components/service/service.component';
import { CatalogService } from '@services/catalog/catalog.service';
import { IService } from '@models/service.model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CarouselComponent,
    ServiceComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  public search = '';
  public banners: IBanner[];
  public services: IService[] = [
    {
      id: 'born',
      icon: 'two-cats.png',
      title: 'Регистрация рождения котят',
      tag: 'Семья и дети',
      description: 'При рождении трех и более котят, вы можете получить субсидии в виде пачки корма'
    },
    {
      id: 'vet',
      icon: 'sick.webp',
      title: 'Запись на прием к ветеринару',
      tag: 'Медицина',
      description: 'Подходи ответственно к своему здоровью. Здоровый ты - здоровая страна'
    },
    {
      id: 'spa',
      icon: 'relax.png',
      title: 'SPA-процедуры',
      tag: 'Отдых и развлечение',
      description: 'Устали от бесконечной работы и гонки за мышами? Пора записаться на расслабляющие процедуры'
    }
  ];

  public get filteredService(): IService[] {
    return this.services.filter((item) => item.title.match(new RegExp(this.search, 'i')));
  }

  constructor(
    private bannerService: BannerService,
    private catalogService: CatalogService,
  ) {
  }

  public ngOnInit(): void {
    this.bannerService.getBanners('main').subscribe((res) => {
      this.banners = res;
    });

    this.catalogService.getServices().subscribe((res) => {
      // this.services = res;
    })
  }

}
