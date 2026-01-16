import { Component, input } from '@angular/core';

@Component({
  selector: 'loading',
  template: `
    @if(isInitialLoad()){
    <div class="loading-spinner-initial">
      <!-- <img src="assets/images/the_one_ring_loader.gif" alt="Loading..." /> -->
      <h1>map of middle-earth</h1>
    </div>
    } @if(!isInitialLoad()){
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
        z-index: 15;
      }
      .loading-spinner-initial h1 {
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translateY(-50%);
        text-align: center;

        font-size: clamp(36px, 10vw, 125px);
        letter-spacing: 0.15em;
        text-transform: uppercase;

        /* Base text */
        color: rgba(75, 27, 29, 0.85);

        /* Shimmer setup */
        background: linear-gradient(
          110deg,
          rgba(75, 27, 29, 0.6) 40%,
          rgba(255, 210, 160, 0.95) 50%,
          rgba(75, 27, 29, 0.6) 60%
        );
        background-size: 250% 100%;
        background-position: 0% 50%;

        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;

        animation: fadeIn 1.2s ease-out forwards, shine 2.8s linear 1.2s infinite;
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

      @keyframes shine {
        from {
          background-position: 0% 50%;
        }
        to {
          background-position: 250% 50%;
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
  public isInitialLoad = input<boolean>(true);
  constructor() {}
}
