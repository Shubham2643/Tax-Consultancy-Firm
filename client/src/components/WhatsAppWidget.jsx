import { useState, useEffect } from 'react';
import { useSiteContext } from '../context/SiteContext';
import './WhatsAppWidget.css';

const WhatsAppWidget = () => {
  const { settings } = useSiteContext();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const phone = settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : '919510984735';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    'Hello Shree Chamunda Associates! I would like to consult with a Chartered Accountant regarding Tax, GST & Business Compliance services.'
  )}`;

  useEffect(() => {
    // Show polite prompt badge after 3 seconds on page load
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setShowTooltip(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isDismissed]);

  return (
    <div className="wa-float-container">
      {/* Floating Prompt Bubble */}
      {showTooltip && !isDismissed && (
        <div className="wa-chat-bubble animated fadeIn">
          <button
            type="button"
            className="wa-bubble-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
              setIsDismissed(true);
            }}
            aria-label="Close message"
          >
            &times;
          </button>
          <div className="wa-bubble-header">
            <div className="wa-agent-avatar">
              <img src="/assets/logo_new.jpg?v=3" alt="Advisor" />
              <span className="wa-online-beacon"></span>
            </div>
            <div className="wa-bubble-meta">
              <strong>Shree Chamunda Advisory</strong>
              <span>Online &bull; Instant CA Support</span>
            </div>
          </div>
          <p className="wa-bubble-text">
            👋 Need instant help with GST, ITR, or company filings? Chat with our senior consultant on WhatsApp!
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-bubble-cta-btn"
            onClick={() => setShowTooltip(false)}
          >
            <i className="fab fa-whatsapp"></i> Start Live Chat
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float-btn"
        aria-label="Chat on WhatsApp with Shree Chamunda Associates"
        onMouseEnter={() => {
          if (!isDismissed) setShowTooltip(true);
        }}
      >
        <span className="wa-pulse-wave"></span>
        <span className="wa-pulse-wave-delayed"></span>
        <div className="wa-btn-inner">
          <i className="fab fa-whatsapp"></i>
        </div>
        <span className="wa-status-badge">1</span>
      </a>
    </div>
  );
};

export default WhatsAppWidget;
