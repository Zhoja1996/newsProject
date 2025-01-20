import { useGetLatestNewsQuery } from "@/entities/news/api/newsApi";
import styles from "./styles.module.css";
import { BannersList } from "@/widgets/news/ui";

const LatestNews = () => {
    const { data, isLoading } = useGetLatestNewsQuery(null);

    return (
        <section className={styles.section}>
            <BannersList banners={data && data.news} isLoading={isLoading} />
        </section>
    );
};

export default LatestNews;