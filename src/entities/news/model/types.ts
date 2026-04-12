import { CategoriesType } from "@/entities/category";

export interface INews {
  id: string;
  title: string;
  description: string;
  image: string | null;
  source: string;
  categories: CategoriesType[];
  publishedAt: string;
  url: string;
}

export interface NewsApiResponse {
  news: INews[];
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
}