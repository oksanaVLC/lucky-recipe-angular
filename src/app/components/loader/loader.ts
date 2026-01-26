// src/app/components/loader/loader.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-container">
      <svg
        fill="hsl(228, 97%, 42%)"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        class="spinner"
      >
        <g>
          <circle cx="12" cy="3" r="1">
            <animate
              id="spinner_7Z73"
              begin="0;spinner_tKsu.end-0.5s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <!-- El resto de los círculos del SVG -->
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="6s"
            values="360 12 12;0 12 12"
            repeatCount="indefinite"
          />
        </g>
      </svg>
    </div>
  `,
  styles: [
    `
      .loader-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 150px; /* ajusta según tu layout */
      }
      .spinner {
        width: 60px;
        height: 60px;
      }
    `,
  ],
})
export class LoaderComponent {}
