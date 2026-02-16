import { CommonModule, Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { filter, take } from 'rxjs';

import { register } from 'swiper/element/bundle';
import { BackButtonSmallComponent } from '../../../shared/components/back-button-small/back-button-small';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button';
import { Recipe } from '../../../shared/models/recipe.model';
import { RecipeService } from '../../../shared/services/recipe.service';

register(); // Registra <swiper-container> y <swiper-slide>

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonSmallComponent, BackButtonComponent],
  templateUrl: './recipe-detail.html',
  styleUrls: ['./recipe-detail.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecipeDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperRef', { static: false }) swiperRef!: ElementRef;

  recipe?: Recipe;

  likesCount = 0;

  copied = false;
  showRemoveFavorite = false;
  showLikeButton = true;
  showShareButton = true;
  titleSize: 'small' | 'large' = 'large';

  stars = Array(5); // Para el *ngFor de estrellas

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private location: Location,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.recipeService
      .getAll()
      .pipe(
        filter((recipes: Recipe[]) => recipes.length > 0),
        take(1),
      )
      .subscribe((recipes: Recipe[]) => {
        const found = recipes.find((r: Recipe) => r.id === id);

        if (found) {
          found.images = found.images?.length ? found.images : ['assets/images/logo.webp'];
          found.author = found.author || {
            id: 1,
            name: 'Oksana',
            avatar: 'assets/images/profile.jpg',
          };

          this.recipe = found;

          this.likesCount = (this.recipe?.likesCount ?? 0) + (this.isFavorite ? 1 : 0);
        } else {
          this.location.back();
        }
      });
  }

  ngAfterViewInit() {
    const swiperEl = this.swiperRef?.nativeElement;
    if (!swiperEl) return;

    // Fuerza actualización del slider
    swiperEl.swiper?.update();

    // Recalcula al cambiar tamaño o orientación
    window.addEventListener('resize', () => swiperEl.swiper?.update());
    window.addEventListener('orientationchange', () => swiperEl.swiper?.update());
  }

  // --------------------- GETTERS ---------------------

  get isFavorite(): boolean {
    return this.recipe?.id ? this.recipeService.isFavorite(this.recipe.id) : false;
  }

  get images(): string[] {
    if (!this.recipe?.images?.length) return [];
    return this.recipe.images.map((img) => (img.startsWith('assets/') ? img : `assets/${img}`));
  }

  get longSteps(): string[] {
    if (!this.recipe?.longDescription) return [];
    return this.recipe.longDescription
      .split('\n')
      .map((step) => step.trim().replace(/^\d+\.\s*/, '')) // Quita "1. "
      .filter((step) => step.length > 0);
  }

  // --------------------- MÉTODOS ---------------------

  toggleLike(event: Event) {
    event.stopPropagation();
    if (!this.recipe?.id) return;

    this.recipeService.toggleFavorite(this.recipe.id);

    // Actualiza contador dinámicamente
    this.likesCount = (this.recipe?.likesCount ?? 0) + (this.isFavorite ? 1 : 0);
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

  goBack() {
    this.location.back();
  }
  getStars(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('full');
      } else if (rating >= i - 0.5) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }

    return stars;
  }
}
