import styles from './Footer.module.css';
import { Instagram, Twitter, Music } from 'lucide-react';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <h3>HangoutInv</h3>
                    <div className={styles.connect}>
                        <p>Connect</p>
                        <div className={styles.socialIcons}>
                            <a href="#" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" aria-label="Twitter" className="twitter">
                                <Twitter size={20} fill="#030303" />
                            </a>
                            <a href="#" aria-label="Music" className="music">
                                <Music size={20} strokeWidth={3} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.footerSection}>
                    <h4>Company Info</h4>
                    <ul>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Privacy</a></li>
                        <li><a href="#">Terms</a></li>
                    </ul>
                </div>

                <div className={styles.footerSection}>
                    <h4>Socialize</h4>
                    <ul>
                        <li><a href="#">Categories Users</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>

                <div className={styles.footerSection}>
                    <h4>App</h4>
                    <ul>
                        <li><a href="#">Help Questions</a></li>
                        <li><a href="#">App</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
