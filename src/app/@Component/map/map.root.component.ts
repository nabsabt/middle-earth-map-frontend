import { AfterViewInit, Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MapHelperService } from '../../@Service/map.helper.service';
@Component({
  selector: 'map-root',
  templateUrl: './map.root.component.html',
  styleUrl: './map.root.component.scss',
  standalone: true,
  providers: [MapHelperService],
  imports: [],
})
export class MapRootComponent implements OnInit, AfterViewInit, OnDestroy {
  private title = inject(Title);
  private meta = inject(Meta);
  private mapHelper = inject(MapHelperService);

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
