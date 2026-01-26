// app.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, FooterComponent],
  templateUrl: './app.html',
})
export class AppComponent {
  // Este método se llamará cuando la barra de búsqueda o el micrófono emitan un término
  onSearch(term: string) {
    console.log('Buscar:', term);
    // Aquí luego puedes añadir lógica de búsqueda, navegación, filtrado, etc.
  }
}
