import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setNews } from '../model/newsSlice';
import { ParamsType } from '@/shared/interfaces';
import { NewsApiResponse } from '../model/types';

const BASE_URL = 'https://api.currentsapi.services/v1/';
const API_KEY = '02XXuM7rA-S7KfeHgFNdGH3yyoZeA8y11NoPk9v_q2Nrd6da';

export const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getNews: builder.query<NewsApiResponse, ParamsType>({
            keepUnusedDataFor: 0,
            query: (params) => {
                const {
                    page_number = 1,
                    page_size = 10,
                    category,
                    keywords,
                } = params || {};
                return {
                    url: 'search',
                    params: {
                        apiKey: API_KEY,
                        page_number,
                        page_size,
                        category,
                        keywords,
                    },
                }
            },
            async onQueryStarted(_arg, {dispatch, queryFulfilled}) {
                const result = await queryFulfilled;
                const data = result.data;

                dispatch(setNews(data.news))
            }
        }),
        getLatestNews: builder.query<NewsApiResponse, null>({
            query: () => {
                return {
                    url: 'latest-news',
                    params: {
                        apiKey: API_KEY,
                    },
                }
            },
        }),
    }),
})

export const { useGetNewsQuery, useGetLatestNewsQuery } = newsApi;