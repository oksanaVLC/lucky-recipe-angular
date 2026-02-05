import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  type: 'tipo-comida' | 'momento' | 'ingrediente' | 'geografia';
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categories: Category[] = [
    // Tipo de comida
    { id: 1, name: 'Repostería', type: 'tipo-comida', icon: 'cake.webp' },
    { id: 2, name: 'Desayuno', type: 'tipo-comida', icon: 'croissant.webp' },
    { id: 3, name: 'Sopas y Cremas', type: 'tipo-comida', icon: 'soup.webp' },
    { id: 4, name: 'Pasta y Pizza', type: 'tipo-comida', icon: 'pizza.webp' },
    { id: 5, name: 'Arroces', type: 'tipo-comida', icon: 'rice.webp' },
    { id: 6, name: 'Ensaladas', type: 'tipo-comida', icon: 'salad.webp' },
    { id: 7, name: 'Verduras', type: 'tipo-comida', icon: 'vegetables.webp' },

    // Momento del día
    { id: 10, name: 'Desayuno', type: 'momento', icon: 'croissant.webp' },
    { id: 11, name: 'Almuerzo', type: 'momento', icon: 'rice.webp' },
    { id: 12, name: 'Cena', type: 'momento', icon: 'soup.webp' },
    { id: 13, name: 'Snack', type: 'momento', icon: 'cake.webp' },
    { id: 14, name: 'Fiestas', type: 'momento', icon: 'pizza.webp' },

    // Ingrediente / estilo
    { id: 20, name: 'Vegano', type: 'ingrediente', icon: 'vegano.webp' },
    { id: 21, name: 'Para niños', type: 'ingrediente', icon: 'bebe.webp' },
    { id: 22, name: 'Saludable', type: 'ingrediente', icon: 'saludable1.webp' },
    { id: 23, name: 'Sin gluten', type: 'ingrediente', icon: 'sin-gluten.webp' },

    // Geografía
    { id: 30, name: 'Recetas del mundo', type: 'geografia', icon: 'internacional.webp' },
    { id: 31, name: 'Locales / Regionales', type: 'geografia', icon: 'local1.webp' },
  ];

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }
}
