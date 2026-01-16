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
import { GISObject, Units } from '../../@Interface/maproot.interface';
import { FeatureCollection } from 'geojson';
import { LayerGroupKey } from '../../@Interface/maproot.interface';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoaderService } from '../../@Service/loader.service';
import { TranslateModule } from '@ngx-translate/core';
import { DetailsDialogComponent } from '../details-dialog/details.dialog.component';

@Component({
  selector: 'map-root',
  templateUrl: './map.root.component.html',
  styleUrl: './map.root.component.scss',
  standalone: true,
  providers: [MapHelperService, MapRootService],
  imports: [
    NavbarComponent,
    FormsModule,
    CommonModule,
    LoadingComponent,
    NavbarComponent,
    TranslateModule,
    DetailsDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapRootComponent implements OnInit, AfterViewInit, OnDestroy {
  private getObjectSub: Subscription;
  private getGeoJSONsSub: Subscription;

  private title = inject(Title);
  private meta = inject(Meta);
  private mapHelper = inject(MapHelperService);
  private mapService = inject(MapRootService);
  private loaderService = inject(LoaderService);

  public isLoading = signal<{ loading: boolean; initial: boolean }>({
    loading: false,
    initial: false,
  });
  public map: any;
  public selectedObject = signal<GISObject | undefined>(undefined);

  public areas = signal<FeatureCollection | undefined>(undefined);
  public paths = signal<FeatureCollection | undefined>(undefined);
  public places = signal<FeatureCollection | undefined>(undefined);

  public bearInDegree = signal<number>(0);
  public units = signal<Units>('metric');

  //public showDialog = signal<boolean>(false);

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

    this.loaderService.$isLoadingAsObservable.subscribe(
      (loading: { loading: boolean; initial: boolean }) => {
        this.isLoading.set(loading);
      }
    );
  }

  ngOnInit(): void {
    this.map = this.mapHelper.initializeMap();
  }

  ngAfterViewInit() {
    /**
     * Map initialized, loading resources->
     */
    this.loaderService.showLoader(true);
    this.map?.on('load', async () => {
      this.mapHelper.addTileLayers(this.map);
      this.mapHelper.$mapBearingValue.subscribe((degree) => {
        this.bearInDegree.set(degree);
      });

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

          this.mapHelper.$mapSelectedObjectID.subscribe((gisid) => {
            gisid ? this.selectGISFeature(gisid, true) : this.selectedObject.set(undefined);
          });
          this.loaderService.hideLoader();
        },
        error: (error: HttpErrorResponse): HttpErrorResponse => {
          this.loaderService.hideLoader();
          return error;
        },
      });
    });
  }

  public selectGISFeature(gisID: number, isSelectedFromMap: boolean) {
    this.loaderService.showLoader(false);

    this.getObjectSub = this.mapService.getGISObject(gisID).subscribe({
      next: (res: GISObject) => {
        this.selectedObject.set(res);
        //this.showDialog.set(true);
        if (!isSelectedFromMap) {
          const layertype: LayerGroupKey = this.mapHelper.calcLayerGroupKeyFromGisID(gisID);
          this.mapHelper.singleGisObjectSelected(this.map, gisID, layertype, this[layertype]());
        }

        this.loaderService.hideLoader();
      },
      error: (error: HttpErrorResponse): HttpErrorResponse => {
        this.loaderService.hideLoader();
        return error;
      },
    });
  }

  public toggleLayers(typeName: LayerGroupKey) {
    this.mapHelper.onToggleLayer(this.map, typeName);
  }

  public onSetPitchToDefault() {
    this.mapHelper.setPitchToDefault(this.map);
  }

  public onChangeUnits() {
    this.units() === 'metric' ? this.units.set('imperial') : this.units.set('metric');
  }
  /*  public onDialogClosed() {
    this.showDialog.set(false);
  } */
  ngOnDestroy(): void {
    this.getObjectSub?.unsubscribe();
    this.getGeoJSONsSub?.unsubscribe();
  }
}
