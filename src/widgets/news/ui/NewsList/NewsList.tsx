import { INews, NewsCard } from "@/entities/news";
import withSkeleton from "@/shared/hocs/withSkeleton";
import styles from "./styles.module.css";

interface Props {
  news?: INews[];
  type: "banner" | "item";
  direction?: "row" | "column";
  onItemClick?: (news: INews) => void;
}

const NewsList = ({ news, type = "item", onItemClick }: Props) => {
  return (
    <ul className={type === "item" ? styles.items : styles.banners}>
      {news?.map(item => {
        return (
          <NewsCard
            key={item.id}
            item={item}
            type={type}
            onClick={onItemClick}
          />
        );
      })}
    </ul>
  );
};

const NewsListWithSkeleton = withSkeleton<Props>(NewsList, 10);

export default NewsListWithSkeleton;