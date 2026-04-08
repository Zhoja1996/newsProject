import { useTheme } from "@/app/providers/ThemeProvider";
import styles from "./styles.module.css";

interface Props {
  keywords: string;
  setKeywords: (keywords: string) => void;
}

const Search = ({ keywords, setKeywords }: Props) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${styles.search} ${isDarkMode ? styles.dark : styles.light}`}>
      <input
        type="text"
        value={keywords}
        onChange={e => setKeywords(e.target.value)}
        className={styles.input}
        placeholder="Search news by keyword..."
      />

      {keywords.trim() ? (
        <button
          type="button"
          onClick={() => setKeywords("")}
          className={styles.clear}
          aria-label="Clear search"
        >
          ×
        </button>
      ) : null}
    </div>
  );
};

export default Search;