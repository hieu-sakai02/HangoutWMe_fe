import styles from './Toggle.module.css';

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon?: React.ReactNode;
}

export default function Toggle({ label, checked, onChange, icon }: ToggleProps) {
    return (
        <label className={styles.toggleWrapper}>
            <div className={styles.labelContent}>
                {icon && <span className={styles.icon}>{icon}</span>}
                <span className={styles.label}>{label}</span>
            </div>
            <div
                className={`${styles.toggle} ${checked ? styles.checked : ''}`}
                onClick={() => onChange(!checked)}
            >
                <div className={styles.toggleButton} />
            </div>
        </label>
    );
} 