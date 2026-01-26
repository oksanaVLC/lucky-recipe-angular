export interface Author {
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

  // NUEVAS propiedades
  rating?: number; // 1 a 5
  likes?: number; // número de likes
  author?: Author; // info del autor
}
