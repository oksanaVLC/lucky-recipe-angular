import { Routes } from '@angular/router';
import { CanDeactivateGuard } from '../../../core/guards/can-deactivate.guard';
import { AccountComponent } from './account';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '', // /mi-cuenta
    component: AccountComponent,
  },
  {
    path: 'crear-receta', // /mi-cuenta/crear-receta
    loadComponent: () =>
      import('./my-account-options/create-new-recipe/create-new-recipe').then(
        (m) => m.CreateNewRecipeComponent,
      ),
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'edit-profile', // /mi-cuenta/edit-profile
    loadComponent: () =>
      import('./my-account-options/edit-profile/edit-profile').then((m) => m.EditProfileComponent),
  },
  {
    path: 'mis-recetas', // /mi-cuenta/mis-recetas
    loadComponent: () =>
      import('./my-account-options/my-recipes/my-recipes').then((m) => m.MyRecipesComponent),
  },
  {
    path: 'favoritas', // /mi-cuenta/favoritas
    loadComponent: () =>
      import('./my-account-options/favorites/favorites').then((m) => m.FavoritesComponent),
  },
  {
    path: 'borradores', // /mi-cuenta/borradores
    loadComponent: () =>
      import('./my-account-options/drafts/drafts').then((m) => m.DraftsComponent),
  },
  {
    path: 'lista-compra', // /mi-cuenta/lista-compra
    loadComponent: () =>
      import('./my-account-options/shopping-list/shopping-list').then(
        (m) => m.ShoppingListComponent,
      ),
  },
  {
    path: 'dietas', // /mi-cuenta/dietas
    loadComponent: () => import('./my-account-options/diets/diets').then((m) => m.DietsComponent),
  },
  {
    path: 'menu-semanal', // /mi-cuenta/menu-semanal
    loadComponent: () =>
      import('./my-account-options/weekly-menu/weekly-menu').then((m) => m.WeeklyMenuComponent),
  },
  {
    path: 'crear-receta/:id', // crear o editar dependiendo si hay id
    loadComponent: () =>
      import('./my-account-options/create-new-recipe/create-new-recipe').then(
        (m) => m.CreateNewRecipeComponent,
      ),
    canDeactivate: [CanDeactivateGuard],
  },
];
