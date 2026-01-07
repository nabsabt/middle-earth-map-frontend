import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Map } from 'maplibre-gl';
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
    if (!isPlatformBrowser(this.platformId)) return;

    const maplibregl = await import('maplibre-gl'); // IMPORTANT: no top-level import
    this.map = new maplibregl.Map({
      container: 'map',
      //style: 'https://demotiles.maplibre.org/style.json',,
      style: { version: 8, sources: {}, layers: [] },
      center: [-0.29441497, 1.340374], // [lng, lat]
      zoom: 6,
      minZoom: 5,
      maxZoom: 9,
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');

    this.map.on('load', () => {
      this.map.addSource('basemap', {
        type: 'raster',
        tiles: ['http://localhost:8080/data/basemap/{z}/{x}/{y}.png'],
        tileSize: 256,
        minzoom: 5,
        maxzoom: 10,
      });

      this.map.addLayer({
        id: 'basemap',
        type: 'raster',
        source: 'basemap',
      });
    });
  }
  ngOnDestroy(): void {}
}
