import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackButtonSmallComponent } from '../../../../../shared/components/back-button-small/back-button-small';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonSmallComponent],
  templateUrl: './shopping-list.html',
  styleUrls: ['./shopping-list.scss'],
})
export class ShoppingListComponent {
  items: string[] = [];
  newItem: string = '';

  constructor() {
    // cargar items guardados al iniciar
    const saved = localStorage.getItem('shoppingList');
    if (saved) {
      this.items = JSON.parse(saved);
    }
  }

  addItem() {
    const trimmed = this.newItem.trim();
    if (!trimmed) return;

    this.items.push(trimmed);
    this.newItem = '';
    this.saveList();
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.saveList();
  }

  saveList() {
    localStorage.setItem('shoppingList', JSON.stringify(this.items));
  }

  downloadList() {
    const blob = new Blob([this.items.join('\n')], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista_compras.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  printList() {
    const printContent = this.items.join('<br>');
    const newWindow = window.open('', '', 'width=400,height=600');
    newWindow!.document.write(`<h2>Mi Lista de Compras</h2>${printContent}`);
    newWindow!.document.close();
    newWindow!.print();
  }
}
