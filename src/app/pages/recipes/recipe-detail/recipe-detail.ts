import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button';
import { Recipe } from '../../../shared/models/recipe.model';
import { RecipeService } from '../../../shared/services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  templateUrl: './recipe-detail.html',
  styleUrls: ['./recipe-detail.scss'],
})
export class RecipeDetailComponent {
  recipe?: Recipe;
  isFavorite = false;
  stars = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private location: Location,
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recipe = this.recipeService.getRecipeById(id);

    // Placeholder si no hay receta o imagen
    if (this.recipe) {
      this.recipe.image = this.recipe.image || 'assets/images/logo.webp';
      this.recipe.author = this.recipe.author || {
        id: 1,
        name: 'Oksana',
        avatar: 'assets/images/profile.jpg',
      };
      this.isFavorite = this.recipeService.isFavorite(this.recipe.id);
    }
  }

  toggleFavorite() {
    if (!this.recipe) return;

    // delegar en el servicio
    this.recipeService.toggleFavorite(this.recipe.id);

    // actualizar estado local para la UI
    this.isFavorite = this.recipeService.isFavorite(this.recipe.id);

    // likes solo visuales (opcional)
    this.recipe.likes = (this.recipe.likes ?? 0) + (this.isFavorite ? 1 : -1);
  }

  shareRecipe() {
    if (!this.recipe) return;
    const url = window.location.href;
    navigator.clipboard.writeText(`${this.recipe.title} - Mira esta receta saludable: ${url}`);
    alert('¡Enlace copiado para compartir!');
  }
  goBack() {
    this.location.back();
  }
}
