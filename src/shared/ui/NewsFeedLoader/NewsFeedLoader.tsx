import { useTheme } from "@/app/providers/ThemeProvider";
import styles from "./styles.module.css";

const NewsFeedLoader = () => {
  const { isDarkMode } = useTheme();

  return (
    <section className={`${styles.wrapper} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.titleSkeleton} />
          <div className={styles.badgeSkeleton} />
        </div>

        <div className={styles.progressTrack}>
          <div className={styles.progressBar} />
        </div>

        <p className={styles.loadingText}>Loading your news feed...</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.cardLarge}>
          <div className={styles.imageLarge} />
          <div className={styles.lineLg} />
          <div className={styles.lineMd} />
          <div className={styles.lineSm} />
        </div>

        <div className={styles.sideList}>
          {[1, 2, 3].map(item => (
            <div key={item} className={styles.cardRow}>
              <div className={styles.thumb} />
              <div className={styles.cardText}>
                <div className={styles.lineMd} />
                <div className={styles.lineSm} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsFeedLoader;