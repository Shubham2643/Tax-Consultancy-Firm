import { useState } from 'react';
import { Link } from 'react-router-dom';
import ServicesSection from '../components/ServicesSection';
import './Services.css';

const Services = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const slaPillars = [
    {
      icon: 'fas fa-shield-halved',
      title: 'Zero Notice Penalties',
      desc: '100% statutory precision across every GST, ITR, and MCA submission.',
    },
    {
      icon: 'fas fa-bolt',
      title: '24-Hour Advisory SLA',
      desc: 'Prompt partner responses with dedicated compliance desk access.',
    },
    {
      icon: 'fas fa-user-tie',
      title: 'Senior CA Oversight',
      desc: 'Direct partner representation with zero junior delegation handover.',
    },
    {
      icon: 'fas fa-vault',
      title: 'ISO 27001 Client Vault',
      desc: 'Bank-grade document encryption protecting sensitive corporate data.',
    },
  ];

  const deliverySteps = [
    {
      num: '01',
      title: 'Forensic Intake & Reconciliation',
      tag: 'Stage 1 • Discovery',
      icon: 'fas fa-magnifying-glass-chart',
      desc: 'Granular document intake, 26AS/AIS credit verification, and ledger cross-matching to detect variance before filings.',
      badges: ['Bank-to-portal cross-match', 'Statutory defect isolation'],
    },
    {
      num: '02',
      title: 'Dual CA Scrutiny & Tax Optimization',
      tag: 'Stage 2 • Examination',
      icon: 'fas fa-scale-balanced',
      desc: 'Two-tier examination by qualified Chartered Accountants applying the latest Finance Act notifications, deductions, and exemptions.',
      badges: ['Double-peer review', 'Lawful tax minimization'],
    },
    {
      num: '03',
      title: 'Direct Government Portal Dispatch',
      tag: 'Stage 3 • Filing',
      icon: 'fas fa-paper-plane',
      desc: 'Digital Signature Certificate (DSC) affixing and live encrypted submission directly to MCA-21, GSTN, or Income Tax Directorate.',
      badges: ['Class-3 DSC encryption', 'Instant ARN generation'],
    },
    {
      num: '04',
      title: 'Digital Vault Archival & Defense Shield',
      tag: 'Stage 4 • Protection',
      icon: 'fas fa-shield-halved',
      desc: 'Filed acknowledgements archived in client vault with 7-year statutory defense coverage against department inquiries.',
      badges: ['Perpetual digital record', 'Priority scrutiny defense'],
    },
  ];

  const comparisonRows = [
    {
      metric: 'Professional Accountability',
      generic: 'Automated software scripts managed by call-center operators without CA liability',
      firm: 'Direct Chartered Accountant Partner representation governed by ICAI regulatory ethics',
      isAdvantage: true,
    },
    {
      metric: 'Department Scrutiny Defense',
      generic: 'Clients left unassisted or charged exorbitant emergency fees when department notices arrive',
      firm: 'Comprehensive legal defense included; rejoinder drafting & representation before tax officers',
      isAdvantage: true,
    },
    {
      metric: 'Pre-Filing Forensic Audit',
      generic: 'Blind auto-population of raw numbers leading to ITC mismatches and scrutiny triggers',
      firm: 'Systematic 3-way reconciliation (Books vs 26AS vs GSTR-2B) before single rupee submission',
      isAdvantage: true,
    },
    {
      metric: 'Strategic Forward Tax Advisory',
      generic: 'Static transaction filing with zero guidance on entity restructuring or asset shielding',
      firm: 'Proactive year-round tax forecasting, advance tax computation & wealth preservation guidance',
      isAdvantage: true,
    },
  ];

  const faqs = [
    {
      q: 'What happens if the Income Tax or GST Department issues a notice after filing?',
      a: 'Our clients receive full statutory notice defense. Because every return undergoes dual-tier Chartered Accountant examination prior to submission, notices are exceptionally rare. If an automated scrutiny inquiry is issued under Section 143(1), 148, or GST Section 61, our senior partners prepare and submit the forensic rejoinder on your behalf.',
    },
    {
      q: 'How quickly can a new Private Limited Company or LLP be incorporated?',
      a: 'Our standard incorporation turnaround is 3 to 7 business days via MCA SPICe+ and RUN forms, subject to central registrar processing. We handle name reservation, DSC generation, DIN allotment, PAN/TAN issuance, and current bank account opening simultaneously.',
    },
    {
      q: 'Can you reconcile multi-year mismatched GST returns (GSTR-2B vs. Books)?',
      a: 'Yes. Our forensic audit desk regularly performs historical multi-financial-year GST reconciliations. We systematically match purchase registers against supplier GSTR-1 filings, recover blocked input tax credit (ITC), and file formal statutory rectification applications.',
    },
    {
      q: 'Are your professional retainers fixed or do unexpected statutory charges occur?',
      a: 'We operate on 100% billing transparency. Every mandate is governed by a transparent upfront engagement letter clearly separating government statutory fees from our professional retainer. No hidden or unapproved surcharges are ever billed.',
    },
    {
      q: 'Is our corporate and personal financial data confidential?',
      a: 'Strictly. All client records and financial ledgers are housed within an encrypted, ISO 27001-compliant digital vault accessible only by your designated Chartered Accountant under ICAI professional secrecy regulations.',
    },
  ];

  return (
    <div className="services-page fade-in">
      {/* Prestige Hero */}
      <div className="services-hero">
        <div className="container">
          <div className="services-hero-badge">
            <span className="live-dot"></span>
            <i className="fas fa-landmark"></i>
            <span>ICSI &amp; ICAI COMPLIANT PRACTICE &bull; EST. 2018</span>
          </div>
          <h1>Statutory Advisory &amp; Practice Areas</h1>
          <p>
            Direct partner-led chartered accountancy, corporate structuring, forensic audits,
            and appellate scrutiny defense for ambitious enterprises.
          </p>

          {/* 4-Pillar Live Assurance Bar */}
          <div className="services-sla-ribbon">
            {slaPillars.map((pillar, idx) => (
              <div key={idx} className="sla-ribbon-card">
                <div className="sla-icon-box">
                  <i className={pillar.icon}></i>
                </div>
                <div className="sla-text-box">
                  <span className="sla-card-title">{pillar.title}</span>
                  <span className="sla-card-desc">{pillar.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Practice Directory (Embedded without duplicate header) */}
      <ServicesSection hideHeader={true} />

      {/* The 4-Stage Chartered Delivery Protocol */}
      <section className="practice-protocol-section">
        <div className="container">
          <div className="section-header text-center">
            <div className="services-badge">
              <i className="fas fa-route"></i>
              <span>DELIVERY RIGOR &bull; METHODOLOGY</span>
            </div>
            <h2>The 4-Stage Chartered Delivery Protocol</h2>
            <p className="section-subtitle">
              Every client mandate follows an uncompromising forensic pathway ensuring zero statutory friction and complete regulatory peace of mind.
            </p>
          </div>

          <div className="protocol-timeline-wrapper">
            <div className="protocol-timeline-rail" aria-hidden="true"></div>
            <div className="protocol-grid">
              {deliverySteps.map((step, idx) => (
                <div key={idx} className="protocol-card">
                  <div className="protocol-header">
                    <span className="protocol-step-num">{step.num}</span>
                    <div className="protocol-icon-circle">
                      <i className={step.icon}></i>
                    </div>
                  </div>
                  <span className="protocol-tag">{step.tag}</span>
                  <h3 className="protocol-title">{step.title}</h3>
                  <p className="protocol-desc">{step.desc}</p>
                  <div className="protocol-checkpoints">
                    {step.badges.map((b, i) => (
                      <span key={i} className="protocol-badge">
                        <i className="fas fa-check"></i> {b}
                      </span>
                    ))}
                  </div>
                  {idx < deliverySteps.length - 1 && (
                    <div className="protocol-flow-arrow" aria-hidden="true">
                      <i className="fas fa-arrow-right desktop-arrow"></i>
                      <i className="fas fa-arrow-down mobile-arrow"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Comparison Matrix */}
      <section className="practice-comparison-section">
        <div className="container">
          <div className="section-header text-center">
            <div className="services-badge">
              <i className="fas fa-scale-balanced"></i>
              <span>CREDIBILITY BENCHMARK</span>
            </div>
            <h2>Why Businesses Retain Shree Chamunda Associates</h2>
            <p className="section-subtitle">
              Understand the critical difference between algorithm-only online filing platforms and certified Chartered Accountant counsel.
            </p>
          </div>

          <div className="comparison-table-wrapper">
            <div className="comparison-table-header">
              <div className="col-metric">Statutory Benchmark</div>
              <div className="col-generic">Generic Online Filing Portals</div>
              <div className="col-firm">
                <div className="firm-header-title">Shree Chamunda Associates</div>
                <div className="firm-header-badge">
                  <i className="fas fa-award"></i>
                  <span>ICAI CHARTERED BENCHMARK</span>
                </div>
              </div>
            </div>
            <div className="comparison-table-body">
              {comparisonRows.map((row, idx) => (
                <div key={idx} className="comparison-table-row">
                  <div className="col-metric">
                    <strong>{row.metric}</strong>
                  </div>
                  <div className="col-generic">
                    <div className="comparison-mobile-label">
                      <span className="generic-mobile-tag">
                        <i className="fas fa-times"></i> Online Portals
                      </span>
                    </div>
                    <div className="comparison-cell-content">
                      <i className="fas fa-times-circle row-icon-cross"></i>
                      <span>{row.generic}</span>
                    </div>
                  </div>
                  <div className="col-firm">
                    <div className="comparison-mobile-label">
                      <span className="firm-mobile-tag">
                        <i className="fas fa-award"></i> Chartered Standard
                      </span>
                    </div>
                    <div className="comparison-cell-content">
                      <i className="fas fa-check-circle row-icon-check"></i>
                      <span>{row.firm}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statutory Advisory FAQ Accordion */}
      <section className="practice-faq-section">
        <div className="container">
          <div className="section-header text-center">
            <div className="services-badge">
              <i className="fas fa-circle-question"></i>
              <span>STATUTORY CLARITY &bull; FAQS</span>
            </div>
            <h2>Frequently Asked Practice Questions</h2>
            <p className="section-subtitle">
              Direct, transparent answers regarding statutory timelines, notice defense, and retainer protocols.
            </p>
          </div>

          <div className="practice-faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-accordion-btn"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{faq.q}</span>
                    <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} faq-arrow`}></i>
                  </button>
                  {isOpen && (
                    <div className="faq-accordion-content fade-in">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pre-Footer Senior Counsel Retainer CTA */}
      <section className="practice-cta-section">
        <div className="container">
          <div className="practice-cta-card">
            <div className="practice-cta-glow"></div>
            <div className="practice-cta-content">
              <div className="cta-badge">
                <span className="live-dot"></span>
                <span>PARTNER-LEVEL DIRECT LINE</span>
              </div>
              <h2>Need Tailored Tax Counsel or Entity Structuring?</h2>
              <p>
                Connect directly with our senior chartered team for an upfront review of your corporate structure, pending notices, or filing requirements.
              </p>

              <div className="practice-cta-meta">
                <div className="cta-meta-item">
                  <i className="fas fa-phone-volume"></i>
                  <a href="tel:+919510984735">+91 95109 84735</a>
                </div>
                <div className="cta-meta-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:shreechamundaassociates0905@gmail.com">shreechamundaassociates0905@gmail.com</a>
                </div>
                <div className="cta-meta-item">
                  <i className="fas fa-location-dot"></i>
                  <span>612, Hill Town Square, Nikol, Ahmedabad - 380049</span>
                </div>
              </div>

              <div className="practice-cta-actions">
                <Link to="/contact" className="btn-cta-primary">
                  <span>Schedule Retainer Consultation</span>
                  <i className="fas fa-arrow-right"></i>
                </Link>
                <a
                  href="https://wa.me/919510984735?text=Hello%2C%20I%20would%20like%20to%20consult%20regarding%20Chartered%20Accountancy%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta-whatsapp"
                >
                  <i className="fab fa-whatsapp"></i>
                  <span>WhatsApp Senior Partner</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
