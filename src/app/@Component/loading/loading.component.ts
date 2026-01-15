import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'loading',
  template: `
    @if(isInitialLoad){
    <div class="loading-spinner-initial">
      <!-- <img src="assets/images/the_one_ring_loader.gif" alt="Loading..." /> -->
      <h1>map of middle-earth</h1>
    </div>
    } @if(!isInitialLoad){
    <div class="loading-spinner">
      <img src="assets/images/the_one_ring_loader.gif" alt="Loading..." />
    </div>
    }
  `,
  styles: [
    `
      .loading-spinner-initial,
      .loading-spinner {
        position: absolute;
        top: 0;
        left: 0;
        height: 100dvh;
        width: 100%;
      }
      .loading-spinner-initial {
        background-color: rgb(38, 9, 10);
        text-align: center;
        justify-content: center;

        h1 {
          position: absolute;
          top: 50%;
          width: 100%;
          text-wrap-mode: wrap;
          color: rgba(75, 27, 29, 0.85);
          font-size: clamp(36px, 10vw, 125px);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0;
          animation: fadeIn 1s ease-out forwards, pulse 3s ease-in-out 1s infinite;
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-50%) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(-50%) scale(1);
        }
      }

      @keyframes pulse {
        0% {
          opacity: 0.85;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.85;
        }
      }

      .loading-spinner {
        backdrop-filter: blur(5px) brightness(0.5);
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: 20dvh;
        }
      }
    `,
  ],
})
export class LoadingComponent {
  @Input() isInitialLoad: boolean = true;
  constructor() {}
}
