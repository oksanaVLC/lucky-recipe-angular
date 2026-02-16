import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-events',
  standalone: true,

  imports: [],
  templateUrl: './events.html',
  styleUrls: ['./events.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventsComponent {
  text = 'Tu evento podría estar aquí...';
}
