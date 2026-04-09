import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTheme } from "@/app/providers/ThemeProvider";
import { supabase } from "@/shared/api/supabaseClient";
import { getFavorites } from "@/shared/api/favoritesApi";
import { getHistory } from "@/shared/api/historyApi";
import styles from "./styles.module.css";

const ProfilePage = () => {
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState<string | null>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userEmail = session?.user?.email ?? null;
      setEmail(userEmail);

      if (!userEmail) {
        setIsLoading(false);
        return;
      }

      try {
        const favorites = await getFavorites();
        const history = await getHistory();

        setFavoritesCount(favorites.length);
        setHistoryCount(history.length);
      } catch (error) {
        console.error("Failed to load profile stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setEmail(null);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className={styles.wrapper}>
      <section className={`${styles.card} ${isDarkMode ? styles.dark : styles.light}`}>
        <div className={styles.hero}>
        <div className={styles.avatar}>
  {email ? email[0].toUpperCase() : "U"}
</div>

          <div className={styles.heroText}>
            <p className={styles.overline}>Personal account</p>
            <h1 className={styles.title}>Profile</h1>
            <p className={styles.subtitle}>
              Manage your saved news and track what you’ve already read.
            </p>
          </div>
        </div>

        <div className={styles.infoBlock}>
          <span className={styles.label}>Signed in as</span>
          <div className={styles.emailBadge}>
            <strong className={styles.email}>{email}</strong>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{favoritesCount}</span>
            <span className={styles.statLabel}>Saved favorites</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statValue}>{historyCount}</span>
            <span className={styles.statLabel}>Viewed articles</span>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;