import './ThemeToggle.css';
import { useTheme } from '@/context/themeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <label className="theme-toggle">
      <span className="theme-toggle__label">Dark mode</span>
      <input
        type="checkbox"
        role="switch"
        className="theme-toggle__input"
        checked={isDark}
        onChange={toggleTheme}
      />
    </label>
  );
}

export default ThemeToggle;
