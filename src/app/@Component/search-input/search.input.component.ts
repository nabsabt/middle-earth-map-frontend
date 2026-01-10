import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  OnDestroy,
  signal,
} from '@angular/core';
import { SearchResults } from '../../@Interface/maproot.interface';
import { Subscription } from 'rxjs';
import { MapRootService } from '../../@Service/map.root.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'search-input',
  templateUrl: './search.input.component.html',
  styleUrl: './search.input.component.scss',
  standalone: true,
  imports: [CommonModule],
  providers: [MapRootService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnDestroy {
  private getSearchResultSub: Subscription;
  private mapService = inject(MapRootService);
  public value = model<string>('');
  public isFocused = signal<boolean>(false);

  public searchResults = signal<Array<SearchResults>>([]);

  onSearch() {
    if (this.value() === '') return;

    this.getSearchResultSub = this.mapService
      .getSearchResults({ input: this.value(), lang: 'en' })
      .subscribe({
        next: (res: SearchResults[]) => {
          this.searchResults.set(res);
        },
        error: (error: HttpErrorResponse): HttpErrorResponse => {
          return error;
        },
      });
  }

  ngOnDestroy(): void {
    this.getSearchResultSub?.unsubscribe();
  }
}
