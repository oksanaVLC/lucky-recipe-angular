import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeCardComponent } from '../components/recipe-card/recipe-card';
import { SearchBarComponent } from '../components/search-bar/search-bar';
import { Recipe } from '../models/recipe.model';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, RecipeCardComponent, FormsModule, SearchBarComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent {
  recipes: Recipe[] = [
    {
      id: 1,
      title: 'Cheesecake',
      image: 'assets/images/cheesecake.webp',
      ingredients: ['cheese', 'eggs', 'sugar'],
      category: 'Destacados',
      description: 'La paella es un plato tradicional valenciano con arroz y sabor intenso.',
    },
    {
      id: 2,
      title: 'Vegan Salad',
      image: 'assets/images/mediterranean-salad.webp',
      ingredients: ['lettuce', 'tomato', 'avocado'],
      category: 'Veganos',
      description: 'La paella es un plato tradicional valenciano con arroz y sabor intenso.',
    },
    {
      id: 3,
      title: 'Chocolate Cake',
      image: 'assets/images/tiramisu.webp',
      ingredients: ['chocolate', 'flour', 'eggs'],
      category: 'Más Populares',
      description: 'La paella es un plato tradicional valenciano con arroz y sabor intenso.',
    },
    // ... resto de recetas
  ];

  searchTerm: string = '';
  private subscription: Subscription;

  constructor(private searchService: SearchService) {
    // Suscribirse a cambios de búsqueda
    this.subscription = this.searchService.searchTerm$.subscribe((term) => {
      this.searchTerm = term;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get filteredRecipes() {
    const term = this.searchTerm.toLowerCase();
    return !term
      ? this.recipes
      : this.recipes.filter(
          (r) =>
            r.title.toLowerCase().includes(term) ||
            r.ingredients.some((i) => i.toLowerCase().includes(term)),
        );
  }

  chooseRandomRecipe() {
    const randomIndex = Math.floor(Math.random() * this.recipes.length);
    alert(`Tu receta aleatoria: ${this.recipes[randomIndex].title}`);
  }
}
