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

  // Opciones visuales
  @Input() showLikeButton: boolean = true;
  @Input() showShareButton: boolean = true;
  @Input() showLongDescription: boolean = false;
  @Input() showIngredients: boolean = false;
  @Input() titleSize: 'small' | 'large' = 'small';

  // Control truncado descripción corta
  @Input() truncateShortDescription: boolean = true;
  @Input() shortDescriptionLength: number = 20;

  @Output() open = new EventEmitter<number>();
  @Input() showRemoveFavorite: boolean = false;

  // Estado interno
  currentImageIndex = 0;
  likesCount = 0; // futuro back-end
  copied = false;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    // Inicializamos likes desde la receta (para back-end real) + favoritos locales
    this.likesCount = this.recipe.likesCount ?? (this.isFavorite ? 1 : 0);
  }

  // ================== SLIDER ==================
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

  // ================== FAVORITOS ==================
  toggleLike(event: Event) {
    event.stopPropagation();
    if (!this.recipe?.id) return;

    this.recipeService.toggleFavorite(this.recipe.id);
    this.likesCount = this.isFavorite ? 1 : 0;
  }

  get isFavorite(): boolean {
    return this.recipe?.id ? this.recipeService.isFavorite(this.recipe.id) : false;
  }

  removeFavorite() {
    if (!this.recipe?.id) return;
    this.recipeService.removeFavorite(this.recipe.id);
    this.likesCount = 0;
  }

  // ================== COMPARTIR ==================
  copyLink() {
    const url = `${window.location.origin}/recipe/${this.recipe.id}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 1500);
    });
  }

  // ================== DESCRIPCIÓN CORTA ==================
  get shortText(): string {
    if (!this.recipe?.shortDescription) return '';
    if (this.truncateShortDescription) {
      return this.recipe.shortDescription.slice(0, this.shortDescriptionLength);
    }
    return this.recipe.shortDescription;
  }

  get showEllipsis(): boolean {
    return (
      this.truncateShortDescription &&
      !!this.recipe?.shortDescription &&
      this.recipe.shortDescription.length > this.shortDescriptionLength
    );
  }
}
