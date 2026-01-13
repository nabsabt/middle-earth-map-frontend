import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Map } from 'maplibre-gl';
import { isPlatformBrowser } from '@angular/common';
import {
  AREAS_PAINT_VALUES,
  AREAS_OUTLINE_PAINT_VALUES,
  PLACES_LABEL_PAINT_VALUES,
  PATHS_PAINT_VALUES,
  PATHS_PSEUDOLINE_PAINT_VALUES,
} from '../@Constant/map.style.values';
import { BehaviorSubject } from 'rxjs';
import { LayerGroupKey } from '../@Interface/maproot.interface';

@Injectable()
export class MapHelperService {
  private mapInstance: Map | null = null;
  public MapSelectedObject = new BehaviorSubject<undefined | number>(undefined);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  initializeMap() {
    if (this.mapInstance) return this.mapInstance;

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
    this.mapInstance = map;
    return map;
  }

  public addTileLayers(map: Map) {
    map.getSource('basemapSrc') ? map.removeSource('basemapSrc') : '';
    map.getSource('elevationmapSrc') ? map.removeSource('elevationmapSrc') : '';
    map.getLayer('elevationmap') ? map.removeLayer('elevationmap') : '';

    map.addSource('basemapSrc', {
      type: 'raster',
      /**
       * vsc-ben futtatva (ha tileserver fut): http://localhost:8080/data/basemap/{z}/{x}/{y}.png
       * docker-ben futtatva: '/tiles/basemap/data/basemap/{z}/{x}/{y}.png'
       */
      tiles: [`http://localhost:8080/data/basemap/{z}/{x}/{y}.png?v=${new Date().getTime()}`],
      //tiles: ['/tiles/basemap/data/basemap/{z}/{x}/{y}.png'],
      tileSize: 256,
      minzoom: 5,
      maxzoom: 10,
    });

    map.addSource('elevationmapSrc', {
      type: 'raster',
      /**
       * vsc-ben futtatva (ha tileserver fut): http://localhost:8081/data/elevationMap/{z}/{x}/{y}.png
       * docker-ben futtatva: '/tiles/elevationMap/data/elevationMap/{z}/{x}/{y}.png'
       */
      tiles: [`http://localhost:8081/data/elevationMap/{z}/{x}/{y}.png?v=${new Date().getTime()}`],
      //tiles: ['/tiles/elevationMap/data/elevationMap/{z}/{x}/{y}.png'],
      tileSize: 256,
      minzoom: 5,
      maxzoom: 10,
    });

    map.addLayer({
      id: 'basemap',
      type: 'raster',
      source: 'basemapSrc',
    });

    /* map.addLayer({
      id: 'elevationmap',
      type: 'raster',
      source: 'elevationmapSrc',
    }); */
  }

  public onAddAreas(areas: any, map: Map) {
    let hoveredID: undefined | number = undefined;
    areas.features = areas.features.map((f: any) => ({ ...f, id: f.properties.gisID }));

    this.initializeSourceAndCheck('areas', map, areas);

    map.addLayer({
      id: 'areas',
      source: 'areas-Src',
      type: 'fill',
      paint: AREAS_PAINT_VALUES,
    });
    map.addLayer({
      id: 'areas-outline',
      source: 'areas-Src',
      type: 'line',
      paint: AREAS_OUTLINE_PAINT_VALUES,
    });

    this.addMapEvents(map, 'areas', hoveredID);
    map.setLayoutProperty('areas', 'visibility', 'none');
    map.setLayoutProperty('areas-outline', 'visibility', 'none');
  }

  public async onAddPoint(points: any, map: Map) {
    let hoveredID: undefined | number = undefined;
    points.features = points.features.map((f: any) => ({ ...f, id: f.properties.gisID }));

    this.initializeSourceAndCheck('places', map, points);

    const image = await map.loadImage('/assets/icons/location_runeAI.png');
    map.addImage('locationIcon', image.data);

    map.addLayer({
      id: 'places',
      source: 'places-Src',
      type: 'symbol',
      layout: {
        'icon-image': 'locationIcon',
        'icon-overlap': 'always',
        'text-overlap': 'always',
        'icon-size': 0.1,
      },
    });

    map.addLayer({
      id: 'places-label',
      source: 'places-Src',
      type: 'symbol',
      layout: {
        'text-size': 18,
        'text-field': ['get', 'name_EN'],
        'text-offset': [0, 2],
      },
      paint: PLACES_LABEL_PAINT_VALUES,
      minzoom: 6,
      maxzoom: 9,
    });

    this.addMapEvents(map, 'places', hoveredID);
    map.setLayoutProperty('places', 'visibility', 'none');
    map.setLayoutProperty('places-label', 'visibility', 'none');
  }

