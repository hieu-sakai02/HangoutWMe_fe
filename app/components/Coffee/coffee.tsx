'use client';

import { useState, useEffect } from 'react';
import styles from './coffee.module.css';
import { Search, Heart, Globe, Phone, Mail, MapPin, Plus, Filter, Star } from 'lucide-react';
import { CoffeeShop, getAllCoffeeShops } from '@/apis/coffeeShopService';
import { getFavoriteCoffeeShopsByUserId, updateFavoriteCoffeeShop, addFavoriteCoffeeShop } from '@/apis/favCoffeeShopService';
import AddCoffeeShop from './AddCoffeeShop/AddCoffeeShop';
import { useUser } from '@/app/context/UserContext';
import { ADDRESS } from '@/app/constant/CONST';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function Coffee() {
    const [searchTerm, setSearchTerm] = useState('');
    const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const { currentUser } = useUser();
    const [addressFilter, setAddressFilter] = useState({
        city: '',
        district: '',
        ward: '',
        street: ''
    });
    const [showAddressFilter, setShowAddressFilter] = useState(false);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    // Derived state for dropdowns
    const availableDistricts = addressFilter.city ? Object.keys(ADDRESS[addressFilter.city]) : [];
    const availableWards = addressFilter.district ?
        Object.keys(ADDRESS[addressFilter.city][addressFilter.district]) : [];
    const availableStreets = addressFilter.ward ?
        ADDRESS[addressFilter.city][addressFilter.district][addressFilter.ward].Streets : [];

    const handleAddressFilterChange = (field: 'city' | 'district' | 'ward' | 'street', value: string) => {
        const newFilter = { ...addressFilter };

        // Reset dependent fields when parent field changes
        switch (field) {
            case 'city':
                newFilter.city = value;
                newFilter.district = '';
                newFilter.ward = '';
                newFilter.street = '';
                break;
            case 'district':
                newFilter.district = value;
                newFilter.ward = '';
                newFilter.street = '';
                break;
            case 'ward':
                newFilter.ward = value;
                newFilter.street = '';
                break;
            case 'street':
                newFilter.street = value;
                break;
        }

        setAddressFilter(newFilter);
    };

    const clearAddressFilter = () => {
        setAddressFilter({
            city: '',
            district: '',
            ward: '',
            street: ''
        });
    };

    useEffect(() => {
        fetchCoffeeShops();
        if (currentUser) {
            fetchFavorites();
        }
    }, [currentUser]);

    const fetchCoffeeShops = async () => {
        try {
            setLoading(true);
            const response = await getAllCoffeeShops();
            if (Array.isArray(response.data)) {
                setCoffeeShops(response.data);
            }
        } catch (err) {
            setError('Failed to fetch coffee shops');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        if (!currentUser) return;
        try {
            const response = await getFavoriteCoffeeShopsByUserId(currentUser.id);
            if (Array.isArray(response.data)) {
                const favoriteIds = response.data.map(fav => fav.coffee_shop_id);
                setFavorites(favoriteIds);
            }
        } catch (err) {
            console.error('Failed to fetch favorites:', err);
        }
    };

    const toggleFavorite = async (shopId: number) => {
        if (!currentUser) {
            toast.error('Please login to add favorites');
            return;
        }

        try {
            const isFavorite = favorites.includes(shopId);
            if (isFavorite) {
                // Remove from favorites
                await updateFavoriteCoffeeShop(currentUser.id, shopId, false);
                setFavorites(prev => prev.filter(id => id !== shopId));
            } else {
                // Add to favorites
                await addFavoriteCoffeeShop({
                    user_id: currentUser.id,
                    coffee_shop_id: shopId
                });
                setFavorites(prev => [...prev, shopId]);
            }
        } catch (err) {
            console.error('Failed to update favorite:', err);
            toast.error('Failed to update favorite');
        }
    };

    const handleAddSuccess = () => {
        fetchCoffeeShops();
    };

    const sortedAndFilteredShops = coffeeShops
        // First filter by search term
        .filter(shop =>
            shop.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        // Then filter by address if filters are active
        .filter(shop => {
            if (addressFilter.city && shop.city !== addressFilter.city) return false;
            if (addressFilter.district && shop.district !== addressFilter.district) return false;
            if (addressFilter.ward && shop.ward !== addressFilter.ward) return false;
            if (addressFilter.street && shop.street !== addressFilter.street) return false;
            return true;
        })
        // Then filter favorites if the toggle is on
        .filter(shop => {
            if (showOnlyFavorites) return favorites.includes(shop.id);
            return true;
        })
        // Finally sort to put favorites at the top
        .sort((a, b) => {
            const aIsFavorite = favorites.includes(a.id);
            const bIsFavorite = favorites.includes(b.id);
            if (aIsFavorite && !bIsFavorite) return -1;
            if (!aIsFavorite && bIsFavorite) return 1;
            return 0;
        });

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    const formatAddress = (shop: CoffeeShop) => {
        const parts = [
            `${shop.houseNumber} ${shop.street ? shop.street : ''}`.trim(),
            shop.ward,
            shop.district,
            shop.city
        ].filter(Boolean);
        return parts.join(', ');
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loading}>Loading coffee shops...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Coffee Shops</h1>
                <p>Discover the best coffee shops around you</p>
                {currentUser && (
                    <button
                        className={styles.addButton}
                        onClick={() => setShowAddModal(true)}
                    >
                        <Plus size={20} />
                        Add Coffee Shop
                    </button>
                )}
            </div>

            <div className={styles.controls}>
                <div className={styles.searchAndFilter}>
                    <div className={styles.searchBar}>
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterButtons}>
                        {currentUser && (
                            <button
                                className={`${styles.filterButton} ${showOnlyFavorites ? styles.active : ''}`}
                                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                            >
                                <Heart size={20} />
                                {showOnlyFavorites ? 'Show All' : 'Show Favorites'}
                            </button>
                        )}

                        <button
                            className={`${styles.filterButton} ${showAddressFilter ? styles.active : ''}`}
                            onClick={() => setShowAddressFilter(!showAddressFilter)}
                        >
                            <Filter size={20} />
                            Address Filter
                        </button>
                    </div>
                </div>

                {showAddressFilter && (
                    <div className={styles.addressFilters}>
                        <div className={styles.addressFilterGrid}>
                            <div className={styles.filterGroup}>
                                <select
                                    value={addressFilter.city}
                                    onChange={(e) => handleAddressFilterChange('city', e.target.value)}
                                >
                                    <option value="">All Cities</option>
                                    {Object.keys(ADDRESS).map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.filterGroup}>
                                <select
                                    value={addressFilter.district}
                                    onChange={(e) => handleAddressFilterChange('district', e.target.value)}
                                    disabled={!addressFilter.city}
                                >
                                    <option value="">All Districts</option>
                                    {availableDistricts.map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.filterGroup}>
                                <select
                                    value={addressFilter.ward}
                                    onChange={(e) => handleAddressFilterChange('ward', e.target.value)}
                                    disabled={!addressFilter.district}
                                >
                                    <option value="">All Wards</option>
                                    {availableWards.map(ward => (
                                        <option key={ward} value={ward}>{ward}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.filterGroup}>
                                <select
                                    value={addressFilter.street}
                                    onChange={(e) => handleAddressFilterChange('street', e.target.value)}
                                    disabled={!addressFilter.ward}
                                >
                                    <option value="">All Streets</option>
                                    {availableStreets.map(street => (
                                        <option key={street} value={street}>{street}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            className={styles.clearFilterButton}
                            onClick={clearAddressFilter}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.grid}>
                {sortedAndFilteredShops.map((shop) => (
                    <div key={shop.id} className={styles.card}>
                        <div className={styles.imageContainer}>
                            <Link href={`/coffee/${shop.id}`}>
                                <img
                                    src={shop.thumbnail}
                                    alt={shop.name}
                                    className={styles.image}
                                />
                            </Link>
                            {currentUser && (
                                <button
                                    className={`${styles.favoriteButton} ${favorites.includes(shop.id) ? styles.active : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleFavorite(shop.id);
                                    }}
                                    aria-label={favorites.includes(shop.id) ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <Heart
                                        fill={favorites.includes(shop.id) ? "#ff0000" : "none"}
                                        color={favorites.includes(shop.id) ? "#ff0000" : "#ffffff"}
                                    />
                                </button>
                            )}
                            {favorites.includes(shop.id) && (
                                <div className={styles.favoriteTag}>
                                    <Heart size={14} fill="#ff0000" color="#ff0000" />
                                    Favorite
                                </div>
                            )}
                            <div className={styles.ratingTag}>
                                <Star size={14} fill="#FFD700" color="#FFD700" />
                                <span>{Number(shop.ratings_avg_rating).toFixed(1)}</span>
                            </div>
                        </div>
                        <Link href={`/coffee/${shop.id}`} className={styles.cardContent}>
                            <div className={styles.content}>
                                <h3>{shop.name}</h3>
                                <div className={styles.details}>
                                    <div className={styles.detail}>
                                        <MapPin size={16} />
                                        <span title={formatAddress(shop)}>
                                            {truncateText(formatAddress(shop), 35)}
                                        </span>
                                    </div>
                                    {shop.phone && (
                                        <div className={styles.detail}>
                                            <Phone size={16} />
                                            <span>{shop.phone}</span>
                                        </div>
                                    )}
                                    {shop.email && (
                                        <div className={styles.detail}>
                                            <Mail size={16} />
                                            <span>{shop.email}</span>
                                        </div>
                                    )}
                                    {shop.website && (
                                        <div className={styles.detail}>
                                            <Globe size={16} />
                                            <a
                                                href={shop.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.websiteLink}
                                            >
                                                Visit Website
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <p className={styles.description} title={shop.description}>
                                    {truncateText(shop.description, 100)}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <AddCoffeeShop
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={handleAddSuccess}
            />
        </div>
    );
}
