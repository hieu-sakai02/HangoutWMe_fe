'use client';

import { useUser } from '@/app/context/UserContext';
import styles from './page.module.css';
// COMPONENTS
import Coffee from '../components/Coffee/coffee';

export default function CoffeePage() {
    const { currentUser } = useUser();

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Coffee />
            </div>
        </main>
    );
}
