import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

import { register } from 'swiper/element/bundle';
register(); // registra los elementos <swiper-container> y <swiper-slide>

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-card.html',
  styleUrls: ['./recipe-card.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //para Swiper
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

  /** NUEVO: título extra solo para detail view */
  @Input() detailTitle?: string;

  @Output() open = new EventEmitter<number>();
  @Input() showRemoveFavorite: boolean = false;

  // Estado interno

  likesCount = 0; // futuro back-end
  copied = false;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    // Inicializamos likes visualmente: recipe?.likesCount por si acaso
    this.likesCount = (this.recipe?.likesCount ?? 0) + (this.isFavorite ? 1 : 0);
  }

  // ================== SLIDER ==================
  get images(): string[] {
    if (!this.recipe?.images?.length) return [];

    return this.recipe.images.map((img) => (img.startsWith('assets/') ? img : `assets/${img}`));
  }

  get authorAvatar(): string {
    const avatar = this.recipe?.author?.avatar;
    if (!avatar) return 'assets/images/logo.webp';

    return avatar.startsWith('assets/') ? avatar : `assets/${avatar}`;
  }

  // ================== FAVORITOS ==================
  toggleLike(event: Event) {
    event.stopPropagation();
    if (!this.recipe?.id) return;

    this.recipeService.toggleFavorite(this.recipe.id);

    // Sumar/restar 1 al valor original de la receta
    this.likesCount = (this.recipe?.likesCount ?? 0) + (this.isFavorite ? 1 : 0);
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
