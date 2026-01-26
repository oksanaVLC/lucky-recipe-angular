import { Routes } from '@angular/router';
import { Categories } from './categories/categories';
import { CreateRecipe } from './create-recipe/create-recipe';
import { Events } from './events/events';
import { AuthGuard } from './guards/auth-guard';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail';
import { RegisterComponent } from './register/register';
import { Restaurants } from './restaurants/restaurants';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: HomeComponent },
  { path: 'recipe/:id', component: RecipeDetailComponent },
  { path: 'categorias', component: Categories },
  { path: 'restaurantes', component: Restaurants },
  { path: 'eventos', component: Events },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'crear-receta', component: CreateRecipe, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' },
];
