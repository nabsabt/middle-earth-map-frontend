import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { GISObject, Units } from '../../@Interface/maproot.interface';

@Component({
  selector: 'details-dialog',
  templateUrl: './details.dialog.component.html',
  styleUrl: './details.dialog.component.scss',
  imports: [TranslateModule],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsDialogComponent implements OnInit, OnDestroy {
  private breakPointObserver = inject(BreakpointObserver);
  private translateService = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  public selectedObject = input<GISObject>();
  public unit = input<Units>();
  public lang = signal<'HU' | 'EN'>('EN');

  public isMobile = signal<boolean>(false);

  public close = signal<boolean>(false);

  constructor() {
    this.breakPointObserver.isMatched('(min-width: 769px)')
      ? this.isMobile.set(false)
      : this.isMobile.set(true);

    this.breakPointObserver.observe(['(max-width: 768px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile.set(true);
      }
    });

    this.breakPointObserver.observe(['(min-width: 769px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile.set(false);
      }
    });

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      event.lang === 'hu' ? this.lang.set('HU') : this.lang.set('EN');
      this.cdr.markForCheck();
    });

    effect(() => {
      this.selectedObject()?.gisID ? this.close.set(false) : this.close.set(true);
    });
  }

  public onCloseDialog() {
    this.close.set(true);
  }

  ngOnInit(): void {
    this.close.set(true);
  }

  /*  public onImagesLoaded() {
    console.log('event ran.');
    this.loadedImages.update((n) => n + 1);
    if (this.loadedImages() === this.imageNumber()) {
      console.log('All images loaded.');
    }
  } */

  ngOnDestroy(): void {}
}
