import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CategoriesApiResponse, CategoriesType } from "../model/types";

const CATEGORIES: CategoriesType[] = [
  "general",
  "politics",
  "business",
  "technology",
  "science",
  "sports",
  "entertainment",
  "health",
  "food",
  "travel",
];

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({
    getCategories: builder.query<CategoriesApiResponse, void>({
      queryFn: () => ({
        data: {
          categories: CATEGORIES,
          description: "Static categories list",
          status: "ok",
        },
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;