'use client';
import { useState, useRef, ChangeEvent } from 'react';
import { updateUser } from '@/apis/userService';
import { useUser } from '@/app/context/UserContext';
import styles from './AccountEdit.module.css';
import Image from 'next/image';
import { Upload, User, X } from 'lucide-react';

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
        name: currentUser?.name || '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar(file);

            // Create a preview URL
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatar(null);
        setAvatarPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Check if password fields match
        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const userData: {
                name?: string;
                password?: string;
                avatar?: string;
            } = {};

            // Only include fields that have changed
            if (formData.name && formData.name !== currentUser.name) {
                userData.name = formData.name;
            }

            if (formData.password) {
                userData.password = formData.password;
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

            // Only call API if there are changes
            if (Object.keys(userData).length > 0) {
                // Pass the authentication token from currentUser
                const token = currentUser.token; // Assuming token is stored in currentUser

                const response = await updateUser(userData, token);

                // Update current user with new data
                if (response.success) {
                    setCurrentUser({
                        ...currentUser,
                        name: userData.name || currentUser.name,
                        avatar: userData.avatar !== undefined
                            ? (userData.avatar || null)
                            : currentUser.avatar
                    });
                    setSuccess('Profile updated successfully');
                }
            } else {
                setSuccess('No changes detected');
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred while updating your profile');
            }
        } finally {
            setLoading(false);
        }
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

                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarContainer} onClick={handleAvatarClick}>
                            {avatarPreview ? (
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
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 