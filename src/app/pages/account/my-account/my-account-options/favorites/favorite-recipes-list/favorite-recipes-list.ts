import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '../../../../../../shared/models/recipe.model';

@Component({
  selector: 'app-favorite-recipes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-recipes-list.html',
  styleUrls: ['./favorite-recipes-list.scss'],
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        query('tr', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class FavoriteRecipesListComponent {
  @Input() recipes: Recipe[] = [];
  @Output() view = new EventEmitter<number>();
  @Output() remove = new EventEmitter<Recipe>();

  rowsCount = 0; // Contador para disparar la animación
}
