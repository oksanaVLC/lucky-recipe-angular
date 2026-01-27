import { Injectable } from '@angular/core';
import { RecipeForm } from '../../shared/models/recipe.model';

export interface Draft {
  id: number;
  title: string;
  updatedAt: string; // guardamos como string para JSON
  recipe: RecipeForm;
}

@Injectable({
  providedIn: 'root',
})
export class DraftService {
  private drafts: Draft[] = [];
  private currentDraft: Draft | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const data = localStorage.getItem('drafts');
    if (data) {
      this.drafts = JSON.parse(data);
    }
  }

  private saveToStorage() {
    localStorage.setItem('drafts', JSON.stringify(this.drafts));
  }

  getDrafts(): Draft[] {
    return this.drafts;
  }

  saveDraft(draft: Draft) {
    const index = this.drafts.findIndex((d) => d.id === draft.id);
    if (index > -1) {
      this.drafts[index] = draft;
    } else {
      this.drafts.push(draft);
    }
    this.saveToStorage();
  }

  deleteDraft(id: number) {
    this.drafts = this.drafts.filter((d) => d.id !== id);
    this.saveToStorage();
  }

  setCurrentDraft(draft: Draft) {
    this.currentDraft = draft;
  }

  getCurrentDraft(): Draft | null {
    return this.currentDraft;
  }

  clearCurrentDraft() {
    this.currentDraft = null;
  }
}