  public onAddPaths(paths: any, map: Map) {
    let hoveredID: undefined | number = undefined;
    paths.features = paths.features.map((f: any) => ({ ...f, id: f.properties.gisID }));

    this.initializeSourceAndCheck('paths', map, paths);

    map.addLayer({
      id: 'paths',
      source: 'paths-Src',
      type: 'line',
      paint: PATHS_PAINT_VALUES,
    });

    map.addLayer({
      id: 'paths-pseudo',
      source: 'paths-Src',
      type: 'line',
      paint: PATHS_PSEUDOLINE_PAINT_VALUES,
    });

    this.addMapEvents(map, 'paths', hoveredID);
    map.setLayoutProperty('paths', 'visibility', 'none');
    map.setLayoutProperty('paths-pseudo', 'visibility', 'none');
  }

  /**
   *
   * @param name : name of feature ('areas','paths', 'places')
   * @param map :map instance
   * @param data :feature dataset
   */
  private initializeSourceAndCheck(name: LayerGroupKey, map: Map, data: any) {
    map.getSource(`${name}-Src`) ? map.removeSource(`${name}-Src`) : '';
    map.getLayer(`${name}`) ? map.removeLayer(`${name}`) : '';
    map.getLayer(`${name}-outline`) ? map.removeLayer(`${name}-outline`) : '';
    map.getLayer(`${name}-label`) ? map.removeLayer(`${name}-label`) : '';

    map.addSource(`${name}-Src`, {
      data: data,
      type: 'geojson',
    });
  }

  private addMapEvents(map: Map, name: LayerGroupKey, hoveredID: undefined | number) {
    map.on('click', name, (e: any) => {
      this.MapSelectedObject.next(e.features[0].properties.gisID);
    });

    map.on('mousemove', name, (e: any) => {
      const f = e.features?.[0];
      if (!f) return;

      const id = f.id;
      if (id == null) return; // allows id=0 too

      if (hoveredID != null && hoveredID !== id) {
        map.setFeatureState({ source: `${name}-Src`, id: hoveredID }, { hovered: false });
      }

      hoveredID = id;
      map.setFeatureState({ source: `${name}-Src`, id }, { hovered: true });
    });

    map.on('mouseleave', name, (e: any) => {
      if (hoveredID) {
        map.setFeatureState({ source: `${name}-Src`, id: hoveredID }, { hovered: false });

        hoveredID = undefined;
      }
    });
  }

  public onToggleLayer(map: Map, name: LayerGroupKey) {
    const currentlyVisiblie = map.getLayoutProperty(name, 'visibility') === 'none' ? false : true;
    if (name === 'areas') {
      currentlyVisiblie
        ? map.setLayoutProperty('areas', 'visibility', 'none')
        : map.setLayoutProperty('areas', 'visibility', 'visible');

      currentlyVisiblie
        ? map.setLayoutProperty('areas-outline', 'visibility', 'none')
        : map.setLayoutProperty('areas-outline', 'visibility', 'visible');

      map.setLayoutProperty('places', 'visibility', 'none');
      map.setLayoutProperty('places-label', 'visibility', 'none');

      map.setLayoutProperty('paths', 'visibility', 'none');
      map.setLayoutProperty('paths-pseudo', 'visibility', 'none');
    } else if (name === 'places') {
      currentlyVisiblie
        ? map.setLayoutProperty('places', 'visibility', 'none')
        : map.setLayoutProperty('places', 'visibility', 'visible');

      currentlyVisiblie
        ? map.setLayoutProperty('places-label', 'visibility', 'none')
        : map.setLayoutProperty('places-label', 'visibility', 'visible');

      map.setLayoutProperty('areas', 'visibility', 'none');
      map.setLayoutProperty('areas-outline', 'visibility', 'none');

      map.setLayoutProperty('paths', 'visibility', 'none');
      map.setLayoutProperty('paths-pseudo', 'visibility', 'none');
    } else if (name === 'paths') {
      currentlyVisiblie
        ? map.setLayoutProperty('paths', 'visibility', 'none')
        : map.setLayoutProperty('paths', 'visibility', 'visible');

      currentlyVisiblie
        ? map.setLayoutProperty('paths-pseudo', 'visibility', 'none')
        : map.setLayoutProperty('paths-pseudo', 'visibility', 'visible');

      map.setLayoutProperty('areas', 'visibility', 'none');
      map.setLayoutProperty('areas-outline', 'visibility', 'none');

      map.setLayoutProperty('places', 'visibility', 'none');
      map.setLayoutProperty('places-label', 'visibility', 'none');
    }
  }
}
