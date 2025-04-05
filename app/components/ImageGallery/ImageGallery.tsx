'use client';

import { useState, useRef } from 'react';
import styles from './ImageGallery.module.css';
import { Upload, X, Plus, Loader2 } from 'lucide-react';
import { uploadImage } from '@/apis/cloudinaryService';
import { updateCoffeeShop } from '@/apis/coffeeShopService';
import { toast } from 'react-toastify';
import ImageModal from '../ImageModal/ImageModal';

interface ImageGalleryProps {
    coffeeShopId: number;
    initialImages: string[];
    onUpdate: () => void;
}

export default function ImageGallery({ coffeeShopId, initialImages, onUpdate }: ImageGalleryProps) {
    const [images, setImages] = useState<string[]>(initialImages || []);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const files = Array.from(e.target.files);
        const remainingSlots = 5 - images.length;
        const filesToUpload = files.slice(0, remainingSlots);

        if (files.length > remainingSlots) {
            toast.warning(`Only ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'} can be added`);
        }

        setUploading(true);
        try {
            const uploadPromises = filesToUpload.map(file => uploadImage(file));
            const uploadedUrls = await Promise.all(uploadPromises);

            const newImages = [...images, ...uploadedUrls];
            await updateCoffeeShop(coffeeShopId, { pictures: newImages });

            setImages(newImages);
            onUpdate();
            toast.success('Images uploaded successfully');
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = async (indexToRemove: number) => {
        try {
            const newImages = images.filter((_, index) => index !== indexToRemove);
            await updateCoffeeShop(coffeeShopId, { pictures: newImages });
            setImages(newImages);
            onUpdate();
            toast.success('Image removed successfully');
        } catch (error) {
            console.error('Error removing image:', error);
            toast.error('Failed to remove image');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Gallery</h2>
            <div className={styles.gallery}>
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={styles.imageContainer}
                        onClick={() => handleImageClick(index)}
                    >
                        <img src={image} alt={`Coffee shop image ${index + 1}`} />
                        <button
                            className={styles.removeButton}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent modal from opening when removing
                                handleRemoveImage(index);
                            }}
                            aria-label="Remove image"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}

                {images.length < 5 && (
                    <button
                        className={styles.addButton}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <Loader2 size={24} className={styles.spinner} />
                        ) : (
                            <>
                                <Plus size={24} />
                                <span>Add Image</span>
                            </>
                        )}
                    </button>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className={styles.fileInput}
            />
            <p className={styles.hint}>
                {images.length < 5
                    ? `You can add ${5 - images.length} more image${5 - images.length === 1 ? '' : 's'}`
                    : 'Maximum number of images reached'}
            </p>

            <ImageModal
                images={images}
                currentIndex={selectedImageIndex}
                isOpen={selectedImageIndex !== -1}
                onClose={() => setSelectedImageIndex(-1)}
            />
        </div>
    );
} 