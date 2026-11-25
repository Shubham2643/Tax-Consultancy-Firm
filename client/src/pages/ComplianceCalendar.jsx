import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useSiteContext } from '../context/SiteContext';
import './ComplianceCalendar.css';

// Master Statutory Compliance Deadlines aligned with FY 2025-26 & FY 2026-27
const STATUTORY_DEADLINES = [
  // MONTHLY RECURRING
  {
    id: 'tds-monthly',
    day: '07',
    month: 'Every Month',
    title: 'TDS & TCS Challan 281 Deposit',
    category: 'Income Tax',
    badgeType: 'urgent',
    penaltyHighlight: '1.5% / mo (Sec 201)',
    statute: 'Section 200(1) / Rule 30 of Income Tax Act, 1961',
    applicability:
      'All corporate and business deductors who deducted tax at source in the previous calendar month.',
    consequence:
      'Interest penalty @ 1.5% per month under Section 201(1A) from the date of deduction till actual payment.',
    actionUrl: '/calculators?tool=tds',
    actionText: 'TDS Rate Calculator',
  },
  {
    id: 'gstr1-monthly',
    day: '11',
    month: 'Every Month',
    title: 'GSTR-1 Monthly Outward Return',
    category: 'GST',
    badgeType: 'urgent',
    penaltyHighlight: '₹50/day + E-Way Block',
    statute: 'Section 37 of CGST Act, 2017 & Rule 59',
    applicability:
      'Regular GST registered taxpayers with aggregate turnover exceeding ₹5 Crores or opting for monthly filing.',
    consequence:
      'Late fee of ₹50/day (₹20/day for Nil return) up to ₹10,000 under Section 47. Blocks e-way bill generation.',
    actionUrl: '/services/gst-return-filing',
    actionText: 'File GSTR-1',
  },
  {
    id: 'gstr1-iff',
    day: '13',
    month: 'Every Month',
    title: 'IFF (Invoice Furnishing Facility) - QRMP',
    category: 'GST',
    badgeType: 'info',
    penaltyHighlight: 'Buyer ITC Deferred',
    statute: 'Rule 59(2) of CGST Rules, 2017',
    applicability:
      'Small taxpayers opted under QRMP scheme to pass input tax credit (B2B invoices) to buyers for the first 2 months of quarter.',
    consequence:
      'Buyer cannot view inward invoices in GSTR-2B; credit remains blocked for recipient.',
    actionUrl: '/services/gst-return-filing',
    actionText: 'IFF Guidance',
  },
  {
    id: 'pf-esic-monthly',
    day: '15',
    month: 'Every Month',
    title: 'PF Electronic Challan (ECR) & ESIC Deposit',
    category: 'Labour & Payroll',
    badgeType: 'warning',
    penaltyHighlight: 'Up to 25% Damages + 7Q',
    statute: 'Employees Provident Fund Act, 1952 & ESI Act, 1948',
    applicability:
      'Establishments employing 20+ persons (PF) or 10+ persons (ESIC) paying wages up to ₹21,000.',
    consequence:
      'Damages under Section 14B up to 25% p.a. + penal interest under Section 7Q. Non-deposit of employee share violates statutory trust rules.',
    actionUrl: '/services/pf-&-esic-return',
    actionText: 'Payroll Advisory',
  },
  {
    id: 'gstr3b-monthly',
    day: '20',
    month: 'Every Month',
    title: 'GSTR-3B Monthly Summary & Net Tax Deposit',
    category: 'GST',
    badgeType: 'urgent',
    penaltyHighlight: '₹50/day + 18% Interest',
    statute: 'Section 39 of CGST Act, 2017 & Rule 61',
    applicability:
      'Mandatory for all regular registered taxpayers to discharge monthly output tax after adjusting GSTR-2B ITC.',
    consequence:
      'Late fee ₹50/day + 18% per annum penal interest on net cash tax liability under Section 50. Suspension of GSTIN if delayed > 30 days.',
    actionUrl: '/calculators?tool=gst',
    actionText: 'Compute Net GST',
  },
  {
    id: 'gstr3b-qrmp',
    day: '24',
    month: 'Quarterly',
    title: 'GSTR-3B Quarterly Return (Gujarat - Group B)',
    category: 'GST',
    badgeType: 'warning',
    penaltyHighlight: '₹50/day + 18% p.a.',
    statute: 'Section 39(1) of CGST Act (QRMP Scheme)',
    applicability:
      'Quarterly filers located in Gujarat, Maharashtra, Goa, and Southern States with turnover up to ₹5 Crores.',
    consequence:
      'Late fee ₹50/day up to ₹5,000 + 18% interest on deferred tax payments.',
    actionUrl: '/services/gst-return-filing',
    actionText: 'QRMP Compliance',
  },
  {
    id: 'pt-rc-monthly',
    day: '30',
    month: 'Every Month',
    title: 'Gujarat Professional Tax (PT-RC) Challan',
    category: 'Labour & Payroll',
    badgeType: 'info',
    penaltyHighlight: '18% p.a. + Municipal Fine',
    statute: 'Gujarat State Tax on Professions, Trades, Callings & Employments Act, 1976',
    applicability:
      'Employers in Gujarat deducting Professional Tax from employee monthly salaries (salaries > ₹12,000/mo).',
    consequence:
      '18% interest per annum on delayed remittance + monetary penalties levied by municipal corporation.',
    actionUrl: '/services/professional-tax-registration',
    actionText: 'PT Compliance',
  },

  // QUARTERLY & ANNUAL STATUTORY BENCHMARKS
  {
    id: 'adv-tax-q1',
    day: '15',
    month: 'June',
    title: 'Advance Tax 1st Installment (15%)',
    category: 'Income Tax',
    badgeType: 'urgent',
    penaltyHighlight: '1% / mo Sec 234C',
    statute: 'Section 208 & 211(1)(a) of Income Tax Act, 1961',
    applicability:
      'All taxpayers (corporate, LLP, firm, individuals) whose estimated annual net tax liability exceeds ₹10,000.',
    consequence:
      'Mandatory interest penalty @ 1% per month for 3 months under Section 234C on the shortfall.',
    actionUrl: '/calculators?tool=advance-tax',
    actionText: 'Calculate Advance Tax',
  },
  {
    id: 'itr-non-audit',
    day: '31',
    month: 'July',
    title: 'Income Tax Return (ITR) Filing (Non-Audit)',
    category: 'Income Tax',
    badgeType: 'critical',
    penaltyHighlight: '₹5,000 Fee + Loss Forfeit',
    statute: 'Section 139(1) of Income Tax Act, 1961',
    applicability:
      'Individuals, salaried employees, HUFs, partnership firms not subject to statutory tax audit under Section 44AB.',
    consequence:
      'Late fee up to ₹5,000 under Section 234F + 1% per month interest under Section 234A. Complete forfeiture of carry-forward losses.',
    actionUrl: '/calculators?tool=tax',
    actionText: 'Compare Tax Regimes',
  },
  {
    id: 'tds-q1',
    day: '31',
    month: 'July',
    title: 'Quarterly TDS Return (Q1 - Apr to Jun)',
    category: 'Income Tax',
    badgeType: 'warning',
    penaltyHighlight: '₹200/day (Sec 234E)',
    statute: 'Section 200(3) & Rule 31A (Form 24Q & 26Q)',
    applicability:
      'All entities withholding tax on salary, contract, rent, or professional fees in Q1.',
    consequence:
      'Late filing fee of ₹200 per day under Section 234E + penalty up to ₹1,00,000 under Section 271H.',
    actionUrl: '/services/tds-return',
    actionText: 'File Form 24Q/26Q',
  },
  {
    id: 'adv-tax-q2',
    day: '15',
    month: 'September',
    title: 'Advance Tax 2nd Installment (45% Cumulative)',
    category: 'Income Tax',
    badgeType: 'urgent',
    penaltyHighlight: '1% / mo Sec 234C',
    statute: 'Section 208 & 211(1)(b) of Income Tax Act, 1961',
    applicability:
      'Cumulative 45% of estimated total direct tax liability must be deposited via Challan 280.',
    consequence:
      '1% per month penal interest under Section 234C on deficit below 36% of total tax liability.',
    actionUrl: '/calculators?tool=advance-tax',
    actionText: 'Q2 Tax Estimator',
  },
  {
    id: 'dir3-kyc',
    day: '30',
    month: 'September',
    title: 'Director KYC (DIR-3 KYC / Web KYC)',
    category: 'MCA & ROC',
    badgeType: 'critical',
    penaltyHighlight: '₹5,000 + DIN Freeze',
    statute: 'Rule 12A of Companies (Appointment and Qualification of Directors) Rules, 2014',
    applicability:
      'Every individual holding an approved Director Identification Number (DIN / DPIN) allotted by MCA on or before 31st March.',
    consequence:
      'Hefty late fee of ₹5,000 per DIN. Immediate deactivation of DIN, disqualifying director from signing financial statements or MCA filings.',
    actionUrl: '/contact',
    actionText: 'Submit DIR-3 KYC',
  },
  {
    id: 'tax-audit-44ab',
    day: '31',
    month: 'October',
    title: 'Section 44AB Tax Audit Report (Form 3CA/3CD)',
    category: 'Income Tax',
    badgeType: 'critical',
    penaltyHighlight: 'Up to ₹1,50,000 (0.5%)',
    statute: 'Section 44AB of Income Tax Act, 1961',
    applicability:
      'Business turnover > ₹1 Crore (or ₹10 Crores if 95% transactions are digital) and Professionals with gross receipts > ₹50 Lakhs.',
    consequence:
      'Severe penalty under Section 271B equal to 0.5% of turnover or ₹1,50,000, whichever is less.',
    actionUrl: '/services/bookkeeping-services',
    actionText: 'Book Audit Desk',
  },
  {
    id: 'tds-q2',
    day: '31',
    month: 'October',
    title: 'Quarterly TDS Return (Q2 - Jul to Sep)',
    category: 'Income Tax',
    badgeType: 'warning',
    penaltyHighlight: '₹200/day (Sec 234E)',
    statute: 'Section 200(3) (Form 24Q & 26Q)',
    applicability:
      'All corporate and non-corporate entities deducting tax at source in the July-September quarter.',
    consequence:
      '₹200 per day statutory late fee under Section 234E until return is uploaded.',
    actionUrl: '/services/tds-return',
    actionText: 'File TDS Q2',
  },
  {
    id: 'aoc4-mca',
    day: '30',
    month: 'October',
    title: 'MCA Financial Statements Filing (Form AOC-4)',
    category: 'MCA & ROC',
    badgeType: 'critical',
    penaltyHighlight: '₹100/day (No Cap)',
    statute: 'Section 137 of Companies Act, 2013 & Rule 12',
    applicability:
      'All registered Private Limited, OPC, and Public Limited companies within 30 days of Annual General Meeting (AGM).',
    consequence:
      'Late fee of ₹100 per day per form with no upper ceiling. Company and defaulting directors liable for fine under Section 137(3).',
    actionUrl: '/contact',
    actionText: 'File AOC-4 with Advisor',
  },
  {
    id: 'mgt7-mca',
    day: '29',
    month: 'November',
    title: 'MCA Annual Return (Form MGT-7 / MGT-7A)',
    category: 'MCA & ROC',
    badgeType: 'critical',
    penaltyHighlight: '₹100/day + Sec 248 Risk',
    statute: 'Section 92 of Companies Act, 2013 & Rule 11',
    applicability:
      'Every incorporated company within 60 days of holding the Annual General Meeting.',
    consequence:
      '₹100 per day continuing penalty without upper limit. Defaulters risk strike-off notices under Section 248.',
    actionUrl: '/contact',
    actionText: 'File MGT-7 with Advisor',
  },
  {
    id: 'adv-tax-q3',
    day: '15',
    month: 'December',
    title: 'Advance Tax 3rd Installment (75% Cumulative)',
    category: 'Income Tax',
    badgeType: 'urgent',
    penaltyHighlight: '1% / mo Sec 234C',
    statute: 'Section 208 & 211(1)(c) of Income Tax Act, 1961',
    applicability:
      'Cumulative 75% of total estimated annual tax liability must be discharged.',
    consequence:
      '1% per month interest under Section 234C on deficit below 75% installment.',
    actionUrl: '/calculators?tool=advance-tax',
    actionText: 'Q3 Tax Audit',
  },
  {
    id: 'gstr9-annual',
    day: '31',
    month: 'December',
    title: 'GST Annual Return (GSTR-9 & GSTR-9C Reconciliation)',
    category: 'GST',
    badgeType: 'critical',
    penaltyHighlight: 'Up to ₹200/day + Sec 61',
    statute: 'Section 44 of CGST Act, 2017 & Rule 80',
    applicability:
      'GSTR-9 mandatory for turnover > ₹2 Crores; GSTR-9C self-certified reconciliation statement for turnover > ₹5 Crores.',
    consequence:
      'Late fee of ₹200/day (₹50/day for turnover up to ₹5 Cr) under Section 47. Departmental scrutiny under Section 61.',
    actionUrl: '/services/gst-return-filing',
    actionText: 'Audit GSTR-9 & 9C',
  },
  {
    id: 'adv-tax-q4',
    day: '15',
    month: 'March',
    title: 'Advance Tax Final Installment (100% Total Tax)',
    category: 'Income Tax',
    badgeType: 'critical',
    penaltyHighlight: 'Sec 234B + 234C (1%/mo)',
    statute: 'Section 208 & 211(1)(d) of Income Tax Act, 1961',
    applicability:
      'Final 100% settlement of estimated tax for the financial year before year-end close.',
    consequence:
      'Triggers both Section 234C interest and continuing Section 234B interest (1% per month until full payment).',
    actionUrl: '/calculators?tool=advance-tax',
    actionText: 'Final Advance Tax Calc',
  },
  {
    id: 'belated-itr',
    day: '31',
    month: 'March',
    title: 'Belated & Revised ITR Filing (Last Chance)',
    category: 'Income Tax',
    badgeType: 'critical',
    penaltyHighlight: 'Up to 50% ITR-U Tax',
    statute: 'Section 139(4) & 139(5) of Income Tax Act, 1961',
    applicability:
      'Last date to submit missed returns or rectify computational errors for the preceding Assessment Year.',
    consequence:
      'After March 31, return cannot be filed online under Section 139; only Section 139(8A) Updated Return (ITR-U) with up to 50% additional tax is allowed.',
    actionUrl: '/contact',
    actionText: 'File Urgent Belated ITR',
  },
  {
    id: 'llp-form11',
    day: '30',
    month: 'May',
    title: 'LLP Annual Statement of Info (Form 11)',
    category: 'MCA & ROC',
    badgeType: 'warning',
    penaltyHighlight: '₹100/day Unlimited',
    statute: 'Rule 25(1) of LLP Rules, 2009',
    applicability:
      'All Limited Liability Partnerships (LLPs) registered on or before 30th September of preceding year.',
    consequence:
      'Late fee of ₹100 per day without limit until filed on MCA portal.',
    actionUrl: '/contact',
    actionText: 'File LLP Form 11',
  },
];

