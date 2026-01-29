import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
})
export class HomeComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  searchTerm: string = '';
  private searchSub: Subscription | null = null;
  private recipesSub: Subscription | null = null;

  isLoading = true; // true mientras cargan las recetas
  categories: string[] = [
    'Destacados',
    'Fáciles',
    'Desayuno',
    'Repostería',
    'Últimas',
    'Más populares',
    'Veganos',
    'Para niños',
  ];

  constructor(
    private searchService: SearchService,
    private recipeService: RecipeService,
    private router: Router,
    private navService: NavigationService,
  ) {}

  ngOnInit() {
    // Suscribirse al search term
    this.searchSub = this.searchService.searchTerm$.subscribe((term) => (this.searchTerm = term));

    // Obtener últimas 6 recetas
    this.recipesSub = this.recipeService.getAll().subscribe((allRecipes) => {
      this.recipes = [...allRecipes].sort((a, b) => b.id - a.id).slice(0, 6);
      this.isLoading = false; // ya cargó
    });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
    this.recipesSub?.unsubscribe();
  }

  get filteredRecipes() {
    const term = this.searchTerm.toLowerCase();
    return !term
      ? this.recipes
      : this.recipes.filter(
          (r) =>
            r.title.toLowerCase().includes(term) ||
            r.ingredients.some((i) => i.toLowerCase().includes(term)),
        );
  }

  chooseRandomRecipe() {
    this.isLoading = true;

    setTimeout(() => {
      const source = this.filteredRecipes;
      if (!source.length) {
        this.isLoading = false;
        return;
      }

      const randomIndex = Math.floor(Math.random() * source.length);
      const recipe = source[randomIndex];

      this.router.navigate(['/recipe', recipe.id]);
      this.isLoading = false;
    }, 2000);
  }

  trackByRecipeId(_: number, recipe: Recipe) {
    return recipe.id;
  }
  goToRecipe(recipeId: number) {
    this.navService.setLastUrl(this.router.url, window.scrollY);
    this.router.navigate(['/recipe', recipeId]);
  }
}
