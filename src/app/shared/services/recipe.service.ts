import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipes: Recipe[] = [];
  private recipes$ = new BehaviorSubject<Recipe[]>([]);

  // ===== NUEVO: Array de favoritos y BehaviorSubject =====
  private favorites: number[] = []; // IDs de recetas favoritas
  private favorites$ = new BehaviorSubject<number[]>([]);

  constructor() {
    // Cargar recetas del localStorage
    const stored = localStorage.getItem('recipes');
    if (stored) {
      try {
        const parsed: Recipe[] = JSON.parse(stored);
        // Filtrar solo recetas válidas
        this.recipes = parsed.filter((r) => r && r.id && r.title);
        this.recipes$.next(this.recipes);
      } catch {
        // Si hay error al parsear, limpiamos localStorage y usamos array vacío
        this.recipes = [];
        localStorage.removeItem('recipes');
      }
    }

    // ===== NUEVO: cargar favoritos del localStorage =====
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

  addRecipe(recipe: Recipe) {
    recipe.id = this.recipes.length ? Math.max(...this.recipes.map((r) => r.id)) + 1 : 1;
    this.recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(this.recipes));
    this.recipes$.next(this.recipes);
  }

  deleteRecipe(id: number) {
    this.recipes = this.recipes.filter((r) => r.id !== id);
    localStorage.setItem('recipes', JSON.stringify(this.recipes));
    this.recipes$.next(this.recipes);

    // ===== NUEVO: eliminar también de favoritos si estaba =====
    if (this.favorites.includes(id)) {
      this.favorites = this.favorites.filter((f) => f !== id);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
      this.favorites$.next(this.favorites);
    }
  }

  getRecipeById(id: number) {
    return this.recipes.find((r) => r.id === id);
  }

  // ===== FAVORITOS =====

  // Obtener array reactivo de favoritos
  getFavorites() {
    return this.favorites$.asObservable(); // NUEVO
  }

  // Saber si una receta es favorita
  isFavorite(id: number) {
    return this.favorites.includes(id); // NUEVO
  }

  // Alternar favorito / no favorito
  toggleFavorite(id: number) {
    if (this.favorites.includes(id)) {
      this.favorites = this.favorites.filter((f) => f !== id); // quitar favorito
    } else {
      this.favorites.push(id); // añadir favorito
    }
    localStorage.setItem('favorites', JSON.stringify(this.favorites)); // guardar en localStorage
    this.favorites$.next(this.favorites); // avisar suscriptores
  }
  updateRecipe(updated: Recipe) {
    const index = this.recipes.findIndex((r) => r.id === updated.id);
    if (index > -1) {
      this.recipes[index] = updated;
      localStorage.setItem('recipes', JSON.stringify(this.recipes));
      this.recipes$.next(this.recipes);
    }
  }
}
