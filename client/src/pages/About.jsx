import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './About.css';

// Precision inline SVGs designed for institutional chartered practice aesthetics
const Icons = {
  Landmark: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  ),
  Certificate: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  Location: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Award: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  ),
  FileInvoice: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Vault: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="8" x2="12" y2="10" />
      <line x1="12" y1="14" x2="12" y2="16" />
      <line x1="8" y1="12" x2="10" y2="12" />
      <line x1="14" y1="12" x2="16" y2="12" />
    </svg>
  ),
  UserTie: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M12 11v4l1.5 2-1.5 1-1.5-1 1.5-2z" />
    </svg>
  ),
  Scale: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  ),
  CodeTerminal: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Receipt: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
      <path d="M16 8h-8" />
      <path d="M16 12h-8" />
      <path d="M10 16H8" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Cross: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  WhatsApp: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2C6.495 2 2 6.48 2 12c0 1.956.565 3.784 1.543 5.334L2.25 21.75l4.582-1.201A9.943 9.943 0 0 0 12.031 22c5.536 0 10.031-4.48 10.031-10s-4.495-10-10.031-10zm5.836 14.283c-.244.686-1.419 1.346-1.958 1.408-.506.059-1.169.088-3.791-.974-3.155-1.277-5.187-4.46-5.344-4.667-.158-.207-1.282-1.705-1.282-3.253 0-1.547.81-2.308 1.099-2.622.288-.314.629-.393.839-.393.209 0 .42.002.604.011.196.01.458-.074.717.548.262.629.89 2.171.969 2.33.078.158.13.344.026.551-.105.207-.157.336-.314.52-.158.184-.332.41-.474.551-.158.158-.322.33-.138.646.184.316.818 1.35 1.752 2.18 1.202 1.069 2.216 1.4 2.53 1.558.314.157.498.132.682-.079.184-.21.786-.917.996-1.232.21-.314.42-.262.708-.157.288.105 1.832.864 2.146 1.021.314.158.524.236.602.368.079.131.079.761-.165 1.447z" />
    </svg>
  ),
  CalendarCheck: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  ),
  Feather: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Briefcase: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  History: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  ),
  Compass: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
};

