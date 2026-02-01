import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BackButtonSmallComponent } from '../../../shared/components/back-button-small/back-button-small';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button';
import { RecipeCardComponent } from '../../../shared/components/recipe-card/recipe-card';
import { Recipe } from '../../../shared/models/recipe.model';
import { RecipeService } from '../../../shared/services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RecipeCardComponent,
    BackButtonSmallComponent,
    BackButtonComponent,
  ],
  templateUrl: './recipe-detail.html',
  styleUrls: ['./recipe-detail.scss'],
})
export class RecipeDetailComponent implements OnInit {
  recipe?: Recipe;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private location: Location,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.recipeService.getRecipeById(id);

    if (found) {
      // asegurar que siempre haya imágenes
      found.images = found.images?.length ? found.images : ['assets/images/logo.webp'];

      // autor por defecto si no hay
      found.author = found.author || {
        id: 1,
        name: 'Oksana',
        avatar: 'assets/images/profile.jpg',
      };

      // likesCount inicial (futuro back-end)
      found.likesCount = found.likesCount ?? (this.recipeService.isFavorite(found.id) ? 1 : 0);

      this.recipe = found;
    } else {
      this.location.back();
    }
  }

  goBack() {
    this.location.back();
  }
}
