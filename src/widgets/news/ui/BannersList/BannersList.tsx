import withSkeleton from "@/shared/hocs/withSkeleton";
import styles from "./styles.module.css";
import { INews, NewsBanner } from "@/entities/news";

interface Props {
    banners?: INews[] | null;
}

const BannersList = ({ banners }: Props) => {
    return (
        <ul className={styles.banners}>
            {banners?.map((banner) => {
            return <NewsBanner key={banner.id} item={banner} />;
            })}
        </ul>
    );
};

const BannersListWithSkeleton = withSkeleton<Props>(
    BannersList,
    "banner",
    10,
    "row"
);

export default BannersListWithSkeleton;