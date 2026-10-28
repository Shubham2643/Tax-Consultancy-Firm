import { useState, useMemo, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { getPricing, submitContact } from '../api';
import useFetch from '../hooks/useFetch';
import './Pricing.css';

const STATUTORY_RETAINER_TIERS = [
  {
    id: 'starter',
    code: 'TIER 01',
    name: 'Foundational Practice Retainer',
    shortName: 'Foundational Retainer',
    target: 'Sole Proprietors, Freelancers & Emerging MSMEs',
    priceMonthly: 2999,
    priceAnnual: 2499,
    tierClass: 'tier-card-starter',
    volumeTag: 'Up to 50 Vouchers / Mo',
    volumeIcon: 'fa-solid fa-receipt',
    badge: 'FOUNDATIONAL STATUTORY',
    roiBadge: 'Eliminates 15+ Hours Monthly',
    icon: 'fa-solid fa-scale-unbalanced',
    summary:
      'Essential statutory accounting, monthly GST filings, advance tax forecasting, and year-end financial statement preparation engineered for proprietorships and independent practitioners.',
    disciplines: [
      {
        title: 'Bookkeeping & Banking',
        detail: 'Monthly bookkeeping up to 50 vouchers with automated bank ledger reconciliation.',
      },
      {
        title: 'GST & Indirect Taxes',
        detail: 'Timely filing of GSTR-1 and GSTR-3B before 11th & 20th statutory deadlines.',
      },
      {
        title: 'Direct Tax Forecasting',
        detail: 'Quarterly Advance Tax calculation (Sec 208/211) & 26AS/AIS credit cross-check.',
      },
      {
        title: 'Year-End Compilation',
        detail: 'Drafting of Balance Sheet, Profit & Loss statement, and Form ITR-3/ITR-4 filing.',
      },
      {
        title: 'Vault & Written SLA',
        detail: 'Encrypted Client Vault access with guaranteed 24-hour query turnaround.',
      },
    ],
    matrix: {
      entity: 'Sole Proprietorship / Independent',
      vouchers: 'Up to 50 / Month',
      gstFilings: 'Monthly (GSTR-1 & 3B)',
      itcMatching: 'Basic GSTR-2B Overview',
      advanceTaxTds: 'Quarterly Advance Tax Model',
      rocFilings: 'Not Applicable',
      noticeDefense: 'Section 143(1) Advisory Review',
      partnerSla: '< 24 Hours Written Response',
    },
    ctaText: 'Retain Foundational Desk',
    serviceInterest: 'Foundational Practice Retainer (₹2,499/mo)',
  },
  {
    id: 'growth',
    code: 'TIER 02',
    name: 'Corporate & MSME Statutory Retainer',
    shortName: 'Corporate & MSME Retainer',
    target: 'Private Limited Companies, Active LLPs & Trading MSMEs',
    priceMonthly: 5999,
    priceAnnual: 4999,
    tierClass: 'tier-card-growth',
    isPopular: true,
    volumeTag: 'Up to 150 Vouchers / Mo',
    volumeIcon: 'fa-solid fa-layer-group',
    badge: 'MOST RETAINED • FIRM BENCHMARK',
    roiBadge: 'Recovers ~₹1.2L+ Blocked ITC',
    icon: 'fa-solid fa-building-columns',
    summary:
      'Complete accounting outsourcing, deep algorithmic GSTR-2B input tax matching, quarterly TDS returns, annual ROC secretarial compliance, and direct Senior CA partner oversight.',
    disciplines: [
      {
        title: 'Full Ledger Outsourcing',
        detail: 'Ledger curation up to 150 vouchers/mo across multi-bank & gateway transactions.',
      },
      {
        title: 'Forensic GSTR-2B Matching',
        detail: 'Algorithmic vendor invoice reconciliation to eliminate input tax credit leakage.',
      },
      {
        title: 'Quarterly TDS & Form 16',
        detail: 'Form 24Q (Salary) & 26Q (Vendor) return filings with automated certificate issuance.',
      },
      {
        title: 'Annual ROC Compliance',
        detail: 'Mandatory MCA filing: Form AOC-4, MGT-7 drafting and Director DIR-3 KYC.',
      },
      {
        title: 'Statutory Notice Defense',
        detail: 'ASMT-10, DRC-01, and routine departmental scrutiny rejoinder drafting included.',
      },
      {
        title: 'Priority Partner Desk',
        detail: 'Designated Senior Chartered Accountant with priority WhatsApp desk (< 4h SLA).',
      },
    ],
    matrix: {
      entity: 'Pvt Ltd, LLP, Active MSME Trader',
      vouchers: 'Up to 150 / Month',
      gstFilings: 'Monthly (GSTR-1 & 3B) + IFF',
      itcMatching: 'Forensic Algorithmic Matching',
      advanceTaxTds: 'Quarterly 24Q/26Q TDS + Form 16',
      rocFilings: 'Form AOC-4, MGT-7 & DIR-3 KYC',
      noticeDefense: 'ASMT-10, DRC-01 & 143(1) Defense',
      partnerSla: 'Priority WhatsApp Desk (< 4 Hours)',
    },
    ctaText: 'Retain Corporate Mandate',
    serviceInterest: 'Corporate & MSME Statutory Retainer (₹4,999/mo)',
  },
  {
    id: 'cfo',
    code: 'TIER 03',
    name: 'Enterprise & Multi-State Retainer',
    shortName: 'Enterprise Virtual CFO',
    target: 'Multi-Branch Corporates, Factories & Turnover > ₹5 Cr',
    priceMonthly: 24999,
    priceAnnual: 20999,
    tierClass: 'tier-card-enterprise',
    volumeTag: 'Uncapped Enterprise Volume',
    volumeIcon: 'fa-solid fa-network-wired',
    badge: 'ENTERPRISE AUDIT & CFO',
    roiBadge: '100% Tax Audit Defense Coverage',
    icon: 'fa-solid fa-shield-halved',
    summary:
      'Turnkey executive financial leadership, corporate ITR-6 direct tax filing, Section 44AB statutory tax audit defense, multi-GSTIN cross-state consolidations, and ITAT appellate representation.',
    disciplines: [
      {
        title: 'Virtual CFO Leadership',
        detail: 'Monthly Executive Board MIS, cashflow forecasting, and working capital modeling.',
      },
      {
        title: 'Multi-State GST Consolidation',
        detail: 'Cross-state GSTIN reconciliation, cross-charge review, and GSTR-9/9C annual audit.',
      },
      {
        title: 'Section 44AB Tax Audit',
        detail: 'Statutory direct tax audit execution, Form 3CD compilation, and corporate ITR-6.',
      },
      {
        title: 'Appellate Notice Defense',
        detail: 'CIT(Appeals), ITAT, and Revisional Bench legal rejoinders and representation.',
      },
      {
        title: 'Secretarial & Board Governance',
        detail: 'Drafting Board meeting minutes, share transfers, and statutory register custody.',
      },
      {
        title: 'Dedicated Senior Partner',
        detail: 'Exclusive FCA Partner assigned with direct boardroom consultation access.',
      },
    ],
    matrix: {
      entity: 'Multi-State Corp, Factory, Group Holding',
      vouchers: 'Uncapped Enterprise Volume',
      gstFilings: 'Multi-State Consolidated GSTINs',
      itcMatching: 'Forensic Vendor Recovery & Audit',
      advanceTaxTds: 'Full Corporate TDS & Section 194R/Q',
      rocFilings: 'Complete Secretarial & Board Registers',
      noticeDefense: 'CIT(A), ITAT & Appellate Benches',
      partnerSla: 'Dedicated Senior Partner Assigned',
    },
    ctaText: 'Engage Enterprise Retainer',
    serviceInterest: 'Enterprise & Multi-State Retainer (₹20,999/mo)',
  },
  {
    id: 'incorporation',
    code: 'TIER 04',
    name: 'Turnkey Corporate Incorporation Retainer',
    shortName: 'Turnkey Incorporation',
    target: 'New Startups, Foreign Subsidiaries & Expanding Ventures',
    priceMonthly: 49999,
    priceAnnual: 49999,
    tierClass: 'tier-card-incorporation',
    isOneTime: true,
    volumeTag: 'Complete Entity Formation',
    volumeIcon: 'fa-solid fa-bolt',
    badge: 'ONE-TIME FORMATION MANDATE',
    roiBadge: '5–7 Day Guaranteed Incorporation',
    icon: 'fa-solid fa-stamp',
    summary:
      'Complete legal entity formation under MCA SPICe+, 2 Class-3 USB cryptographic DSCs, DINs, PAN/TAN, DPIIT 80-IAC startup tax holiday filing, and complimentary 60-day post-incorporation advisory desk.',
    disciplines: [
      {
        title: 'SPICe+ Incorporation',
        detail: 'MCA RUN name approval, MoA/AoA drafting, stamp duty & certificate of incorporation.',
      },
      {
        title: 'Cryptographic Credentials',
        detail: '2 Class-3 USB cryptographic DSC tokens & 2 Director Identification Numbers (DINs).',
      },
      {
        title: 'Tax Registrations',
        detail: 'Corporate PAN, TAN, GSTIN, and Gujarat Professional Tax employer registrations.',
      },
      {
        title: 'Startup 80-IAC Holiday',
        detail: 'DPIIT Startup India certification facilitating 3-year Section 80-IAC tax exemption.',
      },
      {
        title: 'Banking & Board Protocol',
        detail: 'Zero-balance corporate current account opening + First Board Meeting minutes.',
      },
      {
        title: 'Complimentary Advisory Desk',
        detail: '60 Days of complimentary post-formation compliance review by senior CA.',
      },
    ],
    matrix: {
      entity: 'New Pvt Ltd / LLP / OPC Venture',
      vouchers: 'Setup Phase Governance Included',
      gstFilings: 'GSTIN Registration Included',
      itcMatching: 'Pre-Incorporation Asset Credit',
      advanceTaxTds: 'TAN Allotment & Deductor Setup',
      rocFilings: 'SPICe+, MoA, AoA & Statutory Registers',
      noticeDefense: 'Zero-Defect Filing Guarantee',
      partnerSla: 'Founder Structuring Strategy Call',
    },
    ctaText: 'Incorporate Your Entity',
    serviceInterest: 'Turnkey Corporate Incorporation (₹49,999)',
  },
];

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions', count: 6 },
  { id: 'fees', label: 'Fees & Challans', count: 2 },
  { id: 'defense', label: 'Notice Defense', count: 1 },
  { id: 'cfo', label: 'Virtual CFO', count: 1 },
  { id: 'nda', label: 'Legal & NDA', count: 1 },
  { id: 'tax', label: 'GST ITC', count: 1 },
];

