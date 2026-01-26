import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'recipe/:id',
    loadComponent: () =>
      import('./recipe-detail/recipe-detail').then((m) => m.RecipeDetailComponent),
  },
  {
    path: 'categorias',
    loadComponent: () => import('./categories/categories').then((m) => m.Categories),
  },
  {
    path: 'restaurantes',
    loadComponent: () => import('./restaurants/restaurants').then((m) => m.Restaurants),
  },
  {
    path: 'eventos',
    loadComponent: () => import('./events/events').then((m) => m.Events),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'crear-receta',
    loadComponent: () => import('./create-recipe/create-recipe').then((m) => m.CreateRecipe),
    canActivate: [AuthGuard],
  },
  {
    path: 'mi-cuenta',
    loadComponent: () => import('./account/account').then((m) => m.AccountComponent),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];
