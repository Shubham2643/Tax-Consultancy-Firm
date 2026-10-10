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
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Solid Radiant Solar Disc */}
          <circle cx="12" cy="12" r="5" className="sun-core" fill="currentColor" />
          {/* Floating Rounded Capsule Rays (Cardinal & Diagonal with Uniform Optical Radius) */}
          <g className="sun-capsules" fill="currentColor">
            <rect x="10.8" y="1.2" width="2.4" height="3.6" rx="1.2" />
            <rect x="10.8" y="19.2" width="2.4" height="3.6" rx="1.2" />
            <rect x="1.2" y="10.8" width="3.6" height="2.4" rx="1.2" />
            <rect x="19.2" y="10.8" width="3.6" height="2.4" rx="1.2" />
            <g transform="rotate(45 12 12)">
              <rect x="10.8" y="1.2" width="2.4" height="3.6" rx="1.2" />
              <rect x="10.8" y="19.2" width="2.4" height="3.6" rx="1.2" />
              <rect x="1.2" y="10.8" width="3.6" height="2.4" rx="1.2" />
              <rect x="19.2" y="10.8" width="3.6" height="2.4" rx="1.2" />
            </g>
          </g>
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
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Solid Sculpted Crescent Moon */}
          <path
            className="moon-body"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
            fill="currentColor"
          />
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
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Outer Precision Contrast Ring */}
            <circle cx="12" cy="12" r="8.5" className="system-ring" stroke="currentColor" strokeWidth="2" fill="none" />
            {/* Solid Right Hemisphere (Midnight Phase) */}
            <path d="M12 3.5 A8.5 8.5 0 0 1 12 20.5 Z" className="system-half-dark" fill="currentColor" />
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  className="moon-body"
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" fill="currentColor" />
                <rect x="10.8" y="1.2" width="2.4" height="3.6" rx="1.2" fill="currentColor" />
                <rect x="10.8" y="19.2" width="2.4" height="3.6" rx="1.2" fill="currentColor" />
                <rect x="1.2" y="10.8" width="3.6" height="2.4" rx="1.2" fill="currentColor" />
                <rect x="19.2" y="10.8" width="3.6" height="2.4" rx="1.2" fill="currentColor" />
                <g transform="rotate(45 12 12)" fill="currentColor">
                  <rect x="10.8" y="1.2" width="2.4" height="3.6" rx="1.2" />
                  <rect x="10.8" y="19.2" width="2.4" height="3.6" rx="1.2" />
                  <rect x="1.2" y="10.8" width="3.6" height="2.4" rx="1.2" />
                  <rect x="19.2" y="10.8" width="3.6" height="2.4" rx="1.2" />
                </g>
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
