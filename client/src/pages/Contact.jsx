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
        {/* Top Gold Glowing Accent Divider & Ambient Orbs */}
        <div className="contact-top-accent-line" aria-hidden="true"></div>
        <div className="contact-grid-overlay" aria-hidden="true"></div>
        <div className="contact-ambient-orb orb-gold" aria-hidden="true"></div>

        <div className="contact-hero-container">
          <span className="header-watermark" aria-hidden="true">CHAMBERS</span>
          <div className="luxury-header-halo" aria-hidden="true"></div>
          <div className="contact-eyebrow-badge">
            <span className="badge-index-chip">01</span>
            <span className="badge-pulse-dot" aria-hidden="true"></span>
            <i className="fas fa-landmark"></i>
            <span>EXECUTIVE CONSULTATION CHAMBERS &bull; NIKOL, AHMEDABAD</span>
          </div>

          <h1 className="contact-main-title">
            Direct Access to <br className="hidden-mobile" />
            <span className="title-gradient-gold">Senior Tax &amp; Corporate Advisors.</span>
          </h1>

          <p className="contact-subtitle">
            Schedule an executive 1-on-1 consultation for complex Income Tax notices, GST audits, corporate structuring, or accounting retainers under strict statutory fiduciary privilege.
          </p>

          {/* 3-Pillar Institutional Reassurance Strip */}
          <div className="header-assurance-strip">
            <span className="assurance-pill">
              <i className="fas fa-bolt"></i> Rapid Triage (&lt; 30 Mins)
            </span>
            <span className="assurance-pill">
              <i className="fas fa-shield-halved"></i> 100% Client Privilege &amp; NDA Bound
            </span>
            <span className="assurance-pill">
              <i className="fas fa-scale-balanced"></i> Fiduciary Practice Standards
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. 4-CHANNEL EXECUTIVE COMMUNICATIONS GRID (Chambers Master Standard)
          ============================================================ */}
      <section className="contact-channels-strip-section container" aria-label="Official Practice Communication Channels">
        <div className="channels-master-grid">
          {/* Channel 1: Partner Direct Helpline */}
          <article className="chambers-contact-card card-amber">
            <div className="card-top-hairline" aria-hidden="true"></div>

            <div className="card-header-row">
              <div className="card-header-left">
                <div className="channel-icon-disc amber">
                  <i className="fa-solid fa-phone-volume"></i>
                </div>
                <div className="channel-title-meta">
                  <span className="channel-kicker amber">CHANNEL 01 &bull; DIRECT LINE</span>
                  <h3 className="channel-heading">Senior Partner Hotline</h3>
                </div>
              </div>

              <div className="card-header-actions">
                <div className="channel-status-pill amber">
                  <span className="status-live-dot amber"></span>
                  <span>&lt; 15M SLA</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleCopy(phone, 'phone-strip', e)}
                  className={`channel-copy-btn ${copiedField === 'phone-strip' ? 'copied' : ''}`}
                  title="Copy Phone Number"
                  aria-label="Copy Phone Number"
                >
                  <i className={copiedField === 'phone-strip' ? 'fa-solid fa-check text-emerald' : 'fa-regular fa-copy'}></i>
                  <span>{copiedField === 'phone-strip' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <p className="channel-summary-text">
              Direct telephonic triage with senior corporate tax counsel for time-critical statutory notices and appellate deadlines.
            </p>

            <div className="channel-value-display-box">
              <div className="value-label-group">
                <span className="value-kicker">DIRECT PRACTICE LINE</span>
                <strong className="value-primary-text">{phone}</strong>
              </div>
              <span className="value-tag-badge">Zero Call Center Wait</span>
            </div>

            <div className="channel-meta-footer">
              <div className="footer-spec-item">
                <i className="fa-regular fa-clock"></i>
                <span>Mon &ndash; Sat: 10:00 AM &ndash; 7:00 PM IST</span>
              </div>
              <div className="footer-spec-item">
                <i className="fa-solid fa-shield-halved text-amber"></i>
                <span>Senior Partner Oversight</span>
              </div>
            </div>

            <div className="channel-action-row">
              <a href={`tel:${cleanPhone}`} className="btn-chambers-action btn-amber">
                <span>Call Practice Desk</span>
                <div className="btn-arrow-disc amber-disc">
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </a>
            </div>
          </article>

          {/* Channel 2: Official Statutory & Legal Inbox */}
          <article className="chambers-contact-card card-sapphire">
            <div className="card-top-hairline" aria-hidden="true"></div>

            <div className="card-header-row">
              <div className="card-header-left">
                <div className="channel-icon-disc sapphire">
                  <i className="fa-solid fa-envelope-open-text"></i>
                </div>
                <div className="channel-title-meta">
                  <span className="channel-kicker sapphire">CHANNEL 02 &bull; OFFICIAL INBOX</span>
                  <h3 className="channel-heading">Official Statutory &amp; Legal Inbox</h3>
                </div>
              </div>

              <div className="card-header-actions">
                <div className="channel-status-pill sapphire">
                  <i className="fa-regular fa-clock" style={{ fontSize: '10px' }}></i>
                  <span>&lt; 2&ndash;4H SLA</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleCopy(email, 'email-strip', e)}
                  className={`channel-copy-btn ${copiedField === 'email-strip' ? 'copied' : ''}`}
                  title="Copy Official Email"
                  aria-label="Copy Official Email"
                >
                  <i className={copiedField === 'email-strip' ? 'fa-solid fa-check text-emerald' : 'fa-regular fa-copy'}></i>
                  <span>{copiedField === 'email-strip' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <p className="channel-summary-text">
              Direct partner ingestion for notice dossiers, audit financial statements, and corporate structuring briefs.
            </p>

            <div className="channel-value-display-box">
              <div className="value-label-group">
                <span className="value-kicker">PRACTICE INGESTION LINE</span>
                <strong className="value-primary-text email-text" title={email}>{email}</strong>
              </div>
              <span className="value-tag-badge">Confidential Intake</span>
            </div>

            <div className="channel-meta-footer">
              <div className="footer-spec-item">
                <i className="fa-solid fa-shield-halved text-sapphire"></i>
                <span>Protected Under Statutory Fiduciary Privilege</span>
              </div>
              <div className="footer-spec-item">
                <i className="fa-solid fa-file-shield text-sapphire"></i>
                <span>Formal Notice Dossier Review</span>
              </div>
            </div>

            <div className="channel-action-row">
              <a href={`mailto:${email}`} className="btn-chambers-action btn-sapphire">
                <span>Send Direct Email</span>
                <div className="btn-arrow-disc sapphire-disc">
                  <i className="fa-solid fa-paper-plane"></i>
                </div>
              </a>
            </div>
          </article>

          {/* Channel 3: Physical Practice Chambers */}
          <article className="chambers-contact-card card-emerald">
            <div className="card-top-hairline" aria-hidden="true"></div>

            <div className="card-header-row">
              <div className="card-header-left">
                <div className="channel-icon-disc emerald">
                  <i className="fa-solid fa-building-columns"></i>
                </div>
                <div className="channel-title-meta">
                  <span className="channel-kicker emerald">CHANNEL 03 &bull; PHYSICAL CHAMBERS</span>
                  <h3 className="channel-heading">Ahmedabad Practice Chambers</h3>
                </div>
              </div>

              <div className="card-header-actions">
                <div className="channel-status-pill emerald">
                  <span className="status-live-dot emerald"></span>
                  <span>Physical Hub</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleCopy(address, 'address-strip', e)}
                  className={`channel-copy-btn ${copiedField === 'address-strip' ? 'copied' : ''}`}
                  title="Copy Chambers Address"
                  aria-label="Copy Chambers Address"
                >
                  <i className={copiedField === 'address-strip' ? 'fa-solid fa-check text-emerald' : 'fa-regular fa-copy'}></i>
                  <span>{copiedField === 'address-strip' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <p className="channel-summary-text">
              In-person executive boardroom consultations, forensic reconciliation reviews, and physical mandate sign-offs.
            </p>

            <div className="channel-value-display-box">
              <div className="value-label-group">
                <span className="value-kicker">CHAMBERS HEADQUARTERS</span>
                <strong className="value-primary-text">612, Hill Town Square</strong>
              </div>
              <span className="value-tag-badge">Client Parking Reserved</span>
            </div>

            <div className="channel-meta-footer">
              <div className="footer-spec-item">
                <i className="fa-solid fa-location-dot text-emerald"></i>
                <span>Nikol Central, Ahmedabad &ndash; 380049</span>
              </div>
              <div className="footer-spec-item">
                <i className="fa-solid fa-handshake text-emerald"></i>
                <span>Private Boardroom Consultations</span>
              </div>
            </div>

            <div className="channel-action-row">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-chambers-action btn-emerald"
              >
                <span>Open Google Maps</span>
                <div className="btn-arrow-disc emerald-disc">
                  <i className="fa-solid fa-location-arrow"></i>
                </div>
              </a>
            </div>
          </article>

          {/* Channel 4: Priority WhatsApp Channel */}
          <article className="chambers-contact-card card-wa">
            <div className="card-top-hairline" aria-hidden="true"></div>

            <div className="card-header-row">
              <div className="card-header-left">
                <div className="channel-icon-disc wa">
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <div className="channel-title-meta">
                  <span className="channel-kicker wa">CHANNEL 04 &bull; REAL-TIME DESK</span>
                  <h3 className="channel-heading">Priority WhatsApp Channel</h3>
                </div>
              </div>

              <div className="card-header-actions">
                <div className="channel-status-pill wa">
                  <span className="status-live-dot green"></span>
                  <span>Online Now</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleCopy(phone, 'wa-strip', e)}
                  className={`channel-copy-btn ${copiedField === 'wa-strip' ? 'copied' : ''}`}
                  title="Copy WhatsApp Number"
                  aria-label="Copy WhatsApp Number"
                >
                  <i className={copiedField === 'wa-strip' ? 'fa-solid fa-check text-emerald' : 'fa-regular fa-copy'}></i>
                  <span>{copiedField === 'wa-strip' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <p className="channel-summary-text">
              Instant encrypted dispatch with senior practice advisors for rapid assessment of notices received from ITD or GSTN.
            </p>

            <div className="channel-value-display-box">
              <div className="value-label-group">
                <span className="value-kicker">ACTIVE ADVISORY DISPATCH</span>
                <strong className="value-primary-text">{phone}</strong>
              </div>
              <span className="value-tag-badge wa-badge">&lt; 10m Average Response</span>
            </div>

            <div className="channel-meta-footer">
              <div className="footer-spec-item">
                <i className="fa-solid fa-lock text-emerald"></i>
                <span>End-to-End Encrypted Transmission</span>
              </div>
              <div className="footer-spec-item">
                <i className="fa-solid fa-file-pdf text-emerald"></i>
                <span>Direct PDF Notice Ingestion</span>
              </div>
            </div>

            <div className="channel-action-row">
              <a href={dynamicWhatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-chambers-action btn-wa">
                <span>Open WhatsApp Chat</span>
                <div className="btn-arrow-disc wa-disc">
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
              </a>
            </div>
          </article>
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

                    {/* 2x2 Executive Fiduciary Charter Bento */}
                    <div className="fiduciary-charter-bento-grid">
                      <div className="charter-bento-tile tile-amber">
                        <div className="charter-tile-icon-disc amber">
                          <i className="fas fa-user-tie"></i>
                        </div>
                        <div className="charter-tile-text">
                          <strong>Senior Partner Direct Oversight</strong>
                          <span>Direct consultation, notice review, and sign-off by designated Senior Practice Principal.</span>
                        </div>
                      </div>

                      <div className="charter-bento-tile tile-sapphire">
                        <div className="charter-tile-icon-disc sapphire">
                          <i className="fas fa-shield-halved"></i>
                        </div>
                        <div className="charter-tile-text">
                          <strong>Statutory Client Privilege</strong>
                          <span>Mutual non-disclosure and strict fiduciary confidentiality before inspecting books or notice dossiers.</span>
                        </div>
                      </div>

                      <div className="charter-bento-tile tile-gold">
                        <div className="charter-tile-icon-disc gold">
                          <i className="fas fa-file-invoice-dollar"></i>
                        </div>
                        <div className="charter-tile-text">
                          <strong>Fixed Retainers, Zero Surcharges</strong>
                          <span>Upfront fee certainty with zero hidden hourly billable charges or surprise compliance surcharges.</span>
                        </div>
                      </div>

                      <div className="charter-bento-tile tile-emerald">
                        <div className="charter-tile-icon-disc emerald">
                          <i className="fas fa-laptop-code"></i>
                        </div>
                        <div className="charter-tile-text">
                          <strong>Virtual &amp; Boardroom Flexibility</strong>
                          <span>Encrypted Google Meet HD screensharing or private executive boardroom sessions at our Nikol chambers.</span>
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

            {/* 4-Pillar Executive Chambers Amenities Bento */}
            <div className="chambers-amenities-bento-grid">
              <div className="chambers-amenity-tile tile-amber">
                <div className="amenity-icon-disc amber">
                  <i className="fas fa-handshake"></i>
                </div>
                <div className="amenity-text-group">
                  <strong>Private Boardroom Suites</strong>
                  <span>Private conference suite equipped for multi-director tax reviews &amp; digital filings.</span>
                </div>
              </div>

              <div className="chambers-amenity-tile tile-emerald">
                <div className="amenity-icon-disc emerald">
                  <i className="fas fa-square-parking"></i>
                </div>
                <div className="amenity-text-group">
                  <strong>Reserved Ground-Floor Parking</strong>
                  <span>Dedicated on-premise client parking reserved for visiting corporate directors &amp; founders.</span>
                </div>
              </div>

              <div className="chambers-amenity-tile tile-sapphire">
                <div className="amenity-icon-disc sapphire">
                  <i className="fas fa-route"></i>
                </div>
                <div className="amenity-text-group">
                  <strong>5 Mins from SP Ring Road</strong>
                  <span>Premier commercial hub at Hill Town Square on MG Road, Nikol Central.</span>
                </div>
              </div>

              <div className="chambers-amenity-tile tile-gold">
                <div className="amenity-icon-disc gold">
                  <i className="fas fa-file-shield"></i>
                </div>
                <div className="amenity-text-group">
                  <strong>Notice Dossier Intake Desk</strong>
                  <span>Direct physical drop-off point for scrutiny notice files, audit ledgers &amp; balance sheets.</span>
                </div>
              </div>
            </div>

            {/* Quick Practice Coordinates Strip */}
            <div className="chambers-coordinates-banner">
              <div className="coord-main">
                <div className="coord-pin-disc">
                  <i className="fas fa-location-dot"></i>
                </div>
                <div className="coord-text">
                  <strong>612, Hill Town Square</strong>
                  <span>Near Ganesh Opera, Nikol Central, Ahmedabad &ndash; 380049</span>
                </div>
              </div>
              <div className="coord-hours-badge">
                <span className="status-live-dot green"></span>
                <span>{workingHours} IST</span>
              </div>
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
          <div className="section-header text-center">
            <span className="header-watermark" aria-hidden="true">CLARITY</span>
            <div className="luxury-header-halo" aria-hidden="true"></div>
            <div className="services-badge">
              <span className="badge-index-chip">02</span>
              <span className="badge-pulse-dot" aria-hidden="true"></span>
              <i className="fas fa-circle-question"></i>
              <span>REGULATORY ETHICS &bull; PRACTICE FAQS</span>
            </div>
            <h2 className="retainers-main-title">
              Frequently Asked Questions on <br />
              <span className="title-gradient-gold">Advisory Consultations</span>
            </h2>
            <p className="section-subtitle">
              Clear, binding policies regarding advisory sessions, confidentiality, and statutory representation under professional regulatory standards.
            </p>
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
              <p>Our senior direct tax attorneys and senior corporate tax advisors prioritize urgent notice triage within 30 minutes.</p>
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
