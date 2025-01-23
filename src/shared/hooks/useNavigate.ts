import { useAppDispatch } from "@/app/appStore";
import { INews } from "@/entities/news";
import { setCurrentNews } from "@/entities/news/model/newsSlice";
import { useNavigate } from "react-router-dom";

export const useNavigateWithElement = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const navigateTo = (news: INews) => {
        dispatch(setCurrentNews(news));
        navigate(`/news/${news.id}`);
    };

    return navigateTo;
};