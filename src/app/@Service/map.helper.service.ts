import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Map } from 'maplibre-gl';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class MapHelperService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  initializeMap() {
    if (!isPlatformBrowser(this.platformId)) return null;

    const map = new Map({
      container: 'map',
      style: { version: 8, sources: {}, layers: [] },
      center: [-0.29441497, 1.340374], // [lng, lat]
      zoom: 5.5,
      minZoom: 5,
      maxZoom: 9,
      maxBounds: [
        [-14.6088769, -10.3940444],
        [12.6197198, 10.03391759],
      ],
      maplibreLogo: false,
      attributionControl: false,
    });

    map.on('load', () => {
      map.addSource('basemap', {
        type: 'raster',
        /**
         * vsc-ben futtatva (ha tileserver fut): http://localhost:8080/data/basemap/{z}/{x}/{y}.png
         * docker-ben futtatva: '/tiles/basemap/data/basemap/{z}/{x}/{y}.png'
         */
        tiles: ['http://localhost:8080/data/basemap/{z}/{x}/{y}.png'],
        //tiles: ['/tiles/basemap/data/basemap/{z}/{x}/{y}.png'],
        tileSize: 256,
        minzoom: 5,
        maxzoom: 10,
      });

      map.addSource('elevationmap', {
        type: 'raster',
        /**
         * vsc-ben futtatva (ha tileserver fut): http://localhost:8081/data/elevationMap/{z}/{x}/{y}.png
         * docker-ben futtatva: '/tiles/elevationMap/data/elevationMap/{z}/{x}/{y}.png'
         */
        tiles: ['http://localhost:8081/data/elevationMap/{z}/{x}/{y}.png'],
        //tiles: ['/tiles/elevationMap/data/elevationMap/{z}/{x}/{y}.png'],
        tileSize: 256,
        minzoom: 5,
        maxzoom: 10,
      });

      map.addLayer({
        id: 'basemap',
        type: 'raster',
        source: 'basemap',
      });
      /*  map.addLayer({
        id: 'elevationmap',
        type: 'raster',
        source: 'elevationmap',
      }); */

      map.on('click', (e: any) => {
        console.log(e.lngLat);
        console.log(map.getZoom());
      });
    });

    return map;
  }
}
