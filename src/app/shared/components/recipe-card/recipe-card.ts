import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-card.html',
  styleUrls: ['./recipe-card.scss'],
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;
  @Input() showLikeButton: boolean = true;
  @Input() showShareButton: boolean = true;
  @Input() showRemoveFavorite: boolean = false;

  @Output() open = new EventEmitter<number>();

  currentImageIndex = 0;

  constructor(private recipeService: RecipeService) {}

  // ===== IMÁGENES =====
  get images(): string[] {
    return this.recipe?.images || [];
  }

  get displayImage(): string {
    return this.images[this.currentImageIndex] || 'assets/images/logo.webp';
  }

  nextImage() {
    if (!this.images.length) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage() {
    if (!this.images.length) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  // ===== FAVORITOS =====
  toggleFavorite() {
    if (!this.recipe?.id) return;
    this.recipeService.toggleFavorite(this.recipe.id);
    // no hace falta asignar nada aquí: los getters leen el estado real
  }

  get isFavorite(): boolean {
    return this.recipe?.id ? this.recipeService.isFavorite(this.recipe.id) : false;
  }

  // ===== LIKES =====
  get likesCount(): number {
    return this.isFavorite ? 1 : 0;
  }

  // ===== STARS =====
  get stars(): number[] {
    return Array(5).fill(0);
  }

  // ===== ABRIR DETALLE =====
  openRecipe() {
    this.open.emit(this.recipe.id);
  }
}
