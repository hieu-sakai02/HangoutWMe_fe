'use client';

import { useState } from 'react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import styles from './Rating.module.css';
import { Rating as RatingType, createRating, updateRating, deleteRating } from '@/apis/ratingCoffeeShopService';
import { useUser } from '@/app/context/UserContext';
import { toast } from 'react-toastify';

interface RatingProps {
    coffeeShopId: number;
    ratings: RatingType[];
    onRatingUpdate: () => void;
}

export default function Rating({ coffeeShopId, ratings, onRatingUpdate }: RatingProps) {
    const { currentUser } = useUser();
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);

    const userRating = currentUser
        ? ratings.find(r => r.user_id === currentUser.id)
        : null;

    const averageRating = ratings.length
        ? (ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1)
        : '0.0';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            if (userRating) {
                await updateRating(userRating.id, { rating, comment });
            } else {
                await createRating({
                    user_id: currentUser.id,
                    coffee_shop_id: coffeeShopId,
                    rating,
                    comment
                });
            }
            setShowRatingForm(false);
            setComment('');
            onRatingUpdate();
        } catch (error) {
            console.error('Failed to submit rating:', error);
            toast.error('Failed to submit rating');
        }
    };

    const handleDelete = async (ratingId: number) => {
        try {
            await deleteRating(ratingId);
            onRatingUpdate();
        } catch (error) {
            console.error('Failed to delete rating:', error);
            toast.error('Failed to delete rating');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.averageRating}>
                    <h2>Reviews</h2>
                    <div className={styles.ratingStats}>
                        <div className={styles.bigStar}>
                            <Star size={24} fill="#FFD700" color="#FFD700" />
                            <span>{averageRating}</span>
                        </div>
                        <span className={styles.totalReviews}>
                            ({ratings.length} reviews)
                        </span>
                    </div>
                </div>
                {currentUser && !userRating && !showRatingForm && (
                    <button
                        className={styles.addReviewButton}
                        onClick={() => setShowRatingForm(true)}
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {showRatingForm && (
                <form onSubmit={handleSubmit} className={styles.ratingForm}>
                    <div className={styles.starRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={24}
                                fill={star <= (hoveredStar || rating) ? "#FFD700" : "none"}
                                color={star <= (hoveredStar || rating) ? "#FFD700" : "#ccc"}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                onClick={() => setRating(star)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review..."
                        required
                    />
                    <div className={styles.formButtons}>
                        <button type="button" onClick={() => setShowRatingForm(false)}>
                            Cancel
                        </button>
                        <button type="submit">
                            Submit Review
                        </button>
                    </div>
                </form>
            )}

            <div className={styles.reviewsList}>
                {ratings.map((review) => (
                    <div key={review.id} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                            <div className={styles.userInfo}>
                                <img
                                    src={review.user?.avatar || '/images/defaultAvatar.png'}
                                    alt={review.user?.name}
                                    className={styles.userAvatar}
                                />
                                <span className={styles.userName}>{review.user?.name}</span>
                            </div>
                            <div className={styles.reviewActions}>
                                <div className={styles.stars}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill={i < review.rating ? "#FFD700" : "none"}
                                            color={i < review.rating ? "#FFD700" : "#ccc"}
                                        />
                                    ))}
                                </div>
                                {currentUser?.id === review.user_id && (
                                    <div className={styles.reviewButtons}>
                                        <button
                                            onClick={() => {
                                                setRating(review.rating);
                                                setComment(review.comment);
                                                setShowRatingForm(true);
                                            }}
                                            className={styles.editButton}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className={styles.deleteButton}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className={styles.reviewComment}>{review.comment}</p>
                        <span className={styles.reviewDate}>
                            {new Date(review.created_at!).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
} 