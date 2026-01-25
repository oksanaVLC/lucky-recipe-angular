// recipe-detail.component.ts
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
  recipe: Recipe | undefined;

  constructor(private route: ActivatedRoute) {
    // Obtener id de la URL
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Aquí usamos un array de ejemplo, pero luego puede venir de un servicio
    const recipes: Recipe[] = [
      {
        id: 1,
        title: 'Cheesecake',
        image: 'assets/images/cheesecake.webp',
        ingredients: ['cheese', 'eggs', 'sugar'],
        category: 'Destacados',
        description: 'Delicioso cheesecake.',
      },
      {
        id: 2,
        title: 'Vegan Salad',
        image: 'assets/images/mediterranean-salad.webp',
        ingredients: ['lettuce', 'tomato', 'avocado'],
        category: 'Veganos',
        description: 'Fresca ensalada vegana.',
      },
      {
        id: 3,
        title: 'Chocolate Cake',
        image: 'assets/images/tiramisu.webp',
        ingredients: ['chocolate', 'flour', 'eggs'],
        category: 'Más Populares',
        description: 'Pastel de chocolate irresistible.',
      },
    ];

    this.recipe = recipes.find((r) => r.id === id);
  }
}
