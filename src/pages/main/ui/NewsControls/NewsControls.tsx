import { useLanguage } from "@/app/providers/LanguageProvider";
import styles from "./styles.module.css";

const categories = [
  { key: "all", value: "All" },
  { key: "general", value: "general" },
  { key: "science", value: "science" },
  { key: "sports", value: "sports" },
  { key: "business", value: "business" },
  { key: "health", value: "health" },
  { key: "entertainment", value: "entertainment" },
  { key: "tech", value: "tech" },
  { key: "politics", value: "politics" },
  { key: "food", value: "food" },
  { key: "travel", value: "travel" },
] as const;

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
  const { t } = useLanguage();

  const categoryLabels = {
    all: t.main.all,
    general: t.main.general,
    science: t.main.science,
    sports: t.main.sports,
    business: t.main.business,
    health: t.main.health,
    entertainment: t.main.entertainment,
    tech: t.main.tech,
    politics: t.main.politics,
    food: t.main.food,
    travel: t.main.travel,
  };

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
              {categoryLabels[category.key]}
            </button>
          );
        })}
      </div>

      <div className={styles.actions}>
        <label className={styles.search}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder={t.main.searchPlaceholder}
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