const PRICING_FAQS = [
  {
    id: 'challans',
    category: 'fees',
    categoryLabel: 'Fee Transparency',
    icon: 'fa-solid fa-file-invoice-dollar',
    q: 'How do you delineate government statutory challans from professional retainer fees?',
    a: 'We practice absolute fiduciary transparency under ICAI ethics. Government portal fees (such as actual GST cash liability, MCA portal filing fees, or income tax challans) are paid directly through government payment gateways or billed at actual treasury challan receipts. Our professional retainer fee is strictly fixed and scope-locked, eliminating arbitrary surcharges.',
    takeaway: 'Zero markups on treasury challans — all government taxes are remitted directly to statutory gateways or billed at actual treasury receipts.',
  },
  {
    id: 'scaling',
    category: 'fees',
    categoryLabel: 'Retainer Scalability',
    icon: 'fa-solid fa-arrow-trend-up',
    q: 'Can our firm upgrade or scale retainers as our transaction volume grows?',
    a: 'Yes, seamlessly. Many Ahmedabad and Gujarat ventures begin on our Foundational tier and transition to Corporate Retainer or Virtual CFO as monthly sales volumes, branch locations, and vendor registers expand. Mid-year transitions are pro-rated without any onboarding friction or disruption to ongoing statutory filing continuity.',
    takeaway: 'Pro-rata tier upgrades anytime with zero onboarding friction and zero disruption to ongoing statutory filing schedules.',
  },
  {
    id: 'defense',
    category: 'defense',
    categoryLabel: 'Notice Defense',
    icon: 'fa-solid fa-shield-halved',
    q: 'What is included in the Statutory Notice Defense coverage?',
    a: 'Clients on our Corporate and Enterprise retainers receive routine department notice defense covered under their scope. When an automated scrutiny inquiry, Section 143(1) intimation, ASMT-10 mismatch notice, or DRC-01 show-cause notice is issued, our senior CAs draft the legal rejoinder, reconcile purchase registers, and represent your firm at no extra emergency surcharge.',
    takeaway: 'Section 143(1), ASMT-10, and DRC-01 legal rejoinders drafted and filed by Senior CAs at zero extra emergency surcharge.',
  },
  {
    id: 'cfo',
    category: 'cfo',
    categoryLabel: 'Virtual CFO ROI',
    icon: 'fa-solid fa-user-tie',
    q: 'How does your Virtual CFO retainer compare to an in-house full-time CFO?',
    a: 'A seasoned full-time CFO commands ₹25L–₹40L+ annually plus equity, bonuses, and severance overhead. Our Virtual CFO desk provides institutional partner-level financial leadership, cashflow modeling, Section 44AB audit representation, and board-level MIS reporting for a predictable fraction of the cost, backed by a multidisciplinary team of CAs, CSs, and tax advocates.',
    takeaway: 'Partner-level financial leadership and Section 44AB audit defense at ~80% lower cost than full-time executive hires.',
  },
  {
    id: 'nda',
    category: 'nda',
    categoryLabel: 'Client Privacy & NDA',
    icon: 'fa-solid fa-file-contract',
    q: 'Do you execute a mutual Non-Disclosure Agreement (NDA) before inspecting our books?',
    a: 'Yes, unconditionally. Prior to onboarding, client data ingestion, or portal credential exchange, we execute a legally binding Mutual Non-Disclosure Agreement (NDA). All accounting data, bank statements, and tax records are stored in ISO 27001-compliant, encrypted repositories in accordance with Section 128 of the Companies Act.',
    takeaway: 'Enforceable Mutual NDA executed prior to onboarding, with ISO 27001 and Companies Act Sec 128 encrypted data custody.',
  },
  {
    id: 'itc',
    category: 'tax',
    categoryLabel: '18% GST Input Credit',
    icon: 'fa-solid fa-receipt',
    q: 'Can we claim 18% GST Input Tax Credit (ITC) on your retainer invoices?',
    a: 'Yes. Shree Chamunda Associates issues fully compliant GST tax invoices for all retainer mandates. Corporates, LLPs, and registered GST entities can claim 100% of the 18% GST charged on our professional fees as Input Tax Credit against their business output liability.',
    takeaway: '100% of the 18% GST charged on professional retainer fees is legally deductible as business expense and recoverable as ITC.',
  },
];

