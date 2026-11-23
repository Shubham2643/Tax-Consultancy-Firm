import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './About.css';

const About = () => {
  const { settings } = useSiteContext();
  const navigate = useNavigate();
  const [activeCompareTab, setActiveCompareTab] = useState('traditional'); // 'traditional' | 'big4'
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeCaseTab, setActiveCaseTab] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const phone = settings?.phone || '+91 95109 84735';
  const cleanPhone = '919510984735';
  const address = (settings?.address && !settings.address.includes('Zaveri') && !settings.address.includes('Kathwada') && !settings.address.includes('Singarva'))
    ? (settings.address.includes('612') ? settings.address : '612, ' + settings.address)
    : '612, Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad, Gujarat - 380049';

  const handleCopyAddress = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2200);
  };

  const handleDownloadDossier = () => {
    const printWindow = window.open('', '_blank', 'width=920,height=1000');
    if (!printWindow) {
      alert('Please allow popups to view and download the Institutional Practice Dossier.');
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Shree Chamunda Associates — Institutional Practice Capability Dossier</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
        <style>
          @page { size: A4; margin: 16mm 14mm; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            font-size: 10.5pt;
            line-height: 1.5;
          }
          .dossier-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #d4af37;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .dossier-brand h1 {
            font-size: 19pt;
            font-weight: 800;
            color: #081426;
            margin: 0 0 4px 0;
            letter-spacing: -0.02em;
          }
          .dossier-brand p {
            font-size: 9.5pt;
            font-weight: 700;
            color: #b45309;
            margin: 0;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .dossier-meta {
            text-align: right;
            font-size: 8.5pt;
            color: #475569;
          }
          .dossier-meta strong { color: #081426; }
          .executive-summary {
            background: #f8fafc;
            border-left: 4px solid #d4af37;
            padding: 12px 16px;
            margin-bottom: 20px;
            border-radius: 4px;
          }
          .executive-summary h2 {
            font-size: 11pt;
            margin: 0 0 4px 0;
            color: #081426;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .executive-summary p { margin: 0; font-size: 9pt; color: #334155; line-height: 1.45; }
          .covenants-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }
          .cov-box {
            border: 1px solid #e2e8f0;
            padding: 8px 10px;
            border-radius: 6px;
            background: #ffffff;
            text-align: center;
          }
          .cov-num { font-size: 15pt; font-weight: 800; color: #081426; display: block; }
          .cov-lbl { font-size: 7.5pt; font-weight: 700; color: #64748b; text-transform: uppercase; }
          .desks-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 20px;
          }
          .desk-card {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 10px 12px;
            page-break-inside: avoid;
          }
          .desk-code { font-size: 7.5pt; font-weight: 800; color: #b45309; letter-spacing: 0.06em; }
          .desk-name { font-size: 10pt; font-weight: 800; color: #081426; margin: 2px 0 4px 0; }
          .desk-scope { font-size: 8pt; color: #475569; margin-bottom: 4px; line-height: 1.35; }
          .desk-statute { font-size: 7.5pt; font-family: 'JetBrains Mono', monospace; color: #0369a1; background: #f0f9ff; padding: 2px 6px; border-radius: 3px; display: inline-block; }
          .seals-row {
            border-top: 1px solid #e2e8f0;
            padding-top: 14px;
            margin-bottom: 16px;
          }
          .seals-title { font-size: 9.5pt; font-weight: 800; color: #081426; text-transform: uppercase; margin-bottom: 6px; }
          .seals-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 8pt; color: #334155; }
          .dossier-footer {
            border-top: 2px solid #081426;
            padding-top: 12px;
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 8pt;
            color: #64748b;
          }
          .chambers-address { font-weight: 600; color: #081426; }
          .no-print-bar {
            background: #081426;
            color: #ffffff;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: -24px -24px 20px -24px;
          }
          .btn-print {
            background: #d4af37;
            color: #081426;
            border: none;
            padding: 6px 16px;
            font-weight: 800;
            border-radius: 4px;
            cursor: pointer;
            font-size: 9pt;
          }
          @media print {
            .no-print-bar { display: none !important; }
            body { padding: 0 !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print-bar">
          <span><strong>Shree Chamunda Associates</strong> — Official Institutional Practice Capability Statement</span>
          <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
        </div>
        <div class="dossier-header">
          <div class="dossier-brand">
            <h1>SHREE CHAMUNDA ASSOCIATES</h1>
            <p>Corporate Tax, Statutory Scrutiny & Appellate Advisory</p>
          </div>
          <div class="dossier-meta">
            <div>Ref: <strong>SCA-CAPABILITY-2026</strong></div>
            <div>Chambers: <strong>Nikol Central, Ahmedabad</strong></div>
            <div>Jurisdiction: <strong>Gujarat Commercial Practice</strong></div>
          </div>
        </div>

        <div class="executive-summary">
          <h2>Fiduciary Practice Charter & Institutional Standing</h2>
          <p>
            Shree Chamunda Associates operates as an independent corporate tax, appellate litigation, and regulatory advisory practice. Founded on absolute fiduciary independence, zero contingent conflicts, and direct senior partner oversight, the firm represents mid-market enterprises, manufacturing leaders, and LLPs across Gujarat in high-stakes direct tax scrutiny, GST reconciliations, and turnkey corporate governance.
          </p>
        </div>

        <div class="covenants-row">
          <div class="cov-box"><span class="cov-num">4+</span><span class="cov-lbl">Years of Practice</span></div>
          <div class="cov-box"><span class="cov-num">250+</span><span class="cov-lbl">Retained Enterprises</span></div>
          <div class="cov-box"><span class="cov-num">1,500+</span><span class="cov-lbl">Statutory Filings</span></div>
          <div class="cov-box"><span class="cov-num">₹15Cr+</span><span class="cov-lbl">Scrutiny Mitigated</span></div>
        </div>

        <h3 style="font-size: 10pt; text-transform: uppercase; letter-spacing: 0.05em; color: #081426; margin: 0 0 8px 0;">Specialized Advisory Chambers</h3>
        <div class="desks-grid">
          <div class="desk-card">
            <span class="desk-code">DESK 01 • DIRECT TAX & APPELLATE</span>
            <div class="desk-name">Direct Tax & Appellate Litigation</div>
            <div class="desk-scope">Comprehensive representation for Sec 143(3) scrutiny, Sec 148 reassessment notices, and CIT(Appeals) submissions.</div>
            <span class="desk-statute">Income Tax Act, 1961 • ITAT Bench Jurisprudence</span>
          </div>
          <div class="desk-card">
            <span class="desk-code">DESK 02 • INDIRECT TAX & GST</span>
            <div class="desk-name">GST Audit & ITC Reconciliations</div>
            <div class="desk-scope">Algorithmic 3-way matching of purchase registers with live GSTR-2B, ASMT-10 notice defense, and audit support.</div>
            <span class="desk-statute">CGST & SGST Acts, 2017 • GSTN Authorized API</span>
          </div>
          <div class="desk-card">
            <span class="desk-code">DESK 03 • CORPORATE GOVERNANCE</span>
            <div class="desk-name">Corporate Legal & ROC Governance</div>
            <div class="desk-scope">Turnkey Private Limited / LLP incorporations, annual secretarial compliances, and Startup India 80-IAC filings.</div>
            <span class="desk-statute">Companies Act, 2013 • MCA 21 SPICe+ Intermediary</span>
          </div>
          <div class="desk-card">
            <span class="desk-code">DESK 04 • DIGITAL ARCHIVAL</span>
            <div class="desk-name">Compliance Systems & Document Archival</div>
            <div class="desk-scope">Encrypted 256-bit cloud document repositories, real-time filing trackers, and automated statutory deadline alerts.</div>
            <span class="desk-statute">ISO 27001 Data Security • Bank-Grade Cloud Vault</span>
          </div>
        </div>

        <div class="seals-row">
          <div class="seals-title">Statutory Verification Protocols & Fiduciary Standards</div>
          <div class="seals-list">
            <div>&bull; <strong>Dual-Tier Senior Partner Sign-Off:</strong> 100% computational cross-verification before portal submission.</div>
            <div>&bull; <strong>Statutory Appellate Standing:</strong> Authorized standing under Sec 288 Income Tax Act & Sec 116 CGST Act.</div>
            <div>&bull; <strong>Pre-Filing Mismatch Shield:</strong> Proactive 3-way reconciliation against 26AS, AIS, and GSTR-2B.</div>
            <div>&bull; <strong>Fiduciary Non-Disclosure:</strong> Enforceable enterprise NDAs and institutional client privilege.</div>
          </div>
        </div>

        <div class="dossier-footer">
          <div>
            <div class="chambers-address">Shree Chamunda Associates Practice Chambers</div>
            <div>${address}</div>
          </div>
          <div style="text-align: right;">
            <div>Advisory Hotline: <strong>${phone}</strong></div>
            <div>Email: <strong>${settings?.email || 'shreechamundaassociates0905@gmail.com'}</strong></div>
          </div>
        </div>
      </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // 1. Quantitative Benchmarks (Architectural Fiduciary Covenant Ledger)
  const stats = [
    {
      index: '01',
      number: '4+',
      label: 'YEARS IN ACTIVE PRACTICE',
      caption: 'Continuous direct tax, GST & corporate regulatory counsel delivered across Gujarat.',
      statute: 'Est. 2023 • Ahmedabad',
      icon: 'fa-solid fa-award',
      accentColor: 'gold',
      assuranceTag: 'Active Practice',
    },
    {
      index: '02',
      number: '250+',
      label: 'RETAINED ENTERPRISE CLIENTS',
      caption: 'Mid-market manufacturing, trading enterprises & LLP leaders managed under annual retainers.',
      statute: 'Gujarat Commercial Sector',
      icon: 'fa-solid fa-building',
      accentColor: 'blue',
      assuranceTag: 'Annual Retainers',
    },
    {
      index: '03',
      number: '1,500+',
      label: 'STATUTORY AUDIT & TAX FILINGS',
      caption: '100% on-time submission rate across Income Tax ITRs, GST returns & MCA secretarial forms.',
      statute: 'Zero Portal Rejection Track',
      icon: 'fa-solid fa-file-invoice-dollar',
      accentColor: 'purple',
      assuranceTag: 'Zero-Notice Accuracy',
    },
    {
      index: '04',
      number: '₹15Cr+',
      label: 'SCRUTINY EXPOSURE DEFENDED',
      caption: 'High-stakes assessment liabilities contested and defended before CIT(Appeals) & GST benches.',
      statute: 'Sec 148 & ASMT-10 Relief',
      icon: 'fa-solid fa-shield-halved',
      accentColor: 'emerald',
      assuranceTag: 'Appellate Shield',
    },
  ];

  // 2. Core Fiduciary Commitments
  const fiduciaryCommitments = [
    {
      icon: 'fa-solid fa-vault',
      title: 'Bank-Grade Confidentiality & NDA Enforcement',
      desc: 'Rigorous compliance with statutory non-disclosure protocols and formal enterprise NDAs. Financial records and vouchers are safeguarded in secure encrypted cloud repositories.',
      tag: 'Fiduciary Duty',
      colorClass: 'tenet-vault',
    },
    {
      icon: 'fa-solid fa-shield-halved',
      title: 'Zero-Notice Pre-Filing Reconciliation',
      desc: 'Every statutory return is computationally pre-reconciled against GSTR-2B, AIS, and Form 26AS before portal dispatch to preempt departmental inquiry notices.',
      tag: 'Preventive Defense',
      colorClass: 'tenet-shield',
    },
    {
      icon: 'fa-solid fa-user-tie',
      title: 'Direct Senior Partner Accountability',
      desc: 'Your corporate account is directly managed and reviewed by senior advisors. We never hand off corporate clients to junior interns or generic support queues.',
      tag: 'Senior Counsel',
      colorClass: 'tenet-partner',
    },
    {
      icon: 'fa-solid fa-receipt',
      title: 'Fixed-Fee Retainer Transparency',
      desc: 'Transparent, scope-locked retainer agreements with zero hidden surprise bills, arbitrary filing surcharges, or unexpected hourly billing invoices.',
      tag: 'Transparent Billing',
      colorClass: 'tenet-pricing',
    },
  ];

  // 3. 4 Specialized Institutional Practice Desks
  const practiceDesks = [
    {
      code: 'DESK 01',
      number: '01',
      title: 'Direct Tax & Appellate Litigation',
      shortTitle: 'Direct Tax & Scrutiny',
      scope: 'Income Tax • Scrutiny Assessments • Appellate Representation',
      desc: 'Comprehensive representation for Section 143(3) scrutiny, Section 148 reassessments, and CIT(Appeals) submissions with complete statutory jurisprudence backing.',
      badges: ['Sec 143/148 Defense', 'CIT(A) Submissions', 'Capital Gain Structuring'],
      leadCounsel: 'Senior Direct Tax Counsel',
      statute: 'Income Tax Act, 1961 • ITAT Appeals',
      governanceNote: 'Dual-Tier Senior Partner Sign-Off',
      targetService: 'Income Tax Sec 148 / 144 Notice Defense',
      icon: 'fa-solid fa-scale-balanced',
      accentClass: 'accent-gold',
      themeClass: 'desk-theme-gold',
    },
    {
      code: 'DESK 02',
      number: '02',
      title: 'GST Audit & ITC Reconciliations',
      shortTitle: 'GST Audit & ITC',
      scope: 'Indirect Tax • Input Tax Credit Optimization • Notice Resolution',
      desc: 'Algorithmic reconciliation of purchase registers against live GSTR-2B, defending ASMT-10 mismatch notices, and managing departmental GST audits.',
      badges: ['ASMT-10 Dispute Resolution', 'GSTR-2B ITC Matching', 'E-Way Compliance'],
      leadCounsel: 'Indirect Tax Advisory Desk',
      statute: 'CGST & SGST Acts, 2017 • GST Portal',
      governanceNote: 'Algorithmic 3-Way Reconciliation',
      targetService: 'GST Scrutiny & ASMT-10 Notice Defense',
      icon: 'fa-solid fa-receipt',
      accentClass: 'accent-emerald',
      themeClass: 'desk-theme-emerald',
    },
    {
      code: 'DESK 03',
      number: '03',
      title: 'Corporate Legal & ROC Governance',
      shortTitle: 'Corporate Legal & ROC',
      scope: 'Company Formation • SPICe+ MCA 21 • Secretarial Filings',
      desc: 'Turnkey structuring for Private Limited, LLP, and OPC entities, annual statutory MCA filings, board governance documentation, and startup tax exemptions.',
      badges: ['MCA SPICe+ Processing', 'Annual ROC Governance', 'Startup India 80-IAC'],
      leadCounsel: 'Corporate Secretarial Desk',
      statute: 'Companies Act, 2013 • MCA 21 Portal',
      governanceNote: 'Zero Regulatory Penalty Track Record',
      targetService: 'Company / LLP Turnkey Incorporation',
      icon: 'fa-solid fa-building-columns',
      accentClass: 'accent-blue',
      themeClass: 'desk-theme-blue',
    },
    {
      code: 'DESK 04',
      number: '04',
      title: 'Compliance Systems & Document Archival',
      shortTitle: 'Compliance & Archival',
      scope: 'Fintech Automation • Document Cloud Archival • Real-Time Filing Tracker',
      desc: 'State-of-the-art paperless compliance infrastructure providing encrypted 24/7 document repositories, statutory deadline tracking, and audit retrievals.',
      badges: ['Confidential Cloud Archival', 'Automated ITC Screening', 'Paperless Accounting'],
      leadCounsel: 'Digital Systems Desk',
      statute: 'ISO 27001 Data Security • Cloud Archival',
      governanceNote: 'Bank-Grade 256-Bit Vault Storage',
      targetService: 'Complete Accounting & Bookkeeping Retainer',
      icon: 'fa-solid fa-terminal',
      accentClass: 'accent-purple',
      themeClass: 'desk-theme-purple',
    },
  ];

  // 4. Comparative Matrix Data (Executive Decision Matrix)
  const comparisonMatrix = [
    {
      num: '01',
      icon: 'fa-solid fa-user-shield',
      criterion: 'Account Ownership & Oversight',
      metric: 'Partner Direct',
      traditional: 'Delegated to junior bookkeepers; high staff turnover',
      big4: 'Handed off to multi-tiered junior analyst layers',
      chamunda: 'Direct Senior Partner assigned with direct contact access',
    },
    {
      num: '02',
      icon: 'fa-solid fa-microchip',
      criterion: 'Pre-Filing Verification Rigor',
      metric: '3-Tier Zero-Error',
      traditional: 'Reactive filing; errors discovered only after notice arrives',
      big4: 'Thorough but encumbered by weeks of corporate bureaucracy',
      chamunda: 'Algorithmic 3-Stage reconciliation before portal dispatch',
    },
    {
      num: '03',
      icon: 'fa-solid fa-gavel',
      criterion: 'Scrutiny & Notice Resolution',
      metric: 'Retainer Shield',
      traditional: 'Panic response; separate surprise bill per notice response',
      big4: 'Exorbitant hourly billing for appellate legal drafting',
      chamunda: 'Proactive defense covered under pre-arranged retainer terms',
    },
    {
      num: '04',
      icon: 'fa-solid fa-vault',
      criterion: 'Document Security & Archival',
      metric: 'Bank-Grade Cloud',
      traditional: 'Physical paper files; lost vouchers in storage',
      big4: 'Restricted corporate ERPs with complex access barriers',
      chamunda: '24/7 Secure Cloud Archives with instant one-click retrieval',
    },
    {
      num: '05',
      icon: 'fa-solid fa-file-contract',
      criterion: 'Fee Structure & Retainers',
      metric: 'Scope-Locked',
      traditional: 'Arbitrary add-ons, unexpected year-end charges',
      big4: 'High minimum corporate retainers unaffordable for mid-market',
      chamunda: 'Predictable, scope-locked monthly / annual retainers',
    },
    {
      num: '06',
      icon: 'fa-solid fa-bolt-lightning',
      criterion: 'Responsiveness & Turnaround',
      metric: '< 24h Partner SLA',
      traditional: 'Days of silence; unanswered calls during deadline rush',
      big4: 'Formal ticket queues with 48–72h turnaround delays',
      chamunda: '< 24h Dedicated Partner SLA on WhatsApp & phone',
    },
  ];

  // 5. Representative Statutory Case Precedents & Scrutiny Relief Records
  const casePrecedents = [
    {
      id: 'precedent-1',
      domain: 'Direct Taxation',
      domainBadge: 'Direct Tax Counsel',
      forum: 'CIT(Appeals) • National Faceless Appeal Centre',
      act: 'Income Tax Act, 1961 • Sec 148 / 148A',
      title: 'Quashing of ₹2.45 Cr Section 148 Reassessment Order',
      clientSector: 'Mid-Market Industrial Manufacturing',
      exposure: '₹2.45 Cr Assessed Liability',
      outcome: '100% Demand Quashed • Zero Penalty Sustained',
      outcomeTag: 'Appellate Relief',
      summary: 'Assessing Officer initiated reassessment under Section 148 alleging unexplained share capital and premium receipts. Our direct tax appellate desk demonstrated statutory limitation bar under Section 149 and proved source of funds with forensic bank trails and audited balance sheets, securing a complete deletion of addition from CIT(Appeals).',
      highlights: [
        'Overcame jurisdictional notice defect under Section 148A(b)',
        'Forensic 3-tier investor fund flow documentation',
        'CIT(A) order quashed full demand with zero penalty'
      ],
      icon: 'fa-solid fa-scale-balanced',
      themeClass: 'case-theme-gold'
    },
    {
      id: 'precedent-2',
      domain: 'Indirect Taxation',
      domainBadge: 'GST Scrutiny Desk',
      forum: 'Gujarat State Commercial Tax Division • Range Audit',
      act: 'CGST & SGST Acts, 2017 • Sec 61 & 73',
      title: 'ASMT-10 Notice Defense & ₹84.6 Lakhs ITC Recovery',
      clientSector: 'Specialty Chemical Trading Entity',
      exposure: '₹84.6 Lakhs Inward ITC Difference',
      outcome: 'Dispute Dropped • Full ITC Allowed Without Surcharge',
      outcomeTag: 'Audit Dismissed',
      summary: 'Department issued Form GST ASMT-10 alleging extensive variance between GSTR-3B and auto-populated GSTR-2B over two financial years due to delayed vendor filings. We executed an algorithmic reconciliation of 1,400+ supplier tax invoices, establishing vendor tax deposit compliance and securing complete closure without departmental show-cause escalation.',
      highlights: [
        'Algorithmic 3-way invoice reconciliation against GSTR-2B',
        'Invoked statutory safe-harbor precedents on bona fide purchaser credit',
        'Zero penalty and zero interest surcharge assessed'
      ],
      icon: 'fa-solid fa-receipt',
      themeClass: 'case-theme-emerald'
    },
    {
      id: 'precedent-3',
      domain: 'Corporate Legal',
      domainBadge: 'ROC Governance Desk',
      forum: 'Ministry of Corporate Affairs • Registrar of Companies (ROC)',
      act: 'Companies Act, 2013 • SPICe+ & Sec 80-IAC',
      title: 'Multi-Director Holding Restructuring & 80-IAC Tax Holiday',
      clientSector: 'Technology & Logistics Venture',
      exposure: 'Cross-Border Holding Architecture',
      outcome: 'SPICe+ Turnkey Approved in 4 Days • 80-IAC Eligible',
      outcomeTag: 'Turnkey Approval',
      summary: 'Structured and executed incorporation of a multi-director private limited enterprise with custom Articles of Association (AoA) for institutional venture capital readiness. Processed foreign directorship KYC, secured SPICe+ certificate of incorporation within 4 business days, and filed complete DPIIT Startup India 80-IAC documentation for 3-year income tax exemption.',
      highlights: [
        'Dual-class voting rights & protective investor covenants drafted',
        'Turnkey PAN, TAN, GSTIN & EPFO registration in 96 hours',
        'DPIIT recognized for Section 80-IAC statutory tax holiday'
      ],
      icon: 'fa-solid fa-building-columns',
      themeClass: 'case-theme-blue'
    },
    {
      id: 'precedent-4',
      domain: 'Compliance & Archival',
      domainBadge: 'Forensic Systems Desk',
      forum: 'Centralized Processing Centre • Sec 44AB Tax Audit',
      act: 'Income Tax Act, 1961 • Sec 44AB & Sec 43B(h)',
      title: '₹42 Cr Turnover Retrospective Books Migration & Audit Defense',
      clientSector: 'Textile Manufacturing & Export Consortium',
      exposure: '₹42 Cr Annual Turnover Ledgers',
      outcome: 'Unqualified Clean Audit Report • Zero 43B(h) Disallowances',
      outcomeTag: 'Zero-Defect Audit',
      summary: 'A multi-unit textile conglomerate faced imminent statutory audit deadlines with fragmented physical paper ledgers and unverified MSME vendor payment timelines. Our systems desk digitized 3 fiscal years into an encrypted cloud repository, reconciled 12,000+ vouchers, and delivered an unqualified Form 3CD audit report with zero statutory disallowances.',
      highlights: [
        '100% paperless migration to secure encrypted digital vault',
        'Automated MSME vendor payment tracking preempting Sec 43B(h) disallowance',
        'Zero departmental inquiries or portal defects on Form 3CD'
      ],
      icon: 'fa-solid fa-vault',
      themeClass: 'case-theme-purple'
    }
  ];

  // 6. Unified Growth Milestones Track
  const growthMilestones = [
    {
      year: '2023',
      phase: 'FOUNDING & GENESIS',
      title: 'Inception in Nikol, Ahmedabad',
      desc: 'Established as an independent direct tax and corporate accounting advisory practice dedicated to providing institutional-quality compliance to local manufacturing and trading enterprises.',
      badge: 'Ahmedabad Genesis',
      metric: '50+ Initial Enterprise Clients',
    },
    {
      year: '2024',
      phase: 'PRACTICE EXPANSION',
      title: 'Dedicated GST & Statutory Defense Desk',
      desc: 'Expanded operations to provide comprehensive GST reconciliation, vendor GSTR-2B inward credit cross-matching, and formal reply drafting for ASMT-10 notices.',
      badge: 'Audit Desk Active',
      metric: '99.8% On-Time Record Maintained',
    },
    {
      year: '2025',
      phase: 'DIGITAL INFRASTRUCTURE',
      title: 'Paperless Digital Client Vault & ROC Secretarial Unit',
      desc: 'Pioneered 100% cloud-based bookkeeping with secure encrypted client document repositories, alongside launching a turnkey MCA SPICe+ company formation and annual corporate governance desk.',
      badge: 'Secure Cloud Vault',
      metric: '100% Lost-Voucher Elimination',
    },
    {
      year: '2026',
      phase: 'INSTITUTIONAL SCALE',
      title: 'Enterprise Retainer Systems & High-Value Counsel',
      desc: 'Serving over 250+ enterprise retainers across Gujarat with zero-penalty assurances, proactive annual tax planning, and direct partner access for mid-market leaders.',
      badge: 'Statutory Standard',
      metric: '₹15Cr+ Scrutiny Exposure Protected',
    },
  ];

  // 6. Master Institutional Credential Seals & Regulatory Authority
  const credentialSeals = [
    {
      id: 'fiduciary-seal',
      badge: 'STATUTORY FIDUCIARY COMPLIANCE',
      code: 'FIDUCIARY-ETHICS-STD',
      authority: 'Professional Practice Standards',
      title: 'Code of Ethics & Quality Review Aligned',
      subtitle: 'Fiduciary Independence & Uncompromised Confidentiality',
      desc: 'Strict adherence to professional standards of independence, mandatory NDA confidentiality, and fiduciary objectivity. Zero contingent fee conflicts and strict ethical segregation.',
      highlights: ['Mandatory NDA Protection', 'Independence by Protocol', 'Objectivity in Audit'],
      icon: 'fa-solid fa-certificate',
      sealClass: 'seal-fiduciary',
    },
    {
      id: 'itat-seal',
      badge: 'APPELLATE BENCH AUTHORITY',
      code: 'ITAT-CGST-AUTH',
      authority: 'Sec 288 Income Tax Act • Sec 116 CGST Act',
      title: 'Authorized Appellate Tax Representation',
      subtitle: 'CIT(Appeals), ITAT Benches & GST Revisional Jurisprudence',
      desc: 'Authorized statutory standing to represent corporate and individual assessees before Commissioner (Appeals), Income Tax Appellate Tribunal (ITAT), and GST Appellate Revisional benches.',
      highlights: ['CIT(A) Submissions', 'ITAT Case Jurisprudence', 'DRC-01A / ASMT-10 Defense'],
      icon: 'fa-solid fa-scale-balanced',
      sealClass: 'seal-itat',
    },
    {
      id: 'dual-tier-seal',
      badge: 'SQC 1 QUALITY ASSURANCE',
      code: 'DUAL-TIER-SIGN',
      authority: 'Standard on Quality Control (SQC 1)',
      title: 'Mandatory Dual-Tier Senior Partner Sign-Off',
      subtitle: 'Pre-Filing Algorithmic Cross-Verification',
      desc: 'Rigorous two-stage verification protocol: every tax return, computational schedule, and financial ledger is reviewed by a Lead Preparer and countersigned by a Senior Advisory Partner prior to portal transmission.',
      highlights: ['Pre-Filing 26AS/AIS Match', 'Partner Co-Signature', 'Zero Portal Errors Guarantee'],
      icon: 'fa-solid fa-shield-halved',
      sealClass: 'seal-quality',
    },
    {
      id: 'chambers-seal',
      badge: 'ACTIVE COMMERCIAL PRACTICE',
      code: 'GUJ-COM-REG',
      authority: 'Gujarat Commercial Registry • Nikol Central',
      title: 'Nikol Central Practice Chambers Accreditation',
      subtitle: 'Physical Chambers at 612 Hill Town Square, Nikol',
      desc: 'Physical corporate practice chambers established at 612 Hill Town Square, Nikol, Ahmedabad. Fully equipped with private partner consultation suites and secure encrypted archival terminals.',
      highlights: ['In-Person Advisory Chambers', 'Confidential Consultation Rooms', 'Bank-Grade Vault Terminals'],
      icon: 'fa-solid fa-building',
      sealClass: 'seal-chambers',
    },
  ];

  // 7. Authentic Regulatory Framework & Technical Protocols
  const accreditations = [
    { code: 'FIDUCIARY-ETHICS', title: 'Code of Professional Ethics Aligned', desc: 'Strict observance of professional independence, fiduciary duty, and non-disclosure standards' },
    { code: 'MCA-SPICE', title: 'MCA 21 SPICe+ Intermediary', desc: 'Turnkey corporate incorporations, LLP agreements, and statutory board resolutions' },
    { code: 'GSTN-API', title: 'GSTN Authorized Protocol', desc: 'Real-time reconciliation of GSTR-1, 3B, 2B and automated ITC mismatch detection' },
    { code: 'SSL-SECURE', title: 'Bank-Grade Document Security', desc: 'Secure cloud repositories safeguarding books of accounts and confidential tax filings' },
    { code: 'MSME-DESK', title: 'Enterprise Retainer Architecture', desc: 'Specialized corporate compliance packages designed for Gujarat’s manufacturing and trading sector' }
  ];

  const handleWhatsAppConsult = () => {
    const text = 'Hello Advisory Team, I would like to schedule an in-person advisory session at your Ahmedabad office.';
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="about-page fade-in">
      {/* ============================================================
          1. EDITORIAL SWISS FINTECH HERO SECTION (Architectural Precision)
          ============================================================ */}
      <section className="about-hero" aria-labelledby="about-hero-title">
        {/* Top Gold Glowing Accent Divider & Ambient Atmospheric Layers */}
        <div className="about-top-accent-line" aria-hidden="true"></div>
        <div className="about-ambient-grid" aria-hidden="true"></div>
        <div className="about-ambient-orb orb-gold" aria-hidden="true"></div>

        <div className="container about-hero-container">
          <span className="header-watermark" aria-hidden="true">CHAMBERS</span>
          <div className="luxury-header-halo" aria-hidden="true"></div>

          {/* Eyebrow Badge with Index Chip & Refined Amber Emblem */}
          <div className="about-eyebrow-badge">
            <span className="badge-index-chip">01</span>
            <i className="fa-solid fa-landmark" aria-hidden="true"></i>
            <span>INSTITUTIONAL TAX PRACTICE &bull; AHMEDABAD CHAMBERS</span>
          </div>

          {/* Majestic Hero Headline with Liquid 24K Burnished Gold Highlight */}
          <h1 id="about-hero-title" className="about-main-title">
            Architecting Statutory Precision &amp; <br className="hidden-mobile" />
            <span className="title-burnished-gold">Institutional Corporate Defense.</span>
          </h1>

          <p className="about-subtitle">
            Founded on an uncompromising commitment to fiduciary independence, Shree Chamunda Associates delivers precision corporate tax strategy, appellate dispute resolution, and regulatory compliance architecture for ambitious Indian enterprises.
          </p>

          {/* Twin Executive Action Buttons (Institutional Obsidian Standard) */}
          <div className="about-hero-actions">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={() => navigate('/contact')}
              aria-label="Schedule Partner Advisory Consultation"
            >
              <i className="fa-solid fa-calendar-check hero-btn-lead-icon" aria-hidden="true"></i>
              <span className="hero-btn-text">Schedule Partner Advisory</span>
              <i className="fa-solid fa-arrow-right hero-btn-trail-icon" aria-hidden="true"></i>
            </button>

            <button
              type="button"
              className="btn-hero-whatsapp"
              onClick={handleWhatsAppConsult}
              aria-label="Direct WhatsApp Desk with Senior Advisory Consultant"
            >
              <i className="fa-brands fa-whatsapp hero-wa-lead-icon" aria-hidden="true"></i>
              <span className="hero-wa-text">Direct WhatsApp Desk</span>
              <span className="hero-wa-status-dot" aria-hidden="true"></span>
            </button>

            <button
              type="button"
              className="btn-hero-dossier"
              onClick={handleDownloadDossier}
              aria-label="Download Institutional Practice Dossier"
              title="Download Official Practice Capability Dossier (.pdf)"
            >
              <i className="fa-solid fa-file-pdf hero-dossier-lead-icon" aria-hidden="true"></i>
              <span className="hero-dossier-text">Practice Dossier (.pdf)</span>
              <i className="fa-solid fa-download hero-dossier-trail-icon" aria-hidden="true"></i>
            </button>
          </div>

          {/* Frosted Executive Reassurance Strip */}
          <div className="header-assurance-strip">
            <span className="assurance-pill">
              <i className="fa-solid fa-award text-gold" aria-hidden="true"></i>
              <span>Statutory Practice Standards Aligned</span>
            </span>
            <span className="assurance-pill">
              <i className="fa-solid fa-location-dot text-emerald" aria-hidden="true"></i>
              <span>Central Chambers in Nikol, Ahmedabad</span>
            </span>
            <span className="assurance-pill">
              <i className="fa-solid fa-shield-halved text-blue" aria-hidden="true"></i>
              <span>100% On-Time Statutory Track Record</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Page Layout Container */}
      <div className="container about-main-layout">
        {/* ============================================================
            2. QUANTITATIVE BENCHMARKS (Architectural Fiduciary Covenant Ledger)
            ============================================================ */}
        <section className="about-covenants-section" aria-label="Firm Scale & Quantitative Benchmarks">
          <div className="covenants-pedestal-grid" role="region" aria-label="Statutory Practice Benchmarks">
            {stats.map((stat, idx) => (
              <article key={idx} className={`covenant-pedestal-card covenant-accent-${stat.accentColor}`}>
                <div className="card-top-hairline" aria-hidden="true"></div>
                
                {/* Top Meta Row: Index Chip and Clean Monochrome Statute Tag */}
                <div className="covenant-card-top-row">
                  <span className="covenant-index-chip">{stat.index}</span>
                  <span className="covenant-statute-tag">
                    <i className={stat.icon} aria-hidden="true"></i>
                    <span>{stat.statute}</span>
                  </span>
                </div>

                {/* Hero Number Display */}
                <div className="covenant-metric-wrap">
                  <span className="covenant-big-number">{stat.number}</span>
                </div>

                {/* Authoritative Uppercase Tracking Label */}
                <h3 className="covenant-card-label">{stat.label}</h3>

                <div className="covenant-divider" aria-hidden="true"></div>

                {/* Narrative Scope */}
                <p className="covenant-card-desc">{stat.caption}</p>

                {/* Bottom Assurance Tag with Gold Verification Shield */}
                <div className="covenant-card-footer">
                  <span className="covenant-assurance-pill">
                    <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                    <span>{stat.assuranceTag}</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================
            3. EXECUTIVE FOUNDING MANIFESTO & FIDUCIARY COMMITMENTS
            ============================================================ */}
        <section className="about-manifesto-section" aria-labelledby="manifesto-title">
          <div className="about-section-header text-center">
            <div className="about-eyebrow-badge">
              <span className="badge-index-chip">02</span>
              <i className="fa-solid fa-feather-pointed" aria-hidden="true"></i>
              <span>FOUNDING MANIFESTO &bull; PRACTICE ETHOS</span>
            </div>
            <h2 id="manifesto-title" className="section-main-heading">
              The Fiduciary Responsibility of the Modern Tax Practice
            </h2>
            <p className="section-main-subtext">
              Transforming corporate taxation from a reactive compliance burden into an institutional shield of strategic value and zero-notice certainty.
            </p>
          </div>

          <div className="manifesto-dual-grid">
            {/* Left: The Written Manifesto Card */}
            <div className="manifesto-narrative-card">
              <div className="card-top-hairline" aria-hidden="true"></div>

              <div className="manifesto-lead-quote-box">
                <span className="quote-mark" aria-hidden="true">&ldquo;</span>
                <p className="manifesto-lead-quote">
                  Too many Indian enterprises suffer from surprise tax notices, delayed filings, and missed input credits because they are treated as generic batch numbers by transactional accounting shops. That model is fundamentally broken.
                </p>
              </div>

              <div className="manifesto-prose">
                <p>
                  <strong>Shree Chamunda Associates</strong> was established in Ahmedabad to provide an institutional alternative: a high-touch, partner-led Tax &amp; Corporate Advisory where every return is pre-reconciled, every statutory deduction is optimized, and client confidentiality is protected under strict fiduciary law.
                </p>
                <p>
                  Whether representing an enterprise through high-stakes GST scrutiny, structuring a corporate entity under MCA SPICe+, or managing continuous secretarial governance, our clients work directly with senior advisors who understand the technical depth of Indian tax jurisprudence.
                </p>
              </div>

              <div className="manifesto-sign-off">
                <div className="sign-off-identity">
                  <div className="sign-off-kicker">
                    <i className="fa-solid fa-signature" aria-hidden="true"></i>
                    <span>EXECUTED UNDER PRACTICE COVENANT</span>
                  </div>
                  <strong className="founder-signature-name">Office of the Managing Partners</strong>
                  <span className="founder-signature-title">Appellate Tax Counsel &bull; Corporate Regulatory Practice</span>
                  <span className="founder-signature-loc">
                    <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                    <span>Nikol Chambers &bull; Ahmedabad, Gujarat</span>
                  </span>
                </div>

                {/* Prestigious Chambers Heraldic Signet Medallion */}
                <div className="chambers-heraldic-seal" title="Official Chambers Fiduciary Seal">
                  <div className="seal-concentric-ring">
                    <div className="seal-center-core">
                      <i className="fa-solid fa-scale-balanced seal-court-icon" aria-hidden="true"></i>
                      <span className="seal-monogram-txt">SCA</span>
                      <span className="seal-jurisdiction-txt">AHMEDABAD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 4 Fiduciary Horizontal Tenets */}
            <div className="manifesto-fiduciary-stack">
              {fiduciaryCommitments.map((item, idx) => (
                <div key={idx} className={`fiduciary-stack-card ${item.colorClass}`}>
                  <div className="card-top-hairline" aria-hidden="true"></div>
                  <div className="stack-card-header">
                    <div className="stack-icon-box" aria-hidden="true">
                      <i className={item.icon}></i>
                    </div>
                    <div className="stack-header-text">
                      <span className="stack-tag">{item.tag}</span>
                      <h3 className="stack-title">{item.title}</h3>
                    </div>
                  </div>
                  <p className="stack-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            4. THE 3-WAY COMPARATIVE DECISION MATRIX (Why Switch To Us)
            ============================================================ */}
        <section className="about-comparison-section" aria-labelledby="comparison-title">
          <div className="about-section-header text-center">
            <div className="about-eyebrow-badge">
              <span className="badge-index-chip">03</span>
              <i className="fa-solid fa-compass" aria-hidden="true"></i>
              <span>THE INSTITUTIONAL DIFFERENCE &bull; DECISION MATRIX</span>
            </div>
            <h2 id="comparison-title" className="section-main-heading">
              Why Ambitious Businesses Retain Us
            </h2>
            <p className="section-main-subtext">
              Compare how Shree Chamunda Associates delivers the technical precision of Tier-1 advisory firms with the direct partner accessibility and fee predictability of a dedicated practice.
            </p>
          </div>

          {/* Desktop Table View */}
          <div className="comparison-table-wrapper desktop-only-table">
            <div className="card-top-hairline" aria-hidden="true"></div>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="col-criterion">
                    <span className="th-eyebrow-tag">OPERATIONAL BENCHMARK</span>
                    <span className="th-heading-title">Practice Dimension</span>
                  </th>
                  <th className="col-traditional">
                    <span className="th-eyebrow-tag">STATUS QUO</span>
                    <span className="th-heading-title">Traditional Local Firm</span>
                    <span className="th-sub-note">Reactive Bookkeeping</span>
                  </th>
                  <th className="col-big4">
                    <span className="th-eyebrow-tag">NATIONAL CONGLOMERATE</span>
                    <span className="th-heading-title">Big 4 / Corporate Firm</span>
                    <span className="th-sub-note">High Overhead &bull; Junior Layers</span>
                  </th>
                  <th className="col-chamunda">
                    <div className="chamunda-pedestal-header">
                      <div className="pedestal-eyebrow-row">
                        <span className="pedestal-crown-chip">
                          <i className="fa-solid fa-crown" aria-hidden="true"></i>
                          <span>BENCHMARK</span>
                        </span>
                      </div>
                      <span className="pedestal-brand-title">SHREE CHAMUNDA ASSOCIATES</span>
                      <span className="pedestal-sub-caption">Partner-Led Fiduciary Defense</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonMatrix.map((row, idx) => (
                  <tr key={idx} className="matrix-data-row">
                    <td className="cell-criterion">
                      <div className="criterion-identity-wrap">
                        <span className="criterion-icon-badge">
                          <i className={row.icon} aria-hidden="true"></i>
                        </span>
                        <div className="criterion-text-col">
                          <strong className="criterion-title-text">{row.criterion}</strong>
                          <span className="criterion-spec-tag">{row.metric}</span>
                        </div>
                      </div>
                    </td>
                    <td className="cell-traditional">
                      <div className="matrix-status-cell cell-status-negative">
                        <span className="matrix-badge-icon badge-cross" aria-hidden="true">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                        <span className="matrix-cell-text">{row.traditional}</span>
                      </div>
                    </td>
                    <td className="cell-big4">
                      <div className="matrix-status-cell cell-status-neutral">
                        <span className="matrix-badge-icon badge-neutral-dash" aria-hidden="true">
                          <i className="fa-solid fa-minus"></i>
                        </span>
                        <span className="matrix-cell-text">{row.big4}</span>
                      </div>
                    </td>
                    <td className="cell-chamunda">
                      <div className="matrix-status-cell cell-status-positive">
                        <span className="matrix-badge-icon badge-check-gold" aria-hidden="true">
                          <i className="fa-solid fa-check"></i>
                        </span>
                        <strong className="matrix-cell-text-bold">{row.chamunda}</strong>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Interactive Segmented View */}
          <div className="comparison-mobile-deck mobile-only-deck">
            <div className="compare-segmented-control" role="tablist" aria-label="Comparison Perspective">
              <button
                type="button"
                role="tab"
                aria-selected={activeCompareTab === 'traditional'}
                className={`compare-segment-btn ${activeCompareTab === 'traditional' ? 'active' : ''}`}
                onClick={() => setActiveCompareTab('traditional')}
              >
                <span>vs Traditional Accountant</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCompareTab === 'big4'}
                className={`compare-segment-btn ${activeCompareTab === 'big4' ? 'active' : ''}`}
                onClick={() => setActiveCompareTab('big4')}
              >
                <span>vs Big 4 Conglomerate</span>
              </button>
            </div>

            <div className="compare-cards-stack">
              {comparisonMatrix.map((row, idx) => (
                <div key={idx} className="compare-versus-card">
                  <div className="card-top-hairline" aria-hidden="true"></div>
                  <div className="versus-card-criterion">
                    <span className="criterion-icon-badge">
                      <i className={row.icon} aria-hidden="true"></i>
                    </span>
                    <div className="criterion-text-col">
                      <strong className="criterion-title-text">{row.criterion}</strong>
                      <span className="criterion-spec-tag">{row.metric}</span>
                    </div>
                  </div>

                  <div className="versus-contrast-grid">
                    {/* Competitor Side */}
                    <div className="versus-side versus-competitor">
                      <div className="versus-side-header">
                        <span className="side-badge badge-competitor">
                          {activeCompareTab === 'traditional' ? 'Traditional Practitioner' : 'Big 4 Conglomerate'}
                        </span>
                      </div>
                      <div className="versus-side-body">
                        <span className="matrix-badge-icon badge-cross" aria-hidden="true">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                        <p>{activeCompareTab === 'traditional' ? row.traditional : row.big4}</p>
                      </div>
                    </div>

                    {/* Chamunda Associates Side */}
                    <div className="versus-side versus-chamunda">
                      <div className="versus-side-header">
                        <span className="side-badge badge-chamunda">
                          SHREE CHAMUNDA ASSOCIATES
                        </span>
                        <span className="versus-chip-gold">Institutional Standard</span>
                      </div>
                      <div className="versus-side-body">
                        <span className="matrix-badge-icon badge-check-gold" aria-hidden="true">
                          <i className="fa-solid fa-check"></i>
                        </span>
                        <p><strong>{row.chamunda}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            5. SPECIALIZED INSTITUTIONAL PRACTICE DESKS (Executive 2x2 Chambers Grid)
            ============================================================ */}
        <section className="about-practice-desks-section" aria-labelledby="practice-desks-title">
          <div className="about-section-header text-center">
            <div className="about-eyebrow-badge">
              <span className="badge-index-chip">04</span>
              <i className="fa-solid fa-briefcase" aria-hidden="true"></i>
              <span>INSTITUTIONAL PRACTICE STRUCTURE</span>
            </div>
            <h2 id="practice-desks-title" className="section-main-heading">
              Four Specialized <span className="title-burnished-gold">Advisory Desks</span>
            </h2>
            <p className="section-main-subtext">
              Structured into domain-specific practice chambers, ensuring every corporate advisory mandate, litigation defense, and secretarial filing is directed by seasoned practice specialists.
            </p>
          </div>

          {/* Prestigious 4-Desk Chambers Architecture Grid */}
          <div className="practice-desks-chambers-grid">
            {practiceDesks.map((desk, idx) => (
              <article key={idx} className={`desk-chambers-card ${desk.themeClass}`}>
                <div className="card-top-hairline" aria-hidden="true"></div>

                {/* Card Top Row: Code Pill, Live Status, and Icon Disc */}
                <div className="desk-card-header-row">
                  <div className="desk-card-header-left">
                    <span className="desk-code-badge">{desk.code}</span>
                    <span className="desk-counsel-badge">
                      <i className="fa-solid fa-user-shield" aria-hidden="true"></i>
                      <span>{desk.leadCounsel}</span>
                    </span>
                  </div>
                  <div className={`desk-icon-emblem ${desk.accentClass}`} aria-hidden="true">
                    <i className={desk.icon}></i>
                  </div>
                </div>

                {/* Statutory Jurisdiction & Title */}
                <div className="desk-statute-jurisdiction">{desk.statute}</div>
                <h3 className="desk-card-title">{desk.title}</h3>
                
                <div className="desk-card-scope">
                  <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
                  <span>{desk.scope}</span>
                </div>

                <p className="desk-card-desc">{desk.desc}</p>

                {/* Core Practice Capabilities */}
                <div className="desk-card-capabilities">
                  <span className="capabilities-label">Core Mandate Capabilities:</span>
                  <div className="capabilities-chips-wrap">
                    {desk.badges.map((b, bIdx) => (
                      <span key={bIdx} className="capability-tag">
                        <i className="fa-solid fa-check" aria-hidden="true"></i>
                        <span>{b}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Assurance Strip & Action Button */}
                <div className="desk-card-footer">
                  <div className="desk-governance-note">
                    <i className="fa-solid fa-shield-halved text-emerald" aria-hidden="true"></i>
                    <span>{desk.governanceNote}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-desk-consult"
                    onClick={() => {
                      const targetParam = desk.targetService ? `service=${encodeURIComponent(desk.targetService)}&tab=consultation#booking-console` : 'tab=consultation#booking-console';
                      navigate(`/contact?${targetParam}`);
                    }}
                    aria-label={`Retain ${desk.title} Counsel`}
                  >
                    <span>Retain Desk Counsel</span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================
            5. REPRESENTATIVE STATUTORY PRECEDENTS & MATTERS HANDLED
            ============================================================ */}
        <section className="about-precedents-section" aria-labelledby="precedents-title">
          <div className="about-section-header text-center">
            <div className="about-eyebrow-badge">
              <span className="badge-index-chip">05</span>
              <i className="fa-solid fa-gavel" aria-hidden="true"></i>
              <span>REPRESENTATIVE MATTERS &bull; STATUTORY PRECEDENTS</span>
            </div>
            <h2 id="precedents-title" className="section-main-heading">
              Track Record of <span className="title-burnished-gold">Institutional Defense</span>
            </h2>
            <p className="section-main-subtext">
              A selective chronicle of high-stakes scrutiny defenses, appellate reliefs, and corporate governance architectures executed across Gujarat with zero liability compromise.
            </p>

            {/* Filter Tabs */}
            <div className="precedent-filter-tabs" role="tablist" aria-label="Practice Area Case Filter">
              <button
                type="button"
                className={`filter-tab-pill ${activeCaseTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCaseTab('all')}
              >
                <span>All Precedents ({casePrecedents.length})</span>
              </button>
              <button
                type="button"
                className={`filter-tab-pill ${activeCaseTab === 'Direct Taxation' ? 'active' : ''}`}
                onClick={() => setActiveCaseTab('Direct Taxation')}
              >
                <span>Direct Tax Defense</span>
              </button>
              <button
                type="button"
                className={`filter-tab-pill ${activeCaseTab === 'Indirect Taxation' ? 'active' : ''}`}
                onClick={() => setActiveCaseTab('Indirect Taxation')}
              >
                <span>GST Scrutiny</span>
              </button>
              <button
                type="button"
                className={`filter-tab-pill ${activeCaseTab === 'Corporate Legal' ? 'active' : ''}`}
                onClick={() => setActiveCaseTab('Corporate Legal')}
              >
                <span>Corporate Legal</span>
              </button>
              <button
                type="button"
                className={`filter-tab-pill ${activeCaseTab === 'Compliance & Archival' ? 'active' : ''}`}
                onClick={() => setActiveCaseTab('Compliance & Archival')}
              >
                <span>Audit & Archival</span>
              </button>
            </div>
          </div>

          <div className="precedents-grid">
            {casePrecedents
              .filter((c) => activeCaseTab === 'all' || c.domain === activeCaseTab)
              .map((c) => (
                <article key={c.id} className={`precedent-card ${c.themeClass}`}>
                  <div className="card-top-hairline" aria-hidden="true"></div>
                  
                  <div className="precedent-card-header">
                    <div className="precedent-header-left">
                      <span className="precedent-forum-tag">
                        <i className="fa-solid fa-landmark" aria-hidden="true"></i>
                        <span>{c.forum}</span>
                      </span>
                      <span className="precedent-act-pill">{c.act}</span>
                    </div>
                    <span className="precedent-outcome-badge">
                      <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                      <span>{c.outcomeTag}</span>
                    </span>
                  </div>

                  <h3 className="precedent-title">{c.title}</h3>

                  <div className="precedent-metric-box">
                    <div className="metric-col">
                      <span className="metric-label">MANDATE EXPOSURE</span>
                      <strong className="metric-value value-exposure">{c.exposure}</strong>
                    </div>
                    <div className="metric-divider"></div>
                    <div className="metric-col">
                      <span className="metric-label">RELIEF SECURED</span>
                      <strong className="metric-value value-outcome">{c.outcome}</strong>
                    </div>
                  </div>

                  <p className="precedent-summary">{c.summary}</p>

                  <div className="precedent-highlights">
                    <span className="highlights-label">Statutory Execution Protocols:</span>
                    <ul className="highlights-list">
                      {c.highlights.map((h, hIdx) => (
                        <li key={hIdx}>
                          <i className="fa-solid fa-check" aria-hidden="true"></i>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="precedent-footer">
                    <span className="client-sector-tag">
                      <i className="fa-solid fa-industry" aria-hidden="true"></i>
                      <span>{c.clientSector}</span>
                    </span>
                    <button
                      type="button"
                      className="btn-precedent-consult"
                      onClick={() => navigate('/contact?tab=consultation#booking-console')}
                    >
                      <span>Consult on Similar Notice</span>
                      <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </section>

        {/* ============================================================
            6. UNIFIED CHRONOLOGICAL GROWTH TRACK (Verifiable Progress)
            ============================================================ */}
        <section className="about-timeline-section" aria-labelledby="timeline-title">
          <div className="about-section-header text-center">
            <div className="about-eyebrow-badge">
              <span className="badge-index-chip">06</span>
              <i className="fa-solid fa-clock-rotate-left" aria-hidden="true"></i>
              <span>VERIFIABLE PROGRESS &bull; PRACTICE TRACK RECORD</span>
            </div>
            <h2 id="timeline-title" className="section-main-heading">
              Milestones of Firm Growth
            </h2>
            <p className="section-main-subtext">
              A verifiable chronicle of institutional expansion, statutory milestones, and digital modernization from our Nikol chambers to managing enterprise retainers statewide.
            </p>
          </div>

          <div className="unified-timeline-track">
            {growthMilestones.map((step, idx) => (
              <div key={idx} className="timeline-milestone-item">
                <div className="milestone-rail-col">
                  <div className="milestone-year-pill">{step.year}</div>
                  <div className="milestone-rail-line" aria-hidden="true"></div>
                </div>

                <div className="milestone-card">
                  <div className="card-top-hairline" aria-hidden="true"></div>
                  <div className="milestone-card-top">
                    <span className="milestone-phase-badge">{step.phase}</span>
                    <span className="milestone-metric-tag">{step.metric}</span>
                  </div>
                  <h3 className="milestone-title">{step.title}</h3>
                  <p className="milestone-desc">{step.desc}</p>
                  <div className="milestone-footer">
                    <span className="milestone-verify-badge">
                      <i className="fa-solid fa-check" aria-hidden="true"></i>
                      <span>{step.badge}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            7. INSTITUTIONAL ACCREDITATIONS & REGULATORY AUTHORITY SEALS
            ============================================================ */}
        <section className="about-accreditations-section" aria-label="Institutional Accreditations & Regulatory Seals">
          <div className="about-section-header text-center">
            <div className="about-eyebrow-badge">
              <span className="badge-index-chip">07</span>
              <i className="fa-solid fa-certificate" aria-hidden="true"></i>
              <span>INSTITUTIONAL ASSURANCE &bull; REGULATORY BENCHMARK</span>
            </div>
            <h2 className="section-main-heading">
              Practice Credentials &amp; Regulatory Seals
            </h2>
            <p className="section-main-subtext">
              Operating strictly within statutory charters enacted by the Parliament of India, ensuring uncompromised fiduciary independence, authorized appellate representation, and algorithmic zero-error filing defense.
            </p>
          </div>

          {/* 4 Master Authority Seals Grid */}
          <div className="master-seals-grid">
            {credentialSeals.map((seal) => (
              <div key={seal.id} className={`master-seal-card ${seal.sealClass}`}>
                <div className="card-top-hairline" aria-hidden="true"></div>
                <div className="seal-card-header">
                  <div className="seal-icon-emblem" aria-hidden="true">
                    <i className={seal.icon}></i>
                    <span className="seal-emblem-ring"></span>
                  </div>
                  <div className="seal-meta-header">
                    <span className="seal-authority-badge">{seal.badge}</span>
                    <span className="seal-statute-tag">{seal.authority}</span>
                  </div>
                </div>

                <div className="seal-card-body">
                  <strong className="seal-card-title">{seal.title}</strong>
                  <span className="seal-card-subtitle">{seal.subtitle}</span>
                  <p className="seal-card-desc">{seal.desc}</p>
                </div>

                <div className="seal-card-footer">
                  <div className="seal-highlights-list">
                    {seal.highlights.map((h, i) => (
                      <span key={i} className="seal-highlight-pill">
                        <i className="fa-solid fa-check" aria-hidden="true"></i>
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Statutory Protocol Assurance Strip */}
          <div className="technical-protocols-strip">
            <div className="protocols-strip-header">
              <span className="protocols-label">VERIFIED STATUTORY TECHNICAL PROTOCOLS:</span>
            </div>
            <div className="accreditations-grid">
              {accreditations.map((item, idx) => (
                <div key={idx} className="accred-card">
                  <div className="accred-code-badge">{item.code}</div>
                  <strong className="accred-title">{item.title}</strong>
                  <p className="accred-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            8. PHYSICAL PRACTICE CHAMBERS & TRANSIT GUIDE
            ============================================================ */}
        <section className="about-chambers-section" aria-labelledby="chambers-title">
          <div className="chambers-card-wrapper">
            <div className="card-top-hairline" aria-hidden="true"></div>
            <div className="chambers-narrative-col">
              <div className="about-eyebrow-badge">
                <span className="badge-index-chip">08</span>
                <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                <span>PHYSICAL PRESENCE &bull; CENTRAL CHAMBERS</span>
              </div>
              <h2 id="chambers-title" className="chambers-main-heading">
                Our Ahmedabad Practice Chambers
              </h2>
              <p className="chambers-lead-text">
                We believe financial counsel must be grounded in direct, accessible, personal relationships. Corporate leaders, founders, and CFOs are welcome to schedule in-person advisory sessions at our fully equipped chambers in Nikol, Ahmedabad.
              </p>

              <div className="chambers-specs-list">
                <div className="chambers-spec-item">
                  <div className="chambers-spec-icon" aria-hidden="true">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <span className="spec-label">OFFICIAL CHAMBERS ADDRESS:</span>
                    <strong className="spec-value">{address}</strong>
                  </div>
                </div>

                <div className="chambers-spec-item">
                  <div className="chambers-spec-icon" aria-hidden="true">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div>
                    <span className="spec-label">ADVISORY CONSULTATION HOURS:</span>
                    <strong className="spec-value">Monday – Saturday: 10:00 AM – 7:00 PM IST</strong>
                  </div>
                </div>

                <div className="chambers-spec-item">
                  <div className="chambers-spec-icon" aria-hidden="true">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <span className="spec-label">DIRECT PRACTICE HOTLINE:</span>
                    <strong className="spec-value">
                      <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a> &bull; {settings?.email || 'shreechamundaassociates0905@gmail.com'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="chambers-cta-row">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-directions"
                >
                  <i className="fa-solid fa-location-arrow" aria-hidden="true"></i>
                  <span>Open Google Maps Directions</span>
                </a>
                <button
                  type="button"
                  className={`btn-visit ${copiedAddress ? 'copied' : ''}`}
                  onClick={handleCopyAddress}
                  aria-label="Copy Chamber Address"
                >
                  <i className={copiedAddress ? "fa-solid fa-check text-emerald" : "fa-regular fa-copy"} aria-hidden="true"></i>
                  <span>{copiedAddress ? 'Address Copied!' : 'Copy Chamber Address'}</span>
                </button>
                <button type="button" className="btn-visit" onClick={handleWhatsAppConsult}>
                  <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
                  <span>Schedule Consultation</span>
                </button>
              </div>
            </div>

            {/* Visual Facility Showcase & Interactive Google Map Card */}
            <div className="chambers-visual-col">
              <div className="chambers-map-frame-card">
                <div className="card-top-hairline" aria-hidden="true"></div>
                <div className="chambers-map-header">
                  <div className="chambers-map-header-left">
                    <div className="pin-disc-gold" aria-hidden="true">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div className="chambers-map-header-text">
                      <strong className="chambers-map-title">Shree Chamunda Practice Chambers</strong>
                      <span className="chambers-map-subtitle">612, Hill Town Square &bull; Nikol, Ahmedabad</span>
                    </div>
                  </div>
                  <span className="chamber-verified-tag">
                    <i className="fa-solid fa-shield-halved text-gold" aria-hidden="true"></i>
                    <span>VERIFIED PRACTICE HUB</span>
                  </span>
                </div>

                <div className="chambers-iframe-wrap">
                  <iframe
                    title="Shree Chamunda Associates Practice Chambers - Nikol, Ahmedabad"
                    src="https://maps.google.com/maps?q=612,+Hill+Town+Square,+MG+Road,+near+Ganesh+Opera,+Nikol,+Ahmedabad,+Gujarat+380049&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '340px', width: '100%', display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="chambers-map-footer">
                  <span className="chambers-gps-tag">
                    <i className="fa-solid fa-crosshairs" aria-hidden="true"></i>
                    <span>23.0489° N, 72.6743° E &bull; Nikol Central Hub</span>
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chambers-nav-link"
                  >
                    <span>Open in Google Maps</span>
                    <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            9. EXECUTIVE CLOSING CTA BANNER (Institutional Finish)
            ============================================================ */}
        <section className="about-closing-cta" aria-labelledby="closing-cta-title">
          <div className="cta-ambient-glow" aria-hidden="true"></div>
          <div className="cta-grid-bg" aria-hidden="true"></div>

          <div className="cta-inner-content">
            <span className="cta-top-chip">RETAIN SENIOR COUNSEL &bull; SCALE WITH FIDUCIARY CERTAINTY</span>
            <h2 id="closing-cta-title">Ready to Partner with Seasoned Tax Advisors?</h2>
            <p>
              Schedule a confidential partner consultation to review your corporate tax architecture, preempt notice vulnerabilities, and secure seamless statutory compliance.
            </p>

            <div className="cta-btn-group">
              <button
                type="button"
                className="btn-cta-gold"
                onClick={() => navigate('/contact')}
              >
                <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
                <span>Schedule Confidential Review</span>
                <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </button>

              <button
                type="button"
                className="btn-cta-whatsapp"
                onClick={handleWhatsAppConsult}
              >
                <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                <span>Direct WhatsApp Desk</span>
                <span className="about-wa-status-dot" aria-hidden="true"></span>
              </button>

              <button
                type="button"
                className="btn-cta-dossier"
                onClick={handleDownloadDossier}
                aria-label="Download Institutional Practice Dossier"
                title="Download Official Practice Capability Statement (.pdf)"
              >
                <i className="fa-solid fa-file-arrow-down" aria-hidden="true"></i>
                <span>Practice Dossier (.pdf)</span>
              </button>

              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="btn-cta-outline"
              >
                <i className="fa-solid fa-phone" aria-hidden="true"></i>
                <span>Call: {phone}</span>
              </a>
            </div>

            <div className="cta-trust-guarantees">
              <span className="cta-guarantee-pill">
                <i className="fa-solid fa-check" aria-hidden="true"></i>
                <span>Direct Senior Partner Access</span>
              </span>
              <span className="cta-guarantee-pill">
                <i className="fa-solid fa-check" aria-hidden="true"></i>
                <span>Strict NDA &amp; Client Privilege</span>
              </span>
              <span className="cta-guarantee-pill">
                <i className="fa-solid fa-check" aria-hidden="true"></i>
                <span>&lt; 24h Response Guarantee</span>
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
