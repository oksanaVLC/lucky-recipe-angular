import { CommonModule, Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DraftService } from '../../../core/services/draft.service';
import { BackButtonSmallComponent } from '../../../shared/components/back-button-small/back-button-small';
import { RecipeService } from '../../../shared/services/recipe.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonSmallComponent],
  templateUrl: './account.html',
  styleUrls: ['./account.scss'],
})
export class AccountComponent {
  recipeCount = signal(0);
  favoriteCount = signal(0); // ✅ favoritos

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
    this.recipeService.getFavorites().subscribe((favs: number[]) => {
      this.favoriteCount.set(favs.length);
    });
  }
  goBack() {
    this.location.back();
  }
}
