import { Component, OnInit } from '@angular/core';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { ErrorComponent } from '@components/error/error.component';
import { PassportCardComponent } from '@components/passport-card/passport-card.component';
import { IPassportDocument } from '@models/passport.model';
import { PassportService } from '@services/passport/passport.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    ThrobberComponent,
    ErrorComponent,
    PassportCardComponent,
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit {

  public loading = true;
  public error = false;
  public passports: IPassportDocument[] = [];

  constructor(
    private passportService: PassportService,
  ) {}

  public ngOnInit(): void {
    this.passportService.getApprovedPassports().subscribe({
      next: (passports) => {
        this.passports = passports;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }
}
