import styles from './Banner.module.css';

export default function Banner() {
    return (
        <div className={styles.banner}>
            <div className={styles.bannerContent}>
                <h1>Discover exciting places to hang out & invite friends!</h1>
                <p>Join our community today.</p>
                <button className={styles.getStarted}>GET STARTED</button>
            </div>
            <div className={styles.bannerImage}>
                <img src="/images/banner.jpg" alt="People celebrating and having fun" />
            </div>
        </div>
    );
}
