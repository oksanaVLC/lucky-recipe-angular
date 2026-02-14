import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackButtonSmallComponent } from '../../../../../shared/components/back-button-small/back-button-small';

// Interfaz para las listas guardadas
interface SavedList {
  date: Date;
  name: string;
  items: string[];
  editing?: boolean; // para controlar si se está editando el nombre
  expanded?: boolean; // controla si la lista se muestra
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

  showSavedMessage = false;
  savedMessage = '';
  savedLists: SavedList[] = [];

  constructor() {
    // Cargar lista actual
    const saved = localStorage.getItem('shoppingList');
    if (saved) {
      this.items = JSON.parse(saved);
    }

    // Cargar listas guardadas
    const storedLists = localStorage.getItem('savedLists');
    if (storedLists) {
      this.savedLists = JSON.parse(storedLists);
    }
  }

  // --------------------- ITEMS ---------------------
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

  // --------------------- ACCIONES ---------------------
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

  saveInApp() {
    if (!this.items.length) return;

    let listName = prompt('Nombre de tu lista:', `Lista ${this.savedLists.length + 1}`);
    if (listName === null) return; // canceló
    listName = listName.trim() || `Lista ${this.savedLists.length + 1}`;

    const newSavedList: SavedList = {
      date: new Date(),
      name: listName,
      items: [...this.items],
    };

    this.savedLists.unshift(newSavedList);
    localStorage.setItem('savedLists', JSON.stringify(this.savedLists));

    this.savedMessage = '¡Tu lista se ha guardado con éxito!';
    this.showSavedMessage = true;
    setTimeout(() => (this.showSavedMessage = false), 2500);

    // Opcional: limpiar lista actual
    // this.items = [];
    // this.saveList();
  }

  // --------------------- EDITAR NOMBRE ---------------------
  editListName(index: number) {
    this.savedLists[index].editing = true;
  }

  saveListName(index: number) {
    this.savedLists[index].editing = false;
    localStorage.setItem('savedLists', JSON.stringify(this.savedLists));
  }

  viewList(index: number) {
    const list = this.savedLists[index];
    alert('Lista:\n' + list.items.join('\n')); // temporal, luego reemplazamos por modal
  }

  editList(index: number) {
    const list = this.savedLists[index];
    const editedItems = prompt('Edita tu lista, separando items por coma:', list.items.join(', '));
    if (editedItems !== null) {
      list.items = editedItems
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i);
      localStorage.setItem('savedLists', JSON.stringify(this.savedLists));
    }
  }

  deleteList(index: number) {
    const confirmed = confirm('¿Quieres borrar esta lista?');
    if (confirmed) {
      this.savedLists.splice(index, 1);
      localStorage.setItem('savedLists', JSON.stringify(this.savedLists));
    }
  }
  toggleList(index: number) {
    this.savedLists[index].expanded = !this.savedLists[index].expanded;
  }
}
