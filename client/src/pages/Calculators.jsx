import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useSiteContext } from '../context/SiteContext';
import './Calculators.css';

const TDS_SECTIONS = [
  { code: '194C_IND', name: '194C - Contractor (Individual/HUF)', rate: 1, threshold: 30000, desc: 'Single contract > ₹30,000 or aggregate > ₹1,00,000/yr' },
  { code: '194C_CORP', name: '194C - Contractor (Company/Firm)', rate: 2, threshold: 30000, desc: 'Subcontracting, advertising, freight & fabrication contracts' },
  { code: '194J_PROF', name: '194J - Professional Advisory / Legal', rate: 10, threshold: 30000, desc: 'Professional, financial, legal, architectural counsel' },
  { code: '194J_TECH', name: '194J - Technical Services / Call Centers / BPO', rate: 2, threshold: 30000, desc: 'Software engineering & operational technical services' },
  { code: '194I_PROP', name: '194I - Rent on Land, Building & Furniture', rate: 10, threshold: 240000, desc: 'Annual commercial or residential office lease payments' },
  { code: '194I_PLANT', name: '194I - Rent on Plant, Machinery & Equipment', rate: 2, threshold: 240000, desc: 'Industrial equipment hire & factory lease' },
  { code: '194Q', name: '194Q - Purchase of Goods > ₹50 Lakhs', rate: 0.1, threshold: 5000000, desc: 'Buyer turnover > ₹10 Cr purchasing goods from Indian seller' },
  { code: '194H', name: '194H - Commission or Brokerage', rate: 2, threshold: 15000, desc: 'Real estate, channel partner & sales commissions' },
  { code: '194A', name: '194A - Interest Other Than Securities', rate: 10, threshold: 5000, desc: 'Unsecured business loans & private lending interest' },
];

const TOOL_TABS = [
  {
    id: 'tax',
    label: 'Income Tax',
    shortTag: 'Old vs New',
    icon: 'fa-solid fa-scale-balanced',
    statute: 'Income Tax Act, 1961 • Sec 115BAC & Chapter VI-A',
  },
  {
    id: 'gst',
    label: 'GST Engine',
    shortTag: 'CGST/IGST',
    icon: 'fa-solid fa-receipt',
    statute: 'CGST / IGST Act, 2017 • Inclusive & Exclusive Tax',
  },
  {
    id: 'hra',
    label: 'HRA Exemption',
    shortTag: 'Sec 10(13A)',
    icon: 'fa-solid fa-house-chimney-user',
    statute: 'Income Tax Act • Section 10(13A) Read With Rule 2A',
  },
  {
    id: 'advance-tax',
    label: 'Advance Tax',
    shortTag: 'Sec 234C',
    icon: 'fa-solid fa-calendar-check',
    statute: 'Income Tax Act • Sections 208, 211, 234B & 234C',
  },
  {
    id: 'tds',
    label: 'TDS Calculator',
    shortTag: 'Challan 281',
    icon: 'fa-solid fa-file-invoice-dollar',
    statute: 'Chapter XVII-B • Section 194C / 194J / 194I / 206AA',
  },
  {
    id: 'sip',
    label: 'SIP & Wealth',
    shortTag: 'Compounding',
    icon: 'fa-solid fa-chart-line',
    statute: 'Long-Term Capital Growth & ELSS Tax Corpus Engine',
  },
];

const FY_OPTIONS = [
  { id: '2026-27', label: 'FY 2026-27', sub: 'AY 2027-28' },
  { id: '2025-26', label: 'FY 2025-26', sub: 'AY 2026-27' },
  { id: '2024-25', label: 'FY 2024-25', sub: 'AY 2025-26' },
];

const AGE_OPTIONS = [
  { id: 'below60', label: '< 60 Years', sub: 'General' },
  { id: 'senior', label: '60 – 80 Yrs', sub: 'Senior' },
  { id: 'superSenior', label: '80+ Years', sub: 'Super Senior' },
];

const SALARY_PRESETS = [750000, 1200000, 1500000, 2400000, 3500000];
const GST_PRESETS = [10000, 50000, 100000, 500000];
const SIP_PRESETS = [5000, 10000, 25000, 50000, 100000];

const STATUTORY_NOTE_FILTERS = [
  { id: 'all', label: 'All Briefs (6)' },
  { id: 'regimes', label: 'Regimes & Slabs' },
  { id: 'deductions', label: 'NPS & HRA' },
  { id: 'compliance', label: 'Advance Tax & TDS' },
];

const STATUTORY_NOTES = [
  {
    num: '01',
    category: 'regimes',
    toolId: 'tax',
    statute: 'SEC 139(1)',
    tag: 'Annual Option',
    question: 'Can salaried taxpayers switch between Old and New Regimes every year?',
    summary:
      'Yes. Salaried individuals having income from Salary, House Property, and Other Sources (with zero business or profession income) can opt for whichever tax regime lowers liability annually at the time of ITR filing.',
    ruleLabel: 'Filing Eligibility',
    ruleValue: 'Switch Every Year Before Due Date',
    ctaLabel: 'Compare Regimes',
  },
  {
    num: '02',
    category: 'regimes',
    toolId: 'tax',
    statute: 'SEC 115BAC • 87A',
    tag: 'Rebate & Relief',
    question: 'How do Section 87A Rebate & Marginal Relief work under the New Regime?',
    summary:
      'Under revised Section 115BAC slabs (FY 2025-26 & FY 2026-27), net taxable income up to ₹12 Lakhs incurs zero tax via Section 87A rebate (₹12.75L gross salary with ₹75K standard deduction), while marginal relief caps tax growth slightly above ₹12L.',
    ruleLabel: 'Salaried Zero-Tax Ceiling',
    ruleValue: '₹12.75L Gross (₹12L Taxable)',
    ctaLabel: 'Open Tax Engine',
  },
  {
    num: '03',
    category: 'deductions',
    toolId: 'tax',
    statute: 'SEC 80CCD(2)',
    tag: 'Both Regimes',
    question: 'Why does Employer NPS reduce tax in BOTH Old and New Regimes?',
    summary:
      'Unlike Chapter VI-A deductions restricted to the Old Regime, employer NPS contributions under Section 80CCD(2) (up to 14% of Basic + DA in New Regime; 10% Private / 14% Govt in Old) reduce taxable income under Section 115BAC as well.',
    ruleLabel: 'Dual-Regime Benefit',
    ruleValue: 'Up to 14% Basic + DA in New Regime',
    ctaLabel: 'Apply 80CCD(2)',
  },
  {
    num: '04',
    category: 'deductions',
    toolId: 'hra',
    statute: 'SEC 10(13A) • RULE 2A',
    tag: 'Old Regime Only',
    question: "Is landlord's PAN mandatory to claim Section 10(13A) HRA exemption?",
    summary:
      "Yes. Whenever aggregate annual rent paid exceeds ₹1,00,000 (above ₹8,333/month), quoting the landlord's valid PAN along with executed rent receipts is mandatory for payroll and Old Regime deduction verification.",
    ruleLabel: 'PAN Disclosure Trigger',
    ruleValue: 'Annual Rent > ₹1,00,000 (₹8,333/mo)',
    ctaLabel: 'Compute HRA',
  },
  {
    num: '05',
    category: 'compliance',
    toolId: 'advance-tax',
    statute: 'SEC 208 & 234B/C',
    tag: 'Quarterly Schedule',
    question: 'When do Section 234B & 234C advance tax interest penalties apply?',
    summary:
      'If net estimated income tax after TDS exceeds ₹10,000 in a financial year, cumulative shortfalls across the four statutory instalments (15% Jun, 45% Sep, 75% Dec, 100% Mar) attract 1% monthly simple interest.',
    ruleLabel: 'Statutory Threshold',
    ruleValue: 'Net Tax After TDS > ₹10,000',
    ctaLabel: 'Check 234C Interest',
  },
  {
    num: '06',
    category: 'compliance',
    toolId: 'tds',
    statute: 'CH. XVII-B • 206AA',
    tag: 'Withholding Rule',
    question: 'What happens if a contractor or vendor fails to furnish a valid PAN?',
    summary:
      'Under Section 206AA, missing or invalid vendor PAN overrides standard TDS rates (1%, 2%, or 10%) once invoice thresholds apply, mandating higher withholding at flat 20% (or the statutory rate, if higher).',
    ruleLabel: 'No-PAN Override Rate',
    ruleValue: 'Flat 20% Mandatory Withholding',
    ctaLabel: 'Verify TDS Rate',
  },
];

const INITIAL_TAX_STATE = {
  fy: '2026-27',
  ageGroup: 'below60',
  isSalaried: true,
  grossSalary: 1400000,
  otherIncome: 50000,
  rentalIncome: 0,
  employerNps80CCD2: 0,
  sec80C: 150000,
  sec80D_Self: 25000,
  sec80D_Parents: 25000,
  sec80CCD_NPS: 50000,
  homeLoanInterest: 0,
  hraExemption: 0,
  otherDeductions: 0,
};

const INITIAL_GST_STATE = {
  amount: 10000,
  rate: 18,
  type: 'exclusive',
  supplyType: 'intra',
};

const INITIAL_HRA_STATE = {
  basicSalary: 600000,
  da: 0,
  hraReceived: 240000,
  rentPaid: 180000,
  isMetro: false,
};

const INITIAL_ADVANCE_TAX_STATE = {
  estimatedTotalTax: 120000,
  tdsDeducted: 20000,
  q1Paid: 15000,
  q2Paid: 30000,
  q3Paid: 30000,
  q4Paid: 25000,
};

const INITIAL_TDS_STATE = {
  invoiceAmount: 100000,
  selectedSection: '194J_PROF',
  hasPan: true,
};

const INITIAL_SIP_STATE = {
  monthlyInvestment: 10000,
  expectedReturn: 12,
  years: 10,
};

const getSliderStyle = (value, min, max) => {
  const num = Number(value) || 0;
  const clamped = Math.min(max, Math.max(min, num));
  const pct = ((clamped - min) / (max - min)) * 100;
  return { '--slider-pct': `${pct.toFixed(1)}%` };
};

