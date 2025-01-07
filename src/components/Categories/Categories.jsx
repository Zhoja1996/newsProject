import { forwardRef } from 'react';
import styles from './styles.module.css';

const Categories = forwardRef(({categories, setSelectorCategory, selectedCategory}, ref) => {
    return (
        <div ref={ref} className={styles.categories}>
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
});

Categories.displayName = 'Categories';

export default Categories;