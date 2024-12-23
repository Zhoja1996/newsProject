import styles from './styles.module.css';

const Categories = ({categories, setSelectorCategory, selectedCategory}) => {
    return (
        <div className={styles.categories}>

        <button 
        onClick={() => setSelectorCategory(null)} 
        className={!selectedCategory ? styles.active : styles.item}>
            All
        </button>

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