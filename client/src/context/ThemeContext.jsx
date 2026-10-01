import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'app-theme';

export const ThemeProvider = ({ children }) => {
  // 1. Initial State from localStorage (defaults to 'system')
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch {
      // ignore storage access error
    }
    return 'system';
  });

  // 2. Helper to inspect OS preference
  const getSystemTheme = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  // 3. Resolved Theme ('dark' | 'light')
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // 4. Apply theme to HTML root, body & meta theme-color
  const applyThemeToDOM = useCallback((applied) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    // Smooth transition class
    root.classList.add('theme-transitioning');

    root.setAttribute('data-theme', applied);
    if (body) {
      body.setAttribute('data-theme', applied);
    }
    root.style.colorScheme = applied;

    // Browser Chrome / Mobile Notch / Status Bar
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', applied === 'dark' ? '#071324' : '#ffffff');
    }

    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 280);

    return () => clearTimeout(timer);
  }, []);

  // 5. Change Theme handler
  const changeTheme = useCallback((newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark' && newTheme !== 'system') return;
    
    setTheme(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore storage error
    }

    const target = newTheme === 'system' ? getSystemTheme() : newTheme;
    setResolvedTheme(target);
    applyThemeToDOM(target);
  }, [getSystemTheme, applyThemeToDOM]);

  // 6. Quick toggle helper
  const toggleTheme = useCallback(() => {
    if (resolvedTheme === 'dark') {
      changeTheme('light');
    } else {
      changeTheme('dark');
    }
  }, [resolvedTheme, changeTheme]);

  // 7. Synchronize on mount and handle OS system theme shifts in real-time
  useEffect(() => {
    const target = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(target);
    applyThemeToDOM(target);

    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      if (theme === 'system') {
        const nextTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(nextTheme);
        applyThemeToDOM(nextTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme, getSystemTheme, applyThemeToDOM]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      resolvedTheme, 
      changeTheme, 
      toggleTheme, 
      isDark: resolvedTheme === 'dark' 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
