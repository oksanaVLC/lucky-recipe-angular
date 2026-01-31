import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class RecipeCardComponent implements OnInit {
  @Input({ required: true }) recipe!: Recipe;
  @Input() showLikeButton: boolean = true;
  @Input() showShareButton: boolean = true;
  @Input() showRemoveFavorite: boolean = false;

  @Output() open = new EventEmitter<number>();

  currentImageIndex = 0;
  likesCount = 0;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.likesCount = this.isFavorite ? 1 : 0;
  }

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

  // ===== FAVORITOS + LIKES =====
  toggleLike(event: Event) {
    event.stopPropagation();

    if (!this.recipe?.id) return;

    this.recipeService.toggleFavorite(this.recipe.id);

    // sincroniza el contador con el estado FINAL
    this.likesCount = this.isFavorite ? 1 : 0;
  }

  get isFavorite(): boolean {
    return this.recipe?.id ? this.recipeService.isFavorite(this.recipe.id) : false;
  }

  // ===== ABRIR DETALLE =====
  openRecipe() {
    this.open.emit(this.recipe.id);
  }

  // ===== DESCRIPCIÓN BREVE =====
  get shortText(): string {
    return this.recipe?.shortDescription?.slice(0, 100) || '';
  }

  get showEllipsis(): boolean {
    return !!this.recipe?.shortDescription && this.recipe.shortDescription.length > 100;
  }
  copied = false;

  copyLink() {
    const url = `${window.location.origin}/recipe/${this.recipe.id}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 1500); // desaparece después de 1.5s
    });
  }
}
