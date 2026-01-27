// src/app/shared/services/recipe.service.ts
import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipes: Recipe[] = [];

  getAll() {
    return this.recipes;
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    console.log('Receta guardada:', recipe);
  }
}
