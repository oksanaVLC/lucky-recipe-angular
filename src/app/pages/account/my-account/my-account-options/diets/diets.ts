import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-diets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diets.html',
  styleUrls: ['./diets.scss'],
})
export class DietsComponent implements AfterViewInit {
  showText = false;

  ngAfterViewInit() {
    // Mostrar el texto con Animate.css
    this.showText = true;

    // Subir el scroll hasta el título
    this.scrollToTopOfTitle();
  }

  private scrollToTopOfTitle() {
    const title = document.querySelector<HTMLHeadingElement>('h1.title');
    title?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