const CATEGORIES = [
  { id: 'All', label: 'All Authorities', icon: 'fa-solid fa-layer-group' },
  { id: 'Income Tax', label: 'Income Tax', icon: 'fa-solid fa-file-invoice-dollar' },
  { id: 'GST', label: 'GST', icon: 'fa-solid fa-receipt' },
  { id: 'MCA & ROC', label: 'MCA & ROC', icon: 'fa-solid fa-building' },
  { id: 'Labour & Payroll', label: 'Labour & Payroll', icon: 'fa-solid fa-users-gear' },
];

const MONTHS = [
  'All Months',
  'Every Month',
  'Quarterly',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
  'March',
];

const QUICK_TOPICS = ['GSTR-3B', 'TDS 281', 'Advance Tax', 'Sec 44AB', 'DIR-3 KYC', 'ITR', 'AOC-4', 'PF'];

const MONTH_INDEX = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const RISK_META = {
  critical: { label: 'Critical Exposure', priority: 0 },
  urgent: { label: 'Mandatory Priority', priority: 1 },
  warning: { label: 'Statutory Return', priority: 2 },
  info: { label: 'Compliance Advisory', priority: 3 },
};

const EXPOSURE_MATRICES = [
  {
    id: 'gst',
    shortLabel: 'GST Act',
    domain: 'INDIRECT TAX',
    title: 'GST Act Penalties (Sec 47 & 50)',
    accent: 'emerald',
    icon: 'fa-solid fa-receipt',
    actionUrl: '/calculators?tool=gst',
    actionLabel: 'Compute Net GST Liability',
    items: [
      { label: 'Daily Late Fees', detail: '₹25 CGST + ₹25 SGST (GSTR-1 & 3B)', metric: '₹50 / day', tone: 'gold' },
      { label: 'Cash Tax Interest', detail: 'Sec 50 delayed output tax', metric: '18% p.a.', tone: 'gold' },
      { label: 'E-Way Bill Freeze', detail: 'After 2 delayed return months', metric: 'Auto-Blocked', tone: 'critical' },
      { label: 'GSTIN Status Risk', detail: 'Show-cause notice > 6 months', metric: 'Cancellation', tone: 'critical' },
    ],
  },
  {
    id: 'income-tax',
    shortLabel: 'Income Tax',
    domain: 'DIRECT TAX',
    title: 'Income Tax Act (Sec 234F & 271B)',
    accent: 'gold',
    icon: 'fa-solid fa-calculator',
    actionUrl: '/calculators?tool=advance-tax',
    actionLabel: 'Audit Sec 234C Exposure',
    items: [
      { label: 'Late Filing Fee', detail: 'Section 234F overdue ITR', metric: 'Up to ₹5,000', tone: 'gold' },
      { label: 'Shortfall Interest', detail: 'Cascading Sec 234A / B / C', metric: '1% / month', tone: 'gold' },
      { label: 'Tax Audit Delay', detail: 'Section 271B (Sec 44AB)', metric: '₹1.5L / 0.5%', tone: 'critical' },
      { label: 'Loss Carry Forward', detail: 'Business & capital loss set-off', metric: 'Forfeited', tone: 'critical' },
    ],
  },
  {
    id: 'mca',
    shortLabel: 'MCA / ROC',
    domain: 'CORPORATE GOVERNANCE',
    title: 'MCA / Companies Act (Sec 137 & 92)',
    accent: 'blue',
    icon: 'fa-solid fa-building',
    actionUrl: '/contact',
    actionLabel: 'Book ROC Compliance Desk',
    items: [
      { label: 'AOC-4 & MGT-7', detail: 'Uncapped daily statutory fine', metric: '₹100 / day', tone: 'gold' },
      { label: 'DIR-3 KYC Delay', detail: 'Immediate DIN deactivation', metric: '₹5K + Freeze', tone: 'critical' },
      { label: 'ROC Action Risk', detail: 'Registrar Sec 248 notice', metric: 'Strike-Off', tone: 'critical' },
      { label: 'Director Bar', detail: 'Sec 164(2) default bar', metric: '5-Yr Disq.', tone: 'blue' },
    ],
  },
];

