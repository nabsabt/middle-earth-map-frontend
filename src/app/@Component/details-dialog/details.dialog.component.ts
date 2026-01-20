import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  effect,
  ElementRef,
  HostListener,
  Inject,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { GISObject, Units } from '../../@Interface/maproot.interface';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'details-dialog',
  templateUrl: './details.dialog.component.html',
  styleUrl: './details.dialog.component.scss',
  imports: [TranslateModule],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('imgGallery')
  set imgGallery(el: ElementRef<HTMLElement> | undefined) {
    this.galleryEl.set(el?.nativeElement ?? null);
  }

  private breakPointObserver = inject(BreakpointObserver);
  private translateService = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  private lightbox!: PhotoSwipeLightbox | undefined;
  private galleryEl = signal<HTMLElement | null>(null);

  public selectedObject = input<GISObject>();
  public unit = input<Units>();
  public lang = signal<'HU' | 'EN'>('EN');

  public isMobile = signal<boolean>(false);

  public close = signal<boolean>(false);

  /**
   * mobile dialog settings->
   */
  public isExpanded = signal<boolean>(false);
  private collapsedHeight = signal<number>(50); // px - ennyi látszik mindig alul
  private expandedRatio = signal<number>(0.6); // 60vh

  public expandedHeight = signal<number>(0); // px
  public collapsedOffset = signal<number>(0); // px = mennyit kell lecsúsznia, hogy csak 60px maradjon
  public currentOffset = signal<number>(0); // px = jelenlegi translateY érték

  public isDragging = signal<boolean>(false);
  public dragStartY = signal<number>(0);
  public dragStartOffset = signal<number>(0);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
  ) {
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

      const el = this.galleryEl();

      // no DOM yet or no images -> destroy and do nothing
      if (el && this.selectedObject()?.gallery?.length) {
        queueMicrotask(() => this.initLightbox(el));
      } else {
        this.destroyLightbox();
      }

      //mobile part->
      if (!isPlatformBrowser(this.platformId)) return;
      if (!this.isMobile() || !this.selectedObject()) return;
      const h = this.document.defaultView?.innerHeight ?? 0;
      this.expandedHeight.set(h * this.expandedRatio());
      this.collapsedOffset.set(this.expandedHeight() - this.collapsedHeight());

      // start collapsed whenever a new object opens
      this.isExpanded.set(false);
      this.currentOffset.set(this.collapsedOffset());
    });
  }

  ngOnInit(): void {
    this.close.set(true);
  }
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
  }
  public onCloseDialog() {
    this.close.set(true);
  }

  /**
   * mobile dialog logic functions->
   */

  private getY(ev: TouchEvent | MouseEvent): number {
    if (ev instanceof TouchEvent) {
      return (ev.touches[0] ?? ev.changedTouches[0]).clientY;
    }
    return ev.clientY;
  }

  openMobileDialog(): void {
    this.mobileAnimateTo(0); // 0 offset = teljesen nyitva (60vh)
    this.close.set(false);
  }

  public closeMobileDialog() {
    this.mobileAnimateTo(this.collapsedOffset()); // csak 60px látszik
    this.close.set(true);
  }

  private mobileAnimateTo(offset: number): void {
    this.currentOffset.set(offset);
  }

  public startDrag(event: TouchEvent | MouseEvent): void {
    this.isDragging.set(true);
    this.dragStartY.set(this.getY(event));
    this.dragStartOffset.set(this.currentOffset());
  }

  @HostListener('window:touchmove', ['$event'])
  @HostListener('window:mousemove', ['$event'])
  onDragMobileDialog(event: TouchEvent | MouseEvent): void {
    if (!this.isDragging()) return;

    const y = this.getY(event);

    const delta = y - this.dragStartY();

    let newOffset = this.dragStartOffset() + delta;

    if (newOffset < 0) newOffset = 0;
    if (newOffset > this.collapsedOffset()) newOffset = this.collapsedOffset();

    this.currentOffset.set(newOffset);
  }

  @HostListener('window:touchend')
  @HostListener('window:mouseup')
  endDrag(): void {
    if (!this.isDragging()) return;
    this.isDragging.set(false);

    const halfway = this.collapsedOffset() / 2;

    if (this.currentOffset() < halfway) {
      this.openMobileDialog();
    } else {
      this.closeMobileDialog();
    }
  }

  /*   public onBackdropClick() {
    this.collapseMobile();
  }
 */
  /**
   * Gallery logic
   * @param el to where the gallery is rendered
   */
  private async initLightbox(el: HTMLElement) {
    this.destroyLightbox();

    // set real sizes
    const links = el.querySelectorAll<HTMLAnchorElement>('a[href]');
    for (const link of links) {
      const img = new Image();
      img.src = link.href;

      try {
        await img.decode();
      } catch {
        // fallback if decode fails (cross-origin / older browsers)
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }

      // only set if we got something valid
      if (img.naturalWidth && img.naturalHeight) {
        link.dataset['pswpWidth'] = String(img.naturalWidth);
        link.dataset['pswpHeight'] = String(img.naturalHeight);
      }
    }

    this.lightbox = new PhotoSwipeLightbox({
      gallery: el,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });

    this.lightbox.init();
  }

  public toggleMobile() {
    this.isExpanded() ? this.collapseMobile() : this.expandMobile();
  }

  public expandMobile(): void {
    this.isExpanded.set(true);
    this.currentOffset.set(0);
  }

  public collapseMobile(): void {
    this.isExpanded.set(false);

    this.currentOffset.set(this.collapsedOffset());
  }

  private destroyLightbox() {
    this.lightbox?.destroy();
    this.lightbox = undefined;
  }

  ngOnDestroy(): void {
    this.lightbox?.destroy();
  }
}
