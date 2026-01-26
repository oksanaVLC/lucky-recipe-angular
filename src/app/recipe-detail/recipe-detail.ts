import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-detail.html',
  styleUrls: ['./recipe-detail.scss'],
})
export class RecipeDetailComponent {
  recipe?: Recipe;
  isFavorite = false;
  stars = [1, 2, 3, 4, 5];

  // Simulamos datos mientras no hay backend
  private recipes: Recipe[] = [
    {
      id: 1,
      title: 'Cheesecake Healthy',
      image: 'assets/images/cheesecake.webp',
      ingredients: ['queso light', 'huevos', 'stevia'],
      category: 'Postres',
      description: 'Un cheesecake delicioso y bajo en calorías.',
      rating: 5,
      likes: 120,
      author: {
        id: 1,
        name: 'Laura Healthy',
        avatar: 'assets/images/avatar1.webp',
      },
    },
    {
      id: 2,
      title: 'Vegan Salad',
      image: 'assets/images/mediterranean-salad.webp',
      ingredients: ['lechuga', 'tomate', 'aguacate'],
      category: 'Veganos',
      description: 'Ensalada fresca y llena de nutrientes.',
      rating: 4,
      likes: 85,
      author: {
        id: 2,
        name: 'Marco Vegano',
        avatar: 'assets/images/avatar2.webp',
      },
    },
  ];

  constructor(private route: ActivatedRoute) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recipe = this.recipes.find((r) => r.id === id);
  }

  toggleFavorite() {
    if (!this.recipe) return;

    this.isFavorite = !this.isFavorite;
    this.recipe.likes = (this.recipe.likes ?? 0) + (this.isFavorite ? 1 : -1);
  }

  likeRecipe() {
    if (!this.recipe) return;
    this.recipe.likes = (this.recipe.likes ?? 0) + 1;
  }

  shareRecipe() {
    if (!this.recipe) return;
    const url = window.location.href;
    navigator.clipboard.writeText(`${this.recipe.title} - Mira esta receta saludable: ${url}`);
    alert('¡Enlace copiado para compartir!');
  }
}
