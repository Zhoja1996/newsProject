import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/shared/helpers/formatTimeAgo";
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

  return (
    <div className={styles.details}>
      <Image image={item.image} />

      <div className={styles.description}>
        <p>
          {item.description}{" "}
          <a target="_blank" rel="noreferrer" href={item.url}>
            Read more...
          </a>
        </p>

        <p className={styles.extra}>
          {formatTimeAgo(item.publishedAt)} by {item.source}
        </p>

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

        <ul>
          {item.categories.map(category => {
            return (
              <button key={category} className={styles.active}>
                {category}
              </button>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default NewsDetails;