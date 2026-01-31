import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Recipe } from '../../../../../shared/models/recipe.model';
import { RecipeService } from '../../../../../shared/services/recipe.service';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe], // <-- aquí
  templateUrl: './my-recipes.html',
  styleUrls: ['./my-recipes.scss'],
})
export class MyRecipesComponent implements OnInit {
  recipes: Recipe[] = [];

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
}
