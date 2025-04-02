'use client';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import Login from './Login/Login';
import Register from './Register/Register';
import { useUser } from '@/app/context/UserContext';
import Image from 'next/image';
import { Calendar, Coffee, Film, MapPin } from 'lucide-react';
import AccountEdit from '../AccountEdit/AccountEdit';
import Link from 'next/link';

export default function Header() {
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const [showAccountEdit, setShowAccountEdit] = useState(false);
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
	};

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<div className={styles.headerLeft}>
					<Link href="/" className={styles.logo}>
						HangoutInv
					</Link>

					<nav className={styles.nav}>
						<ul>
							<li>
								<a href="#" className={styles.navLink}>
									<Calendar className={styles.navIcon} size={18} />
									<span>Events</span>
								</a>
							</li>
							<li>
								<Link href="/coffee" className={styles.navLink}>
									<Coffee className={styles.navIcon} size={18} />
									<span>Coffee</span>
								</Link>
							</li>
							<li>
								<a href="#" className={styles.navLink}>
									<Film className={styles.navIcon} size={18} />
									<span>Entertainment</span>
								</a>
							</li>
							<li>
								<a href="#" className={styles.navLink}>
									<MapPin className={styles.navIcon} size={18} />
									<span>Plans</span>
								</a>
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
									<button
										onClick={() => {
											setShowAccountEdit(true);
											setShowDropdown(false);
										}}
									>
										Edit Profile
									</button>
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

			<AccountEdit
				isOpen={showAccountEdit}
				onClose={() => setShowAccountEdit(false)}
			/>
		</header>
	);
}
