import { useState, useMemo } from 'react';
import ContactForm from '../components/ContactForm';
import { useSiteContext } from '../context/SiteContext';
import './Contact.css';

const CONSULTATION_FAQS = [
  {
    _id: 'faq-1',
    question: 'How quickly will a Senior Chartered Accountant review my inquiry?',
    answer: 'Inquiries submitted during business hours (10:00 AM – 7:00 PM IST) are acknowledged within 30 minutes and triaged directly by our senior partners. For emergency statutory deadlines (< 48 hours), direct telephone priority is activated immediately.'
  },
  {
    _id: 'faq-2',
    question: 'Are our financial documents and discussions protected under client confidentiality?',
    answer: 'Every consultation is strictly governed by statutory client confidentiality regulations of the Institute of Chartered Accountants of India (ICAI) and institutional Non-Disclosure Agreements (NDAs). Your books of accounts, tax returns, and corporate disclosures remain 100% privileged.'
  },
  {
    _id: 'faq-3',
    question: 'Can advisory consultations be conducted virtually via Google Meet or Zoom?',
    answer: 'Yes. While we regularly host clients at our Nikol, Ahmedabad chambers, corporate founders and outstation taxpayers can select "Virtual Video" for end-to-end screen-share review of balance sheets, audit queries, and notice dossiers.'
  },
  {
    _id: 'faq-4',
    question: 'What documents should I prepare before our scheduled consultation?',
    answer: 'For notice defense: keep the original DIN notice copy and prior filed ITR/GSTR ready. For new company incorporation or GST retainers: basic director KYC (PAN, Aadhaar) and registered office proof are sufficient. Our team provides an advance checklist upon booking.'
  },
  {
    _id: 'faq-5',
    question: 'Do you handle emergency tax scrutiny notices with imminent statutory deadlines?',
    answer: 'Yes. If you are facing an assessment order deadline within 48 to 72 hours under Section 148, 144, or GST DRC-01, select "Urgent Notice < 48h" on the intake form or call our direct emergency desk hotline for immediate partner intervention.'
  }
];

