import { formatTimeAgo } from "@/shared/helpers/formatTimeAgo";
import { INews } from "../../model/types";
import Image from "@/shared/ui/Image/Image";
import styles from "./styles.module.css";

interface Props {
    item: INews;
}

const NewsDetails = ({item}: Props) => {
    return (
        <div className={styles.details}>

            <Image image={item.image} />

            <div className={styles.description}>
                <p>{item.description} ({item.language}) <a target="blank" href={item.url}>Read more...</a></p>
                <p className={styles.extra}>
                    {formatTimeAgo(item.published)} by {item.author}
                </p>

                <ul>{item.category.map((category) => {
                    return <button key={category} className={styles.active}>{category}</button>;
                })}</ul>
            </div>

        </div>
    );
};

export default NewsDetails;