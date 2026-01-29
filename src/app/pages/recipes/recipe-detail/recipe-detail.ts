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
  stars = [1, 2, 3, 4, 5];
  likesCount = 0;
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private location: Location,
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recipe = this.recipeService.getRecipeById(id);

    if (this.recipe) {
      // Asegurar que siempre haya imágenes
      this.recipe.images =
        this.recipe.images && this.recipe.images.length
          ? this.recipe.images
          : ['assets/images/logo.webp'];

      // Autor por defecto si no hay
      this.recipe.author = this.recipe.author || {
        id: 1,
        name: 'Oksana',
        avatar: 'assets/images/profile.jpg',
      };

      // Likes iniciales
      this.likesCount = this.recipeService.isFavorite(this.recipe.id) ? 1 : 0;
    }
  }

  // ================= IMÁGENES =================
  get displayImage(): string {
    return this.recipe?.images[this.currentImageIndex] || 'assets/images/logo.webp';
  }

  nextImage() {
    if (!this.recipe?.images.length) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.recipe.images.length;
  }

  prevImage() {
    if (!this.recipe?.images.length) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.recipe.images.length) % this.recipe.images.length;
  }

  // ================= FAVORITOS =================
  toggleFavorite() {
    if (!this.recipe?.id) return;

    // Alternar favorito en el servicio
    this.recipeService.toggleFavorite(this.recipe.id);

    // Actualizar likesCount según el estado real
    this.likesCount = this.recipeService.isFavorite(this.recipe.id) ? 1 : 0;
  }

  get isFavorite(): boolean {
    return this.recipe?.id ? this.recipeService.isFavorite(this.recipe.id) : false;
  }

  // ================= COMPARTIR =================
  shareRecipe() {
    if (!this.recipe) return;
    const url = window.location.href;
    navigator.clipboard.writeText(`${this.recipe.title} - Mira esta receta saludable: ${url}`);
    alert('¡Enlace copiado para compartir!');
  }

  // ================= VOLVER =================
  goBack() {
    this.location.back(); // vuelve a la página anterior
  }
}
