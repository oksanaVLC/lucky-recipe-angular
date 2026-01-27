import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: true,
  templateUrl: './back-button.html',
  styleUrls: ['./back-button.scss'],
})
export class BackButtonComponent {
  @Input() fallbackRoute = '/';

  constructor(private router: Router) {}

  goBack() {
    this.router.navigateByUrl(this.fallbackRoute);
  }
}