const normalizeSearchText = (str) =>
  (str || '')
    .toLowerCase()
    .replace(/\bsec\.?\s+/g, 'section ')
    .replace(/sections?\b/g, 'section');

/**
 * Computes the exact next statutory due date and days remaining from referenceDate.
 */
const computeNextDueInfo = (dayStr, monthLabel, referenceDate) => {
  const targetDay = Math.max(1, parseInt(dayStr, 10) || 1);
  const startOfToday = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  const buildClampedDate = (year, monthZeroIndexed) => {
    const lastDayOfMonth = new Date(year, monthZeroIndexed + 1, 0).getDate();
    return new Date(year, monthZeroIndexed, Math.min(targetDay, lastDayOfMonth));
  };

  let nextDate;
  if (monthLabel === 'Every Month') {
    const candidateThisMonth = buildClampedDate(
      startOfToday.getFullYear(),
      startOfToday.getMonth()
    );
    nextDate =
      candidateThisMonth >= startOfToday
        ? candidateThisMonth
        : buildClampedDate(startOfToday.getFullYear(), startOfToday.getMonth() + 1);
  } else if (monthLabel === 'Quarterly') {
    // QRMP GSTR-3B falls in the month immediately following quarter end: Jan, Apr, Jul, Oct
    const qrmpMonths = [0, 3, 6, 9];
    nextDate = qrmpMonths
      .map((m) => buildClampedDate(startOfToday.getFullYear(), m))
      .find((d) => d >= startOfToday);
    if (!nextDate) {
      nextDate = buildClampedDate(startOfToday.getFullYear() + 1, 0);
    }
  } else {
    const mIdx = MONTH_INDEX[monthLabel] ?? 0;
    const candidate = buildClampedDate(startOfToday.getFullYear(), mIdx);
    nextDate =
      candidate >= startOfToday
        ? candidate
        : buildClampedDate(startOfToday.getFullYear() + 1, mIdx);
  }

  const diffDays = Math.round((nextDate.getTime() - startOfToday.getTime()) / 86400000);
  const formattedNextDate = nextDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const pad = (n) => String(n).padStart(2, '0');
  const gcalDate = `${nextDate.getFullYear()}${pad(nextDate.getMonth() + 1)}${pad(
    nextDate.getDate()
  )}`;
  const nextDayDate = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 1);
  const gcalEndDate = `${nextDayDate.getFullYear()}${pad(nextDayDate.getMonth() + 1)}${pad(
    nextDayDate.getDate()
  )}`;

  let countdownLabel = `In ${diffDays}d`;
  if (diffDays === 0) countdownLabel = 'Due Today';
  else if (diffDays === 1) countdownLabel = 'Tomorrow';

  return {
    nextDate,
    diffDays,
    formattedNextDate,
    countdownLabel,
    gcalRange: `${gcalDate}/${gcalEndDate}`,
    isDueSoon: diffDays <= 30,
  };
};

