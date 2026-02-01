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
  private _resolveDeactivate!: (value: boolean) => void;
  private _isSaving = false;

  showSavedMessage = false;
  savedMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private draftService: DraftService,
    private location: Location,
  ) {}

  ngOnInit() {
    // 1️⃣ Cargar borrador si existe
    const draft = this.draftService.getCurrentDraft();
    if (draft) {
      this.recipe = { ...draft.recipe };
      this.images = [...draft.recipe.images];
      this.draftService.clearCurrentDraft();
      return;
    }

    // 2️⃣ Cargar receta existente si hay id en ruta
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      const existingRecipe = this.recipeService.getRecipeById(+recipeId);
      if (existingRecipe) {
        this.recipe = {
          id: existingRecipe.id,
          title: existingRecipe.title,
          shortDescription: existingRecipe.shortDescription,
          longDescription: existingRecipe.longDescription,
          category: existingRecipe.category,
          ingredients: existingRecipe.ingredients.map((i) => {
            const [quantity, ...nameParts] = i.split(' ');
            return { quantity, name: nameParts.join(' ') };
          }),
          images: existingRecipe.images || [],
        };
        this.images = [...existingRecipe.images];
      } else {
        // Si el id no existe, volvemos a la lista de recetas
        this.router.navigate(['/mi-cuenta/mis-recetas']);
      }
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

  /** Crear o actualizar receta */
  createRecipe() {
    // Cerrar modal de borrador si estaba abierto
    if (this.showDraftModal && this._resolveDeactivate) {
      this._resolveDeactivate(true);
      this._resolveDeactivate = undefined!;
      this.showDraftModal = false;
    }

    this._isSaving = true;

    //  Mover existing aquí
    const existing = this.recipeService.getRecipeById(this.recipe.id);

    const recipeData: Recipe = {
      id: this.recipe.id,
      title: this.recipe.title,
      shortDescription: this.recipe.shortDescription,
      longDescription: this.recipe.longDescription,
      category: this.recipe.category,
      ingredients: this.recipe.ingredients.map((ing) => `${ing.quantity} ${ing.name}`.trim()),
      images: this.images.length ? [...this.images] : ['assets/images/logo.webp'],
      rating: 0,
      likesCount: 0,
      author: this.currentUser,
      createdAt: existing ? existing.createdAt : new Date(), // <-- usar existing aquí
    };

    if (existing) {
      this.recipeService.updateRecipe(recipeData);
      this.savedMessage = 'Receta actualizada con éxito!';
    } else {
      this.recipeService.addRecipe(recipeData);
      this.savedMessage = 'Receta creada con éxito!';
    }

    this.showSavedMessage = true;

    setTimeout(() => {
      this.showSavedMessage = false;
      this.router.navigate(['/recipe', recipeData.id]);
    }, 2000);
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

  /** CanDeactivate */
  hasUnsavedChanges(): boolean {
    return !!(
      this.recipe.title ||
      this.recipe.shortDescription ||
      this.recipe.longDescription ||
      this.recipe.ingredients.length > 1 ||
      this.images.length
    );
  }

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

  /** Modal borrador */
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
      this._resolveDeactivate(true);
      this._resolveDeactivate = undefined!;
    }
  }

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
  goBack() {
    this.location.back();
  }
}
