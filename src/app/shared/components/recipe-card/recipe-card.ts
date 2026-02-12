import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

register(); // registra <swiper-container> y <swiper-slide>

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-card.html',
  styleUrls: ['./recipe-card.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecipeCardComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) recipe!: Recipe;

  @Input() showLikeButton: boolean = true;
  @Input() showShareButton: boolean = true;
  @Input() showLongDescription: boolean = false;
  @Input() showIngredients: boolean = false;
  @Input() titleSize: 'small' | 'large' = 'small';
  @Input() truncateShortDescription: boolean = true;
  @Input() shortDescriptionLength: number = 20;
  @Input() showRemoveFavorite: boolean = false;
  @Input() showActions = true;

  likesCount = 0;
  copied = false;

  @ViewChild('swiperRef', { static: false }) swiperRef!: ElementRef;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.likesCount = (this.recipe?.likesCount ?? 0) + (this.isFavorite ? 1 : 0);
  }

  ngAfterViewInit() {
    const swiperEl = this.swiperRef?.nativeElement;
    if (!swiperEl) return;

    swiperEl.swiper?.update();
    window.addEventListener('resize', () => swiperEl.swiper?.update());
    window.addEventListener('orientationchange', () => swiperEl.swiper?.update());
  }

  get images(): string[] {
    if (!this.recipe?.images?.length) return [];
    return this.recipe.images.map((img) => (img.startsWith('assets/') ? img : `assets/${img}`));
  }

  toggleLike(event: Event) {
    event.stopPropagation();
    if (!this.recipe?.id) return;
    this.recipeService.toggleFavorite(this.recipe.id);
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

  copyLink() {
    if (!this.recipe?.id) return;
    const url = `${window.location.origin}/recipe/${this.recipe.id}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 1500);
    });
  }

  get shortText(): string {
    if (!this.recipe?.shortDescription) return '';
    return this.truncateShortDescription
      ? this.recipe.shortDescription.slice(0, this.shortDescriptionLength)
      : this.recipe.shortDescription;
  }

  get showEllipsis(): boolean {
    return (
      this.truncateShortDescription &&
      !!this.recipe?.shortDescription &&
      this.recipe.shortDescription.length > this.shortDescriptionLength
    );
  }
}
