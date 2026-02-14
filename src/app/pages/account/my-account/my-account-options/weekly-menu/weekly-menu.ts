import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-weekly-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weekly-menu.html',
  styleUrls: ['./weekly-menu.scss'],
})
export class WeeklyMenuComponent implements AfterViewInit {
  showText = false;

  ngAfterViewInit(): void {
    // Mostrar el texto con Animate.css
    this.showText = true;

    // Subir el scroll hasta el título si vienes de otra página
    this.scrollToTopOfTitle();
  }

  private scrollToTopOfTitle() {
    const title = document.querySelector<HTMLHeadingElement>('h1.title');
    title?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
