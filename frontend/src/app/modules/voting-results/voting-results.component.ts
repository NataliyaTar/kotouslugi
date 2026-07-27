import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { ErrorComponent } from '@components/error/error.component';
import { IPartyVoteResult } from '@models/vote.model';
import { VotingService } from '@services/voting/voting.service';

@Component({
  selector: 'app-voting-results',
  standalone: true,
  imports: [
    ThrobberComponent,
    ErrorComponent,
    DecimalPipe,
    FormsModule,
  ],
  templateUrl: './voting-results.component.html',
  styleUrl: './voting-results.component.scss'
})
export class VotingResultsComponent implements OnInit, OnDestroy {

  public loading = true;
  public error = false;
  public results: IPartyVoteResult[] = [];
  public totalVotes = 0;
  public period = '';
  public selectedPeriod = '';
  public periodOptions: string[] = [];

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private votingService: VotingService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.periodOptions = this.buildPeriodOptions();
  }

  public ngOnInit(): void {
    this.subscriptions.push(
      this.route.queryParamMap.subscribe((params) => {
        const fromQuery = (params.get('t') ?? '').trim();
        const period = fromQuery || this.votingService.getCurrentElectionPeriod();
        this.ensurePeriodOption(period);
        this.selectedPeriod = period;
        this.loadResults(period);
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  public onPeriodChange(): void {
    if (!this.selectedPeriod) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { t: this.selectedPeriod },
      queryParamsHandling: 'merge',
    });
  }

  public barWidth(percentage: number): string {
    const value = Number.isFinite(percentage) ? Math.max(0, Math.min(100, percentage)) : 0;
    return `${value}%`;
  }

  private loadResults(period: string): void {
    this.loading = true;
    this.error = false;
    this.period = period;

    this.votingService.getResults(period).subscribe({
      next: (results) => {
        this.results = results ?? [];
        this.totalVotes = this.results.reduce((sum, item) => sum + Number(item.voteCount || 0), 0);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  /** Несколько прошлых, текущий и ближайший будущий периоды. */
  private buildPeriodOptions(): string[] {
    const current = this.votingService.getCurrentElectionPeriod();
    const startYear = Number(current.split('-')[0]);
    const options: string[] = [];

    for (let year = startYear + 1; year >= startYear - 5; year -= 1) {
      options.push(`${year}-${year + 1}`);
    }

    return options;
  }

  private ensurePeriodOption(period: string): void {
    if (!period || this.periodOptions.includes(period)) {
      return;
    }
    this.periodOptions = [...this.periodOptions, period].sort((a, b) => b.localeCompare(a));
  }
}
