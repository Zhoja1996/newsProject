import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setNews } from "../model/newsSlice";
import { ParamsType } from "@/shared/interfaces";
import { NewsApiResponse } from "../model/types";

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/news/" }),
  endpoints: builder => ({
    getNews: builder.query<NewsApiResponse, ParamsType>({
      query: ({ page_number, page_size = 10, category, keywords, nextPageToken }) => {
        const params: Record<string, any> = {
          limit: page_size > 10 ? 10 : page_size, // Ограничение free плана
        };

        if (keywords?.trim()) {
          params.q = keywords;
        } else {
          params.category = category || "general";
        }

        // передаём токен следующей страницы, если он есть
        if (nextPageToken) {
          params.nextPage = nextPageToken;
        } else {
          params.page = page_number || 1;
        }

        return {
          url: keywords ? "search" : "top",
          params,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(setNews(result.data.news));
        } catch (error) {
          console.error("Failed to fetch news:", error);
        }
      },
    }),
    getLatestNews: builder.query<NewsApiResponse, { category?: string; limit?: number; nextPageToken?: string }>({
      query: ({ category = "general", limit = 10, nextPageToken }) => {
        const params: Record<string, any> = {
          limit: limit > 10 ? 10 : limit,
          category,
        };

        if (nextPageToken) {
          params.nextPage = nextPageToken;
        }

        return {
          url: "top",
          params,
        };
      },
    }),
  }),
});

export const { useGetNewsQuery, useGetLatestNewsQuery } = newsApi;