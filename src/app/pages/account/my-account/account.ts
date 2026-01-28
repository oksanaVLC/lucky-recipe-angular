import {
  animate,
  animation,
  query,
  stagger,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DraftService } from '../../../core/services/draft.service';
import { RecipeService } from '../../../shared/services/recipe.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.html',
  styleUrls: ['./account.scss'],
  animations: [
    // Trigger de entrada usando la API moderna
    trigger('pageEnter', [
      transition(':enter', [
        useAnimation(
          animation([
            // Query sobre cada card para aplicar stagger
            query(
              '.account-card',
              [
                style({ opacity: 0, transform: 'translateY(10px)', display: 'flex' }), // 10px en vez de 20px
                stagger(
                  80,
                  animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
                ),
              ],
              { optional: true },
            ),
          ]),
        ),
      ]),
    ]),
  ],
})
export class AccountComponent {
  recipeCount = signal(0);

  constructor(
    public draftService: DraftService,
    public recipeService: RecipeService,
  ) {
    this.recipeService.getAll().subscribe((recipes) => {
      this.recipeCount.set(recipes.length);
    });
  }
}
