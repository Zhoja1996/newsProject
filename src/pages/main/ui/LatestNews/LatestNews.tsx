import { useGetLatestNewsQuery } from "@/entities/news/api/newsApi";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import styles from "./styles.module.css";

const LatestNews = () => {
  const { data, isLoading, isError } = useGetLatestNewsQuery();
  const navigateTo = useNavigateWithElement();

  if (isError) {
    return (
      <div className={styles.empty}>
        <h3>Failed to load latest news</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (!isLoading && (data?.news?.length ?? 0) === 0) {
    return (
      <div className={styles.empty}>
        <h3>No latest news</h3>
        <p>There are no latest news available right now.</p>
      </div>
    );
  }

  const latestNews = data?.news?.slice(0, 5) ?? [];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Latest</h2>
      </div>

      <div className={styles.list}>
        {latestNews.map(item => (
          <article
            key={item.id}
            className={styles.item}
            onClick={() => navigateTo(item)}
            role="button"
            tabIndex={0}
            onKeyDown={event => {
              if (event.key === "Enter" || event.key === " ") {
                navigateTo(item);
              }
            }}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className={styles.image}
              />
            )}

            <div className={styles.content}>
              <h3 className={styles.itemTitle}>{item.title}</h3>

              <div className={styles.meta}>
                <span>{item.publishedAt || "Recently"}</span>
                <span>{item.source || "Unknown source"}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
};

export default LatestNews;