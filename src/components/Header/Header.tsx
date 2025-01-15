import React from "react";
import { formatDate } from "../../helpers/formatDate";
import { themeIcons } from "../../assets";
import { useTheme } from "../../context/ThemeContext";
import styles from "./styles.module.css";

const Header = () => {

    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <header className={`${styles.header} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={styles.info}>
                <h1 className={styles.title}>NEWS REACTIFY</h1>
                <p className={styles.date}>{formatDate(new Date())}</p>
            </div>

            <img src={isDarkMode ? themeIcons.light : themeIcons.dark} width={30} alt='theme' onClick={toggleTheme}/>
        </header>
    );
};

export default Header;