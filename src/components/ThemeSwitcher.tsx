import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Flower2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'pink', icon: <Flower2 className="w-4 h-4" />, label: 'Pink' },
    { id: 'cream', icon: <Sun className="w-4 h-4" />, label: 'Cream' },
    { id: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' },
  ] as const;

  return (
    <div className="flex items-center bg-bg-secondary rounded-full p-1 border border-border">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`relative p-2 rounded-full flex items-center justify-center transition-colors z-10 ${
            theme === t.id ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
          aria-label={`Switch to ${t.label} theme`}
          title={t.label}
        >
          {theme === t.id && (
            <motion.div
              layoutId="theme-bubble"
              className="absolute inset-0 bg-bg-primary rounded-full shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-20">{t.icon}</span>
        </button>
      ))}
    </div>
  );
}
