import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/shared/helpers/formatTimeAgo";
import { generateSummary } from "@/shared/helpers/generateSummary";
import { addFavorite, isFavorite, removeFavorite } from "@/shared/api/favoritesApi";
import { INews } from "../../model/types";
import Image from "@/shared/ui/Image/Image";
import styles from "./styles.module.css";

interface Props {
  item: INews;
}

const NewsDetails = ({ item }: Props) => {
  const [favorite, setFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const result = await isFavorite(item.id);
        setFavorite(result);
      } catch (error) {
        console.error("Failed to check favorite:", error);
      }
    };

    checkFavorite();
  }, [item.id]);

  const handleToggleFavorite = async () => {
    try {
      setIsLoadingFavorite(true);
      setMessage("");

      if (favorite) {
        await removeFavorite(item.id);
        setFavorite(false);
        setMessage("Removed from favorites.");
      } else {
        await addFavorite(item);
        setFavorite(true);
        setMessage("Saved to favorites.");
      }
    } catch (error) {
      console.error("Failed to update favorites:", error);
      setMessage("You need to log in to save favorites.");
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const { shortSummary, keyPoints } = generateSummary(
    item.title,
    item.description || ""
  );

  return (
    <div className={styles.details}>
      <div className={styles.mediaColumn}>
        <div className={styles.imageWrap}>
          <Image image={item.image} />
        </div>
      </div>

      <div className={styles.contentColumn}>
        <section className={styles.infoCard}>
          <p className={styles.descriptionText}>
            {item.description}{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={item.url}
              className={styles.readMore}
            >
              Read more
            </a>
          </p>

          <p className={styles.extra}>
            {formatTimeAgo(item.publishedAt)} by {item.source}
          </p>

          <div className={styles.actionsRow}>
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={isLoadingFavorite}
              className={styles.favoriteButton}
            >
              {isLoadingFavorite
                ? "Saving..."
                : favorite
                  ? "Remove from favorites"
                  : "Save to favorites"}
            </button>

            {message ? <p className={styles.message}>{message}</p> : null}
          </div>
        </section>

        <section className={styles.summaryBlock}>
          <h3 className={styles.summaryTitle}>Quick summary</h3>
          <p className={styles.summaryText}>{shortSummary}</p>

          <ul className={styles.pointsList}>
            {keyPoints.slice(0, 3).map(point => (
              <li key={point} className={styles.pointItem}>
                {point}
              </li>
            ))}
          </ul>
        </section>

        {item.categories.length > 0 ? (
          <div className={styles.categories}>
            {item.categories.map(category => (
              <span key={category} className={styles.active}>
                {category}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NewsDetails;