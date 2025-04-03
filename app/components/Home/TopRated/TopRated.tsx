'use client';

import { useEffect, useState } from 'react';
import styles from './TopRated.module.css';
import { CoffeeShop, getTop10CoffeeShops } from '@/apis/coffeeShopService';
import { Star } from 'lucide-react';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function TopRated() {
    const [topShops, setTopShops] = useState<CoffeeShop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTopShops();
    }, []);

    const fetchTopShops = async () => {
        try {
            setLoading(true);
            const response = await getTop10CoffeeShops();
            if (Array.isArray(response.data)) {
                setTopShops(response.data);
            }
        } catch (err) {
            setError('Failed to fetch top coffee shops');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const settings = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    if (loading) {
        return (
            <section className={styles.topRated}>
                <h2>Top Rated Coffee Shops</h2>
                <div className={styles.loading}>Loading...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.topRated}>
                <h2>Top Rated Coffee Shops</h2>
                <div className={styles.error}>{error}</div>
            </section>
        );
    }

    return (
        <section className={styles.topRated}>
            <h2>Top Rated Coffee Shops</h2>
            <div className={styles.carouselContainer}>
                <Slider {...settings}>
                    {topShops.map((shop) => (
                        <div key={shop.id} className={styles.shopCard}>
                            <Link href={`/coffee/${shop.id}`}>
                                <div className={styles.imageWrapper}>
                                    <img src={shop.thumbnail} alt={shop.name} />
                                    <div className={styles.rating}>
                                        <Star size={16} fill="#FFD700" color="#FFD700" />
                                        <span>{Number(shop.average_rating).toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className={styles.shopInfo}>
                                    <h3>{shop.name}</h3>
                                    <p>{`${shop.district}, ${shop.city}`}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
} 