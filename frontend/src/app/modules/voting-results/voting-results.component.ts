import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { ErrorComponent } from '@components/error/error.component';
import { IPoliticalParty } from '@models/party.model';
import { IPartyVoteResult } from '@models/vote.model';
import { PartyService } from '@services/party/party.service';
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
    private partyService: PartyService,
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

    forkJoin({
      parties: this.partyService.getParties().pipe(catchError(() => of([] as IPoliticalParty[]))),
      votes: this.votingService.getResults(period).pipe(catchError(() => of(null as IPartyVoteResult[] | null))),
    }).subscribe({
      next: ({ parties, votes }) => {
        if (votes === null) {
          this.loading = false;
          this.error = true;
          return;
        }

        this.results = this.mergeResults(parties ?? [], votes ?? []);
        this.totalVotes = this.results.reduce((sum, item) => sum + Number(item.voteCount || 0), 0);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  /**
   * Бэкенд getRes отдаёт только партии с голосами.
   * Подмешиваем все партии из /api/party/get с нулевыми голосами.
   */
  private mergeResults(parties: IPoliticalParty[], votes: IPartyVoteResult[]): IPartyVoteResult[] {
    const votesByName = new Map<string, IPartyVoteResult>();
    votes.forEach((item) => {
      if (item?.partyName) {
        votesByName.set(item.partyName, item);
      }
    });

    const names = new Set<string>();
    parties.forEach((party) => {
      if (party?.name) {
        names.add(party.name);
      }
    });
    votesByName.forEach((_, name) => names.add(name));

    const totalVotes = Array.from(votesByName.values())
      .reduce((sum, item) => sum + Number(item.voteCount || 0), 0);

    return Array.from(names)
      .map((partyName) => {
        const vote = votesByName.get(partyName);
        const voteCount = Number(vote?.voteCount || 0);
        const percentage = totalVotes > 0
          ? (voteCount * 100) / totalVotes
          : 0;

        return { partyName, voteCount, percentage };
      })
      .sort((a, b) => b.voteCount - a.voteCount || a.partyName.localeCompare(b.partyName, 'ru'));
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
