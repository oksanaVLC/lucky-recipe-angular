import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.html',
  styleUrls: ['./events.scss'],
})
export class EventsComponent implements OnInit {
  images = ['assets/images/greece.webp', 'assets/images/turkey.webp', 'assets/images/spain.webp'];
  currentIndex = 0;

  rows = 20;
  cols = 20;
  tiles: {
    current: string;
    next: string;
    bgPos: string;
    transform: string;
    delay: number;
  }[] = [];

  title = 'Tu evento podría estar aquí...'.split('');

  autoplayDelay = 4000; // 4 segundos
  autoplayTimer: any;

  ngOnInit() {
    this.createTiles();
    this.startAutoplay();
  }

  createTiles() {
    this.tiles = [];
    const tileWidth = 100 / this.cols;
    const tileHeight = 100 / this.rows;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        // Calculamos la posición del fondo para que la foto se vea completa
        const bgPosX = (c * 100) / (this.cols - 1);
        const bgPosY = (r * 100) / (this.rows - 1);

        this.tiles.push({
          current: this.images[this.currentIndex],
          next: '',
          bgPos: `${bgPosX}% ${bgPosY}%`,
          transform: 'rotateY(0deg)',
          delay: Math.random() * 0.5,
        });
      }
    }
  }

  nextImage() {
    const nextIndex = (this.currentIndex + 1) % this.images.length;

    this.tiles.forEach((tile) => (tile.next = this.images[nextIndex]));

    this.tiles.forEach((tile) => {
      setTimeout(() => {
        tile.transform = 'rotateY(180deg)';
        setTimeout(() => {
          tile.current = tile.next;
          tile.transform = 'rotateY(0deg)';
        }, 300);
      }, tile.delay * 500);
    });

    this.currentIndex = nextIndex;
  }

  startAutoplay() {
    this.autoplayTimer = setInterval(() => this.nextImage(), this.autoplayDelay);
  }

  ngOnDestroy() {
    clearInterval(this.autoplayTimer);
  }
}
