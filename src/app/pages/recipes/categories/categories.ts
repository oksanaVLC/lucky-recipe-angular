import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BackButtonSmallComponent } from '../../../shared/components/back-button-small/back-button-small';
import { CategoriesService, Category } from './categories.service';
interface CategoryGroup {
  type: Category['type'];
  name: string;
  categories: Category[];
  open: boolean;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, BackButtonSmallComponent],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  categoryGroups: CategoryGroup[] = [
    { type: 'tipo-comida', name: 'Tipo de comida', categories: [], open: false },
    { type: 'momento', name: 'Momento del día', categories: [], open: false },
    { type: 'ingrediente', name: 'Ingrediente / Estilo', categories: [], open: false },
    { type: 'geografia', name: 'Recetas por geografía', categories: [], open: false },
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

  toggleGroup(group: CategoryGroup) {
    group.open = !group.open;
  }

  selectCategory(cat: Category) {
    console.log('Seleccionada categoría:', cat);
  }

  getIconPath(iconName: string): string {
    return `assets/images/${iconName}`;
  }
}
