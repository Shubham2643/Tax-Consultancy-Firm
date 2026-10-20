import { useState, useRef, useEffect } from 'react';
import { useSiteContext } from '../context/SiteContext';
import './WhatsAppWidget.css';

const WhatsAppWidget = () => {
  const { settings } = useSiteContext();
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  const phone = settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : '919510984735';

  const getWhatsAppUrl = (topic = '') => {
    let text = 'Hello Shree Chamunda Associates! I would like to consult regarding professional Tax & Compliance advisory.';
    if (topic) {
      text = `Hello Shree Chamunda Associates! I would like to consult regarding ${topic}.`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  // Close on Escape or click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const quickTopics = [
    { label: 'Urgent Tax Scrutiny / Notice Defense', icon: 'fa-triangle-exclamation', topic: 'Urgent Tax Notice or Scrutiny Defense' },
    { label: 'GST Returns & Audit Reconciliation', icon: 'fa-file-invoice-dollar', topic: 'GST Audit & Return Filing' },
    { label: 'Company / LLP SPICe+ Registration', icon: 'fa-building', topic: 'Company or LLP Incorporation' },
    { label: 'Corporate Advisory & Retainer Mandates', icon: 'fa-handshake', topic: 'Corporate Tax & Financial Retainer' }
  ];

  return (
    <div className={`wa-concierge-dock ${isOpen ? 'is-open' : ''}`} ref={widgetRef}>
      {/* Luxury Advisory Card Modal */}
      {isOpen && (
        <div className="wa-concierge-card animated fadeIn" role="dialog" aria-label="Direct WhatsApp Advisory Channel">
          {/* Card Header */}
          <div className="wa-card-header">
            <div className="wa-header-left">
              <div className="wa-header-crest">
                <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
              </div>
              <div className="wa-header-info">
                <h3 className="wa-header-title">Direct Advisory Desk</h3>
                <div className="wa-header-status">
                  <span className="wa-live-dot" aria-hidden="true"></span>
                  <span>Senior Partners Online &bull; Direct Desk</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="wa-card-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Advisory Channel"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          {/* Card Body */}
          <div className="wa-card-body">
            <p className="wa-card-intro">
              Connect directly with our senior consultants for confidential tax representation, notice defense, and corporate structuring.
            </p>

            <div className="wa-quick-options">
              <span className="wa-options-label">Select Consultation Area:</span>
              <div className="wa-options-grid">
                {quickTopics.map((item, index) => (
                  <a
                    key={index}
                    href={getWhatsAppUrl(item.topic)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wa-option-item"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="wa-option-left">
                      <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>
                      <span>{item.label}</span>
                    </div>
                    <i className="fa-solid fa-chevron-right wa-option-arrow" aria-hidden="true"></i>
                  </a>
                ))}
              </div>
            </div>

            <div className="wa-card-footer">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa-direct-start"
                onClick={() => setIsOpen(false)}
              >
                <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                <span>Open Direct Chat on WhatsApp</span>
              </a>
              <div className="wa-privacy-note">
                <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                <span>Fiduciary Privilege &bull; Privileged Communications</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill / Capsule Trigger */}
      <button
        type="button"
        className={`wa-trigger-pill ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle Direct WhatsApp Advisory Desk"
        title="Direct WhatsApp Advisory Desk"
      >
        <span className="wa-pill-icon-wrap">
          <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
          <span className="wa-pill-pulse-dot" aria-hidden="true"></span>
        </span>
        <span className="wa-pill-text">
          <span className="wa-pill-title">Advisory Desk</span>
          <span className="wa-pill-sub">Online</span>
        </span>
        <span className="wa-pill-chevron" aria-hidden="true">
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-chevron-up'}`}></i>
        </span>
      </button>
    </div>
  );
};

export default WhatsAppWidget;
