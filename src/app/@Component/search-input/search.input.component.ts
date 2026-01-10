import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  model,
  OnDestroy,
  Output,
  signal,
} from '@angular/core';
import { SearchResults } from '../../@Interface/maproot.interface';
import { Subscription } from 'rxjs';
import { MapRootService } from '../../@Service/map.root.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../@Service/alert.service';

@Component({
  selector: 'search-input',
  templateUrl: './search.input.component.html',
  styleUrl: './search.input.component.scss',
  standalone: true,
  imports: [CommonModule],
  providers: [MapRootService, AlertService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnDestroy {
  @Output() selectedGISID = new EventEmitter<number>();
  private getSearchResultSub: Subscription;

  private mapService = inject(MapRootService);
  private alertService = inject(AlertService);

  public value = model<string>('');
  public isFocused = signal<boolean>(false);

  public searchResults = signal<Array<SearchResults>>([]);

  onSearch() {
    if (this.value() === '') return;

    this.getSearchResultSub = this.mapService
      .getSearchResults({ input: this.value(), lang: 'en' })
      .subscribe({
        next: (res: SearchResults[]) => {
          if (res.length === 0) {
            this.alertService.showAlert('No results found.', { position: 'bottom' });
            this.searchResults.set([]);
            return;
          }
          this.searchResults.set(res);
        },
        error: (error: HttpErrorResponse): HttpErrorResponse => {
          return error;
        },
      });
  }

  public onSearchResultSelected(gisID: number) {
    this.selectedGISID.emit(gisID);
    this.searchResults.set([]);
    this.value.set('');
  }

  ngOnDestroy(): void {
    this.getSearchResultSub?.unsubscribe();
  }
}
