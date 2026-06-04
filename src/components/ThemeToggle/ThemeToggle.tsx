import styles from './ThemeToggle.module.scss';
import { useTheme } from '../../context/themeContext';

interface ThemeToggleProps {
  className?: string;
}

function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <label className={[styles.toggle, className].filter(Boolean).join(' ')}>
      <span className={styles.label}>Dark mode</span>
      <input
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={isDark}
        onChange={toggleTheme}
      />
    </label>
  );
}

export default ThemeToggle;