const Contact = () => {
  const { settings, loading: settingsLoading } = useSiteContext();
  const faqs = CONSULTATION_FAQS;

  const [openFaqIdx, setOpenFaqIdx] = useState(0); // First FAQ open by default
  const [copiedField, setCopiedField] = useState(null);

  const phone = settings?.phone || '+91 95109 84735';
  const cleanPhone = '+919510984735';
  const email = settings?.email || 'shreechamundaassociates0905@gmail.com';
  const address = (settings?.address && !settings.address.includes('Zaveri') && !settings.address.includes('Kathwada') && !settings.address.includes('Singarva'))
    ? (settings.address.includes('612') ? settings.address : '612, ' + settings.address)
    : '612, Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad, Gujarat - 380049';
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
      'ADR;TYPE=WORK:;;612,Hill Town Square, MG Road, near Ganesh Opera;Nikol;Ahmedabad;Gujarat;380049;India',
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
          1. EDITORIAL SWISS FINTECH HERO SECTION (With Pinstripe Grid)
          ============================================================ */}
      <section className="contact-hero-section">
        <div className="contact-grid-overlay" aria-hidden="true"></div>

        <div className="contact-hero-container">
          <div className="contact-eyebrow-badge">
            <span className="contact-live-dot pulse"></span>
            <i className="fas fa-landmark"></i>
            <span>EXECUTIVE CONSULTATION CHAMBERS &bull; NIKOL, AHMEDABAD</span>
          </div>

          <h1 className="contact-main-title">
            Direct Access to <span className="title-burnished-gold">Chartered Tax Advisors.</span>
          </h1>

          <p className="contact-subtitle">
            Schedule an executive 1-on-1 consultation for complex Income Tax notices, GST audits, corporate structuring, or accounting retainers under strict ICAI fiduciary privilege.
          </p>

          {/* 3-Pillar Institutional Reassurance Strip */}
          <div className="hero-reassurance-strip">
            <div className="reassurance-pill">
              <i className="fas fa-bolt"></i>
              <span>Rapid Triage (&lt; 30 Mins)</span>
            </div>
            <div className="reassurance-divider"></div>
            <div className="reassurance-pill">
              <i className="fas fa-shield-halved"></i>
              <span>100% Client Privilege &amp; NDA Bound</span>
            </div>
            <div className="reassurance-divider"></div>
            <div className="reassurance-pill">
              <i className="fas fa-scale-balanced"></i>
              <span>ICAI Regulated Practice</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. 4-CHANNEL QUICK ACCESS STRIP (1-Click Actions & Copy)
          ============================================================ */}
      <section className="contact-channels-strip-section container">
        <div className="channels-grid-4">
          {/* Card 1: Direct Helpline */}
          <div className="channel-quick-card">
            <div className="channel-quick-header">
              <div className="channel-icon-circle icon-amber">
                <i className="fas fa-phone-volume"></i>
              </div>
              <div className="channel-meta-text">
                <span className="channel-micro-label">DIRECT CA HELPLINE</span>
                <strong className="channel-main-val">{phone}</strong>
              </div>
            </div>
            <p className="channel-quick-desc">{workingHours} IST &bull; Live triage</p>
            <div className="channel-quick-actions">
              <a href={`tel:${cleanPhone}`} className="btn-quick-primary btn-call">
                <i className="fas fa-phone"></i> Call Now
              </a>
              <button
                type="button"
                onClick={(e) => handleCopy(phone, 'phone-strip', e)}
                className={`btn-quick-secondary ${copiedField === 'phone-strip' ? 'copied' : ''}`}
                title="Copy Phone Number"
              >
                <i className={copiedField === 'phone-strip' ? 'fas fa-check' : 'far fa-copy'}></i>
                <span>{copiedField === 'phone-strip' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Official Advisory Inbox */}
          <div className="channel-quick-card">
            <div className="channel-quick-header">
              <div className="channel-icon-circle icon-sapphire">
                <i className="fas fa-envelope-open-text"></i>
              </div>
              <div className="channel-meta-text">
                <span className="channel-micro-label">OFFICIAL STATUTORY INBOX</span>
                <strong className="channel-main-val email-truncate" title={email}>{email}</strong>
              </div>
            </div>
            <p className="channel-quick-desc">Inquiries triaged within 2–4 business hours</p>
            <div className="channel-quick-actions">
              <a href={`mailto:${email}`} className="btn-quick-primary btn-mail">
                <i className="fas fa-paper-plane"></i> Send Email
              </a>
              <button
                type="button"
                onClick={(e) => handleCopy(email, 'email-strip', e)}
                className={`btn-quick-secondary ${copiedField === 'email-strip' ? 'copied' : ''}`}
                title="Copy Email Address"
              >
                <i className={copiedField === 'email-strip' ? 'fas fa-check' : 'far fa-copy'}></i>
                <span>{copiedField === 'email-strip' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Card 3: Nikol Practice Chambers */}
          <div className="channel-quick-card">
            <div className="channel-quick-header">
              <div className="channel-icon-circle icon-emerald">
                <i className="fas fa-building-columns"></i>
              </div>
              <div className="channel-meta-text">
                <span className="channel-micro-label">PHYSICAL CHAMBERS</span>
                <strong className="channel-main-val">612, Hill Town Square</strong>
              </div>
            </div>
            <p className="channel-quick-desc">Nikol, Ahmedabad &bull; Client parking available</p>
            <div className="channel-quick-actions">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-quick-primary btn-map"
              >
                <i className="fas fa-location-arrow"></i> Google Maps
              </a>
              <button
                type="button"
                onClick={(e) => handleCopy(address, 'address-strip', e)}
                className={`btn-quick-secondary ${copiedField === 'address-strip' ? 'copied' : ''}`}
                title="Copy Office Address"
              >
                <i className={copiedField === 'address-strip' ? 'fas fa-check' : 'far fa-copy'}></i>
                <span>{copiedField === 'address-strip' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Card 4: Live WhatsApp Advisory */}
          <div className="channel-quick-card wa-accent-card">
            <div className="channel-quick-header">
              <div className="channel-icon-circle icon-wa">
                <i className="fab fa-whatsapp"></i>
              </div>
              <div className="channel-meta-text">
                <div className="wa-title-row">
                  <span className="channel-micro-label">DIRECT WHATSAPP</span>
                  <span className="live-wa-badge">
                    <span className="wa-pulse-dot"></span> Online
                  </span>
                </div>
                <strong className="channel-main-val">Chat with Senior CA</strong>
              </div>
            </div>
            <p className="channel-quick-desc">Notice triage &amp; estimates &bull; &lt; 10 min response</p>
            <div className="channel-quick-actions">
              <a
                href={defaultWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-quick-primary btn-wa"
              >
                <i className="fab fa-whatsapp"></i> Open WhatsApp &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. SYMMETRICAL 50/50 TWO-COLUMN COMMAND CENTER
          ============================================================ */}
      <section className="contact-main-console-section container">
        <div className="contact-equal-two-col-grid">
          {/* ========================================================
              COLUMN 1 (50%): Executive Partner Desk & Chambers Dossier
              ======================================================== */}
          <div className="contact-col-half">
            <div className="desk-dossier-card">
              {/* Top Bar matching Right Form Tabs */}
              <div className="dossier-top-bar">
                <div className={`dossier-status-pill ${officeStatus.isOpen ? 'open' : 'after-hours'}`}>
                  <span className="dossier-pulse-dot"></span>
                  <span>{officeStatus.badgeText}</span>
                </div>
                <div className="dossier-location-tag">
                  <i className="fas fa-location-dot"></i>
                  <span>Nikol Chambers &bull; Ahmedabad</span>
                </div>
              </div>

              <div className="dossier-card-body">
                {/* Header Block */}
                <div className="dossier-header-block">
                  <div className="dossier-header-icon-wrap">
                    <i className="fas fa-scale-balanced"></i>
                  </div>
                  <div className="dossier-header-text">
                    <span className="dossier-kicker">INSTITUTIONAL ADVISORY DESK</span>
                    <h2>Speak Directly With Designated Partners</h2>
                  </div>
                </div>

                <p className="dossier-intro-paragraph">
                  We practice absolute fiduciary transparency under ICAI ethics. Connect directly with senior chartered accountants—no intermediary call centers, no junior delegation.
                </p>

                {/* 4 Fiduciary Checklist Items (Matching Proposal Standard) */}
                <div className="fiduciary-checklist-stack">
                  <div className="fiduciary-check-item">
                    <div className="check-icon-disc">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="check-text-group">
                      <strong>Senior Partner Direct Representation</strong>
                      <span>Direct consultation and oversight by designated Fellow Chartered Accountant (FCA).</span>
                    </div>
                  </div>

                  <div className="fiduciary-check-item">
                    <div className="check-icon-disc">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="check-text-group">
                      <strong>Mutual Non-Disclosure Guarantee</strong>
                      <span>Statutory client secrecy and non-disclosure agreement prior to inspecting books or notice dossiers.</span>
                    </div>
                  </div>

                  <div className="fiduciary-check-item">
                    <div className="check-icon-disc">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="check-text-group">
                      <strong>Fixed Retainers, Zero Surcharges</strong>
                      <span>Upfront fee certainty with zero hidden hourly billable charges or surprise compliance surcharges.</span>
                    </div>
                  </div>

                  <div className="fiduciary-check-item">
                    <div className="check-icon-disc">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="check-text-group">
                      <strong>Virtual &amp; In-Chambers Flexibility</strong>
                      <span>Encrypted HD screen-sharing via Google Meet or private conference room sessions in Nikol.</span>
                    </div>
                  </div>
                </div>

                {/* Quick Practice Topics Strip */}
                <div className="dossier-prompts-block">
                  <span className="prompts-kicker">DIRECT WHATSAPP TOPICS:</span>
                  <div className="prompts-pill-row">
                    <a
                      href={`https://wa.me/919510984735?text=${encodeURIComponent('Hello Shree Chamunda Associates, I received an Income Tax / GST Notice and need urgent CA assistance.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prompt-chip"
                    >
                      <i className="fas fa-shield-halved"></i> Notice Defense (&lt; 48h)
                    </a>
                    <a
                      href={`https://wa.me/919510984735?text=${encodeURIComponent('Hello, I want to incorporate a new Company / LLP and need guidance.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prompt-chip"
                    >
                      <i className="fas fa-building"></i> Company Setup
                    </a>
                    <a
                      href={`https://wa.me/919510984735?text=${encodeURIComponent('Hello, I would like to file my annual Income Tax Return & plan my taxes.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prompt-chip"
                    >
                      <i className="fas fa-file-invoice-dollar"></i> ITR &amp; Tax Audit
                    </a>
                    <a
                      href={`https://wa.me/919510984735?text=${encodeURIComponent('Hello, I am interested in Corporate GST & Accounting Retainers for our business.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prompt-chip"
                    >
                      <i className="fas fa-handshake"></i> Corporate Retainer
                    </a>
                  </div>
                </div>

                {/* Fiduciary Response SLA Box */}
                <div className="dossier-sla-box">
                  <div className="sla-top-line">
                    <span className="sla-badge-tag">
                      <i className="fas fa-certificate"></i> ICAI Fiduciary Charter
                    </span>
                    <span className="sla-guarantee-tag">
                      <span className="pulse-dot-green"></span> Guaranteed SLA
                    </span>
                  </div>
                  <div className="sla-columns-grid">
                    <div className="sla-col-item">
                      <div className="sla-mini-icon"><i className="fas fa-bolt"></i></div>
                      <div className="sla-info">
                        <strong>&lt; 30 Mins Callback</strong>
                        <span>Business hours triage</span>
                      </div>
                    </div>
                    <div className="sla-col-item">
                      <div className="sla-mini-icon"><i className="fas fa-user-lock"></i></div>
                      <div className="sla-info">
                        <strong>Mutual NDA Bound</strong>
                        <span>Statutory secrecy</span>
                      </div>
                    </div>
                    <div className="sla-col-item">
                      <div className="sla-mini-icon"><i className="fas fa-user-tie"></i></div>
                      <div className="sla-info">
                        <strong>FCA Oversight</strong>
                        <span>Zero junior delegation</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Contact Digital vCard Widget */}
                <div className="dossier-vcard-widget">
                  <div className="vcard-widget-info">
                    <div className="vcard-icon-frame">
                      <i className="fas fa-id-card-clip"></i>
                    </div>
                    <div className="vcard-text-group">
                      <strong>Save Firm Contact to Phone</strong>
                      <span>Direct CA numbers, email, and Nikol GPS coordinates (.vcf)</span>
                    </div>
                  </div>
                  <button type="button" onClick={handleDownloadVCard} className="btn-vcard-download">
                    <i className="fas fa-download"></i> Save Contact (.vcf)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              COLUMN 2 (50%): Executive Consultation & Intake Form
              ======================================================== */}
          <div className="contact-col-half">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ============================================================
          4. ARCHITECTURAL CHAMBERS & TRANSIT SECTION
          ============================================================ */}
      <section className="contact-chambers-section container">
        <div className="chambers-editorial-card">
          <div className="chambers-narrative-col">
            <div className="chambers-eyebrow-tag">
              <i className="fas fa-location-dot"></i>
              <span>PHYSICAL PRESENCE &bull; CENTRAL CHAMBERS</span>
            </div>
            <h2>Our Ahmedabad Practice Chambers</h2>
            <p className="chambers-lead-text">
              We welcome corporate directors, founders, and individual taxpayers for scheduled in-person advisory sessions at our Nikol chambers.
            </p>

            <div className="chambers-specs-list">
              <div className="chambers-spec-item">
                <div className="chambers-spec-icon">
                  <i className="fas fa-landmark-dome"></i>
                </div>
                <div className="chambers-spec-content">
                  <span className="spec-label">OFFICIAL CHAMBERS ADDRESS</span>
                  <strong className="spec-value">{address}</strong>
                  <span className="spec-subnote">Official Practice Chambers &bull; Nikol Central Hub</span>
                </div>
              </div>

              <div className="chambers-spec-item">
                <div className="chambers-spec-icon">
                  <i className="far fa-clock"></i>
                </div>
                <div className="chambers-spec-content">
                  <span className="spec-label">ADVISORY CONSULTATION HOURS</span>
                  <strong className="spec-value">{workingHours} IST</strong>
                  <div className="spec-meta-row">
                    <span className={`status-micro-dot ${officeStatus.isOpen ? 'open' : 'after-hours'}`}></span>
                    <span className="status-meta-text">{officeStatus.badgeText}</span>
                  </div>
                </div>
              </div>

              <div className="chambers-spec-item">
                <div className="chambers-spec-icon">
                  <i className="fas fa-phone-volume"></i>
                </div>
                <div className="chambers-spec-content">
                  <span className="spec-label">DIRECT PRACTICE HOTLINE</span>
                  <strong className="spec-value">
                    <a href={`tel:${cleanPhone}`}>{phone}</a>
                  </strong>
                  <span className="spec-subnote">Direct Partner Desk &bull; Immediate Notice &amp; Audit Triage</span>
                </div>
              </div>

              <div className="chambers-spec-item">
                <div className="chambers-spec-icon">
                  <i className="fas fa-envelope-open-text"></i>
                </div>
                <div className="chambers-spec-content">
                  <span className="spec-label">OFFICIAL STATUTORY INBOX</span>
                  <strong className="spec-value">
                    <a href={`mailto:${email}`}>{email}</a>
                  </strong>
                  <span className="spec-subnote">Case Files &amp; Documentation &bull; Priority SLA Response</span>
                </div>
              </div>
            </div>

            <div className="office-landmarks-row">
              <span className="landmark-chip"><i className="fas fa-landmark"></i> Near Ganesh Opera, Nikol</span>
              <span className="landmark-chip"><i className="fas fa-square-parking"></i> Dedicated Client Parking</span>
              <span className="landmark-chip"><i className="fas fa-route"></i> 5 Mins from SP Ring Road</span>
              <span className="landmark-chip"><i className="fas fa-shield-halved"></i> 100% Client Privilege</span>
            </div>

            <div className="chambers-cta-row">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-directions-primary"
              >
                <i className="fas fa-location-arrow"></i>
                <span>Open Google Maps Directions</span>
              </a>
              <button
                type="button"
                onClick={(e) => handleCopy(address, 'address-chambers', e)}
                className={`btn-directions-secondary ${copiedField === 'address-chambers' ? 'copied' : ''}`}
              >
                <i className={copiedField === 'address-chambers' ? 'fas fa-check' : 'far fa-copy'}></i>
                <span>{copiedField === 'address-chambers' ? 'Address Copied!' : 'Copy Chamber Address'}</span>
              </button>
            </div>
          </div>

          <div className="chambers-map-col">
            {/* Floating Verified Chambers Pin Card */}
            <div className="chambers-floating-badge">
              <div className="badge-pin-icon">
                <i className="fas fa-location-dot"></i>
              </div>
              <div className="badge-text-box">
                <strong>Shree Chamunda Chambers</strong>
                <span>612, Hill Town Square &bull; Nikol, Ahmedabad</span>
              </div>
              <span className="badge-live-tag">
                <span className="pulse-dot-green"></span> Verified Hub
              </span>
            </div>

            <div className="map-frame-box">
              <iframe
                title="Shree Chamunda Associates Practice Chambers - Nikol, Ahmedabad"
                src="https://maps.google.com/maps?q=612,+Hill+Town+Square,+MG+Road,+near+Ganesh+Opera,+Nikol,+Ahmedabad,+Gujarat+380049&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '480px', display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Bottom GPS Navigation Strip */}
            <div className="chambers-map-status-strip">
              <span className="map-status-item">
                <i className="fas fa-satellite"></i> High-Precision GPS Synced
              </span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-open-link"
              >
                Navigate Live <i className="fas fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. INSTITUTIONAL CONSULTATION PROTOCOLS & FAQS (Image 3 Style)
          ============================================================ */}
      {faqs.length > 0 && (
        <section className="contact-faqs-section container">
          <div className="faqs-section-header">
            <div className="faqs-eyebrow-badge">
              <i className="fas fa-circle-question"></i>
              <span>REGULATORY ETHICS &bull; FAQS</span>
            </div>
            <h2>Frequently Asked Questions on Consultations</h2>
            <p>Clear, binding policies regarding advisory sessions, confidentiality, and statutory representation under ICAI standards.</p>
          </div>

          <div className="faqs-accordion-wrapper">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              const faqNum = String(idx + 1).padStart(2, '0');
              return (
                <div
                  key={faq._id || idx}
                  className={`faq-accordion-card ${isOpen ? 'open' : ''}`}
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="faq-question-bar">
                    <div className="faq-title-group">
                      <span className="faq-number-badge">{faqNum}</span>
                      <h3>{faq.question}</h3>
                    </div>
                    <div className="faq-chevron-icon">
                      <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="faq-answer-pane fade-in">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="faqs-emergency-banner">
            <div className="emergency-icon"><i className="fas fa-shield-halved"></i></div>
            <div className="emergency-text">
              <strong>Facing an Urgent Statutory Assessment or IT / GST Notice Deadline?</strong>
              <p>Our senior direct tax attorneys and CAs prioritize urgent notice triage within 30 minutes.</p>
            </div>
            <a href={`tel:${cleanPhone}`} className="btn-emergency-hotline">
              <i className="fas fa-phone-volume"></i>
              <span>Direct Emergency Desk: {phone}</span>
            </a>
          </div>
        </section>
      )}
    </div>
  );
};

export default Contact;
