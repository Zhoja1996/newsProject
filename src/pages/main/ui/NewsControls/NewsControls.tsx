import styles from "./styles.module.css";

const categories = [
  "All",
  "General",
  "World",
  "Politics",
  "Business",
  "Technology",
];

const NewsControls = () => {
  return (
    <section className={styles.controls}>
      <div className={styles.tabs}>
        {categories.map(category => (
          <button
            key={category}
            type="button"
            className={
              category === "All" ? `${styles.tab} ${styles.active}` : styles.tab
            }
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <label className={styles.search}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder="Search news..."
            className={styles.input}
          />
        </label>

        <select className={styles.select} defaultValue="latest">
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Popular</option>
        </select>
      </div>
    </section>
  );
};

export default NewsControls;