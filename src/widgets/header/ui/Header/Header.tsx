import { useTheme } from "@/app/providers/ThemeProvider";
import { formatDate } from "@/shared/helpers/formatDate";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import ThemeButton from "@/features/theme/ui/ThemeButton/ThemeButton";

const Header = () => {

    const { isDarkMode } = useTheme();

    return (
        <header className={`${styles.header} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={styles.info}>
                <Link to="/">
                    <h1 className={styles.title}>NEWS REACTIFY</h1>
                </Link>

                <p className={styles.date}>{formatDate(new Date())}</p>
            </div>

            <ThemeButton/>
        </header>

    );
};

export default Header;