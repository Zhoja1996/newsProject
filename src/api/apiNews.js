import axios from "axios";

const BASE_URL = "https://api.currentsapi.services/v1/";
const API_KEY = "02XXuM7rA-S7KfeHgFNdGH3yyoZeA8y11NoPk9v_q2Nrd6da"; // 👈 вставь сюда свой ключ

export const getNews = async ({
  page_number = 1,
  page_size = 10,
  category,
  keywords = "news"
}) => {
  try {
    const response = await axios.get(`${BASE_URL}search`, {
      params: {
        apiKey: API_KEY,
        page_number,
        page_size,
        ...(category && { category }),
        ...(keywords && { keywords })
      }
    });

    return response.data;

  } catch (error) {
    console.log("GET NEWS ERROR:", error);
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}available/categories`, {
      params: {
        apiKey: API_KEY,
      }
    });

    return response.data;

  } catch (error) {
    console.log("GET CATEGORIES ERROR:", error);
  }
};