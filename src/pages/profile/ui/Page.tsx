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
  const [nickname, setNickname] = useState("");
  const [draftNickname, setDraftNickname] = useState("");
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingNickname, setIsSavingNickname] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userId = session?.user?.id ?? null;
      const userEmail = session?.user?.email ?? null;

      setEmail(userEmail);

      if (!userId || !userEmail) {
        setIsLoading(false);
        return;
      }

      try {
        const [{ data: profileData, error: profileError }, favorites, history] =
          await Promise.all([
            supabase
              .from("profiles")
              .select("nickname")
              .eq("id", userId)
              .single(),
            getFavorites(),
            getHistory(),
          ]);

        if (profileError) {
          throw profileError;
        }

        setNickname(profileData?.nickname ?? "");
        setDraftNickname(profileData?.nickname ?? "");
        setFavoritesCount(favorites.length);
        setHistoryCount(history.length);
      } catch (loadError) {
        console.error("Failed to load profile stats:", loadError);
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

  const handleStartEdit = () => {
    setDraftNickname(nickname);
    setError("");
    setMessage("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraftNickname(nickname);
    setError("");
    setMessage("");
    setIsEditing(false);
  };

  const handleSaveNickname = async () => {
    setError("");
    setMessage("");
  
    const trimmedNickname = draftNickname.trim();
  
    if (trimmedNickname.length < 3) {
      setError("Nickname must be at least 3 characters long.");
      return;
    }
  
    try {
      setIsSavingNickname(true);
  
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      const userId = session?.user?.id;
      const userEmail = session?.user?.email;
  
      if (!userId || !userEmail) {
        setError("User is not authenticated.");
        return;
      }
  
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          email: userEmail,
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
      setMessage("Nickname updated successfully.");
    } catch (saveError) {
      console.error("Failed to update nickname:", saveError);
      setError("Failed to update nickname.");
    } finally {
      setIsSavingNickname(false);
    }
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
            {(nickname || email)[0].toUpperCase()}
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
          <span className={styles.label}>Nickname</span>

          {!isEditing ? (
            <div className={styles.profileRow}>
              <div className={styles.emailBadge}>
                <strong className={styles.email}>{nickname || "No nickname"}</strong>
              </div>

              <button
                type="button"
                onClick={handleStartEdit}
                className={styles.secondaryButton}
              >
                Edit
              </button>
            </div>
          ) : (
            <div className={styles.editBlock}>
              <input
                type="text"
                value={draftNickname}
                onChange={event => setDraftNickname(event.target.value)}
                className={styles.nicknameInput}
                placeholder="Enter nickname"
              />

              <div className={styles.editActions}>
                <button
                  type="button"
                  onClick={handleSaveNickname}
                  disabled={isSavingNickname}
                  className={styles.secondaryButton}
                >
                  {isSavingNickname ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className={styles.ghostButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {message ? <p className={styles.successText}>{message}</p> : null}
          {error ? <p className={styles.errorText}>{error}</p> : null}
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