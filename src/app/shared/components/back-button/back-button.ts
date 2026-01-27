import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: true,
  templateUrl: './back-button.html',
  styleUrls: ['./back-button.scss'],
})
export class BackButtonComponent {
  @Input() fallbackRoute?: string; // ruta a la que ir si no hay historial

  constructor(
    private location: Location,
    private router: Router,
  ) {}

  goBack() {
    if (window.history.length > 1) {
      this.location.back(); // vuelve a la página anterior
    } else if (this.fallbackRoute) {
      this.router.navigate([this.fallbackRoute]); // si no, va al fallback
    } else {
      this.router.navigate(['/']); // fallback por defecto
    }
  }
}
