import { useTheme } from "@/app/providers/ThemeProvider";
import styles from "./styles.module.css";

interface Props {
  text?: string;
}

const PageLoader = ({ text = "Loading..." }: Props) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${styles.wrapper} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={styles.loaderCard}>
        <div className={styles.spinner} />
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
};

export default PageLoader;