import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackButtonSmallComponent } from '../../../../../shared/components/back-button-small/back-button-small';

interface SavedList {
  date: Date;
  name: string;
  items: string[];
  expanded?: boolean;
}

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

  savedLists: SavedList[] = [];
  showSavedMessage = false;
  savedMessage = '';

  editingList?: SavedList;
  editingIndex?: number;
  showEditModal = false;

  constructor() {
    // Lista actual
    const saved = localStorage.getItem('shoppingList');
    if (saved) this.items = JSON.parse(saved);

    // Listas guardadas
    const stored = localStorage.getItem('savedLists');
    if (stored) this.savedLists = JSON.parse(stored);
  }

  // ------------------- ITEMS -------------------
  addItem() {
    const trimmed = this.newItem.trim();
    if (!trimmed) return;
    this.items.push(trimmed);
    this.newItem = '';
    this.saveCurrentList();
  }

  removeItem(i: number) {
    this.items.splice(i, 1);
    this.saveCurrentList();
  }

  saveCurrentList() {
    localStorage.setItem('shoppingList', JSON.stringify(this.items));
  }

  // ------------------- ACCIONES -------------------
  saveInApp() {
    if (!this.items.length) return;

    let name = prompt('Nombre de tu lista:', `Lista ${this.savedLists.length + 1}`);
    if (name === null) return;
    name = name.trim() || `Lista ${this.savedLists.length + 1}`;

    const newList: SavedList = {
      date: new Date(),
      name,
      items: [...this.items],
    };

    this.savedLists.unshift(newList);
    localStorage.setItem('savedLists', JSON.stringify(this.savedLists));

    this.savedMessage = '¡Tu lista se ha guardado con éxito!';
    this.showSavedMessage = true;
    setTimeout(() => (this.showSavedMessage = false), 2500);
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
    const content = this.items.join('<br>');
    const win = window.open('', '', 'width=400,height=600');
    win?.document.write(`<h2>Mi Lista de Compras</h2>${content}`);
    win?.document.close();
    win?.print();
  }

  // ------------------- LISTAS GUARDADAS -------------------
  toggleList(i: number) {
    this.savedLists[i].expanded = !this.savedLists[i].expanded;
  }

  editList(i: number) {
    this.editingList = { ...this.savedLists[i], items: [...this.savedLists[i].items] };
    this.editingIndex = i;
    this.showEditModal = true;
  }

  deleteList(i: number) {
    const confirmed = confirm('¿Quieres borrar esta lista?');
    if (confirmed) {
      this.savedLists.splice(i, 1);
      localStorage.setItem('savedLists', JSON.stringify(this.savedLists));
    }
  }

  // ------------------- MODAL EDIT -------------------
  addItemToEditingList() {
    this.editingList?.items.push('');
  }

  removeItemFromEditingList(i: number) {
    this.editingList?.items.splice(i, 1);
  }

  saveEditedList() {
    if (!this.editingList || this.editingIndex === undefined) return;

    this.savedLists[this.editingIndex] = { ...this.editingList };
    localStorage.setItem('savedLists', JSON.stringify(this.savedLists));
    this.showEditModal = false;

    this.savedMessage = '¡Lista actualizada con éxito!';
    this.showSavedMessage = true;
    setTimeout(() => (this.showSavedMessage = false), 2500);
  }

  closeEditModal() {
    this.showEditModal = false;
  }
  trackByIndex(index: number, item: string) {
    return index; // Angular mantiene la referencia por índice
  }
}
