import { useState, useMemo } from 'react';
import ContactForm from '../components/ContactForm';
import { useSiteContext } from '../context/SiteContext';
import { getFAQs } from '../api';
import useFetch from '../hooks/useFetch';
import './Contact.css';

const Contact = () => {
  const { settings, loading: settingsLoading } = useSiteContext();
  const { data: faqResponse } = useFetch(getFAQs);
  const faqs = faqResponse?.data?.slice(0, 5) || [];

  const [openFaqIdx, setOpenFaqIdx] = useState(0); // First FAQ open by default for higher engagement
  const [copiedField, setCopiedField] = useState(null);

  const phone = settings?.phone || '+91 95109 84735';
  const cleanPhone = '+919510984735';
  const email = settings?.email || 'shreechamundaassociates0905@gmail.com';
  const address = (settings?.address && !settings.address.includes('Zaveri') && !settings.address.includes('Kathwada') && !settings.address.includes('Singarva'))
    ? settings.address
    : 'Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad, Gujarat - 380049';
  const workingHours = settings?.workingHours || 'Mon - Sat: 10:00 AM - 7:00 PM';
  const defaultWhatsappUrl = `https://wa.me/919510984735?text=${encodeURIComponent('Hello Shree Chamunda Associates! I would like to schedule a consultation regarding Tax & Compliance.')}`;

  // Real-time IST Business Operating Hours Calculation
  const officeStatus = useMemo(() => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist = new Date(utc + 3600000 * 5.5);
    const day = ist.getDay(); // 0 = Sunday, 1 = Mon ... 6 = Sat
    const hour = ist.getHours();
    const minute = ist.getMinutes();
    const timeNum = hour + minute / 60;

    const isOpen = day >= 1 && day <= 6 && timeNum >= 10 && timeNum < 19;
    return {
      isOpen,
      badgeText: isOpen ? 'Open Now (Closes 7:00 PM IST)' : 'After Hours (Reopens 10:00 AM)',
      subText: isOpen ? 'Live partner desk & in-person visits active' : 'Online inquiries prioritized & monitored 24/7',
    };
  }, []);

  const handleCopy = (text, fieldName, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2200);
  };

  const handleDownloadVCard = (e) => {
    e.preventDefault();
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Shree Chamunda Associates',
      'ORG:Shree Chamunda Associates (Chartered Tax Firm)',
      'TITLE:Senior Chartered Tax Consultants',
      'TEL;TYPE=WORK,VOICE:+919510984735',
      'EMAIL;TYPE=WORK:shreechamundaassociates0905@gmail.com',
      'ADR;TYPE=WORK:;;Hill Town Square, MG Road, near Ganesh Opera;Nikol;Ahmedabad;Gujarat;380049;India',
      'URL:https://shreechamundaassociates.com',
      'NOTE:Direct Tax, GST Scrutiny Defense, Statutory Audits & Turnkey Incorporation',
      'END:VCARD',
    ].join('\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Shree_Chamunda_Associates_CA.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleFaq = (idx) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  if (settingsLoading) {
    return (
      <div className="contact-page container py-5">
        <div className="skeleton skeleton-title" style={{ width: '30%', margin: '0 auto 40px' }}></div>
        <div className="contact-equal-two-col-grid">
          <div className="skeleton-card" style={{ height: '400px' }}></div>
          <div className="skeleton-card" style={{ height: '400px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page fade-in">
      {/* ============================================================
          EXECUTIVE HERO BANNER & 3-PILLAR REASSURANCE STRIP
          ============================================================ */}
      <div className="contact-hero">
        <div className="container">
          <div className="contact-hero-badge">
            <span className="live-dot"></span>
            <i className="fas fa-headset"></i>
            <span>Executive Consultation Chambers &bull; Nikol, Ahmedabad</span>
          </div>

          <h1>Direct Access to Chartered Tax Advisors</h1>
          <p>
            Schedule a 1-on-1 consultation for complex Income Tax notices, GST audits, corporate setup, or accounting retainers.
          </p>

          {/* 3-Pillar Institutional Reassurance Strip */}
          <div className="hero-reassurance-strip">
            <div className="reassurance-pill">
              <i className="fas fa-bolt"></i>
              <span>Rapid Callback (&lt; 30 Mins)</span>
            </div>
            <div className="reassurance-divider"></div>
            <div className="reassurance-pill">
              <i className="fas fa-shield-alt"></i>
              <span>100% Client Privilege &amp; NDA Bound</span>
            </div>
            <div className="reassurance-divider"></div>
            <div className="reassurance-pill">
              <i className="fas fa-balance-scale"></i>
              <span>ICAI Regulated Oversight</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          SYMMETRICAL 50/50 TWO-COLUMN BENTO ARCHITECTURE
          ============================================================ */}
      <div className="container contact-equal-two-col-grid">
        {/* ========================================================
            COLUMN 1 (50%): Direct Advisory Hub & Office Coordinates
            ======================================================== */}
        <div className="contact-col-half">
          {/* Direct Channels Bento Card */}
          <div className="contact-bento-card">
            {/* Symmetrical Top Executive Bar matching the right form tabs */}
            <div className="channels-top-bar">
              <div className={`channels-status-pill ${officeStatus.isOpen ? 'open' : 'after-hours'}`}>
                <span className="channels-pulse-dot"></span>
                <span>{officeStatus.badgeText}</span>
              </div>
              <div className="channels-top-tag">
                <i className="fas fa-map-marker-alt"></i>
                <span>Nikol &bull; Ahmedabad</span>
              </div>
            </div>

            <div className="contact-card-header executive-header-style">
              <div className="card-header-icon">
                <i className="fas fa-phone-volume"></i>
              </div>
              <div className="card-header-text">
                <span className="card-kicker">INSTITUTIONAL ADVISORY DESK</span>
                <h2>Speak Directly With Our Advisors</h2>
              </div>
            </div>

            <div className="contact-card-body">
              <p className="contact-intro-text">
                Connect directly with our senior chartered accountants. Whether you represent an emerging enterprise or require personal tax representation, we maintain prompt, transparent counsel.
              </p>

              <div className="info-cards-stack">
                {/* Direct Helpline Card with Call + Copy Buttons */}
                <div className="contact-interactive-card">
                  <div className="interactive-card-left">
                    <div className="channel-icon-box">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div className="channel-text-box">
                      <span className="channel-label">Direct CA Helpline</span>
                      <strong className="channel-primary-val">{phone}</strong>
                      <span className="channel-sub">{workingHours} IST</span>
                    </div>
                  </div>
                  <div className="channel-action-group">
                    <a href={`tel:${cleanPhone}`} className="btn-channel-action call" title="Call Now">
                      <i className="fas fa-phone-flip"></i> Call
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(phone, 'phone', e)}
                      className={`btn-channel-copy ${copiedField === 'phone' ? 'copied' : ''}`}
                      title="Copy Phone Number"
                    >
                      <i className={copiedField === 'phone' ? 'fas fa-check' : 'far fa-copy'}></i>
                      <span>{copiedField === 'phone' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Official Advisory Inbox with Email + Copy Buttons */}
                <div className="contact-interactive-card">
                  <div className="interactive-card-left">
                    <div className="channel-icon-box">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="channel-text-box">
                      <span className="channel-label">Official Advisory Inbox</span>
                      <strong className="channel-primary-val text-break-email">{email}</strong>
                      <span className="channel-sub">Inquiries acknowledged within 2-4 hours</span>
                    </div>
                  </div>
                  <div className="channel-action-group">
                    <a href={`mailto:${email}`} className="btn-channel-action mail" title="Send Email">
                      <i className="fas fa-paper-plane"></i> Write
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(email, 'email', e)}
                      className={`btn-channel-copy ${copiedField === 'email' ? 'copied' : ''}`}
                      title="Copy Email Address"
                    >
                      <i className={copiedField === 'email' ? 'fas fa-check' : 'far fa-copy'}></i>
                      <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Physical Office Card with Map + Copy Buttons */}
                <div className="contact-interactive-card">
                  <div className="interactive-card-left">
                    <div className="channel-icon-box">
                      <i className="fas fa-building"></i>
                    </div>
                    <div className="channel-text-box">
                      <span className="channel-label">Executive Headquarters</span>
                      <strong className="channel-primary-val">{address}</strong>
                      <span className="channel-sub">Open for scheduled in-person client sessions</span>
                    </div>
                  </div>
                  <div className="channel-action-group">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-channel-action map"
                      title="Open Google Maps"
                    >
                      <i className="fas fa-location-arrow"></i> Map
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(address, 'address', e)}
                      className={`btn-channel-copy ${copiedField === 'address' ? 'copied' : ''}`}
                      title="Copy Office Address"
                    >
                      <i className={copiedField === 'address' ? 'fas fa-check' : 'far fa-copy'}></i>
                      <span>{copiedField === 'address' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Save Contact Digital vCard Widget */}
                <div className="vcard-bento-widget">
                  <div className="vcard-widget-left">
                    <div className="vcard-icon-box">
                      <i className="fas fa-id-card-clip"></i>
                    </div>
                    <div className="vcard-text-box">
                      <strong>Save Firm Contact to Phone</strong>
                      <span>Direct CA numbers, email, and Nikol GPS coordinates (.vcf)</span>
                    </div>
                  </div>
                  <button type="button" onClick={handleDownloadVCard} className="btn-vcard-action">
                    <i className="fas fa-download"></i> Save Contact
                  </button>
                </div>

                {/* Clean, Executive WhatsApp Channel Card */}
                <div className="contact-interactive-card wa-channel-card">
                  <div className="interactive-card-left">
                    <div className="channel-icon-box wa-icon-box">
                      <i className="fab fa-whatsapp"></i>
                    </div>
                    <div className="channel-text-box">
                      <div className="wa-card-header-row">
                        <span className="channel-label">Direct WhatsApp Advisory</span>
                        <span className="wa-live-pill">
                          <span className="wa-pulse-dot"></span> Online
                        </span>
                      </div>
                      <strong className="channel-primary-val">Chat with Senior CA Partner</strong>
                      <span className="channel-sub">Direct notice triage &amp; estimates &bull; Typically &lt; 10 min response</span>
                    </div>
                  </div>
                  <div className="channel-action-group">
                    <a
                      href={defaultWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-channel-action wa-action-btn"
                      title="Chat on WhatsApp"
                    >
                      <i className="fab fa-whatsapp"></i> Chat &rarr;
                    </a>
                  </div>
                </div>

                {/* Minimalist Quick Prompts Bar */}
                <div className="wa-quick-prompts-bar">
                  <span className="prompts-title">Quick Topics:</span>
                  <div className="prompts-links-group">
                    <a
                      href={`https://wa.me/919510984735?text=${encodeURIComponent('Hello Shree Chamunda Associates, I received an Income Tax / GST Notice and need urgent CA assistance.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prompt-link"
                    >
                      🚨 Notice Defense
                    </a>
                    <span className="prompt-separator">&bull;</span>
                    <a
                      href={`https://wa.me/919510984735?text=${encodeURIComponent('Hello, I want to incorporate a new Company / LLP and need guidance.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prompt-link"
                    >
                      🏢 Company Setup
                    </a>
                    <span className="prompt-separator">&bull;</span>
                    <a
                      href={`https://wa.me/919510984735?text=${encodeURIComponent('Hello, I would like to file my annual Income Tax Return & plan my taxes.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prompt-link"
                    >
                      📄 ITR &amp; Tax Audit
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Office Map Bento Card with Transit Landmarks */}
          <div className="contact-bento-card">
            <div className="contact-card-header map-card-header">
              <div className="card-header-left">
                <div className="card-header-icon">
                  <i className="fas fa-map-marked-alt"></i>
                </div>
                <div className="card-header-text">
                  <span className="card-kicker">PHYSICAL OFFICE &bull; NIKOL</span>
                  <h2>Visit Our Ahmedabad Office</h2>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-get-directions"
                title="Get turn-by-turn navigation in Google Maps"
              >
                <i className="fas fa-directions"></i> Turn-by-Turn GPS
              </a>
            </div>

            <div className="contact-card-body map-body-wrap">
              {/* Landmark Cues */}
              <div className="office-landmarks-bar">
                <div className="landmark-pill">
                  <i className="fas fa-landmark"></i>
                  <span>Near Ganesh Opera, Nikol</span>
                </div>
                <div className="landmark-pill">
                  <i className="fas fa-car"></i>
                  <span>Dedicated Client Parking</span>
                </div>
                <div className="landmark-pill">
                  <i className="fas fa-road"></i>
                  <span>5 Mins from SP Ring Road</span>
                </div>
              </div>

              <div className="map-iframe-container">
                <iframe
                  title="Shree Chamunda Associates Location - Hill Town Square, Nikol, Ahmedabad"
                  src="https://maps.google.com/maps?q=Hill+Town+Square,+MG+Road,+near+Ganesh+Opera,+Nikol,+Ahmedabad,+Gujarat+380049&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="270"
                  style={{ border: 0, borderRadius: '12px', display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* Map Bottom Address Bar */}
              <div className="map-bottom-address-bar">
                <div className="map-address-left">
                  <i className="fas fa-map-pin"></i>
                  <span>{address}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleCopy(address, 'address', e)}
                  className={`btn-map-copy-pill ${copiedField === 'address' ? 'copied' : ''}`}
                >
                  <i className={copiedField === 'address' ? 'fas fa-check' : 'far fa-copy'}></i>
                  <span>{copiedField === 'address' ? 'Copied' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            COLUMN 2 (50%): Consultation Booking Form & Smart FAQs
            ======================================================== */}
        <div className="contact-col-half">
          {/* Executive Contact & Consultation Desk Form */}
          <ContactForm />

          {/* Quick FAQs Bento Card with Polished Accordion */}
          {faqs.length > 0 && (
            <div className="contact-bento-card">
              <div className="contact-card-header">
                <div className="card-header-icon">
                  <i className="fas fa-circle-question"></i>
                </div>
                <div className="card-header-text">
                  <span className="card-kicker">INSTITUTIONAL PROTOCOLS</span>
                  <h2>Consultation FAQs</h2>
                </div>
              </div>

              <div className="contact-card-body">
                <div className="contact-faq-stack">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaqIdx === idx;
                    const faqNum = String(idx + 1).padStart(2, '0');
                    return (
                      <div
                        key={faq._id || idx}
                        className={`contact-faq-item ${isOpen ? 'open' : ''}`}
                        onClick={() => toggleFaq(idx)}
                      >
                        <div className="contact-faq-question-row">
                          <div className="faq-num-and-title">
                            <span className="faq-index-tag">{faqNum}</span>
                            <h4>{faq.question}</h4>
                          </div>
                          <div className="faq-toggle-icon">
                            <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
                          </div>
                        </div>
                        {isOpen && (
                          <div className="contact-faq-answer-box fade-in">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="faq-footer-note">
                  <div className="faq-footer-icon">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <div className="faq-footer-text">
                    <strong>Need immediate notice defense or case representation?</strong>
                    <span>
                      Our senior tax attorneys and CAs are on call.{' '}
                      <a href={`tel:${cleanPhone}`}>Direct Hotline: {phone} &rarr;</a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
