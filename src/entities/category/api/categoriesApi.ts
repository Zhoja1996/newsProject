import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CategoriesApiResponse } from "../model/types";

const BASE_URL = 'https://api.currentsapi.services/v1/';
const API_KEY = 'E2_z0og5OSKwwKvFGJ3capfiBPDqmuvm2Gyp2JbaKpbDXIyC';

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getCategories: builder.query<CategoriesApiResponse, null>({
            query: () => {
                return {
                    url: 'available/categories',
                    params: {
                        apiKey: API_KEY,
                    },
                }
            },
        }),
    }),
})

export const { useGetCategoriesQuery } = categoriesApi;