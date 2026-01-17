import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { GISObject, Units } from '../../@Interface/maproot.interface';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

@Component({
  selector: 'details-dialog',
  templateUrl: './details.dialog.component.html',
  styleUrl: './details.dialog.component.scss',
  imports: [TranslateModule],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsDialogComponent implements OnInit, OnDestroy {
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

      const el = this.galleryEl();

      // no DOM yet or no images -> destroy and do nothing
      if (!el || !this.selectedObject()?.gallery?.length) {
        this.destroyLightbox();
        return;
      }
      queueMicrotask(() => this.initLightbox(el));
    });
  }

  public onCloseDialog() {
    this.close.set(true);
  }

  ngOnInit(): void {
    this.close.set(true);
  }

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

  private destroyLightbox() {
    this.lightbox?.destroy();
    this.lightbox = undefined;
  }

  ngOnDestroy(): void {
    this.lightbox?.destroy();
  }
}
