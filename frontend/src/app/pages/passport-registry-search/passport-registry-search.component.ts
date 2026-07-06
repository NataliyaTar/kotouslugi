import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PassportViewComponent } from '@components/passport-view/passport-view.component';
import { IPassportDetail } from '@models/passport.model';
import { PassportService } from '@services/passport/passport.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-passport-registry-search',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    PassportViewComponent
  ],
  templateUrl: './passport-registry-search.component.html',
  styleUrl: './passport-registry-search.component.scss'
})
export class PassportRegistrySearchComponent {
  public searchQuery = '';
  public searchResults: IPassportDetail[] = [];
  public viewPassport: IPassportDetail | null = null;
  public searching = false;
  public searched = false;
  public searchError = '';

  constructor(private passportService: PassportService) {}

  public searchPassport(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      return;
    }
    if (!/^\d+$/.test(query)) {
      this.searchError = 'Поиск доступен только по номеру паспорта или номеру чипа (цифры)';
      this.searchResults = [];
      this.viewPassport = null;
      this.searched = false;
      return;
    }

    this.searchError = '';
    this.searching = true;
    this.searched = false;
    this.viewPassport = null;
    this.searchResults = [];

    this.passportService.searchPassports(query).pipe(take(1)).subscribe({
      next: results => {
        this.searchResults = results || [];
        this.searched = true;
        this.searching = false;
        if (this.searchResults.length === 1) {
          this.viewPassport = this.searchResults[0];
        }
      },
      error: () => {
        this.searchResults = [];
        this.searched = true;
        this.searching = false;
      }
    });
  }

  public selectPassport(passport: IPassportDetail): void {
    this.viewPassport = passport;
  }

  public clearSearch(): void {
    this.searchQuery = '';
    this.searchError = '';
    this.searchResults = [];
    this.viewPassport = null;
    this.searched = false;
  }

  public onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchPassport();
    }
  }
}
