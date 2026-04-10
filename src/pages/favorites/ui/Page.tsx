import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTheme } from "@/app/providers/ThemeProvider";
import { getFavorites, removeFavorite } from "@/shared/api/favoritesApi";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import { INews, NewsCard } from "@/entities/news";
import { supabase } from "@/shared/api/supabaseClient";
import styles from "./styles.module.css";
import PageLoader from "@/shared/ui/PageLoader/PageLoader";

const FavoritesPage = () => {
  const { isDarkMode } = useTheme();
  const navigateTo = useNavigateWithElement();

  const [email, setEmail] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<INews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const userEmail = session?.user?.email ?? null;
        setEmail(userEmail);

        if (!userEmail) {
          setIsLoading(false);
          setIsFavoritesLoading(false);
          return;
        }

        const favoritesData = await getFavorites();

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
  }, []);

  const handleRemoveFavorite = async (
    event: React.MouseEvent<HTMLButtonElement>,
    newsId: string
  ) => {
    event.stopPropagation();

    try {
      await removeFavorite(newsId);
      setFavorites(prev => prev.filter(item => item.id !== newsId));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading profile..." />;
  }

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className={styles.wrapper}>
      <section className={`${styles.card} ${isDarkMode ? styles.dark : styles.light}`}>
        <h1 className={styles.title}>Favorites</h1>

        {isError ? (
          <p className={styles.text}>Failed to load favorites.</p>
        ) : favorites.length === 0 && !isFavoritesLoading ? (
          <p className={styles.text}>You have no saved news yet.</p>
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