const ComplianceCalendar = () => {
  const { settings } = useSiteContext();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [viewMode, setViewMode] = useState('soonest'); // 'soonest' | 'next30' | 'critical'
  const [displayMode, setDisplayMode] = useState('grid'); // 'grid' | 'schedule'
  const [activeExposureId, setActiveExposureId] = useState('gst');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const cleanPhone = settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : '919510984735';

  useSEO({
    title: 'Statutory Compliance & Due Date Calendar (FY 2026-27) | Shree Chamunda Associates',
    description:
      'Live statutory compliance calendar for FY 2025-26 & 2026-27: GSTR-1, GSTR-3B, Advance Tax, TDS Challan 281, Section 44AB audits, DIR-3 KYC, and MCA ROC deadlines.',
  });

  const enrichedDeadlines = useMemo(() => {
    const today = new Date();
    return STATUTORY_DEADLINES.map((item) => ({
      ...item,
      dueInfo: computeNextDueInfo(item.day, item.month, today),
    }));
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { All: enrichedDeadlines.length };
    CATEGORIES.forEach(({ id }) => {
      if (id !== 'All') {
        counts[id] = enrichedDeadlines.filter((item) => item.category === id).length;
      }
    });
    return counts;
  }, [enrichedDeadlines]);

  const dueNext30Count = useMemo(
    () => enrichedDeadlines.filter((item) => item.dueInfo.isDueSoon).length,
    [enrichedDeadlines]
  );

  const filteredDeadlines = useMemo(() => {
    const q = normalizeSearchText(searchQuery.trim());
    const matches = enrichedDeadlines.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchMonth = selectedMonth === 'All Months' || item.month === selectedMonth;
      const matchView =
        viewMode === 'soonest' ||
        (viewMode === 'next30' && item.dueInfo.isDueSoon) ||
        (viewMode === 'critical' && item.badgeType === 'critical');

      if (!q) return matchCat && matchMonth && matchView;

      const matchQuery =
        normalizeSearchText(item.title).includes(q) ||
        normalizeSearchText(item.statute).includes(q) ||
        normalizeSearchText(item.applicability).includes(q) ||
        normalizeSearchText(item.consequence).includes(q) ||
        normalizeSearchText(item.category).includes(q);
      return matchCat && matchMonth && matchView && matchQuery;
    });

    if (viewMode === 'critical') {
      return [...matches].sort(
        (a, b) =>
          (RISK_META[a.badgeType]?.priority ?? 9) - (RISK_META[b.badgeType]?.priority ?? 9) ||
          a.dueInfo.diffDays - b.dueInfo.diffDays
      );
    }

    return [...matches].sort((a, b) => a.dueInfo.diffDays - b.dueInfo.diffDays);
  }, [enrichedDeadlines, selectedCategory, selectedMonth, viewMode, searchQuery]);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedMonth !== 'All Months' ||
    viewMode !== 'soonest' ||
    Boolean(searchQuery.trim());

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedMonth('All Months');
    setViewMode('soonest');
    setSearchQuery('');
  };

  const handleAddToGoogleCalendar = (item) => {
    const title = encodeURIComponent(`Statutory Due Date: ${item.title}`);
    const details = encodeURIComponent(
      `Next Scheduled Due Date: ${item.dueInfo.formattedNextDate}\nStatute: ${item.statute}\nApplicability: ${item.applicability}\nConsequences: ${item.consequence}\nAssisted by Shree Chamunda Associates (+91 95109 84735)`
    );
    const location = encodeURIComponent('Government Portals (GSTN / MCA / Income Tax)');
    const dates = encodeURIComponent(item.dueInfo.gcalRange);
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyDetails = (item) => {
    const text = `STATUTORY COMPLIANCE DEADLINE\nNext Due Date: ${item.dueInfo.formattedNextDate} (${item.month})\nFiling: ${item.title}\nCategory: ${item.category}\nStatute: ${item.statute}\nPenalty: ${item.consequence}\nAdvisory Desk: Shree Chamunda Associates (+91 95109 84735)`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2200);
      });
    }
  };

  return (
    <div className="compliance-calendar-page fade-in">
      {/* ============================================================
          1. SWISS-FINTECH INSTITUTIONAL HERO SECTION
          ============================================================ */}
      <section className="cal-hero" aria-labelledby="calendar-hero-title">
        <div className="cal-hero-top-hairline" aria-hidden="true"></div>
        <div className="cal-hero-ambient-grid" aria-hidden="true"></div>
        <div className="cal-hero-ambient-orb" aria-hidden="true"></div>

        <div className="container cal-hero-container">
          <span className="header-watermark" aria-hidden="true">COMPLIANCE</span>
          <div className="luxury-header-halo" aria-hidden="true"></div>

          <div className="cal-eyebrow-badge">
            <span className="badge-index-chip">01</span>
            <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
            <span>STATUTORY COMPLIANCE RADAR &bull; ZERO PENALTY ASSURANCE</span>
          </div>

          <h1 id="calendar-hero-title" className="cal-main-title">
            Statutory Due Dates &amp;{' '}
            <span className="title-burnished-gold">Compliance Calendar.</span>
          </h1>

          <p className="cal-subtitle">
            Live regulatory countdown across Income Tax, GST, MCA Company Governance, and Labour Laws. Track upcoming statutory dates and shield your business against late fees and Section 234 interest.
          </p>

          <div className="header-assurance-strip" role="list" aria-label="Compliance Monitoring Benchmarks">
            <span className="assurance-pill" role="listitem">
              <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
              <span>100% Timely Filing Discipline</span>
            </span>
            <span className="assurance-pill" role="listitem">
              <i className="fa-solid fa-landmark" aria-hidden="true"></i>
              <span>4 Statutory Authorities Tracked</span>
            </span>
            <span className="assurance-pill" role="listitem">
              <i className="fa-solid fa-clock" aria-hidden="true"></i>
              <span>Live Countdown &amp; Google Cal Sync</span>
            </span>
            <span className="assurance-pill" role="listitem">
              <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              <span>FY 2025-26 &amp; FY 2026-27 Ready</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. 2-TIER EXECUTIVE CONTROL DECK & DUE-DATE LEDGER
          ============================================================ */}
      <main className="container cal-main-container">
        <section className="cal-control-deck" aria-label="Filter Statutory Deadlines">
          {/* Tier 1: Authority Category Tabs & Live Telemetry */}
          <div className="cal-deck-nav-bar">
            <div className="cal-category-tabs" role="tablist" aria-label="Regulatory Authorities">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] ?? 0;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`cal-category-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <i className={cat.icon} aria-hidden="true"></i>
                    <span>{cat.label}</span>
                    <span className="cal-tab-count">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="cal-deck-telemetry">
              <button
                type="button"
                className={`cal-urgent-pill ${viewMode === 'next30' ? 'active' : ''}`}
                onClick={() => setViewMode((v) => (v === 'next30' ? 'soonest' : 'next30'))}
                title="Filter deadlines due within the next 30 days"
              >
                <span className="urgent-pulse-dot" aria-hidden="true"></span>
                <span>
                  <strong>{dueNext30Count}</strong> Due &le; 30 Days
                </span>
              </button>

              <span className="cal-meta-pill">
                <i className="fa-solid fa-list-check" aria-hidden="true"></i>
                <span>
                  <strong>{filteredDeadlines.length}</strong> Shown
                </span>
              </span>
            </div>
          </div>

          {/* Tier 2: Search Console, Month Select & View Mode */}
          <div className="cal-deck-filter-bar">
            <div className="cal-search-box">
              <i className="fa-solid fa-magnifying-glass cal-search-icon" aria-hidden="true"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search GSTR-3B, Sec 44AB, Advance Tax, AOC-4, TDS 281..."
                className="cal-search-input"
                aria-label="Search statutory deadlines"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="cal-search-clear"
                  aria-label="Clear search query"
                  title="Clear search"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            <div className="cal-filter-controls">
              <div className="cal-view-switch" role="group" aria-label="Sort and Priority View">
                <button
                  type="button"
                  className={`cal-view-btn ${viewMode === 'soonest' ? 'active' : ''}`}
                  onClick={() => setViewMode('soonest')}
                >
                  Soonest
                </button>
                <button
                  type="button"
                  className={`cal-view-btn ${viewMode === 'next30' ? 'active' : ''}`}
                  onClick={() => setViewMode('next30')}
                >
                  Next 30d
                </button>
                <button
                  type="button"
                  className={`cal-view-btn ${viewMode === 'critical' ? 'active' : ''}`}
                  onClick={() => setViewMode('critical')}
                >
                  Critical
                </button>
              </div>

              <div className="cal-select-wrap">
                <i className="fa-solid fa-calendar-days cal-select-icon" aria-hidden="true"></i>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="cal-month-select"
                  aria-label="Filter by month or frequency"
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cal-layout-switch" role="group" aria-label="Display Layout Mode">
                <button
                  type="button"
                  className={`cal-layout-btn ${displayMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setDisplayMode('grid')}
                  title="2-Column Bento Cards"
                  aria-label="Bento Cards View"
                >
                  <i className="fa-solid fa-table-cells-large" aria-hidden="true"></i>
                </button>
                <button
                  type="button"
                  className={`cal-layout-btn ${displayMode === 'schedule' ? 'active' : ''}`}
                  onClick={() => setDisplayMode('schedule')}
                  title="Compact Compliance Schedule"
                  aria-label="Compact Schedule View"
                >
                  <i className="fa-solid fa-list-ul" aria-hidden="true"></i>
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="cal-reset-btn"
                  onClick={handleResetFilters}
                  title="Reset all calendar filters"
                >
                  <i className="fa-solid fa-rotate-left" aria-hidden="true"></i>
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Tier 3: Quick-Jump Statutory Keywords & Calculators Shortcut */}
          <div className="cal-topics-ribbon">
            <span className="cal-topics-label">
              <i className="fa-solid fa-bolt" aria-hidden="true"></i> Quick Filter:
            </span>
            <div className="cal-topics-chips">
              {QUICK_TOPICS.map((topic) => {
                const isSelected = searchQuery.trim().toLowerCase() === topic.toLowerCase();
                return (
                  <button
                    key={topic}
                    type="button"
                    className={`cal-topic-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSearchQuery(isSelected ? '' : topic);
                      setSelectedCategory('All');
                      setViewMode('soonest');
                    }}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
            <Link to="/calculators" className="cal-tools-shortcut">
              <span>Tax &amp; 234C Calculators</span>
              <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </Link>
          </div>
        </section>

        {/* Active Status Telemetry Bar */}
        <div className="cal-results-meta" aria-live="polite">
          <span>
            Showing <strong>{filteredDeadlines.length}</strong> statutory{' '}
            {filteredDeadlines.length === 1 ? 'mandate' : 'mandates'} ordered by{' '}
            <em>{viewMode === 'critical' ? 'Statutory Penalty Severity' : 'Next Upcoming Due Date'}</em>
          </span>
          {hasActiveFilters && (
            <button type="button" className="cal-meta-reset-link" onClick={handleResetFilters}>
              Show All {enrichedDeadlines.length} Deadlines
            </button>
          )}
        </div>

        {/* ============================================================
            3. COMPLIANCE DOSSIER CARDS OR EMPTY STATE
            ============================================================ */}
        {filteredDeadlines.length === 0 ? (
          <div className="cal-empty-state">
            <div className="cal-empty-icon">
              <i className="fa-solid fa-calendar-xmark" aria-hidden="true"></i>
            </div>
            <h3>No Statutory Deadlines Match Current Filters</h3>
            <p>
              Try switching back to <strong>All Months</strong> or pick a quick statutory mandate below.
            </p>
            <div className="cal-empty-suggestions">
              {QUICK_TOPICS.slice(0, 4).map((t) => (
                <button
                  key={t}
                  type="button"
                  className="cal-empty-chip"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedMonth('All Months');
                    setViewMode('soonest');
                    setSearchQuery(t);
                  }}
                >
                  Try &ldquo;{t}&rdquo;
                </button>
              ))}
            </div>
            <button type="button" className="cal-btn-show-all" onClick={handleResetFilters}>
              <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
              <span>Restore All {enrichedDeadlines.length} Deadlines</span>
            </button>
          </div>
        ) : displayMode === 'grid' ? (
          <div className="cal-mandates-grid">
            {filteredDeadlines.map((item) => {
              const catSlug = item.category.toLowerCase().replace(/[^a-z]/g, '');
              const isCopied = copiedId === item.id;
              const monthShort =
                item.month === 'Every Month'
                  ? 'MTH'
                  : item.month === 'Quarterly'
                    ? 'QTR'
                    : item.month.slice(0, 3).toUpperCase();

              return (
                <article key={item.id} className={`cal-mandate-card tier-${item.badgeType}`}>
                  {/* Top Architectural Ledger Header */}
                  <div className="mandate-card-header">
                    <div className="mandate-date-lockup">
                      <div className="mandate-day-tile">
                        <span className="m-day">{item.day}</span>
                        <span className="m-month-abbr">{monthShort}</span>
                      </div>
                      <div className="mandate-cycle-meta">
                        <span className="m-cycle-label">{item.month}</span>
                        <span className="m-next-date">{item.dueInfo.formattedNextDate}</span>
                      </div>
                    </div>

                    <div className="mandate-status-cluster">
                      <span className={`cal-category-pill cat-${catSlug}`}>{item.category}</span>
                      <span
                        className={`cal-countdown-chip ${
                          item.dueInfo.diffDays <= 14
                            ? 'is-imminent'
                            : item.dueInfo.isDueSoon
                              ? 'is-soon'
                              : ''
                        }`}
                      >
                        {item.dueInfo.countdownLabel}
                      </span>
                    </div>
                  </div>

                  {/* Title, Statute Citation & Hairline Spec Rows */}
                  <div className="mandate-card-main">
                    <h2 className="mandate-card-title">{item.title}</h2>
                    <div className="mandate-statute-line">
                      <i className="fa-solid fa-landmark" aria-hidden="true"></i>
                      <span>{item.statute}</span>
                    </div>

                    <dl className="mandate-spec-list">
                      <div className="mandate-spec-row">
                        <dt>Who Must File</dt>
                        <dd>{item.applicability}</dd>
                      </div>

                      <div className="mandate-spec-row exposure">
                        <dt>
                          <span>Default Exposure</span>
                          <span className={`exposure-metric-chip tier-${item.badgeType}`}>
                            {item.penaltyHighlight}
                          </span>
                        </dt>
                        <dd>{item.consequence}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Bottom Unified Command Bar */}
                  <div className="mandate-card-footer">
                    <div className="mandate-utility-group">
                      <button
                        type="button"
                        className="mandate-util-btn"
                        onClick={() => handleAddToGoogleCalendar(item)}
                        title={`Pin ${item.dueInfo.formattedNextDate} in Google Calendar`}
                      >
                        <i className="fa-solid fa-calendar-plus" aria-hidden="true"></i>
                        <span>Cal Sync</span>
                      </button>

                      <button
                        type="button"
                        className={`mandate-util-btn ${isCopied ? 'copied' : ''}`}
                        onClick={() => handleCopyDetails(item)}
                        title="Copy statutory mandate brief"
                      >
                        <i
                          className={`fa-solid ${isCopied ? 'fa-check' : 'fa-copy'}`}
                          aria-hidden="true"
                        ></i>
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <Link to={item.actionUrl} className="mandate-primary-cta">
                      <span>{item.actionText}</span>
                      <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="cal-schedule-ledger">
            <div className="ledger-head-row" aria-hidden="true">
              <span>Due Date</span>
              <span>Compliance Mandate &amp; Statute</span>
              <span>Penalty Benchmark</span>
              <span>Actions</span>
            </div>

            {filteredDeadlines.map((item) => {
              const catSlug = item.category.toLowerCase().replace(/[^a-z]/g, '');
              const isCopied = copiedId === item.id;
              return (
                <article key={item.id} className="ledger-schedule-row">
                  <div className="ledger-date-col">
                    <span className="ledger-date-main">{item.dueInfo.formattedNextDate}</span>
                    <div className="ledger-date-badges">
                      <span
                        className={`cal-countdown-chip ${
                          item.dueInfo.diffDays <= 14
                            ? 'is-imminent'
                            : item.dueInfo.isDueSoon
                              ? 'is-soon'
                              : ''
                        }`}
                      >
                        {item.dueInfo.countdownLabel}
                      </span>
                      <span className="ledger-cycle-text">{item.month}</span>
                    </div>
                  </div>

                  <div className="ledger-title-col">
                    <div className="ledger-meta-top">
                      <span className={`cal-category-pill cat-${catSlug}`}>{item.category}</span>
                      <span className="ledger-statute-text">{item.statute}</span>
                    </div>
                    <h2 className="ledger-row-title">{item.title}</h2>
                  </div>

                  <div className="ledger-penalty-col">
                    <span className={`exposure-metric-chip tier-${item.badgeType}`}>
                      {item.penaltyHighlight}
                    </span>
                  </div>

                  <div className="ledger-actions-col">
                    <button
                      type="button"
                      className="mandate-util-btn icon-only"
                      onClick={() => handleAddToGoogleCalendar(item)}
                      title={`Add ${item.dueInfo.formattedNextDate} to Google Calendar`}
                      aria-label={`Add ${item.title} to Google Calendar`}
                    >
                      <i className="fa-solid fa-calendar-plus" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      className={`mandate-util-btn icon-only ${isCopied ? 'copied' : ''}`}
                      onClick={() => handleCopyDetails(item)}
                      title="Copy details"
                      aria-label={`Copy ${item.title} details`}
                    >
                      <i
                        className={`fa-solid ${isCopied ? 'fa-check' : 'fa-copy'}`}
                        aria-hidden="true"
                      ></i>
                    </button>
                    <Link to={item.actionUrl} className="mandate-primary-cta compact">
                      <span>{item.actionText}</span>
                      <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ============================================================
            4. STATUTORY FINANCIAL EXPOSURE MATRIX
            ============================================================ */}
        <section className="cal-penalties-section" aria-labelledby="penalties-heading">
          <div className="cal-section-header">
            <div className="cal-section-eyebrow">
              <span className="notes-index-chip">02</span>
              <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              <span>FINANCIAL EXPOSURE AUDIT</span>
            </div>
            <h2 id="penalties-heading" className="cal-section-title">
              The True Cost of <span className="title-burnished-gold">Deferred Filings</span>
            </h2>
            <p className="cal-section-sub">
              Cascading daily late fees, statutory interest, and regulatory blocks triggered by missed compliance dates.
            </p>
          </div>

          {/* Mobile Authority Switcher Rail (Visible <= 768px) */}
          <div className="penalty-mobile-tabs" role="tablist" aria-label="Select Regulatory Penalty Act">
            {EXPOSURE_MATRICES.map((act) => {
              const isSelected = activeExposureId === act.id;
              return (
                <button
                  key={act.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`penalty-tab-btn accent-${act.accent} ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveExposureId(act.id)}
                >
                  <i className={act.icon} aria-hidden="true"></i>
                  <span>{act.shortLabel}</span>
                </button>
              );
            })}
          </div>

          <div className="cal-penalties-grid">
            {EXPOSURE_MATRICES.map((act) => {
              const isActiveMobile = activeExposureId === act.id;
              return (
                <article
                  key={act.id}
                  className={`cal-penalty-card accent-${act.accent} ${isActiveMobile ? 'is-mobile-active' : ''}`}
                >
                  <div className="penalty-card-head">
                    <div className={`penalty-icon-wrap ${act.accent}`}>
                      <i className={act.icon} aria-hidden="true"></i>
                    </div>
                    <div className="penalty-head-meta">
                      <span className="penalty-act-tag">{act.domain}</span>
                      <h3>{act.title}</h3>
                    </div>
                  </div>

                  <ul className="penalty-ledger-list">
                    {act.items.map((row) => (
                      <li key={row.label} className="penalty-ledger-item">
                        <div className="pli-meta">
                          <strong>{row.label}</strong>
                          <span>{row.detail}</span>
                        </div>
                        <span className={`pli-stat-badge tone-${row.tone}`}>{row.metric}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={act.actionUrl} className="penalty-card-footer-link">
                    <span>{act.actionLabel}</span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* ============================================================
            5. INSTITUTIONAL CONSULTATION BENTO CTA
            ============================================================ */}
        <section className="cal-cta-bento" aria-labelledby="cal-cta-heading">
          <div className="cal-cta-ambient-grid" aria-hidden="true"></div>
          <div className="cal-cta-ambient-glow" aria-hidden="true"></div>
          <i className="fa-solid fa-calendar-check cal-cta-watermark" aria-hidden="true"></i>

          <div className="cal-cta-content">
            <div className="cal-cta-eyebrow">
              <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              <span>ZERO-PENALTY ASSURANCE DESK &bull; AHMEDABAD CHAMBERS</span>
            </div>
            <h2 id="cal-cta-heading">
              Never Miss a <span className="cal-cta-gold">Statutory Deadline</span> Again.
            </h2>
            <p>
              Retain Shree Chamunda Associates for pre-reconciliation, advance tax monitoring, GST &amp; TDS filings, and automated monthly compliance reminders.
            </p>
            <div className="cal-cta-assurances">
              <span className="cal-assurance-tag">
                <i className="fa-solid fa-bell" aria-hidden="true"></i>
                <span>Pre-Due Date Reminders</span>
              </span>
              <span className="cal-assurance-tag">
                <i className="fa-solid fa-lock" aria-hidden="true"></i>
                <span>100% NDA Confidentiality</span>
              </span>
              <span className="cal-assurance-tag">
                <i className="fa-solid fa-file-signature" aria-hidden="true"></i>
                <span>GSTN, ITD &amp; MCA Desk</span>
              </span>
            </div>
          </div>

          <div className="cal-cta-console">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                'Hello Shree Chamunda Associates Advisory Team, I would like to subscribe to monthly statutory compliance due date alerts on WhatsApp.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cal-btn-wa-primary"
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
              <span>Subscribe on WhatsApp</span>
              <i className="fa-solid fa-arrow-right cal-btn-arrow" aria-hidden="true"></i>
            </a>

            <Link to="/contact" className="cal-btn-retainer">
              <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
              <span>Book Retainer Consultation</span>
            </Link>

            <a href={`tel:+${cleanPhone}`} className="cal-direct-phone">
              <i className="fa-solid fa-phone" aria-hidden="true"></i>
              <span>Chambers Direct: +91 95109 84735</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ComplianceCalendar;
