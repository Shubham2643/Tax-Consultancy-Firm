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
    }
  };

  const getThumbClass = () => {
    if (theme === 'light') return 'thumb-light';
    if (theme === 'dark') return 'thumb-dark';
    return 'thumb-system';
  };

  const controls = (
    <div
      className="theme-segmented-capsule"
      role="radiogroup"
      aria-label="Color scheme preference"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Gliding active background indicator */}
      <span className={`theme-segment-thumb ${getThumbClass()}`} aria-hidden="true" />

      {/* 1. Light Mode */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        aria-label="Switch to Light mode (Daylight theme)"
        title="Light Mode (Daylight)"
        className={`theme-segment-btn ${theme === 'light' ? 'active btn-light' : ''}`}
        onClick={() => changeTheme('light')}
      >
        <i className="fas fa-sun" />
      </button>

      {/* 2. Dark Mode */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'dark'}
        aria-label="Switch to Dark mode (Executive midnight)"
        title="Dark Mode (Midnight Executive)"
        className={`theme-segment-btn ${theme === 'dark' ? 'active btn-dark' : ''}`}
        onClick={() => changeTheme('dark')}
      >
        <i className="fas fa-moon" />
      </button>

      {/* 3. System / Auto Mode */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'system'}
        aria-label={`Sync with System preferences (Currently ${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`}
        title={`System Default (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`}
        className={`theme-segment-btn ${theme === 'system' ? 'active btn-system' : ''}`}
        onClick={() => changeTheme('system')}
      >
        <span className="system-icon-wrap">
          <i className="fas fa-desktop" />
          {theme === 'system' && (
            <span
              className={`system-resolved-pip ${resolvedTheme === 'dark' ? 'pip-dark' : 'pip-light'}`}
              title={`System is in ${resolvedTheme} mode`}
            />
          )}
        </span>
      </button>
    </div>
  );

  if (variant === 'drawer-row') {
    return (
      <div className={`theme-drawer-row ${className}`}>
        <div className="drawer-row-left">
          <div className="drawer-row-icon">
            <i className={resolvedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun'} />
          </div>
          <div className="drawer-row-text">
            <span className="drawer-row-title">Display Appearance</span>
            <span className="drawer-row-sub">
              {theme === 'system' ? `Auto (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})` : theme === 'dark' ? 'Midnight Dark' : 'Daylight Light'}
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
