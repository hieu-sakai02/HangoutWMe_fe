'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CoffeeShop, getCoffeeShopsById } from '@/apis/coffeeShopService';
import { Rating as RatingType, getCoffeeShopRatings } from '@/apis/ratingCoffeeShopService';
import styles from './page.module.css';
import { MapPin, Phone, Mail, Globe, ArrowLeft, Coffee, Car, Dog, Wifi, Cake, Sun, Home, Moon, Clock, Edit2 } from 'lucide-react';
import Link from 'next/link';
import Rating from '@/app/components/Rating/Rating';
import ImageGallery from '@/app/components/ImageGallery/ImageGallery';
import { useUser } from '@/app/context/UserContext';
import EditCoffeeShop from '@/app/components/Coffee/EditCoffeeShop/EditCoffeeShop';

export default function CoffeeShopDetail() {
    const params = useParams();
    const [coffeeShop, setCoffeeShop] = useState<CoffeeShop | null>(null);
    const [ratings, setRatings] = useState<RatingType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useUser();
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [shopResponse, ratingsResponse] = await Promise.all([
                getCoffeeShopsById(Number(params.id)),
                getCoffeeShopRatings(Number(params.id))
            ]);

            setCoffeeShop(shopResponse.data);
            setRatings(ratingsResponse.data as RatingType[]);
        } catch (err) {
            setError('Failed to fetch coffee shop details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchData();
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

    const formatTime = (time: string | undefined) => {
        if (!time) return '';
        return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <Link href="/coffee" className={styles.backButton}>
                    <ArrowLeft size={20} />
                    Back to Coffee Shops
                </Link>

                {currentUser && (
                    <button
                        className={styles.editButton}
                        onClick={() => setShowEditModal(true)}
                    >
                        <Edit2 size={20} />
                        Edit Coffee Shop
                    </button>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.leftSection}>
                    <div className={styles.imageSection}>
                        <img
                            src={coffeeShop.thumbnail}
                            alt={coffeeShop.name}
                            className={styles.image}
                        />
                    </div>

                    <ImageGallery
                        coffeeShopId={coffeeShop.id}
                        initialImages={coffeeShop.pictures || []}
                        onUpdate={fetchData}
                    />
                </div>

                <div className={styles.detailsSection}>
                    <h1 className={styles.title}>{coffeeShop.name}</h1>

                    {/* Operating Hours */}
                    {(coffeeShop.openTime || coffeeShop.closeTime) && (
                        <div className={styles.operatingHours}>
                            <Clock size={20} />
                            <span>
                                {coffeeShop.openTime && coffeeShop.closeTime
                                    ? `${formatTime(coffeeShop.openTime)} - ${formatTime(coffeeShop.closeTime)}`
                                    : coffeeShop.openTime
                                        ? `Opens at ${formatTime(coffeeShop.openTime)}`
                                        : `Closes at ${formatTime(coffeeShop.closeTime)}`
                                }
                                {coffeeShop.overNight && ' (Open Overnight)'}
                            </span>
                        </div>
                    )}

                    {/* Features Grid */}
                    <div className={styles.featuresGrid}>
                        {coffeeShop.wifi && (
                            <div className={styles.feature}>
                                <Wifi size={20} />
                                <span>WiFi Available</span>
                                {coffeeShop.wifi !== 'true' && (
                                    <span className={styles.featureDetail}>{coffeeShop.wifi}</span>
                                )}
                            </div>
                        )}

                        {coffeeShop.cake && (
                            <div className={styles.feature}>
                                <Cake size={20} />
                                <span>Cake Available</span>
                            </div>
                        )}

                        {coffeeShop.carPark && (
                            <div className={styles.feature}>
                                <Car size={20} />
                                <span>Car Parking</span>
                            </div>
                        )}

                        {coffeeShop.petFriendly && (
                            <div className={styles.feature}>
                                <Dog size={20} />
                                <span>Pet Friendly</span>
                            </div>
                        )}

                        {coffeeShop.outdoorSeating && (
                            <div className={styles.feature}>
                                <Sun size={20} />
                                <span>Outdoor Seating</span>
                            </div>
                        )}

                        {coffeeShop.indoorSeating && (
                            <div className={styles.feature}>
                                <Home size={20} />
                                <span>Indoor Seating</span>
                            </div>
                        )}
                    </div>

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

            <Rating
                coffeeShopId={coffeeShop.id}
                ratings={ratings}
                onRatingUpdate={fetchData}
            />

            {showEditModal && coffeeShop && (
                <EditCoffeeShop
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={fetchData}
                    coffeeShop={coffeeShop}
                />
            )}
        </main>
    );
} 