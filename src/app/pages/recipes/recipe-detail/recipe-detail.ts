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

import { BackButtonSmallComponent } from '../../../shared/components/back-button-small/back-button-small';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button';
import { Recipe } from '../../../shared/models/recipe.model';
import { RecipeService } from '../../../shared/services/recipe.service';

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

  stars = Array(5); // genera 5 elementos para el *ngFor

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private location: Location,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.recipeService.getRecipeById(id);

    if (found) {
      found.images = found.images?.length ? found.images : ['assets/images/logo.webp'];
      found.author = found.author || {
        id: 1,
        name: 'Oksana',
        avatar: 'assets/images/profile.jpg',
      };
      found.likesCount = found.likesCount ?? (this.recipeService.isFavorite(found.id) ? 1 : 0);

      this.recipe = found;
      this.likesCount = found.likesCount;
    } else {
      this.location.back();
    }
  }

  ngAfterViewInit() {
    const swiperEl = this.swiperRef?.nativeElement;

    if (!swiperEl) return;

    // Fuerza recalculo al renderizar
    swiperEl.swiper?.update();

    // Recalculo cuando cambie tamaño o orientación
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

  removeFavorite() {
    if (!this.recipe?.id) return;
    this.recipeService.removeFavorite(this.recipe.id);
    this.likesCount = 0;
  }
  get longSteps(): string[] {
    if (!this.recipe?.longDescription) return [];

    return this.recipe.longDescription
      .split('\n')
      .map((step) => step.trim().replace(/^\d+\.\s*/, '')) // quita "1. "
      .filter((step) => step.length > 0);
  }
}
