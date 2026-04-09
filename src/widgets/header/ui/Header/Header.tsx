import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/app/providers/ThemeProvider";
import { formatDate } from "@/shared/helpers/formatDate";
import ThemeButton from "@/features/theme/ui/ThemeButton/ThemeButton";
import { supabase } from "@/shared/api/supabaseClient";
import styles from "./styles.module.css";

const Header = () => {
  const { isDarkMode } = useTheme();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUserEmail(session?.user?.email ?? null);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
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
        {userEmail ? (
          <>
            <nav className={styles.nav}>
              <Link to="/profile" className={styles.navLink}>
                Profile
              </Link>
              <Link to="/favorites" className={styles.navLink}>
                Favorites
              </Link>
              <Link to="/history" className={styles.navLink}>
                History
              </Link>
            </nav>

            <span className={styles.userEmail}>{userEmail}</span>

            <button
              type="button"
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              Logout
            </button>
          </>
        ) : (
          <nav className={styles.nav}>
            <Link to="/login" className={styles.navLink}>
              Log in
            </Link>
            <Link to="/register" className={styles.navLink}>
              Register
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