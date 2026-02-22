import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from '../../core/services/search.service';
import { LoaderComponent } from '../../shared/components/loader/loader';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar';
import { Recipe } from '../../shared/models/recipe.model';
import { NavigationService } from '../../shared/services/navigation';
import { RecipeService } from '../../shared/services/recipe.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RecipeCardComponent,
    FormsModule,
    SearchBarComponent,
    LoaderComponent,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  animations: [
    trigger('slideIn', [
      state('left', style({ opacity: 1, transform: 'translateX(0)' })),
      state('right', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => left', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('600ms ease-out'),
      ]),
      transition('void => right', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('600ms ease-out'),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sponsorSwiper', { static: false }) sponsorSwiper!: ElementRef;

  recipes: Recipe[] = [];
  searchTerm = '';
  private searchSub: Subscription | null = null;
  private recipesSub: Subscription | null = null;

  logos: string[] = Array(10).fill('assets/images/logolunas.png');

  sponsorLogos: string[] = [
    'assets/images/logos/logo1.webp',
    'assets/images/logos/logo2.webp',
    'assets/images/logos/logo3.webp',
    'assets/images/logos/logo4.webp',
    'assets/images/logos/logo5.webp',
    'assets/images/logos/logo6.webp',
  ];

  isLoading = false;

  // PAGINACIÓN DESTACADOS
  currentPageDestacados = 1;
  totalPagesDestacados = 1;

  // PAGINACIÓN FÁCILES
  currentPageFaciles = 1;
  totalPagesFaciles = 1;

  pageSize = 8;

  countries = [
    { name: 'Greece', img: 'assets/images/greece.webp' },
    { name: 'Russia', img: 'assets/images/russia.webp' },
    { name: 'Turkey', img: 'assets/images/turkey.webp' },
    { name: 'Spain', img: 'assets/images/spain.webp' },
    { name: 'France', img: 'assets/images/france.webp' },
    { name: 'Japan', img: 'assets/images/japan.webp' },
  ];

  constructor(
    private searchService: SearchService,
    private recipeService: RecipeService,
    private router: Router,
    private navService: NavigationService,
  ) {}

  ngOnInit() {
    this.searchSub = this.searchService.searchTerm$.subscribe((term) => {
      this.searchTerm = term;
      this.currentPageDestacados = 1;
      this.currentPageFaciles = 1;
      this.updatePagination();
    });

    this.recipesSub = this.recipeService.getAll().subscribe((allRecipes) => {
      this.recipes = [...allRecipes].sort((a, b) => b.id - a.id);
      this.updatePagination();
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
    this.recipesSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const swiperEl = this.sponsorSwiper.nativeElement as any;
      swiperEl.swiper?.autoplay.start();
    }, 50);

    const elements = document.querySelectorAll('.scroll-animate');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -120px 0px',
      },
    );

    elements.forEach((el) => observer.observe(el));

    setTimeout(() => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      });
    }, 50);
  }

  get filteredRecipes() {
    const term = this.searchTerm.toLowerCase();
    return !term
      ? this.recipes
      : this.recipes.filter(
          (r) =>
            r.title.toLowerCase().includes(term) ||
            r.ingredients.some((i) => i.name.toLowerCase().includes(term)),
        );
  }

  // DESTACADOS
  get paginatedDestacados() {
    const start = (this.currentPageDestacados - 1) * this.pageSize;
    return this.filteredRecipes.slice(start, start + this.pageSize);
  }

  // FÁCILES
  get paginatedFaciles() {
    const start = (this.currentPageFaciles - 1) * this.pageSize;
    return this.filteredRecipes.slice(start, start + this.pageSize);
  }

  updatePagination() {
    this.totalPagesDestacados = Math.ceil(this.filteredRecipes.length / this.pageSize);
    this.totalPagesFaciles = this.totalPagesDestacados;
  }

  // DESTACADOS PAGINACIÓN
  goToPageDestacados(page: number) {
    if (page < 1 || page > this.totalPagesDestacados) return;
    this.currentPageDestacados = page;
    this.scrollToTop('#destacados');
  }

  goToNextPageDestacados() {
    if (this.currentPageDestacados < this.totalPagesDestacados) {
      this.currentPageDestacados++;
      this.scrollToTop('#destacados');
    }
  }

  goToPreviousPageDestacados() {
    if (this.currentPageDestacados > 1) {
      this.currentPageDestacados--;
      this.scrollToTop('#destacados');
    }
  }

  // FÁCILES PAGINACIÓN
  goToPageFaciles(page: number) {
    if (page < 1 || page > this.totalPagesFaciles) return;
    this.currentPageFaciles = page;
    this.scrollToTop('#faciles');
  }

  goToNextPageFaciles() {
    if (this.currentPageFaciles < this.totalPagesFaciles) {
      this.currentPageFaciles++;
      this.scrollToTop('#faciles');
    }
  }

  goToPreviousPageFaciles() {
    if (this.currentPageFaciles > 1) {
      this.currentPageFaciles--;
      this.scrollToTop('#faciles');
    }
  }

  private scrollToTop(selector: string) {
    setTimeout(() => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  chooseRandomRecipe() {
    const source = this.filteredRecipes;
    if (!source.length) return;

    this.isLoading = true;

    const randomIndex = Math.floor(Math.random() * source.length);

    setTimeout(() => {
      this.router.navigate(['/recipe', source[randomIndex].id]);
    }, 1500);
  }

  trackByRecipeId(_: number, recipe: Recipe) {
    return recipe.id;
  }

  goToDestacados() {
    this.scrollToTop('#destacados');
  }

  goToFaciles() {
    this.scrollToTop('#faciles');
  }
}
