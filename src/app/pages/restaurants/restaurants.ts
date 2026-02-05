import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackButtonSmallComponent } from '../../shared/components/back-button-small/back-button-small';
import { RestaurantCardComponent } from './restaurant-card/restaurant-card';
interface Restaurant {
  name: string;
  city: string;
  image: string;
  phone: string;
  email: string;
  web: string;
  catering: string;
}

@Component({
  standalone: true,
  selector: 'app-restaurants',
  imports: [CommonModule, FormsModule, RestaurantCardComponent, BackButtonSmallComponent],
  templateUrl: './restaurants.html',
  styleUrls: ['./restaurants.scss'],
})
export class RestaurantsComponent {
  cities = ['Madrid', 'Barcelona', 'Valencia'];
  selectedCity = '';

  restaurants: Restaurant[] = [
    {
      name: 'Las Lunas Soul Kitchen',
      city: 'Valencia',
      image: 'assets/images/laslunas.png',
      phone: '+34 695 192 336',
      email: 'eric1313vlc@gmail.com',
      web: 'https://www.laslunassoulkitchen.com/es/',
      catering: 'Sí',
    },
  ];

  // Paginación simple
  currentPage = 1;
  itemsPerPage = 1; // solo 1 card por página para la demo
  get totalPages() {
    return Math.ceil(this.filteredRestaurants.length / this.itemsPerPage);
  }

  get filteredRestaurants() {
    if (!this.selectedCity) return this.restaurants;
    return this.restaurants.filter((r) => r.city === this.selectedCity);
  }

  changePage(n: number) {
    if (n < 1 || n > this.totalPages) return;
    this.currentPage = n;
  }

  get paginatedRestaurants() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredRestaurants.slice(start, start + this.itemsPerPage);
  }
}
