import { useGetLatestNewsQuery } from "@/entities/news/api/newsApi";
import { NewsList } from "@/widgets/news";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import styles from "./styles.module.css";

const LatestNews = () => {
  const { data, isLoading, isError } = useGetLatestNewsQuery();
  const navigateTo = useNavigateWithElement();

  if (isError) {
    return (
      <section className={styles.section}>
        <div className={styles.empty}>
          <h3>Failed to load latest news</h3>
          <p>Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!isLoading && (data?.news?.length ?? 0) === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.empty}>
          <h3>No latest news</h3>
          <p>There are no latest news available right now.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <NewsList
        type="banner"
        direction="row"
        news={data?.news ?? []}
        isLoading={isLoading}
        onItemClick={navigateTo}
      />
    </section>
  );
};

export default LatestNews;