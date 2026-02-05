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

  addItem() {
    const trimmed = this.newItem.trim();
    if (!trimmed) return;

    this.items.push(trimmed);
    this.newItem = '';
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }
}
