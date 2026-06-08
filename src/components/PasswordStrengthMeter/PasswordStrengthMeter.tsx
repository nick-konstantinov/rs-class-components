import clsx from 'clsx';
import { getPasswordStrength } from '@/utils/password';
import styles from './PasswordStrengthMeter.module.scss';

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) {
    return null;
  }

  const strength = getPasswordStrength(password);
  const tier = strength <= 1 ? styles.weak : strength <= 3 ? styles.medium : styles.strong;

  return (
    <div className={styles.meter}>
      <div className={styles.bars}>
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={clsx(styles.bar, step <= strength && tier)} />
        ))}
      </div>
      <span className={styles.label}>{LABELS[strength]}</span>
    </div>
  );
}
