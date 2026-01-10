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
import { GISObject } from '../../@Interface/maproot.interface';

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
  private getObjectSub: Subscription;

  private title = inject(Title);
  private meta = inject(Meta);
  private mapHelper = inject(MapHelperService);
  private mapService = inject(MapRootService);

  public map: any;
  public selectedObject: GISObject | undefined;

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

  public fetchGISObject(gisID: number) {
    console.log('Fetching GIS Object for ID:', gisID);
    this.getObjectSub = this.mapService.getGISObject(gisID).subscribe({
      next: (res: GISObject) => {
        console.log(res);
      },
      error: (error: HttpErrorResponse): HttpErrorResponse => {
        return error;
      },
    });
  }
  ngOnDestroy(): void {
    this.getObjectSub?.unsubscribe();
  }
}
