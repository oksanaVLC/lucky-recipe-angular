// src/app/models/recipe.model.ts
export interface Recipe {
  id: number;
  title: string;
  image: string;
  ingredients: string[];
  category: string;
  description: string;
}