const About = () => {
  const { settings } = useSiteContext();
  const navigate = useNavigate();
  const [activeCompareTab, setActiveCompareTab] = useState('traditional'); // 'traditional' | 'big4'
  const [activeDeskIdx, setActiveDeskIdx] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const phone = settings?.phone || '+91 95109 84735';
  const cleanPhone = '919510984735';
  const address = settings?.address || 'Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad, Gujarat - 380049';

  // 1. Quantitative Benchmarks (Standardized equal length descriptions for identical card heights)
  const stats = [
    { number: '4+', label: 'Years of Practice', icon: <Icons.Award />, caption: 'Continuous regulatory advisory across Gujarat', theme: 'stat-gold' },
    { number: '250+', label: 'Retained Enterprises', icon: <Icons.Building />, caption: 'Corporate manufacturing, trade & LLP clients', theme: 'stat-blue' },
    { number: '1,500+', label: 'Statutory Filings', icon: <Icons.FileInvoice />, caption: '100% on-time submission & audit track record', theme: 'stat-purple' },
    { number: '₹15Cr+', label: 'Scrutiny Mitigated', icon: <Icons.ShieldCheck />, caption: 'Zero tax assessment liability losses defended', theme: 'stat-emerald' },
  ];

  // 2. Core Fiduciary Commitments
  const fiduciaryCommitments = [
    {
      icon: <Icons.Vault />,
      title: 'Bank-Grade Confidentiality & NDA Enforcement',
      desc: 'Rigorous compliance with ICAI non-disclosure bylaws and formal enterprise NDAs. Financial records and vouchers are safeguarded in 256-bit encrypted cloud repositories.',
      tag: 'Fiduciary Duty',
      colorClass: 'pillar-vault',
    },
    {
      icon: <Icons.ShieldCheck />,
      title: 'Zero-Notice Pre-Filing Reconciliation',
      desc: 'Every statutory return is computationally pre-reconciled against GSTR-2B, AIS, and Form 26AS before portal dispatch to preempt departmental inquiry notices.',
      tag: 'Preventive Defense',
      colorClass: 'pillar-shield',
    },
    {
      icon: <Icons.UserTie />,
      title: 'Direct Senior Partner Accountability',
      desc: 'Your corporate account is directly managed and reviewed by senior advisors. We never hand off corporate clients to junior interns or generic support tickets.',
      tag: 'Senior Counsel',
      colorClass: 'pillar-partner',
    },
    {
      icon: <Icons.Receipt />,
      title: 'Fixed-Fee Retainer Transparency',
      desc: 'Transparent, scope-locked retainer agreements with zero hidden surprise bills, arbitrary filing surcharges, or surprise hourly billing invoices.',
      tag: 'Transparent Billing',
      colorClass: 'pillar-pricing',
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
      desc: 'Comprehensive representation for Section 143(3) scrutiny, Section 148 reassessments, and CIT(Appeals) submissions with complete jurisprudence backing.',
      badges: ['Sec 143/148 Defense', 'CIT(A) Submissions', 'Capital Gain Structuring'],
      leadCounsel: 'Senior Direct Tax Counsel',
      statute: 'Income Tax Act, 1961 • ITAT Appeals',
      icon: <Icons.Scale />,
    },
    {
      code: 'DESK 02',
      number: '02',
      title: 'GST Audit & ITC Reconciliations',
      shortTitle: 'GST Audit & ITC',
      scope: 'Indirect Tax • Input Tax Credit Optimization • Notice Resolution',
      desc: 'Algorithmic reconciliation of purchase registers against live GSTR-2B, defending ASMT-10 mismatch notices, and managing GST department audits.',
      badges: ['ASMT-10 Dispute Resolution', 'GSTR-2B ITC Matching', 'E-Way Compliance'],
      leadCounsel: 'Indirect Tax Advisory Desk',
      statute: 'CGST & SGST Acts, 2017 • GST Portal',
      icon: <Icons.Receipt />,
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
      icon: <Icons.Building />,
    },
    {
      code: 'DESK 04',
      number: '04',
      title: 'Compliance Systems & Digital Vault',
      shortTitle: 'Compliance & Digital Vault',
      scope: 'Fintech Automation • Document Cloud Archival • Real-Time Filing Tracker',
      desc: 'State-of-the-art paperless compliance infrastructure providing encrypted 24/7 document repositories, deadline tracking, and instantaneous audit retrievals.',
      badges: ['256-Bit Encrypted Vault', 'Automated ITC Screening', 'Paperless Accounting'],
      leadCounsel: 'Digital Systems Desk',
      statute: 'ISO 27001 Data Security • Cloud Archival',
      icon: <Icons.CodeTerminal />,
    },
  ];

  // 4. Comparative Matrix Data (Why Switch To Us)
  const comparisonMatrix = [
    {
      criterion: 'Account Ownership & Oversight',
      traditional: 'Delegated to junior bookkeepers; high turnover',
      big4: 'Handed off to multi-tiered junior analyst layers',
      chamunda: 'Direct Senior Partner assigned with direct contact',
      isChampion: true,
    },
    {
      criterion: 'Pre-Filing Verification Rigor',
      traditional: 'Reactive filing; errors discovered after notice arrives',
      big4: 'Thorough but encumbered by weeks of corporate red tape',
      chamunda: 'Algorithmic 3-Stage reconciliation before portal dispatch',
      isChampion: true,
    },
    {
      criterion: 'Scrutiny & Notice Resolution',
      traditional: 'Panic response; surprise bill per notice response',
      big4: 'Exorbitant hourly billing for appellate drafting',
      chamunda: 'Proactive defense with pre-arranged retainer terms',
      isChampion: true,
    },
    {
      criterion: 'Document Security & Digital Vault',
      traditional: 'Physical paper files; lost vouchers in storage',
      big4: 'Restricted corporate ERPs with complex access permissions',
      chamunda: '24/7 Secure Cloud Vault with instant one-click retrieval',
      isChampion: true,
    },
    {
      criterion: 'Fee Structure & Retainers',
      traditional: 'Arbitrary add-ons, sudden year-end charges',
      big4: 'High minimum corporate retainers unaffordable for MSMEs',
      chamunda: 'Predictable, scope-locked monthly / annual retainer',
      isChampion: true,
    },
    {
      criterion: 'Responsiveness & Turnaround',
      traditional: 'Days of silence; unanswered calls during deadline rush',
      big4: 'Formal ticket queues with 48–72h turnaround delays',
      chamunda: '< 24h Dedicated Partner SLA on WhatsApp & phone',
      isChampion: true,
    },
  ];

  // 5. Leadership Dossier
  const leadershipProfiles = [
    {
      name: 'Pragnesh Adiyecha',
      role: 'Founder & Principal Consultant',
      credentials: 'Senior Tax Strategist & Corporate Advisor',
      initials: 'PA',
      experience: '15+ Years Industry Knowledge',
      specialty: 'Direct Tax Planning • Appellate Scrutiny Defense • Corporate Structuring',
      bio: 'Directs the firm’s strategic tax advisory and dispute resolution practice. Has successfully represented growing enterprises and trading firms before appellate authorities, structured tax-efficient business mergers, and insulated over 250+ clients against statutory penalties.',
      badges: ['Appellate Specialist', 'Direct Tax Strategist', 'ICAI Aligned Practice'],
      icon: <Icons.Scale />,
      isFounder: true,
    },
    {
      name: 'Shubham Adiyecha',
      role: 'Head of Compliance Technology & Digital Systems',
      credentials: 'Compliance Automation & Systems Architect',
      initials: 'SA',
      experience: 'Fintech & Cloud Systems Specialist',
      specialty: 'Digital Client Vaults • Real-Time Tracking • Paperless Accounting',
      bio: 'Architects the secure digital infrastructure, automated reconciliation pipelines, and client portal architecture for Shree Chamunda Associates. Specializes in real-time GST reconciliation tools, paperless accounting workflows, and 256-bit encrypted document repositories.',
      badges: ['Security & Automation', 'Digital Client Vault', 'Cloud Compliance'],
      icon: <Icons.CodeTerminal />,
      isFounder: false,
    },
  ];

  // 6. Unified Growth Milestones Track
  const growthMilestones = [
    {
      year: '2023',
      phase: 'FOUNDING & GENESIS',
      title: 'Inception in Nikol, Ahmedabad',
      desc: 'Established as an independent direct tax and accounting advisory practice dedicated to providing institutional-quality compliance to local manufacturing and trading enterprises.',
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
      desc: 'Pioneered 100% cloud-based bookkeeping with 256-bit encrypted client document repositories, alongside launching a turnkey MCA SPICe+ company formation and annual corporate governance desk.',
      badge: '256-Bit Cloud Vault',
      metric: '100% Lost-Voucher Elimination',
    },
    {
      year: '2026',
      phase: 'INSTITUTIONAL SCALE',
      title: 'Enterprise Wealth & Comprehensive Retainer Systems',
      desc: 'Serving over 250+ enterprise retainers across Gujarat with zero-penalty assurances, proactive annual tax planning, and direct partner access for mid-market leaders.',
      badge: 'Chartered Standard',
      metric: '₹15Cr+ Scrutiny Exposure Protected',
    },
  ];

  // 7. Authentic Regulatory Framework
  const accreditations = [
    { code: 'ICAI-ETHICS', title: 'ICAI Code of Ethics Aligned', desc: 'Strict observance of professional independence, fiduciary duty, and non-disclosure standards' },
    { code: 'MCA-SPICE', title: 'MCA 21 SPICe+ Intermediary', desc: 'Turnkey corporate incorporations, LLP agreements, and statutory board resolutions' },
    { code: 'GSTN-API', title: 'GSTN Authorized Protocol', desc: 'Real-time reconciliation of GSTR-1, 3B, 2B and automated ITC mismatch detection' },
    { code: 'SSL-256', title: 'Bank-Grade Document Security', desc: 'Secure cloud repositories safeguarding books of accounts and confidential tax filings' },
    { code: 'MSME-DESK', title: 'Enterprise Retainer Architecture', desc: 'Specialized corporate compliance packages designed for Gujarat’s manufacturing and trading sector' }
  ];

  const handleWhatsAppConsult = () => {
    const text = 'Hello CA Team, I would like to schedule an in-person advisory session at your Ahmedabad office.';
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePartnerDirect = (partnerName) => {
    const text = `Hello Shree Chamunda Associates, I would like to schedule a private consultation with ${partnerName}.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="about-page fade-in">
      {/* ============================================================
          1. EXECUTIVE MIDNIGHT HERO BANNER
          ============================================================ */}
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-hero-glow glow-gold" aria-hidden="true"></div>
        <div className="about-hero-glow glow-blue" aria-hidden="true"></div>
        <div className="about-hero-grid" aria-hidden="true"></div>

        <div className="container">
          <div className="about-hero-badge">
            <span className="live-dot pulse"></span>
            <Icons.Landmark />
            <span>Institutional Tax Practice &bull; Ahmedabad, Gujarat</span>
          </div>

          <h1 id="about-hero-title">
            Architecting Statutory Precision &amp; <span className="hero-gradient-text">Institutional Tax Defense</span>
          </h1>

          <p className="about-hero-lead">
            Founded with an uncompromising commitment to fiduciary integrity, Shree Chamunda Associates delivers precision direct tax advisory, appellate dispute resolution, and corporate compliance architecture for ambitious Indian enterprises.
          </p>

          {/* Hero Credibility Ribbon */}
          <div className="about-hero-trust-ribbon">
            <div className="trust-ribbon-item">
              <span className="ribbon-icon text-gold"><Icons.Certificate /></span>
              <span>ICAI Practice Standards Aligned</span>
            </div>
            <span className="ribbon-sep">&bull;</span>
            <div className="trust-ribbon-item">
              <span className="ribbon-icon text-emerald"><Icons.Location /></span>
              <span>Central Chambers in Ahmedabad, Gujarat</span>
            </div>
            <span className="ribbon-sep">&bull;</span>
            <div className="trust-ribbon-item">
              <span className="ribbon-icon text-blue"><Icons.ShieldCheck /></span>
              <span>100% On-Time Statutory Track Record</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Page Content */}
      <div className="container about-main-layout">
        {/* ============================================================
            2. QUANTITATIVE BENCHMARKS RIBBON (Floating Overlap)
            ============================================================ */}
        <section className="about-stats-ribbon" aria-label="Firm Scale & Quantitative Benchmarks">
          {stats.map((stat, idx) => (
            <div key={idx} className={`about-stat-box ${stat.theme}`}>
              <div className="stat-box-top">
                <div className="stat-box-icon">
                  {stat.icon}
                </div>
                <h3 className="stat-box-num">{stat.number}</h3>
              </div>
              <strong className="stat-box-label">{stat.label}</strong>
              <span className="stat-box-desc">{stat.caption}</span>
            </div>
          ))}
        </section>

        {/* ============================================================
            3. EXECUTIVE FOUNDING MANIFESTO & FIDUCIARY COMMITMENTS
            ============================================================ */}
        <section className="about-manifesto-section" aria-labelledby="manifesto-title">
          <div className="manifesto-card">
            <div className="about-eyebrow-tag">
              <Icons.Feather />
              <span>FOUNDING MANIFESTO &bull; PRACTICE ETHOS</span>
            </div>

            <h2 id="manifesto-title" className="manifesto-heading">
              The Fiduciary Responsibility of the Modern Tax Practice
            </h2>

            <div className="manifesto-body">
              <p className="manifesto-lead-quote">
                &ldquo;Too many Indian enterprises suffer from surprise tax notices, delayed filings, and missed input credits because they are treated as generic batch numbers by transactional accounting shops. That model is broken.&rdquo;
              </p>

              <p className="manifesto-paragraph">
                Shree Chamunda Associates was established in Ahmedabad to provide an institutional alternative: a high-touch, partner-led Chartered Tax Advisory where every return is pre-reconciled, every statutory deduction is optimized, and client confidentiality is protected under strict fiduciary law.
              </p>

              <p className="manifesto-paragraph">
                Whether representing an enterprise through high-stakes GST scrutiny, structuring a cross-border entity, or managing routine ROC compliance, our clients work directly with senior advisors who understand the nuances of Indian tax jurisprudence.
              </p>
            </div>

            <div className="manifesto-sign-off">
              <div className="sign-off-identity">
                <strong className="founder-signature-name">Pragnesh Adiyecha</strong>
                <span className="founder-signature-title">Founder &amp; Principal Consultant &bull; Shree Chamunda Associates</span>
                <span className="founder-signature-loc">Ahmedabad, Gujarat</span>
              </div>
              <div className="firm-seal-block">
                <Icons.Landmark />
                <span>OFFICIAL PRACTICE SEAL</span>
              </div>
            </div>

            <div className="manifesto-actions">
              <button type="button" className="btn-manifesto-primary" onClick={() => navigate('/contact')}>
                <Icons.CalendarCheck />
                <span>Schedule Advisory Consultation</span>
                <Icons.ArrowRight />
              </button>
              <button type="button" className="btn-manifesto-secondary" onClick={handleWhatsAppConsult}>
                <Icons.WhatsApp />
                <span>WhatsApp Office Desk</span>
              </button>
            </div>
          </div>

          {/* 4 Fiduciary Horizontal Cards Stack */}
          <div className="manifesto-fiduciary-stack">
            {fiduciaryCommitments.map((item, idx) => (
              <div key={idx} className={`fiduciary-stack-card ${item.colorClass}`}>
                <div className="stack-card-header">
                  <div className="stack-icon-title-group">
                    <div className="stack-icon-box">
                      {item.icon}
                    </div>
                    <h3 className="stack-title">{item.title}</h3>
                  </div>
                  <span className="stack-tag">{item.tag}</span>
                </div>
                <p className="stack-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            4. THE 3-WAY COMPARATIVE DECISION MATRIX (Why Switch To Us)
            ============================================================ */}
        <section className="about-comparison-section" aria-labelledby="comparison-title">
          <div className="section-header-centered">
            <div className="about-eyebrow-tag">
              <Icons.Compass />
              <span>THE INSTITUTIONAL DIFFERENCE &bull; DECISION MATRIX</span>
            </div>
            <h2 id="comparison-title">Why Ambitious Businesses Switch to Us</h2>
            <p className="section-subtext">
              Compare how Shree Chamunda Associates delivers the technical precision of Tier-1 advisory firms with the direct accessibility and cost transparency of a dedicated partner.
            </p>
          </div>

          {/* Desktop 4-Column Table */}
          <div className="comparison-table-wrapper desktop-only-table">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="col-criterion">OPERATIONAL CRITERION</th>
                  <th className="col-traditional">TRADITIONAL LOCAL ACCOUNTANT</th>
                  <th className="col-big4">BIG 4 / NATIONAL PRACTICE</th>
                  <th className="col-chamunda">
                    <div className="chamunda-header-badge">
                      <span>SHREE CHAMUNDA ASSOCIATES</span>
                      <span className="recommended-chip">CHARTERED STANDARD</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonMatrix.map((row, idx) => (
                  <tr key={idx}>
                    <td className="cell-criterion">
                      <strong>{row.criterion}</strong>
                    </td>
                    <td className="cell-traditional">
                      <div className="cell-content">
                        <span className="status-cross"><Icons.Cross /></span>
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="cell-big4">
                      <div className="cell-content">
                        <span className="status-neutral">&bull;</span>
                        <span>{row.big4}</span>
                      </div>
                    </td>
                    <td className="cell-chamunda">
                      <div className="cell-content">
                        <span className="status-check"><Icons.Check /></span>
                        <strong>{row.chamunda}</strong>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Interactive Versus Deck */}
          <div className="comparison-mobile-deck mobile-only-deck">
            <div className="compare-segmented-control" role="tablist" aria-label="Comparison Perspective">
              <button
                type="button"
                role="tab"
                aria-selected={activeCompareTab === 'traditional'}
                className={`compare-segment-btn ${activeCompareTab === 'traditional' ? 'active' : ''}`}
                onClick={() => setActiveCompareTab('traditional')}
              >
                <span>vs Traditional Local CA</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCompareTab === 'big4'}
                className={`compare-segment-btn ${activeCompareTab === 'big4' ? 'active' : ''}`}
                onClick={() => setActiveCompareTab('big4')}
              >
                <span>vs Big 4 / National Firm</span>
              </button>
            </div>

            <div className="compare-cards-stack">
              {comparisonMatrix.map((row, idx) => (
                <div key={idx} className="compare-versus-card">
                  <div className="versus-card-criterion">
                    <span className="criterion-number">0{idx + 1}</span>
                    <strong className="criterion-title">{row.criterion}</strong>
                  </div>

                  <div className="versus-contrast-grid">
                    {/* Competitor Side */}
                    <div className="versus-side versus-competitor">
                      <div className="versus-side-header">
                        <span className="side-badge badge-competitor">
                          {activeCompareTab === 'traditional' ? 'Traditional Local CA' : 'Big 4 Practice'}
                        </span>
                      </div>
                      <div className="versus-side-body">
                        <span className="status-cross"><Icons.Cross /></span>
                        <p>{activeCompareTab === 'traditional' ? row.traditional : row.big4}</p>
                      </div>
                    </div>

                    {/* Chamunda Associates Side */}
                    <div className="versus-side versus-chamunda">
                      <div className="versus-side-header">
                        <span className="side-badge badge-chamunda">
                          SHREE CHAMUNDA
                        </span>
                        <span className="versus-chip-gold">Chartered Standard</span>
                      </div>
                      <div className="versus-side-body">
                        <span className="status-check"><Icons.Check /></span>
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
            5. SPECIALIZED INSTITUTIONAL PRACTICE DESKS
            ============================================================ */}
        <section className="about-practice-desks-section" aria-labelledby="practice-desks-title">
          <div className="section-header-centered">
            <div className="about-eyebrow-tag">
              <Icons.Briefcase />
              <span>INSTITUTIONAL PRACTICE STRUCTURE</span>
            </div>
            <h2 id="practice-desks-title">Four Specialized Advisory Desks</h2>
            <p className="section-subtext">
              Our firm is organized into dedicated practice desks, ensuring every facet of your tax planning, audit defense, and corporate governance is directed by domain specialists.
            </p>
          </div>

          {/* Unified Responsive Interactive Practice Desks Stage (Desktop 4-in-a-Row, Mobile 2x2) */}
          <div className="practice-desks-interactive-showcase">
            {/* Practice Desk Selector Tabs */}
            <div className="practice-desks-selector-grid" role="tablist" aria-label="Specialized Practice Desks">
              {practiceDesks.map((d, dIdx) => (
                <button
                  key={dIdx}
                  type="button"
                  role="tab"
                  id={`desk-tab-${dIdx}`}
                  aria-selected={activeDeskIdx === dIdx}
                  aria-controls={`desk-panel-${dIdx}`}
                  className={`desk-selector-tile ${activeDeskIdx === dIdx ? 'active' : ''}`}
                  onClick={() => setActiveDeskIdx(dIdx)}
                >
                  <div className="tile-top-row">
                    <span className="tile-badge">{d.code}</span>
                    <span className="tile-icon">{d.icon}</span>
                  </div>
                  <span className="tile-title">{d.title}</span>
                  <div className="tile-status-bar">
                    {activeDeskIdx === dIdx ? (
                      <span className="tile-active-label">
                        <span className="tile-live-pip"></span>
                        <span>Active Mandate</span>
                      </span>
                    ) : (
                      <span className="tile-idle-label">Inspect Mandate &rarr;</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Featured Active Desk Dossier Stage */}
            {(() => {
              const activeDesk = practiceDesks[activeDeskIdx];
              const prevIdx = (activeDeskIdx - 1 + practiceDesks.length) % practiceDesks.length;
              const nextIdx = (activeDeskIdx + 1) % practiceDesks.length;

              return (
                <div
                  className="active-desk-dossier-stage"
                  id={`desk-panel-${activeDeskIdx}`}
                  role="tabpanel"
                  aria-labelledby={`desk-tab-${activeDeskIdx}`}
                  key={activeDeskIdx}
                >
                  <div className="dossier-top-accent"></div>

                  <div className="dossier-stage-layout">
                    {/* Left: Practice Scope, Desc & Capabilities */}
                    <div className="dossier-main-content">
                      <div className="dossier-card-header">
                        <div className="dossier-header-left">
                          <div className="dossier-tags-row">
                            <span className="dossier-code-pill">{activeDesk.code}</span>
                            <span className="dossier-lead-badge">
                              <span className="live-dot pulse"></span>
                              <span>{activeDesk.leadCounsel}</span>
                            </span>
                          </div>
                          <span className="dossier-statute-note">{activeDesk.statute}</span>
                        </div>
                        <div className="dossier-insignia-seal desktop-hidden">
                          {activeDesk.icon}
                        </div>
                      </div>

                      <h3 className="dossier-desk-title">{activeDesk.title}</h3>

                      <div className="dossier-scope-strip">
                        <Icons.Briefcase />
                        <span>{activeDesk.scope}</span>
                      </div>

                      <p className="dossier-desk-desc">{activeDesk.desc}</p>

                      <div className="dossier-capabilities-section">
                        <span className="dossier-capabilities-label">Core Institutional Capabilities:</span>
                        <div className="dossier-badges-grid">
                          {activeDesk.badges.map((b, bIdx) => (
                            <div key={bIdx} className="dossier-capability-chip">
                              <span className="chip-check"><Icons.Check /></span>
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stepper Controls */}
                      <div className="dossier-stepper-bar">
                        <button
                          type="button"
                          className="stepper-nav-btn"
                          onClick={() => setActiveDeskIdx(prevIdx)}
                          aria-label={`Previous: ${practiceDesks[prevIdx].code}`}
                        >
                          <Icons.ArrowLeft />
                          <span>{practiceDesks[prevIdx].code}</span>
                        </button>

                        <div className="stepper-dots-indicator">
                          {practiceDesks.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              type="button"
                              className={`stepper-dot ${activeDeskIdx === dotIdx ? 'active' : ''}`}
                              onClick={() => setActiveDeskIdx(dotIdx)}
                              aria-label={`Switch to ${practiceDesks[dotIdx].code}`}
                            />
                          ))}
                          <span className="stepper-counter">{activeDeskIdx + 1} / {practiceDesks.length}</span>
                        </div>

                        <button
                          type="button"
                          className="stepper-nav-btn"
                          onClick={() => setActiveDeskIdx(nextIdx)}
                          aria-label={`Next: ${practiceDesks[nextIdx].code}`}
                        >
                          <span>{practiceDesks[nextIdx].code}</span>
                          <Icons.ArrowRight />
                        </button>
                      </div>

                      <div className="dossier-action-footer">
                        <button
                          type="button"
                          className="btn-dossier-retain"
                          onClick={() => navigate('/contact')}
                        >
                          <Icons.CalendarCheck />
                          <span>Retain {activeDesk.code} Senior Counsel</span>
                          <Icons.ArrowRight />
                        </button>
                      </div>
                    </div>

                    {/* Right: Institutional Governance Sidebar (Desktop Exclusive) */}
                    <div className="dossier-authority-sidebar">
                      <div className="dossier-sidebar-seal-box">
                        <div className="large-dossier-seal">
                          {activeDesk.icon}
                        </div>
                        <h4 className="sidebar-desk-designation">{activeDesk.code} &bull; {activeDesk.leadCounsel}</h4>
                        <span className="sidebar-statute-tag">{activeDesk.statute}</span>
                      </div>

                      <div className="sidebar-governance-list">
                        <div className="sidebar-governance-item">
                          <span className="gov-icon"><Icons.ShieldCheck /></span>
                          <div className="gov-text">
                            <strong>Senior Partner Oversight</strong>
                            <p>Handled exclusively by senior practice advocates, never delegated to uncredentialed trainees.</p>
                          </div>
                        </div>

                        <div className="sidebar-governance-item">
                          <span className="gov-icon"><Icons.Clock /></span>
                          <div className="gov-text">
                            <strong>24-Hour Scrutiny Action</strong>
                            <p>Statutory assessment notices analyzed with comprehensive jurisprudence brief within 24h.</p>
                          </div>
                        </div>

                        <div className="sidebar-governance-item">
                          <span className="gov-icon"><Icons.FileInvoice /></span>
                          <div className="gov-text">
                            <strong>Forensic Audit Trail</strong>
                            <p>Every filing, computational reconciliation, and appellate submission logged with forensic traceability.</p>
                          </div>
                        </div>
                      </div>

                      <div className="sidebar-direct-hotline">
                        <span className="hotline-label">Direct Practice Line:</span>
                        <a href="tel:+919510984735" className="hotline-phone">
                          <Icons.Phone />
                          <span>+91 95109 84735</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ============================================================
            6. EXECUTIVE LEADERSHIP & SENIOR ADVISORY DOSSIER
            ============================================================ */}
        <section className="about-leadership-section" aria-labelledby="leadership-title">
          <div className="section-header-centered">
            <div className="about-eyebrow-tag">
              <Icons.Users />
              <span>PRACTICE LEADERSHIP &bull; DIRECT ACCOUNTABILITY</span>
            </div>
            <h2 id="leadership-title">Leadership &amp; Advisory Panel</h2>
            <p className="section-subtext">
              Direct partner accessibility without bureaucratic intermediaries. Meet the professionals stewarding your corporate compliance architecture.
            </p>
          </div>

          <div className="leadership-cards-grid">
            {leadershipProfiles.map((profile, idx) => (
              <div key={idx} className={`leadership-executive-card ${profile.isFounder ? 'founder-card' : ''}`}>
                <div className="leader-card-header">
                  <div className="leader-avatar-badge">
                    <div className="partner-avatar-monogram">
                      <span className="monogram-text">{profile.initials}</span>
                    </div>
                    {profile.isFounder && <span className="founder-ribbon">FOUNDER</span>}
                  </div>

                  <div className="leader-identity">
                    <h3 className="leader-name">{profile.name}</h3>
                    <strong className="leader-role">{profile.role}</strong>
                    <span className="leader-cred">{profile.credentials}</span>
                  </div>
                </div>

                <div className="leader-experience-strip">
                  <span className="exp-icon">{profile.icon}</span>
                  <span className="exp-text">{profile.experience}</span>
                </div>

                <p className="leader-bio-text">{profile.bio}</p>

                <div className="leader-focus-box">
                  <span className="focus-label">PRACTICE FOCUS:</span>
                  <p className="focus-list">{profile.specialty}</p>
                </div>

                <div className="leader-badges-wrap">
                  {profile.badges.map((badge, bIdx) => (
                    <span key={bIdx} className="practice-badge-chip">
                      <Icons.Check />
                      <span>{badge}</span>
                    </span>
                  ))}
                </div>

                <div className="leader-card-footer">
                  <button
                    type="button"
                    className="btn-leader-consult"
                    onClick={() => handlePartnerDirect(profile.name)}
                  >
                    <span>Request Private Consultation</span>
                    <Icons.ArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Senior Advisory Network Note */}
          <div className="senior-advisory-panel-note">
            <div className="panel-note-icon">
              <Icons.Scale />
            </div>
            <div className="panel-note-content">
              <strong>Multidisciplinary Senior Associate &amp; Legal Advisory Panel</strong>
              <p>
                For high-stakes appellate proceedings and cross-border commercial restructuring, our practice engages a select panel of Senior Advocates, Chartered Accountants, and Company Secretaries, providing dual-tier cross-examination on complex tax litigation matters.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            7. UNIFIED CHRONOLOGICAL GROWTH TRACK (Zero Dead Space)
            ============================================================ */}
        <section className="about-timeline-section" aria-labelledby="timeline-title">
          <div className="section-header-centered">
            <div className="about-eyebrow-tag">
              <Icons.History />
              <span>VERIFIABLE PROGRESS &bull; PRACTICE TRACK RECORD</span>
            </div>
            <h2 id="timeline-title">Milestones of Chartered Growth</h2>
            <p className="section-subtext">
              A verifiable chronicle of institutional expansion, compliance milestones, and digital modernization from our Nikol chambers to managing enterprise networks across Gujarat.
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
                  <div className="milestone-card-top">
                    <span className="milestone-phase-badge">{step.phase}</span>
                    <span className="milestone-metric-tag">{step.metric}</span>
                  </div>
                  <h3 className="milestone-title">{step.title}</h3>
                  <p className="milestone-desc">{step.desc}</p>
                  <div className="milestone-footer">
                    <span className="milestone-verify-badge">
                      <Icons.Check />
                      <span>{step.badge}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            8. AUTHENTIC REGULATORY FRAMEWORK & GOVERNANCE STANDARDS
            ============================================================ */}
        <section className="about-accreditations-section" aria-label="Institutional Accreditations & Governance">
          <div className="accreditations-header">
            <span className="accred-eyebrow">STATUTORY GOVERNANCE &bull; ETHICAL MANDATE</span>
            <h3>Engineered for Absolute Statutory Compliance</h3>
            <p className="accred-sub">
              Our firm operates strictly within the ethical framework of Indian regulatory statutes, ensuring full insulation for your enterprise.
            </p>
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
        </section>

        {/* ============================================================
            9. PHYSICAL PRACTICE CHAMBERS & TRANSIT GUIDE
            ============================================================ */}
        <section className="about-chambers-section" aria-labelledby="chambers-title">
          <div className="chambers-card-wrapper">
            <div className="chambers-narrative-col">
              <div className="about-eyebrow-tag">
                <Icons.Location />
                <span>PHYSICAL PRESENCE &bull; CENTRAL CHAMBERS</span>
              </div>
              <h2 id="chambers-title">Our Ahmedabad Practice Chambers</h2>
              <p className="chambers-lead-text">
                We believe financial counsel must be grounded in direct, accessible, personal relationships. Corporate leaders and founders are welcome to schedule in-person advisory sessions at our fully equipped chambers in Nikol, Ahmedabad.
              </p>

              <div className="chambers-specs-list">
                <div className="chambers-spec-item">
                  <div className="chambers-spec-icon">
                    <Icons.Location />
                  </div>
                  <div>
                    <span className="spec-label">OFFICIAL CHAMBERS ADDRESS:</span>
                    <strong className="spec-value">{address}</strong>
                  </div>
                </div>

                <div className="chambers-spec-item">
                  <div className="chambers-spec-icon">
                    <Icons.Clock />
                  </div>
                  <div>
                    <span className="spec-label">ADVISORY CONSULTATION HOURS:</span>
                    <strong className="spec-value">Monday – Saturday: 10:00 AM – 7:00 PM IST</strong>
                  </div>
                </div>

                <div className="chambers-spec-item">
                  <div className="chambers-spec-icon">
                    <Icons.Phone />
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
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad, Gujarat 380049')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-directions"
                >
                  <Icons.Location />
                  <span>Open Google Maps Directions</span>
                </a>
                <button type="button" className="btn-visit" onClick={handleWhatsAppConsult}>
                  <Icons.CalendarCheck />
                  <span>Schedule In-Person Consultation</span>
                </button>
              </div>
            </div>

            {/* Visual Facility Showcase Card */}
            <div className="chambers-visual-col">
              <div className="chambers-visual-card">
                <div className="chambers-card-glass-header">
                  <div className="chambers-logo-mark">
                    <img src="/assets/logo-transparent-svg.svg" alt="Firm Seal" onError={(e) => { e.target.style.display = 'none'; }} />
                    <div>
                      <strong>Shree Chamunda Associates</strong>
                      <span>Chartered Tax &amp; Corporate Advisory</span>
                    </div>
                  </div>
                  <span className="chamber-status-badge">
                    <span className="live-dot pulse"></span>
                    ACTIVE CHAMBERS
                  </span>
                </div>

                <div className="chambers-highlights">
                  <div className="ch-highlight-item">
                    <Icons.Check />
                    <span>Private Partner Consultation Chambers</span>
                  </div>
                  <div className="ch-highlight-item">
                    <Icons.Check />
                    <span>Secure Digital Client Ingestion Infrastructure</span>
                  </div>
                  <div className="ch-highlight-item">
                    <Icons.Check />
                    <span>Appellate Scrutiny &amp; Statutory Hearing Preparation</span>
                  </div>
                  <div className="ch-highlight-item">
                    <Icons.Check />
                    <span>High-Speed Direct Filing &amp; Reconciliation Terminals</span>
                  </div>
                </div>

                <div className="chambers-visual-footer">
                  <span className="cf-tag">Nikol &bull; Ahmedabad, Gujarat &bull; Serving Enterprises Statewide</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            10. EXECUTIVE CLOSING CTA BANNER
            ============================================================ */}
        <section className="about-closing-cta">
          <div className="cta-ambient-glow" aria-hidden="true"></div>
          <div className="cta-grid-bg" aria-hidden="true"></div>

          <div className="cta-inner-content">
            <span className="cta-top-chip">RETAIN CHARTERED COUNSEL &bull; SCALE WITH CONFIDENCE</span>
            <h2>Ready to Partner with Seasoned Tax Advisors?</h2>
            <p>
              Schedule a confidential initial consultation to review your current tax structure, eliminate notice vulnerabilities, and secure an institutional compliance architecture.
            </p>

            <div className="cta-btn-group">
              <button type="button" className="btn-cta-gold" onClick={() => navigate('/contact')}>
                <span className="btn-shine"></span>
                <span>Schedule Confidential Review</span>
                <Icons.ArrowRight />
              </button>
              <button type="button" className="btn-cta-whatsapp" onClick={handleWhatsAppConsult}>
                <Icons.WhatsApp />
                <span>Chat on WhatsApp Desk</span>
              </button>
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="btn-cta-outline">
                <Icons.Phone />
                <span>Call Directly: {phone}</span>
              </a>
            </div>

            <div className="cta-trust-guarantees">
              <span className="cta-guarantee-pill">
                <Icons.Check />
                <span>Direct Senior Partner Counsel</span>
              </span>
              <span className="cta-guarantee-pill">
                <Icons.Check />
                <span>Strict ICAI NDA Confidentiality</span>
              </span>
              <span className="cta-guarantee-pill">
                <Icons.Check />
                <span>&lt; 24h Response SLA</span>
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
