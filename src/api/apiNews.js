/* eslint-disable no-unused-vars */
import axios from "axios";

const BASE_URL = import.meta.env.VITE_NEWS_BASE_API_URL;
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export const getNews = async ({
    page_number = 1,
    page_size = 10,
    category, 
    keywords    
    }) => {
    try {
        const response = await axios.get(`${BASE_URL}search`, {
            params: {
                apiKey: API_KEY,
                page_number,
                page_size,
                category,
                keywords
            }
        })  

        const data = response.data;
        const filteredNews = data.news.filter(item => item.image !== "None");

        return { ...data, news: filteredNews };
        
    } catch (error) {
        console.log(error);
    }
}

export const getLatestNews = async (page_number = 1, page_size = 10) => {
    try {
        const response = await axios.get(`${BASE_URL}latest-news`, {
            params: {
                apiKey: API_KEY,
            }
        })

        const data = response.data;
        const filteredNews = data.news.filter(item => item.image !== "None");

        return { ...data, news: filteredNews };
        
    } catch (error) {
        console.log(error);
    }
}

export const getСategories = async (page_number = 1, page_size = 10) => {
    try {
        const response = await axios.get(`${BASE_URL}available/categories`, {
            params: {
                apiKey: API_KEY,
            }
        })

        return response.data;
        
    } catch (error) {
        console.log(error);
    }
}