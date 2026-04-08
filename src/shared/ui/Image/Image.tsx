import { IMAGE_FAIL } from "@/shared/constants/constants";
import styles from "./styles.module.css";

interface Props {
  image: string | null;
}

const Image = ({ image }: Props) => {
  const imageSrc = image && image.trim() ? image : IMAGE_FAIL;

  return (
    <div className={styles.wrapper}>
      <img src={imageSrc} alt="news" className={styles.image} />
    </div>
  );
};

export default Image;