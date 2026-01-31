import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '../../../../../../shared/models/recipe.model';

@Component({
  selector: 'app-my-recipes-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './my-recipes-list.html',
  styleUrls: ['./my-recipes-list.scss'],
})
export class MyRecipesListComponent {
  @Input() recipes: Recipe[] = [];
  @Output() view: EventEmitter<number> = new EventEmitter<number>();
  @Output() edit: EventEmitter<number> = new EventEmitter<number>();
  @Output() delete: EventEmitter<number> = new EventEmitter<number>();
}
