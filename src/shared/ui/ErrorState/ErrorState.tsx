import { useTheme } from "@/app/providers/ThemeProvider";
import styles from "./styles.module.css";

interface Props {
  title: string;
  description: string;
}

const ErrorState = ({ title, description }: Props) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${styles.wrapper} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={styles.card}>
        <div className={styles.icon}>!</div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default ErrorState;