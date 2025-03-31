'use client';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import styles from './AccountEdit.module.css';
import Image from 'next/image';
import { toast } from 'react-toastify';
// CONTEXT
import { useUser } from '@/app/context/UserContext';
// ICONS
import { Upload, User, X } from 'lucide-react';
// API
import { updateUser } from '@/apis/userService';
import { uploadImage } from '@/apis/cloudinaryService';

interface AccountEditProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccountEdit({ isOpen, onClose }: AccountEditProps) {
    const { currentUser, setCurrentUser } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        currentUser?.avatar || null
    );
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        dob: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [avatarLoading, setAvatarLoading] = useState(false);

    useEffect(() => {
        setFormData({
            email: currentUser?.email || '',
            name: currentUser?.name || '',
            password: '',
            confirmPassword: '',
            dob: currentUser?.dob || '',
            address: currentUser?.address || ''
        });
        setAvatarPreview(currentUser?.avatar || null);
    }, [currentUser]);

    if (!isOpen || !currentUser) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar(file);
            setAvatarLoading(true);
            try {
                const uploadImageURL = await uploadImage(file)
                setAvatarPreview(uploadImageURL);
                toast.success('Avatar uploaded successfully');
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Failed to upload image');
            } finally {
                setAvatarLoading(false);
            }
        }
    };

    const handleRemoveAvatar = () => {
        setAvatar(null);
        setAvatarPreview(null);
        toast.info('Avatar removed');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Check if password fields match
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const userData: {
                email?: string;
                name?: string;
                password?: string;
                avatar?: string;
                dob?: string;
                address?: string;
            } = {};

            userData.email = currentUser.email;

            if (formData.name && formData.name !== currentUser.name) {
                userData.name = formData.name;
            }

            if (formData.password) {
                userData.password = formData.password;
            }

            if (formData.dob !== currentUser.dob) {
                userData.dob = formData.dob;
            }

            if (formData.address !== currentUser.address) {
                userData.address = formData.address;
            }

            if (avatar) {
                // Convert image to base64 string
                const reader = new FileReader();
                reader.readAsDataURL(avatar);

                await new Promise<void>((resolve) => {
                    reader.onload = () => {
                        userData.avatar = reader.result as string;
                        resolve();
                    };
                });
            } else if (avatarPreview === null && currentUser.avatar) {
                // Set to empty string to remove avatar
                userData.avatar = '';
            }

            if (Object.keys(userData).length > 0) {
                const token = currentUser.token;
                const response = await updateUser(userData, token);

                if (response.status == "success") {
                    setCurrentUser({
                        ...currentUser,
                        name: userData.name || currentUser.name,
                        dob: userData.dob || currentUser.dob,
                        address: userData.address || currentUser.address,
                        avatar: userData.avatar !== undefined
                            ? (userData.avatar || null)
                            : currentUser.avatar,
                    });
                    toast.success('Profile updated successfully');
                    onClose();
                }
            } else {
                toast.info('No changes detected');
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An error occurred while updating your profile');
            }
        } finally {
            setLoading(false);
        }
    };

    // Add a function to check if there are changes
    const hasChanges = (): boolean => {
        // Check for name, dob, and address changes
        const hasFieldChanges =
            formData.name !== currentUser.name ||
            formData.dob !== currentUser.dob ||
            formData.address !== currentUser.address;

        // Check for password change
        const hasPasswordChange = formData.password.length > 0;

        // Check for avatar changes
        const hasAvatarChange =
            (avatarPreview === null && currentUser.avatar !== null) || // avatar removed
            (avatarPreview !== null && currentUser.avatar === null) || // new avatar added
            (avatarPreview !== currentUser.avatar); // avatar changed

        return hasFieldChanges || hasPasswordChange || hasAvatarChange;
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Edit Account</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarContainer} onClick={handleAvatarClick}>
                            {avatarLoading ? (
                                <div className={styles.avatarLoading}>
                                    <div className={styles.spinner}></div>
                                </div>
                            ) : avatarPreview ? (
                                <Image
                                    src={avatarPreview}
                                    alt="Profile avatar"
                                    width={100}
                                    height={100}
                                    className={styles.avatarImage}
                                />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    <User size={40} />
                                </div>
                            )}
                            <div className={styles.avatarOverlay}>
                                <Upload size={20} />
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            className={styles.fileInput}
                        />
                        {avatarPreview && (
                            <button
                                type="button"
                                onClick={handleRemoveAvatar}
                                className={styles.removeAvatar}
                            >
                                Remove Photo
                            </button>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Username</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your username"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Your address (optional)"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current password"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter new password"
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={loading || !hasChanges()}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 