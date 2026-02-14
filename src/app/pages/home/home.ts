import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
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
    //Para Recetas del mundo 2
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
  recipes: Recipe[] = [];
  searchTerm: string = '';
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

  // PAGINACIÓN
  currentPage = 1;
  pageSize = 8; // recetas por página
  totalPages = 1;

  //Para Recetas del mundo 2
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
      this.currentPage = 1; // reset page on search
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

    //   si ya está visible al cargar, lo activamos sin scroll
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

  get paginatedRecipes() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRecipes.slice(start, start + this.pageSize);
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredRecipes.length / this.pageSize);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  chooseRandomRecipe() {
    const source = this.filteredRecipes;
    if (!source.length) return;

    this.isLoading = true; //  mostrar loader

    const randomIndex = Math.floor(Math.random() * source.length);

    setTimeout(() => {
      this.router.navigate(['/recipe', source[randomIndex].id]);
    }, 1500);
  }

  trackByRecipeId(_: number, recipe: Recipe) {
    return recipe.id;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.scrollToTopOfRecipes();
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToTopOfRecipes();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToTopOfRecipes();
    }
  }

  private scrollToTopOfRecipes() {
    const title = document.querySelector<HTMLHeadingElement>('h1.decorated-title.scroll-animate');
    title?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
