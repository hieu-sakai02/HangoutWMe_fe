'use client';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import Login from './Login/Login';
import Register from './Register/Register';
import { useUser } from '@/app/context/UserContext';
import Image from 'next/image';

export default function Header() {
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const { currentUser, setCurrentUser } = useUser();

	useEffect(() => {
		if (currentUser) {
			console.log(currentUser);
		}
	}, [currentUser]);

	const handleOpenRegister = () => {
		setShowRegister(true);
		setShowLogin(false);
	};

	const handleCloseModals = () => {
		setShowLogin(false);
		setShowRegister(false);
	};

	const handleLogout = () => {
		setCurrentUser(null);
		setShowDropdown(false);
		// Add any additional logout logic here
	};

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<div className={styles.headerLeft}>
					<h1 className={styles.logo}>HangoutInv</h1>

					<nav className={styles.nav}>
						<ul>
							<li>
								<a href="#">Events</a>
							</li>
							<li>
								<a href="#">Coffee</a>
							</li>
							<li>
								<a href="#">Entertainment</a>
							</li>
							<li>
								<a href="#">Plans</a>
							</li>
						</ul>
					</nav>
				</div>

				<div className={styles.headerRight}>
					{currentUser ? (
						<div className={styles.userProfile}>
							<button
								className={styles.avatarButton}
								onClick={() => setShowDropdown(!showDropdown)}
							>
								<Image
									src={currentUser.avatar || '/images/defaultAvatar.png'}
									alt="User avatar"
									width={40}
									height={40}
									className={styles.avatar}
								/>
							</button>
							{showDropdown && (
								<div className={styles.dropdown}>
									<button onClick={handleLogout}>Logout</button>
								</div>
							)}
						</div>
					) : (
						<div className={styles.authButtons}>
							<Login
								isOpen={showLogin}
								onOpen={() => setShowLogin(true)}
								onClose={handleCloseModals}
								onSwitchToRegister={handleOpenRegister}
							/>
							<button
								className={styles.signup}
								onClick={handleOpenRegister}
							>
								SIGN UP
							</button>
						</div>
					)}
				</div>
			</div>

			{showRegister && (
				<Register
					onClose={handleCloseModals}
					onSwitchToLogin={() => {
						setShowRegister(false);
						setShowLogin(true);
					}}
				/>
			)}
		</header>
	);
}
