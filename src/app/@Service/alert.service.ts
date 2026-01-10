import { inject, Injectable } from '@angular/core';
import { AlertComponent } from '../@Component/alert/alert.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

type AlertOptions = {
  duration?: number; // auto-close
  position?: 'top' | 'bottom';
};

@Injectable()
export class AlertService {
  private overlay = inject(Overlay);
  private ref: OverlayRef | null = null;
  private timer: any;

  constructor() {}

  public showAlert(message: string, options: AlertOptions = {}): void {
    const { duration = 2500, position = 'bottom' } = options;

    this.close();

    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      [position === 'bottom' ? 'bottom' : 'top']('16px');

    this.ref = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: ['alert-overlay-panel'],
    });

    const portal = new ComponentPortal(AlertComponent);
    const cmpRef = this.ref.attach(portal);

    cmpRef.instance.message = message;
    const sub = cmpRef.instance.close.subscribe(() => {
      sub.unsubscribe();
      this.close();
    });

    if (duration > 0) {
      this.timer = setTimeout(() => this.close(), duration);
    }
  }

  private close(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.ref) {
      this.ref.dispose();
      this.ref = null;
    }
  }
}
