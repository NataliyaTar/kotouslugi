// Файл не трогаем

import { Component, OnInit } from '@angular/core';
import { CatService } from '@services/cat/cat.service';
import { take } from 'rxjs';
import { EBreedMap, ICat, TBreed, ESexMap, TSex } from '@models/cat.model';
import { Router } from '@angular/router';
import { ThrobberComponent } from '@components/throbber/throbber.component';

@Component({
  selector: 'app-cats-list',
  standalone: true,
  imports: [
    ThrobberComponent
  ],
  templateUrl: './cats-list.component.html',
  styleUrl: './cats-list.component.scss'
})
export class CatsListComponent implements OnInit {

  public loading = true; // загружена ли информация для страницы
  public catsList: ICat[]; // список котов
  public ESexMap = ESexMap; // маппинг пола

  constructor(
    private catService: CatService,
    private router: Router,
  ) {
  }

  public ngOnInit(): void {
    this.catService.getCatList().pipe(
      take(1)
    ).subscribe(res => {
      this.catsList = res;
      this.loading = false;
    });
  }

  /**
   * Возвращает породу человеческим значением
   * @param breedId
   */
  public getBreed(breedId: TBreed): EBreedMap {
    return this.catService.getBreedMap(breedId);
  }

  /**
   * Возвращает пол человеческим значением
   * @param sexId
   */
  public getSex(sexId: TSex): ESexMap {
    return this.catService.getSexMap(sexId);
  }

  /**
   * Редирект на страницу добавления кота
   */
  public addCat(): void {
    this.router.navigate(['add-cat']);
  }

  /**
   * Удалить кота
   * @param id
   */
  public deleteCat(id: number): void {
    this.catService.deleteCat(id);
  }

}
