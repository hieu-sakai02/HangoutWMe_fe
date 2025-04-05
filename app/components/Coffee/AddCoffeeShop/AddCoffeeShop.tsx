'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import styles from './AddCoffeeShop.module.css';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '@/apis/cloudinaryService';
import { createNewCoffeeShop, CreateCoffeeShopData } from '@/apis/coffeeShopService';
import { toast } from 'react-toastify';
import { ADDRESS } from '@/app/constant/CONST';

interface AddCoffeeShopProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddCoffeeShop({ isOpen, onClose, onSuccess }: AddCoffeeShopProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateCoffeeShopData>({
        name: '',
        houseNumber: '',
        street: '',
        ward: '',
        district: '',
        city: '',
        phone: '',
        email: '',
        website: '',
        thumbnail: '',
        description: '',
        carPark: false,
        petFriendly: false,
        wifi: '',
        cake: '',
        outdoorSeating: false,
        indoorSeating: false,
        openTime: '',
        closeTime: '',
        overNight: false
    });
    const [addressSelections, setAddressSelections] = useState({
        city: '',
        district: '',
        ward: '',
        street: ''
    });

    // Derived state for dropdowns
    const availableDistricts = addressSelections.city ? Object.keys(ADDRESS[addressSelections.city]) : [];
    const availableWards = addressSelections.district ?
        Object.keys(ADDRESS[addressSelections.city][addressSelections.district]) : [];
    const availableStreets = addressSelections.ward ?
        ADDRESS[addressSelections.city][addressSelections.district][addressSelections.ward].Streets : [];

    if (!isOpen) return null;

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            // Create local preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAddressChange = (field: 'city' | 'district' | 'ward' | 'street', value: string) => {
        const newSelections = { ...addressSelections };

        // Reset dependent fields when parent field changes
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

        // Update form data with new address values
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
            // Validate required fields
            const requiredFields = {
                name: 'coffee shop name',
                houseNumber: 'house number',
                ward: 'ward',
                district: 'district',
                city: 'city',
                description: 'description'
            };

            for (const [field, label] of Object.entries(requiredFields)) {
                if (!formData[field as keyof typeof requiredFields].trim()) {
                    toast.error(`Please enter the ${label}`);
                    setLoading(false);
                    return;
                }
            }

            if (!selectedImage) {
                toast.error('Please select a thumbnail image');
                setLoading(false);
                return;
            }

            // Upload image first
            const uploadedUrl = await uploadImage(selectedImage);

            // Create coffee shop with uploaded image URL
            const coffeeShopData = {
                ...formData,
                thumbnail: uploadedUrl
            };

            await createNewCoffeeShop(coffeeShopData);
            toast.success('Coffee shop added successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating coffee shop:', error);
            toast.error('Failed to create coffee shop');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Add New Coffee Shop</h2>
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
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Coffee shop thumbnail preview"
                                        className={styles.thumbnailPreview}
                                    />
                                    <button
                                        type="button"
                                        className={styles.removeImageButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage();
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                </>
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <ImageIcon size={40} />
                                    <p>Upload Thumbnail *</p>
                                </div>
                            )}
                            <div className={styles.uploadOverlay}>
                                <Upload size={20} />
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
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

                    <div className={styles.addressSection}>
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
                                    placeholder="Enter house/building number"
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
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
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
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
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
                                        <option key={ward} value={ward}>
                                            {ward}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="street">Street (Optional)</label>
                                <select
                                    id="street"
                                    value={addressSelections.street}
                                    onChange={(e) => handleAddressChange('street', e.target.value)}
                                    disabled={!addressSelections.ward}
                                >
                                    <option value="">Select Street</option>
                                    {availableStreets.map(street => (
                                        <option key={street} value={street}>
                                            {street}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter coffee shop description"
                            rows={4}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="phone">Phone Number (Optional)</label>
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
                        <label htmlFor="email">Email (Optional)</label>
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
                        <label htmlFor="website">Website (Optional)</label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="Enter website URL"
                        />
                    </div>

                    <div className={styles.featuresSection}>
                        <h3>Features & Amenities</h3>
                        <div className={styles.featuresGrid}>
                            <div className={styles.checkboxGroup}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.carPark}
                                        onChange={(e) => handleChange({
                                            target: { name: 'carPark', value: e.target.checked }
                                        } as any)}
                                    />
                                    Car Parking
                                </label>
                            </div>

                            <div className={styles.checkboxGroup}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.petFriendly}
                                        onChange={(e) => handleChange({
                                            target: { name: 'petFriendly', value: e.target.checked }
                                        } as any)}
                                    />
                                    Pet Friendly
                                </label>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="wifi">WiFi</label>
                                <input
                                    type="text"
                                    id="wifi"
                                    name="wifi"
                                    value={formData.wifi}
                                    onChange={handleChange}
                                    placeholder="WiFi details (optional)"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="cake">Cake Service</label>
                                <input
                                    type="text"
                                    id="cake"
                                    name="cake"
                                    value={formData.cake}
                                    onChange={handleChange}
                                    placeholder="Cake service details (optional)"
                                />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.outdoorSeating}
                                        onChange={(e) => handleChange({
                                            target: { name: 'outdoorSeating', value: e.target.checked }
                                        } as any)}
                                    />
                                    Outdoor Seating
                                </label>
                            </div>

                            <div className={styles.checkboxGroup}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.indoorSeating}
                                        onChange={(e) => handleChange({
                                            target: { name: 'indoorSeating', value: e.target.checked }
                                        } as any)}
                                    />
                                    Indoor Seating
                                </label>
                            </div>
                        </div>

                        <div className={styles.operatingHours}>
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

                                <div className={styles.checkboxGroup}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.overNight}
                                            onChange={(e) => handleChange({
                                                target: { name: 'overNight', value: e.target.checked }
                                            } as any)}
                                        />
                                        Open Overnight
                                    </label>
                                </div>
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
                            {loading ? 'Adding...' : 'Add Coffee Shop'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 