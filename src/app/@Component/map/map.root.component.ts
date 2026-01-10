import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MapHelperService } from '../../@Service/map.helper.service';
import { MapRootService } from '../../@Service/map.root.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SearchInputComponent } from '../search-input/search.input.component';

@Component({
  selector: 'map-root',
  templateUrl: './map.root.component.html',
  styleUrl: './map.root.component.scss',
  standalone: true,
  providers: [MapHelperService, MapRootService],
  imports: [FormsModule, SearchInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapRootComponent implements OnInit, AfterViewInit, OnDestroy {
  private title = inject(Title);
  private meta = inject(Meta);
  private mapHelper = inject(MapHelperService);
  private mapService = inject(MapRootService);

  public map: any;

  constructor() {
    this.title.setTitle('Map of Middle-Earth');
    this.meta.updateTag({
      name: 'description',
      content: 'Interactive Middle-earth map with places, routes and regions.',
    });
    this.meta.updateTag({ property: 'og:title', content: 'Middle-earth Map' });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Explore locations, routes and regions.',
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.map = this.mapHelper.initializeMap();
  }
  ngOnDestroy(): void {}
}
