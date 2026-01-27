import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DraftService } from '../../../../../core/services/draft.service';
import { Recipe, RecipeForm } from '../../../../../shared/models/recipe.model';
import { RecipeService } from '../../../../../shared/services/recipe.service';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-recipe.html',
  styleUrls: ['./create-new-recipe.scss'],
})
export class CreateNewRecipeComponent implements OnInit {
  categories = [
    'Destacados',
    'Fáciles',
    'Desayuno',
    'Repostería',
    'Últimas',
    'Más Populares',
    'Veganos',
    'Para niños',
  ];

  recipe: RecipeForm = {
    id: Date.now(),
    title: '',
    description: '',
    category: '',
    ingredients: [{ quantity: '', name: '' }],
    images: [],
  };

  files: File[] = [];
  images: string[] = [];

  showDraftModal = false;
  private _resolveDeactivate!: (value: boolean) => void; // Para CanDeactivate

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private draftService: DraftService,
  ) {}

  ngOnInit() {
    const draft = this.draftService.getCurrentDraft();
    if (draft) {
      this.recipe = { ...draft.recipe };
      this.images = [...draft.recipe.images];
      this.draftService.clearCurrentDraft();
    }
  }

  /** Ingredientes */
  addIngredient(index: number) {
    this.recipe.ingredients.splice(index + 1, 0, { quantity: '', name: '' });
  }

  removeIngredient(index: number) {
    if (this.recipe.ingredients.length > 1) {
      this.recipe.ingredients.splice(index, 1);
    }
  }

  /** Manejo de imágenes */
  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.handleFiles(Array.from(input.files));
    input.value = '';
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer?.files) return;
    this.handleFiles(Array.from(event.dataTransfer.files));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private handleFiles(selectedFiles: File[]) {
    const remainingSlots = 10 - this.files.length;
    const allowed = selectedFiles.filter((f) => f.size <= 2 * 1024 * 1024).slice(0, remainingSlots);

    allowed.forEach((file) => {
      this.files.push(file);
      const reader = new FileReader();
      reader.onload = () => this.images.push(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
    this.files.splice(index, 1);
    this.images.splice(index, 1);
  }

  /** Crear receta final */
  createRecipe() {
    const newRecipe: Recipe = {
      id: this.recipe.id,
      title: this.recipe.title,
      description: this.recipe.description,
      category: this.recipe.category,
      ingredients: this.recipe.ingredients.map((ing) => `${ing.quantity} ${ing.name}`.trim()),
      image: this.images[0] || '',
      rating: 0,
      likes: 0,
      author: undefined,
    };
    this.recipeService.addRecipe(newRecipe);
    this.router.navigate(['/inicio']);
  }

  /** Archivos subidos */
  get uploadedFileNames(): string {
    return this.files.length
      ? this.files.map((f) => f.name).join(', ')
      : 'No se ha seleccionado ningún archivo';
  }

  get imageCount(): string {
    return `${this.files.length} / 10`;
  }

  /** CanDeactivate guard: verifica cambios sin guardar */
  hasUnsavedChanges(): boolean {
    return !!(
      this.recipe.title ||
      this.recipe.description ||
      this.recipe.ingredients.length > 1 ||
      this.images.length
    );
  }

  canDeactivate(): Promise<boolean> {
    if (this.hasUnsavedChanges()) {
      this.showDraftModal = true;
      return new Promise((resolve) => {
        this._resolveDeactivate = resolve;
      });
    }
    return Promise.resolve(true);
  }

  /** Modal de borrador / confirmación */
  saveDraft() {
    const now = new Date();
    const draft = {
      id: this.recipe.id,
      title: this.recipe.title || 'Sin título',
      updatedAt: now.toISOString(),
      recipe: { ...this.recipe },
    };

    this.draftService.saveDraft(draft);
    this.showDraftModal = false;

    if (this._resolveDeactivate) {
      // Resolvemos la promesa indicando que la navegación puede continuar
      this._resolveDeactivate(true);
      this._resolveDeactivate = undefined!;
    }
  }

  // Y en discardDraft
  discardDraft() {
    this.showDraftModal = false;

    if (this._resolveDeactivate) {
      this._resolveDeactivate(true);
      this._resolveDeactivate = undefined!;
    }
  }

  cancelDraft() {
    this.showDraftModal = false;

    if (this._resolveDeactivate) {
      this._resolveDeactivate(false);
      this._resolveDeactivate = undefined!;
    }
  }
}
