import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Recipe } from '../../../../../shared/models/recipe.model';
import { RecipeService } from '../../../../../shared/services/recipe.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss'],
})
export class FavoritesComponent implements OnInit {
  favoriteRecipes: Recipe[] = [];

  // ===== Modal confirmación =====
  showConfirm = false;
  confirmMessage = '';
  recipeToRemove?: Recipe;

  constructor(
    private recipeService: RecipeService,
    private viewportScroller: ViewportScroller,
  ) {}

  ngOnInit(): void {
    this.recipeService.getFavorites().subscribe((favIds: number[]) => {
      this.favoriteRecipes = this.recipeService
        .getAllValue()
        .filter((r: Recipe) => favIds.includes(r.id));
    });
  }

  // Abrir modal
  confirmRemove(recipe: Recipe) {
    this.recipeToRemove = recipe;
    this.confirmMessage = `¿Quieres quitar "${recipe.title}" de tus favoritos?`;
    this.showConfirm = true;
  }

  // Confirmar eliminación
  removeConfirmed() {
    if (!this.recipeToRemove) return;

    this.recipeService.toggleFavorite(this.recipeToRemove.id);
    this.favoriteRecipes = this.favoriteRecipes.filter((r) => r.id !== this.recipeToRemove!.id);

    this.closeModal();
    // volver al inicio de la página
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  // Cancelar
  cancelRemove() {
    this.closeModal();
  }

  private closeModal() {
    this.showConfirm = false;
    this.recipeToRemove = undefined;
    this.confirmMessage = '';
  }
}
