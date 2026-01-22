import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  model,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { SearchResults } from '../../@Interface/maproot.interface';
import { Subscription } from 'rxjs';
import { MapRootService } from '../../@Service/map.root.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../@Service/alert.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'search-input',
  templateUrl: './search.input.component.html',
  styleUrl: './search.input.component.scss',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  providers: [MapRootService, AlertService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit, OnDestroy {
  public changeToLangValue = signal<string>('en');

  @Output() selectedGISID = new EventEmitter<number>();
  private getSearchResultSub: Subscription;

  private mapService = inject(MapRootService);
  private alertService = inject(AlertService);

  public value = model<string>('');
  public isFocused = signal<boolean>(false);

  public searchResults = signal<Array<SearchResults>>([]);

  constructor(public translateService: TranslateService) {
    translateService.setDefaultLang('en');
    translateService.use('en');
  }
  ngOnInit(): void {
    this.changeToLangValue.set(this.translateService.currentLang === 'en' ? 'hu' : 'en');
  }

  onSearch() {
    if (this.value() === '') return;

    this.getSearchResultSub = this.mapService.getSearchResults({ input: this.value() }).subscribe({
      next: (res: SearchResults[] | { message: string }) => {
        if (Array.isArray(res)) {
          this.searchResults.set(res);
        } else {
          this.alertService.showAlert(res.message, { position: 'bottom' });
          this.searchResults.set([]);
          return;
        }
      },
      error: (error: HttpErrorResponse): HttpErrorResponse => {
        this.alertService.showAlert(error.error.message, { position: 'bottom' });

        return error;
      },
    });
  }

  public onSearchResultSelected(gisID: number) {
    this.selectedGISID.emit(gisID);
    this.searchResults.set([]);
    this.value.set('');
  }

  changeLanguage() {
    const nextLang = this.translateService.currentLang === 'en' ? 'hu' : 'en';

    this.translateService.use(nextLang);
    const nextButtonLabel = nextLang === 'en' ? 'hu' : 'en';
    this.changeToLangValue.set(nextButtonLabel);
  }

  ngOnDestroy(): void {
    this.getSearchResultSub?.unsubscribe();
  }
}
