import styles from './styles.module.css';

const Categories = ({categories, setSelectorCategory, selectedCategory}) => {
    return (
        <div className={styles.categories}>
            {categories.map(category => {
                return (
                    <button onClick={() => setSelectorCategory(category)} className={selectedCategory === category ? styles.active : styles.item} key={category}>
                        {category}
                    </button>
                )
            })}
        </div>
    )
};

export default Categories;