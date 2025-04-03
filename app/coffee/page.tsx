'use client';

import { useUser } from '@/app/context/UserContext';
import styles from './page.module.css';
// COMPONENTS
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Coffee from '../components/Coffee/coffee';

export default function CoffeePage() {
    const { currentUser } = useUser();

    return (
        <main className={styles.main}>
            <Header />
            <div className={styles.container}>
                <Coffee />
            </div>
            <Footer />
        </main>
    );
}
