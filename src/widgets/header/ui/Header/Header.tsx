import { Link } from "react-router-dom";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { formatDate } from "@/shared/helpers/formatDate";
import ThemeButton from "@/features/theme/ui/ThemeButton/ThemeButton";
import { supabase } from "@/shared/api/supabaseClient";
import styles from "./styles.module.css";

const Header = () => {
  const { isDarkMode } = useTheme();
  const { session, isAuthLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const email = session?.user?.email ?? null;
  const displayName = localStorage.getItem("nickname") || email;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut({ scope: "local" });
      localStorage.removeItem("nickname");
      window.location.href = "/login";
    } catch (logoutError) {
      console.error("Failed to logout:", logoutError);
    }
  };

  return (
    <header className={`${styles.header} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={styles.left}>
        <Link to="/" className={styles.logoLink}>
          <h1 className={styles.title}>NEWS REACTIFY</h1>
        </Link>

        <p className={styles.date}>{formatDate(new Date())}</p>
      </div>

      <div className={styles.right}>
        <div className={styles.languageSwitch}>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`${styles.languageButton} ${language === "en" ? styles.activeLanguage : ""}`}
          >
            EN
          </button>

          <button
            type="button"
            onClick={() => setLanguage("uk")}
            className={`${styles.languageButton} ${language === "uk" ? styles.activeLanguage : ""}`}
          >
            UA
          </button>
        </div>

        {isAuthLoading ? null : email ? (
          <>
            <nav className={styles.nav}>
              <Link to="/profile" className={styles.navLink}>
                {t.header.profile}
              </Link>
              <Link to="/favorites" className={styles.navLink}>
                {t.header.favorites}
              </Link>
              <Link to="/history" className={styles.navLink}>
                {t.header.history}
              </Link>
            </nav>

            <span className={styles.userEmail}>{displayName}</span>

            <button
              type="button"
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              {t.header.logout}
            </button>
          </>
        ) : (
          <nav className={styles.nav}>
            <Link to="/login" className={styles.navLink}>
              {t.header.login}
            </Link>
            <Link to="/register" className={styles.navLink}>
              {t.header.register}
            </Link>
          </nav>
        )}

        <div className={styles.themeWrap}>
          <ThemeButton />
        </div>
      </div>
    </header>
  );
};

export default Header;