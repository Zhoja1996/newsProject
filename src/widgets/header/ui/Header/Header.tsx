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
  const [nickname, setNickname] = useState<string | null>(
    localStorage.getItem("nickname")
  );

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const email = session?.user?.email ?? null;
      const userId = session?.user?.id ?? null;

      setUserEmail(email);

      if (!userId) {
        setNickname(null);
        localStorage.removeItem("nickname");
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Failed to load nickname:", error);
        return;
      }

      const loadedNickname = profileData?.nickname ?? null;
      setNickname(loadedNickname);

      if (loadedNickname) {
        localStorage.setItem("nickname", loadedNickname);
      }
    };

    loadUserData();

    const syncNickname = () => {
      setNickname(localStorage.getItem("nickname"));
    };

    window.addEventListener("nickname-changed", syncNickname);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const email = session?.user?.email ?? null;
      const userId = session?.user?.id ?? null;

      setUserEmail(email);

      if (!userId) {
        setNickname(null);
        localStorage.removeItem("nickname");
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Failed to load nickname:", error);
        return;
      }

      const loadedNickname = profileData?.nickname ?? null;
      setNickname(loadedNickname);

      if (loadedNickname) {
        localStorage.setItem("nickname", loadedNickname);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("nickname-changed", syncNickname);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("nickname");
      setUserEmail(null);
      setNickname(null);
    } catch (logoutError) {
      console.error("Failed to logout:", logoutError);
    }
  };

  const displayName = nickname || userEmail;

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

            <span className={styles.userEmail}>{displayName}</span>

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