import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-restaurant-card',
  imports: [CommonModule],
  templateUrl: './restaurant-card.html',
  styleUrls: ['./restaurant-card.scss'],
})
export class RestaurantCardComponent {
  @Input() name!: string;
  @Input() city!: string;
  @Input() image!: string;
  @Input() phone!: string;
  @Input() email!: string;
  @Input() catering: boolean = false;
}
