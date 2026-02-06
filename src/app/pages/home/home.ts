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

  isLoading = false;

  // PAGINACIÓN
  currentPage = 1;
  pageSize = 8; // recetas por página
  totalPages = 1;

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

  goToRecipe(recipeId: number) {
    this.navService.setLastUrl(this.router.url, window.scrollY);
    this.router.navigate(['/recipe', recipeId]);
  }
}
