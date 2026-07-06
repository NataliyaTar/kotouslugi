// Файл не трогаем

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselComponent } from '@components/carousel/carousel.component';
import { BannerService } from '@services/banner/banner.service';
import { IBanner } from '@models/banner.model';
import { ServiceComponent } from '@components/service/service.component';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { IService } from '@models/service.model';
import { RouterModule } from '@angular/router';
import { CatService } from '@services/cat/cat.service';
import { take } from 'rxjs';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { ErrorComponent } from '@components/error/error.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CarouselComponent,
    ServiceComponent,
    RouterModule,
    ThrobberComponent,
    ErrorComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  public loading = true;
  public error = false;
  public search = ''; // строка поиска
  public banners: IBanner[]; // список баннеров
  public services: IService[]; // список услуг
  public showServices = false; // показывать ли услуги

  /**
   * Возвращает отфильтрованный список услуг по строке поиска
   */
  public get filteredService(): IService[] {
    return this.services?.filter((item) => item.title.match(new RegExp(this.search, 'i')));
  }

  constructor(
    private bannerService: BannerService,
    private serviceInfoService: ServiceInfoService,
    private catService: CatService,
  ) {
  }

  public ngOnInit(): void {
    this.getBanners();
    this.isCatExist();
  }

  /**
   * Получает список баннеров
   * @private
   */
  private getBanners(): void {
    this.bannerService.getBanners().pipe(
      take(1)
    ).subscribe((res) => {
      this.banners = res;
    });
  }

  /**
   * Проверяет можно ли показывать услуги
   * Когда зарегистрированных котов нет, услуги показывать нельзя
   * @private
   */
  private isCatExist(): void {
    this.catService.getCatList().pipe(
      take(1)
    ).subscribe(res => {
      this.showServices = res.length >= 1;
      if (this.showServices) {
        this.getServices();
      } else {
        this.loading = false;
      }
    }, error => {
      this.loading = false;
      this.error = true;
    });
  }

  /**
   * Получает список услуг
   * @private
   */
  private getServices(): void {
    this.serviceInfoService.getServices().pipe(
      take(1)
    ).subscribe((res) => {
      this.services = res;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.error = true;
    })
  }

}
