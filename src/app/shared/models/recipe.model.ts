/*export interface Author {
  id: number;
  name: string;
  avatar: string;
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  description?: string;
  ingredients: string[];
  category: string;


  rating?: number; 
  likes?: number; 
  author?: Author; 
}
*/

export interface Author {
  id: number;
  name: string;
  avatar: string;
}

export interface Recipe {
  id: number;
  title: string;
  image: string; // solo una imagen principal
  description?: string;
  ingredients: string[]; // lista simple de ingredientes
  category: string;
  rating?: number;
  likes?: number;
  author?: Author;
}

// NUEVO: para creación de recetas con varios campos
export interface RecipeForm extends Omit<Recipe, 'ingredients' | 'image'> {
  ingredients: { quantity: string; name: string }[];
  images: string[]; // permite hasta 10 imágenes
}
