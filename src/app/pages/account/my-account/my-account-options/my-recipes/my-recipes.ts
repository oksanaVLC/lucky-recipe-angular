import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BackButtonSmallComponent } from '../../../../../shared/components/back-button-small/back-button-small';
import { Recipe } from '../../../../../shared/models/recipe.model';
import { RecipeService } from '../../../../../shared/services/recipe.service';
import { MyRecipesGridComponent } from './my-recipes-grid/my-recipes-grid';
import { MyRecipesListComponent } from './my-recipes-list/my-recipes-list';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    MyRecipesGridComponent,
    MyRecipesListComponent,
    BackButtonSmallComponent,
  ],
  providers: [DatePipe],
  templateUrl: './my-recipes.html',
  styleUrls: ['./my-recipes.scss'],
})
export class MyRecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private recipeService: RecipeService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.recipeService.getAll().subscribe((recipes) => {
      this.recipes = recipes;
    });
  }

  viewRecipe(id: number) {
    this.router.navigate(['/recipe', id]);
  }

  deleteRecipe(id: number) {
    if (confirm('¿Seguro que quieres borrar esta receta?')) {
      this.recipeService.deleteRecipe(id);
    }
  }
  editRecipe(id: number) {
    // Navega a la ruta de edición con el id
    this.router.navigate(['/mi-cuenta/crear-receta', id]);
  }
  goBack() {
    window.history.back();
  }
}
