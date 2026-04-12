import { formatTimeAgo } from "@/shared/helpers/formatTimeAgo";
import Image from "@/shared/ui/Image/Image";
import { INews } from "../../model/types";
import styles from "./styles.module.css";

interface Props {
  item: INews;
  type: "banner" | "item";
  onClick?: (news: INews) => void;
}

const NewsCard = ({ item, type = "item", onClick }: Props) => {
  return (
    <li
      className={`${styles.card} ${type === "banner" ? styles.banner : styles.itemCard} ${
        onClick ? styles.clickable : ""
      }`}
      onClick={() => onClick?.(item)}
    >
      {type === "banner" ? (
        <div className={styles.bannerImage}>
          <Image image={item.image} />
        </div>
      ) : (
        <div
          className={styles.wrapper}
          style={{
            backgroundImage: item.image ? `url(${item.image})` : "none",
          }}
        />
      )}

      <div className={styles.info}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.extra}>
          {formatTimeAgo(item.publishedAt)} by {item.source}
        </p>
      </div>
    </li>
  );
};

export default NewsCard;