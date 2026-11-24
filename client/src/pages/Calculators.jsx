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

const INITIAL_TAX_STATE = {
  fy: '2026-27',
  ageGroup: 'below60',
  isSalaried: true,
  grossSalary: 1400000,
  otherIncome: 50000,
  rentalIncome: 0,
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

const Calculators = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTool = searchParams.get('tool') || 'tax';
  const validTool = TOOL_TABS.some((t) => t.id === rawTool) ? rawTool : 'tax';
  const [activeTab, setActiveTab] = useState(validTool);
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

    const totalOldDeductions =
      stdDeductionOld + capped80C + capped80D_Self + capped80D_Parents + cappedNPS + cappedHomeLoan + hraDed + otherDed;
    const taxableIncomeOld = Math.max(0, grossTotal - totalOldDeductions);

    let basicTaxOld = 0;
    let slabExemptOld = 250000;
    if (taxData.ageGroup === 'senior') slabExemptOld = 300000;
    if (taxData.ageGroup === 'superSenior') slabExemptOld = 500000;

    if (taxableIncomeOld > 1000000) {
      basicTaxOld = (taxableIncomeOld - 1000000) * 0.3 + (1000000 - 500000) * 0.2 + (500000 - slabExemptOld) * 0.05;
    } else if (taxableIncomeOld > 500000) {
      basicTaxOld = (taxableIncomeOld - 500000) * 0.2 + (500000 - slabExemptOld) * 0.05;
    } else if (taxableIncomeOld > slabExemptOld) {
      basicTaxOld = (taxableIncomeOld - slabExemptOld) * 0.05;
    }

    let rebate87A_Old = 0;
    if (taxableIncomeOld <= 500000) {
      rebate87A_Old = Math.min(basicTaxOld, 12500);
      basicTaxOld = Math.max(0, basicTaxOld - rebate87A_Old);
    }

    const cessOld = Math.round(basicTaxOld * 0.04);
    const totalTaxOld = Math.round(basicTaxOld + cessOld);

    // --- NEW REGIME COMPUTATION (Section 115BAC) ---
    const taxableIncomeNew = Math.max(0, grossTotal - stdDeductionNew);
    let basicTaxNew = 0;
    let rebate87A_New = 0;
    const isRevisedSlabs = taxData.fy === '2025-26' || taxData.fy === '2026-27';

    if (isRevisedSlabs) {
      // Revised Sec 115BAC Slabs (FY 2025-26 & FY 2026-27):
      // 0 - 4L: 0% | 4 - 8L: 5% | 8 - 12L: 10% | 12 - 16L: 15% | 16 - 20L: 20% | 20 - 24L: 25% | > 24L: 30%
      if (taxableIncomeNew > 2400000) {
        basicTaxNew = (taxableIncomeNew - 2400000) * 0.3 + 100000 + 80000 + 60000 + 40000 + 20000;
      } else if (taxableIncomeNew > 2000000) {
        basicTaxNew = (taxableIncomeNew - 2000000) * 0.25 + 80000 + 60000 + 40000 + 20000;
      } else if (taxableIncomeNew > 1600000) {
        basicTaxNew = (taxableIncomeNew - 1600000) * 0.2 + 60000 + 40000 + 20000;
      } else if (taxableIncomeNew > 1200000) {
        basicTaxNew = (taxableIncomeNew - 1200000) * 0.15 + 40000 + 20000;
      } else if (taxableIncomeNew > 800000) {
        basicTaxNew = (taxableIncomeNew - 800000) * 0.1 + 20000;
      } else if (taxableIncomeNew > 400000) {
        basicTaxNew = (taxableIncomeNew - 400000) * 0.05;
      }

      // Section 87A Rebate up to ₹12,00,000 taxable income (max rebate ₹60,000) + Marginal Relief
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
      // FY 2024-25 Sec 115BAC Slabs (Finance Act 2024):
      // 0 - 3L: 0% | 3 - 7L: 5% | 7 - 10L: 10% | 10 - 12L: 15% | 12 - 15L: 20% | > 15L: 30%
      if (taxableIncomeNew > 1500000) {
        basicTaxNew = (taxableIncomeNew - 1500000) * 0.3 + 60000 + 30000 + 30000 + 20000;
      } else if (taxableIncomeNew > 1200000) {
        basicTaxNew = (taxableIncomeNew - 1200000) * 0.2 + 30000 + 30000 + 20000;
      } else if (taxableIncomeNew > 1000000) {
        basicTaxNew = (taxableIncomeNew - 1000000) * 0.15 + 30000 + 20000;
      } else if (taxableIncomeNew > 700000) {
        basicTaxNew = (taxableIncomeNew - 700000) * 0.1 + 20000;
      } else if (taxableIncomeNew > 300000) {
        basicTaxNew = (taxableIncomeNew - 300000) * 0.05;
      }

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

    const cessNew = Math.round(basicTaxNew * 0.04);
    const totalTaxNew = Math.round(basicTaxNew + cessNew);

    const difference = totalTaxOld - totalTaxNew;
    const recommended = difference >= 0 ? 'new' : 'old';
    const savings = Math.abs(difference);

    return {
      grossTotal,
      stdDeductionOld,
      stdDeductionNew,
      totalOldDeductions,
      taxableIncomeOld,
      taxableIncomeNew,
      basicTaxOld: Math.round(basicTaxOld),
      basicTaxNew: Math.round(basicTaxNew),
      rebate87A_Old: Math.round(rebate87A_Old),
      rebate87A_New: Math.round(rebate87A_New),
      cessOld,
      cessNew,
      totalTaxOld,
      totalTaxNew,
      difference,
      recommended,
      savings,
      isRevisedSlabs,
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
    return {
      baseAmount: Math.round(baseAmount * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      cgst: Math.round(halfGst * 100) / 100,
      sgst: Math.round(halfGst * 100) / 100,
      igst: Math.round(gstAmount * 100) / 100,
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

    return {
      salary,
      cond1,
      cond2,
      cond3,
      exemptHRA: Math.round(exemptHRA),
      taxableHRA: Math.round(taxableHRA),
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

    return {
      totalInvested,
      totalGains,
      maturityValue,
      growthRatio: Math.round((totalGains / (totalInvested || 1)) * 100),
    };
  }, [sipData]);

  // =========================================================================
  // ACTIONS: RESET, PRINT, WHATSAPP
  // =========================================================================
  const handleResetActiveTool = () => {
    if (activeTab === 'tax') setTaxData(INITIAL_TAX_STATE);
    else if (activeTab === 'gst') setGstData(INITIAL_GST_STATE);
    else if (activeTab === 'hra') setHraData(INITIAL_HRA_STATE);
    else if (activeTab === 'advance-tax') setAdvanceTaxData(INITIAL_ADVANCE_TAX_STATE);
    else if (activeTab === 'tds') setTdsData(INITIAL_TDS_STATE);
    else if (activeTab === 'sip') setSipData(INITIAL_SIP_STATE);
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

  const ayLabel =
    taxData.fy === '2026-27'
      ? 'FY 2026-27 (AY 2027-28)'
      : taxData.fy === '2025-26'
      ? 'FY 2025-26 (AY 2026-27)'
      : 'FY 2024-25 (AY 2025-26)';

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

          {/* Frosted Executive Assurance Strip */}
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
            3. ACTIVE TOOL WORKSPACE
            ============================================================ */}
        <div className="calc-workspace-stage">
          {/* TOOL 1: INCOME TAX REGIME COMPARATOR */}
          {activeTab === 'tax' && (
            <div className="calc-card-grid fade-in" role="tabpanel" aria-label="Income Tax Comparator">
              {/* Left Inputs Column */}
              <div className="calc-col-inputs">
                <div className="calc-box-card">
                  <div className="box-card-header">
                    <div className="header-icon-badge" aria-hidden="true">
                      <i className="fa-solid fa-sliders"></i>
                    </div>
                    <div className="box-card-titles">
                      <span className="box-kicker">{ayLabel}</span>
                      <h2>Annual Income &amp; Deductions</h2>
                    </div>
                  </div>

                  <div className="calc-form-body">
                    <div className="calc-row-split">
                      <div className="calc-input-group">
                        <label htmlFor="tax-fy">Financial Year</label>
                        <select
                          id="tax-fy"
                          value={taxData.fy}
                          onChange={(e) => setTaxData({ ...taxData, fy: e.target.value })}
                          className="calc-select"
                        >
                          <option value="2026-27">FY 2026-27 (AY 2027-28)</option>
                          <option value="2025-26">FY 2025-26 (AY 2026-27)</option>
                          <option value="2024-25">FY 2024-25 (AY 2025-26)</option>
                        </select>
                      </div>

                      <div className="calc-input-group">
                        <label htmlFor="tax-age">Taxpayer Age Category</label>
                        <select
                          id="tax-age"
                          value={taxData.ageGroup}
                          onChange={(e) => setTaxData({ ...taxData, ageGroup: e.target.value })}
                          className="calc-select"
                        >
                          <option value="below60">Below 60 Years (General)</option>
                          <option value="senior">60 - 80 Years (Senior Citizen)</option>
                          <option value="superSenior">80+ Years (Super Senior)</option>
                        </select>
                      </div>
                    </div>

                    <div className="calc-checkbox-strip">
                      <label className="checkbox-pill">
                        <input
                          type="checkbox"
                          checked={taxData.isSalaried}
                          onChange={(e) => setTaxData({ ...taxData, isSalaried: e.target.checked })}
                        />
                        <span className="checkbox-label-text">
                          <strong>Salaried / Pensioner</strong> (Auto-applies ₹75,000 New / ₹50,000 Old Standard Deduction)
                        </span>
                      </label>
                    </div>

                    <div className="calc-input-group">
                      <div className="input-label-row">
                        <label htmlFor="tax-gross">Gross Annual Salary / Business Profits (₹)</label>
                        <span className="input-help-val">₹{Number(taxData.grossSalary).toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        id="tax-gross"
                        type="number"
                        step="10000"
                        min="0"
                        value={taxData.grossSalary}
                        onChange={(e) => setTaxData({ ...taxData, grossSalary: e.target.value })}
                        className="calc-input-field"
                        placeholder="e.g. 1400000"
                      />
                      <input
                        type="range"
                        min="300000"
                        max="5000000"
                        step="50000"
                        value={Math.min(5000000, Math.max(300000, Number(taxData.grossSalary) || 300000))}
                        onChange={(e) => setTaxData({ ...taxData, grossSalary: e.target.value })}
                        className="calc-range-slider"
                        aria-label="Gross annual salary slider"
                      />
                    </div>

                    <div className="calc-row-split">
                      <div className="calc-input-group">
                        <label htmlFor="tax-other">Other Income (FD Interest, Dividends) (₹)</label>
                        <input
                          id="tax-other"
                          type="number"
                          min="0"
                          value={taxData.otherIncome}
                          onChange={(e) => setTaxData({ ...taxData, otherIncome: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                      <div className="calc-input-group">
                        <label htmlFor="tax-rental">Net Rental Income (₹)</label>
                        <input
                          id="tax-rental"
                          type="number"
                          min="0"
                          value={taxData.rentalIncome}
                          onChange={(e) => setTaxData({ ...taxData, rentalIncome: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                    </div>

                    <div className="calc-deductions-header">
                      <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
                      <span>Old Regime Deductions (Chapter VI-A)</span>
                    </div>

                    <div className="calc-row-split">
                      <div className="calc-input-group">
                        <label htmlFor="tax-80c">Section 80C (PPF, EPF, ELSS, LIC) [Max ₹1.5L]</label>
                        <input
                          id="tax-80c"
                          type="number"
                          max="150000"
                          min="0"
                          value={taxData.sec80C}
                          onChange={(e) => setTaxData({ ...taxData, sec80C: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>

                      <div className="calc-input-group">
                        <label htmlFor="tax-nps">Section 80CCD(1B) (NPS) [Max ₹50,000]</label>
                        <input
                          id="tax-nps"
                          type="number"
                          max="50000"
                          min="0"
                          value={taxData.sec80CCD_NPS}
                          onChange={(e) => setTaxData({ ...taxData, sec80CCD_NPS: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                    </div>

                    <div className="calc-row-split">
                      <div className="calc-input-group">
                        <label htmlFor="tax-80d-self">Sec 80D Mediclaim (Self &amp; Family) [₹25K/₹50K]</label>
                        <input
                          id="tax-80d-self"
                          type="number"
                          min="0"
                          value={taxData.sec80D_Self}
                          onChange={(e) => setTaxData({ ...taxData, sec80D_Self: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>

                      <div className="calc-input-group">
                        <label htmlFor="tax-80d-parents">Sec 80D Parents Mediclaim [Up to ₹50,000]</label>
                        <input
                          id="tax-80d-parents"
                          type="number"
                          min="0"
                          value={taxData.sec80D_Parents}
                          onChange={(e) => setTaxData({ ...taxData, sec80D_Parents: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                    </div>

                    <div className="calc-row-split">
                      <div className="calc-input-group">
                        <label htmlFor="tax-24b">Sec 24(b) Home Loan Interest [Max ₹2 Lakhs]</label>
                        <input
                          id="tax-24b"
                          type="number"
                          max="200000"
                          min="0"
                          value={taxData.homeLoanInterest}
                          onChange={(e) => setTaxData({ ...taxData, homeLoanInterest: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>

                      <div className="calc-input-group">
                        <label htmlFor="tax-hra">HRA Exemption Claimed (₹)</label>
                        <input
                          id="tax-hra"
                          type="number"
                          min="0"
                          value={taxData.hraExemption}
                          onChange={(e) => setTaxData({ ...taxData, hraExemption: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Output & Comparison Column */}
              <div className="calc-col-results">
                <div className={`calc-verdict-card ${taxCalculation.recommended === 'new' ? 'verdict-new' : 'verdict-old'}`}>
                  <div className="verdict-header">
                    <div className="verdict-icon" aria-hidden="true">
                      <i className="fa-solid fa-trophy"></i>
                    </div>
                    <div>
                      <span className="verdict-sub">STATUTORY RECOMMENDATION &bull; {taxData.fy}</span>
                      <h3>
                        {taxCalculation.recommended === 'new'
                          ? 'New Tax Regime is Optimal'
                          : 'Old Tax Regime is Optimal'}
                      </h3>
                    </div>
                  </div>

                  <div className="verdict-saving-box">
                    <span className="saving-label">Potential Legal Tax Saved</span>
                    <strong className="saving-amount">₹{taxCalculation.savings.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="verdict-action-row">
                    <button
                      type="button"
                      className="btn-verdict-whatsapp"
                      onClick={handleShareWhatsApp}
                    >
                      <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                      <span>Consult on My ₹{taxCalculation.savings.toLocaleString('en-IN')} Savings</span>
                      <i className="fa-solid fa-arrow-right verdict-arrow" aria-hidden="true"></i>
                    </button>
                  </div>

                  <p className="verdict-note">
                    {taxCalculation.recommended === 'new'
                      ? taxCalculation.isRevisedSlabs
                        ? `Under Section 115BAC (FY ${taxData.fy}), revised slab thresholds up to ₹24L, ₹75,000 standard deduction, and Sec 87A rebate up to ₹12L taxable income deliver lower tax outgo.`
                        : `Under Section 115BAC (FY 2024-25), lower slab rates and the ₹75,000 standard deduction offer maximum post-tax cashflow.`
                      : `Due to combined 80C, 80D, home loan interest, and HRA deductions (₹${taxCalculation.totalOldDeductions.toLocaleString('en-IN')}), Old Regime yields lower tax liability.`}
                  </p>
                </div>

                {/* Side-by-Side Comparison Deck */}
                <div className="calc-comparison-deck">
                  <div className={`regime-tile ${taxCalculation.recommended === 'new' ? 'tile-winner' : ''}`}>
                    <div className="tile-title-row">
                      <span className="regime-name">New Tax Regime</span>
                      {taxCalculation.recommended === 'new' && (
                        <span className="winner-chip">
                          <i className="fa-solid fa-check" aria-hidden="true"></i> Optimal
                        </span>
                      )}
                    </div>
                    <span className="regime-sec-tag">Section 115BAC ({taxData.fy} Default)</span>

                    <div className="regime-metric-stack">
                      <div className="regime-metric-row">
                        <span>Gross Income</span>
                        <strong>₹{taxCalculation.grossTotal.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="regime-metric-row">
                        <span>Standard Deduction</span>
                        <strong className="metric-positive">-₹{taxCalculation.stdDeductionNew.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="regime-metric-row">
                        <span>Net Taxable Income</span>
                        <strong>₹{taxCalculation.taxableIncomeNew.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="regime-metric-row">
                        <span>Basic Tax</span>
                        <strong>₹{taxCalculation.basicTaxNew.toLocaleString('en-IN')}</strong>
                      </div>
                      {taxCalculation.rebate87A_New > 0 && (
                        <div className="regime-metric-row">
                          <span>Sec 87A Rebate &amp; Relief</span>
                          <strong className="metric-positive">-₹{taxCalculation.rebate87A_New.toLocaleString('en-IN')}</strong>
                        </div>
                      )}
                      <div className="regime-metric-row">
                        <span>Health &amp; Edu Cess (4%)</span>
                        <strong>₹{taxCalculation.cessNew.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    <div className="regime-final-box">
                      <span>Total Tax Payable</span>
                      <strong className="final-tax-figure">₹{taxCalculation.totalTaxNew.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className={`regime-tile ${taxCalculation.recommended === 'old' ? 'tile-winner' : ''}`}>
                    <div className="tile-title-row">
                      <span className="regime-name">Old Tax Regime</span>
                      {taxCalculation.recommended === 'old' && (
                        <span className="winner-chip">
                          <i className="fa-solid fa-check" aria-hidden="true"></i> Optimal
                        </span>
                      )}
                    </div>
                    <span className="regime-sec-tag">Chapter VI-A Deductions</span>

                    <div className="regime-metric-stack">
                      <div className="regime-metric-row">
                        <span>Gross Income</span>
                        <strong>₹{taxCalculation.grossTotal.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="regime-metric-row">
                        <span>Total Deductions</span>
                        <strong className="metric-positive">-₹{taxCalculation.totalOldDeductions.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="regime-metric-row">
                        <span>Net Taxable Income</span>
                        <strong>₹{taxCalculation.taxableIncomeOld.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="regime-metric-row">
                        <span>Basic Tax</span>
                        <strong>₹{taxCalculation.basicTaxOld.toLocaleString('en-IN')}</strong>
                      </div>
                      {taxCalculation.rebate87A_Old > 0 && (
                        <div className="regime-metric-row">
                          <span>Sec 87A Rebate</span>
                          <strong className="metric-positive">-₹{taxCalculation.rebate87A_Old.toLocaleString('en-IN')}</strong>
                        </div>
                      )}
                      <div className="regime-metric-row">
                        <span>Health &amp; Edu Cess (4%)</span>
                        <strong>₹{taxCalculation.cessOld.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    <div className="regime-final-box">
                      <span>Total Tax Payable</span>
                      <strong className="final-tax-figure">₹{taxCalculation.totalTaxOld.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="calc-action-bar">
                  <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                    <i className="fa-solid fa-print" aria-hidden="true"></i>
                    <span>Print Tax Sheet</span>
                  </button>
                  <button type="button" className="btn-calc-action share" onClick={handleShareWhatsApp}>
                    <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                    <span>Share Computation</span>
                  </button>
                  <Link to="/contact" className="btn-calc-action consult">
                    <i className="fa-solid fa-file-signature" aria-hidden="true"></i>
                    <span>File ITR with Advisor</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 2: GST INCLUSIVE / EXCLUSIVE CALCULATOR */}
          {activeTab === 'gst' && (
            <div className="calc-card-grid fade-in" role="tabpanel" aria-label="GST Calculator">
              <div className="calc-col-inputs">
                <div className="calc-box-card">
                  <div className="box-card-header">
                    <div className="header-icon-badge" aria-hidden="true">
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div className="box-card-titles">
                      <span className="box-kicker">GOODS &amp; SERVICES TAX</span>
                      <h2>GST Computational Engine</h2>
                    </div>
                  </div>

                  <div className="calc-form-body">
                    <div className="calc-segmented-tabs">
                      <button
                        type="button"
                        className={`seg-btn ${gstData.type === 'exclusive' ? 'active' : ''}`}
                        onClick={() => setGstData({ ...gstData, type: 'exclusive' })}
                      >
                        <i className="fa-solid fa-plus" aria-hidden="true"></i>
                        <span>GST Exclusive (Add GST)</span>
                      </button>
                      <button
                        type="button"
                        className={`seg-btn ${gstData.type === 'inclusive' ? 'active' : ''}`}
                        onClick={() => setGstData({ ...gstData, type: 'inclusive' })}
                      >
                        <i className="fa-solid fa-minus" aria-hidden="true"></i>
                        <span>GST Inclusive (Extract GST)</span>
                      </button>
                    </div>

                    <div className="calc-input-group">
                      <div className="input-label-row">
                        <label htmlFor="gst-amount">
                          {gstData.type === 'exclusive' ? 'Base Taxable Amount (₹)' : 'Total Invoiced Amount (with GST) (₹)'}
                        </label>
                        <span className="input-help-val">₹{Number(gstData.amount).toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        id="gst-amount"
                        type="number"
                        step="500"
                        min="0"
                        value={gstData.amount}
                        onChange={(e) => setGstData({ ...gstData, amount: e.target.value })}
                        className="calc-input-field"
                      />
                      <input
                        type="range"
                        min="1000"
                        max="1000000"
                        step="5000"
                        value={Math.min(1000000, Math.max(1000, Number(gstData.amount) || 1000))}
                        onChange={(e) => setGstData({ ...gstData, amount: e.target.value })}
                        className="calc-range-slider"
                        aria-label="GST amount slider"
                      />
                    </div>

                    <div className="calc-input-group">
                      <label>Select Statutory GST Slab Rate</label>
                      <div className="rate-button-grid">
                        {[5, 12, 18, 28].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            className={`rate-btn ${gstData.rate === rate ? 'active' : ''}`}
                            onClick={() => setGstData({ ...gstData, rate })}
                          >
                            <strong>{rate}%</strong>
                            <span>
                              {rate === 5 ? 'Essentials' : rate === 12 ? 'Processed' : rate === 18 ? 'Services & IT' : 'Luxury / Auto'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="calc-input-group">
                      <label>Transaction Jurisdiction</label>
                      <div className="calc-radio-group">
                        <label className="radio-pill">
                          <input
                            type="radio"
                            name="supplyType"
                            checked={gstData.supplyType === 'intra'}
                            onChange={() => setGstData({ ...gstData, supplyType: 'intra' })}
                          />
                          <span><strong>Intra-State (Within Gujarat):</strong> CGST (50%) + SGST (50%)</span>
                        </label>
                        <label className="radio-pill">
                          <input
                            type="radio"
                            name="supplyType"
                            checked={gstData.supplyType === 'inter'}
                            onChange={() => setGstData({ ...gstData, supplyType: 'inter' })}
                          />
                          <span><strong>Inter-State (Outside Gujarat):</strong> IGST (100%)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="calc-col-results">
                <div className="calc-box-card">
                  <div className="box-card-header">
                    <div className="header-icon-badge" aria-hidden="true">
                      <i className="fa-solid fa-file-invoice"></i>
                    </div>
                    <div className="box-card-titles">
                      <span className="box-kicker">INVOICE BREAKDOWN</span>
                      <h2>Tax &amp; Total Summary</h2>
                    </div>
                  </div>

                  <div className="gst-big-metric">
                    <span className="metric-label">Total Invoiced Amount</span>
                    <strong className="metric-value metric-gold">₹{gstCalculation.totalAmount.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="gst-breakdown-stack">
                    <div className="breakdown-row">
                      <span>Net Base / Taxable Amount</span>
                      <strong>₹{gstCalculation.baseAmount.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="breakdown-row">
                      <span>GST Applicable Rate</span>
                      <strong className="metric-positive">{gstData.rate}%</strong>
                    </div>

                    {gstData.supplyType === 'intra' ? (
                      <>
                        <div className="breakdown-row sub-row">
                          <span>Central GST (CGST - {gstData.rate / 2}%)</span>
                          <strong>₹{gstCalculation.cgst.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="breakdown-row sub-row">
                          <span>State GST (SGST - {gstData.rate / 2}%)</span>
                          <strong>₹{gstCalculation.sgst.toLocaleString('en-IN')}</strong>
                        </div>
                      </>
                    ) : (
                      <div className="breakdown-row sub-row">
                        <span>Integrated GST (IGST - {gstData.rate}%)</span>
                        <strong>₹{gstCalculation.igst.toLocaleString('en-IN')}</strong>
                      </div>
                    )}

                    <div className="breakdown-divider"></div>

                    <div className="breakdown-row total-highlight">
                      <span>Total GST Amount</span>
                      <strong className="metric-positive">₹{gstCalculation.gstAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className="gst-notice-advisory">
                    <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                    <p>
                      <strong>Input Tax Credit (ITC) Advisory:</strong> Ensure supplier invoices are declared in GSTR-1 to auto-populate in your GSTR-2B prior to claim. Discrepancies trigger ASMT-10 notices.
                    </p>
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
            </div>
          )}

          {/* TOOL 3: HRA EXEMPTION CALCULATOR */}
          {activeTab === 'hra' && (
            <div className="calc-card-grid fade-in" role="tabpanel" aria-label="HRA Exemption Calculator">
              <div className="calc-col-inputs">
                <div className="calc-box-card">
                  <div className="box-card-header">
                    <div className="header-icon-badge" aria-hidden="true">
                      <i className="fa-solid fa-house-chimney-user"></i>
                    </div>
                    <div className="box-card-titles">
                      <span className="box-kicker">SECTION 10(13A) &bull; RULE 2A</span>
                      <h2>House Rent Allowance Exemption</h2>
                    </div>
                  </div>

                  <div className="calc-form-body">
                    <div className="calc-row-split">
                      <div className="calc-input-group">
                        <label htmlFor="hra-basic">Annual Basic Salary (₹)</label>
                        <input
                          id="hra-basic"
                          type="number"
                          min="0"
                          value={hraData.basicSalary}
                          onChange={(e) => setHraData({ ...hraData, basicSalary: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                      <div className="calc-input-group">
                        <label htmlFor="hra-da">Dearness Allowance (DA) (₹)</label>
                        <input
                          id="hra-da"
                          type="number"
                          min="0"
                          value={hraData.da}
                          onChange={(e) => setHraData({ ...hraData, da: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                    </div>

                    <div className="calc-row-split">
                      <div className="calc-input-group">
                        <label htmlFor="hra-rec">Total HRA Received (from Form 16) (₹)</label>
                        <input
                          id="hra-rec"
                          type="number"
                          min="0"
                          value={hraData.hraReceived}
                          onChange={(e) => setHraData({ ...hraData, hraReceived: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                      <div className="calc-input-group">
                        <label htmlFor="hra-rent">Annual Rent Paid (₹)</label>
                        <input
                          id="hra-rent"
                          type="number"
                          min="0"
                          value={hraData.rentPaid}
                          onChange={(e) => setHraData({ ...hraData, rentPaid: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                    </div>

                    <div className="calc-input-group">
                      <label>Residential City Classification</label>
                      <div className="calc-radio-group">
                        <label className="radio-pill">
                          <input
                            type="radio"
                            name="metroCity"
                            checked={!hraData.isMetro}
                            onChange={() => setHraData({ ...hraData, isMetro: false })}
                          />
                          <span><strong>Non-Metro (Ahmedabad, Surat, Pune, etc.):</strong> 40% of Salary</span>
                        </label>
                        <label className="radio-pill">
                          <input
                            type="radio"
                            name="metroCity"
                            checked={hraData.isMetro}
                            onChange={() => setHraData({ ...hraData, isMetro: true })}
                          />
                          <span><strong>Metro (Delhi, Mumbai, Kolkata, Chennai):</strong> 50% of Salary</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="calc-col-results">
                <div className="calc-box-card">
                  <div className="box-card-header">
                    <div className="header-icon-badge" aria-hidden="true">
                      <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <div className="box-card-titles">
                      <span className="box-kicker">STATUTORY DISPENSATION</span>
                      <h2>HRA Tax Exemption Result</h2>
                    </div>
                  </div>

                  <div className="gst-big-metric">
                    <span className="metric-label">Tax-Free HRA Exemption</span>
                    <strong className="metric-value metric-positive">₹{hraCalculation.exemptHRA.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="gst-breakdown-stack">
                    <div className="breakdown-row">
                      <span>Rule 2A Condition 1: Actual HRA Received</span>
                      <strong>₹{hraCalculation.cond1.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="breakdown-row">
                      <span>Rule 2A Condition 2: {hraData.isMetro ? '50%' : '40%'} of Basic + DA</span>
                      <strong>₹{hraCalculation.cond2.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="breakdown-row">
                      <span>Rule 2A Condition 3: Rent Paid minus 10% Salary</span>
                      <strong>₹{hraCalculation.cond3.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="breakdown-divider"></div>

                    <div className="breakdown-row total-highlight">
                      <span>Taxable HRA Component</span>
                      <strong className="metric-gold">₹{hraCalculation.taxableHRA.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <p className="calc-sub-note">
                    <i className="fa-solid fa-circle-info" aria-hidden="true"></i> Section 10(13A) HRA exemption is applicable exclusively under the <strong>Old Tax Regime</strong>. Under Section 115BAC New Regime, full HRA is taxable.
                  </p>

                  <div className="calc-action-bar two-col">
                    <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                      <i className="fa-solid fa-print" aria-hidden="true"></i>
                      <span>Print Sheet</span>
                    </button>
                    <Link to="/contact" className="btn-calc-action consult">
                      <i className="fa-solid fa-user-tie" aria-hidden="true"></i>
                      <span>Verify Rent &amp; PAN Proof</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 4: ADVANCE TAX & 234C ESTIMATOR */}
          {activeTab === 'advance-tax' && (
            <div className="calc-card-grid fade-in" role="tabpanel" aria-label="Advance Tax Calculator">
              <div className="calc-col-inputs">
                <div className="calc-box-card">
                  <div className="box-card-header">
                    <div className="header-icon-badge" aria-hidden="true">
                      <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <div className="box-card-titles">
                      <span className="box-kicker">SECTIONS 208, 211, 234C &amp; 234B</span>
                      <h2>Advance Tax Schedule &amp; Interest</h2>
                    </div>
                  </div>

                  <div className="calc-form-body">
                    <div className="calc-row-split">
                      <div className="calc-input-group">
                        <label htmlFor="adv-total">Estimated Total Annual Tax Liability (₹)</label>
                        <input
                          id="adv-total"
                          type="number"
                          min="0"
                          value={advanceTaxData.estimatedTotalTax}
                          onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, estimatedTotalTax: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                      <div className="calc-input-group">
                        <label htmlFor="adv-tds">TDS / TCS Already Deducted (₹)</label>
                        <input
                          id="adv-tds"
                          type="number"
                          min="0"
                          value={advanceTaxData.tdsDeducted}
                          onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, tdsDeducted: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                    </div>

                    <div className="calc-deductions-header">
                      <i className="fa-solid fa-receipt" aria-hidden="true"></i>
                      <span>Paid Installments (Challan 280 Deposits)</span>
                    </div>

                    <div className="calc-row-split">
                      <div className="calc-input-group">
                        <label htmlFor="adv-q1">Paid by 15th June (Q1) (₹)</label>
                        <input
                          id="adv-q1"
                          type="number"
                          min="0"
                          value={advanceTaxData.q1Paid}
                          onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, q1Paid: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                      <div className="calc-input-group">
                        <label htmlFor="adv-q2">Paid 16 June – 15 Sept (Q2) (₹)</label>
                        <input
                          id="adv-q2"
                          type="number"
                          min="0"
                          value={advanceTaxData.q2Paid}
                          onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, q2Paid: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                    </div>

                    <div className="calc-row-split">
                      <div className="calc-input-group">
                        <label htmlFor="adv-q3">Paid 16 Sept – 15 Dec (Q3) (₹)</label>
                        <input
                          id="adv-q3"
                          type="number"
                          min="0"
                          value={advanceTaxData.q3Paid}
                          onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, q3Paid: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                      <div className="calc-input-group">
                        <label htmlFor="adv-q4">Paid 16 Dec – 15 March (Q4) (₹)</label>
                        <input
                          id="adv-q4"
                          type="number"
                          min="0"
                          value={advanceTaxData.q4Paid}
                          onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, q4Paid: e.target.value })}
                          className="calc-input-field"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="calc-col-results">
                <div className="calc-box-card">
                  <div className="box-card-header">
                    <div className="header-icon-badge" aria-hidden="true">
                      <i className="fa-solid fa-clock-rotate-left"></i>
                    </div>
                    <div className="box-card-titles">
                      <span className="box-kicker">CHALLAN 280 AUDIT</span>
                      <h2>Installment Compliance Audit</h2>
                    </div>
                  </div>

                  <div className="gst-big-metric">
                    <span className="metric-label">Net Advance Tax Liability</span>
                    <strong className="metric-value metric-gold">₹{advanceTaxCalculation.netTaxLiability.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="quarter-audit-grid">
                    <div className={`quarter-tile ${advanceTaxCalculation.q1Shortfall > 0 ? 'tile-shortfall' : 'tile-ok'}`}>
                      <div className="quarter-tag">15th JUNE (15%)</div>
                      <div className="quarter-val">Due: ₹{advanceTaxCalculation.q1Due.toLocaleString('en-IN')}</div>
                      <div className="quarter-status">
                        {advanceTaxCalculation.q1Shortfall > 0
                          ? `Shortfall: ₹${advanceTaxCalculation.q1Shortfall.toLocaleString('en-IN')}`
                          : '✓ Compliant'}
                      </div>
                    </div>

                    <div className={`quarter-tile ${advanceTaxCalculation.q2Shortfall > 0 ? 'tile-shortfall' : 'tile-ok'}`}>
                      <div className="quarter-tag">15th SEPT (45%)</div>
                      <div className="quarter-val">Due: ₹{advanceTaxCalculation.q2Due.toLocaleString('en-IN')}</div>
                      <div className="quarter-status">
                        {advanceTaxCalculation.q2Shortfall > 0
                          ? `Shortfall: ₹${advanceTaxCalculation.q2Shortfall.toLocaleString('en-IN')}`
                          : '✓ Compliant'}
                      </div>
                    </div>

                    <div className={`quarter-tile ${advanceTaxCalculation.q3Shortfall > 0 ? 'tile-shortfall' : 'tile-ok'}`}>
                      <div className="quarter-tag">15th DEC (75%)</div>
                      <div className="quarter-val">Due: ₹{advanceTaxCalculation.q3Due.toLocaleString('en-IN')}</div>
                      <div className="quarter-status">
                        {advanceTaxCalculation.q3Shortfall > 0
                          ? `Shortfall: ₹${advanceTaxCalculation.q3Shortfall.toLocaleString('en-IN')}`
                          : '✓ Compliant'}
                      </div>
                    </div>

                    <div className={`quarter-tile ${advanceTaxCalculation.q4Shortfall > 0 ? 'tile-shortfall' : 'tile-ok'}`}>
                      <div className="quarter-tag">15th MARCH (100%)</div>
                      <div className="quarter-val">Due: ₹{advanceTaxCalculation.q4Due.toLocaleString('en-IN')}</div>
                      <div className="quarter-status">
                        {advanceTaxCalculation.q4Shortfall > 0
                          ? `Shortfall: ₹${advanceTaxCalculation.q4Shortfall.toLocaleString('en-IN')}`
                          : '✓ Compliant'}
                      </div>
                    </div>
                  </div>

                  {advanceTaxCalculation.total234C > 0 && (
                    <div className="interest-warning-card">
                      <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
                      <div>
                        <strong>Estimated Sec 234C Interest Penalty: ₹{advanceTaxCalculation.total234C.toLocaleString('en-IN')}</strong>
                        <p>Clear balance before March 31 to prevent compounding 1% monthly interest under Section 234B.</p>
                      </div>
                    </div>
                  )}

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
            </div>
          )}

          {/* TOOL 5: TDS RATE CHART & INSTANT DEDUCTIONS */}
          {activeTab === 'tds' && (
            <div className="calc-card-grid fade-in" role="tabpanel" aria-label="TDS Withholding Calculator">
              <div className="calc-col-inputs">
                <div className="calc-box-card">
                  <div className="box-card-header">
                    <div className="header-icon-badge" aria-hidden="true">
                      <i className="fa-solid fa-file-invoice-dollar"></i>
                    </div>
                    <div className="box-card-titles">
                      <span className="box-kicker">TAX DEDUCTED AT SOURCE</span>
                      <h2>TDS Rate &amp; Challan 281 Engine</h2>
                    </div>
                  </div>

                  <div className="calc-form-body">
                    <div className="calc-input-group">
                      <label htmlFor="tds-amount">Invoice / Payment Amount (₹)</label>
                      <input
                        id="tds-amount"
                        type="number"
                        min="0"
                        value={tdsData.invoiceAmount}
                        onChange={(e) => setTdsData({ ...tdsData, invoiceAmount: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>

                    <div className="calc-input-group">
                      <label htmlFor="tds-sec">Nature of Payment / Statutory Section</label>
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

                    <div className="calc-checkbox-strip">
                      <label className="checkbox-pill">
                        <input
                          type="checkbox"
                          checked={tdsData.hasPan}
                          onChange={(e) => setTdsData({ ...tdsData, hasPan: e.target.checked })}
                        />
                        <span className="checkbox-label-text">
                          <strong>Vendor Furnished Valid PAN</strong> (Unchecked applies mandatory 20% under Sec 206AA)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="calc-col-results">
                <div className="calc-box-card">
                  <div className="box-card-header">
                    <div className="header-icon-badge" aria-hidden="true">
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div className="box-card-titles">
                      <span className="box-kicker">STATUTORY WITHHOLDING</span>
                      <h2>TDS Withholding Computation</h2>
                    </div>
                  </div>

                  <div className="gst-big-metric">
                    <span className="metric-label">TDS to Deduct &amp; Deposit</span>
                    <strong className="metric-value metric-positive">₹{tdsCalculation.tdsAmount.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="gst-breakdown-stack">
                    <div className="breakdown-row">
                      <span>Applicable Withholding Rate</span>
                      <strong>{tdsCalculation.rateToApply}% {tdsData.hasPan ? '' : '(Sec 206AA Higher Rate)'}</strong>
                    </div>
                    <div className="breakdown-row">
                      <span>Statutory Section Threshold</span>
                      <strong>₹{tdsCalculation.section.threshold.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="breakdown-row">
                      <span>Net Vendor Settlement Payable</span>
                      <strong className="metric-gold">₹{tdsCalculation.payableToVendor.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="breakdown-row">
                      <span>Challan 281 Deposit Deadline</span>
                      <strong>7th of Following Month</strong>
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
            </div>
          )}

          {/* TOOL 6: SIP & WEALTH COMPOUNDING */}
          {activeTab === 'sip' && (
            <div className="calc-card-grid fade-in" role="tabpanel" aria-label="SIP Compounding Engine">
              <div className="calc-col-inputs">
                <div className="calc-box-card">
                  <div className="box-card-header">
                    <div className="header-icon-badge" aria-hidden="true">
                      <i className="fa-solid fa-chart-line"></i>
                    </div>
                    <div className="box-card-titles">
                      <span className="box-kicker">FINANCIAL PLANNING</span>
                      <h2>SIP &amp; Wealth Growth Engine</h2>
                    </div>
                  </div>

                  <div className="calc-form-body">
                    <div className="calc-input-group">
                      <div className="input-label-row">
                        <label htmlFor="sip-amt">Monthly Systematic Investment (₹)</label>
                        <span className="input-help-val">₹{Number(sipData.monthlyInvestment).toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        id="sip-amt"
                        type="number"
                        step="1000"
                        min="500"
                        value={sipData.monthlyInvestment}
                        onChange={(e) => setSipData({ ...sipData, monthlyInvestment: e.target.value })}
                        className="calc-input-field"
                      />
                      <input
                        type="range"
                        min="1000"
                        max="200000"
                        step="1000"
                        value={Math.min(200000, Math.max(1000, Number(sipData.monthlyInvestment) || 1000))}
                        onChange={(e) => setSipData({ ...sipData, monthlyInvestment: e.target.value })}
                        className="calc-range-slider"
                        aria-label="Monthly SIP amount slider"
                      />
                    </div>

                    <div className="calc-input-group">
                      <div className="input-label-row">
                        <label htmlFor="sip-rate">Expected Annual Return Rate (%)</label>
                        <span className="input-help-val">{sipData.expectedReturn}%</span>
                      </div>
                      <input
                        id="sip-rate"
                        type="range"
                        min="6"
                        max="25"
                        step="0.5"
                        value={sipData.expectedReturn}
                        onChange={(e) => setSipData({ ...sipData, expectedReturn: e.target.value })}
                        className="calc-range-slider"
                      />
                    </div>

                    <div className="calc-input-group">
                      <div className="input-label-row">
                        <label htmlFor="sip-years">Investment Tenure (Years)</label>
                        <span className="input-help-val">{sipData.years} Years</span>
                      </div>
                      <input
                        id="sip-years"
                        type="range"
                        min="1"
                        max="35"
                        step="1"
                        value={sipData.years}
                        onChange={(e) => setSipData({ ...sipData, years: e.target.value })}
                        className="calc-range-slider"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="calc-col-results">
                <div className="calc-box-card">
                  <div className="box-card-header">
                    <div className="header-icon-badge" aria-hidden="true">
                      <i className="fa-solid fa-sack-dollar"></i>
                    </div>
                    <div className="box-card-titles">
                      <span className="box-kicker">MATURITY FORECAST</span>
                      <h2>Projected Corpus Value</h2>
                    </div>
                  </div>

                  <div className="gst-big-metric">
                    <span className="metric-label">Estimated Maturity Corpus</span>
                    <strong className="metric-value metric-positive">₹{sipCalculation.maturityValue.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="gst-breakdown-stack">
                    <div className="breakdown-row">
                      <span>Total Principal Invested</span>
                      <strong>₹{sipCalculation.totalInvested.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="breakdown-row">
                      <span>Estimated Capital Gains Growth</span>
                      <strong className="metric-positive">+₹{sipCalculation.totalGains.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="breakdown-row">
                      <span>Wealth Multiplier</span>
                      <strong className="metric-gold">{(sipCalculation.maturityValue / (sipCalculation.totalInvested || 1)).toFixed(2)}x</strong>
                    </div>
                  </div>

                  <div className="calc-action-bar two-col">
                    <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                      <i className="fa-solid fa-print" aria-hidden="true"></i>
                      <span>Print Plan</span>
                    </button>
                    <Link to="/contact" className="btn-calc-action consult">
                      <i className="fa-solid fa-user-tie" aria-hidden="true"></i>
                      <span>Consult on Tax-Saving ELSS</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            4. STATUTORY COMPUTATIONAL FAQS BENTO
            ============================================================ */}
        <section className="calc-faqs-section" aria-labelledby="calc-faqs-heading">
          <div className="calc-section-header">
            <div className="calc-eyebrow-badge secondary">
              <span className="badge-index-chip">02</span>
              <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
              <span>STATUTORY NUANCES &bull; INTERPRETATIONS</span>
            </div>
            <h2 id="calc-faqs-heading" className="calc-section-title">
              Key Statutory <span className="title-burnished-gold">Computation Notes</span>
            </h2>
            <p className="calc-section-sub">
              Important legislative provisions governing Old vs. New Tax Regimes, HRA declarations, and quarterly advance tax schedules.
            </p>
          </div>

          <div className="calc-faqs-grid">
            <article className="calc-faq-card">
              <span className="calc-faq-num">01</span>
              <h3>Can salaried taxpayers switch between Old and New Regimes annually?</h3>
              <p>
                Yes. Salaried individuals with income from Salary, House Property, and Other Sources (no business/profession income) can opt for whichever regime yields lower tax every year under Section 139(1).
              </p>
            </article>

            <article className="calc-faq-card">
              <span className="calc-faq-num">02</span>
              <h3>How does Section 87A Rebate &amp; Marginal Relief work in the New Regime?</h3>
              <p>
                Under revised Section 115BAC slabs (FY 2025-26 &amp; FY 2026-27), net taxable income up to ₹12 Lakhs incurs zero tax via Section 87A rebate (salaried zero tax up to ₹12.75L with ₹75K standard deduction), with marginal relief protecting small excesses above the threshold.
              </p>
            </article>

            <article className="calc-faq-card">
              <span className="calc-faq-num">03</span>
              <h3>Is landlord&apos;s PAN mandatory to claim Section 10(13A) HRA exemption?</h3>
              <p>
                Yes. Whenever aggregate annual rent paid exceeds ₹1,00,000 (above ₹8,333/month), quoting the landlord&apos;s valid PAN along with executed rent receipts is mandatory for Old Regime deduction claims.
              </p>
            </article>

            <article className="calc-faq-card">
              <span className="calc-faq-num">04</span>
              <h3>When do Section 234B &amp; 234C advance tax interest penalties trigger?</h3>
              <p>
                Under Section 208, if net estimated income tax after TDS exceeds ₹10,000 in a financial year, shortfalls across the four statutory deadlines (15 Jun, 15 Sep, 15 Dec, 15 Mar) attract 1% monthly interest.
              </p>
            </article>
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
