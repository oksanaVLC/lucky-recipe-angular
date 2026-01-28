import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipes: Recipe[] = [];
  private recipes$ = new BehaviorSubject<Recipe[]>([]);

  constructor() {
    const stored = localStorage.getItem('recipes');
    if (stored) {
      this.recipes = JSON.parse(stored);
      this.recipes$.next(this.recipes);
    }
  }

  // Método para suscribirse (reactivo)
  getAll() {
    return this.recipes$.asObservable();
  }

  // Método para obtener valor actual (sin suscripción)
  getAllValue() {
    return this.recipes$.getValue();
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(this.recipes));
    this.recipes$.next(this.recipes); // avisar a todos los suscriptores
  }

  deleteRecipe(id: number) {
    this.recipes = this.recipes.filter((r) => r.id !== id);
    localStorage.setItem('recipes', JSON.stringify(this.recipes));
    this.recipes$.next(this.recipes);
  }

  getRecipeById(id: number) {
    return this.recipes.find((r) => r.id === id);
  }
}
