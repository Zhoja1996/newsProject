import React from "react";
import styles from "./styles.module.css";
import { useTheme } from "../../context/ThemeContext";

interface Props {
    keywords: string;
    setKeywords: (keywords: string) => void;
}

const Search = ({ keywords, setKeywords }: Props) => {

    const {isDarkMode} = useTheme();

    return (
        <div className={`${styles.search} ${isDarkMode ? styles.dark : styles.light}`}>
            <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className={styles.input}
            placeholder="Javascript"
            />
        </div>
    );
};

export default Search;