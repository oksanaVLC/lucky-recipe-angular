import { CommonModule, Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DraftService } from '../../../core/services/draft.service';
import { BackButtonSmallComponent } from '../../../shared/components/back-button-small/back-button-small';
import { Recipe } from '../../../shared/models/recipe.model'; // ✅ Import necesario
import { RecipeService } from '../../../shared/services/recipe.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonSmallComponent],
  templateUrl: './account.html',
  styleUrls: ['./account.scss'],
})
export class AccountComponent {
  // Señales
  recipeCount = signal(0);
  favoriteRecipes: Recipe[] = [];

  constructor(
    public draftService: DraftService,
    public recipeService: RecipeService,
    private location: Location,
  ) {
    // Recetas creadas
    this.recipeService.getAll().subscribe((recipes) => {
      this.recipeCount.set(recipes.length);
    });

    // Recetas favoritas
    this.recipeService.getFavorites().subscribe((favIds: number[]) => {
      this.favoriteRecipes = this.recipeService.getAllValue().filter((r) => favIds.includes(r.id));
    });
  }

  goBack() {
    this.location.back();
  }
}
