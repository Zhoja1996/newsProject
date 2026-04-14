import { useEffect, useState } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { getFavorites, removeFavorite } from "@/shared/api/favoritesApi";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import { INews, NewsCard } from "@/entities/news";
import EmptyState from "@/shared/ui/EmptyState/EmptyState";
import ErrorState from "@/shared/ui/ErrorState/ErrorState";
import PageLoader from "@/shared/ui/PageLoader/PageLoader";
import styles from "./styles.module.css";

const FavoritesPage = () => {
  const { isDarkMode } = useTheme();
  const { session } = useAuth();
  const navigateTo = useNavigateWithElement();

  const userId = session?.user?.id ?? null;

  const [favorites, setFavorites] = useState<INews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      if (!userId) {
        setIsLoading(false);
        setIsFavoritesLoading(false);
        return;
      }

      try {
        const favoritesData = await getFavorites(userId);

        const mappedFavorites: INews[] = favoritesData.map(item => ({
          id: item.news_id,
          title: item.title,
          description: item.description ?? "",
          image: item.image,
          source: item.source ?? "",
          categories: [],
          publishedAt: item.published_at ?? "",
          url: item.url,
        }));

        setFavorites(mappedFavorites);
      } catch (error) {
        console.error("Failed to load favorites:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
        setIsFavoritesLoading(false);
      }
    };

    loadPage();
  }, [userId]);

  const handleRemoveFavorite = async (
    event: React.MouseEvent<HTMLButtonElement>,
    newsId: string
  ) => {
    event.stopPropagation();

    if (!userId) {
      return;
    }

    try {
      await removeFavorite(userId, newsId);
      setFavorites(prev => prev.filter(item => item.id !== newsId));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading favorites..." />;
  }

  return (
    <main className={styles.wrapper}>
      <section className={`${styles.card} ${isDarkMode ? styles.dark : styles.light}`}>
        <h1 className={styles.title}>Favorites</h1>

        {isError ? (
          <ErrorState
            title="Failed to load favorites"
            description="Please try again later."
          />
        ) : favorites.length === 0 && !isFavoritesLoading ? (
          <EmptyState
            title="No favorites yet"
            description="Save articles to keep them here."
          />
        ) : (
          <ul className={styles.list}>
            {favorites.map(news => (
              <li key={news.id} className={styles.item}>
                <NewsCard item={news} type="item" onClick={navigateTo} />
                <button
                  type="button"
                  onClick={event => handleRemoveFavorite(event, news.id)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default FavoritesPage;