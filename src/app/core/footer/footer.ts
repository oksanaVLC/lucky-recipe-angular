import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxParticlesModule } from '@tsparticles/angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxParticlesModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  // partículas tipo estrellas infinitas, limitadas al footer
  particlesOptions: any = {
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    particles: {
      number: { value: 60, density: { enable: true, area: 800 } },
      color: { value: '#ffffff' },
      shape: { type: 'star' },
      opacity: { value: 0.8 },
      size: { value: { min: 1, max: 3 } },
      move: {
        enable: true,
        speed: 1.5,
        direction: 'none', //movimiento libre
        random: true,
        outModes: {
          default: 'bounce', // rebota en los bordes
        },
      },
    },
  };
}
