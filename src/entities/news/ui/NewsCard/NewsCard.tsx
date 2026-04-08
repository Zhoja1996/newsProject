import { ReactNode } from "react";
import { formatTimeAgo } from "@/shared/helpers/formatTimeAgo";
import Image from "@/shared/ui/Image/Image";
import { INews } from "../../model/types";
import styles from "./styles.module.css";

interface Props {
  item: INews;
  type: "banner" | "item";
  viewNewslot?: (news: INews) => ReactNode;
}

const NewsCard = ({ item, type = "item", viewNewslot }: Props) => {
  return (
    <li className={`${styles.card} ${type === "banner" ? styles.banner : ""}`}>
      {type === "banner" ? (
        <Image image={item.image} />
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

      {viewNewslot ? viewNewslot(item) : null}
    </li>
  );
};

export default NewsCard;