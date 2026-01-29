export interface Author {
  id: number;
  name: string;
  avatar: string;
}

export interface Recipe {
  id: number;
  title: string;
  images: string[];
  shortDescription: string; // descripción breve para destacar
  longDescription: string; // descripción paso a paso
  ingredients: string[]; // lista simple de ingredientes
  category: string;
  rating?: number;
  likes?: number;
  author?: Author;
}

// Para creación y edición de recetas en el formulario
export interface RecipeForm {
  id: number;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  ingredients: { quantity: string; name: string }[];
  images: string[]; // permite hasta 10 imágenes
}
