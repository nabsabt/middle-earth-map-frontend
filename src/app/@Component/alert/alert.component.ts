import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  template: ` <div class="alert" role="status" aria-live="polite">
    <div class="msg">{{ message }}</div>

    <!-- <button class="btn" type="button" (click)="close.emit()">OK</button> -->
  </div>`,
  styles: `

    .alert{
      border: 1px solid #fff;
      pointer-events:auto;
      display:flex;
      align-items:center;
      gap:12px;
      padding:12px 14px;
      border-radius:12px;
      background:#111;
      color:#fff;
      box-shadow: 0 10px 30px rgba(0,0,0,.35);
      max-width:min(520px, calc(100vw - 24px));
      animation: pulse 0.5s infinite;
    }
    .msg{ flex:1; }
    .btn{
      border:0;
      border-radius:10px;
      padding:8px 10px;
      cursor:pointer;
    }

    @keyframes pulse {
      0% {
          transform: scale(1);
          }
      50% {
          transform: scale(1.02);
        }
      100% {
          transform: scale(1);
        }
      }
  `,
  standalone: true,
})
export class AlertComponent {
  @Input() message = '';
  @Output() close = new EventEmitter<void>();
}
