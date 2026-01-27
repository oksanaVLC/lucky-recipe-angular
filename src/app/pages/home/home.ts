import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from '../../core/services/search.service';
import { LoaderComponent } from '../../shared/components/loader/loader';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar';
import { Recipe } from '../../shared/models/recipe.model';

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
export class HomeComponent {
  recipes: Recipe[] = [
    {
      id: 1,
      title: 'Cheesecake',
      image: 'assets/images/cheesecake.webp',
      ingredients: ['cheese', 'eggs', 'sugar'],
      category: 'Destacados',
      description: '',
    },
    {
      id: 2,
      title: 'Vegan Salad',
      image: 'assets/images/mediterranean-salad.webp',
      ingredients: ['lettuce', 'tomato', 'avocado'],
      category: 'Veganos',
      description: '',
    },
    {
      id: 3,
      title: 'Chocolate Cake',
      image: 'assets/images/tiramisu.webp',
      ingredients: ['chocolate', 'flour', 'eggs'],
      category: 'Más Populares',
      description: '',
    },
  ];

  searchTerm: string = '';
  private subscription: Subscription;
  isLoading = false; // loader

  constructor(
    private searchService: SearchService,
    private router: Router,
  ) {
    this.subscription = this.searchService.searchTerm$.subscribe(
      (term) => (this.searchTerm = term),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
}
