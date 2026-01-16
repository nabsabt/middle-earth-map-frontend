import { Component, EventEmitter, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { LayerGroupKey, NavbarControls } from '../../@Interface/maproot.interface';
import { SearchInputComponent } from '../search-input/search.input.component';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
  imports: [SearchInputComponent],
  providers: [],
})
export class NavbarComponent implements OnInit {
  @Output() selectedObjID = new EventEmitter<number>();
  @Output() layerToToggle = new EventEmitter<LayerGroupKey>();

  public selectedNavbarControl = signal<NavbarControls>(undefined);

  public isLoading = signal<{ loading: boolean; initial: boolean }>({
    loading: false,
    initial: false,
  });

  constructor() {}
  ngOnInit(): void {}

  public selectFeature(gisID: number) {
    this.selectedObjID.emit(gisID);
  }

  public onToggleLayer(typeName: LayerGroupKey) {
    this.layerToToggle.emit(typeName);
  }

  public toggleNavbarActiveButton(button: NavbarControls) {
    this.selectedNavbarControl() === button
      ? this.selectedNavbarControl.set(undefined)
      : this.selectedNavbarControl.set(button);
  }
}
