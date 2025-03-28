'use client';
import styles from './Preview.module.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const spots = [
    {
        id: 1,
        image: '/images/location_1.jpg',
        title: 'Hangout Crew',
        description: 'Live, Eat, Travel',
    },
    {
        id: 2,
        image: '/images/location_2.jpg',
        title: 'Chill & Relax',
        description: 'Relaxation Hub',
    },
    {
        id: 3,
        image: '/images/location_3.jpg',
        title: 'Fun Times Ahead',
        description: 'Joyful Moments',
    },
    {
        id: 4,
        image: '/images/location_4.jpg',
        title: 'All About Fun',
        description: 'Daily Excitement',
    },
    {
        id: 5,
        image: '/images/location_5.jpg',
        title: 'Now is the Time!',
        description: 'Work Hard, Play',
    },
    {
        id: 6,
        image: '/images/location_6.jpg',
        title: 'Now is the Time!',
        description: 'Work Hard, Play',
    }
];

export default function Preview() {
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
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

    return (
        <section className={styles.preview}>
            <h2>Explore Trending Hangout Spots</h2>
            <div className={styles.carouselContainer}>
                <Slider {...settings}>
                    {spots.map((spot) => (
                        <div key={spot.id} className={styles.spotCard}>
                            <div className={styles.imageWrapper}>
                                <img src={spot.image} alt={spot.title} />
                            </div>
                            <div className={styles.spotInfo}>
                                <h3>{spot.title}</h3>
                                <p>{spot.description}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}


