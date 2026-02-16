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

import { FormsModule } from '@angular/forms';
import { register } from 'swiper/element/bundle';
import { BackButtonSmallComponent } from '../../../shared/components/back-button-small/back-button-small';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button';
import { Recipe } from '../../../shared/models/recipe.model';
import { RecipeService } from '../../../shared/services/recipe.service';

register(); // Registra <swiper-container> y <swiper-slide>

// Definimos un tipo simple de comentario
interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonSmallComponent, FormsModule, BackButtonComponent],
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

  // -------------------- COMENTARIOS --------------------
  showComments: boolean = false; // controla el panel desplegable
  commentsPerPage: number = 5;
  currentCommentsPage: number = 1;
  totalCommentsPages: number = 1;
  paginatedComments: Comment[] = [];
  comments: Comment[] = [];
  newComment: string = '';

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

          // Inicializamos comentarios de demo
          this.comments = [...(this.recipe.comments || [])];
          this.updatePaginatedComments();
        } else {
          this.location.back();
        }
      });
  }

  ngAfterViewInit() {
    const swiperEl = this.swiperRef?.nativeElement;
    if (!swiperEl) return;

    swiperEl.swiper?.update();
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
      .map((step) => step.trim().replace(/^\d+\.\s*/, ''))
      .filter((step) => step.length > 0);
  }

  // --------------------- MÉTODOS ---------------------

  toggleLike(event: Event) {
    event.stopPropagation();
    if (!this.recipe?.id) return;

    this.recipeService.toggleFavorite(this.recipe.id);
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
      if (rating >= i) stars.push('full');
      else if (rating >= i - 0.5) stars.push('half');
      else stars.push('empty');
    }
    return stars;
  }

  // -------------------- COMENTARIOS --------------------

  toggleComments() {
    this.showComments = !this.showComments;
  }

  addComment() {
    if (!this.newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      author: 'Usuario',
      content: this.newComment,
      createdAt: new Date().toISOString(),
    };

    this.comments.push(comment);
    this.newComment = '';
    this.updatePaginatedComments();
  }

  updatePaginatedComments() {
    const start = (this.currentCommentsPage - 1) * this.commentsPerPage;
    this.paginatedComments = this.comments.slice(start, start + this.commentsPerPage);
    this.totalCommentsPages = Math.ceil(this.comments.length / this.commentsPerPage);
  }

  goToCommentsPage(page: number) {
    if (page < 1 || page > this.totalCommentsPages) return;
    this.currentCommentsPage = page;
    this.updatePaginatedComments();
  }
}
