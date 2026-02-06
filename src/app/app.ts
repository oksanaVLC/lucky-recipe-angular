// app.ts
import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/footer/footer';
import { Navbar } from './core/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, FooterComponent],
  templateUrl: './app.html',
})
export class AppComponent {
  onSearch(term: string) {
    console.log('Buscar:', term);
  }
}
