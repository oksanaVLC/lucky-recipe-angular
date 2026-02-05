import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '../../../../../../shared/models/recipe.model';

@Component({
  selector: 'app-my-recipes-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './my-recipes-list.html',
  styleUrls: ['./my-recipes-list.scss'],
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
export class MyRecipesListComponent {
  @Input() recipes: Recipe[] = [];
  @Output() view: EventEmitter<number> = new EventEmitter<number>();
  @Output() edit: EventEmitter<number> = new EventEmitter<number>();
  @Output() delete: EventEmitter<number> = new EventEmitter<number>();

  // Para disparar la animación cuando cambian los elementos
  rowsCount = 0;

  @Input() set list(value: Recipe[]) {
    this.recipes = value;
    this.rowsCount++;
  }
}
