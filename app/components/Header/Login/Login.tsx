'use client';
import styles from './Login.module.css';
import { Facebook, Chrome } from 'lucide-react';
import { useState } from 'react';
import { loginUser, loginWithGoogle } from '@/apis/userService';
import { useUser } from '@/app/context/UserContext';

interface LoginProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onSwitchToRegister: () => void;
}

export default function Login({ isOpen, onOpen, onClose, onSwitchToRegister }: LoginProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setCurrentUser } = useUser();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error('Google login error:', error);
            setError('Failed to initiate Google login');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginUser(formData);
            const { user } = response;
            user.token = response.token;
            setCurrentUser(user);
            onClose();
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Invalid email or password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button onClick={onOpen} className={styles.loginButton}>
                LOGIN
            </button>

            {isOpen && (
                <div className={styles.overlay} onClick={onClose}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalContent}>
                            <h2>Welcome to HangOutInvite</h2>
                            {error && <div className={styles.error}>{error}</div>}
                            <div className={styles.socialLogin}>
                                <button
                                    className={styles.googleLogin}
                                    onClick={handleGoogleLogin}
                                >
                                    <Chrome size={20} />
                                    <span>Continue with Google</span>
                                </button>
                                <button className={styles.facebookLogin}>
                                    <Facebook size={20} />
                                    <span>Continue with Facebook</span>
                                </button>
                            </div>
                            <div className={styles.divider}>
                                <span>or</span>
                            </div>
                            <form className={styles.loginForm} onSubmit={handleSubmit}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
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
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.loginSubmit}
                                    disabled={loading}
                                >
                                    {loading ? 'LOGGING IN...' : 'LOGIN'}
                                </button>
                            </form>
                            <p className={styles.switchForm}>
                                Don't have an account?
                                <button onClick={onSwitchToRegister} className={styles.switchButton}>
                                    Register
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
