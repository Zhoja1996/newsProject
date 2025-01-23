import { INews, NewsCard } from "@/entities/news";
import withSkeleton from "@/shared/hocs/withSkeleton";
import styles from "./styles.module.css";
import { ReactNode } from "react";


interface Props {
    news?: INews[];
    type: 'banner' | 'item';
    direction?: 'row' | 'column';
    viewNewslot?: (news: INews) => ReactNode;
}

const NewsList = ({ news, type = 'item', viewNewslot }: Props) => {
    return (
        <ul className={`${type === 'item' ? styles.items : styles.banners}`}>
            {news?.map((item) => {
                return <NewsCard key={item.id} viewNewslot={viewNewslot} item={item} type={type}/>;
            })}
        </ul>
    );
};

const NewsListWithSkeleton = withSkeleton<Props>(NewsList, 10);

export default NewsListWithSkeleton;