const MATRIX_CATEGORIES = [
  {
    id: 'accounting',
    categoryTitle: '01. Accounting, Ledger Governance & Archival',
    categoryIcon: 'fa-solid fa-book-bookmark',
    rows: [
      {
        title: 'Target Business Profile',
        desc: 'ICAI engagement classification & legal entity scope',
        tierValues: [
          {
            main: 'Sole Proprietorship / Independent',
            sub: 'Proprietorships, freelancers & consultants',
            tag: { text: 'Proprietorship', type: 'neutral' },
          },
          {
            main: 'Pvt Ltd, LLP, Trading & Mfg MSME',
            sub: 'Active businesses requiring full compliance',
            tag: { text: 'Core MSME Segment', type: 'benchmark', icon: 'fa-solid fa-star' },
            isBenchmark: true,
          },
          {
            main: 'Multi-State Corp, Factory, Holding',
            sub: 'Turnover exceeding ₹5 Crore threshold',
            tag: { text: 'Enterprise Scale', type: 'enterprise' },
          },
          {
            main: 'New Startup, OPC, LLP or Foreign Sub',
            sub: 'Founding teams & parent entity setup',
            tag: { text: 'Formation Mandate', type: 'formation' },
          },
        ],
      },
      {
        title: 'Monthly Bookkeeping & Ledger Curation',
        desc: 'Bank statement ingestion, dual-entry posting & ledger reconciliations',
        tierValues: [
          {
            main: 'Up to 50 Vouchers / Month',
            sub: 'Single bank account ledger curation',
            tag: { text: 'Essential Volume', type: 'neutral' },
          },
          {
            main: 'Up to 150 Vouchers / Month',
            sub: 'Multi-bank accounts & gateway reconciliations',
            tag: { text: 'Active MSME Volume', type: 'benchmark' },
            isBenchmark: true,
          },
          {
            main: 'Uncapped Enterprise Volume',
            sub: 'Multi-branch & high-frequency ledgers',
            tag: { text: 'Uncapped Scale', type: 'enterprise', icon: 'fa-solid fa-infinity' },
          },
          {
            main: 'Chart of Accounts Architecture',
            sub: 'Opening Balance Sheet & statutory setup',
            tag: { text: 'One-Time Setup', type: 'formation' },
          },
        ],
      },
      {
        title: 'Digital Custody & Cloud Vault',
        desc: 'Companies Act Sec 128 mandatory 8-year statutory archival',
        tierValues: [
          {
            main: 'Secure Encrypted Vault',
            sub: 'Single-user client portal access',
            icon: 'fa-solid fa-cloud-arrow-up text-emerald',
          },
          {
            main: 'Multi-User Corporate Vault',
            sub: 'Role-based Director & Finance Team access',
            icon: 'fa-solid fa-cloud-arrow-up text-amber',
            tag: { text: 'Multi-Seat Role Access', type: 'benchmark' },
            isBenchmark: true,
          },
          {
            main: '24/7 Dedicated Archival Vault',
            sub: 'Immutable audit trail logs & legal custody',
            icon: 'fa-solid fa-vault text-blue',
            tag: { text: 'Full Audit Trail', type: 'enterprise' },
          },
          {
            main: 'Lifetime Incorporation Dossier',
            sub: 'Digital custody of MoA, AoA, PAN, TAN & COI',
            icon: 'fa-solid fa-file-shield text-purple',
            tag: { text: 'Lifetime Custody', type: 'formation' },
          },
        ],
      },
    ],
  },
  {
    id: 'gst',
    categoryTitle: '02. Indirect Taxation (GST) & Input Tax Credit',
    categoryIcon: 'fa-solid fa-receipt',
    rows: [
      {
        title: 'Periodic GST Return Filings',
        desc: 'GSTR-1 outward sales, GSTR-3B monthly summary & quarterly IFF',
        tierValues: [
          {
            main: 'Monthly GSTR-1 & GSTR-3B',
            sub: 'Single state jurisdiction filing',
            tag: { text: 'On-Time Filing', type: 'neutral' },
          },
          {
            main: 'Monthly GSTR-1 & 3B + Quarterly IFF',
            sub: 'Comprehensive monthly / QRMP filing cycle',
            tag: { text: 'Zero Late Fees', type: 'benchmark', icon: 'fa-solid fa-check' },
            isBenchmark: true,
          },
          {
            main: 'Multi-State Consolidated GSTINs',
            sub: 'Cross-state reconciliation + GSTR-9/9C audit',
            tag: { text: 'Multi-GSTIN Audit', type: 'enterprise' },
          },
          {
            main: 'GSTIN Registration & LUT Bond',
            sub: 'Zero export tax clearance documentation',
            tag: { text: 'Fresh Registration', type: 'formation' },
          },
        ],
      },
      {
        title: 'Input Tax Credit (ITC) Recovery',
        desc: 'Algorithmic GSTR-2B matching against purchases to stop cash leakages',
        tierValues: [
          {
            main: 'Quarterly GSTR-2B Review',
            sub: 'Periodic variance checks',
            tag: { text: 'Basic Match', type: 'neutral' },
          },
          {
            main: 'Algorithmic GSTR-2B Matching',
            sub: 'Eliminates blocked & uncredited vendor tax',
            tag: { text: 'Recovers ~₹1.2L+ Blocked ITC', type: 'benchmark', icon: 'fa-solid fa-arrow-trend-up' },
            isBenchmark: true,
          },
          {
            main: 'Forensic Vendor Audit & Recovery',
            sub: 'Automated vendor deficiency follow-ups',
            tag: { text: 'Forensic Verification', type: 'enterprise' },
          },
          {
            main: 'Pre-Incorporation Asset Credit',
            sub: 'Sec 18(1) ITC capture on capital goods held',
            tag: { text: 'Sec 18(1) Credit', type: 'formation' },
          },
        ],
      },
      {
        title: '18% GST Input Credit on Fees',
        desc: 'Valid GST tax invoice issued with firm GSTIN for 100% tax offset',
        tierValues: [
          {
            main: 'Eligible for 18% ITC Offset',
            sub: 'Standard GST tax invoice provided',
            isCheck: true,
          },
          {
            main: 'Eligible for 18% ITC Offset',
            sub: 'Full business expense deduction',
            isCheck: true,
            isBenchmark: true,
          },
          {
            main: 'Eligible for 18% ITC Offset',
            sub: 'Consolidated multi-unit tax invoices',
            isCheck: true,
          },
          {
            main: 'Eligible for 18% ITC Offset',
            sub: 'Invoiced to new company post-incorporation',
            isCheck: true,
          },
        ],
      },
    ],
  },
  {
    id: 'direct-tax',
    categoryTitle: '03. Direct Taxes, TDS & Corporate Secretarial',
    categoryIcon: 'fa-solid fa-landmark',
    rows: [
      {
        title: 'Direct Taxes & Quarterly TDS Returns',
        desc: 'Sec 208 advance tax estimation, Form 24Q/26Q & Form 16 generation',
        tierValues: [
          {
            main: 'Quarterly Advance Tax Estimation',
            sub: 'Sec 208/211 computational forecast',
            tag: { text: 'Sec 208 Model', type: 'neutral' },
          },
          {
            main: 'Quarterly 24Q & 26Q TDS + Form 16',
            sub: 'Salary & vendor tax withholding returns',
            tag: { text: 'Form 16/16A Gen', type: 'benchmark', icon: 'fa-solid fa-bolt' },
            isBenchmark: true,
          },
          {
            main: 'Full Corporate TDS & Sec 194Q / 194R',
            sub: 'Statutory Form 3CD schedules & corporate tax return',
            tag: { text: 'High-Value Governance', type: 'enterprise' },
          },
          {
            main: 'Corporate PAN & TAN Allotment',
            sub: 'Immediate TRACES deductor registration',
            tag: { text: 'TAN Deductor Setup', type: 'formation' },
          },
        ],
      },
      {
        title: 'MCA Secretarial & ROC Filings',
        desc: 'Companies Act 2013 compliance: Form AOC-4, MGT-7 & Director KYC',
        tierValues: [
          {
            main: 'Not Applicable',
            sub: 'Proprietorship entities exempt from MCA',
            isNA: true,
          },
          {
            main: 'Form AOC-4, MGT-7 & DIR-3 KYC',
            sub: 'Annual MCA balance sheet & return submissions',
            tag: { text: 'Mandatory For Pvt Ltd', type: 'benchmark' },
            isBenchmark: true,
          },
          {
            main: 'Complete Secretarial & Board Registers',
            sub: 'Board minutes, AGM registers & statutory book custody',
            tag: { text: 'Full Board Secretarial', type: 'enterprise' },
          },
          {
            main: 'SPICe+, MoA, AoA & COI Issuance',
            sub: '2x Class-3 USB DSC tokens + 2x DINs included',
            tag: { text: '5–7 Day Guaranteed', type: 'formation', icon: 'fa-solid fa-shield' },
          },
        ],
      },
    ],
  },
  {
    id: 'defense-sla',
    categoryTitle: '04. Departmental Defense, Scrutiny & Senior Partner SLA',
    categoryIcon: 'fa-solid fa-shield-halved',
    rows: [
      {
        title: 'Notice Resolution & Scrutiny Defense',
        desc: 'ASMT-10, DRC-01, Sec 143(1) intimations & appellate benches',
        tierValues: [
          {
            main: 'Section 143(1) Advisory Review',
            sub: 'Automated intimation & mismatch advisory',
            tag: { text: 'Sec 143(1) Cover', type: 'neutral' },
          },
          {
            main: 'ASMT-10, DRC-01 & 143(1) Scrutiny Defense',
            sub: 'Formal legal rejoinders submitted to tax authorities',
            tag: { text: 'Full Scrutiny Shield', type: 'benchmark', icon: 'fa-solid fa-shield' },
            isBenchmark: true,
          },
          {
            main: 'CIT(Appeals), ITAT & Appellate Benches',
            sub: 'Senior partner representation before tribunal benches',
            tag: { text: 'Tribunal Representation', type: 'enterprise' },
          },
          {
            main: 'Zero-Defect Filing Guarantee',
            sub: 'Pre-scrutiny by CA to prevent MCA resubmission queries',
            tag: { text: 'Resubmission Shield', type: 'formation' },
          },
        ],
      },
      {
        title: 'Designated Senior CA Partner SLA',
        desc: 'Direct partner turnaround commitment & dedicated communication channel',
        tierValues: [
          {
            main: '< 24h Written Response SLA',
            sub: 'Direct ticket & email client desk',
            slaType: 'standard',
            slaIcon: 'fa-regular fa-clock',
          },
          {
            main: 'Priority WhatsApp Desk (< 4 Hours)',
            sub: 'Direct WhatsApp communication with designated CA',
            slaType: 'priority',
            slaIcon: 'fa-brands fa-whatsapp',
            isBenchmark: true,
            tag: { text: 'Direct Partner Line', type: 'benchmark' },
          },
          {
            main: 'Dedicated Senior FCA Partner Assigned',
            sub: 'Boardroom consultations & direct executive phone line',
            slaType: 'executive',
            slaIcon: 'fa-solid fa-user-tie',
          },
          {
            main: '1-on-1 Founder Structuring Call',
            sub: 'Direct equity capital & tax advisory session',
            slaType: 'formation',
            slaIcon: 'fa-solid fa-phone-volume',
          },
        ],
      },
    ],
  },
];

