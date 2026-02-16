import { CommonModule } from '@angular/common'; // <-- IMPORTANTE
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule], // <-- aquí lo agregamos
  templateUrl: './events.html',
  styleUrls: ['./events.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventsComponent implements AfterViewInit {
  @ViewChild('swiperRef', { static: false }) swiperRef!: ElementRef;

  images = ['assets/images/event.webp', 'assets/images/event1.webp', 'assets/images/turkey.webp'];

  ngAfterViewInit(): void {
    if (this.swiperRef) {
      const swiperEl = this.swiperRef.nativeElement as any;
      setTimeout(() => swiperEl.update(), 50);
    }
  }
}
