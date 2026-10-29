import { useState, useMemo } from 'react';
import ContactForm from '../components/ContactForm';
import { useSiteContext } from '../context/SiteContext';
import './Contact.css';

const CONSULTATION_FAQS = [
  {
    _id: 'faq-1',
    question: 'How quickly will a Senior Tax Consultant review my inquiry or booking?',
    answer: 'Inquiries submitted during business hours (10:00 AM – 7:00 PM IST) are acknowledged within 30 minutes and triaged directly by our designated senior partners. For emergency statutory deadlines (< 48 hours), direct telephone priority is activated immediately.'
  },
  {
    _id: 'faq-2',
    question: 'Are our financial documents and discussions protected under client confidentiality?',
    answer: 'Every consultation is strictly governed by statutory client confidentiality standards, legal privilege, and institutional Non-Disclosure Agreements (NDAs). Your books of accounts, tax returns, and corporate disclosures remain 100% privileged.'
  },
  {
    _id: 'faq-3',
    question: 'Can advisory consultations be conducted virtually via Google Meet or Zoom?',
    answer: 'Yes. While we regularly host corporate clients at our Nikol, Ahmedabad chambers, founders and outstation taxpayers can select "Virtual Video" for end-to-end screen-share review of balance sheets, audit queries, and notice dossiers.'
  },
  {
    _id: 'faq-4',
    question: 'What documents should I prepare before our scheduled 1-on-1 consultation?',
    answer: 'For notice defense: keep the original DIN notice copy and prior 2–3 years filed ITR/GSTR ready. For new company incorporation: director KYC (PAN, Aadhaar) and registered office proof are sufficient. Our team provides an advance checklist upon booking.'
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

  const [activeTab, setActiveTab] = useState('inquiry'); // 'inquiry' | 'consultation'
  const [openFaqIdx, setOpenFaqIdx] = useState(0); // First FAQ open by default
  const [copiedField, setCopiedField] = useState(null);
  const [activeDocChecklist, setActiveDocChecklist] = useState('notice'); // 'notice' | 'corporate' | 'retainer'

  const phone = settings?.phone || '+91 95109 84735';
  const cleanPhone = '+919510984735';
  const email = settings?.email || 'shreechamundaassociates0905@gmail.com';
  const address = (settings?.address && !settings.address.includes('Zaveri') && !settings.address.includes('Kathwada') && !settings.address.includes('Singarva'))
    ? (settings.address.includes('612') ? settings.address : '612, ' + settings.address)
    : '612, Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad, Gujarat - 380049';
  const workingHours = settings?.workingHours || 'Mon - Sat: 10:00 AM - 7:00 PM';

  // Dynamic WhatsApp link tailored to the current active mode
  const dynamicWhatsappUrl = useMemo(() => {
    const text = activeTab === 'consultation'
      ? 'Hello Shree Chamunda Associates! I would like to schedule an Executive 1-on-1 Consultation with a Senior Tax Advisor.'
      : 'Hello Shree Chamunda Associates! I have a general tax inquiry and would like to speak with an advisor.';
    return `https://wa.me/919510984735?text=${encodeURIComponent(text)}`;
  }, [activeTab]);

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
      'ORG:Shree Chamunda Associates (Tax Advisory & Corporate Practice)',
      'TITLE:Senior Tax & Corporate Consultants',
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
    link.setAttribute('download', 'Shree_Chamunda_Associates_Advisory.vcf');
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
            Direct Access to <span className="title-burnished-gold">Senior Tax &amp; Corporate Advisors.</span>
          </h1>

          <p className="contact-subtitle">
            Schedule an executive 1-on-1 consultation for complex Income Tax notices, GST audits, corporate structuring, or accounting retainers under strict statutory fiduciary privilege.
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
              <span>Fiduciary Practice Standards</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. 4-CHANNEL QUICK ACCESS STRIP (Executive Symmetrical Tiles)
          ============================================================ */}
      <section className="contact-channels-strip-section container">
        <div className="channels-grid-4">
          {/* Card 1: Direct Helpline */}
          <div className="channel-quick-card tile-amber">
            <div className="channel-card-top-bar">
              <span className="channel-badge-chip badge-amber">
                <i className="fas fa-phone"></i> Direct Helpline
              </span>
              <button
                type="button"
                onClick={(e) => handleCopy(phone, 'phone-strip', e)}
                className={`card-copy-chip ${copiedField === 'phone-strip' ? 'copied' : ''}`}
                title="Copy Phone Number"
              >
                <i className={copiedField === 'phone-strip' ? 'fas fa-check' : 'far fa-copy'}></i>
                <span>{copiedField === 'phone-strip' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="channel-card-body-block">
              <div className="channel-hero-icon icon-amber">
                <i className="fas fa-phone-volume"></i>
              </div>
              <div className="channel-card-details">
                <span className="channel-kicker-label">Direct Practice Hotline</span>
                <strong className="channel-value-display">{phone}</strong>
              </div>
            </div>

            <p className="channel-operational-desc">
              <i className="far fa-clock"></i> {workingHours} IST &bull; Live triage
            </p>

            <a href={`tel:${cleanPhone}`} className="btn-channel-main btn-phone-action">
              <span>Call Practice Desk</span>
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          {/* Card 2: Official Advisory Inbox */}
          <div className="channel-quick-card tile-sapphire">
            <div className="channel-card-top-bar">
              <span className="channel-badge-chip badge-sapphire">
                <i className="fas fa-envelope"></i> Statutory Inbox
              </span>
              <button
                type="button"
                onClick={(e) => handleCopy(email, 'email-strip', e)}
                className={`card-copy-chip ${copiedField === 'email-strip' ? 'copied' : ''}`}
                title="Copy Email Address"
              >
                <i className={copiedField === 'email-strip' ? 'fas fa-check' : 'far fa-copy'}></i>
                <span>{copiedField === 'email-strip' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="channel-card-body-block">
              <div className="channel-hero-icon icon-sapphire">
                <i className="fas fa-envelope-open-text"></i>
              </div>
              <div className="channel-card-details">
                <span className="channel-kicker-label">Official Advisory Inbox</span>
                <strong className="channel-value-display email-val" title={email}>{email}</strong>
              </div>
            </div>

            <p className="channel-operational-desc">
              <i className="fas fa-bolt"></i> Inquiries acknowledged &lt; 2–4 business hours
            </p>

            <a href={`mailto:${email}`} className="btn-channel-main btn-mail-action">
              <span>Send Direct Email</span>
              <i className="fas fa-paper-plane"></i>
            </a>
          </div>

          {/* Card 3: Nikol Practice Chambers */}
          <div className="channel-quick-card tile-emerald">
            <div className="channel-card-top-bar">
              <span className="channel-badge-chip badge-emerald">
                <i className="fas fa-landmark"></i> Physical Chambers
              </span>
              <button
                type="button"
                onClick={(e) => handleCopy(address, 'address-strip', e)}
                className={`card-copy-chip ${copiedField === 'address-strip' ? 'copied' : ''}`}
                title="Copy Office Address"
              >
                <i className={copiedField === 'address-strip' ? 'fas fa-check' : 'far fa-copy'}></i>
                <span>{copiedField === 'address-strip' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="channel-card-body-block">
              <div className="channel-hero-icon icon-emerald">
                <i className="fas fa-building-columns"></i>
              </div>
              <div className="channel-card-details">
                <span className="channel-kicker-label">Practice Chambers &bull; Nikol</span>
                <strong className="channel-value-display">612, Hill Town Square</strong>
              </div>
            </div>

            <p className="channel-operational-desc">
              <i className="fas fa-square-parking"></i> Near Ganesh Opera &bull; Client parking
            </p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-channel-main btn-map-action"
            >
              <span>Open Google Maps</span>
              <i className="fas fa-location-arrow"></i>
            </a>
          </div>

          {/* Card 4: Live WhatsApp Advisory */}
          <div className="channel-quick-card tile-wa wa-accent-card">
            <div className="channel-card-top-bar">
              <span className="channel-badge-chip badge-wa">
                <i className="fab fa-whatsapp"></i> WhatsApp Channel
              </span>
              <span className="card-live-pulse-badge">
                <span className="wa-pulse-dot"></span> Online
              </span>
            </div>

            <div className="channel-card-body-block">
              <div className="channel-hero-icon icon-wa">
                <i className="fab fa-whatsapp"></i>
              </div>
              <div className="channel-card-details">
                <span className="channel-kicker-label">Direct WhatsApp Desk</span>
                <strong className="channel-value-display">Chat with Senior Advisor</strong>
              </div>
            </div>

            <p className="channel-operational-desc">
              <i className="fas fa-shield-halved"></i> Notice triage &bull; &lt; 10 min response
            </p>

            <a
              href={dynamicWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-channel-main btn-wa-action"
            >
              <span>Open WhatsApp Chat</span>
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. SYMMETRICAL 50/50 TWO-COLUMN COMMAND CENTER
             (Synchronized Left Dossier + Right Consultation Console)
          ============================================================ */}
      <section className="contact-main-console-section container">
        <div className="contact-equal-two-col-grid">
          {/* ========================================================
              COLUMN 1 (50%): Dynamic Fiduciary Dossier
              (Adapts seamlessly based on activeTab: Inquiry vs Consultation)
              ======================================================== */}
          <div className="contact-col-half">
            <div className="desk-dossier-card">
              {/* Symmetrical Top Bar matching Right Mode Tabs */}
              <div className="dossier-top-bar">
                <div className={`dossier-status-pill ${officeStatus.isOpen ? 'open' : 'after-hours'}`}>
                  <span className="dossier-pulse-dot"></span>
                  <span>{activeTab === 'consultation' ? 'Senior Partner Active Desk' : officeStatus.badgeText}</span>
                </div>
                <div className="dossier-location-tag">
                  <i className="fas fa-location-dot"></i>
                  <span>Nikol Chambers &bull; Ahmedabad</span>
                </div>
              </div>

              <div className="dossier-card-body">
                {activeTab === 'consultation' ? (
                  /* ============================================================
                     VIEW A: 1-ON-1 CONSULTATION PROTOCOL & PARTNER CHARTER
                     (Active when user clicks "Book 1-on-1 Session")
                     ============================================================ */
                  <div className="consultation-dossier-view fade-in">
                    <div className="dossier-header-block">
                      <div className="dossier-header-icon-wrap consultation-active-icon">
                        <i className="fas fa-calendar-check"></i>
                      </div>
                      <div className="dossier-header-text">
                        <span className="dossier-kicker">CONFIDENTIAL CONSULTATION PROTOCOL</span>
                        <h2>Senior Partner Advisory Charter</h2>
                      </div>
                    </div>

                    <p className="dossier-intro-paragraph">
                      Every scheduled consultation is conducted directly by a designated Senior Practice Partner. Prior to the session, our partners pre-audit your notice DIN, balance sheets, and filing history.
                    </p>

                    {/* 3-Phase Advisory Lifecycle */}
                    <div className="advisory-phase-timeline">
                      <div className="phase-timeline-item">
                        <div className="phase-marker">01</div>
                        <div className="phase-content">
                          <strong>Pre-Session Forensic Audit</strong>
                          <span>Notice assessment, prior 2-year ITR/GSTR analysis, and penalty exposure calculation before meeting.</span>
                        </div>
                      </div>

                      <div className="phase-timeline-item">
                        <div className="phase-marker">02</div>
                        <div className="phase-content">
                          <strong>45-Minute Partner Strategy Briefing</strong>
                          <span>Direct 1-on-1 session covering statutory defense, notice reply framing, or enterprise tax optimization.</span>
                        </div>
                      </div>

                      <div className="phase-timeline-item">
                        <div className="phase-marker">03</div>
                        <div className="phase-content">
                          <strong>Formal Action Memo &amp; Roadmap</strong>
                          <span>Delivery of an authoritative written legal opinion, statutory compliance roadmap, and fee clarity.</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Advance Document Checklist */}
                    <div className="doc-prep-helper-card">
                      <div className="helper-top-row">
                        <span className="helper-label">
                          <i className="fas fa-folder-open"></i> Advance Document Checklist:
                        </span>
                        <div className="helper-toggle-pills">
                          <button
                            type="button"
                            className={`helper-pill ${activeDocChecklist === 'notice' ? 'active' : ''}`}
                            onClick={() => setActiveDocChecklist('notice')}
                          >
                            Notice Defense
                          </button>
                          <button
                            type="button"
                            className={`helper-pill ${activeDocChecklist === 'corporate' ? 'active' : ''}`}
                            onClick={() => setActiveDocChecklist('corporate')}
                          >
                            Entity Setup
                          </button>
                          <button
                            type="button"
                            className={`helper-pill ${activeDocChecklist === 'retainer' ? 'active' : ''}`}
                            onClick={() => setActiveDocChecklist('retainer')}
                          >
                            Audit / Retainer
                          </button>
                        </div>
                      </div>

                      <div className="helper-content-pane">
                        {activeDocChecklist === 'notice' && (
                          <ul className="doc-checklist-bullets">
                            <li><i className="fas fa-check-circle"></i> Official DIN Notice copy from Income Tax or GST Portal</li>
                            <li><i className="fas fa-check-circle"></i> Computation of Income &amp; ITR-V for relevant Assessment Year</li>
                            <li><i className="fas fa-check-circle"></i> Supporting ledgers or bank statements questioned in notice</li>
                          </ul>
                        )}
                        {activeDocChecklist === 'corporate' && (
                          <ul className="doc-checklist-bullets">
                            <li><i className="fas fa-check-circle"></i> Director PAN, Aadhaar &amp; Passport/Voter ID KYC</li>
                            <li><i className="fas fa-check-circle"></i> Registered office electricity bill &amp; landlord NOC</li>
                            <li><i className="fas fa-check-circle"></i> Proposed company name choices &amp; main business objects</li>
                          </ul>
                        )}
                        {activeDocChecklist === 'retainer' && (
                          <ul className="doc-checklist-bullets">
                            <li><i className="fas fa-check-circle"></i> Current Tally / Zoho / ERP trial balance &amp; ledger export</li>
                            <li><i className="fas fa-check-circle"></i> Prior 12 months GSTR-1, GSTR-3B &amp; GSTR-2B reconciliation</li>
                            <li><i className="fas fa-check-circle"></i> Current accounting workflow &amp; voucher volume estimate</li>
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Statutory Client Privilege Bar */}
                    <div className="consultation-privilege-seal">
                      <div className="seal-icon">
                        <i className="fas fa-shield-halved"></i>
                      </div>
                      <div className="seal-text">
                        <strong>Protected Under Statutory Fiduciary Secrecy &amp; Mutual NDA</strong>
                        <span>Disclosures remain strictly confidential and protected from third-party discovery.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ============================================================
                     VIEW B: INSTITUTIONAL ADVISORY DESK & FIDUCIARY CHARTER
                     (Active in "General Inquiry" mode)
                     ============================================================ */
                  <div className="inquiry-dossier-view fade-in">
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
                      We practice absolute fiduciary transparency under statutory practice standards. Connect directly with senior tax advisors—no intermediary call centers, no junior delegation.
                    </p>

                    {/* 4 Fiduciary Checklist Items */}
                    <div className="fiduciary-checklist-stack">
                      <div className="fiduciary-check-item">
                        <div className="check-icon-disc">
                          <i className="fas fa-check"></i>
                        </div>
                        <div className="check-text-group">
                          <strong>Senior Partner Direct Representation</strong>
                          <span>Direct consultation and oversight by designated Senior Practice Principal.</span>
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

                    {/* Direct WhatsApp Topics Strip */}
                    <div className="dossier-prompts-block">
                      <span className="prompts-kicker">DIRECT WHATSAPP TOPICS:</span>
                      <div className="prompts-pill-row">
                        <a
                          href={`https://wa.me/919510984735?text=${encodeURIComponent('Hello Shree Chamunda Associates, I received an Income Tax / GST Notice and need urgent statutory assistance.')}`}
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
                          <i className="fas fa-certificate"></i> Fiduciary Practice Charter
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
                            <strong>Partner Oversight</strong>
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
                          <span>Direct chambers numbers, email, and Nikol GPS coordinates (.vcf)</span>
                        </div>
                      </div>
                      <button type="button" onClick={handleDownloadVCard} className="btn-vcard-download">
                        <i className="fas fa-download"></i> Save Contact (.vcf)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================
              COLUMN 2 (50%): Executive Consultation & Intake Form
              (Synchronized via activeTab state with Left Column)
              ======================================================== */}
          <div className="contact-col-half">
            <ContactForm activeTab={activeTab} onTabChange={setActiveTab} />
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
            <p>Clear, binding policies regarding advisory sessions, confidentiality, and statutory representation under professional regulatory standards.</p>
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
