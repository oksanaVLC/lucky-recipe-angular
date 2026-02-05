import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import db from '../../../assets/db.json';
import { Recipe } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipes: Recipe[] = [];
  private recipes$ = new BehaviorSubject<Recipe[]>([]);

  private favorites: number[] = [];
  private favorites$ = new BehaviorSubject<number[]>([]);

  constructor() {
    // 1️⃣ Cargar recetas iniciales de db.json
    this.recipes = db.recipes || [];
    this.recipes$.next(this.recipes);

    // 2️⃣ Sobrescribir con recetas de localStorage si existen
    const stored = localStorage.getItem('recipes');
    if (stored) {
      try {
        const parsed: Recipe[] = JSON.parse(stored);
        this.recipes = parsed.filter((r) => r && r.id && r.title);
        this.recipes$.next(this.recipes);
      } catch {
        localStorage.removeItem('recipes');
      }
    }

    // 3️⃣ Cargar favoritos de localStorage
    const storedFavs = localStorage.getItem('favorites');
    if (storedFavs) {
      this.favorites = JSON.parse(storedFavs);
      this.favorites$.next(this.favorites);
    }
  }

  // ===== RECETAS =====
  getAll() {
    return this.recipes$.asObservable();
  }

  getAllValue() {
    return this.recipes$.getValue();
  }

  getRecipeById(id: number) {
    return this.recipes.find((r) => r.id === id);
  }

  addRecipe(recipe: Recipe) {
    recipe.id = this.recipes.length ? Math.max(...this.recipes.map((r) => r.id)) + 1 : 1;
    this.recipes.push(recipe);
    this.saveRecipes();
  }

  updateRecipe(updated: Recipe) {
    const index = this.recipes.findIndex((r) => r.id === updated.id);
    if (index > -1) {
      this.recipes[index] = updated;
      this.saveRecipes();
    }
  }

  deleteRecipe(id: number) {
    this.recipes = this.recipes.filter((r) => r.id !== id);
    this.saveRecipes();

    // También eliminar de favoritos
    this.removeFavorite(id);
  }

  private saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(this.recipes));
    this.recipes$.next(this.recipes);
  }

  // ===== FAVORITOS =====
  getFavorites() {
    return this.favorites$.asObservable();
  }

  isFavorite(id: number) {
    return this.favorites.includes(id);
  }

  toggleFavorite(id: number) {
    if (this.favorites.includes(id)) {
      this.favorites = this.favorites.filter((f) => f !== id);
    } else {
      this.favorites.push(id);
    }
    this.saveFavorites();
  }

  removeFavorite(id: number) {
    if (!this.favorites.includes(id)) return;
    this.favorites = this.favorites.filter((f) => f !== id);
    this.saveFavorites();
  }

  private saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    this.favorites$.next(this.favorites);
  }
}
