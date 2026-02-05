import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'recipe/:id',
    loadComponent: () =>
      import('./pages/recipes/recipe-detail/recipe-detail').then((m) => m.RecipeDetailComponent),
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('./pages/recipes/categories/categories').then((m) => m.CategoriesComponent),
  },
  {
    path: 'restaurantes',
    loadComponent: () =>
      import('./pages/restaurants/restaurants').then((m) => m.RestaurantsComponent),
  },
  {
    path: 'eventos',
    loadComponent: () => import('./pages/events/events').then((m) => m.Events),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register').then((m) => m.RegisterComponent),
  },

  {
    path: 'mi-cuenta',
    loadChildren: () =>
      import('./pages/account/my-account/account.routes').then((m) => m.ACCOUNT_ROUTES),
    canActivate: [AuthGuard],
  },

  {
    path: '**',
    redirectTo: 'inicio',
  },
];
