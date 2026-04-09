import { useAppDispatch } from "@/app/appStore";
import { INews } from "@/entities/news";
import { setCurrentNews } from "@/entities/news/model/newsSlice";
import { addToHistory } from "@/shared/api/historyApi";
import { useNavigate } from "react-router-dom";

export const useNavigateWithElement = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navigateTo = async (news: INews) => {
    dispatch(setCurrentNews(news));

    try {
      await addToHistory(news);
    } catch (error) {
      console.error("Failed to save history:", error);
    }

    navigate(`/news/${news.id}`);
  };

  return navigateTo;
};