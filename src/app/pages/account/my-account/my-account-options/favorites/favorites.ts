import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BackButtonSmallComponent } from '../../../../../shared/components/back-button-small/back-button-small';
import { Recipe } from '../../../../../shared/models/recipe.model';
import { RecipeService } from '../../../../../shared/services/recipe.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonSmallComponent],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss'],
})
export class FavoritesComponent implements OnInit {
  favoriteRecipes: Recipe[] = [];

  showConfirm = false;
  confirmMessage = '';
  recipeToRemove?: Recipe;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.recipeService.getFavorites().subscribe((favIds: number[]) => {
      this.favoriteRecipes = this.recipeService.getAllValue().filter((r) => favIds.includes(r.id));
    });
  }

  viewRecipe(id: number) {
    // Ruta absoluta para salir del módulo 'mi-cuenta'
    this.router.navigateByUrl(`/recipe/${id}`);
  }

  confirmRemove(recipe: Recipe) {
    this.recipeToRemove = recipe;
    this.confirmMessage = `¿Quieres quitar "${recipe.title}" de tus favoritos?`;
    this.showConfirm = true;
  }

  removeConfirmed() {
    if (!this.recipeToRemove) return;

    this.recipeService.toggleFavorite(this.recipeToRemove.id);
    this.favoriteRecipes = this.favoriteRecipes.filter((r) => r.id !== this.recipeToRemove!.id);

    this.closeModal();
  }

  cancelRemove() {
    this.closeModal();
  }

  private closeModal() {
    this.showConfirm = false;
    this.recipeToRemove = undefined;
    this.confirmMessage = '';
  }
  goBack() {
    this.location.back();
  }
}
