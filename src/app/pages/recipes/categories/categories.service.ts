import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  type: 'tipo-comida' | 'momento' | 'ingrediente' | 'geografia';
  icon: string; // esto es lo que vendrá del backend
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  getCategories(): Observable<Category[]> {
    return of([
      // Tipo de comida
      { id: 1, name: 'Repostería', type: 'tipo-comida', icon: 'assets/images/pizza.png' },
      { id: 2, name: 'Desayuno', type: 'tipo-comida', icon: 'assets/images/pizza.png' },
      { id: 3, name: 'Sopas y Cremas', type: 'tipo-comida', icon: 'assets/images/pizza.png' },
      { id: 4, name: 'Pasta y Pizza', type: 'tipo-comida', icon: 'assets/images/pizza.png' },
      { id: 5, name: 'Arroces', type: 'tipo-comida', icon: 'assets/images/pizza.png' },
      { id: 6, name: 'Ensaladas', type: 'tipo-comida', icon: 'assets/images/pizza.png' },
      { id: 7, name: 'Verduras', type: 'tipo-comida', icon: 'assets/images/pizza.png' },

      // Momento del día
      { id: 10, name: 'Desayuno', type: 'momento', icon: 'assets/images/pizza.png' },
      { id: 11, name: 'Almuerzo', type: 'momento', icon: 'assets/images/pizza.png' },
      { id: 12, name: 'Cena', type: 'momento', icon: 'assets/images/pizza.png' },
      { id: 13, name: 'Snack', type: 'momento', icon: 'assets/images/pizza.png' },
      { id: 14, name: 'Fiestas', type: 'momento', icon: 'assets/images/pizza.png' },

      // Ingrediente / estilo
      { id: 20, name: 'Vegano', type: 'ingrediente', icon: 'assets/images/pizza.png' },
      { id: 21, name: 'Para niños', type: 'ingrediente', icon: 'assets/images/pizza.png' },
      { id: 22, name: 'Saludable', type: 'ingrediente', icon: 'assets/images/pizza.png' },
      { id: 23, name: 'Sin gluten', type: 'ingrediente', icon: 'assets/images/pizza.png' },

      // Geografía
      { id: 30, name: 'Recetas del mundo', type: 'geografia', icon: 'assets/images/pizza.png' },
      { id: 31, name: 'Locales / Regionales', type: 'geografia', icon: 'assets/images/pizza.png' },
    ]);
  }
}
