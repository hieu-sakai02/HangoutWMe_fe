'use client';
import { useState } from 'react';
import styles from './Register.module.css';
import { registerUser, loginUser } from '@/apis/userService';
import { useUser } from '@/app/context/UserContext';

interface RegisterProps {
    onClose: () => void;
    onSwitchToLogin: () => void;
}

export default function Register({ onClose, onSwitchToLogin }: RegisterProps) {
    const { setCurrentUser } = useUser();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        address: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                provider: 'user',
                dob: formData.dob,
                address: formData.address,
            };

            await registerUser(userData);

            // After successful registration, attempt to login
            const loginResponse = await loginUser({
                email: formData.email,
                password: formData.password
            });

            setCurrentUser(loginResponse.user);
            onClose(); // Close the modal instead of switching to login
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred during registration');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalContent}>
                    <h2>Create Account</h2>
                    <form className={styles.registerForm} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
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
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className={styles.registerSubmit} disabled={loading}>
                            {loading ? 'REGISTERING...' : 'REGISTER'}
                        </button>
                    </form>
                    {error && <p className={styles.error}>{error}</p>}
                    <p className={styles.switchForm}>
                        Already have an account?
                        <button onClick={onSwitchToLogin} className={styles.switchButton}>
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
} 