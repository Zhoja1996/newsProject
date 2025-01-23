import { useGetLatestNewsQuery } from "@/entities/news/api/newsApi";
import { NewsList } from "@/widgets/news";
import { INews } from "@/entities/news";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import styles from "./styles.module.css";

const LatestNews = () => {
    const { data, isLoading } = useGetLatestNewsQuery(null);

    const navigateTo = useNavigateWithElement();

    return (
        <section className={styles.section}>
            <NewsList 
                type='banner' 
                direction="row" 
                news={data && data.news} 
                isLoading={isLoading} 
                viewNewslot={(news : INews) => (
                    <p className="view" onClick={() => navigateTo(news)}>view more...</p>
                )}
            />
        </section>
    );
};

export default LatestNews;