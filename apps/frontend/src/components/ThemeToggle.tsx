import { Moon, Sun } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { useThemeSound } from '../hooks/useThemeSound';

export function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('reed-theme') === 'dark' || document.documentElement.dataset.theme === 'dark');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const playThemeSound = useThemeSound();
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('reed-theme', dark ? 'dark' : 'light'); }, [dark]);
  const toggleTheme = () => {
    playThemeSound();
    const nextDark = !dark;
    const button = buttonRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const update = () => { document.documentElement.dataset.theme = nextDark ? 'dark' : 'light'; localStorage.setItem('reed-theme', nextDark ? 'dark' : 'light'); setDark(nextDark); };
    const viewTransitionDocument = document as Document & { startViewTransition?: (update: () => void) => void };
    if (!reducedMotion && button && viewTransitionDocument.startViewTransition) {
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      document.documentElement.style.setProperty('--theme-x', `${x}px`);
      document.documentElement.style.setProperty('--theme-y', `${y}px`);
      document.documentElement.style.setProperty('--theme-radius', `${radius}px`);
      viewTransitionDocument.startViewTransition(update);
    } else update();
  };
  return <button ref={buttonRef} className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Use ${dark ? 'light' : 'dark'} theme`} title={`Use ${dark ? 'light' : 'dark'} theme`} aria-pressed={dark}>
    <span className="theme-icon" key={dark ? 'sun' : 'moon'}>{dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}</span>
  </button>;
}
