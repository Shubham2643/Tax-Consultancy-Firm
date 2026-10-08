import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle({ variant = 'segmented', className = '' }) {
  const { theme, resolvedTheme, changeTheme } = useTheme();

  const handleKeyDown = (e) => {
    const options = ['light', 'dark', 'system'];
    const currentIndex = options.indexOf(theme);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % options.length;
      changeTheme(options[nextIndex]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      changeTheme(options[prevIndex]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      changeTheme('light');
    } else if (e.key === 'End') {
      e.preventDefault();
      changeTheme('system');
    }
  };

  const getThumbClass = () => {
    if (theme === 'light') return 'thumb-light';
    if (theme === 'dark') return 'thumb-dark';
    return 'thumb-system';
  };

  const isDrawer = variant === 'drawer-row';

  const controls = (
    <div
      className={`theme-segmented-track ${isDrawer ? 'track-drawer' : ''}`}
      role="radiogroup"
      aria-label="Color scheme preference"
      onKeyDown={handleKeyDown}
    >
      {/* Gliding floating circular indicator thumb */}
      <span className={`theme-segment-thumb ${getThumbClass()}`} aria-hidden="true" />

      {/* 1. Daylight Light Mode */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        tabIndex={theme === 'light' ? 0 : -1}
        aria-label="Daylight Light theme"
        title="Daylight Mode"
        className={`theme-segment-btn ${theme === 'light' ? 'active btn-light' : ''}`}
        onClick={() => changeTheme('light')}
      >
        <svg
          className="theme-svg-icon icon-sun"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.5" className="sun-core" />
          <line x1="12" y1="2" x2="12" y2="4.5" className="sun-ray" />
          <line x1="12" y1="19.5" x2="12" y2="22" className="sun-ray" />
          <line x1="4.22" y1="4.22" x2="5.99" y2="5.99" className="sun-ray" />
          <line x1="18.01" y1="18.01" x2="19.78" y2="19.78" className="sun-ray" />
          <line x1="2" y1="12" x2="4.5" y2="12" className="sun-ray" />
          <line x1="19.5" y1="12" x2="22" y2="12" className="sun-ray" />
          <line x1="4.22" y1="19.78" x2="5.99" y2="18.01" className="sun-ray" />
          <line x1="18.01" y1="5.99" x2="19.78" y2="4.22" className="sun-ray" />
        </svg>
      </button>

      {/* 2. Midnight Executive Dark Mode */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'dark'}
        tabIndex={theme === 'dark' ? 0 : -1}
        aria-label="Midnight Dark theme"
        title="Midnight Executive Dark Mode"
        className={`theme-segment-btn ${theme === 'dark' ? 'active btn-dark' : ''}`}
        onClick={() => changeTheme('dark')}
      >
        <svg
          className="theme-svg-icon icon-moon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" className="moon-path" />
        </svg>
      </button>

      {/* 3. System / Auto Mode */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'system'}
        tabIndex={theme === 'system' ? 0 : -1}
        aria-label={`System default (${resolvedTheme === 'dark' ? 'Midnight Active' : 'Daylight Active'})`}
        title={`System Default (${resolvedTheme === 'dark' ? 'Midnight' : 'Daylight'})`}
        className={`theme-segment-btn ${theme === 'system' ? 'active btn-system' : ''}`}
        onClick={() => changeTheme('system')}
      >
        <span className="system-icon-wrap">
          <svg
            className="theme-svg-icon icon-system"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" className="system-screen" />
            <line x1="8" y1="21" x2="16" y2="21" className="system-stand" />
            <line x1="12" y1="17" x2="12" y2="21" className="system-stand" />
          </svg>
          {theme === 'system' && (
            <span
              className={`system-resolved-dot ${resolvedTheme}`}
              title={`OS is in ${resolvedTheme} mode`}
              aria-hidden="true"
            />
          )}
        </span>
      </button>
    </div>
  );

  if (isDrawer) {
    return (
      <div className={`theme-drawer-row ${className}`}>
        <div className="drawer-row-left">
          <div className={`drawer-row-icon ${resolvedTheme === 'dark' ? 'icon-dark' : 'icon-light'}`}>
            {resolvedTheme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4.5" />
                <line x1="12" y1="2" x2="12" y2="4.5" />
                <line x1="12" y1="19.5" x2="12" y2="22" />
                <line x1="4.22" y1="4.22" x2="5.99" y2="5.99" />
                <line x1="18.01" y1="18.01" x2="19.78" y2="19.78" />
                <line x1="2" y1="12" x2="4.5" y2="12" />
                <line x1="19.5" y1="12" x2="22" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.99" y2="18.01" />
                <line x1="18.01" y1="5.99" x2="19.78" y2="4.22" />
              </svg>
            )}
          </div>
          <div className="drawer-row-text">
            <span className="drawer-row-title">Appearance</span>
            <span className="drawer-row-sub">
              <span className={`drawer-status-pip ${theme === 'system' ? 'pip-system' : theme === 'dark' ? 'pip-dark' : 'pip-light'}`} />
              {theme === 'system'
                ? `Auto (${resolvedTheme === 'dark' ? 'Midnight' : 'Daylight'})`
                : theme === 'dark'
                  ? 'Midnight Dark'
                  : 'Daylight Light'}
            </span>
          </div>
        </div>
        <div className="drawer-row-right">
          {controls}
        </div>
      </div>
    );
  }

  return (
    <div className={`theme-toggle-wrap ${className}`}>
      {controls}
    </div>
  );
}
