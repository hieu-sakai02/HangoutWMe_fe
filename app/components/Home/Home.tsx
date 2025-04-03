import styles from './Home.module.css';
// COMPONENTS
import Banner from './Banner/Banner';
import TopRated from './TopRated/TopRated';

export default function HomeContent() {
    return (
        <main>
            <Banner />
            <TopRated />
        </main>
    );
}
