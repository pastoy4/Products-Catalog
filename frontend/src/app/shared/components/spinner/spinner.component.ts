import { Component } from '@angular/core';

@Component({
    selector: 'app-spinner',
    template: `
    <div class="spinner-overlay">
      <div class="spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
    </div>
  `,
    styles: [`
    .spinner-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 0;
    }

    .spinner {
      position: relative;
      width: 50px;
      height: 50px;
    }

    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 3px solid transparent;
      animation: spin 1.2s ease-in-out infinite;
    }

    .spinner-ring:nth-child(1) {
      border-top-color: #a78bfa;
      animation-delay: 0s;
    }

    .spinner-ring:nth-child(2) {
      border-right-color: #60a5fa;
      animation-delay: 0.15s;
      width: 80%;
      height: 80%;
      top: 10%;
      left: 10%;
    }

    .spinner-ring:nth-child(3) {
      border-bottom-color: #34d399;
      animation-delay: 0.3s;
      width: 60%;
      height: 60%;
      top: 20%;
      left: 20%;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `],
})
export class SpinnerComponent { }
