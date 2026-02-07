import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { BackButtonSmallComponent } from '../../../../../shared/components/back-button-small/back-button-small';
import { Recipe } from '../../../../../shared/models/recipe.model';
import { RecipeService } from '../../../../../shared/services/recipe.service';

import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { FavoriteRecipesGridComponent } from './favorite-recipes-grid/favorite-recipes-grid';
import { FavoriteRecipesListComponent } from './favorite-recipes-list/favorite-recipes-list';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BackButtonSmallComponent,
    FavoriteRecipesGridComponent,
    FavoriteRecipesListComponent,
  ],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss'],
  animations: [
    trigger('gridAnimation', [
      transition(':enter', [
        query('.recipe-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class FavoritesComponent implements OnInit {
  favoriteRecipes: Recipe[] = [];

  viewMode: 'grid' | 'list' = 'grid';

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
