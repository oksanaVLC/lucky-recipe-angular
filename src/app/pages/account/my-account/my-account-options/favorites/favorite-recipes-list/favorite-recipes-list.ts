import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '../../../../../../shared/models/recipe.model';

@Component({
  selector: 'app-favorite-recipes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-recipes-list.html',
  styleUrls: ['./favorite-recipes-list.scss'],
})
export class FavoriteRecipesListComponent {
  @Input() recipes: Recipe[] = [];

  @Output() view = new EventEmitter<number>();
  @Output() remove = new EventEmitter<Recipe>();
}
