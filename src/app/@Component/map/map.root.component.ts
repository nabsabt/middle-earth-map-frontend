import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MapHelperService } from '../../@Service/map.helper.service';
import { MapRootService } from '../../@Service/map.root.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SearchInputComponent } from '../search-input/search.input.component';
import { GISObject } from '../../@Interface/maproot.interface';
import { FeatureCollection } from 'geojson';
import { LayerGroupKey, NavbarControls } from '../../@Interface/maproot.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'map-root',
  templateUrl: './map.root.component.html',
  styleUrl: './map.root.component.scss',
  standalone: true,
  providers: [MapHelperService, MapRootService],
  imports: [FormsModule, SearchInputComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapRootComponent implements OnInit, AfterViewInit, OnDestroy {
  private getObjectSub: Subscription;
  private getGeoJSONsSub: Subscription;

  private title = inject(Title);
  private meta = inject(Meta);
  private mapHelper = inject(MapHelperService);
  private mapService = inject(MapRootService);

  public isLoading = signal<boolean>(false);
  public map: any;
  public selectedObject = signal<GISObject | undefined>(undefined);

  public selectedNavbarControl = signal<NavbarControls>(undefined);

  public areas = signal<FeatureCollection | undefined>(undefined);
  public paths = signal<FeatureCollection | undefined>(undefined);
  public places = signal<FeatureCollection | undefined>(undefined);

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

  ngOnInit(): void {
    this.map = this.mapHelper.initializeMap();
  }

  ngAfterViewInit() {
    /**
     * Map initialized, loading resources->
     */
    this.map?.on('load', async () => {
      this.mapHelper.addTileLayers(this.map);

      this.setLoader();
      this.getGeoJSONsSub = this.mapService.getGeoJSONS().subscribe({
        next: (res: {
          areas: FeatureCollection;
          paths: FeatureCollection;
          places: FeatureCollection;
        }) => {
          this.areas.set(res.areas);
          this.paths.set(res.paths);
          this.places.set(res.places);

          this.mapHelper.onAddAreas(this.areas(), this.map);
          this.mapHelper.onAddPoint(this.places(), this.map);
          this.mapHelper.onAddPaths(this.paths(), this.map);

          this.mapHelper.MapSelectedObject.asObservable().subscribe((gisid) => {
            gisid ? this.selectGISFeature(gisid, true) : '';
          });
          this.setLoader();
        },
        error: (error: HttpErrorResponse): HttpErrorResponse => {
          this.setLoader();
          return error;
        },
      });
    });
  }

  public selectGISFeature(gisID: number, isSelectedFromMap: boolean) {
    this.setLoader();
    this.getObjectSub = this.mapService.getGISObject(gisID).subscribe({
      next: (res: GISObject) => {
        this.selectedObject.set(res);
        if (!isSelectedFromMap) {
          const layertype: LayerGroupKey = this.mapHelper.calcLayerGroupKeyFromGisID(gisID);
          this.mapHelper.singleGisObjectSelected(this.map, gisID, this[layertype]());
        }

        this.setLoader();
      },
      error: (error: HttpErrorResponse): HttpErrorResponse => {
        this.setLoader();
        return error;
      },
    });
  }

  private setLoader() {
    this.isLoading()
      ? setTimeout(() => {
          this.isLoading.set(false);
        }, 800)
      : this.isLoading.set(true);
  }

  public toggleLayers(typeName: LayerGroupKey) {
    this.mapHelper.onToggleLayer(this.map, typeName);
  }

  public toggleNavbarActiveButton(button: NavbarControls) {
    this.selectedNavbarControl() === button
      ? this.selectedNavbarControl.set(undefined)
      : this.selectedNavbarControl.set(button);
  }

  ngOnDestroy(): void {
    this.getObjectSub?.unsubscribe();
    this.getGeoJSONsSub?.unsubscribe();
  }
}
