import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'map-root',
  templateUrl: './map.root.component.html',
  styleUrl: './map.root.component.scss',
  standalone: true,
  providers: [],
  imports: [],
})
export class MapRootComponent implements OnInit, AfterViewInit, OnDestroy {
  private title = inject(Title);
  private meta = inject(Meta);
  private platformId = inject(PLATFORM_ID);

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
  async ngAfterViewInit() {
    /**
     * NEVER run maplibre with SSR
     */
    if (!isPlatformBrowser(this.platformId) || this.map) return;
    const maplibregl = await import('maplibre-gl');

    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json', // replace with yours
      center: [19.04, 47.5], // [lng, lat]
      zoom: 5,
      //attributionControl: true,
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
  }
  ngOnDestroy(): void {}
}
