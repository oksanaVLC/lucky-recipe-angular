import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '../../../../../../shared/models/recipe.model';

@Component({
  selector: 'app-favorite-recipes-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-recipes-grid.html',
  styleUrls: ['./favorite-recipes-grid.scss'],
})
export class FavoriteRecipesGridComponent {
  @Input() recipes: Recipe[] = [];

  @Output() view = new EventEmitter<number>();
  @Output() remove = new EventEmitter<Recipe>();
}
