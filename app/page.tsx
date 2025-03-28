import styles from './page.module.css';
// COMPONENTS	
import Header from './components/Header/Header';
import HomeContent from './components/Home/Home';
import Footer from './components/Footer/Footer';
export default function Home() {
	return (
		<div>
			<Header />
			<main className={styles.main}>
				<HomeContent />
			</main>
			<Footer />
		</div>
	);
}
