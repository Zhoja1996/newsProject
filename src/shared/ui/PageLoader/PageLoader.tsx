import { useTheme } from "@/app/providers/ThemeProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";
import styles from "./styles.module.css";

interface Props {
  text?: string;
}

const PageLoader = ({ text }: Props) => {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`${styles.wrapper} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={styles.loaderCard}>
        <div className={styles.spinner} />
        <p className={styles.text}>{text ?? t.common.loading}</p>
      </div>
    </div>
  );
};

export default PageLoader;