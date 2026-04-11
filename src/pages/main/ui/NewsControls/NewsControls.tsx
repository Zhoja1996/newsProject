import styles from "./styles.module.css";

const categories = [
  "All",
  "General",
  "World",
  "Politics",
  "Business",
  "Technology",
];

interface Props {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const NewsControls = ({
  selectedCategory,
  onCategoryChange,
  searchValue,
  onSearchChange,
}: Props) => {
  return (
    <section className={styles.controls}>
      <div className={styles.tabs}>
        {categories.map(category => {
          const isActive = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              className={isActive ? `${styles.tab} ${styles.active}` : styles.tab}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className={styles.actions}>
        <label className={styles.search}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder="Search news..."
            className={styles.input}
            value={searchValue}
            onChange={event => onSearchChange(event.target.value)}
          />
        </label>
      </div>
    </section>
  );
};

export default NewsControls;