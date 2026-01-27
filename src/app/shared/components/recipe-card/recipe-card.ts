import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./recipe-card.scss'],
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;
}
