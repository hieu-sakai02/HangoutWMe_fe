'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CoffeeShop, getCoffeeShopsById } from '@/apis/coffeeShopService';
import styles from './page.module.css';
import { MapPin, Phone, Mail, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CoffeeShopDetail() {
    const params = useParams();
    const [coffeeShop, setCoffeeShop] = useState<CoffeeShop | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoffeeShop = async () => {
            try {
                setLoading(true);
                const response = await getCoffeeShopsById(Number(params.id));
                setCoffeeShop(response.data);
            } catch (err) {
                setError('Failed to fetch coffee shop details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchCoffeeShop();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading coffee shop details...</div>
            </div>
        );
    }

    if (error || !coffeeShop) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    {error || 'Coffee shop not found'}
                </div>
            </div>
        );
    }

    const formatAddress = () => {
        const parts = [
            coffeeShop.houseNumber,
            coffeeShop.street,
            coffeeShop.ward,
            coffeeShop.district,
            coffeeShop.city
        ].filter(Boolean);
        return parts.join(', ');
    };

    return (
        <main className={styles.container}>
            <Link href="/coffee" className={styles.backButton}>
                <ArrowLeft size={20} />
                Back to Coffee Shops
            </Link>

            <div className={styles.content}>
                <div className={styles.imageSection}>
                    <img
                        src={coffeeShop.thumbnail}
                        alt={coffeeShop.name}
                        className={styles.image}
                    />
                </div>

                <div className={styles.detailsSection}>
                    <h1 className={styles.title}>{coffeeShop.name}</h1>

                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <MapPin size={20} />
                            <span>{formatAddress()}</span>
                        </div>

                        {coffeeShop.phone && (
                            <div className={styles.infoItem}>
                                <Phone size={20} />
                                <span>{coffeeShop.phone}</span>
                            </div>
                        )}

                        {coffeeShop.email && (
                            <div className={styles.infoItem}>
                                <Mail size={20} />
                                <a href={`mailto:${coffeeShop.email}`}>
                                    {coffeeShop.email}
                                </a>
                            </div>
                        )}

                        {coffeeShop.website && (
                            <div className={styles.infoItem}>
                                <Globe size={20} />
                                <a
                                    href={coffeeShop.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Visit Website
                                </a>
                            </div>
                        )}
                    </div>

                    <div className={styles.description}>
                        <h2>About</h2>
                        <p>{coffeeShop.description}</p>
                    </div>
                </div>
            </div>
        </main>
    );
} 