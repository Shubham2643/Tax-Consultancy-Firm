import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './WhatsAppWidget.css';

const WhatsAppWidget = () => {
  const location = useLocation();
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

  // Current formatted time for the chat bubble
  const chatTime = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }, []);

  const quickTopics = [
    {
      label: 'Urgent Tax Notice Defense',
      desc: 'Section 148, 144, GST DRC-01 triage (< 48h)',
      icon: 'fa-triangle-exclamation',
      colorClass: 'topic-amber',
      topic: 'Urgent Tax Notice or Scrutiny Defense'
    },
    {
      label: 'GST Audit & ITC Recovery',
      desc: 'GSTR-1, 3B, 2B matching & refund claims',
      icon: 'fa-file-invoice-dollar',
      colorClass: 'topic-sapphire',
      topic: 'GST Audit & Return Filing'
    },
    {
      label: 'Company & LLP Registration',
      desc: 'Turnkey SPICe+, DINs, DSC & entity setup',
      icon: 'fa-building',
      colorClass: 'topic-purple',
      topic: 'Company or LLP Incorporation'
    },
    {
      label: 'Corporate Retainer Mandate',
      desc: 'Monthly bookkeeping, CFO & tax governance',
      icon: 'fa-handshake',
      colorClass: 'topic-emerald',
      topic: 'Corporate Tax & Financial Retainer'
    }
  ];

  // On the dedicated Contact & Consultation Chambers page, hide the floating pill
  // to avoid overlapping the 2x2 communication suite and duplicate WhatsApp actions.
  if (location.pathname === '/contact') {
    return null;
  }

  return (
    <div className={`wa-concierge-dock ${isOpen ? 'is-open' : ''}`} ref={widgetRef}>
      {/* Luxury Advisory Card Modal */}
      {isOpen && (
        <div className="wa-concierge-card animated fadeIn" role="dialog" aria-label="Direct WhatsApp Advisory Channel">
          {/* Card Header with Executive Crest & Live Beacon */}
          <div className="wa-card-header">
            <div className="wa-header-left">
              <div className="wa-header-crest">
                <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                <span className="wa-crest-live-dot" aria-hidden="true"></span>
              </div>
              <div className="wa-header-info">
                <div className="wa-header-title-row">
                  <h3 className="wa-header-title">Direct Advisory Desk</h3>
                  <span className="wa-verified-badge" title="Official Verified Desk">
                    <i className="fa-solid fa-check"></i>
                  </span>
                </div>
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
              title="Close"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          {/* Card Body */}
          <div className="wa-card-body">
            {/* Conversational Advisor Chat Bubble */}
            <div className="wa-chat-bubble-wrap">
              <div className="wa-advisor-avatar">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <div className="wa-speech-bubble">
                <div className="wa-bubble-sender">Senior Advisory Team</div>
                <p className="wa-bubble-text">
                  Welcome to Shree Chamunda Associates. How can our senior tax &amp; compliance consultants assist your business today?
                </p>
                <div className="wa-bubble-meta">
                  <span className="wa-bubble-time">{chatTime}</span>
                  <span className="wa-bubble-ticks">
                    <i className="fa-solid fa-check-double"></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Practice Domains */}
            <div className="wa-quick-options">
              <div className="wa-options-header-row">
                <span className="wa-options-label">Select Consultation Topic:</span>
                <span className="wa-options-subtag">Direct Partner Triage</span>
              </div>
              <div className="wa-options-grid">
                {quickTopics.map((item, index) => (
                  <a
                    key={index}
                    href={getWhatsAppUrl(item.topic)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`wa-option-card ${item.colorClass}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="wa-option-icon-box">
                      <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>
                    </div>
                    <div className="wa-option-content">
                      <strong className="wa-option-title">{item.label}</strong>
                      <span className="wa-option-desc">{item.desc}</span>
                    </div>
                    <span className="wa-option-arrow-pill">
                      Chat <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Direct Open Button & Fiduciary Strip */}
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
                <i className="fa-solid fa-arrow-up-right-from-square wa-external-icon"></i>
              </a>

              <div className="wa-fiduciary-trust-strip">
                <span className="trust-pill">
                  <i className="fa-solid fa-shield-halved"></i> 100% Client Privilege
                </span>
                <span className="trust-sep">&bull;</span>
                <span className="trust-pill">
                  <i className="fa-solid fa-bolt"></i> &lt; 5 Min SLA
                </span>
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
          <span className="wa-pill-sub">
            <span className="wa-status-beacon"></span>
            <span>Online</span>
          </span>
        </span>
        <span className="wa-pill-chevron" aria-hidden="true">
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-chevron-up'}`}></i>
        </span>
      </button>
    </div>
  );
};

export default WhatsAppWidget;
