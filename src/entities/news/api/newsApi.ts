import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setNews } from "../model/newsSlice";
import { ParamsType } from "@/shared/interfaces";
import { NewsApiResponse } from "../model/types";

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/news/" }),
  endpoints: builder => ({
    getNews: builder.query<NewsApiResponse, ParamsType>({
      keepUnusedDataFor: 0,
      query: params => {
        const {
          page_number = 1,
          page_size = 10,
          category,
          keywords,
        } = params || {};

        if (keywords?.trim()) {
          return {
            url: "search",
            params: {
              q: keywords,
              page: page_number,
              limit: page_size,
              locale: "us",
              language: "en",
            },
          };
        }

        return {
          url: "top",
          params: {
            page: page_number,
            limit: page_size,
            category: category || "general",
            locale: "us",
            language: "en",
          },
        };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const data = result.data;

          dispatch(setNews(data.news));
        } catch (error) {
          console.error("Failed to fetch news:", error);
        }
      },
    }),

    getLatestNews: builder.query<NewsApiResponse, string>({
      query: (sortBy = "published_at") => ({
        url: "top",
        params: {
          page: 1,
          limit: 10,
          category: "general",
          locale: "us",
          language: "en",
          sort: sortBy,
        },
      }),
    }),
  }),
});

export const { useGetNewsQuery, useGetLatestNewsQuery } = newsApi;