import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { supabase } from "@/shared/api/supabaseClient";
import { getFavorites } from "@/shared/api/favoritesApi";
import { getHistory } from "@/shared/api/historyApi";
import PageLoader from "@/shared/ui/PageLoader/PageLoader";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";

const formatDate = (value: string | null) => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString();
};

const getTopSource = (history: Array<{ source?: string | null }>) => {
  const sourceMap = new Map<string, number>();

  history.forEach(item => {
    const source = item.source?.trim();

    if (!source) {
      return;
    }

    sourceMap.set(source, (sourceMap.get(source) ?? 0) + 1);
  });

  if (sourceMap.size === 0) {
    return "—";
  }

  return [...sourceMap.entries()].sort((a, b) => b[1] - a[1])[0][0];
};

const getViewedThisWeek = (history: Array<{ viewed_at?: string | null }>) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return history.filter(item => {
    if (!item.viewed_at) {
      return false;
    }

    return new Date(item.viewed_at) >= sevenDaysAgo;
  }).length;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { session, isAuthLoading } = useAuth();
  const { t } = useLanguage();

  const userId = session?.user?.id ?? null;
  const email = session?.user?.email ?? null;
  const fallbackCreatedAt = session?.user?.created_at ?? null;

  const [nickname, setNickname] = useState("");
  const [draftNickname, setDraftNickname] = useState("");
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  const [favoritesCount, setFavoritesCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [viewedThisWeek, setViewedThisWeek] = useState(0);
  const [topSource, setTopSource] = useState("—");

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingNickname, setIsSavingNickname] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!userId || !email) {
        setIsPageLoading(false);
        return;
      }

      try {
        const [{ data: profileData, error: profileError }, favorites, history] =
          await Promise.all([
            supabase
              .from("profiles")
              .select("nickname, created_at")
              .eq("id", userId)
              .maybeSingle(),
            getFavorites(userId),
            getHistory(userId),
          ]);

        if (!isMounted) return;

        if (profileError) {
          console.error("Failed to load profile:", profileError);
        }

        const loadedNickname =
          profileData?.nickname ?? localStorage.getItem("nickname") ?? "";

        setNickname(loadedNickname);
        setDraftNickname(loadedNickname);
        setCreatedAt(profileData?.created_at ?? fallbackCreatedAt);

        setFavoritesCount(favorites.length);
        setHistoryCount(history.length);
        setViewedThisWeek(getViewedThisWeek(history));
        setTopSource(getTopSource(history));
      } catch (loadError) {
        console.error("Failed to load profile page:", loadError);
      } finally {
        if (isMounted) {
          setIsPageLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [userId, email, fallbackCreatedAt]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut({ scope: "local" });
      localStorage.removeItem("nickname");
      navigate("/login");
    } catch (logoutError) {
      console.error("Failed to logout:", logoutError);
    }
  };

  const handleStartEdit = () => {
    setDraftNickname(nickname);
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraftNickname(nickname);
    setMessage("");
    setError("");
    setIsEditing(false);
  };

  const handleSaveNickname = async () => {
    setMessage("");
    setError("");

    const trimmedNickname = draftNickname.trim();

    if (trimmedNickname.length < 3) {
      setError(t.profile.nicknameTooShort);
      return;
    }

    if (!userId || !email) {
      setError(t.profile.userNotAuthenticated);
      return;
    }

    try {
      setIsSavingNickname(true);

      const { error: upsertError } = await supabase.from("profiles").upsert({
        id: userId,
        email,
        nickname: trimmedNickname,
      });

      if (upsertError) {
        setError(upsertError.message);
        return;
      }

      localStorage.setItem("nickname", trimmedNickname);
      window.dispatchEvent(new Event("nickname-changed"));

      setNickname(trimmedNickname);
      setDraftNickname(trimmedNickname);
      setIsEditing(false);
      setMessage(t.profile.nicknameUpdated);
    } catch (saveError) {
      console.error("Failed to update nickname:", saveError);
      setError(t.profile.updateFailed);
    } finally {
      setIsSavingNickname(false);
    }
  };

  const avatarLetter = useMemo(() => {
    return (nickname || email || "U")[0].toUpperCase();
  }, [nickname, email]);

  if (isAuthLoading || isPageLoading) {
    return <PageLoader text={t.profile.loading} />;
  }

  return (
    <main className={styles.wrapper}>
      <section className={`${styles.card} ${isDarkMode ? styles.dark : styles.light}`}>
        <div className={styles.hero}>
          <div className={styles.avatar}>{avatarLetter}</div>

          <div className={styles.heroText}>
            <p className={styles.overline}>{t.profile.personalAccount}</p>
            <h1 className={styles.title}>{t.profile.title}</h1>
            <p className={styles.subtitle}>{t.profile.subtitle}</p>
          </div>
        </div>

        <div className={styles.infoBlock}>
          <span className={styles.label}>{t.profile.nickname}</span>

          {!isEditing ? (
            <div className={styles.profileRow}>
              <div className={styles.emailBadge}>
                <strong className={styles.email}>
                  {nickname || t.profile.noNickname}
                </strong>
              </div>

              <button
                type="button"
                onClick={handleStartEdit}
                className={styles.secondaryButton}
              >
                {t.profile.edit}
              </button>
            </div>
          ) : (
            <div className={styles.editBlock}>
              <input
                type="text"
                value={draftNickname}
                onChange={event => setDraftNickname(event.target.value)}
                className={styles.nicknameInput}
                placeholder={t.profile.nickname}
              />

              <div className={styles.editActions}>
                <button
                  type="button"
                  onClick={handleSaveNickname}
                  disabled={isSavingNickname}
                  className={styles.secondaryButton}
                >
                  {isSavingNickname ? t.news.saving : t.profile.save}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className={styles.ghostButton}
                >
                  {t.profile.cancel}
                </button>
              </div>
            </div>
          )}

          {message ? <p className={styles.successText}>{message}</p> : null}
          {error ? <p className={styles.errorText}>{error}</p> : null}
        </div>

        <div className={styles.infoBlock}>
          <span className={styles.label}>{t.profile.signedInAs}</span>
          <div className={styles.emailBadge}>
            <strong className={styles.email}>{email}</strong>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{favoritesCount}</span>
            <span className={styles.statLabel}>{t.profile.savedFavorites}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statValue}>{historyCount}</span>
            <span className={styles.statLabel}>{t.profile.viewedArticles}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statValue}>{viewedThisWeek}</span>
            <span className={styles.statLabel}>{t.profile.viewedThisWeek}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statValueSmall}>{topSource}</span>
            <span className={styles.statLabel}>{t.profile.topSource}</span>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoPanel}>
            <span className={styles.infoPanelLabel}>{t.profile.accountCreated}</span>
            <strong className={styles.infoPanelValue}>{formatDate(createdAt)}</strong>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            {t.header.logout}
          </button>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;