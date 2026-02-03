import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DraftService } from '../../../../../core/services/draft.service';
import { BackButtonSmallComponent } from '../../../../../shared/components/back-button-small/back-button-small';
import { BackButtonComponent } from '../../../../../shared/components/back-button/back-button';
import { Recipe, RecipeForm } from '../../../../../shared/models/recipe.model';
import { RecipeService } from '../../../../../shared/services/recipe.service';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent, BackButtonSmallComponent],
  templateUrl: './create-new-recipe.html',
  styleUrls: ['./create-new-recipe.scss'],
})
export class CreateNewRecipeComponent implements OnInit {
  currentUser = {
    id: 1,
    name: 'Oksana',
    avatar: 'assets/images/profile.jpg',
  };

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
    shortDescription: '',
    longDescription: '',
    category: '',
    ingredients: [{ quantity: '', name: '' }],
    images: [],
  };

  files: File[] = [];
  images: string[] = [];

  showDraftModal = false;
  showSavedMessage = false;
  savedMessage = '';

  private _resolveDeactivate!: (value: boolean) => void;
  private _isSaving = false;

  isEdit = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private draftService: DraftService,
    private location: Location,
  ) {}

  /* ================= INIT ================= */

  ngOnInit() {
    // 1️⃣ cargar borrador si existe
    const draft = this.draftService.getCurrentDraft();
    if (draft) {
      this.recipe = { ...draft.recipe };
      this.images = [...draft.recipe.images];
      this.draftService.clearCurrentDraft();
      return;
    }

    // 2️⃣ modo edición si hay id
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      const existing = this.recipeService.getRecipeById(+recipeId);
      if (!existing) {
        this.router.navigate(['/mi-cuenta/mis-recetas']);
        return;
      }

      this.isEdit = true;
      this.recipe = {
        id: existing.id,
        title: existing.title,
        shortDescription: existing.shortDescription,
        longDescription: existing.longDescription,
        category: existing.category,
        ingredients: existing.ingredients.map((i) => {
          const [quantity, ...nameParts] = i.split(' ');
          return { quantity, name: nameParts.join(' ') };
        }),
        images: existing.images || [],
      };

      this.images = [...existing.images];
    }
  }

  /* ================= HELPERS ================= */

  private capitalizeTitle(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  hasUnsavedChanges(): boolean {
    return !!(
      this.recipe.title ||
      this.recipe.shortDescription ||
      this.recipe.longDescription ||
      this.recipe.ingredients.length > 1 ||
      this.images.length
    );
  }

  /* ================= INGREDIENTES ================= */

  addIngredient(index: number) {
    this.recipe.ingredients.splice(index + 1, 0, { quantity: '', name: '' });
  }

  removeIngredient(index: number) {
    if (this.recipe.ingredients.length > 1) {
      this.recipe.ingredients.splice(index, 1);
    }
  }

  /* ================= IMÁGENES ================= */

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

    const validFiles = selectedFiles.filter((f) => f.size <= 5 * 1024 * 1024);
    const rejectedFiles = selectedFiles.filter((f) => f.size > 5 * 1024 * 1024);

    if (rejectedFiles.length) {
      alert('Algunas imágenes superan los 5MB y no se han añadido');
    }

    validFiles.slice(0, remainingSlots).forEach((file) => {
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

  /* ================= GUARDAR ================= */

  createRecipe() {
    this._isSaving = true;

    const existing = this.recipeService.getRecipeById(this.recipe.id);

    const recipeData: Recipe = {
      id: this.recipe.id,
      title: this.capitalizeTitle(this.recipe.title.trim()),
      shortDescription: this.recipe.shortDescription,
      longDescription: this.recipe.longDescription,
      category: this.recipe.category,
      ingredients: this.recipe.ingredients.map((ing) => `${ing.quantity} ${ing.name}`.trim()),
      images: this.images.length ? [...this.images] : ['assets/images/logo.webp'],
      rating: 0,
      likesCount: 0,
      author: this.currentUser,
      createdAt: existing ? existing.createdAt : new Date(),
    };

    if (existing) {
      this.recipeService.updateRecipe(recipeData);
      this.savedMessage = 'Receta actualizada con éxito';
    } else {
      this.recipeService.addRecipe(recipeData);
      this.savedMessage = 'Receta creada con éxito';
    }

    this.showSavedMessage = true;

    setTimeout(() => {
      this.showSavedMessage = false;
      this.router.navigate(['/recipe', recipeData.id]);
    }, 2000);
  }

  /* ================= CAN DEACTIVATE ================= */

  canDeactivate(): Promise<boolean> {
    if (this._isSaving) return Promise.resolve(true);

    if (this.hasUnsavedChanges()) {
      this.showDraftModal = true;
      return new Promise((resolve) => {
        this._resolveDeactivate = resolve;
      });
    }

    return Promise.resolve(true);
  }

  /* ================= MODAL ================= */

  saveDraft() {
    // ✨ edición → guardar cambios reales
    if (this.isEdit) {
      this.showDraftModal = false;
      this.createRecipe();
      return;
    }

    // 📝 creación → guardar borrador
    const draft = {
      id: this.recipe.id,
      title: this.recipe.title || 'Sin título',
      updatedAt: new Date().toISOString(),
      recipe: { ...this.recipe },
    };

    this.draftService.saveDraft(draft);
    this.showDraftModal = false;

    this._resolveDeactivate?.(true);
    this._resolveDeactivate = undefined!;
  }

  discardDraft() {
    this.showDraftModal = false;
    this._resolveDeactivate?.(true);
    this._resolveDeactivate = undefined!;
  }

  cancelDraft() {
    this.showDraftModal = false;
    this._resolveDeactivate?.(false);
    this._resolveDeactivate = undefined!;
  }

  /* ================= BACK ================= */

  goBack() {
    this.location.back();
  }

  /* ================= GETTERS ================= */

  get imageCount(): string {
    return `${this.files.length} / 10`;
  }
}