const formatCompactINR = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2).replace(/\.00$/, '')}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}L`;
  if (val >= 1000) return `₹${Math.round(val / 1000)}K`;
  return `₹${val}`;
};

const computeSlabRows = (income, brackets) => {
  const rows = [];
  let prev = 0;
  for (const { limit, rate, label } of brackets) {
    if (income > prev || prev === 0) {
      const upper = limit === Infinity ? income : Math.min(income, limit);
      const taxableSlice = Math.max(0, upper - prev);
      const tax = taxableSlice * rate;
      rows.push({
        label,
        ratePct: `${Math.round(rate * 100)}%`,
        taxableSlice: Math.round(taxableSlice),
        tax: Math.round(tax),
      });
    }
    prev = limit;
    if (income <= limit) break;
  }
  return rows;
};

/**
 * Computes basic slab tax under the Old Tax Regime before Sec 87A rebate.
 */
const computeOldRegimeBasicTax = (income, slabExemptOld) => {
  if (income > 1000000) {
    return (income - 1000000) * 0.3 + 500000 * 0.2 + Math.max(0, 500000 - slabExemptOld) * 0.05;
  }
  if (income > 500000) {
    return (income - 500000) * 0.2 + Math.max(0, 500000 - slabExemptOld) * 0.05;
  }
  if (income > slabExemptOld) {
    return (income - slabExemptOld) * 0.05;
  }
  return 0;
};

/**
 * Computes basic slab tax under Section 115BAC (New Regime) before Sec 87A rebate.
 */
const computeNewRegimeBasicTax = (income, isRevisedSlabs) => {
  if (isRevisedSlabs) {
    if (income > 2400000) return (income - 2400000) * 0.3 + 100000 + 80000 + 60000 + 40000 + 20000;
    if (income > 2000000) return (income - 2000000) * 0.25 + 80000 + 60000 + 40000 + 20000;
    if (income > 1600000) return (income - 1600000) * 0.2 + 60000 + 40000 + 20000;
    if (income > 1200000) return (income - 1200000) * 0.15 + 40000 + 20000;
    if (income > 800000) return (income - 800000) * 0.1 + 20000;
    if (income > 400000) return (income - 400000) * 0.05;
    return 0;
  }
  if (income > 1500000) return (income - 1500000) * 0.3 + 60000 + 30000 + 30000 + 20000;
  if (income > 1200000) return (income - 1200000) * 0.2 + 30000 + 30000 + 20000;
  if (income > 1000000) return (income - 1000000) * 0.15 + 30000 + 20000;
  if (income > 700000) return (income - 700000) * 0.1 + 20000;
  if (income > 300000) return (income - 300000) * 0.05;
  return 0;
};

/**
 * Computes Income Tax Surcharge (10%/15%/25%/37% Old vs 25% New cap) with statutory Marginal Relief.
 */
const computeSurchargeWithRelief = (income, baseTax, computeBasicTaxFn, isNewRegime) => {
  if (income <= 5000000 || baseTax <= 0) {
    return { surcharge: 0, surchargeRate: 0, marginalRelief: 0 };
  }

  let threshold = 5000000;
  let rate = 0.1;
  let prevRate = 0;

  if (income > 50000000) {
    if (isNewRegime) {
      // Sec 115BAC caps New Regime surcharge at 25% even above ₹5 Crore
      threshold = 20000000;
      rate = 0.25;
      prevRate = 0.15;
    } else {
      threshold = 50000000;
      rate = 0.37;
      prevRate = 0.25;
    }
  } else if (income > 20000000) {
    threshold = 20000000;
    rate = 0.25;
    prevRate = 0.15;
  } else if (income > 10000000) {
    threshold = 10000000;
    rate = 0.15;
    prevRate = 0.1;
  }

  const rawSurcharge = baseTax * rate;
  const rawTotal = baseTax + rawSurcharge;
  const taxAtThreshold = computeBasicTaxFn(threshold);
  const cappedTotal = taxAtThreshold * (1 + prevRate) + (income - threshold);

  if (rawTotal > cappedTotal) {
    const marginalRelief = rawTotal - cappedTotal;
    const effectiveSurcharge = Math.max(0, cappedTotal - baseTax);
    return {
      surcharge: Math.round(effectiveSurcharge),
      surchargeRate: Math.round(rate * 100),
      marginalRelief: Math.round(marginalRelief),
    };
  }

  return {
    surcharge: Math.round(rawSurcharge),
    surchargeRate: Math.round(rate * 100),
    marginalRelief: 0,
  };
};

const Calculators = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTool = searchParams.get('tool') || 'tax';
  const validTool = TOOL_TABS.some((t) => t.id === rawTool) ? rawTool : 'tax';
  const [activeTab, setActiveTab] = useState(validTool);
  const [showDeductions, setShowDeductions] = useState(true);
  const [showSlabs, setShowSlabs] = useState(false);
  const [noteFilter, setNoteFilter] = useState('all');
  const { settings } = useSiteContext();

  const cleanPhone = settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : '919510984735';

  useEffect(() => {
    const paramTool = searchParams.get('tool');
    if (paramTool && TOOL_TABS.some((t) => t.id === paramTool)) {
      setActiveTab(paramTool);
    }
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tool: tabId });
  };

  const handleJumpToTool = (toolId) => {
    handleTabChange(toolId);
    const deck = document.querySelector('.calc-suite-deck');
    if (deck) {
      deck.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredNotes =
    noteFilter === 'all'
      ? STATUTORY_NOTES
      : STATUTORY_NOTES.filter((note) => note.category === noteFilter);

  useSEO({
    title: 'Statutory Tax & Financial Calculators | Shree Chamunda Associates',
    description:
      'Statutory-calibrated Indian tax engines: Old vs New Income Tax Regime comparator (FY 2024-25 to FY 2026-27), GST Inclusive/Exclusive, HRA Exemption, Advance Tax & TDS calculators.',
  });

  // =========================================================================
  // 1. INCOME TAX CALCULATOR STATE & LOGIC (OLD VS NEW REGIME)
  // =========================================================================
  const [taxData, setTaxData] = useState(INITIAL_TAX_STATE);

  const taxCalculation = useMemo(() => {
    const grossTotal = Math.max(
      0,
      Number(taxData.grossSalary) + Number(taxData.otherIncome) + Number(taxData.rentalIncome)
    );

    const stdDeductionNew = taxData.isSalaried ? 75000 : 0;
    const stdDeductionOld = taxData.isSalaried ? 50000 : 0;
    const employerNpsDed = taxData.isSalaried ? Math.max(0, Number(taxData.employerNps80CCD2) || 0) : 0;

    // --- OLD REGIME COMPUTATION ---
    const capped80C = Math.min(150000, Math.max(0, Number(taxData.sec80C)));
    const capped80D_Self = Math.min(
      taxData.ageGroup !== 'below60' ? 50000 : 25000,
      Math.max(0, Number(taxData.sec80D_Self))
    );
    const capped80D_Parents = Math.min(50000, Math.max(0, Number(taxData.sec80D_Parents)));
    const cappedNPS = Math.min(50000, Math.max(0, Number(taxData.sec80CCD_NPS)));
    const cappedHomeLoan = Math.min(200000, Math.max(0, Number(taxData.homeLoanInterest)));
    const hraDed = Math.max(0, Number(taxData.hraExemption));
    const otherDed = Math.max(0, Number(taxData.otherDeductions));

    const chapterVIATotal = capped80C + capped80D_Self + capped80D_Parents + cappedNPS + cappedHomeLoan + hraDed + otherDed;
    const totalOldDeductions = stdDeductionOld + employerNpsDed + chapterVIATotal;
    const taxableIncomeOld = Math.max(0, grossTotal - totalOldDeductions);

    let slabExemptOld = 250000;
    if (taxData.ageGroup === 'senior') slabExemptOld = 300000;
    if (taxData.ageGroup === 'superSenior') slabExemptOld = 500000;

    const oldBrackets =
      slabExemptOld >= 500000
        ? [
            { limit: 500000, rate: 0, label: '₹0 – ₹5L' },
            { limit: 1000000, rate: 0.2, label: '₹5L – ₹10L' },
            { limit: Infinity, rate: 0.3, label: 'Above ₹10L' },
          ]
        : [
            { limit: slabExemptOld, rate: 0, label: `₹0 – ${formatCompactINR(slabExemptOld)}` },
            { limit: 500000, rate: 0.05, label: `${formatCompactINR(slabExemptOld)} – ₹5L` },
            { limit: 1000000, rate: 0.2, label: '₹5L – ₹10L' },
            { limit: Infinity, rate: 0.3, label: 'Above ₹10L' },
          ];

    const oldSlabRows = computeSlabRows(taxableIncomeOld, oldBrackets);

    let basicTaxOld = computeOldRegimeBasicTax(taxableIncomeOld, slabExemptOld);

    let rebate87A_Old = 0;
    if (taxableIncomeOld <= 500000) {
      rebate87A_Old = Math.min(basicTaxOld, 12500);
      basicTaxOld = Math.max(0, basicTaxOld - rebate87A_Old);
    }

    const {
      surcharge: surchargeOld,
      surchargeRate: surchargeRateOld,
      marginalRelief: marginalReliefOld,
    } = computeSurchargeWithRelief(
      taxableIncomeOld,
      basicTaxOld,
      (inc) => computeOldRegimeBasicTax(inc, slabExemptOld),
      false
    );

    const cessOld = Math.round((basicTaxOld + surchargeOld) * 0.04);
    const totalTaxOld = Math.round(basicTaxOld + surchargeOld + cessOld);

    // --- NEW REGIME COMPUTATION (Section 115BAC) ---
    const totalNewDeductions = stdDeductionNew + employerNpsDed;
    const taxableIncomeNew = Math.max(0, grossTotal - totalNewDeductions);
    let rebate87A_New = 0;
    const isRevisedSlabs = taxData.fy === '2025-26' || taxData.fy === '2026-27';

    const newBrackets = isRevisedSlabs
      ? [
          { limit: 400000, rate: 0, label: '₹0 – ₹4L' },
          { limit: 800000, rate: 0.05, label: '₹4L – ₹8L' },
          { limit: 1200000, rate: 0.1, label: '₹8L – ₹12L' },
          { limit: 1600000, rate: 0.15, label: '₹12L – ₹16L' },
          { limit: 2000000, rate: 0.2, label: '₹16L – ₹20L' },
          { limit: 2400000, rate: 0.25, label: '₹20L – ₹24L' },
          { limit: Infinity, rate: 0.3, label: 'Above ₹24L' },
        ]
      : [
          { limit: 300000, rate: 0, label: '₹0 – ₹3L' },
          { limit: 700000, rate: 0.05, label: '₹3L – ₹7L' },
          { limit: 1000000, rate: 0.1, label: '₹7L – ₹10L' },
          { limit: 1200000, rate: 0.15, label: '₹10L – ₹12L' },
          { limit: 1500000, rate: 0.2, label: '₹12L – ₹15L' },
          { limit: Infinity, rate: 0.3, label: 'Above ₹15L' },
        ];

    const newSlabRows = computeSlabRows(taxableIncomeNew, newBrackets);

    let basicTaxNew = computeNewRegimeBasicTax(taxableIncomeNew, isRevisedSlabs);

    if (isRevisedSlabs) {
      if (taxableIncomeNew <= 1200000) {
        rebate87A_New = Math.min(basicTaxNew, 60000);
        basicTaxNew = Math.max(0, basicTaxNew - rebate87A_New);
      } else {
        const excessIncome = taxableIncomeNew - 1200000;
        if (basicTaxNew > excessIncome) {
          rebate87A_New = basicTaxNew - excessIncome;
          basicTaxNew = excessIncome;
        }
      }
    } else {
      if (taxableIncomeNew <= 700000) {
        rebate87A_New = basicTaxNew;
        basicTaxNew = 0;
      } else {
        const excessIncome = taxableIncomeNew - 700000;
        if (basicTaxNew > excessIncome) {
          rebate87A_New = basicTaxNew - excessIncome;
          basicTaxNew = excessIncome;
        }
      }
    }

    const {
      surcharge: surchargeNew,
      surchargeRate: surchargeRateNew,
      marginalRelief: marginalReliefNew,
    } = computeSurchargeWithRelief(
      taxableIncomeNew,
      basicTaxNew,
      (inc) => computeNewRegimeBasicTax(inc, isRevisedSlabs),
      true
    );

    const cessNew = Math.round((basicTaxNew + surchargeNew) * 0.04);
    const totalTaxNew = Math.round(basicTaxNew + surchargeNew + cessNew);

    const difference = totalTaxOld - totalTaxNew;
    const recommended = difference >= 0 ? 'new' : 'old';
    const savings = Math.abs(difference);

    const effectiveRateNew = grossTotal > 0 ? ((totalTaxNew / grossTotal) * 100).toFixed(1) : '0.0';
    const effectiveRateOld = grossTotal > 0 ? ((totalTaxOld / grossTotal) * 100).toFixed(1) : '0.0';
    const maxTaxBar = Math.max(totalTaxNew, totalTaxOld, 1);
    const newBarWidth = Math.round((totalTaxNew / maxTaxBar) * 100);
    const oldBarWidth = Math.round((totalTaxOld / maxTaxBar) * 100);

    return {
      grossTotal,
      stdDeductionOld,
      stdDeductionNew,
      employerNpsDed,
      chapterVIATotal,
      totalNewDeductions,
      totalOldDeductions,
      taxableIncomeOld,
      taxableIncomeNew,
      basicTaxOld: Math.round(basicTaxOld),
      basicTaxNew: Math.round(basicTaxNew),
      rebate87A_Old: Math.round(rebate87A_Old),
      rebate87A_New: Math.round(rebate87A_New),
      surchargeOld,
      surchargeNew,
      surchargeRateOld,
      surchargeRateNew,
      marginalReliefOld,
      marginalReliefNew,
      cessOld,
      cessNew,
      totalTaxOld,
      totalTaxNew,
      difference,
      recommended,
      savings,
      isRevisedSlabs,
      effectiveRateNew,
      effectiveRateOld,
      newBarWidth,
      oldBarWidth,
      newSlabRows,
      oldSlabRows,
    };
  }, [taxData]);

  // =========================================================================
  // 2. GST CALCULATOR STATE & LOGIC
  // =========================================================================
  const [gstData, setGstData] = useState(INITIAL_GST_STATE);

  const gstCalculation = useMemo(() => {
    const rawAmt = Math.max(0, Number(gstData.amount) || 0);
    const r = Math.max(0, Number(gstData.rate) || 0);

    let baseAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (gstData.type === 'exclusive') {
      baseAmount = rawAmt;
      gstAmount = (rawAmt * r) / 100;
      totalAmount = baseAmount + gstAmount;
    } else {
      totalAmount = rawAmt;
      baseAmount = totalAmount / (1 + r / 100);
      gstAmount = totalAmount - baseAmount;
    }

    const halfGst = gstAmount / 2;
    const basePct = totalAmount > 0 ? Math.round((baseAmount / totalAmount) * 100) : 100;
    return {
      baseAmount: Math.round(baseAmount * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      cgst: Math.round(halfGst * 100) / 100,
      sgst: Math.round(halfGst * 100) / 100,
      igst: Math.round(gstAmount * 100) / 100,
      basePct,
    };
  }, [gstData]);

  // =========================================================================
  // 3. HRA EXEMPTION CALCULATOR STATE & LOGIC (SEC 10(13A))
  // =========================================================================
  const [hraData, setHraData] = useState(INITIAL_HRA_STATE);

  const hraCalculation = useMemo(() => {
    const salary = Math.max(0, Number(hraData.basicSalary) + Number(hraData.da));
    const hraRec = Math.max(0, Number(hraData.hraReceived));
    const rent = Math.max(0, Number(hraData.rentPaid));
    const metroPercent = hraData.isMetro ? 0.5 : 0.4;

    const cond1 = hraRec;
    const cond2 = salary * metroPercent;
    const cond3 = Math.max(0, rent - salary * 0.1);

    const exemptHRA = Math.min(cond1, cond2, cond3);
    const taxableHRA = Math.max(0, hraRec - exemptHRA);
    const exemptPct = hraRec > 0 ? Math.round((exemptHRA / hraRec) * 100) : 0;

    let bindingRule = 1;
    if (cond2 <= cond1 && cond2 <= cond3) bindingRule = 2;
    else if (cond3 <= cond1 && cond3 <= cond2) bindingRule = 3;

    return {
      salary,
      cond1,
      cond2,
      cond3,
      exemptHRA: Math.round(exemptHRA),
      taxableHRA: Math.round(taxableHRA),
      exemptPct,
      bindingRule,
    };
  }, [hraData]);

  // =========================================================================
  // 4. ADVANCE TAX & PENALTY ESTIMATOR STATE & LOGIC (SEC 208, 234C)
  // =========================================================================
  const [advanceTaxData, setAdvanceTaxData] = useState(INITIAL_ADVANCE_TAX_STATE);

  const advanceTaxCalculation = useMemo(() => {
    const netTaxLiability = Math.max(0, Number(advanceTaxData.estimatedTotalTax) - Number(advanceTaxData.tdsDeducted));
    const isApplicable = netTaxLiability >= 10000;

    const q1Due = Math.round(netTaxLiability * 0.15);
    const q2Due = Math.round(netTaxLiability * 0.45);
    const q3Due = Math.round(netTaxLiability * 0.75);
    const q4Due = Math.round(netTaxLiability * 1.0);

    const q1Paid = Number(advanceTaxData.q1Paid) || 0;
    const q2Paid = q1Paid + (Number(advanceTaxData.q2Paid) || 0);
    const q3Paid = q2Paid + (Number(advanceTaxData.q3Paid) || 0);
    const q4Paid = q3Paid + (Number(advanceTaxData.q4Paid) || 0);

    const q1Shortfall = Math.max(0, q1Due - q1Paid);
    const q2Shortfall = Math.max(0, q2Due - q2Paid);
    const q3Shortfall = Math.max(0, q3Due - q3Paid);
    const q4Shortfall = Math.max(0, q4Due - q4Paid);

    const intQ1 = q1Shortfall > 0 ? Math.round(q1Shortfall * 0.01 * 3) : 0;
    const intQ2 = q2Shortfall > 0 ? Math.round(q2Shortfall * 0.01 * 3) : 0;
    const intQ3 = q3Shortfall > 0 ? Math.round(q3Shortfall * 0.01 * 3) : 0;
    const intQ4 = q4Shortfall > 0 ? Math.round(q4Shortfall * 0.01 * 1) : 0;
    const total234C = intQ1 + intQ2 + intQ3 + intQ4;

    const paidPct = netTaxLiability > 0 ? Math.min(100, Math.round((q4Paid / netTaxLiability) * 100)) : 100;

    return {
      netTaxLiability,
      isApplicable,
      q1Due,
      q2Due,
      q3Due,
      q4Due,
      q1Paid,
      q2Paid,
      q3Paid,
      q4Paid,
      q1Shortfall,
      q2Shortfall,
      q3Shortfall,
      q4Shortfall,
      total234C,
      totalPaid: q4Paid,
      balanceRemaining: Math.max(0, netTaxLiability - q4Paid),
      paidPct,
    };
  }, [advanceTaxData]);

  // =========================================================================
  // 5. TDS RATE & DEDUCTION CALCULATOR STATE & LOGIC
  // =========================================================================
  const [tdsData, setTdsData] = useState(INITIAL_TDS_STATE);

  const tdsCalculation = useMemo(() => {
    const sec = TDS_SECTIONS.find((s) => s.code === tdsData.selectedSection) || TDS_SECTIONS[2];
    const amount = Math.max(0, Number(tdsData.invoiceAmount) || 0);

    const rateToApply = tdsData.hasPan ? sec.rate : 20;
    const tdsAmount = (amount * rateToApply) / 100;
    const payableToVendor = Math.max(0, amount - tdsAmount);

    return {
      section: sec,
      rateToApply,
      tdsAmount: Math.round(tdsAmount),
      payableToVendor: Math.round(payableToVendor),
      isThresholdApplicable: amount >= sec.threshold,
    };
  }, [tdsData]);

  // =========================================================================
  // 6. SIP & WEALTH GROWTH CALCULATOR STATE & LOGIC
  // =========================================================================
  const [sipData, setSipData] = useState(INITIAL_SIP_STATE);

  const sipCalculation = useMemo(() => {
    const P = Math.max(500, Number(sipData.monthlyInvestment) || 500);
    const annualRate = Math.max(1, Math.min(30, Number(sipData.expectedReturn) || 12));
    const n = Math.max(1, Math.min(40, Number(sipData.years) || 10)) * 12;
    const i = annualRate / 12 / 100;

    const maturityValue = Math.round(P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const totalInvested = Math.round(P * n);
    const totalGains = Math.max(0, maturityValue - totalInvested);
    const principalPct = maturityValue > 0 ? Math.round((totalInvested / maturityValue) * 100) : 100;

    return {
      totalInvested,
      totalGains,
      maturityValue,
      growthRatio: Math.round((totalGains / (totalInvested || 1)) * 100),
      principalPct,
    };
  }, [sipData]);

  // =========================================================================
  // ACTIONS: RESET, PRESETS, PRINT, WHATSAPP
  // =========================================================================
  const handleResetActiveTool = () => {
    if (activeTab === 'tax') setTaxData(INITIAL_TAX_STATE);
    else if (activeTab === 'gst') setGstData(INITIAL_GST_STATE);
    else if (activeTab === 'hra') setHraData(INITIAL_HRA_STATE);
    else if (activeTab === 'advance-tax') setAdvanceTaxData(INITIAL_ADVANCE_TAX_STATE);
    else if (activeTab === 'tds') setTdsData(INITIAL_TDS_STATE);
    else if (activeTab === 'sip') setSipData(INITIAL_SIP_STATE);
  };

  const handleApplyDeductionPreset = (mode) => {
    if (mode === 'zero') {
      setTaxData((prev) => ({
        ...prev,
        sec80C: 0,
        sec80D_Self: 0,
        sec80D_Parents: 0,
        sec80CCD_NPS: 0,
        homeLoanInterest: 0,
        hraExemption: 0,
        otherDeductions: 0,
      }));
    } else if (mode === 'optimal') {
      setTaxData((prev) => ({
        ...prev,
        sec80C: 150000,
        sec80D_Self: prev.ageGroup !== 'below60' ? 50000 : 25000,
        sec80D_Parents: 50000,
        sec80CCD_NPS: 50000,
        homeLoanInterest: 200000,
      }));
    }
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    let msg = `*Shree Chamunda Associates - Tax Advisory Computation*\n`;
    if (activeTab === 'tax') {
      msg += `Financial Year: ${taxData.fy}\n`;
      msg += `Gross Income: ₹${taxCalculation.grossTotal.toLocaleString('en-IN')}\n`;
      msg += `Old Regime Tax: ₹${taxCalculation.totalTaxOld.toLocaleString('en-IN')}\n`;
      msg += `New Regime Tax: ₹${taxCalculation.totalTaxNew.toLocaleString('en-IN')}\n`;
      msg += `Optimal Choice: ${taxCalculation.recommended === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}\n`;
      msg += `Estimated Tax Difference: ₹${taxCalculation.savings.toLocaleString('en-IN')}\n`;
      msg += `\nHello SCA Team, I calculated a ₹${taxCalculation.savings.toLocaleString('en-IN')} regime advantage on your calculator and would like to consult on optimal return filing.`;
    } else if (activeTab === 'gst') {
      msg += `Base Amount: ₹${gstCalculation.baseAmount.toLocaleString('en-IN')}\n`;
      msg += `GST (${gstData.rate}%): ₹${gstCalculation.gstAmount.toLocaleString('en-IN')}\n`;
      msg += `Total Invoice: ₹${gstCalculation.totalAmount.toLocaleString('en-IN')}\n`;
      msg += `\nHello SCA Team, I would like to consult regarding GST reconciliation & return filing.`;
    } else {
      msg += `Hello SCA Team, I computed my statutory figures using your online engine and would like to consult a Senior Tax Advisor.`;
    }
    msg += `\n\nComputation via Shree Chamunda Associates (Nikol, Ahmedabad)`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const activeToolMeta = TOOL_TABS.find((t) => t.id === activeTab) || TOOL_TABS[0];
  const currentFyMeta = FY_OPTIONS.find((f) => f.id === taxData.fy) || FY_OPTIONS[0];

  return (
    <div className="calculators-page fade-in">
      {/* ============================================================
          1. SWISS-FINTECH INSTITUTIONAL HERO SECTION
          ============================================================ */}
      <section className="calc-hero" aria-labelledby="calc-hero-title">
        <div className="calc-hero-top-hairline" aria-hidden="true"></div>
        <div className="calc-hero-ambient-grid" aria-hidden="true"></div>
        <div className="calc-hero-ambient-orb" aria-hidden="true"></div>

        <div className="container calc-hero-container">
          <span className="header-watermark" aria-hidden="true">COMPUTATION</span>
          <div className="luxury-header-halo" aria-hidden="true"></div>

          <div className="calc-eyebrow-badge">
            <span className="badge-index-chip">01</span>
            <i className="fa-solid fa-calculator" aria-hidden="true"></i>
            <span>STATUTORY COMPUTATION ENGINE &bull; FY 2026-27 ALIGNED</span>
          </div>

          <h1 id="calc-hero-title" className="calc-main-title">
            Statutory Tax &amp;{' '}
            <span className="title-burnished-gold">Financial Calculators.</span>
          </h1>

          <p className="calc-hero-lead">
            Precision computational engines calibrated to Indian Direct &amp; Indirect Tax statutes. Compare Old vs. New Tax Regimes, reconcile GST liabilities, audit advance tax installments, and compute TDS withholdings.
          </p>

          <div className="header-assurance-strip" role="list" aria-label="Computation Engine Standards">
            <span className="assurance-pill" role="listitem">
              <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              <span>Sec 115BAC Marginal Relief</span>
            </span>
            <span className="assurance-pill" role="listitem">
              <i className="fa-solid fa-check-double" aria-hidden="true"></i>
              <span>Zero Discrepancy Formulas</span>
            </span>
            <span className="assurance-pill" role="listitem">
              <i className="fa-solid fa-landmark" aria-hidden="true"></i>
              <span>CBDT &amp; GSTN Aligned</span>
            </span>
            <span className="assurance-pill" role="listitem">
              <i className="fa-solid fa-print" aria-hidden="true"></i>
              <span>Print &amp; Advisor Ready</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. UNIFIED SUITE CONTROL DECK & WORKSPACE
          ============================================================ */}
      <main className="container calc-main-container">
        {/* Print-Only Branded Practice Letterhead */}
        <header className="calc-print-letterhead" aria-hidden="true">
          <div className="print-lh-brand">
            <strong>Shree Chamunda Associates</strong>
            <span>Tax, Audit &amp; Statutory Advisory &bull; Nikol, Ahmedabad</span>
          </div>
          <div className="print-lh-meta">
            <strong>{activeToolMeta.label} Computation Sheet</strong>
            <span>{activeToolMeta.statute}</span>
          </div>
        </header>

        {/* Precision Segmented Engine Control Dock */}
        <section className="calc-suite-deck" aria-label="Calculator Tool Selection">
          <div className="calc-tabs-grid" role="tablist" aria-label="Tax & Financial Engines">
            {TOOL_TABS.map((tool) => {
              const isSelected = activeTab === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`calc-suite-tab ${isSelected ? 'active' : ''}`}
                  onClick={() => handleTabChange(tool.id)}
                >
                  <i className={`${tool.icon} calc-tab-icon`} aria-hidden="true"></i>
                  <span className="calc-tab-label">{tool.label}</span>
                </button>
              );
            })}
          </div>

          <div className="calc-deck-telemetry">
            <div className="calc-statute-group">
              <span className="calc-scope-tag">{activeToolMeta.shortTag}</span>
              <span className="calc-statute-pill">
                <i className="fa-solid fa-book-bookmark" aria-hidden="true"></i>
                <span>{activeToolMeta.statute}</span>
              </span>
            </div>

            <div className="calc-deck-utility-actions">
              <button type="button" className="calc-utility-btn" onClick={handleResetActiveTool}>
                <i className="fa-solid fa-rotate-left" aria-hidden="true"></i>
                <span>Reset</span>
              </button>
              <button type="button" className="calc-utility-btn" onClick={handlePrintSummary}>
                <i className="fa-solid fa-print" aria-hidden="true"></i>
                <span>Print Sheet</span>
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. EXECUTIVE COMPUTATION COCKPIT WORKSPACE
            ============================================================ */}
        <div className="calc-workspace-stage">
          {/* ==========================================================
              TOOL 1: INCOME TAX REGIME COMPARATOR
              ========================================================== */}
          {activeTab === 'tax' && (
            <div className="calc-cockpit-grid fade-in" role="tabpanel" aria-label="Income Tax Comparator">
              {/* LEFT CONSOLE: STRUCTURED INPUT MODULES */}
              <div className="calc-col-inputs">
                <div className="calc-console-card">
                  {/* Console Header */}
                  <div className="console-head">
                    <div className="console-head-left">
                      <span className="console-step-chip">01</span>
                      <div>
                        <span className="console-kicker">{currentFyMeta.label} ({currentFyMeta.sub})</span>
                        <h2>Income &amp; Statutory Profile</h2>
                      </div>
                    </div>
                    <span className="console-status-badge">
                      <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
                      <span>Sec 115BAC</span>
                    </span>
                  </div>

                  {/* Module A: Segmented Financial Year & Age Profile */}
                  <div className="console-module">
                    <div className="module-grid-two">
                      <div className="calc-field-block">
                        <span className="field-label-caps">Financial Year</span>
                        <div className="pill-segment-track" role="radiogroup" aria-label="Financial Year">
                          {FY_OPTIONS.map((fyOpt) => (
                            <button
                              key={fyOpt.id}
                              type="button"
                              className={`pill-segment-btn ${taxData.fy === fyOpt.id ? 'active' : ''}`}
                              onClick={() => setTaxData({ ...taxData, fy: fyOpt.id })}
                            >
                              {fyOpt.label.replace('FY ', '')}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="calc-field-block">
                        <span className="field-label-caps">Taxpayer Age Bracket</span>
                        <div className="pill-segment-track" role="radiogroup" aria-label="Age Category">
                          {AGE_OPTIONS.map((ageOpt) => (
                            <button
                              key={ageOpt.id}
                              type="button"
                              className={`pill-segment-btn ${taxData.ageGroup === ageOpt.id ? 'active' : ''}`}
                              onClick={() => setTaxData({ ...taxData, ageGroup: ageOpt.id })}
                            >
                              {ageOpt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Salaried Switch Row */}
                    <label className={`console-toggle-row ${taxData.isSalaried ? 'checked' : ''}`}>
                      <div className="toggle-row-info">
                        <strong>Salaried Individual / Pensioner</strong>
                        <span>Auto-applies ₹75,000 New Regime &amp; ₹50,000 Old Regime Standard Deduction</span>
                      </div>
                      <div className="toggle-switch-control">
                        <input
                          type="checkbox"
                          checked={taxData.isSalaried}
                          onChange={(e) => setTaxData({ ...taxData, isSalaried: e.target.checked })}
                          aria-label="Salaried or Pensioner Standard Deduction"
                        />
                        <span className="switch-track">
                          <span className="switch-thumb"></span>
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Module B: Primary Income Streams */}
                  <div className="console-module">
                    <div className="module-title-row">
                      <span className="module-title-label">
                        <i className="fa-solid fa-wallet" aria-hidden="true"></i>
                        <span>Annual Income Components</span>
                      </span>
                      <span className="module-total-pill">
                        Total Gross: <strong>₹{taxCalculation.grossTotal.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>

                    <div className="calc-field-block">
                      <div className="field-label-row">
                        <label htmlFor="tax-gross">Gross Annual Salary / Business Profits</label>
                        <span className="field-live-val">₹{Number(taxData.grossSalary).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="calc-currency-wrap">
                        <span className="currency-prefix" aria-hidden="true">₹</span>
                        <input
                          id="tax-gross"
                          type="number"
                          step="10000"
                          min="0"
                          value={taxData.grossSalary}
                          onChange={(e) => setTaxData({ ...taxData, grossSalary: e.target.value })}
                          className="calc-currency-input"
                          placeholder="e.g. 1400000"
                        />
                      </div>
                      <input
                        type="range"
                        min="300000"
                        max="10000000"
                        step="50000"
                        value={Math.min(10000000, Math.max(300000, Number(taxData.grossSalary) || 300000))}
                        onChange={(e) => setTaxData({ ...taxData, grossSalary: e.target.value })}
                        className="calc-gold-slider"
                        style={getSliderStyle(taxData.grossSalary, 300000, 10000000)}
                        aria-label="Gross annual salary slider"
                      />
                      <div className="quick-preset-row">
                        {SALARY_PRESETS.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            className={`preset-chip ${Number(taxData.grossSalary) === amt ? 'active' : ''}`}
                            onClick={() => setTaxData({ ...taxData, grossSalary: amt })}
                          >
                            {formatCompactINR(amt)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="module-grid-two">
                      <div className="calc-field-block">
                        <label htmlFor="tax-other">Other Income (FD / Dividends)</label>
                        <div className="calc-currency-wrap">
                          <span className="currency-prefix" aria-hidden="true">₹</span>
                          <input
                            id="tax-other"
                            type="number"
                            min="0"
                            value={taxData.otherIncome}
                            onChange={(e) => setTaxData({ ...taxData, otherIncome: e.target.value })}
                            className="calc-currency-input"
                          />
                        </div>
                      </div>

                      <div className="calc-field-block">
                        <label htmlFor="tax-rental">Net Rental Income</label>
                        <div className="calc-currency-wrap">
                          <span className="currency-prefix" aria-hidden="true">₹</span>
                          <input
                            id="tax-rental"
                            type="number"
                            min="0"
                            value={taxData.rentalIncome}
                            onChange={(e) => setTaxData({ ...taxData, rentalIncome: e.target.value })}
                            className="calc-currency-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="calc-field-block">
                      <div className="field-label-row">
                        <label htmlFor="tax-employer-nps">Employer NPS Contribution (Sec 80CCD(2))</label>
                        <span className="cap-hint dual-regime">New &amp; Old Regimes</span>
                      </div>
                      <div className="calc-currency-wrap">
                        <span className="currency-prefix" aria-hidden="true">₹</span>
                        <input
                          id="tax-employer-nps"
                          type="number"
                          min="0"
                          disabled={!taxData.isSalaried}
                          value={taxData.isSalaried ? taxData.employerNps80CCD2 : 0}
                          onChange={(e) => setTaxData({ ...taxData, employerNps80CCD2: e.target.value })}
                          className="calc-currency-input"
                          placeholder="e.g. 84000"
                        />
                      </div>
                      <span className="select-desc-hint">
                        {taxData.isSalaried
                          ? 'Deductible in BOTH Old & New Regimes (up to 14% of Basic + DA in New Regime; 10% Private / 14% Govt in Old).'
                          : 'Enable Salaried / Pensioner toggle above to claim Employer Sec 80CCD(2) contribution.'}
                      </span>
                    </div>
                  </div>

                  {/* Module C: Collapsible Chapter VI-A Old Regime Deductions */}
                  <div className="console-module deductions-module">
                    <div className="deductions-bar-head">
                      <button
                        type="button"
                        className="deductions-toggle-btn"
                        onClick={() => setShowDeductions((v) => !v)}
                        aria-expanded={showDeductions}
                      >
                        <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
                        <span>Old Regime Deductions (Ch. VI-A)</span>
                        <span className="deduction-sum-pill">₹{taxCalculation.chapterVIATotal.toLocaleString('en-IN')}</span>
                        <i className={`fa-solid fa-chevron-down ded-arrow ${showDeductions ? 'open' : ''}`} aria-hidden="true"></i>
                      </button>

                      <div className="deductions-quick-actions">
                        <button
                          type="button"
                          className="mini-preset-btn"
                          onClick={() => handleApplyDeductionPreset('zero')}
                          title="Clear Chapter VI-A deductions"
                        >
                          Zero
                        </button>
                        <button
                          type="button"
                          className="mini-preset-btn gold"
                          onClick={() => handleApplyDeductionPreset('optimal')}
                          title="Apply maximum statutory caps"
                        >
                          Max Caps
                        </button>
                      </div>
                    </div>

                    {showDeductions && (
                      <div className="deductions-grid fade-in">
                        <div className="calc-field-block">
                          <div className="field-label-row">
                            <label htmlFor="tax-80c">Sec 80C (PPF, ELSS, LIC)</label>
                            <span className="cap-hint">Max ₹1.5L</span>
                          </div>
                          <div className="calc-currency-wrap">
                            <span className="currency-prefix" aria-hidden="true">₹</span>
                            <input
                              id="tax-80c"
                              type="number"
                              max="150000"
                              min="0"
                              value={taxData.sec80C}
                              onChange={(e) => setTaxData({ ...taxData, sec80C: e.target.value })}
                              className="calc-currency-input"
                            />
                          </div>
                        </div>

                        <div className="calc-field-block">
                          <div className="field-label-row">
                            <label htmlFor="tax-nps">Sec 80CCD(1B) (NPS)</label>
                            <span className="cap-hint">Max ₹50K</span>
                          </div>
                          <div className="calc-currency-wrap">
                            <span className="currency-prefix" aria-hidden="true">₹</span>
                            <input
                              id="tax-nps"
                              type="number"
                              max="50000"
                              min="0"
                              value={taxData.sec80CCD_NPS}
                              onChange={(e) => setTaxData({ ...taxData, sec80CCD_NPS: e.target.value })}
                              className="calc-currency-input"
                            />
                          </div>
                        </div>

                        <div className="calc-field-block">
                          <div className="field-label-row">
                            <label htmlFor="tax-80d-self">Sec 80D Self Mediclaim</label>
                            <span className="cap-hint">{taxData.ageGroup !== 'below60' ? 'Max ₹50K' : 'Max ₹25K'}</span>
                          </div>
                          <div className="calc-currency-wrap">
                            <span className="currency-prefix" aria-hidden="true">₹</span>
                            <input
                              id="tax-80d-self"
                              type="number"
                              min="0"
                              value={taxData.sec80D_Self}
                              onChange={(e) => setTaxData({ ...taxData, sec80D_Self: e.target.value })}
                              className="calc-currency-input"
                            />
                          </div>
                        </div>

                        <div className="calc-field-block">
                          <div className="field-label-row">
                            <label htmlFor="tax-80d-parents">Sec 80D Parents Health</label>
                            <span className="cap-hint">Max ₹50K</span>
                          </div>
                          <div className="calc-currency-wrap">
                            <span className="currency-prefix" aria-hidden="true">₹</span>
                            <input
                              id="tax-80d-parents"
                              type="number"
                              min="0"
                              value={taxData.sec80D_Parents}
                              onChange={(e) => setTaxData({ ...taxData, sec80D_Parents: e.target.value })}
                              className="calc-currency-input"
                            />
                          </div>
                        </div>

                        <div className="calc-field-block">
                          <div className="field-label-row">
                            <label htmlFor="tax-24b">Sec 24(b) Home Loan Int.</label>
                            <span className="cap-hint">Max ₹2L</span>
                          </div>
                          <div className="calc-currency-wrap">
                            <span className="currency-prefix" aria-hidden="true">₹</span>
                            <input
                              id="tax-24b"
                              type="number"
                              max="200000"
                              min="0"
                              value={taxData.homeLoanInterest}
                              onChange={(e) => setTaxData({ ...taxData, homeLoanInterest: e.target.value })}
                              className="calc-currency-input"
                            />
                          </div>
                        </div>

                        <div className="calc-field-block">
                          <div className="field-label-row">
                            <label htmlFor="tax-hra">HRA Exemption Claimed</label>
                            <span className="cap-hint">Sec 10(13A)</span>
                          </div>
                          <div className="calc-currency-wrap">
                            <span className="currency-prefix" aria-hidden="true">₹</span>
                            <input
                              id="tax-hra"
                              type="number"
                              min="0"
                              value={taxData.hraExemption}
                              onChange={(e) => setTaxData({ ...taxData, hraExemption: e.target.value })}
                              className="calc-currency-input"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT CONSOLE: OBSIDIAN VERDICT + VISUAL METER + LEDGER MATRIX */}
              <div className="calc-col-results">
                {/* 1. Executive Obsidian Verdict Hero Card */}
                <div className="verdict-obsidian-card">
                  <div className="verdict-obsidian-top">
                    <span className="verdict-kicker-pill">
                      <i className="fa-solid fa-trophy" aria-hidden="true"></i>
                      <span>STATUTORY VERDICT &bull; {taxData.fy}</span>
                    </span>
                    <span className="verdict-winner-tag">
                      {taxCalculation.recommended === 'new' ? 'New Regime Optimal' : 'Old Regime Optimal'}
                    </span>
                  </div>

                  <div className="verdict-hero-metrics">
                    <div className="verdict-primary-kpi">
                      <span className="kpi-sub-label">Legal Tax Saved By Choosing Optimal Regime</span>
                      <strong className="kpi-gold-figure">
                        ₹{taxCalculation.savings.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <div className="verdict-split-pills">
                      <div className={`split-kpi-box ${taxCalculation.recommended === 'new' ? 'winner' : ''}`}>
                        <span>New Tax ({taxCalculation.effectiveRateNew}%)</span>
                        <strong>₹{taxCalculation.totalTaxNew.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className={`split-kpi-box ${taxCalculation.recommended === 'old' ? 'winner' : ''}`}>
                        <span>Old Tax ({taxCalculation.effectiveRateOld}%)</span>
                        <strong>₹{taxCalculation.totalTaxOld.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Proportional Tax Burden Visual Comparison Bars */}
                  <div className="verdict-bars-stack" aria-label="Visual Regime Tax Burden Comparison">
                    <div className="bar-item">
                      <div className="bar-label-row">
                        <span>New Regime Outgo</span>
                        <span>{taxCalculation.effectiveRateNew}% of gross income</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${taxCalculation.recommended === 'new' ? 'fill-emerald' : 'fill-slate'}`}
                          style={{ width: `${Math.max(4, taxCalculation.newBarWidth)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bar-item">
                      <div className="bar-label-row">
                        <span>Old Regime Outgo</span>
                        <span>{taxCalculation.effectiveRateOld}% of gross income</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${taxCalculation.recommended === 'old' ? 'fill-emerald' : 'fill-slate'}`}
                          style={{ width: `${Math.max(4, taxCalculation.oldBarWidth)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <p className="verdict-rationale">
                    {taxCalculation.recommended === 'new'
                      ? taxCalculation.isRevisedSlabs
                        ? `Section 115BAC (FY ${taxData.fy}) revised slabs and ₹${taxCalculation.totalNewDeductions.toLocaleString('en-IN')} statutory deductions${taxCalculation.employerNpsDed > 0 ? ' (incl. Sec 80CCD(2))' : ''} reduce your liability by ₹${taxCalculation.savings.toLocaleString('en-IN')}.`
                        : `Section 115BAC lower slab rates deliver ₹${taxCalculation.savings.toLocaleString('en-IN')} higher post-tax retention.`
                      : `Combined Chapter VI-A & statutory deductions (₹${taxCalculation.totalOldDeductions.toLocaleString('en-IN')}) outweigh New Regime slab rates by ₹${taxCalculation.savings.toLocaleString('en-IN')}.`}
                  </p>
                </div>

                {/* 2. Unified Precision Comparison Matrix Table */}
                <div className="calc-matrix-card">
                  <div className="matrix-header-row">
                    <div className="matrix-col-label">Statutory Line Item</div>
                    <div className={`matrix-col-regime ${taxCalculation.recommended === 'new' ? 'is-best' : ''}`}>
                      <span>New Regime</span>
                      {taxCalculation.recommended === 'new' && <span className="matrix-best-dot">BEST</span>}
                    </div>
                    <div className={`matrix-col-regime ${taxCalculation.recommended === 'old' ? 'is-best' : ''}`}>
                      <span>Old Regime</span>
                      {taxCalculation.recommended === 'old' && <span className="matrix-best-dot">BEST</span>}
                    </div>
                  </div>

                  <div className="matrix-body-rows">
                    <div className="matrix-data-row">
                      <span>Gross Total Income</span>
                      <span>₹{taxCalculation.grossTotal.toLocaleString('en-IN')}</span>
                      <span>₹{taxCalculation.grossTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="matrix-data-row">
                      <span>Deductions Allowed</span>
                      <span className="val-positive">-₹{taxCalculation.totalNewDeductions.toLocaleString('en-IN')}</span>
                      <span className="val-positive">-₹{taxCalculation.totalOldDeductions.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="matrix-data-row">
                      <span>Net Taxable Base</span>
                      <strong>₹{taxCalculation.taxableIncomeNew.toLocaleString('en-IN')}</strong>
                      <strong>₹{taxCalculation.taxableIncomeOld.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="matrix-data-row">
                      <span>Slab Income Tax</span>
                      <span>₹{taxCalculation.basicTaxNew.toLocaleString('en-IN')}</span>
                      <span>₹{taxCalculation.basicTaxOld.toLocaleString('en-IN')}</span>
                    </div>
                    {(taxCalculation.rebate87A_New > 0 || taxCalculation.rebate87A_Old > 0) && (
                      <div className="matrix-data-row">
                        <span>Sec 87A Rebate / Relief</span>
                        <span className="val-positive">-₹{taxCalculation.rebate87A_New.toLocaleString('en-IN')}</span>
                        <span className="val-positive">-₹{taxCalculation.rebate87A_Old.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {(taxCalculation.surchargeNew > 0 || taxCalculation.surchargeOld > 0) && (
                      <div className="matrix-data-row">
                        <span>
                          Surcharge
                          {taxCalculation.marginalReliefNew > 0 || taxCalculation.marginalReliefOld > 0
                            ? ' (Marginal Relief)'
                            : ''}
                        </span>
                        <span>
                          ₹{taxCalculation.surchargeNew.toLocaleString('en-IN')}
                          {taxCalculation.surchargeRateNew > 0 ? ` (${taxCalculation.surchargeRateNew}%)` : ''}
                        </span>
                        <span>
                          ₹{taxCalculation.surchargeOld.toLocaleString('en-IN')}
                          {taxCalculation.surchargeRateOld > 0 ? ` (${taxCalculation.surchargeRateOld}%)` : ''}
                        </span>
                      </div>
                    )}
                    <div className="matrix-data-row">
                      <span>Health &amp; Edu Cess (4%)</span>
                      <span>₹{taxCalculation.cessNew.toLocaleString('en-IN')}</span>
                      <span>₹{taxCalculation.cessOld.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="matrix-total-footer">
                    <span className="matrix-total-label">Total Tax Payable</span>
                    <strong className={`matrix-total-val ${taxCalculation.recommended === 'new' ? 'best' : ''}`}>
                      ₹{taxCalculation.totalTaxNew.toLocaleString('en-IN')}
                    </strong>
                    <strong className={`matrix-total-val ${taxCalculation.recommended === 'old' ? 'best' : ''}`}>
                      ₹{taxCalculation.totalTaxOld.toLocaleString('en-IN')}
                    </strong>
                  </div>

                  {/* Interactive Slab-by-Slab Audit Accordion */}
                  <button
                    type="button"
                    className="matrix-slabs-trigger"
                    onClick={() => setShowSlabs((prev) => !prev)}
                    aria-expanded={showSlabs}
                  >
                    <i className="fa-solid fa-table-list" aria-hidden="true"></i>
                    <span>{showSlabs ? 'Hide Slab-by-Slab Tax Computation' : 'Inspect Slab-by-Slab Tax Computation'}</span>
                    <i className={`fa-solid fa-chevron-down ${showSlabs ? 'open' : ''}`} aria-hidden="true"></i>
                  </button>

                  {showSlabs && (
                    <div className="slabs-breakdown-drawer fade-in">
                      <div className="slab-drawer-col">
                        <h4>New Regime Slabs ({taxData.fy})</h4>
                        {taxCalculation.newSlabRows.map((row, idx) => (
                          <div key={idx} className="slab-micro-row">
                            <span>{row.label} ({row.ratePct})</span>
                            <strong>₹{row.tax.toLocaleString('en-IN')}</strong>
                          </div>
                        ))}
                      </div>
                      <div className="slab-drawer-col">
                        <h4>Old Regime Slabs</h4>
                        {taxCalculation.oldSlabRows.map((row, idx) => (
                          <div key={idx} className="slab-micro-row">
                            <span>{row.label} ({row.ratePct})</span>
                            <strong>₹{row.tax.toLocaleString('en-IN')}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Clean Action Bar */}
                <div className="calc-action-bar">
                  <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                    <i className="fa-solid fa-print" aria-hidden="true"></i>
                    <span>Print Summary</span>
                  </button>
                  <button type="button" className="btn-calc-action share" onClick={handleShareWhatsApp}>
                    <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                    <span>Consult on Savings</span>
                  </button>
                  <Link to="/contact" className="btn-calc-action consult">
                    <i className="fa-solid fa-file-signature" aria-hidden="true"></i>
                    <span>File ITR Now</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              TOOL 2: GST INCLUSIVE / EXCLUSIVE ENGINE
              ========================================================== */}
          {activeTab === 'gst' && (
            <div className="calc-cockpit-grid fade-in" role="tabpanel" aria-label="GST Calculator">
              <div className="calc-col-inputs">
                <div className="calc-console-card">
                  <div className="console-head">
                    <div className="console-head-left">
                      <span className="console-step-chip">01</span>
                      <div>
                        <span className="console-kicker">GOODS &amp; SERVICES TAX ACT</span>
                        <h2>GST Invoice Configuration</h2>
                      </div>
                    </div>
                    <span className="console-status-badge">
                      <i className="fa-solid fa-receipt" aria-hidden="true"></i>
                      <span>{gstData.rate}% Slab</span>
                    </span>
                  </div>

                  <div className="console-module">
                    <div className="calc-field-block">
                      <span className="field-label-caps">Calculation Mode</span>
                      <div className="pill-segment-track two-col">
                        <button
                          type="button"
                          className={`pill-segment-btn ${gstData.type === 'exclusive' ? 'active' : ''}`}
                          onClick={() => setGstData({ ...gstData, type: 'exclusive' })}
                        >
                          GST Exclusive (+ Add Tax)
                        </button>
                        <button
                          type="button"
                          className={`pill-segment-btn ${gstData.type === 'inclusive' ? 'active' : ''}`}
                          onClick={() => setGstData({ ...gstData, type: 'inclusive' })}
                        >
                          GST Inclusive (Extract Tax)
                        </button>
                      </div>
                    </div>

                    <div className="calc-field-block">
                      <div className="field-label-row">
                        <label htmlFor="gst-amount">
                          {gstData.type === 'exclusive' ? 'Base Taxable Invoice Value' : 'Total Gross Invoice Value'}
                        </label>
                        <span className="field-live-val">₹{Number(gstData.amount).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="calc-currency-wrap">
                        <span className="currency-prefix" aria-hidden="true">₹</span>
                        <input
                          id="gst-amount"
                          type="number"
                          step="500"
                          min="0"
                          value={gstData.amount}
                          onChange={(e) => setGstData({ ...gstData, amount: e.target.value })}
                          className="calc-currency-input"
                        />
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="1000000"
                        step="5000"
                        value={Math.min(1000000, Math.max(1000, Number(gstData.amount) || 1000))}
                        onChange={(e) => setGstData({ ...gstData, amount: e.target.value })}
                        className="calc-gold-slider"
                        style={getSliderStyle(gstData.amount, 1000, 1000000)}
                        aria-label="GST invoice amount slider"
                      />
                      <div className="quick-preset-row">
                        {GST_PRESETS.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            className={`preset-chip ${Number(gstData.amount) === amt ? 'active' : ''}`}
                            onClick={() => setGstData({ ...gstData, amount: amt })}
                          >
                            {formatCompactINR(amt)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="console-module">
                    <div className="calc-field-block">
                      <span className="field-label-caps">Statutory GST Slab Rate</span>
                      <div className="rate-button-grid">
                        {[5, 12, 18, 28].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            className={`rate-btn ${gstData.rate === rate ? 'active' : ''}`}
                            onClick={() => setGstData({ ...gstData, rate })}
                          >
                            <strong>{rate}%</strong>
                            <span>{rate === 5 ? 'Essentials' : rate === 12 ? 'Standard' : rate === 18 ? 'Services / IT' : 'Luxury'}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="calc-field-block">
                      <span className="field-label-caps">Place of Supply</span>
                      <div className="pill-segment-track two-col">
                        <button
                          type="button"
                          className={`pill-segment-btn ${gstData.supplyType === 'intra' ? 'active' : ''}`}
                          onClick={() => setGstData({ ...gstData, supplyType: 'intra' })}
                        >
                          Intra-State (CGST + SGST)
                        </button>
                        <button
                          type="button"
                          className={`pill-segment-btn ${gstData.supplyType === 'inter' ? 'active' : ''}`}
                          onClick={() => setGstData({ ...gstData, supplyType: 'inter' })}
                        >
                          Inter-State (IGST)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="calc-col-results">
                <div className="verdict-obsidian-card">
                  <div className="verdict-obsidian-top">
                    <span className="verdict-kicker-pill">
                      <i className="fa-solid fa-file-invoice" aria-hidden="true"></i>
                      <span>INVOICE BREAKDOWN &bull; {gstData.type.toUpperCase()}</span>
                    </span>
                    <span className="verdict-winner-tag">{gstData.rate}% GST</span>
                  </div>

                  <div className="verdict-hero-metrics">
                    <div className="verdict-primary-kpi">
                      <span className="kpi-sub-label">Total Invoiced Settlement Value</span>
                      <strong className="kpi-gold-figure">₹{gstCalculation.totalAmount.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="verdict-split-pills">
                      <div className="split-kpi-box">
                        <span>Net Base Value</span>
                        <strong>₹{gstCalculation.baseAmount.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="split-kpi-box winner">
                        <span>GST Component ({gstData.rate}%)</span>
                        <strong>₹{gstCalculation.gstAmount.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="verdict-bars-stack">
                    <div className="bar-item">
                      <div className="bar-label-row">
                        <span>Taxable Value Share ({gstCalculation.basePct}%)</span>
                        <span>GST Tax ({100 - gstCalculation.basePct}%)</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill fill-emerald" style={{ width: `${gstCalculation.basePct}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="calc-matrix-card padded">
                  <div className="ledger-rows-stack">
                    <div className="ledger-line">
                      <span>Taxable Base Amount</span>
                      <strong>₹{gstCalculation.baseAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    {gstData.supplyType === 'intra' ? (
                      <>
                        <div className="ledger-line sub">
                          <span>Central GST (CGST @ {gstData.rate / 2}%)</span>
                          <strong>₹{gstCalculation.cgst.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="ledger-line sub">
                          <span>State GST (SGST @ {gstData.rate / 2}%)</span>
                          <strong>₹{gstCalculation.sgst.toLocaleString('en-IN')}</strong>
                        </div>
                      </>
                    ) : (
                      <div className="ledger-line sub">
                        <span>Integrated GST (IGST @ {gstData.rate}%)</span>
                        <strong>₹{gstCalculation.igst.toLocaleString('en-IN')}</strong>
                      </div>
                    )}
                    <div className="ledger-line highlight">
                      <span>Total GST Liability / Credit</span>
                      <strong>₹{gstCalculation.gstAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className="statutory-alert-box">
                    <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                    <p>
                      <strong>GSTR-2B Alignment Note:</strong> Verify supplier invoices reflect in auto-populated GSTR-2B before claiming Input Tax Credit to preempt Sec 61 ASMT-10 notices.
                    </p>
                  </div>
                </div>

                <div className="calc-action-bar two-col">
                  <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                    <i className="fa-solid fa-print" aria-hidden="true"></i>
                    <span>Print Voucher</span>
                  </button>
                  <Link to="/services/gst-return-filing" className="btn-calc-action consult">
                    <i className="fa-solid fa-file-invoice-dollar" aria-hidden="true"></i>
                    <span>Book GST Filing Desk</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              TOOL 3: HRA EXEMPTION CALCULATOR (SEC 10(13A))
              ========================================================== */}
          {activeTab === 'hra' && (
            <div className="calc-cockpit-grid fade-in" role="tabpanel" aria-label="HRA Exemption Calculator">
              <div className="calc-col-inputs">
                <div className="calc-console-card">
                  <div className="console-head">
                    <div className="console-head-left">
                      <span className="console-step-chip">01</span>
                      <div>
                        <span className="console-kicker">SECTION 10(13A) &bull; RULE 2A</span>
                        <h2>House Rent Exemption Parameters</h2>
                      </div>
                    </div>
                    <span className="console-status-badge">
                      <i className="fa-solid fa-house-chimney-user" aria-hidden="true"></i>
                      <span>Old Regime</span>
                    </span>
                  </div>

                  <div className="console-module">
                    <div className="module-grid-two">
                      <div className="calc-field-block">
                        <label htmlFor="hra-basic">Annual Basic Salary</label>
                        <div className="calc-currency-wrap">
                          <span className="currency-prefix" aria-hidden="true">₹</span>
                          <input
                            id="hra-basic"
                            type="number"
                            min="0"
                            value={hraData.basicSalary}
                            onChange={(e) => setHraData({ ...hraData, basicSalary: e.target.value })}
                            className="calc-currency-input"
                          />
                        </div>
                      </div>
                      <div className="calc-field-block">
                        <label htmlFor="hra-da">Dearness Allowance (DA)</label>
                        <div className="calc-currency-wrap">
                          <span className="currency-prefix" aria-hidden="true">₹</span>
                          <input
                            id="hra-da"
                            type="number"
                            min="0"
                            value={hraData.da}
                            onChange={(e) => setHraData({ ...hraData, da: e.target.value })}
                            className="calc-currency-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="module-grid-two">
                      <div className="calc-field-block">
                        <label htmlFor="hra-rec">Annual HRA Received</label>
                        <div className="calc-currency-wrap">
                          <span className="currency-prefix" aria-hidden="true">₹</span>
                          <input
                            id="hra-rec"
                            type="number"
                            min="0"
                            value={hraData.hraReceived}
                            onChange={(e) => setHraData({ ...hraData, hraReceived: e.target.value })}
                            className="calc-currency-input"
                          />
                        </div>
                      </div>
                      <div className="calc-field-block">
                        <label htmlFor="hra-rent">Annual Rent Paid</label>
                        <div className="calc-currency-wrap">
                          <span className="currency-prefix" aria-hidden="true">₹</span>
                          <input
                            id="hra-rent"
                            type="number"
                            min="0"
                            value={hraData.rentPaid}
                            onChange={(e) => setHraData({ ...hraData, rentPaid: e.target.value })}
                            className="calc-currency-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="calc-field-block">
                      <span className="field-label-caps">City Classification (Rule 2A)</span>
                      <div className="pill-segment-track two-col">
                        <button
                          type="button"
                          className={`pill-segment-btn ${!hraData.isMetro ? 'active' : ''}`}
                          onClick={() => setHraData({ ...hraData, isMetro: false })}
                        >
                          Non-Metro (Ahmedabad, Surat) — 40%
                        </button>
                        <button
                          type="button"
                          className={`pill-segment-btn ${hraData.isMetro ? 'active' : ''}`}
                          onClick={() => setHraData({ ...hraData, isMetro: true })}
                        >
                          Metro (Delhi, Mumbai, Kol, Chn) — 50%
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="calc-col-results">
                <div className="verdict-obsidian-card">
                  <div className="verdict-obsidian-top">
                    <span className="verdict-kicker-pill">
                      <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                      <span>RULE 2A DISPENSATION</span>
                    </span>
                    <span className="verdict-winner-tag">{hraCalculation.exemptPct}% Exempt</span>
                  </div>

                  <div className="verdict-hero-metrics">
                    <div className="verdict-primary-kpi">
                      <span className="kpi-sub-label">Tax-Free HRA Exemption Allowed</span>
                      <strong className="kpi-gold-figure">₹{hraCalculation.exemptHRA.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="verdict-split-pills">
                      <div className="split-kpi-box winner">
                        <span>Exempt HRA</span>
                        <strong>₹{hraCalculation.exemptHRA.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="split-kpi-box">
                        <span>Taxable HRA Added</span>
                        <strong>₹{hraCalculation.taxableHRA.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="verdict-bars-stack">
                    <div className="bar-item">
                      <div className="bar-label-row">
                        <span>Exempt Portion ({hraCalculation.exemptPct}%)</span>
                        <span>Taxable ({100 - hraCalculation.exemptPct}%)</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill fill-emerald" style={{ width: `${hraCalculation.exemptPct}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="calc-matrix-card padded">
                  <div className="ledger-rows-stack">
                    <div className={`ledger-line ${hraCalculation.bindingRule === 1 ? 'binding-cap' : ''}`}>
                      <span>1. Actual HRA Received</span>
                      <strong>₹{hraCalculation.cond1.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className={`ledger-line ${hraCalculation.bindingRule === 2 ? 'binding-cap' : ''}`}>
                      <span>2. {hraData.isMetro ? '50%' : '40%'} of Basic + DA</span>
                      <strong>₹{hraCalculation.cond2.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className={`ledger-line ${hraCalculation.bindingRule === 3 ? 'binding-cap' : ''}`}>
                      <span>3. Rent Paid minus 10% Salary</span>
                      <strong>₹{hraCalculation.cond3.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="ledger-line highlight">
                      <span>Least of Above 3 Rules (Allowed Exemption)</span>
                      <strong>₹{hraCalculation.exemptHRA.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className="statutory-alert-box">
                    <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
                    <p>
                      HRA exemption under Section 10(13A) applies solely under the <strong>Old Tax Regime</strong>. Landlord PAN is mandatory if annual rent exceeds ₹1,00,000.
                    </p>
                  </div>
                </div>

                <div className="calc-action-bar two-col">
                  <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                    <i className="fa-solid fa-print" aria-hidden="true"></i>
                    <span>Print HRA Sheet</span>
                  </button>
                  <Link to="/contact" className="btn-calc-action consult">
                    <i className="fa-solid fa-user-tie" aria-hidden="true"></i>
                    <span>Verify Rent &amp; PAN Proof</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              TOOL 4: ADVANCE TAX & 234C ESTIMATOR
              ========================================================== */}
          {activeTab === 'advance-tax' && (
            <div className="calc-cockpit-grid fade-in" role="tabpanel" aria-label="Advance Tax Calculator">
              <div className="calc-col-inputs">
                <div className="calc-console-card">
                  <div className="console-head">
                    <div className="console-head-left">
                      <span className="console-step-chip">01</span>
                      <div>
                        <span className="console-kicker">SECTIONS 208, 211, 234B &amp; 234C</span>
                        <h2>Annual Liability &amp; Challan 280</h2>
                      </div>
                    </div>
                    <span className="console-status-badge">
                      <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
                      <span>Quarterly</span>
                    </span>
                  </div>

                  <div className="console-module">
                    <div className="module-grid-two">
                      <div className="calc-field-block">
                        <label htmlFor="adv-total">Estimated Annual Income Tax</label>
                        <div className="calc-currency-wrap">
                          <span className="currency-prefix" aria-hidden="true">₹</span>
                          <input
                            id="adv-total"
                            type="number"
                            min="0"
                            value={advanceTaxData.estimatedTotalTax}
                            onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, estimatedTotalTax: e.target.value })}
                            className="calc-currency-input"
                          />
                        </div>
                      </div>
                      <div className="calc-field-block">
                        <label htmlFor="adv-tds">TDS / TCS Already Credits</label>
                        <div className="calc-currency-wrap">
                          <span className="currency-prefix" aria-hidden="true">₹</span>
                          <input
                            id="adv-tds"
                            type="number"
                            min="0"
                            value={advanceTaxData.tdsDeducted}
                            onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, tdsDeducted: e.target.value })}
                            className="calc-currency-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="console-module">
                    <div className="module-title-row">
                      <span className="module-title-label">
                        <i className="fa-solid fa-receipt" aria-hidden="true"></i>
                        <span>Installments Paid (Challan 280)</span>
                      </span>
                      <span className="module-total-pill">
                        Total Paid: <strong>₹{advanceTaxCalculation.totalPaid.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>

                    <div className="module-grid-two">
                      <div className="calc-field-block">
                        <label htmlFor="adv-q1">Paid by 15th June (Q1)</label>
                        <div className="calc-currency-wrap">
                          <span className="currency-prefix" aria-hidden="true">₹</span>
                          <input
                            id="adv-q1"
                            type="number"
                            min="0"
                            value={advanceTaxData.q1Paid}
                            onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, q1Paid: e.target.value })}
                            className="calc-currency-input"
                          />
                        </div>
                      </div>
                      <div className="calc-field-block">
                        <label htmlFor="adv-q2">Paid 16 Jun – 15 Sept (Q2)</label>
                        <div className="calc-currency-wrap">
                          <span className="currency-prefix" aria-hidden="true">₹</span>
                          <input
                            id="adv-q2"
                            type="number"
                            min="0"
                            value={advanceTaxData.q2Paid}
                            onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, q2Paid: e.target.value })}
                            className="calc-currency-input"
                          />
                        </div>
                      </div>
                      <div className="calc-field-block">
                        <label htmlFor="adv-q3">Paid 16 Sep – 15 Dec (Q3)</label>
                        <div className="calc-currency-wrap">
                          <span className="currency-prefix" aria-hidden="true">₹</span>
                          <input
                            id="adv-q3"
                            type="number"
                            min="0"
                            value={advanceTaxData.q3Paid}
                            onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, q3Paid: e.target.value })}
                            className="calc-currency-input"
                          />
                        </div>
                      </div>
                      <div className="calc-field-block">
                        <label htmlFor="adv-q4">Paid 16 Dec – 15 Mar (Q4)</label>
                        <div className="calc-currency-wrap">
                          <span className="currency-prefix" aria-hidden="true">₹</span>
                          <input
                            id="adv-q4"
                            type="number"
                            min="0"
                            value={advanceTaxData.q4Paid}
                            onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, q4Paid: e.target.value })}
                            className="calc-currency-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="calc-col-results">
                <div className="verdict-obsidian-card">
                  <div className="verdict-obsidian-top">
                    <span className="verdict-kicker-pill">
                      <i className="fa-solid fa-clock-rotate-left" aria-hidden="true"></i>
                      <span>CHALLAN 280 AUDIT</span>
                    </span>
                    <span className={`verdict-winner-tag ${advanceTaxCalculation.total234C > 0 ? 'warn' : ''}`}>
                      {advanceTaxCalculation.total234C > 0 ? 'Interest Triggered' : 'Compliant Track'}
                    </span>
                  </div>

                  <div className="verdict-hero-metrics">
                    <div className="verdict-primary-kpi">
                      <span className="kpi-sub-label">Net Advance Tax Obligation</span>
                      <strong className="kpi-gold-figure">₹{advanceTaxCalculation.netTaxLiability.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="verdict-split-pills">
                      <div className="split-kpi-box">
                        <span>Total Paid ({advanceTaxCalculation.paidPct}%)</span>
                        <strong>₹{advanceTaxCalculation.totalPaid.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className={`split-kpi-box ${advanceTaxCalculation.total234C > 0 ? 'alert' : 'winner'}`}>
                        <span>Sec 234C Interest</span>
                        <strong>₹{advanceTaxCalculation.total234C.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="verdict-bars-stack">
                    <div className="bar-item">
                      <div className="bar-label-row">
                        <span>Cumulative Deposit Progress</span>
                        <span>Balance: ₹{advanceTaxCalculation.balanceRemaining.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill fill-emerald" style={{ width: `${advanceTaxCalculation.paidPct}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="calc-matrix-card padded">
                  <div className="quarter-audit-grid">
                    {[
                      { tag: 'Q1 • 15 JUNE (15%)', due: advanceTaxCalculation.q1Due, short: advanceTaxCalculation.q1Shortfall },
                      { tag: 'Q2 • 15 SEPT (45%)', due: advanceTaxCalculation.q2Due, short: advanceTaxCalculation.q2Shortfall },
                      { tag: 'Q3 • 15 DEC (75%)', due: advanceTaxCalculation.q3Due, short: advanceTaxCalculation.q3Shortfall },
                      { tag: 'Q4 • 15 MARCH (100%)', due: advanceTaxCalculation.q4Due, short: advanceTaxCalculation.q4Shortfall },
                    ].map((q) => (
                      <div key={q.tag} className={`quarter-tile ${q.short > 0 ? 'tile-shortfall' : 'tile-ok'}`}>
                        <div className="quarter-tag">{q.tag}</div>
                        <div className="quarter-val">Cum. Due: ₹{q.due.toLocaleString('en-IN')}</div>
                        <div className="quarter-status">
                          {q.short > 0 ? `Shortfall: ₹${q.short.toLocaleString('en-IN')}` : '✓ Compliant'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {advanceTaxCalculation.total234C > 0 && (
                    <div className="interest-warning-card">
                      <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
                      <div>
                        <strong>Estimated Sec 234C Penalty: ₹{advanceTaxCalculation.total234C.toLocaleString('en-IN')}</strong>
                        <p>Clear remaining obligation before March 31 to prevent cascading 1% monthly Section 234B interest.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="calc-action-bar two-col">
                  <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                    <i className="fa-solid fa-print" aria-hidden="true"></i>
                    <span>Print Audit</span>
                  </button>
                  <Link to="/contact" className="btn-calc-action consult">
                    <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                    <span>Generate Challan 280</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              TOOL 5: TDS RATE CHART & WITHHOLDING ENGINE
              ========================================================== */}
          {activeTab === 'tds' && (
            <div className="calc-cockpit-grid fade-in" role="tabpanel" aria-label="TDS Withholding Calculator">
              <div className="calc-col-inputs">
                <div className="calc-console-card">
                  <div className="console-head">
                    <div className="console-head-left">
                      <span className="console-step-chip">01</span>
                      <div>
                        <span className="console-kicker">CHAPTER XVII-B &bull; CHALLAN 281</span>
                        <h2>TDS Withholding Parameters</h2>
                      </div>
                    </div>
                    <span className="console-status-badge">
                      <i className="fa-solid fa-file-invoice-dollar" aria-hidden="true"></i>
                      <span>{tdsCalculation.rateToApply}% TDS</span>
                    </span>
                  </div>

                  <div className="console-module">
                    <div className="calc-field-block">
                      <div className="field-label-row">
                        <label htmlFor="tds-amount">Gross Vendor Invoice / Payment</label>
                        <span className="field-live-val">₹{Number(tdsData.invoiceAmount).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="calc-currency-wrap">
                        <span className="currency-prefix" aria-hidden="true">₹</span>
                        <input
                          id="tds-amount"
                          type="number"
                          min="0"
                          value={tdsData.invoiceAmount}
                          onChange={(e) => setTdsData({ ...tdsData, invoiceAmount: e.target.value })}
                          className="calc-currency-input"
                        />
                      </div>
                    </div>

                    <div className="calc-field-block">
                      <label htmlFor="tds-sec">Applicable Section &amp; Nature of Payment</label>
                      <select
                        id="tds-sec"
                        value={tdsData.selectedSection}
                        onChange={(e) => setTdsData({ ...tdsData, selectedSection: e.target.value })}
                        className="calc-select"
                      >
                        {TDS_SECTIONS.map((sec) => (
                          <option key={sec.code} value={sec.code}>
                            {sec.name} ({sec.rate}%)
                          </option>
                        ))}
                      </select>
                      <span className="select-desc-hint">{tdsCalculation.section.desc}</span>
                    </div>

                    <label className={`console-toggle-row ${tdsData.hasPan ? 'checked' : ''}`}>
                      <div className="toggle-row-info">
                        <strong>Vendor Furnished Valid PAN</strong>
                        <span>Unchecked applies mandatory 20% withholding penalty under Section 206AA</span>
                      </div>
                      <div className="toggle-switch-control">
                        <input
                          type="checkbox"
                          checked={tdsData.hasPan}
                          onChange={(e) => setTdsData({ ...tdsData, hasPan: e.target.checked })}
                        />
                        <span className="switch-track">
                          <span className="switch-thumb"></span>
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="calc-col-results">
                <div className="verdict-obsidian-card">
                  <div className="verdict-obsidian-top">
                    <span className="verdict-kicker-pill">
                      <i className="fa-solid fa-receipt" aria-hidden="true"></i>
                      <span>STATUTORY WITHHOLDING</span>
                    </span>
                    <span className="verdict-winner-tag">Rate: {tdsCalculation.rateToApply}%</span>
                  </div>

                  <div className="verdict-hero-metrics">
                    <div className="verdict-primary-kpi">
                      <span className="kpi-sub-label">TDS to Deduct &amp; Deposit (Challan 281)</span>
                      <strong className="kpi-gold-figure">₹{tdsCalculation.tdsAmount.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="verdict-split-pills">
                      <div className="split-kpi-box winner">
                        <span>Net Vendor Payout</span>
                        <strong>₹{tdsCalculation.payableToVendor.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="split-kpi-box">
                        <span>Section Threshold</span>
                        <strong>₹{tdsCalculation.section.threshold.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="calc-matrix-card padded">
                  <div
                    className={`tds-threshold-banner ${
                      tdsCalculation.isThresholdApplicable ? 'is-mandatory' : 'is-below'
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        tdsCalculation.isThresholdApplicable ? 'fa-circle-exclamation' : 'fa-circle-check'
                      }`}
                      aria-hidden="true"
                    ></i>
                    <div>
                      <strong>
                        {tdsCalculation.isThresholdApplicable
                          ? 'Threshold Met — TDS Mandatory'
                          : 'Below Single-Transaction Limit'}
                      </strong>
                      <p>
                        {tdsCalculation.isThresholdApplicable
                          ? `Payment reaches the ₹${tdsCalculation.section.threshold.toLocaleString('en-IN')} statutory limit under Sec ${tdsCalculation.section.code.split('_')[0]}. Deduct ₹${tdsCalculation.tdsAmount.toLocaleString('en-IN')} prior to settlement.`
                          : `Single invoice is below ₹${tdsCalculation.section.threshold.toLocaleString('en-IN')}. Withhold TDS only if annual aggregate vendor payments cross statutory limits.`}
                      </p>
                    </div>
                  </div>

                  <div className="ledger-rows-stack">
                    <div className="ledger-line">
                      <span>Applied Withholding Rate</span>
                      <strong>{tdsCalculation.rateToApply}% {!tdsData.hasPan && '(Sec 206AA)'}</strong>
                    </div>
                    <div className="ledger-line">
                      <span>Statutory Exemption Limit</span>
                      <strong>₹{tdsCalculation.section.threshold.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="ledger-line">
                      <span>Challan 281 Deposit Deadline</span>
                      <strong>7th of Following Month</strong>
                    </div>
                    <div className="ledger-line highlight">
                      <span>Net Vendor Settlement</span>
                      <strong>₹{tdsCalculation.payableToVendor.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                <div className="calc-action-bar two-col">
                  <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                    <i className="fa-solid fa-print" aria-hidden="true"></i>
                    <span>Print TDS Voucher</span>
                  </button>
                  <Link to="/services/tds-return-filing" className="btn-calc-action consult">
                    <i className="fa-solid fa-file-contract" aria-hidden="true"></i>
                    <span>File 24Q / 26Q Return</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              TOOL 6: SIP & WEALTH COMPOUNDING ENGINE
              ========================================================== */}
          {activeTab === 'sip' && (
            <div className="calc-cockpit-grid fade-in" role="tabpanel" aria-label="SIP Compounding Engine">
              <div className="calc-col-inputs">
                <div className="calc-console-card">
                  <div className="console-head">
                    <div className="console-head-left">
                      <span className="console-step-chip">01</span>
                      <div>
                        <span className="console-kicker">SYSTEMATIC WEALTH PLANNER</span>
                        <h2>SIP &amp; Compounding Parameters</h2>
                      </div>
                    </div>
                    <span className="console-status-badge">
                      <i className="fa-solid fa-chart-line" aria-hidden="true"></i>
                      <span>{(sipCalculation.maturityValue / (sipCalculation.totalInvested || 1)).toFixed(2)}x</span>
                    </span>
                  </div>

                  <div className="console-module">
                    <div className="calc-field-block">
                      <div className="field-label-row">
                        <label htmlFor="sip-amt">Monthly Systematic Investment</label>
                        <span className="field-live-val">₹{Number(sipData.monthlyInvestment).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="calc-currency-wrap">
                        <span className="currency-prefix" aria-hidden="true">₹</span>
                        <input
                          id="sip-amt"
                          type="number"
                          step="1000"
                          min="500"
                          value={sipData.monthlyInvestment}
                          onChange={(e) => setSipData({ ...sipData, monthlyInvestment: e.target.value })}
                          className="calc-currency-input"
                        />
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="200000"
                        step="1000"
                        value={Math.min(200000, Math.max(1000, Number(sipData.monthlyInvestment) || 1000))}
                        onChange={(e) => setSipData({ ...sipData, monthlyInvestment: e.target.value })}
                        className="calc-gold-slider"
                        style={getSliderStyle(sipData.monthlyInvestment, 1000, 200000)}
                        aria-label="Monthly SIP amount slider"
                      />
                      <div className="quick-preset-row">
                        {SIP_PRESETS.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            className={`preset-chip ${Number(sipData.monthlyInvestment) === amt ? 'active' : ''}`}
                            onClick={() => setSipData({ ...sipData, monthlyInvestment: amt })}
                          >
                            {formatCompactINR(amt)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="calc-field-block">
                      <div className="field-label-row">
                        <label htmlFor="sip-rate">Expected Annual Return Rate</label>
                        <span className="field-live-val">{sipData.expectedReturn}% p.a.</span>
                      </div>
                      <input
                        id="sip-rate"
                        type="range"
                        min="6"
                        max="25"
                        step="0.5"
                        value={sipData.expectedReturn}
                        onChange={(e) => setSipData({ ...sipData, expectedReturn: e.target.value })}
                        className="calc-gold-slider"
                        style={getSliderStyle(sipData.expectedReturn, 6, 25)}
                      />
                    </div>

                    <div className="calc-field-block">
                      <div className="field-label-row">
                        <label htmlFor="sip-years">Investment Tenure</label>
                        <span className="field-live-val">{sipData.years} Years</span>
                      </div>
                      <input
                        id="sip-years"
                        type="range"
                        min="1"
                        max="35"
                        step="1"
                        value={sipData.years}
                        onChange={(e) => setSipData({ ...sipData, years: e.target.value })}
                        className="calc-gold-slider"
                        style={getSliderStyle(sipData.years, 1, 35)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="calc-col-results">
                <div className="verdict-obsidian-card">
                  <div className="verdict-obsidian-top">
                    <span className="verdict-kicker-pill">
                      <i className="fa-solid fa-sack-dollar" aria-hidden="true"></i>
                      <span>MATURITY FORECAST &bull; {sipData.years} YRS</span>
                    </span>
                    <span className="verdict-winner-tag">
                      +{sipCalculation.growthRatio}% Return
                    </span>
                  </div>

                  <div className="verdict-hero-metrics">
                    <div className="verdict-primary-kpi">
                      <span className="kpi-sub-label">Estimated Maturity Wealth Corpus</span>
                      <strong className="kpi-gold-figure">₹{sipCalculation.maturityValue.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="verdict-split-pills">
                      <div className="split-kpi-box">
                        <span>Principal Invested</span>
                        <strong>₹{sipCalculation.totalInvested.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="split-kpi-box winner">
                        <span>Estimated Gains</span>
                        <strong>+₹{sipCalculation.totalGains.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="verdict-bars-stack">
                    <div className="bar-item">
                      <div className="bar-label-row">
                        <span>Invested Capital ({sipCalculation.principalPct}%)</span>
                        <span>Compounding Gain ({100 - sipCalculation.principalPct}%)</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill fill-emerald" style={{ width: `${100 - sipCalculation.principalPct}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="calc-matrix-card padded">
                  <div className="ledger-rows-stack">
                    <div className="ledger-line">
                      <span>Total Capital Invested</span>
                      <strong>₹{sipCalculation.totalInvested.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="ledger-line">
                      <span>Compounded Wealth Gains</span>
                      <strong className="val-positive">+₹{sipCalculation.totalGains.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="ledger-line highlight">
                      <span>Wealth Multiplier Factor</span>
                      <strong>{(sipCalculation.maturityValue / (sipCalculation.totalInvested || 1)).toFixed(2)}x</strong>
                    </div>
                  </div>
                </div>

                <div className="calc-action-bar two-col">
                  <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                    <i className="fa-solid fa-print" aria-hidden="true"></i>
                    <span>Print Wealth Plan</span>
                  </button>
                  <Link to="/contact" className="btn-calc-action consult">
                    <i className="fa-solid fa-user-tie" aria-hidden="true"></i>
                    <span>Consult on Sec 80C ELSS</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            4. STATUTORY COMPUTATIONAL BRIEFING DESK
            ============================================================ */}
        <section className="calc-faqs-section" aria-labelledby="calc-faqs-heading">
          <div className="calc-notes-header-deck">
            <div className="calc-notes-heading-col">
              <div className="calc-notes-eyebrow">
                <span className="notes-index-dot">02</span>
                <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
                <span>STATUTORY PROVISIONS &bull; INTERPRETATIONS</span>
              </div>
              <h2 id="calc-faqs-heading" className="calc-section-title">
                Key Statutory <span className="notes-title-accent">Computation Notes</span>
              </h2>
              <p className="calc-section-sub">
                Direct-reference legislative rules governing tax regimes, Section 80CCD(2), HRA proofs, and advance tax or TDS compliance triggers.
              </p>
            </div>

            <div className="calc-notes-controls-col">
              <div className="calc-notes-filter-rail" role="tablist" aria-label="Filter Statutory Notes">
                {STATUTORY_NOTE_FILTERS.map((filterItem) => (
                  <button
                    key={filterItem.id}
                    type="button"
                    role="tab"
                    aria-selected={noteFilter === filterItem.id}
                    className={`notes-filter-pill ${noteFilter === filterItem.id ? 'active' : ''}`}
                    onClick={() => setNoteFilter(filterItem.id)}
                  >
                    {filterItem.label}
                  </button>
                ))}
              </div>
              <Link to="/faqs" className="notes-knowledge-link">
                <span>Browse Full Tax FAQ Dossier</span>
                <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>

          <div className="calc-faqs-grid">
            {filteredNotes.map((note) => (
              <article key={note.num} className="calc-faq-card">
                <div className="faq-card-top">
                  <div className="faq-card-id-group">
                    <span className="calc-faq-num">{note.num}</span>
                    <span className="faq-statute-chip">{note.statute}</span>
                  </div>
                  <span className="faq-tag-chip">{note.tag}</span>
                </div>

                <h3>{note.question}</h3>
                <p>{note.summary}</p>

                <div className="faq-rule-footer">
                  <div className="faq-rule-meta">
                    <span className="rule-meta-label">{note.ruleLabel}</span>
                    <strong className="rule-meta-val">{note.ruleValue}</strong>
                  </div>
                  <button
                    type="button"
                    className="faq-launch-btn"
                    onClick={() => handleJumpToTool(note.toolId)}
                    title={`Switch to ${note.ctaLabel}`}
                  >
                    <span>{note.ctaLabel}</span>
                    <i className="fa-solid fa-arrow-up" aria-hidden="true"></i>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================
            5. INSTITUTIONAL CONSULTATION BENTO CTA
            ============================================================ */}
        <section className="calc-cta-bento" aria-labelledby="calc-cta-heading">
          <div className="calc-cta-ambient-grid" aria-hidden="true"></div>
          <div className="calc-cta-ambient-glow" aria-hidden="true"></div>
          <i className="fa-solid fa-calculator calc-cta-watermark" aria-hidden="true"></i>

          <div className="calc-cta-content">
            <div className="calc-cta-eyebrow">
              <i className="fa-solid fa-landmark" aria-hidden="true"></i>
              <span>SENIOR ADVISORY BENCH &bull; AHMEDABAD CHAMBERS</span>
            </div>
            <h2 id="calc-cta-heading">
              Need a Senior Tax Advisor to{' '}
              <span className="calc-cta-gold">Audit Your Computation?</span>
            </h2>
            <p>
              Online calculators provide instant baselines, while capital gains indexation, foreign remittances, business depreciation under Sec 32, and scrutiny defense merit personalized partner oversight.
            </p>
            <div className="calc-cta-pills">
              <span className="calc-cta-pill">
                <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                <span>Pre-Filing Partner Audit</span>
              </span>
              <span className="calc-cta-pill">
                <i className="fa-solid fa-lock" aria-hidden="true"></i>
                <span>100% NDA Confidentiality</span>
              </span>
              <span className="calc-cta-pill">
                <i className="fa-solid fa-file-signature" aria-hidden="true"></i>
                <span>ITD &amp; GSTN Portal Representation</span>
              </span>
            </div>
          </div>

          <div className="calc-cta-console">
            <Link to="/contact" className="calc-cta-btn-primary">
              <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
              <span>Schedule 1-on-1 Review</span>
              <i className="fa-solid fa-arrow-right cta-arrow" aria-hidden="true"></i>
            </Link>
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Shree Chamunda Associates Advisory Team, I used your Statutory Tax Calculators and would like a Senior Tax Advisor review.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="calc-cta-btn-wa"
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
              <span>WhatsApp Advisory Desk</span>
            </a>
            <a href={`tel:+${cleanPhone}`} className="calc-cta-phone">
              <i className="fa-solid fa-phone" aria-hidden="true"></i>
              <span>Chambers Direct: +91 95109 84735</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Calculators;
