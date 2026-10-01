import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useSiteContext } from '../context/SiteContext';
import './Calculators.css';

const Calculators = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tool') || 'tax';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { settings } = useSiteContext();
  const navigate = useNavigate();

  const phone = settings?.phone || '+91 95109 84735';
  const cleanPhone = '919510984735';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tool: tabId });
  };

  useSEO({
    title: 'Statutory Tax & Financial Calculators | Shree Chamunda Associates',
    description: 'Free, ICAI-aligned Indian tax calculators: Old vs New Income Tax Regime comparison (FY 24-25 & 25-26), GST Inclusive/Exclusive, HRA Exemption, Advance Tax & TDS calculators.',
  });

  // =========================================================================
  // 1. INCOME TAX CALCULATOR STATE & LOGIC (OLD VS NEW REGIME)
  // =========================================================================
  const [taxData, setTaxData] = useState({
    fy: '2024-25', // '2024-25' or '2025-26'
    ageGroup: 'below60', // 'below60' | 'senior' | 'superSenior'
    isSalaried: true,
    grossSalary: 1200000,
    otherIncome: 50000,
    rentalIncome: 0,
    // Old Regime Deductions
    sec80C: 150000,
    sec80D_Self: 25000,
    sec80D_Parents: 25000,
    sec80CCD_NPS: 50000,
    homeLoanInterest: 0, // Sec 24(b)
    hraExemption: 0,
    otherDeductions: 0, // 80E, 80G, 80TTA
  });

  const taxCalculation = useMemo(() => {
    const grossTotal = Math.max(0, Number(taxData.grossSalary) + Number(taxData.otherIncome) + Number(taxData.rentalIncome));

    // Standard Deductions
    // Budget 2024 increased New Regime standard deduction to ₹75,000 for salaried
    const stdDeductionNew = taxData.isSalaried ? 75000 : 0;
    const stdDeductionOld = taxData.isSalaried ? 50000 : 0;

    // --- OLD REGIME COMPUTATION ---
    const capped80C = Math.min(150000, Math.max(0, Number(taxData.sec80C)));
    const capped80D_Self = Math.min(taxData.ageGroup !== 'below60' ? 50000 : 25000, Math.max(0, Number(taxData.sec80D_Self)));
    const capped80D_Parents = Math.min(50000, Math.max(0, Number(taxData.sec80D_Parents)));
    const cappedNPS = Math.min(50000, Math.max(0, Number(taxData.sec80CCD_NPS)));
    const cappedHomeLoan = Math.min(200000, Math.max(0, Number(taxData.homeLoanInterest)));
    const hraDed = Math.max(0, Number(taxData.hraExemption));
    const otherDed = Math.max(0, Number(taxData.otherDeductions));

    const totalOldDeductions = stdDeductionOld + capped80C + capped80D_Self + capped80D_Parents + cappedNPS + cappedHomeLoan + hraDed + otherDed;
    const taxableIncomeOld = Math.max(0, grossTotal - totalOldDeductions);

    // Old Regime Slabs
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

    // Section 87A Rebate for Old Regime (Taxable income up to 5 Lakhs)
    let rebate87A_Old = 0;
    if (taxableIncomeOld <= 500000) {
      rebate87A_Old = Math.min(basicTaxOld, 12500);
      basicTaxOld = Math.max(0, basicTaxOld - rebate87A_Old);
    }

    const cessOld = Math.round(basicTaxOld * 0.04);
    const totalTaxOld = Math.round(basicTaxOld + cessOld);

    // --- NEW REGIME COMPUTATION (Section 115BAC - Finance Act 2024 / 2025) ---
    const taxableIncomeNew = Math.max(0, grossTotal - stdDeductionNew);
    let basicTaxNew = 0;

    // Slabs:
    // 0 - 3,00,000 : Nil
    // 3,00,001 - 7,00,000 : 5%
    // 7,00,001 - 10,00,000 : 10%
    // 10,00,001 - 12,00,000 : 15%
    // 12,00,001 - 15,00,000 : 20%
    // > 15,00,000 : 30%
    if (taxableIncomeNew > 1500000) {
      basicTaxNew = (taxableIncomeNew - 1500000) * 0.30 + 60000 + 30000 + 30000 + 20000;
    } else if (taxableIncomeNew > 1200000) {
      basicTaxNew = (taxableIncomeNew - 1200000) * 0.20 + 30000 + 30000 + 20000;
    } else if (taxableIncomeNew > 1000000) {
      basicTaxNew = (taxableIncomeNew - 1000000) * 0.15 + 30000 + 20000;
    } else if (taxableIncomeNew > 700000) {
      basicTaxNew = (taxableIncomeNew - 700000) * 0.10 + 20000;
    } else if (taxableIncomeNew > 300000) {
      basicTaxNew = (taxableIncomeNew - 300000) * 0.05;
    }

    // Section 87A Rebate for New Regime (Taxable income up to 7 Lakhs, tax is completely waived)
    let rebate87A_New = 0;
    if (taxableIncomeNew <= 700000) {
      rebate87A_New = basicTaxNew;
      basicTaxNew = 0;
    } else if (taxableIncomeNew > 700000) {
      // Marginal Relief under Sec 87A for New Regime:
      // Tax payable cannot exceed the amount by which income exceeds 7,00,000
      const excessIncome = taxableIncomeNew - 700000;
      if (basicTaxNew > excessIncome) {
        rebate87A_New = basicTaxNew - excessIncome;
        basicTaxNew = excessIncome;
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
      basicTaxOld,
      basicTaxNew,
      rebate87A_Old,
      rebate87A_New,
      cessOld,
      cessNew,
      totalTaxOld,
      totalTaxNew,
      difference,
      recommended,
      savings,
    };
  }, [taxData]);

  // =========================================================================
  // 2. GST CALCULATOR STATE & LOGIC
  // =========================================================================
  const [gstData, setGstData] = useState({
    amount: 10000,
    rate: 18,
    type: 'exclusive', // 'exclusive' (add GST) | 'inclusive' (extract GST)
    supplyType: 'intra', // 'intra' (CGST + SGST) | 'inter' (IGST)
  });

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
  const [hraData, setHraData] = useState({
    basicSalary: 600000,
    da: 0,
    hraReceived: 240000,
    rentPaid: 180000,
    isMetro: false, // true = 50%, false = 40% (Ahmedabad, Pune, etc.)
  });

  const hraCalculation = useMemo(() => {
    const salary = Math.max(0, Number(hraData.basicSalary) + Number(hraData.da));
    const hraRec = Math.max(0, Number(hraData.hraReceived));
    const rent = Math.max(0, Number(hraData.rentPaid));
    const metroPercent = hraData.isMetro ? 0.50 : 0.40;

    // Condition 1: Actual HRA received
    const cond1 = hraRec;
    // Condition 2: 50% or 40% of Basic Salary + DA
    const cond2 = salary * metroPercent;
    // Condition 3: Rent paid minus 10% of salary
    const cond3 = Math.max(0, rent - (salary * 0.10));

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
  const [advanceTaxData, setAdvanceTaxData] = useState({
    estimatedTotalTax: 120000,
    tdsDeducted: 20000,
    q1Paid: 15000,
    q2Paid: 30000,
    q3Paid: 30000,
    q4Paid: 25000,
  });

  const advanceTaxCalculation = useMemo(() => {
    const netTaxLiability = Math.max(0, Number(advanceTaxData.estimatedTotalTax) - Number(advanceTaxData.tdsDeducted));
    const isApplicable = netTaxLiability >= 10000;

    // Statutory Quarterly Schedule
    const q1Due = Math.round(netTaxLiability * 0.15);
    const q2Due = Math.round(netTaxLiability * 0.45);
    const q3Due = Math.round(netTaxLiability * 0.75);
    const q4Due = Math.round(netTaxLiability * 1.00);

    const q1Paid = Number(advanceTaxData.q1Paid) || 0;
    const q2Paid = q1Paid + (Number(advanceTaxData.q2Paid) || 0);
    const q3Paid = q2Paid + (Number(advanceTaxData.q3Paid) || 0);
    const q4Paid = q3Paid + (Number(advanceTaxData.q4Paid) || 0);

    const q1Shortfall = Math.max(0, q1Due - q1Paid);
    const q2Shortfall = Math.max(0, q2Due - q2Paid);
    const q3Shortfall = Math.max(0, q3Due - q3Paid);
    const q4Shortfall = Math.max(0, q4Due - q4Paid);

    // Section 234C Estimated Interest (1% per month for 3 months on Q1, Q2, Q3 shortfall; 1 month on Q4)
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
  const TDS_SECTIONS = [
    { code: '194C_IND', name: '194C - Contractor (Individual/HUF)', rate: 1, threshold: 30000, desc: 'Single contract > ₹30,000 or aggregate > ₹1,00,000/yr' },
    { code: '194C_CORP', name: '194C - Contractor (Company/Firm)', rate: 2, threshold: 30000, desc: 'Subcontracting, advertising, freight & fabrication contracts' },
    { code: '194J_PROF', name: '194J - Professional Advisory / CA / Legal', rate: 10, threshold: 30000, desc: 'Chartered accountants, legal, medical, architectural counsel' },
    { code: '194J_TECH', name: '194J - Technical Services / Call Centers / BPO', rate: 2, threshold: 30000, desc: 'Software engineering & operational technical services' },
    { code: '194I_PROP', name: '194I - Rent on Land, Building & Furniture', rate: 10, threshold: 240000, desc: 'Annual commercial or residential office lease payments' },
    { code: '194I_PLANT', name: '194I - Rent on Plant, Machinery & Equipment', rate: 2, threshold: 240000, desc: 'Industrial equipment hire & factory lease' },
    { code: '194Q', name: '194Q - Purchase of Goods > ₹50 Lakhs', rate: 0.1, threshold: 5000000, desc: 'Buyer turnover > ₹10 Cr purchasing goods from Indian seller' },
    { code: '194H', name: '194H - Commission or Brokerage', rate: 2, threshold: 15000, desc: 'Real estate, channel partner & sales commissions' },
    { code: '194A', name: '194A - Interest Other Than Securities', rate: 10, threshold: 5000, desc: 'Unsecured business loans & private lending interest' },
  ];

  const [tdsData, setTdsData] = useState({
    invoiceAmount: 100000,
    selectedSection: '194J_PROF',
    hasPan: true,
  });

  const tdsCalculation = useMemo(() => {
    const sec = TDS_SECTIONS.find((s) => s.code === tdsData.selectedSection) || TDS_SECTIONS[2];
    const amount = Math.max(0, Number(tdsData.invoiceAmount) || 0);

    // Section 206AA: Higher rate of 20% if PAN is not furnished
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
  const [sipData, setSipData] = useState({
    monthlyInvestment: 10000,
    expectedReturn: 12,
    years: 10,
  });

  const sipCalculation = useMemo(() => {
    const P = Math.max(500, Number(sipData.monthlyInvestment) || 500);
    const annualRate = Math.max(1, Math.min(30, Number(sipData.expectedReturn) || 12));
    const n = Math.max(1, Math.min(40, Number(sipData.years) || 10)) * 12; // total months
    const i = annualRate / 12 / 100; // monthly rate

    // Formula: M = P * ((1 + i)^n - 1) / i * (1 + i)
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
  // PRINT / EXPORT ACTION
  // =========================================================================
  const handlePrintSummary = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    let msg = `*Shree Chamunda Associates - Tax Advisory Computation*\n`;
    if (activeTab === 'tax') {
      msg += `Gross Income: ₹${taxCalculation.grossTotal.toLocaleString('en-IN')}\n`;
      msg += `Old Regime Tax: ₹${taxCalculation.totalTaxOld.toLocaleString('en-IN')}\n`;
      msg += `New Regime Tax: ₹${taxCalculation.totalTaxNew.toLocaleString('en-IN')}\n`;
      msg += `Optimal Choice: ${taxCalculation.recommended === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}\n`;
      msg += `Estimated Savings: ₹${taxCalculation.savings.toLocaleString('en-IN')}\n`;
    } else if (activeTab === 'gst') {
      msg += `Base Amount: ₹${gstCalculation.baseAmount.toLocaleString('en-IN')}\n`;
      msg += `GST (${gstData.rate}%): ₹${gstCalculation.gstAmount.toLocaleString('en-IN')}\n`;
      msg += `Total Invoice: ₹${gstCalculation.totalAmount.toLocaleString('en-IN')}\n`;
    } else {
      msg += `I computed my statutory taxes using your online calculator and would like to consult a Chartered Accountant.`;
    }
    msg += `\nVerified by Shree Chamunda Associates (Chartered Tax Practice, Nikol, Ahmedabad)`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="calculators-page fade-in">
      {/* ============================================================
          1. EXECUTIVE HERO BANNER
          ============================================================ */}
      <section className="calc-hero" aria-labelledby="calc-hero-title">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="calc-hero-glow glow-gold" aria-hidden="true"></div>
        <div className="calc-hero-glow glow-blue" aria-hidden="true"></div>

        <div className="container">
          <div className="calc-hero-badge">
            <span className="live-dot pulse"></span>
            <i className="fas fa-calculator"></i>
            <span>ICAI-ALIGNED STATUTORY TOOLS &bull; FINANCE ACT 2024-25</span>
          </div>

          <h1 id="calc-hero-title">
            Chartered Tax &amp; <span className="hero-gradient-text">Financial Calculators</span>
          </h1>

          <p className="calc-hero-lead">
            Precision computational engines calibrated to Indian Direct &amp; Indirect Tax statutes.
            Compare Old vs. New Tax Regimes, calculate exact GST liability, and audit advance tax deadlines.
          </p>

          <div className="calc-trust-chips">
            <div className="trust-chip-item">
              <i className="fas fa-shield-halved text-gold"></i>
              <span>Sec 115BAC Marginal Relief Included</span>
            </div>
            <span className="chip-sep">&bull;</span>
            <div className="trust-chip-item">
              <i className="fas fa-check-double text-emerald"></i>
              <span>Zero Calculation Discrepancies</span>
            </div>
            <span className="chip-sep">&bull;</span>
            <div className="trust-chip-item">
              <i className="fas fa-file-contract text-blue"></i>
              <span>Statutory Compliance Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. CALCULATOR SUITE NAVIGATION TABS
          ============================================================ */}
      <div className="calc-nav-wrapper sticky-top">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="container calc-nav-container">
          <div className="calc-nav-tabs" role="tablist" aria-label="Tax & Compliance Tools">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'tax'}
              className={`calc-tab-btn ${activeTab === 'tax' ? 'active' : ''}`}
              onClick={() => handleTabChange('tax')}
            >
              <i className="fas fa-scale-balanced"></i>
              <span>Income Tax (Old vs New)</span>
              <span className="tab-pill-badge">FY 24-25</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'gst'}
              className={`calc-tab-btn ${activeTab === 'gst' ? 'active' : ''}`}
              onClick={() => handleTabChange('gst')}
            >
              <i className="fas fa-receipt"></i>
              <span>GST Calculator</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'hra'}
              className={`calc-tab-btn ${activeTab === 'hra' ? 'active' : ''}`}
              onClick={() => handleTabChange('hra')}
            >
              <i className="fas fa-house-chimney-user"></i>
              <span>HRA Exemption</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'advance-tax'}
              className={`calc-tab-btn ${activeTab === 'advance-tax' ? 'active' : ''}`}
              onClick={() => handleTabChange('advance-tax')}
            >
              <i className="fas fa-calendar-check"></i>
              <span>Advance Tax &amp; 234C</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'tds'}
              className={`calc-tab-btn ${activeTab === 'tds' ? 'active' : ''}`}
              onClick={() => handleTabChange('tds')}
            >
              <i className="fas fa-file-invoice-dollar"></i>
              <span>TDS Rate Chart &amp; Calc</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'sip'}
              className={`calc-tab-btn ${activeTab === 'sip' ? 'active' : ''}`}
              onClick={() => handleTabChange('sip')}
            >
              <i className="fas fa-chart-line"></i>
              <span>SIP &amp; Compounding</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          3. MAIN ACTIVE CALCULATOR WORKSPACE
          ============================================================ */}
      <main className="container calc-workspace">
        {/* ============================================================
            TOOL 1: INCOME TAX REGIME COMPARATOR
            ============================================================ */}
        {activeTab === 'tax' && (
          <div className="calc-card-grid fade-in">
            {/* Left Inputs Column */}
            <div className="calc-col-inputs">
              <div className="calc-box-card">
                <div className="box-card-header">
                  <div className="header-icon-badge">
                    <i className="fas fa-sliders"></i>
                  </div>
                  <div>
                    <span className="box-kicker">ASSESSMENT YEAR 2025-26</span>
                    <h2>Annual Income &amp; Deductions</h2>
                  </div>
                </div>

                <div className="calc-form-body">
                  {/* Assessment Year & Salaried Toggle */}
                  <div className="calc-row-split">
                    <div className="calc-input-group">
                      <label>Financial Year</label>
                      <select
                        value={taxData.fy}
                        onChange={(e) => setTaxData({ ...taxData, fy: e.target.value })}
                        className="calc-select"
                      >
                        <option value="2024-25">FY 2024-25 (AY 2025-26)</option>
                        <option value="2025-26">FY 2025-26 (AY 2026-27)</option>
                      </select>
                    </div>

                    <div className="calc-input-group">
                      <label>Taxpayer Age Category</label>
                      <select
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
                        <strong>Salaried Individual</strong> (Auto-applies ₹75,000 New / ₹50,000 Old Standard Deduction)
                      </span>
                    </label>
                  </div>

                  {/* Income Inputs */}
                  <div className="calc-input-group">
                    <div className="input-label-row">
                      <label>Gross Annual Salary / Business Profits (₹)</label>
                      <span className="input-help-val">₹{Number(taxData.grossSalary).toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="number"
                      step="10000"
                      min="0"
                      value={taxData.grossSalary}
                      onChange={(e) => setTaxData({ ...taxData, grossSalary: e.target.value })}
                      className="calc-input-field"
                      placeholder="e.g. 1200000"
                    />
                    <input
                      type="range"
                      min="300000"
                      max="5000000"
                      step="50000"
                      value={taxData.grossSalary}
                      onChange={(e) => setTaxData({ ...taxData, grossSalary: e.target.value })}
                      className="calc-range-slider"
                    />
                  </div>

                  <div className="calc-row-split">
                    <div className="calc-input-group">
                      <label>Other Income (FD Interest, Dividends) (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={taxData.otherIncome}
                        onChange={(e) => setTaxData({ ...taxData, otherIncome: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>Net Rental Income (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={taxData.rentalIncome}
                        onChange={(e) => setTaxData({ ...taxData, rentalIncome: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>
                  </div>

                  {/* Section Divider: Old Regime Deductions */}
                  <div className="calc-deductions-header">
                    <i className="fas fa-layer-group text-gold"></i>
                    <span>Old Regime Deductions (Chapter VI-A)</span>
                  </div>

                  <div className="calc-row-split">
                    <div className="calc-input-group">
                      <label>Section 80C (PPF, EPF, ELSS, LIC) [Max ₹1.5L]</label>
                      <input
                        type="number"
                        max="150000"
                        min="0"
                        value={taxData.sec80C}
                        onChange={(e) => setTaxData({ ...taxData, sec80C: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>

                    <div className="calc-input-group">
                      <label>Section 80CCD(1B) (NPS) [Max ₹50,000]</label>
                      <input
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
                      <label>Sec 80D Mediclaim (Self &amp; Family) [₹25K/₹50K]</label>
                      <input
                        type="number"
                        min="0"
                        value={taxData.sec80D_Self}
                        onChange={(e) => setTaxData({ ...taxData, sec80D_Self: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>

                    <div className="calc-input-group">
                      <label>Sec 80D Parents Mediclaim [Up to ₹50,000]</label>
                      <input
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
                      <label>Sec 24(b) Home Loan Interest [Max ₹2 Lakhs]</label>
                      <input
                        type="number"
                        max="200000"
                        min="0"
                        value={taxData.homeLoanInterest}
                        onChange={(e) => setTaxData({ ...taxData, homeLoanInterest: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>

                    <div className="calc-input-group">
                      <label>HRA Exemption Claimed (₹)</label>
                      <input
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
              {/* Verdict Trophy Card */}
              <div className={`calc-verdict-card ${taxCalculation.recommended === 'new' ? 'verdict-new' : 'verdict-old'}`}>
                <div className="verdict-header">
                  <div className="verdict-icon">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <div>
                    <span className="verdict-sub">STATUTORY RECOMMENDATION</span>
                    <h3>
                      {taxCalculation.recommended === 'new'
                        ? 'New Tax Regime is Optimal'
                        : 'Old Tax Regime is Optimal'}
                    </h3>
                  </div>
                </div>

                <div className="verdict-saving-box">
                  <span className="saving-label">Potential Legal Tax Saved:</span>
                  <strong className="saving-amount">₹{taxCalculation.savings.toLocaleString('en-IN')}</strong>
                </div>

                <p className="verdict-note">
                  {taxCalculation.recommended === 'new'
                    ? `Under Section 115BAC (Finance Act 2024), lower slab rates and the ₹75,000 standard deduction offer maximum post-tax cashflow.`
                    : `Due to significant 80C, 80D, home loan interest, and HRA deductions, Old Regime yields lower tax for your portfolio.`}
                </p>
              </div>

              {/* Side-by-Side Comparison Box */}
              <div className="calc-comparison-deck">
                {/* New Regime Card */}
                <div className={`regime-tile ${taxCalculation.recommended === 'new' ? 'tile-winner' : ''}`}>
                  <div className="tile-title-row">
                    <span className="regime-name">New Tax Regime</span>
                    {taxCalculation.recommended === 'new' && (
                      <span className="winner-chip"><i className="fas fa-check"></i> Recommended</span>
                    )}
                  </div>
                  <span className="regime-sec-tag">Section 115BAC (Default)</span>

                  <div className="regime-metric-stack">
                    <div className="regime-metric-row">
                      <span>Gross Income</span>
                      <strong>₹{taxCalculation.grossTotal.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="regime-metric-row">
                      <span>Standard Deduction</span>
                      <strong className="text-emerald">-₹{taxCalculation.stdDeductionNew.toLocaleString('en-IN')}</strong>
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
                      <div className="regime-metric-row text-emerald">
                        <span>Sec 87A Rebate &amp; Relief</span>
                        <strong>-₹{taxCalculation.rebate87A_New.toLocaleString('en-IN')}</strong>
                      </div>
                    )}
                    <div className="regime-metric-row">
                      <span>Health &amp; Edu Cess (4%)</span>
                      <strong>₹{taxCalculation.cessNew.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className="regime-final-box">
                    <span>Total Tax Payable:</span>
                    <strong className="final-tax-figure">₹{taxCalculation.totalTaxNew.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {/* Old Regime Card */}
                <div className={`regime-tile ${taxCalculation.recommended === 'old' ? 'tile-winner' : ''}`}>
                  <div className="tile-title-row">
                    <span className="regime-name">Old Tax Regime</span>
                    {taxCalculation.recommended === 'old' && (
                      <span className="winner-chip"><i className="fas fa-check"></i> Recommended</span>
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
                      <strong className="text-emerald">-₹{taxCalculation.totalOldDeductions.toLocaleString('en-IN')}</strong>
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
                      <div className="regime-metric-row text-emerald">
                        <span>Sec 87A Rebate</span>
                        <strong>-₹{taxCalculation.rebate87A_Old.toLocaleString('en-IN')}</strong>
                      </div>
                    )}
                    <div className="regime-metric-row">
                      <span>Health &amp; Edu Cess (4%)</span>
                      <strong>₹{taxCalculation.cessOld.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className="regime-final-box">
                    <span>Total Tax Payable:</span>
                    <strong className="final-tax-figure">₹{taxCalculation.totalTaxOld.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="calc-action-bar">
                <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                  <i className="fas fa-print"></i>
                  <span>Print Tax Sheet</span>
                </button>
                <button type="button" className="btn-calc-action share" onClick={handleShareWhatsApp}>
                  <i className="fab fa-whatsapp"></i>
                  <span>Send to WhatsApp</span>
                </button>
                <Link to="/contact" className="btn-calc-action consult">
                  <i className="fas fa-user-tie"></i>
                  <span>File ITR with CA</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TOOL 2: GST INCLUSIVE / EXCLUSIVE CALCULATOR
            ============================================================ */}
        {activeTab === 'gst' && (
          <div className="calc-card-grid fade-in">
            <div className="calc-col-inputs">
              <div className="calc-box-card">
                <div className="box-card-header">
                  <div className="header-icon-badge">
                    <i className="fas fa-receipt"></i>
                  </div>
                  <div>
                    <span className="box-kicker">GOODS &amp; SERVICES TAX</span>
                    <h2>GST Computational Engine</h2>
                  </div>
                </div>

                <div className="calc-form-body">
                  {/* Mode Selector */}
                  <div className="calc-segmented-tabs">
                    <button
                      type="button"
                      className={`seg-btn ${gstData.type === 'exclusive' ? 'active' : ''}`}
                      onClick={() => setGstData({ ...gstData, type: 'exclusive' })}
                    >
                      <i className="fas fa-plus"></i> GST Exclusive (Add GST to Base)
                    </button>
                    <button
                      type="button"
                      className={`seg-btn ${gstData.type === 'inclusive' ? 'active' : ''}`}
                      onClick={() => setGstData({ ...gstData, type: 'inclusive' })}
                    >
                      <i className="fas fa-minus"></i> GST Inclusive (Extract GST)
                    </button>
                  </div>

                  {/* Amount Input */}
                  <div className="calc-input-group">
                    <div className="input-label-row">
                      <label>
                        {gstData.type === 'exclusive' ? 'Base Invoiced Amount (₹)' : 'Total Invoiced Amount (with GST) (₹)'}
                      </label>
                      <span className="input-help-val">₹{Number(gstData.amount).toLocaleString('en-IN')}</span>
                    </div>
                    <input
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
                      value={gstData.amount}
                      onChange={(e) => setGstData({ ...gstData, amount: e.target.value })}
                      className="calc-range-slider"
                    />
                  </div>

                  {/* GST Rate Buttons */}
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

                  {/* Transaction Type */}
                  <div className="calc-input-group">
                    <label>Transaction Nature</label>
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

            {/* GST Output Column */}
            <div className="calc-col-results">
              <div className="calc-box-card gst-result-card">
                <div className="box-card-header">
                  <div className="header-icon-badge">
                    <i className="fas fa-file-invoice"></i>
                  </div>
                  <div>
                    <span className="box-kicker">INVOICE BREAKDOWN</span>
                    <h2>Tax &amp; Total Summary</h2>
                  </div>
                </div>

                <div className="gst-big-metric">
                  <span className="metric-label">Total Invoiced Amount:</span>
                  <strong className="metric-value text-gold">₹{gstCalculation.totalAmount.toLocaleString('en-IN')}</strong>
                </div>

                <div className="gst-breakdown-stack">
                  <div className="breakdown-row">
                    <span>Net Base / Taxable Amount</span>
                    <strong>₹{gstCalculation.baseAmount.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="breakdown-row">
                    <span>GST Applicable Rate</span>
                    <strong className="text-emerald">{gstData.rate}%</strong>
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
                    <strong className="text-emerald">₹{gstCalculation.gstAmount.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="gst-notice-advisory">
                  <i className="fas fa-shield-halved"></i>
                  <p>
                    <strong>Input Tax Credit (ITC) Advisory:</strong> Ensure vendor invoices are reported in GSTR-1 to appear in your GSTR-2B before claiming this credit. Mismatches trigger ASMT-10 notices.
                  </p>
                </div>

                <div className="calc-action-bar">
                  <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                    <i className="fas fa-print"></i> Print Voucher
                  </button>
                  <Link to="/services/gst-return-filing" className="btn-calc-action consult">
                    <i className="fas fa-file-invoice-dollar"></i> Book GST Filing Desk
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TOOL 3: HRA EXEMPTION CALCULATOR (SEC 10(13A))
            ============================================================ */}
        {activeTab === 'hra' && (
          <div className="calc-card-grid fade-in">
            <div className="calc-col-inputs">
              <div className="calc-box-card">
                <div className="box-card-header">
                  <div className="header-icon-badge">
                    <i className="fas fa-house-chimney-user"></i>
                  </div>
                  <div>
                    <span className="box-kicker">SECTION 10(13A) &bull; RULE 2A</span>
                    <h2>House Rent Allowance Exemption</h2>
                  </div>
                </div>

                <div className="calc-form-body">
                  <div className="calc-row-split">
                    <div className="calc-input-group">
                      <label>Annual Basic Salary (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={hraData.basicSalary}
                        onChange={(e) => setHraData({ ...hraData, basicSalary: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>Dearness Allowance (DA) (₹)</label>
                      <input
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
                      <label>Total HRA Received (from Form 16) (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={hraData.hraReceived}
                        onChange={(e) => setHraData({ ...hraData, hraReceived: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>Total Actual Rent Paid in Financial Year (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={hraData.rentPaid}
                        onChange={(e) => setHraData({ ...hraData, rentPaid: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>
                  </div>

                  <div className="calc-input-group">
                    <label>Residential City Location</label>
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
                  <div className="header-icon-badge">
                    <i className="fas fa-shield-check"></i>
                  </div>
                  <div>
                    <span className="box-kicker">STATUTORY DISPENSATION</span>
                    <h2>HRA Tax Exemption Result</h2>
                  </div>
                </div>

                <div className="verdict-saving-box text-center">
                  <span className="saving-label">Tax-Free HRA Exemption:</span>
                  <strong className="saving-amount text-emerald">₹{hraCalculation.exemptHRA.toLocaleString('en-IN')}</strong>
                </div>

                <div className="gst-breakdown-stack">
                  <div className="breakdown-row">
                    <span>Condition 1: Actual HRA Received</span>
                    <strong>₹{hraCalculation.cond1.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Condition 2: {hraData.isMetro ? '50%' : '40%'} of Salary</span>
                    <strong>₹{hraCalculation.cond2.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Condition 3: Rent Paid minus 10% of Salary</span>
                    <strong>₹{hraCalculation.cond3.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="breakdown-divider"></div>

                  <div className="breakdown-row total-highlight">
                    <span>Taxable HRA (Added to Salary)</span>
                    <strong className="text-gold">₹{hraCalculation.taxableHRA.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <p className="calc-sub-note">
                  <i className="fas fa-info-circle"></i> Note: Section 10(13A) HRA exemption is exclusively available under the <strong>Old Tax Regime</strong>. Under the New Tax Regime, full HRA is taxable.
                </p>

                <div className="calc-action-bar">
                  <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                    <i className="fas fa-print"></i> Print Sheet
                  </button>
                  <Link to="/contact" className="btn-calc-action consult">
                    <i className="fas fa-user-tie"></i> Consult on Rent Receipts &amp; PAN
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TOOL 4: ADVANCE TAX & INTEREST PENALTY CALCULATOR
            ============================================================ */}
        {activeTab === 'advance-tax' && (
          <div className="calc-card-grid fade-in">
            <div className="calc-col-inputs">
              <div className="calc-box-card">
                <div className="box-card-header">
                  <div className="header-icon-badge">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div>
                    <span className="box-kicker">SECTIONS 208, 211, 234C &amp; 234B</span>
                    <h2>Advance Tax Schedule &amp; Interest</h2>
                  </div>
                </div>

                <div className="calc-form-body">
                  <div className="calc-row-split">
                    <div className="calc-input-group">
                      <label>Estimated Total Annual Tax Liability (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={advanceTaxData.estimatedTotalTax}
                        onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, estimatedTotalTax: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>TDS / TCS Already Deducted (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={advanceTaxData.tdsDeducted}
                        onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, tdsDeducted: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>
                  </div>

                  <div className="calc-deductions-header">
                    <i className="fas fa-receipt text-gold"></i>
                    <span>Paid Installments (Enter amounts deposited via Challan 280)</span>
                  </div>

                  <div className="calc-row-split">
                    <div className="calc-input-group">
                      <label>Paid by 15th June (Q1) (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={advanceTaxData.q1Paid}
                        onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, q1Paid: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>Paid between 16 June &amp; 15 Sept (Q2) (₹)</label>
                      <input
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
                      <label>Paid between 16 Sept &amp; 15 Dec (Q3) (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={advanceTaxData.q3Paid}
                        onChange={(e) => setAdvanceTaxData({ ...advanceTaxData, q3Paid: e.target.value })}
                        className="calc-input-field"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>Paid between 16 Dec &amp; 15 March (Q4) (₹)</label>
                      <input
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
                  <div className="header-icon-badge">
                    <i className="fas fa-clock-rotate-left"></i>
                  </div>
                  <div>
                    <span className="box-kicker">CHALLAN 280 AUDIT</span>
                    <h2>Installment Compliance Audit</h2>
                  </div>
                </div>

                <div className="verdict-saving-box text-center">
                  <span className="saving-label">Net Advance Tax Obligation:</span>
                  <strong className="saving-amount">₹{advanceTaxCalculation.netTaxLiability.toLocaleString('en-IN')}</strong>
                </div>

                {/* 4 Quarter Tiles */}
                <div className="quarter-audit-grid">
                  <div className={`quarter-tile ${advanceTaxCalculation.q1Shortfall > 0 ? 'tile-shortfall' : 'tile-ok'}`}>
                    <div className="quarter-tag">15th JUNE (15%)</div>
                    <div className="quarter-val">Due: ₹{advanceTaxCalculation.q1Due.toLocaleString('en-IN')}</div>
                    <div className="quarter-status">
                      {advanceTaxCalculation.q1Shortfall > 0 ? `Shortfall: ₹${advanceTaxCalculation.q1Shortfall.toLocaleString('en-IN')}` : '✓ Compliant'}
                    </div>
                  </div>

                  <div className={`quarter-tile ${advanceTaxCalculation.q2Shortfall > 0 ? 'tile-shortfall' : 'tile-ok'}`}>
                    <div className="quarter-tag">15th SEPT (45%)</div>
                    <div className="quarter-val">Due: ₹{advanceTaxCalculation.q2Due.toLocaleString('en-IN')}</div>
                    <div className="quarter-status">
                      {advanceTaxCalculation.q2Shortfall > 0 ? `Shortfall: ₹${advanceTaxCalculation.q2Shortfall.toLocaleString('en-IN')}` : '✓ Compliant'}
                    </div>
                  </div>

                  <div className={`quarter-tile ${advanceTaxCalculation.q3Shortfall > 0 ? 'tile-shortfall' : 'tile-ok'}`}>
                    <div className="quarter-tag">15th DEC (75%)</div>
                    <div className="quarter-val">Due: ₹{advanceTaxCalculation.q3Due.toLocaleString('en-IN')}</div>
                    <div className="quarter-status">
                      {advanceTaxCalculation.q3Shortfall > 0 ? `Shortfall: ₹${advanceTaxCalculation.q3Shortfall.toLocaleString('en-IN')}` : '✓ Compliant'}
                    </div>
                  </div>

                  <div className={`quarter-tile ${advanceTaxCalculation.q4Shortfall > 0 ? 'tile-shortfall' : 'tile-ok'}`}>
                    <div className="quarter-tag">15th MARCH (100%)</div>
                    <div className="quarter-val">Due: ₹{advanceTaxCalculation.q4Due.toLocaleString('en-IN')}</div>
                    <div className="quarter-status">
                      {advanceTaxCalculation.q4Shortfall > 0 ? `Shortfall: ₹${advanceTaxCalculation.q4Shortfall.toLocaleString('en-IN')}` : '✓ Compliant'}
                    </div>
                  </div>
                </div>

                {advanceTaxCalculation.total234C > 0 && (
                  <div className="interest-warning-card">
                    <i className="fas fa-triangle-exclamation"></i>
                    <div>
                      <strong>Estimated Section 234C Interest Penalty: ₹{advanceTaxCalculation.total234C.toLocaleString('en-IN')}</strong>
                      <p>Avoid cascading 1% per month interest under Sec 234B by paying remaining balance before March 31.</p>
                    </div>
                  </div>
                )}

                <div className="calc-action-bar">
                  <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                    <i className="fas fa-print"></i> Print Audit
                  </button>
                  <Link to="/contact" className="btn-calc-action consult">
                    <i className="fas fa-shield-alt"></i> Generate Challan 280 with CA
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TOOL 5: TDS RATE CHART & INSTANT DEDUCTIONS
            ============================================================ */}
        {activeTab === 'tds' && (
          <div className="calc-card-grid fade-in">
            <div className="calc-col-inputs">
              <div className="calc-box-card">
                <div className="box-card-header">
                  <div className="header-icon-badge">
                    <i className="fas fa-file-invoice-dollar"></i>
                  </div>
                  <div>
                    <span className="box-kicker">TAX DEDUCTED AT SOURCE</span>
                    <h2>TDS Rate &amp; Challan 281 Calculator</h2>
                  </div>
                </div>

                <div className="calc-form-body">
                  <div className="calc-input-group">
                    <label>Invoice / Payment Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={tdsData.invoiceAmount}
                      onChange={(e) => setTdsData({ ...tdsData, invoiceAmount: e.target.value })}
                      className="calc-input-field"
                    />
                  </div>

                  <div className="calc-input-group">
                    <label>Select Nature of Payment / Statutory Section</label>
                    <select
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
                        <strong>Vendor Furnished Valid PAN</strong> (Unchecked = Mandatory 20% under Section 206AA)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="calc-col-results">
              <div className="calc-box-card">
                <div className="box-card-header">
                  <div className="header-icon-badge">
                    <i className="fas fa-receipt"></i>
                  </div>
                  <div>
                    <span className="box-kicker">STATUTORY WITHHOLDING</span>
                    <h2>TDS Withholding Computation</h2>
                  </div>
                </div>

                <div className="gst-big-metric">
                  <span className="metric-label">TDS to Deduct &amp; Deposit:</span>
                  <strong className="metric-value text-emerald">₹{tdsCalculation.tdsAmount.toLocaleString('en-IN')}</strong>
                </div>

                <div className="gst-breakdown-stack">
                  <div className="breakdown-row">
                    <span>Applicable Withholding Rate</span>
                    <strong>{tdsCalculation.rateToApply}% {tdsData.hasPan ? '' : '(Sec 206AA Penal Rate)'}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Statutory Threshold Limit</span>
                    <strong>₹{tdsCalculation.section.threshold.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Net Amount Payable to Vendor</span>
                    <strong className="text-gold">₹{tdsCalculation.payableToVendor.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Deposit Due Date</span>
                    <strong>7th of Subsequent Month (Challan 281)</strong>
                  </div>
                </div>

                <div className="calc-action-bar">
                  <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                    <i className="fas fa-print"></i> Print TDS Voucher
                  </button>
                  <Link to="/services/tds-return-filing" className="btn-calc-action consult">
                    <i className="fas fa-file-contract"></i> File 24Q / 26Q TDS Return
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TOOL 6: SIP & WEALTH COMPOUNDING
            ============================================================ */}
        {activeTab === 'sip' && (
          <div className="calc-card-grid fade-in">
            <div className="calc-col-inputs">
              <div className="calc-box-card">
                <div className="box-card-header">
                  <div className="header-icon-badge">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div>
                    <span className="box-kicker">FINANCIAL PLANNING</span>
                    <h2>SIP &amp; Wealth Growth Engine</h2>
                  </div>
                </div>

                <div className="calc-form-body">
                  <div className="calc-input-group">
                    <div className="input-label-row">
                      <label>Monthly Systematic Investment (₹)</label>
                      <span className="input-help-val">₹{Number(sipData.monthlyInvestment).toLocaleString('en-IN')}</span>
                    </div>
                    <input
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
                      value={sipData.monthlyInvestment}
                      onChange={(e) => setSipData({ ...sipData, monthlyInvestment: e.target.value })}
                      className="calc-range-slider"
                    />
                  </div>

                  <div className="calc-input-group">
                    <div className="input-label-row">
                      <label>Expected Annual Return Rate (%)</label>
                      <span className="input-help-val">{sipData.expectedReturn}%</span>
                    </div>
                    <input
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
                      <label>Investment Tenure (Years)</label>
                      <span className="input-help-val">{sipData.years} Years</span>
                    </div>
                    <input
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
                  <div className="header-icon-badge">
                    <i className="fas fa-sack-dollar"></i>
                  </div>
                  <div>
                    <span className="box-kicker">MATURITY FORECAST</span>
                    <h2>Projected Corpus Value</h2>
                  </div>
                </div>

                <div className="gst-big-metric">
                  <span className="metric-label">Estimated Maturity Corpus:</span>
                  <strong className="metric-value text-emerald">₹{sipCalculation.maturityValue.toLocaleString('en-IN')}</strong>
                </div>

                <div className="gst-breakdown-stack">
                  <div className="breakdown-row">
                    <span>Total Principal Invested</span>
                    <strong>₹{sipCalculation.totalInvested.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Estimated Capital Gains Growth</span>
                    <strong className="text-emerald">+₹{sipCalculation.totalGains.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Wealth Multiplier</span>
                    <strong className="text-gold">{(sipCalculation.maturityValue / (sipCalculation.totalInvested || 1)).toFixed(2)}x</strong>
                  </div>
                </div>

                <div className="calc-action-bar">
                  <button type="button" className="btn-calc-action print" onClick={handlePrintSummary}>
                    <i className="fas fa-print"></i> Print Plan
                  </button>
                  <Link to="/contact" className="btn-calc-action consult">
                    <i className="fas fa-user-tie"></i> Consult on Tax-Saving ELSS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================
          4. STATUTORY FAQS ON TAX REGIMES & COMPLIANCE
          ============================================================ */}
      <section className="container calc-faqs-section">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="calc-faqs-header text-center">
          <span className="about-eyebrow-tag">
            <i className="fas fa-circle-question"></i>
            <span>FREQUENTLY ASKED COMPUTATIONAL QUESTIONS</span>
          </span>
          <h2>Frequently Asked Tax Computation Questions</h2>
          <p>Key statutory nuances regarding New vs. Old Tax Regimes, HRA proof requirements, and GST reconciliation.</p>
        </div>

        <div className="calc-faqs-grid">
          <div className="calc-faq-card">
            <h4>Can salaried employees switch between Old and New Tax Regimes every year?</h4>
            <p>
              Yes. Salaried employees with income from Salary, House Property, and Other Sources (no business/profession income) can choose the more beneficial regime each assessment year while filing their ITR under Section 139(1).
            </p>
          </div>

          <div className="calc-faq-card">
            <h4>What is the Section 87A Marginal Relief in the New Regime?</h4>
            <p>
              Under Budget 2024, tax under New Regime is zero for income up to ₹7 Lakhs. If income marginally exceeds ₹7 Lakhs (say ₹7,15,000), marginal relief ensures the tax payable cannot exceed the amount by which income exceeds ₹7 Lakhs.
            </p>
          </div>

          <div className="calc-faq-card">
            <h4>Is landlord's PAN mandatory to claim Section 10(13A) HRA exemption?</h4>
            <p>
              Yes, if annual rent paid exceeds ₹1,00,000 (i.e. &gt; ₹8,333/month), quoting the landlord's PAN is mandatory on your employer declaration and ITR verification.
            </p>
          </div>

          <div className="calc-faq-card">
            <h4>When is Advance Tax mandatory for professionals and traders?</h4>
            <p>
              Under Section 208, if your estimated net direct tax liability after TDS exceeds ₹10,000 in a financial year, paying advance tax across 4 statutory installments is mandatory to prevent interest penalties under Section 234B and 234C.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. DIRECT SENIOR CA CONSULTATION CTA
          ============================================================ */}
      <section className="container calc-cta-section">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="calc-cta-card">
          <div className="calc-cta-content">
            <span className="calc-cta-badge">
              <span className="live-dot pulse"></span>
              <span>CHARTERED ADVISORY BENCH &bull; AHMEDABAD CHAMBERS</span>
            </span>
            <h2>Need an Authorized CA to Review Your Taxes?</h2>
            <p>
              Calculators provide instant estimates, but complex business deductions, capital gains indexation, and scrutiny notices require certified CA review. Connect directly with our Ahmedabad chambers.
            </p>
            <div className="calc-cta-actions">
              <Link to="/contact" className="btn-cta-primary">
                <i className="fas fa-calendar-check"></i>
                <span>Schedule 1-on-1 Review</span>
              </Link>
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello CA Team, I used your Tax Calculators and would like to consult with a Chartered Accountant.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-wa"
              >
                <i className="fab fa-whatsapp"></i>
                <span>WhatsApp Advisory Desk</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Calculators;
