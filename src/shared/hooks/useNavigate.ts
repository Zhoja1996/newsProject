import { useAppDispatch } from "@/app/appStore";
import { useAuth } from "@/app/providers/AuthProvider";
import { INews } from "@/entities/news";
import { setCurrentNews } from "@/entities/news/model/newsSlice";
import { addToHistory } from "@/shared/api/historyApi";
import { useNavigate } from "react-router-dom";

export const useNavigateWithElement = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { session } = useAuth();

  const userId = session?.user?.id ?? null;

  const navigateTo = async (news: INews) => {
    dispatch(setCurrentNews(news));
    localStorage.setItem(`currentNews:${news.id}`, JSON.stringify(news));

    if (userId) {
      try {
        await addToHistory(userId, news);
      } catch (error) {
        console.error("Failed to save history:", error);
      }
    }

    navigate(`/news/${news.id}`);
  };

  return navigateTo;
};