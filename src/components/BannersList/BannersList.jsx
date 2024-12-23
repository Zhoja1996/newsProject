import styles from './styles.module.css';
import withSkeleton from '../../helpers/hocs/withSkeleton';
import NewsBanner from '../NewsBanner/NewsBanner';

const BannersList = ({banners}) => {
    return (
        <div className={styles.banner}>
            <ul className={styles.banners}>
                {banners?.map(banner => {
                    return (
                        <NewsBanner key={banner.id} item={banner}/>
                    )
                })}
            </ul>
        </div>
    )
};

const BannersListWithSkeleton = withSkeleton(BannersList, 'banner', 6, 'row');

export default BannersListWithSkeleton;