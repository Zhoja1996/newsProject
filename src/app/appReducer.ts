import { newsApi } from "@/entities/news/api/newsApi";
import { combineReducers } from "@reduxjs/toolkit";
import { categoriesApi } from "@/entities/category/api/categoriesApi";
import newsReducer from "@/entities/news/model/newsSlice";


export const rootReducer = combineReducers({
    news: newsReducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
})