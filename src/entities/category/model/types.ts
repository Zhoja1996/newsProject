export interface CategoriesApiResponse {
  categories: CategoriesType[];
  description: string;
  status: string;
}

export type CategoriesType =
  | "all"
  | "general"
  | "science"
  | "sports"
  | "business"
  | "health"
  | "entertainment"
  | "technology"
  | "tech"
  | "politics"
  | "food"
  | "travel"
  | "tourism";