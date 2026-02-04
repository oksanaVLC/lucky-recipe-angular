import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CategoriesService, Category } from './categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  categoryGroups: { type: Category['type']; name: string; categories: Category[] }[] = [
    { type: 'tipo-comida', name: 'Tipo de comida', categories: [] },
    { type: 'momento', name: 'Momento del día', categories: [] },
    { type: 'ingrediente', name: 'Ingrediente / Estilo', categories: [] },
    { type: 'geografia', name: 'Recetas por geografía', categories: [] },
  ];

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories = data;

      this.categoryGroups.forEach((group) => {
        group.categories = this.categories.filter((c) => c.type === group.type);
      });
    });
  }

  selectCategory(cat: Category) {
    console.log('Seleccionada categoría:', cat);
    // aquí luego navegaré con queryParams
  }
  getIcon(cat: Category): string {
    return 'assets/images/pizza.png';
  }
}
