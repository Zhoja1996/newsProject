import styles from "./styles.module.css";

const categories = [
  { label: "All", value: "All" },
  { label: "General", value: "general" },
  { label: "Science", value: "science" },
  { label: "Sports", value: "sports" },
  { label: "Business", value: "business" },
  { label: "Health", value: "health" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Tech", value: "tech" },
  { label: "Politics", value: "politics" },
  { label: "Food", value: "food" },
  { label: "Travel", value: "travel" },
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
          const isActive = category.value === selectedCategory;

          return (
            <button
              key={category.value}
              type="button"
              className={isActive ? `${styles.tab} ${styles.active}` : styles.tab}
              onClick={() => onCategoryChange(category.value)}
            >
              {category.label}
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