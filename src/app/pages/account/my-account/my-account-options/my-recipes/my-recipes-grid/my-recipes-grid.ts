import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '../../../../../../shared/models/recipe.model';
@Component({
  selector: 'app-my-recipes-grid',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './my-recipes-grid.html',
  styleUrls: ['./my-recipes-grid.scss'],
})
export class MyRecipesGridComponent {
  // Recetas recibidas desde el componente padre
  @Input() recipes: Recipe[] = [];

  // Eventos para que el padre maneje las acciones
  @Output() view: EventEmitter<number> = new EventEmitter<number>();
  @Output() edit: EventEmitter<number> = new EventEmitter<number>();
  @Output() delete: EventEmitter<number> = new EventEmitter<number>();
}
