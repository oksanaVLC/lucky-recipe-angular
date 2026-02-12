import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BackButtonSmallComponent } from '../../shared/components/back-button-small/back-button-small';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card';
import { Recipe } from '../../shared/models/recipe.model';
import { RecipeService } from '../../shared/services/recipe.service';

@Component({
  selector: 'app-author-recipes',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent, BackButtonSmallComponent],
  templateUrl: './author-recipes.html',
  styleUrls: ['./author-recipes.scss'],
})
export class AuthorRecipesComponent implements OnInit, OnDestroy {
  authorId!: number;
  authorName = '';
  recipes: Recipe[] = [];

  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
  ) {}

  ngOnInit() {
    this.authorId = Number(this.route.snapshot.paramMap.get('id'));

    this.sub.add(
      this.recipeService.getAll().subscribe((all) => {
        this.recipes = all.filter((r) => Number(r.author?.id) === this.authorId);

        if (this.recipes.length) {
          this.authorName = this.recipes[0].author?.name || '';
        }
      }),
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  trackById(index: number, recipe: Recipe) {
    return recipe.id;
  }
}
