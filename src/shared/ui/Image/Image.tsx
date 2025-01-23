import { IMAGE_FAIL } from "@/shared/constants/constants";
import styles from "./styles.module.css";

interface Props {
    image: string;
}

const Image = ({ image }: Props) => {
return (
    <div className={styles.wrapper}>
        {image !='None' ? <img src={image} alt="news" className={styles.image} /> : <img src={IMAGE_FAIL} alt="news" className={styles.image} />}
    </div>
);
};

export default Image;