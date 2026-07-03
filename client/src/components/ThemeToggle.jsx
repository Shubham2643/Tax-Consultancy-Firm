import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = () => {
    if (theme === 'light') return 'fas fa-sun';
    if (theme === 'dark') return 'fas fa-moon';
    return 'fas fa-laptop';
  };

  const getLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'System';
  };

  return (
    <div className="theme-toggle-container" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '20px',
          border: '1px solid var(--border-color, #e2e8f0)',
          background: 'var(--bg-card, #ffffff)',
          color: 'var(--text-main, #333333)',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.9rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
      >
        <i className={`${getIcon()}`} style={{ color: 'var(--accent, #2a5a8a)' }}></i>
        <span>{getLabel()}</span>
        <i className="fas fa-chevron-down" style={{ fontSize: '0.75rem', opacity: 0.6, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}></i>
      </button>

      {isOpen && (
        <div
          className="theme-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: '160px',
            borderRadius: '12px',
            border: '1px solid var(--border-color, #e2e8f0)',
            background: 'var(--bg-card, #ffffff)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 9999,
            animation: 'dropdownFade 0.15s ease-out'
          }}
        >
          <button
            type="button"
            onClick={() => { changeTheme('light'); setIsOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              background: theme === 'light' ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
              color: theme === 'light' ? 'var(--accent, #2a5a8a)' : 'var(--text-main, #333333)',
              textAlign: 'left',
              fontWeight: theme === 'light' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '0.85rem',
              width: '100%',
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fas fa-sun" style={{ width: '16px', color: '#eab308' }}></i>
            <span>Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => { changeTheme('dark'); setIsOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              background: theme === 'dark' ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
              color: theme === 'dark' ? 'var(--accent, #2a5a8a)' : 'var(--text-main, #333333)',
              textAlign: 'left',
              fontWeight: theme === 'dark' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '0.85rem',
              width: '100%',
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fas fa-moon" style={{ width: '16px', color: '#a855f7' }}></i>
            <span>Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => { changeTheme('system'); setIsOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              background: theme === 'system' ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
              color: theme === 'system' ? 'var(--accent, #2a5a8a)' : 'var(--text-main, #333333)',
              textAlign: 'left',
              fontWeight: theme === 'system' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '0.85rem',
              width: '100%',
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fas fa-laptop" style={{ width: '16px', color: '#64748b' }}></i>
            <span>System default</span>
          </button>
        </div>
      )}
    </div>
  );
}
