import { CommonModule, Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { combineLatest } from 'rxjs';

import { DraftService } from '../../../core/services/draft.service';
import { BackButtonSmallComponent } from '../../../shared/components/back-button-small/back-button-small';
import { Recipe } from '../../../shared/models/recipe.model';
import { RecipeService } from '../../../shared/services/recipe.service';
import { ShoppingListService } from '../../../shared/services/shopping-list.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonSmallComponent],
  templateUrl: './account.html',
  styleUrls: ['./account.scss'],
})
export class AccountComponent {
  recipeCount = signal(0);
  savedListsCount = signal(0);
  favoriteRecipes: Recipe[] = [];

  constructor(
    public draftService: DraftService,
    public recipeService: RecipeService,
    private location: Location,
    public shoppingListService: ShoppingListService,
  ) {
    // Recetas creadas
    this.recipeService.getAll().subscribe((recipes) => {
      this.recipeCount.set(recipes.length);
    });

    // Favoritos (combinando recetas + ids favoritos)
    combineLatest([this.recipeService.getAll(), this.recipeService.getFavorites()]).subscribe(
      ([recipes, favIds]) => {
        this.favoriteRecipes = recipes.filter((r) => favIds.includes(r.id));
      },
    );
  }

  goBack() {
    this.location.back();
  }
  updateSavedListsCount() {
    const saved = localStorage.getItem('savedLists');
    this.savedListsCount.set(saved ? JSON.parse(saved).length : 0);
  }
}
