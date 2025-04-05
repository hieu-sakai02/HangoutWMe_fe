'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import styles from './EditCoffeeShop.module.css';
import { X, Upload, Image as ImageIcon, Loader2, Coffee, Car, Dog, Wifi, Cake, Sun, Home, Moon, Clock } from 'lucide-react';
import { uploadImage } from '@/apis/cloudinaryService';
import { updateCoffeeShop, CoffeeShop } from '@/apis/coffeeShopService';
import { toast } from 'react-toastify';
import { ADDRESS } from '@/app/constant/CONST';
import Toggle from '@/app/components/Toggle/Toggle';

interface EditCoffeeShopProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    coffeeShop: CoffeeShop;
}

export default function EditCoffeeShop({ isOpen, onClose, onSuccess, coffeeShop }: EditCoffeeShopProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(coffeeShop.thumbnail);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: coffeeShop.name,
        houseNumber: coffeeShop.houseNumber,
        street: coffeeShop.street || '',
        ward: coffeeShop.ward,
        district: coffeeShop.district,
        city: coffeeShop.city,
        phone: coffeeShop.phone || '',
        email: coffeeShop.email || '',
        website: coffeeShop.website || '',
        thumbnail: coffeeShop.thumbnail,
        description: coffeeShop.description,
        carPark: coffeeShop.carPark || false,
        petFriendly: coffeeShop.petFriendly || false,
        wifi: coffeeShop.wifi || '',
        cake: coffeeShop.cake || false,
        outdoorSeating: coffeeShop.outdoorSeating || false,
        indoorSeating: coffeeShop.indoorSeating || false,
        openTime: coffeeShop.openTime || '',
        closeTime: coffeeShop.closeTime || '',
        overNight: coffeeShop.overNight || false
    });

    const [addressSelections, setAddressSelections] = useState({
        city: coffeeShop.city,
        district: coffeeShop.district,
        ward: coffeeShop.ward,
        street: coffeeShop.street || ''
    });

    // Add effect to handle body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        // Cleanup function to remove the style when component unmounts or modal closes
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleAddressChange = (field: 'city' | 'district' | 'ward' | 'street', value: string) => {
        const newSelections = { ...addressSelections };

        switch (field) {
            case 'city':
                newSelections.city = value;
                newSelections.district = '';
                newSelections.ward = '';
                newSelections.street = '';
                break;
            case 'district':
                newSelections.district = value;
                newSelections.ward = '';
                newSelections.street = '';
                break;
            case 'ward':
                newSelections.ward = value;
                newSelections.street = '';
                break;
            case 'street':
                newSelections.street = value;
                break;
        }

        setAddressSelections(newSelections);
        setFormData(prev => ({
            ...prev,
            city: newSelections.city,
            district: newSelections.district,
            ward: newSelections.ward,
            street: newSelections.street
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let thumbnailUrl = formData.thumbnail;
            if (selectedImage) {
                thumbnailUrl = await uploadImage(selectedImage);
            }

            const updatedData = {
                ...formData,
                thumbnail: thumbnailUrl
            };

            await updateCoffeeShop(coffeeShop.id, updatedData);
            toast.success('Coffee shop updated successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating coffee shop:', error);
            toast.error('Failed to update coffee shop');
        } finally {
            setLoading(false);
        }
    };

    // Derived state for dropdowns
    const availableDistricts = addressSelections.city ? Object.keys(ADDRESS[addressSelections.city]) : [];
    const availableWards = addressSelections.district ?
        Object.keys(ADDRESS[addressSelections.city][addressSelections.district]) : [];
    const availableStreets = addressSelections.ward ?
        ADDRESS[addressSelections.city][addressSelections.district][addressSelections.ward].Streets : [];

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Edit Coffee Shop</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.imageSection}>
                        <div
                            className={styles.imageUpload}
                            onClick={handleImageClick}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Coffee shop thumbnail preview"
                                    className={styles.thumbnailPreview}
                                />
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <ImageIcon size={40} />
                                    <p>Upload Thumbnail</p>
                                </div>
                            )}
                            <div className={styles.uploadOverlay}>
                                <Upload size={20} />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className={styles.fileInput}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Coffee Shop Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter coffee shop name"
                        />
                    </div>

                    <div className={styles.formSection}>
                        <h3>Address Details</h3>
                        <div className={styles.addressGrid}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="houseNumber">House/Building Number *</label>
                                <input
                                    type="text"
                                    id="houseNumber"
                                    name="houseNumber"
                                    value={formData.houseNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="city">City *</label>
                                <select
                                    id="city"
                                    value={addressSelections.city}
                                    onChange={(e) => handleAddressChange('city', e.target.value)}
                                    required
                                >
                                    <option value="">Select City</option>
                                    {Object.keys(ADDRESS).map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="district">District *</label>
                                <select
                                    id="district"
                                    value={addressSelections.district}
                                    onChange={(e) => handleAddressChange('district', e.target.value)}
                                    required
                                    disabled={!addressSelections.city}
                                >
                                    <option value="">Select District</option>
                                    {availableDistricts.map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="ward">Ward *</label>
                                <select
                                    id="ward"
                                    value={addressSelections.ward}
                                    onChange={(e) => handleAddressChange('ward', e.target.value)}
                                    required
                                    disabled={!addressSelections.district}
                                >
                                    <option value="">Select Ward</option>
                                    {availableWards.map(ward => (
                                        <option key={ward} value={ward}>{ward}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="street">Street</label>
                                <select
                                    id="street"
                                    value={addressSelections.street}
                                    onChange={(e) => handleAddressChange('street', e.target.value)}
                                    disabled={!addressSelections.ward}
                                >
                                    <option value="">Select Street</option>
                                    {availableStreets.map(street => (
                                        <option key={street} value={street}>{street}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Description</h3>
                        <div className={styles.descriptionGroup}>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Describe your coffee shop..."
                                rows={6}
                            />
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Operating Hours</h3>
                        <div className={styles.timeInputs}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="openTime">Opening Time</label>
                                <input
                                    type="time"
                                    id="openTime"
                                    name="openTime"
                                    value={formData.openTime}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="closeTime">Closing Time</label>
                                <input
                                    type="time"
                                    id="closeTime"
                                    name="closeTime"
                                    value={formData.closeTime}
                                    onChange={handleChange}
                                />
                            </div>

                            <Toggle
                                label="Open Overnight"
                                checked={formData.overNight}
                                onChange={(checked) => handleCheckboxChange('overNight', checked)}
                                icon={<Moon size={20} />}
                            />
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Contact Information</h3>
                        <div className={styles.contactGrid}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="website">Website</label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="Enter website URL"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Features & Amenities</h3>
                        <div className={styles.featuresGrid}>
                            <Toggle
                                label="Car Parking"
                                checked={formData.carPark}
                                onChange={(checked) => handleCheckboxChange('carPark', checked)}
                                icon={<Car size={20} />}
                            />

                            <Toggle
                                label="Pet Friendly"
                                checked={formData.petFriendly}
                                onChange={(checked) => handleCheckboxChange('petFriendly', checked)}
                                icon={<Dog size={20} />}
                            />

                            <Toggle
                                label="Cake Available"
                                checked={formData.cake}
                                onChange={(checked) => handleCheckboxChange('cake', checked)}
                                icon={<Cake size={20} />}
                            />

                            <Toggle
                                label="Outdoor Seating"
                                checked={formData.outdoorSeating}
                                onChange={(checked) => handleCheckboxChange('outdoorSeating', checked)}
                                icon={<Sun size={20} />}
                            />

                            <Toggle
                                label="Indoor Seating"
                                checked={formData.indoorSeating}
                                onChange={(checked) => handleCheckboxChange('indoorSeating', checked)}
                                icon={<Home size={20} />}
                            />

                            <div className={styles.wifiInput}>
                                <div className={styles.wifiInputHeader}>
                                    <Wifi size={20} />
                                    <label htmlFor="wifi">WiFi Password</label>
                                </div>
                                <input
                                    type="text"
                                    id="wifi"
                                    name="wifi"
                                    value={formData.wifi}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className={styles.spinner} />
                                    Updating...
                                </>
                            ) : (
                                'Update Coffee Shop'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 