const MANDATE_OPTIONS = [
  { id: 'Corporate & MSME Statutory Retainer', label: 'Corporate & MSME', tag: '₹4,999/mo', popular: true },
  { id: 'Enterprise & Multi-State Retainer', label: 'Enterprise CFO', tag: '₹20,999/mo' },
  { id: 'Foundational Practice Retainer', label: 'Foundational Practice', tag: '₹2,499/mo' },
  { id: 'Turnkey Corporate Incorporation', label: 'Turnkey Incorporation', tag: '₹49,999' },
  { id: 'Custom Multi-Branch Corporate Retainer', label: 'Factory / Multi-Branch', tag: 'Bespoke Retainer' },
];

const VOLUME_OPTIONS = [
  { id: '< 50', label: '< 50 Vouchers', sub: 'Foundational' },
  { id: '50-150', label: '50–150 Vouchers', sub: 'Standard MSME' },
  { id: '150-500', label: '150–500 Vouchers', sub: 'High Volume' },
  { id: '500+', label: '500+ Multi-Branch', sub: 'Enterprise Scale' },
];

const SOFTWARE_OPTIONS = [
  { id: 'Tally Prime', label: 'Tally Prime / ERP 9', icon: 'fa-solid fa-calculator' },
  { id: 'SAP / Oracle', label: 'SAP / Oracle ERP', icon: 'fa-solid fa-server' },
  { id: 'Zoho Books', label: 'Zoho Books', icon: 'fa-solid fa-book' },
  { id: 'Busy Accounting', label: 'Busy Accounting', icon: 'fa-solid fa-chart-line' },
  { id: 'Spreadsheets / Manual', label: 'Other / In-House', icon: 'fa-solid fa-table-cells' },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { data: response } = useFetch(getPricing);

  // Commitment toggle: Monthly vs Annual Mandate
  const [billingCycle, setBillingCycle] = useState('annual');
  const [openFaq, setOpenFaq] = useState(0);
  const [faqCategory, setFaqCategory] = useState('all');

  // Filtered FAQ items based on selected category
  const filteredFaqs = useMemo(() => {
    if (faqCategory === 'all') return PRICING_FAQS;
    return PRICING_FAQS.filter((f) => f.category === faqCategory);
  }, [faqCategory]);

  // Active highlighted tier in the interactive selector
  const [activeTierId, setActiveTierId] = useState('growth');

  // Interactive Scope Estimator State
  const [estimatorEntity, setEstimatorEntity] = useState('pvt_ltd'); // 'prop' | 'pvt_ltd' | 'enterprise'
  const [estimatorVolume, setEstimatorVolume] = useState('medium'); // 'low' | 'medium' | 'high' | 'enterprise'

  // Dynamic Tiers mapping with database fallback
  const dynamicTiers = useMemo(() => {
    if (!response?.data || !Array.isArray(response.data) || response.data.length === 0) {
      return STATUTORY_RETAINER_TIERS;
    }
    return STATUTORY_RETAINER_TIERS.map((tier) => {
      const dbMatch = response.data.find((p) => {
        const lower = (p.name || '').toLowerCase();
        if (tier.id === 'incorporation' && (lower.includes('incorporat') || lower.includes('turnkey'))) return true;
        if (tier.id === 'cfo' && (lower.includes('enterprise') || lower.includes('cfo') || lower.includes('premium'))) return true;
        if (tier.id === 'growth' && (lower.includes('corporate') || lower.includes('msme') || lower.includes('growth') || lower.includes('standard'))) return true;
        if (tier.id === 'starter' && (lower.includes('foundational') || lower.includes('basic') || lower.includes('starter'))) return true;
        return false;
      });

      if (dbMatch && typeof dbMatch.price === 'number') {
        const annual =
          tier.id === 'starter' ? 2499 :
          tier.id === 'growth' ? 4999 :
          tier.id === 'cfo' ? 20999 :
          dbMatch.price;

        return {
          ...tier,
          priceMonthly: dbMatch.price,
          priceAnnual: annual,
        };
      }
      return tier;
    });
  }, [response]);

  // Custom Proposal Form State
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    planInterest: 'Corporate & MSME Statutory Retainer',
    monthlyInvoices: '50-150',
    accountingSoftware: 'Tally Prime',
    notes: '',
  });
  const [quoteStatus, setQuoteStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useSEO({
    title: 'Statutory Retainers & Corporate Governance Mandates | Shree Chamunda Associates',
    description:
      'Predictable, scope-locked Chartered Accountancy retainers for Indian Proprietorships, LLPs, Private Limited Companies, and High-Turnover Multi-Branch Conglomerates.',
  });

  // Calculate recommendation based on estimator controls
  const recommendedTier = useMemo(() => {
    if (estimatorEntity === 'prop' && estimatorVolume === 'low') {
      return dynamicTiers.find((t) => t.id === 'starter');
    }
    if (estimatorEntity === 'enterprise' || estimatorVolume === 'enterprise' || estimatorVolume === 'high') {
      return dynamicTiers.find((t) => t.id === 'cfo');
    }
    return dynamicTiers.find((t) => t.id === 'growth');
  }, [estimatorEntity, estimatorVolume, dynamicTiers]);

  // Dynamic pricing info for matrix columns based on billing cycle
  const tierPrices = useMemo(() => {
    return dynamicTiers.map((tier) => {
      if (tier.isOneTime) {
        return {
          amount: tier.priceMonthly,
          period: 'one-time',
          note: 'Turnkey Legal Formation',
        };
      }
      const isAnnual = billingCycle === 'annual';
      const amount = isAnnual ? tier.priceAnnual : tier.priceMonthly;
      return {
        amount,
        period: '/mo',
        note: isAnnual ? 'Billed annually (save ~20%)' : 'Billed monthly',
      };
    });
  }, [dynamicTiers, billingCycle]);

  const handleSelectTier = (tier) => {
    const cycleSuffix =
      billingCycle === 'annual' && !tier.isOneTime
        ? ' (Annual Retainer Mandate)'
        : tier.isOneTime
        ? ' (One-Time Formation Mandate)'
        : ' (Monthly Retainer Mandate)';
    navigate('/contact', {
      state: {
        planName: `${tier.name}${cycleSuffix}`,
        serviceInterest: tier.serviceInterest,
      },
    });
  };

  const handleWhatsAppDesk = (tier) => {
    const isAnnual = billingCycle === 'annual' && !tier.isOneTime;
    const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;
    const periodLabel = isAnnual ? 'mo (billed annually)' : tier.isOneTime ? 'one-time' : 'mo';
    const text = `Hello Shree Chamunda Associates, I would like to consult regarding the ${tier.name} (₹${price.toLocaleString('en-IN')}/${periodLabel}) for our statutory compliance mandate.`;
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setQuoteStatus({ loading: true, success: false, error: null });
    try {
      await submitContact({
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        subject: `Corporate Retainer Mandate Request: ${quoteForm.planInterest} (${quoteForm.company})`,
        message: `Entity Name: ${quoteForm.company}\nPlan Mandate: ${quoteForm.planInterest}\nMonthly Invoice Volume: ${quoteForm.monthlyInvoices}\nAccounting Software: ${quoteForm.accountingSoftware}\nSpecific Requirements: ${quoteForm.notes}`,
        serviceInterest: quoteForm.planInterest,
      });
      setQuoteStatus({ loading: false, success: true, error: null });
      setQuoteForm({
        name: '',
        company: '',
        email: '',
        phone: '',
        planInterest: 'Corporate & MSME Statutory Retainer',
        monthlyInvoices: '50-150',
        accountingSoftware: 'Tally Prime',
        notes: '',
      });
    } catch (err) {
      setQuoteStatus({
        loading: false,
        success: false,
        error: err.message || 'Failed to submit mandate request. Please contact our CA desk directly.',
      });
    }
  };

  return (
    <div className="pricing-page fade-in">
      {/* 1. HERO SECTION — Swiss-Fintech Architecture */}
      <section className="pricing-hero" aria-labelledby="pricing-hero-title">
        <div className="pricing-top-accent-line" aria-hidden="true"></div>
        <div className="pricing-geometric-backdrop" aria-hidden="true"></div>

        <div className="pricing-hero-container">
          <div className="pricing-hero-badge">
            <span className="live-dot" aria-hidden="true"></span>
            <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
            <span>ICAI ADVISORY STANDARDS &bull; SCOPE-LOCKED STATUTORY RETAINERS</span>
          </div>

          <h1 id="pricing-hero-title" className="pricing-main-title">
            Predictable Retainers, <span className="title-gradient-gold">Absolute Precision.</span>
          </h1>

          <p className="pricing-hero-lead">
            Scope-locked Chartered Accountancy retainers governing direct tax, GST audit, ROC secretarial compliance,
            and scrutiny representation under ICAI regulatory ethics. Built for ambitious enterprises with zero billing surprises.
          </p>

          {/* Institutional Commitment Switcher */}
          <div className="billing-switch-wrapper">
            <div className="billing-switch-control" role="radiogroup" aria-label="Retainer Commitment Frequency">
              <button
                type="button"
                className={`switch-tab ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
                aria-checked={billingCycle === 'monthly'}
              >
                <span>Monthly Retainer</span>
              </button>

              <button
                type="button"
                className={`switch-tab ${billingCycle === 'annual' ? 'active' : ''}`}
                onClick={() => setBillingCycle('annual')}
                aria-checked={billingCycle === 'annual'}
              >
                <span>Annual Statutory Mandate</span>
                <span className="save-pill">Save 18% &bull; 2 Mo Complimentary</span>
              </button>
            </div>

            <div className="billing-tax-credit-chip">
              <i className="fa-solid fa-receipt text-emerald"></i>
              <span>100% Tax Invoiced &bull; Corporate clients claim 18% GST Input Tax Credit back</span>
            </div>
          </div>

          {/* Hero Trust Matrix */}
          <div className="pricing-trust-matrix">
            <div className="trust-matrix-card">
              <i className="fa-solid fa-shield-halved"></i>
              <div className="trust-matrix-text">
                <strong>Zero Notice Penalties</strong>
                <span>100% Statutory Precision</span>
              </div>
            </div>
            <div className="trust-matrix-card">
              <i className="fa-solid fa-user-check"></i>
              <div className="trust-matrix-text">
                <strong>Two-Tier Senior CA Review</strong>
                <span>Dual Partner Sign-off</span>
              </div>
            </div>
            <div className="trust-matrix-card">
              <i className="fa-solid fa-vault"></i>
              <div className="trust-matrix-text">
                <strong>Encrypted Client Vault</strong>
                <span>Sec 128 Compliant Archival</span>
              </div>
            </div>
            <div className="trust-matrix-card">
              <i className="fa-solid fa-file-invoice-dollar"></i>
              <div className="trust-matrix-text">
                <strong>18% Claimable GST ITC</strong>
                <span>Fully Deductible Retainer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATUTORY RETAINER TIERS CARDS */}
      <main className="pricing-content-wrap">
        <div className="section-header-centered">
          <div className="pricing-section-pill">
            <i className="fa-solid fa-layer-group"></i>
            <span>FOUR STATUTORY MANDATES</span>
          </div>
          <h2 className="section-heading">Institutional Retainer Tiers</h2>
          <p className="section-subtext">
            Every mandate is scope-locked with explicit deliverables, statutory due-date coverage, and designated CA partner oversight.
          </p>
        </div>

        <div className="pricing-cards-grid">
          {dynamicTiers.map((tier) => {
            const isMonthlyTier = !tier.isOneTime;
            const isAnnualMode = billingCycle === 'annual' && isMonthlyTier;
            const currentPrice = isAnnualMode ? tier.priceAnnual : tier.priceMonthly;
            const originalPrice = tier.priceMonthly;
            const annualSavings = isMonthlyTier ? (originalPrice - currentPrice) * 12 : 0;
            const isSelected = activeTierId === tier.id;

            return (
              <div
                key={tier.id}
                className={`statutory-plan-card ${tier.tierClass || ''} ${tier.isPopular ? 'benchmark-card' : ''} ${isSelected ? 'tier-selected' : ''}`}
                onClick={() => setActiveTierId(tier.id)}
              >
                {tier.isPopular && (
                  <div className="benchmark-ribbon-tag">
                    <i className="fa-solid fa-crown"></i>
                    <span>{tier.badge}</span>
                  </div>
                )}

                {/* Card Header */}
                <div className="plan-card-header">
                  <div className="plan-meta-row">
                    <div className="plan-meta-left">
                      <span className="plan-code-badge">{tier.code}</span>
                      <span className="plan-volume-badge">
                        <i className={tier.volumeIcon}></i>
                        <span>{tier.volumeTag}</span>
                      </span>
                    </div>
                    <div className="plan-meta-right">
                      <span className="plan-icon-capsule">
                        <i className={tier.icon}></i>
                      </span>
                    </div>
                  </div>

                  <h3 className="plan-name">{tier.name}</h3>
                  <p className="plan-target-entity">{tier.target}</p>
                </div>

                {/* Pricing Block — Horizontal Dual-Column Layout */}
                <div className="plan-price-block">
                  <div className="price-primary-col">
                    {isAnnualMode && (
                      <div className="plan-strikethrough-row">
                        <span className="struck-price">₹{originalPrice.toLocaleString('en-IN')}/mo</span>
                        <span className="savings-chip">Save 18%</span>
                      </div>
                    )}

                    <div className="price-num-row">
                      <span className="currency-symbol">₹</span>
                      <span className="price-amount">{currentPrice.toLocaleString('en-IN')}</span>
                      <span className="price-period">
                        /{tier.isOneTime ? 'one-time setup' : isAnnualMode ? 'mo (billed annually)' : 'month'}
                      </span>
                    </div>
                  </div>

                  <div className="price-benefits-col">
                    {isAnnualMode && annualSavings > 0 && (
                      <div className="annual-savings-callout">
                        <i className="fa-solid fa-circle-check"></i>
                        <span>Preserves ₹{annualSavings.toLocaleString('en-IN')}/yr</span>
                      </div>
                    )}

                    <div className="roi-badge-wrap">
                      <span className="roi-chip">
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        <span>{tier.roiBadge}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <p className="plan-summary-text">{tier.summary}</p>

                {/* Mandate Disciplines */}
                <div className="plan-disciplines-stack">
                  <div className="disciplines-header-row">
                    <span className="disciplines-header">Statutory Mandate Scope</span>
                    <span className="disciplines-count">{tier.disciplines.length} Disciplines Included</span>
                  </div>

                  <div className="disciplines-list">
                    {tier.disciplines.map((item, idx) => (
                      <div key={idx} className="plan-discipline-item">
                        <i className="fa-solid fa-circle-check"></i>
                        <div className="discipline-item-text">
                          <strong>{item.title}:</strong> <span>{item.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons — Side-by-Side in 2-Column Card */}
                <div className="plan-card-actions">
                  <button
                    type="button"
                    className={`btn-plan-retain ${tier.isPopular ? 'btn-benchmark-action' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTier(tier);
                    }}
                  >
                    <span>{tier.ctaText}</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>

                  <button
                    type="button"
                    className="btn-plan-whatsapp"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsAppDesk(tier);
                    }}
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    <span>WhatsApp Desk</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 3. INTERACTIVE RETAINER SCOPE & VOLUME ESTIMATOR */}
      <section className="pricing-content-wrap estimator-section-container">
        <div className="retainers-scope-estimator-box">
          <div className="estimator-intro">
            <div className="pricing-section-pill">
              <i className="fa-solid fa-sliders"></i>
              <span>INTERACTIVE SCOPE ESTIMATOR</span>
            </div>
            <h3 className="estimator-heading">Calculate Your Ideal Compliance Mandate</h3>
            <p className="estimator-sub">
              Select your legal entity structure and monthly voucher volume to discover the calibrated statutory scope, dedicated partner oversight, and fixed retainer.
            </p>
          </div>

          <div className="estimator-console-grid">
            {/* Left: Interactive Input Controls */}
            <div className="estimator-inputs-panel">
              {/* Step 1: Legal Entity Structure */}
              <div className="estimator-step-block">
                <div className="step-label-row">
                  <span className="step-num">01</span>
                  <label className="step-title">Legal Entity Structure</label>
                </div>
                <div className="entity-cards-grid">
                  <button
                    type="button"
                    className={`entity-select-card ${estimatorEntity === 'prop' ? 'active' : ''}`}
                    onClick={() => setEstimatorEntity('prop')}
                  >
                    <div className="entity-card-icon">
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="entity-card-content">
                      <strong>Proprietorship</strong>
                      <span>Freelancers, Sole Practitioners &amp; Emerging MSMEs</span>
                    </div>
                    <div className="entity-check-dot">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`entity-select-card ${estimatorEntity === 'pvt_ltd' ? 'active' : ''}`}
                    onClick={() => setEstimatorEntity('pvt_ltd')}
                  >
                    <div className="entity-card-icon">
                      <i className="fa-solid fa-building-user"></i>
                    </div>
                    <div className="entity-card-content">
                      <strong>Pvt Ltd / LLP / MSME</strong>
                      <span>Incorporated Companies, Active Trading &amp; Manufacturing</span>
                    </div>
                    <div className="entity-check-dot">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`entity-select-card ${estimatorEntity === 'enterprise' ? 'active' : ''}`}
                    onClick={() => setEstimatorEntity('enterprise')}
                  >
                    <div className="entity-card-icon">
                      <i className="fa-solid fa-industry"></i>
                    </div>
                    <div className="entity-card-content">
                      <strong>Enterprise / Multi-State</strong>
                      <span>Turnover &gt; ₹5 Cr, Factories &amp; Multi-Branch Conglomerates</span>
                    </div>
                    <div className="entity-check-dot">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Monthly Transaction Volume */}
              <div className="estimator-step-block">
                <div className="step-label-row">
                  <span className="step-num">02</span>
                  <label className="step-title">Monthly Transaction Scale</label>
                </div>
                <div className="volume-chips-grid">
                  <button
                    type="button"
                    className={`volume-chip-btn ${estimatorVolume === 'low' ? 'active' : ''}`}
                    onClick={() => setEstimatorVolume('low')}
                  >
                    <span className="chip-metric">&lt; 50</span>
                    <span className="chip-label">Vouchers / Mo</span>
                  </button>
                  <button
                    type="button"
                    className={`volume-chip-btn ${estimatorVolume === 'medium' ? 'active' : ''}`}
                    onClick={() => setEstimatorVolume('medium')}
                  >
                    <span className="chip-metric">50 – 150</span>
                    <span className="chip-label">Vouchers / Mo</span>
                  </button>
                  <button
                    type="button"
                    className={`volume-chip-btn ${estimatorVolume === 'high' ? 'active' : ''}`}
                    onClick={() => setEstimatorVolume('high')}
                  >
                    <span className="chip-metric">150 – 500</span>
                    <span className="chip-label">Vouchers / Mo</span>
                  </button>
                  <button
                    type="button"
                    className={`volume-chip-btn ${estimatorVolume === 'enterprise' ? 'active' : ''}`}
                    onClick={() => setEstimatorVolume('enterprise')}
                  >
                    <span className="chip-metric">500+</span>
                    <span className="chip-label">Multi-Branch</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Live Mandate Output Dossier */}
            <div className="estimator-output-panel">
              {recommendedTier && (
                <div className="mandate-dossier-card">
                  <div className="dossier-card-top">
                    <div className="dossier-match-badge">
                      <span className="live-dot" aria-hidden="true"></span>
                      <span>CALIBRATED MANDATE &bull; 100% FIT</span>
                    </div>
                    <span className="dossier-tier-tag">{recommendedTier.code}</span>
                  </div>

                  <h4 className="dossier-plan-name">{recommendedTier.name}</h4>
                  <p className="dossier-plan-target">{recommendedTier.target}</p>

                  <div className="dossier-price-row">
                    <div className="dossier-price-wrap">
                      <span className="dossier-currency">₹</span>
                      <span className="dossier-amount">
                        {(billingCycle === 'annual' && !recommendedTier.isOneTime
                          ? recommendedTier.priceAnnual
                          : recommendedTier.priceMonthly
                        ).toLocaleString('en-IN')}
                      </span>
                      <span className="dossier-period">
                        /{recommendedTier.isOneTime ? 'one-time setup' : billingCycle === 'annual' ? 'mo (billed annually)' : 'month'}
                      </span>
                    </div>
                    <span className="dossier-scope-lock">
                      <i className="fa-solid fa-lock text-gold"></i>
                      <span>Scope-Locked</span>
                    </span>
                  </div>

                  {/* Included Core Safeguards */}
                  <div className="dossier-safeguards-box">
                    <span className="safeguards-label">Mandate Highlights Under This Scale:</span>
                    <ul className="safeguards-list">
                      {recommendedTier.disciplines.slice(0, 3).map((d, dIdx) => (
                        <li key={dIdx}>
                          <i className="fa-solid fa-circle-check"></i>
                          <span><strong>{d.title}:</strong> {d.detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="dossier-actions">
                    <button
                      type="button"
                      className="btn-dossier-retain"
                      onClick={() => handleSelectTier(recommendedTier)}
                    >
                      <span>Retain This Mandate Scope</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-dossier-whatsapp"
                      onClick={() => handleWhatsAppDesk(recommendedTier)}
                    >
                      <i className="fa-brands fa-whatsapp"></i>
                      <span>WhatsApp Partner Desk</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPREHENSIVE SIDE-BY-SIDE STATUTORY DELIVERABLES MATRIX */}
      <section className="pricing-content-wrap pricing-matrix-section">
        <div className="section-header-centered">
          <div className="pricing-section-pill">
            <i className="fa-solid fa-table-list"></i>
            <span>EXHAUSTIVE SCOPE SPECIFICATION</span>
          </div>
          <h2 className="section-heading">Granular Statutory Scope Matrix</h2>
          <p className="section-subtext">
            Comprehensive comparison of all 10 statutory dimensions across Foundational, Corporate Benchmark, Virtual CFO, and Turnkey Incorporation retainers.
          </p>
        </div>

        {/* Value Trust Strip & Horizontal Scroll Indicator */}
        <div className="matrix-trust-strip">
          <div className="matrix-trust-item">
            <i className="fa-solid fa-shield-halved text-amber"></i>
            <span><strong>100% ICAI Fiduciary Mandate:</strong> Scope-locked professional fee charter</span>
          </div>
          <div className="matrix-trust-item">
            <i className="fa-solid fa-file-invoice-dollar text-emerald"></i>
            <span><strong>18% GST Input Credit (ITC):</strong> Fully deductible tax invoices issued</span>
          </div>
          <div className="matrix-trust-item">
            <i className="fa-solid fa-lock text-blue"></i>
            <span><strong>Zero Arbitrary Surcharges:</strong> Transparent treasury challan passthrough</span>
          </div>
          <div className="matrix-mobile-scroll-indicator">
            <i className="fa-solid fa-arrow-left"></i>
            <span>Swipe horizontally to compare all 4 tiers</span>
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <div className="matrix-table-wrapper">
          <table className="scope-comparison-table">
            <thead>
              <tr className="matrix-header-row">
                <th className="col-deliverable">
                  <div className="th-deliverables-header">
                    <span className="th-deliverables-badge">ICAI SCOPE DIRECTIVE</span>
                    <strong className="th-deliverables-title">Statutory Dimension</strong>
                    <span className="th-deliverables-sub">Engagement Charter Deliverables</span>
                  </div>
                </th>
                {dynamicTiers.map((tier, idx) => {
                  const priceInfo = tierPrices[idx];
                  const isBenchmark = tier.id === 'growth';
                  return (
                    <th
                      key={tier.id}
                      className={`th-tier-col ${isBenchmark ? 'th-tier-benchmark' : ''}`}
                    >
                      <div className="th-tier-card">
                        {isBenchmark && (
                          <div className="th-benchmark-badge-pill">
                            <i className="fa-solid fa-crown"></i>
                            <span>THE FIRM BENCHMARK</span>
                          </div>
                        )}
                        <div className="th-tier-meta">
                          <span className="th-tier-code">{tier.code}</span>
                          {tier.isOneTime && (
                            <span className="th-formation-badge">ONE-TIME MANDATE</span>
                          )}
                        </div>
                        <strong className="th-tier-heading">{tier.shortName || tier.name}</strong>
                        <div className="th-tier-price-row">
                          <span className="th-tier-curr">₹</span>
                          <span className="th-tier-val">{priceInfo.amount.toLocaleString('en-IN')}</span>
                          <span className="th-tier-per">{priceInfo.period}</span>
                        </div>
                        <span className="th-tier-cycle-note">{priceInfo.note}</span>
                        <button
                          type="button"
                          className={`matrix-col-cta-btn ${isBenchmark ? 'btn-benchmark' : ''}`}
                          onClick={() => handleSelectTier(tier)}
                        >
                          <span>{isBenchmark ? 'Choose Corporate' : tier.isOneTime ? 'Incorporate' : 'Select Retainer'}</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {MATRIX_CATEGORIES.map((cat) => (
                <Fragment key={cat.id}>
                  <tr className="matrix-category-row">
                    <td colSpan={5}>
                      <div className="matrix-category-header">
                        <i className={cat.categoryIcon}></i>
                        <span>{cat.categoryTitle}</span>
                      </div>
                    </td>
                  </tr>
                  {cat.rows.map((row, rIdx) => (
                    <tr key={`${cat.id}-${rIdx}`} className="matrix-data-row">
                      <td className="matrix-deliverable-cell">
                        <strong className="deliverable-name">{row.title}</strong>
                        <span className="deliverable-desc">{row.desc}</span>
                      </td>
                      {row.tierValues.map((val, tIdx) => {
                        const isBm = val.isBenchmark;
                        return (
                          <td
                            key={`${cat.id}-${rIdx}-tier-${tIdx}`}
                            className={`matrix-value-cell ${isBm ? 'td-tier-benchmark' : ''}`}
                          >
                            <div className="cell-content-wrap">
                              {val.isCheck ? (
                                <div className="cell-check-line">
                                  <i className="fa-solid fa-circle-check text-emerald"></i>
                                  <strong className="cell-primary-text">{val.main}</strong>
                                </div>
                              ) : val.isNA ? (
                                <div className="cell-na-line">
                                  <span className="cell-na-badge">
                                    <i className="fa-solid fa-minus"></i> Not Applicable
                                  </span>
                                </div>
                              ) : val.slaType ? (
                                <div className={`cell-sla-badge sla-${val.slaType}`}>
                                  <i className={val.slaIcon}></i>
                                  <span>{val.main}</span>
                                </div>
                              ) : (
                                <strong className={`cell-primary-text ${isBm ? 'benchmark-highlight' : ''}`}>
                                  {val.icon && <i className={`${val.icon} me-1`}></i>}
                                  {val.main}
                                </strong>
                              )}
                              {val.sub && <span className="cell-sub-text">{val.sub}</span>}
                              {val.tag && (
                                <span className={`cell-tag tag-${val.tag.type}`}>
                                  {val.tag.icon && <i className={val.tag.icon}></i>}
                                  <span>{val.tag.text}</span>
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="matrix-footer-row">
                <td className="matrix-footer-deliverable">
                  <div className="footer-deliverable-box">
                    <strong>Statutory Retainer Selection</strong>
                    <span>Fixed professional fees • 100% ICAI ethical compliance</span>
                  </div>
                </td>
                {dynamicTiers.map((tier) => {
                  const isBenchmark = tier.id === 'growth';
                  return (
                    <td
                      key={`foot-${tier.id}`}
                      className={`matrix-footer-cell ${isBenchmark ? 'tfoot-benchmark' : ''}`}
                    >
                      <button
                        type="button"
                        className={`matrix-bottom-btn ${isBenchmark ? 'btn-benchmark' : ''}`}
                        onClick={() => handleSelectTier(tier)}
                      >
                        <span>{isBenchmark ? 'Choose Corporate' : tier.isOneTime ? 'Incorporate Entity' : 'Retain This Tier'}</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* 5. CUSTOM ENTERPRISE QUOTE REQUEST SECTION */}
      <section className="pricing-content-wrap quote-request-section" id="custom-quote-section">
        <div className="quote-box-grid">
          {/* Narrative & Fiduciary Partner Column */}
          <div className="quote-narrative-col">
            <div className="pricing-section-pill">
              <i className="fa-solid fa-file-signature"></i>
              <span>BESPOKE RETAINER MANDATE</span>
            </div>
            <h2 className="quote-heading">Require a Custom Manufacturing or Multi-State Retainer?</h2>
            <p className="quote-lead">
              For factories, chemical manufacturing units, export houses, and high-volume e-commerce conglomerates across
              Gujarat and Maharashtra, our Senior Partners prepare a scoped engagement letter aligned with your ERP and volume.
            </p>

            {/* Senior Partner Desk Direct Card */}
            <div className="partner-desk-card">
              <div className="partner-desk-top">
                <div className="partner-desk-avatar">
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div className="partner-desk-info">
                  <span className="partner-desk-role">Senior CA Practice Partner Desk</span>
                  <strong className="partner-desk-title">Fellow Chartered Accountant (FCA)</strong>
                </div>
                <span className="partner-live-status">
                  <span className="live-dot-pulse"></span>
                  <span>Available (&lt; 4h SLA)</span>
                </span>
              </div>
              <p className="partner-desk-desc">
                Direct engagement letter drafting with zero intermediary account managers. 100% compliant under ICAI fiduciary charter.
              </p>
              <div className="partner-desk-actions">
                <a href="tel:+919510984735" className="partner-direct-link phone">
                  <i className="fa-solid fa-phone-volume"></i>
                  <span>+91 95109 84735</span>
                </a>
                <a
                  href="https://wa.me/919510984735?text=Hello%20Shree%20Chamunda%20Associates%2C%20I%20would%20like%20to%20consult%20regarding%20a%20Bespoke%20Retainer%20Mandate."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-direct-link whatsapp"
                >
                  <i className="fa-brands fa-whatsapp"></i>
                  <span>WhatsApp Partner Desk</span>
                </a>
              </div>
            </div>

            {/* 4 Architectural Fiduciary Guarantee Cards */}
            <div className="quote-guarantee-grid">
              <div className="guarantee-card">
                <div className="guarantee-icon-wrap amber">
                  <i className="fa-solid fa-file-shield"></i>
                </div>
                <div className="guarantee-body">
                  <strong>Mutual NDA Guarantee</strong>
                  <p>Mutual NDA executed prior to financial books or credential inspection.</p>
                </div>
              </div>

              <div className="guarantee-card">
                <div className="guarantee-icon-wrap emerald">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <div className="guarantee-body">
                  <strong>Fixed Retainers, Zero Surcharges</strong>
                  <p>Upfront fixed monthly retainers under ICAI charter with zero hidden fees.</p>
                </div>
              </div>

              <div className="guarantee-card">
                <div className="guarantee-icon-wrap blue">
                  <i className="fa-solid fa-network-wired"></i>
                </div>
                <div className="guarantee-body">
                  <strong>Seamless ERP Ingestion</strong>
                  <p>Bidirectional sync with Tally Prime, SAP ERP, Zoho Books, Busy & Oracle.</p>
                </div>
              </div>

              <div className="guarantee-card">
                <div className="guarantee-icon-wrap purple">
                  <i className="fa-solid fa-scale-balanced"></i>
                </div>
                <div className="guarantee-body">
                  <strong>Appellate Representation</strong>
                  <p>Direct defense before CIT(Appeals), ITAT & departmental tax benches.</p>
                </div>
              </div>
            </div>

            {/* Compliance trust chips */}
            <div className="quote-trust-strip">
              <span className="trust-pill"><i className="fa-solid fa-shield-halved text-amber"></i> Companies Act Sec 128 Archival</span>
              <span className="trust-pill"><i className="fa-solid fa-certificate text-emerald"></i> ICAI UDIN Generated</span>
            </div>
          </div>

          {/* Form Column */}
          <div className="quote-form-col">
            <div className="quote-form-card">
              <div className="form-card-header">
                <div>
                  <span className="form-card-badge">DIRECT ENGAGEMENT INTAKE</span>
                  <h3 className="form-card-title">Request Scope-Locked Retainer Proposal</h3>
                </div>
                <span className="form-sla-pill">
                  <i className="fa-regular fa-clock"></i> &lt; 4h Partner Turnaround
                </span>
              </div>
              <p className="form-subtext">Our Senior CA Partner will review your transaction volume and formulate a formal engagement proposal.</p>

              {quoteStatus.success && (
                <div className="success-quote-banner">
                  <i className="fa-solid fa-circle-check"></i>
                  <div>
                    <strong>Mandate Request Successfully Received!</strong>
                    <p>Our Senior Partner has received your submission and will contact your office within 4 business hours.</p>
                  </div>
                </div>
              )}

              {quoteStatus.error && (
                <div className="error-quote-banner">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <p>{quoteStatus.error}</p>
                </div>
              )}

              <form onSubmit={handleQuoteSubmit} className="quote-form">
                {/* Contact Coordinates */}
                <div className="form-row-split">
                  <div className="quote-input-group">
                    <label htmlFor="qName">Full Name *</label>
                    <div className="input-with-icon">
                      <i className="fa-regular fa-user"></i>
                      <input
                        type="text"
                        id="qName"
                        required
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                        placeholder="e.g. Rajesh Patel"
                        className="quote-input"
                      />
                    </div>
                  </div>
                  <div className="quote-input-group">
                    <label htmlFor="qCompany">Company / LLP / Firm Name *</label>
                    <div className="input-with-icon">
                      <i className="fa-regular fa-building"></i>
                      <input
                        type="text"
                        id="qCompany"
                        required
                        value={quoteForm.company}
                        onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                        placeholder="e.g. Apex Industrial Solutions LLP"
                        className="quote-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row-split">
                  <div className="quote-input-group">
                    <label htmlFor="qEmail">Work Email Address *</label>
                    <div className="input-with-icon">
                      <i className="fa-regular fa-envelope"></i>
                      <input
                        type="email"
                        id="qEmail"
                        required
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        placeholder="rajesh@apexind.com"
                        className="quote-input"
                      />
                    </div>
                  </div>
                  <div className="quote-input-group">
                    <label htmlFor="qPhone">Phone Number *</label>
                    <div className="input-with-icon">
                      <i className="fa-solid fa-phone"></i>
                      <input
                        type="tel"
                        id="qPhone"
                        required
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="quote-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Mandate Selector Chips */}
                <div className="quote-input-group">
                  <label>Preferred Statutory Mandate</label>
                  <div className="mandate-chips-grid">
                    {MANDATE_OPTIONS.map((opt) => {
                      const isSelected = quoteForm.planInterest === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={`mandate-chip-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => setQuoteForm({ ...quoteForm, planInterest: opt.id })}
                        >
                          <span className="mandate-chip-name">{opt.label}</span>
                          <span className="mandate-chip-price">{opt.tag}</span>
                          {opt.popular && <span className="mandate-chip-star"><i className="fa-solid fa-crown"></i></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Monthly Voucher Volume Chips */}
                <div className="quote-input-group">
                  <label>Estimated Monthly Voucher Volume</label>
                  <div className="volume-segmented-control">
                    {VOLUME_OPTIONS.map((v) => {
                      const isSelected = quoteForm.monthlyInvoices === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          className={`volume-segment-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => setQuoteForm({ ...quoteForm, monthlyInvoices: v.id })}
                        >
                          <span className="seg-label">{v.label}</span>
                          <span className="seg-sub">{v.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Software / ERP Tech Stack Chips */}
                <div className="quote-input-group">
                  <label>Current Accounting Software / ERP</label>
                  <div className="software-pills-row">
                    {SOFTWARE_OPTIONS.map((s) => {
                      const isSelected = quoteForm.accountingSoftware === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          className={`software-pill-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => setQuoteForm({ ...quoteForm, accountingSoftware: s.id })}
                        >
                          <i className={s.icon}></i>
                          <span>{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Requirements Textarea */}
                <div className="quote-input-group">
                  <label htmlFor="qNotes">Specific Compliance Requirements / Notices</label>
                  <textarea
                    id="qNotes"
                    rows="3"
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    placeholder="e.g. Have 2 GSTINs in Gujarat and Maharashtra, need ASMT-10 mismatch resolution, pending 44AB tax audit, Section 194Q compliance..."
                    className="quote-textarea"
                  ></textarea>
                </div>

                {/* Submit Action */}
                <button type="submit" className="btn-submit-quote" disabled={quoteStatus.loading}>
                  {quoteStatus.loading ? (
                    <span>
                      <i className="fa-solid fa-spinner fa-spin"></i> Formulating Mandate Request...
                    </span>
                  ) : (
                    <span>
                      Request Scope-Locked Proposal <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  )}
                </button>

                <div className="form-fiduciary-footer">
                  <i className="fa-solid fa-shield-halved text-emerald"></i>
                  <span>Strict ICAI Fiduciary Confidentiality • Zero Spam Policy • 4h Turnaround</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STATUTORY BILLING & ICAI ETHICS FAQS */}
      <section className="pricing-content-wrap pricing-faqs-section">
        <div className="faq-dual-grid">
          {/* Left Column: Authoritative Sidebar & Help Desk */}
          <div className="faq-sidebar-col">
            <div className="pricing-section-pill">
              <i className="fa-solid fa-scale-balanced"></i>
              <span>REGULATORY ETHICS &bull; FAQS</span>
            </div>
            <h2 className="faq-main-heading">Frequently Asked Questions on Retainers</h2>
            <p className="faq-lead-text">
              Clear, binding policies regarding professional fee structures, treasury challan passthrough, and statutory scope assurance under ICAI ethics.
            </p>

            {/* Direct Partner Consultation Help Desk Card */}
            <div className="faq-helpdesk-card">
              <div className="helpdesk-header">
                <div className="helpdesk-icon-bubble">
                  <i className="fa-solid fa-comments"></i>
                </div>
                <div className="helpdesk-info">
                  <span className="helpdesk-badge">DIRECT CA ADVISORY</span>
                  <strong className="helpdesk-title">Have an Unlisted Question?</strong>
                </div>
              </div>
              <p className="helpdesk-desc">
                Speak directly with a Senior Chartered Accountant for immediate engagement clarity on custom multi-branch or manufacturing retainers.
              </p>
              <div className="helpdesk-btn-row">
                <a
                  href="https://wa.me/919510984735?text=Hello%20Shree%20Chamunda%20Associates%2C%20I%20have%20a%20statutory%20compliance%20question%20regarding%20retainers."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="faq-chat-btn"
                >
                  <i className="fa-brands fa-whatsapp"></i>
                  <span>WhatsApp CA Desk</span>
                </a>
                <a href="tel:+919510984735" className="faq-phone-btn">
                  <i className="fa-solid fa-phone"></i>
                  <span>+91 95109 84735</span>
                </a>
              </div>
            </div>

            {/* Fiduciary Credentials Pillars */}
            <div className="faq-credentials-stack">
              <div className="faq-cred-pill">
                <i className="fa-solid fa-stamp text-amber"></i>
                <span>ICAI Code of Ethics (Part 1 &amp; 2) Compliant</span>
              </div>
              <div className="faq-cred-pill">
                <i className="fa-solid fa-lock text-emerald"></i>
                <span>Fixed Scope-Locked Mandates &bull; Zero Surcharges</span>
              </div>
              <div className="faq-cred-pill">
                <i className="fa-solid fa-file-shield text-blue"></i>
                <span>Mutual Non-Disclosure Agreement (NDA) Protected</span>
              </div>
            </div>
          </div>

          {/* Right Column: Category Filters & Enhanced Accordion Cards */}
          <div className="faq-content-col">
            {/* Filter Pills */}
            <div className="faq-filters-bar">
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = faqCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`faq-filter-pill ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setFaqCategory(cat.id);
                      setOpenFaq(0);
                    }}
                  >
                    <span>{cat.label}</span>
                    <span className="filter-count">{cat.count}</span>
                  </button>
                );
              })}
            </div>

            {/* Accordion Cards List */}
            <div className="pricing-faqs-list">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                const formattedNum = String(idx + 1).padStart(2, '0');
                return (
                  <div key={faq.id} className={`faq-card-item ${isOpen ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                    >
                      <div className="faq-btn-left">
                        <span className="faq-num-badge">{formattedNum}</span>
                        <div className="faq-btn-titles">
                          <span className="faq-topic-tag">
                            <i className={faq.icon}></i>
                            <span>{faq.categoryLabel}</span>
                          </span>
                          <strong className="faq-question-text">{faq.q}</strong>
                        </div>
                      </div>
                      <div className={`faq-chevron-circle ${isOpen ? 'rotate' : ''}`}>
                        <i className="fa-solid fa-chevron-down"></i>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="faq-answer-pane fade-in">
                        <p className="faq-answer-text">{faq.a}</p>
                        {faq.takeaway && (
                          <div className="faq-takeaway-box">
                            <div className="takeaway-header">
                              <i className="fa-solid fa-circle-check"></i>
                              <span>FIDUCIARY TAKEAWAY</span>
                            </div>
                            <p className="takeaway-text">{faq.takeaway}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
