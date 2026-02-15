import { Injectable, signal } from '@angular/core';

export interface SavedList {
  date: Date;
  name: string;
  items: string[];
  expanded?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  savedLists = signal<SavedList[]>([]);

  constructor() {
    const stored = localStorage.getItem('savedLists');
    if (stored) this.savedLists.set(JSON.parse(stored));
  }

  addList(list: SavedList) {
    this.savedLists.set([list, ...this.savedLists()]);
    localStorage.setItem('savedLists', JSON.stringify(this.savedLists()));
  }

  updateList(index: number, list: SavedList) {
    const lists = [...this.savedLists()];
    lists[index] = list;
    this.savedLists.set(lists);
    localStorage.setItem('savedLists', JSON.stringify(lists));
  }

  deleteList(index: number) {
    const lists = [...this.savedLists()];
    lists.splice(index, 1);
    this.savedLists.set(lists);
    localStorage.setItem('savedLists', JSON.stringify(lists));
  }
}
