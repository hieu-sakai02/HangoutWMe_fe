import styles from './Home.module.css';
// COMPONENTS
import Banner from './Banner/Banner';
import Preview from './Preview/Preview';


export default function HomeContent() {
    return (
        <main>
            <Banner />
            <Preview />
        </main>
    );
}
