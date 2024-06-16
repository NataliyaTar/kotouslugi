// Файл не трогаем

import { Component, OnInit } from '@angular/core';
import { CatService } from '@services/cat/cat.service';
import { take } from 'rxjs';
import { EBreedMap, ICat, TBreed, ESexMap, TSex } from '@models/cat.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-family',
  standalone: true,
  imports: [],
  templateUrl: './cats-list.component.html',
  styleUrl: './cats-list.component.scss'
})
export class CatsListComponent implements OnInit {

  public catsList: ICat[];
  public ESexMap = ESexMap;

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
    });
  }

  public getBreed(breedId: TBreed): EBreedMap {
    return this.catService.getBreedMap(breedId);
  }

  public getSex(sexId: TSex): ESexMap {
    return this.catService.getSexMap(sexId);
  }

  public addCat(): void {
    this.router.navigate(['add-cat']);
  }

  public deleteCat(id: number): void {
    this.catService.deleteCat(id);
  }

}
