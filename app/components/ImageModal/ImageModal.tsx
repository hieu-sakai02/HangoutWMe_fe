'use client';

import { useEffect, useState } from 'react';
import styles from './ImageModal.module.css';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
    images: string[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageModal({ images, currentIndex, isOpen, onClose }: ImageModalProps) {
    const [index, setIndex] = useState(currentIndex);

    useEffect(() => {
        setIndex(currentIndex);
    }, [currentIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    setIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
                    break;
                case 'ArrowRight':
                    setIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, images.length, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.imageContainer}>
                    <img
                        src={images[index]}
                        alt={`Coffee shop image ${index + 1}`}
                        className={styles.image}
                    />
                </div>

                {images.length > 1 && (
                    <>
                        <button
                            className={`${styles.navButton} ${styles.prevButton}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
                            }}
                        >
                            <ChevronLeft size={40} />
                        </button>
                        <button
                            className={`${styles.navButton} ${styles.nextButton}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
                            }}
                        >
                            <ChevronRight size={40} />
                        </button>
                    </>
                )}

                <div className={styles.counter}>
                    {index + 1} / {images.length}
                </div>
            </div>
        </div>
    );
} 