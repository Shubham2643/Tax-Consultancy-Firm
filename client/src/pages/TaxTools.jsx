import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useSiteContext } from '../context/SiteContext';
import './TaxTools.css';

// Helper for Indian Currency formatting
const formatINR = (val) => {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  return '₹' + Math.round(val).toLocaleString('en-IN');
};

const getDenominationText = (val) => {
  const num = Number(val) || 0;
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2);
    return `₹${cr.endsWith('.00') ? cr.slice(0, -3) : cr} Cr`;
  }
  if (num >= 100000) {
    const lk = (num / 100000).toFixed(2);
    return `₹${lk.endsWith('.00') ? lk.slice(0, -3) : lk} Lakhs`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

const TaxTools = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTool = searchParams.get('tool') || 'regime';
  const [activeTab, setActiveTab] = useState(
    initialTool === 'gst-fee' ? 'gst' : initialTool === 'advance-tax' ? 'advance' : 'regime'
  );

  const { settings } = useSiteContext();
  const phone = settings?.phone || '+91 95109 84735';
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  useSEO({
    title: 'Interactive Tax Tools & Budget 2024 Slabs Hub | Shree Chamunda Associates',
    description:
      'Compare New vs Old Tax Regime under Budget 2024, compute GST Section 47 Late Fees & Section 50 Interest, and calculate statutory Advance Tax quarterly liability with senior Chartered Accountants.',
    url: typeof window !== 'undefined' ? window.location.href : '',
  });

  // Ensure seamless dark mode styling across header and body on Tax Tools Hub
  useEffect(() => {
    const root = document.documentElement;
    const prevTheme = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'dark');
    return () => {
      root.setAttribute('data-theme', prevTheme || 'light');
    };
  }, []);

  // -------------------------------------------------------------
  // TOOL 1: INCOME TAX REGIME COMPARATOR (BUDGET 2024 UPDATED)
  // -------------------------------------------------------------
  const [income, setIncome] = useState(1200000);
  const [ageGroup, setAgeGroup] = useState('below60'); // below60, 60to80, above80
  const [sec80C, setSec80C] = useState(150000);
  const [sec80D, setSec80D] = useState(25000);
  const [nps80CCD, setNps80CCD] = useState(50000);
  const [homeLoan24b, setHomeLoan24b] = useState(0);
  const [hraExempt, setHraExempt] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [deductionStrategy, setDeductionStrategy] = useState('standard'); // 'standard', 'homeowner', 'zero', 'custom'
  const [showCustomDeductions, setShowCustomDeductions] = useState(false);
  const [comparisonViewMode, setComparisonViewMode] = useState('tax'); // 'tax' or 'takeHome'

  const taxCalculation = useMemo(() => {
    const gross = Math.max(0, Number(income) || 0);

    // 1. OLD REGIME COMPUTATION
    const oldStdDeduction = 50000;
    const capped80C = Math.min(150000, Math.max(0, Number(sec80C) || 0));
    const capped80D = Math.min(100000, Math.max(0, Number(sec80D) || 0));
    const cappedNps = Math.min(50000, Math.max(0, Number(nps80CCD) || 0));
    const cappedHomeLoan = Math.min(200000, Math.max(0, Number(homeLoan24b) || 0));
    const validHra = Math.max(0, Number(hraExempt) || 0);
    const validOther = Math.max(0, Number(otherDeductions) || 0);

    const totalOldDeductions =
      oldStdDeduction + capped80C + capped80D + cappedNps + cappedHomeLoan + validHra + validOther;
    const taxableOld = Math.max(0, gross - totalOldDeductions);

    // Old Regime Slabs
    let oldExemptLimit = 250000;
    if (ageGroup === '60to80') oldExemptLimit = 300000;
    if (ageGroup === 'above80') oldExemptLimit = 500000;

    let baseOldTax = 0;
    if (taxableOld > 1000000) {
      baseOldTax = 112500 + (taxableOld - 1000000) * 0.3;
    } else if (taxableOld > 500000) {
      baseOldTax = (taxableOld - 500000) * 0.2 + (500000 - oldExemptLimit) * 0.05;
    } else if (taxableOld > oldExemptLimit) {
      baseOldTax = (taxableOld - oldExemptLimit) * 0.05;
    }

    // Section 87A Rebate for Old Regime (Taxable income up to ₹5,00,000)
    let oldRebate = 0;
    if (taxableOld <= 500000) {
      oldRebate = baseOldTax;
      baseOldTax = 0;
    }

    const oldCess = baseOldTax * 0.04;
    const finalOldTax = Math.round(baseOldTax + oldCess);

    // 2. NEW REGIME COMPUTATION (BUDGET 2024 REVISED SLABS)
    // Standard deduction increased from ₹50,000 to ₹75,000 for salaried assessees
    const newStdDeduction = 75000;
    const taxableNew = Math.max(0, gross - newStdDeduction);

    let baseNewTax = 0;
    if (taxableNew > 1500000) {
      baseNewTax = 150000 + (taxableNew - 1500000) * 0.3;
    } else if (taxableNew > 1200000) {
      baseNewTax = 90000 + (taxableNew - 1200000) * 0.2;
    } else if (taxableNew > 1000000) {
      baseNewTax = 60000 + (taxableNew - 1000000) * 0.15;
    } else if (taxableNew > 700000) {
      baseNewTax = 30000 + (taxableNew - 700000) * 0.1;
    } else if (taxableNew > 300000) {
      baseNewTax = (taxableNew - 300000) * 0.05;
    }

    // Section 87A Rebate for New Regime (Taxable income up to ₹7,00,000 = NIL tax)
    let newRebate = 0;
    if (taxableNew <= 700000) {
      newRebate = baseNewTax;
      baseNewTax = 0;
    } else if (taxableNew > 700000 && taxableNew <= 727777) {
      // Marginal Relief: Tax payable cannot exceed income exceeding ₹7,00,000
      const excessIncome = taxableNew - 700000;
      if (baseNewTax > excessIncome) {
        baseNewTax = excessIncome;
      }
    }

    const newCess = baseNewTax * 0.04;
    const finalNewTax = Math.round(baseNewTax + newCess);

    const diff = finalOldTax - finalNewTax;
    const recommended = diff > 0 ? 'NEW REGIME' : diff < 0 ? 'OLD REGIME' : 'EQUAL TAX';
    const savings = Math.abs(diff);

    const newEffectiveRate = gross > 0 ? ((finalNewTax / gross) * 100).toFixed(1) : '0.0';
    const oldEffectiveRate = gross > 0 ? ((finalOldTax / gross) * 100).toFixed(1) : '0.0';
    
    const newTakeHome = gross - finalNewTax;
    const oldTakeHome = gross - finalOldTax;
    const newMonthlyTakeHome = Math.round(newTakeHome / 12);
    const oldMonthlyTakeHome = Math.round(oldTakeHome / 12);
    const monthlySavings = Math.round(savings / 12);

    const newTakeHomePct = gross > 0 ? Math.max(0, Math.min(100, Math.round((newTakeHome / gross) * 100))) : 100;
    const oldTakeHomePct = gross > 0 ? Math.max(0, Math.min(100, Math.round((oldTakeHome / gross) * 100))) : 100;

    return {
      gross,
      taxableOld,
      totalOldDeductions,
      finalOldTax,
      oldRebate,
      taxableNew,
      newStdDeduction,
      finalNewTax,
      newRebate,
      diff,
      recommended,
      savings,
      oldTakeHome,
      newTakeHome,
      oldMonthlyTakeHome,
      newMonthlyTakeHome,
      monthlySavings,
      newEffectiveRate,
      oldEffectiveRate,
      newTakeHomePct,
      oldTakeHomePct,
      capped80C,
      capped80D,
      cappedNps,
      cappedHomeLoan,
    };
  }, [income, ageGroup, sec80C, sec80D, nps80CCD, homeLoan24b, hraExempt, otherDeductions]);

  // -------------------------------------------------------------
  // TOOL 2: GST LATE FEE & SECTION 50 INTEREST ESTIMATOR
  // -------------------------------------------------------------
  const [gstReturnType, setGstReturnType] = useState('GSTR-3B');
  const [isNilReturn, setIsNilReturn] = useState(false);
  const [netCashLiability, setNetCashLiability] = useState(45000);
  const [annualTurnover, setAnnualTurnover] = useState('upto1.5cr'); // upto1.5cr, 1.5to5cr, above5cr
  const [daysDelayed, setDaysDelayed] = useState(18);

  const gstPenaltyCalculation = useMemo(() => {
    const days = Math.max(0, Number(daysDelayed) || 0);
    const liability = isNilReturn ? 0 : Math.max(0, Number(netCashLiability) || 0);

    // Section 47 Late Fee
    let dailyRate = isNilReturn ? 20 : 50; // ₹20/day for Nil, ₹50/day for Regular
    let rawLateFee = days * dailyRate;

    // Statutory maximum cap
    let maxCap = 10000;
    if (isNilReturn) {
      maxCap = 500;
    } else {
      if (annualTurnover === 'upto1.5cr') maxCap = 2000;
      else if (annualTurnover === '1.5to5cr') maxCap = 5000;
      else maxCap = 10000;
    }

    const lateFee = Math.min(rawLateFee, maxCap);
    const cgstLateFee = Math.round(lateFee / 2);
    const sgstLateFee = Math.round(lateFee / 2);

    // Section 50(1) Interest (18% p.a. on delayed Net Cash Liability)
    const interest = Math.round((liability * 0.18 * days) / 365);
    const totalPayable = lateFee + interest;

    // Notice Risk Level
    let riskLevel = 'Low Risk — Standard Compliance Alert';
    let riskClass = 'risk-low';
    let riskIcon = 'fa-check-circle';
    if (days > 60 || liability > 100000) {
      riskLevel = 'Critical Exposure — DRC-01A / Sec 73 Notice Trigger';
      riskClass = 'risk-critical';
      riskIcon = 'fa-triangle-exclamation';
    } else if (days > 30 || liability > 50000) {
      riskLevel = 'Moderate Exposure — Automated GSTN Scrutiny Radar';
      riskClass = 'risk-moderate';
      riskIcon = 'fa-circle-exclamation';
    }

    return {
      days,
      dailyRate,
      rawLateFee,
      maxCap,
      lateFee,
      cgstLateFee,
      sgstLateFee,
      interest,
      totalPayable,
      riskLevel,
      riskClass,
      riskIcon,
    };
  }, [isNilReturn, netCashLiability, annualTurnover, daysDelayed]);

  // -------------------------------------------------------------
  // TOOL 3: ADVANCE TAX QUARTERLY SCHEDULE
  // -------------------------------------------------------------
  const [estimatedAnnualTax, setEstimatedAnnualTax] = useState(180000);
  const [tdsCredits, setTdsCredits] = useState(40000);

  const advanceTaxSchedule = useMemo(() => {
    const totalTax = Math.max(0, Number(estimatedAnnualTax) || 0);
    const tds = Math.max(0, Number(tdsCredits) || 0);
    const netAdvanceLiability = Math.max(0, totalTax - tds);
    const isMandatory = netAdvanceLiability >= 10000;

    const installments = [
      {
        quarter: 'Q1',
        due: '15 June',
        percentage: '15%',
        pctNum: 15,
        cumulativeDue: Math.round(netAdvanceLiability * 0.15),
        incrementalDue: Math.round(netAdvanceLiability * 0.15),
      },
      {
        quarter: 'Q2',
        due: '15 September',
        percentage: '45%',
        pctNum: 45,
        cumulativeDue: Math.round(netAdvanceLiability * 0.45),
        incrementalDue: Math.round(netAdvanceLiability * 0.3),
      },
      {
        quarter: 'Q3',
        due: '15 December',
        percentage: '75%',
        pctNum: 75,
        cumulativeDue: Math.round(netAdvanceLiability * 0.75),
        incrementalDue: Math.round(netAdvanceLiability * 0.3),
      },
      {
        quarter: 'Q4',
        due: '15 March',
        percentage: '100%',
        pctNum: 100,
        cumulativeDue: Math.round(netAdvanceLiability * 1.0),
        incrementalDue: Math.round(netAdvanceLiability * 0.25),
      },
    ];

    return {
      totalTax,
      tds,
      netAdvanceLiability,
      isMandatory,
      installments,
    };
  }, [estimatedAnnualTax, tdsCredits]);

  // Actions: Share & Consult
  const handleShareCalculation = () => {
    let msg = '';
    if (activeTab === 'regime') {
      msg = `*Tax Regime Calculation by Shree Chamunda Associates*\nGross Income: ${formatINR(taxCalculation.gross)}\nOld Regime Tax: ${formatINR(taxCalculation.finalOldTax)} (Monthly: ${formatINR(taxCalculation.oldMonthlyTakeHome)})\nNew Regime Tax: ${formatINR(taxCalculation.finalNewTax)} (Monthly: ${formatINR(taxCalculation.newMonthlyTakeHome)})\nRecommended: *${taxCalculation.recommended}* (Annual Savings: ${formatINR(taxCalculation.savings)})\n\nNeed assistance with ITR filing? Contact CA Desk: ${phone}`;
    } else if (activeTab === 'gst') {
      msg = `*GST Late Fee & Sec 50 Interest Estimate by Shree Chamunda Associates*\nReturn: ${gstReturnType}\nDays Delayed: ${gstPenaltyCalculation.days} days\nLate Fee: ${formatINR(gstPenaltyCalculation.lateFee)}\nInterest (18% p.a.): ${formatINR(gstPenaltyCalculation.interest)}\nTotal Exposure: *${formatINR(gstPenaltyCalculation.totalPayable)}*\n\nConsult CA Desk before notice: ${phone}`;
    } else {
      msg = `*Advance Tax Schedule by Shree Chamunda Associates*\nNet Advance Tax: ${formatINR(advanceTaxSchedule.netAdvanceLiability)}\nMandatory Advance Tax: ${advanceTaxSchedule.isMandatory ? 'Yes (>= ₹10,000)' : 'No'}\n\nPlan with CA Desk: ${phone}`;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleConsultDesk = () => {
    const text = `Hello CA Team at Shree Chamunda Associates, I ran statutory calculations on your Tax Tools Hub for ${
      activeTab === 'regime'
        ? `Income ${formatINR(income)} (Recommended: ${taxCalculation.recommended}, Savings: ${formatINR(taxCalculation.savings)})`
        : activeTab === 'gst'
        ? `GST ${gstReturnType} delay of ${daysDelayed} days (Total Exposure: ${formatINR(gstPenaltyCalculation.totalPayable)})`
        : `Advance Tax of ${formatINR(advanceTaxSchedule.netAdvanceLiability)}`
    }. I would like to book a consultation with a Senior Chartered Accountant.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Dynamic slider fill computations
  const incomeSliderPct = Math.min(
    100,
    Math.max(0, (((Math.min(5000000, Math.max(300000, income || 300000))) - 300000) / (5000000 - 300000)) * 100)
  );

  const daysSliderPct = Math.min(
    100,
    Math.max(0, (((Math.min(180, Math.max(1, daysDelayed || 1))) - 1) / (180 - 1)) * 100)
  );

  const advTaxSliderPct = Math.min(
    100,
    Math.max(0, (((Math.min(2000000, Math.max(10000, estimatedAnnualTax || 10000))) - 10000) / (2000000 - 10000)) * 100)
  );

  return (
    <div className="tax-tools-page fade-in">
      {/* Executive Midnight Hero Header */}
      <section className="tools-hero">
        <div className="tools-hero-glow glow-gold"></div>
        <div className="tools-hero-glow glow-blue"></div>
        <div className="tools-hero-glow glow-emerald"></div>
        <div className="container">
          <div className="tools-kicker-badge">
            <span className="live-dot pulse"></span>
            <i className="fas fa-shield-halved"></i>
            <span>Institutional Compliance Engine &bull; FY 2024-25 (AY 2025-26)</span>
          </div>

          <h1>
            Executive <span className="hero-gradient-text">Tax &amp; Statutory Tools</span> Hub
          </h1>

          <p className="tools-hero-lead">
            Calibrated with CBDT Budget 2024 notifications &amp; GSTN statutory rules. Real-time tax intelligence trusted by Gujarat's leading founders &amp; salaried executives.
          </p>

          {/* Institutional Trust Verification Row */}
          <div className="tools-hero-trust-row">
            <span className="hero-trust-chip">
              <i className="fas fa-check-circle"></i> Finance (No. 2) Act, 2024 Verified
            </span>
            <span className="hero-trust-chip">
              <i className="fas fa-check-circle"></i> AY 2025-26 CBDT Slabs &amp; 87A Relief
            </span>
            <span className="hero-trust-chip">
              <i className="fas fa-shield-halved"></i> 100% Free &amp; Confidential CA Advisory
            </span>
          </div>

          {/* High-End Segmented Navigation Dock */}
          <div className="tools-tab-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'regime'}
              className={`tool-tab-btn ${activeTab === 'regime' ? 'tab-active' : ''}`}
              onClick={() => {
                setActiveTab('regime');
                setSearchParams({ tool: 'regime' });
              }}
            >
              <div className="tab-btn-icon-circle">
                <i className="fas fa-scale-balanced"></i>
              </div>
              <div className="tab-label-stack">
                <span className="tab-title">Budget 2024 Regime Calculator</span>
                <span className="tab-sub">New vs. Old Tax Slabs &bull; AY 2025-26</span>
              </div>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'gst'}
              className={`tool-tab-btn ${activeTab === 'gst' ? 'tab-active' : ''}`}
              onClick={() => {
                setActiveTab('gst');
                setSearchParams({ tool: 'gst-fee' });
              }}
            >
              <div className="tab-btn-icon-circle">
                <i className="fas fa-file-invoice-dollar"></i>
              </div>
              <div className="tab-label-stack">
                <span className="tab-title">GST Late Fee &amp; Interest</span>
                <span className="tab-sub">Sec 47 &amp; 50 Estimator &bull; Risk Radar</span>
              </div>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'advance'}
              className={`tool-tab-btn ${activeTab === 'advance' ? 'tab-active' : ''}`}
              onClick={() => {
                setActiveTab('advance');
                setSearchParams({ tool: 'advance-tax' });
              }}
            >
              <div className="tab-btn-icon-circle">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="tab-label-stack">
                <span className="tab-title">Advance Tax Radar</span>
                <span className="tab-sub">Quarterly Calendar &bull; Section 208</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Main Tool Canvas */}
      <div className="container tools-canvas-container">
        {/* =======================================================
            TAB 1: BUDGET 2024 NEW VS OLD REGIME COMPARATOR
            ======================================================= */}
        {activeTab === 'regime' && (
          <div className="tool-content-grid">
            {/* Left Inputs Column (Streamlined Financial Configurator Panel) */}
            <div className="tool-col-inputs">
                {/* 1. Statutory Assessment Parameters & Income Cockpit */}
                <div className="statutory-assessment-studio">
                  {/* Studio Header */}
                  <div className="studio-card-header">
                    <div className="studio-header-titles">
                      <div className="studio-eyebrow-row">
                        <span className="studio-eyebrow">
                          <i className="fas fa-sliders text-gold"></i> STATUTORY PARAMETERS &bull; AY 2025-26
                        </span>
                        <span className="studio-tag-verified">
                          <i className="fas fa-shield-check text-emerald"></i> Budget 2024 Verified
                        </span>
                      </div>
                      <h2 className="studio-main-title">Annual Gross CTC &amp; Taxpayer Category</h2>
                      <span className="studio-subtitle">
                        Configure annual compensation and statutory age classification to compute Old vs New Regime
                      </span>
                    </div>

                    <div className="studio-header-badge-stack">
                      <span className="studio-slab-pill">
                        <i className="fas fa-layer-group"></i>
                        {income <= 750000
                          ? 'Zero-Tax Threshold (Sec 87A)'
                          : income <= 1000000
                          ? '10% Marginal Slab'
                          : income <= 1500000
                          ? '15%–20% Intermediate Slabs'
                          : income <= 5000000
                          ? '30% Peak Marginal Slab'
                          : 'High Net-Worth Surcharge Zone'}
                      </span>
                    </div>
                  </div>

                  {/* High-Impact 2-Part Income Cockpit */}
                  <div className="income-cockpit-grid">
                    {/* Left: Primary Currency Input & Quick Nudge Chips */}
                    <div className="income-display-tile">
                      <div className="cockpit-tile-head">
                        <span className="cockpit-tile-kicker">GROSS ANNUAL REVENUE / CTC</span>
                        <span className="cockpit-tile-hint">Type or drag slider</span>
                      </div>

                      <div className="cockpit-currency-hero">
                        <span className="cockpit-currency-symbol">₹</span>
                        <input
                          id="income-input"
                          type="text"
                          inputMode="numeric"
                          value={income ? Number(income).toLocaleString('en-IN') : ''}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, '');
                            setIncome(raw ? Math.min(100000000, Number(raw)) : 0);
                          }}
                          className="cockpit-amount-input"
                          aria-label="Annual Gross Income"
                          placeholder="0"
                        />
                      </div>

                      <div className="cockpit-sub-row">
                        <span className="cockpit-denomination-tag">
                          <i className="fas fa-tag text-gold"></i> {getDenominationText(income)}
                        </span>
                        <span className="cockpit-sub-divider">&bull;</span>
                        <span className="cockpit-status-note">
                          {income <= 750000 ? (
                            <span className="text-emerald">Budget 2024 Full ₹7.5L Rebate Active</span>
                          ) : (
                            <span>Assessment Year 2025-26</span>
                          )}
                        </span>
                      </div>

                      {/* Quick Nudge Micro-Chips */}
                      <div className="cockpit-nudge-chips">
                        <span className="nudge-chips-caption">Nudge CTC:</span>
                        <button
                          type="button"
                          className="nudge-chip"
                          onClick={() => setIncome((prev) => Math.max(300000, (Number(prev) || 0) - 50000))}
                          title="Decrease by ₹50,00,000"
                          aria-label="Decrease income by ₹50,000"
                        >
                          <i className="fas fa-minus"></i> 50k
                        </button>
                        <button
                          type="button"
                          className="nudge-chip"
                          onClick={() => setIncome((prev) => Math.min(50000000, (Number(prev) || 0) + 50000))}
                          title="Increase by ₹50,000"
                          aria-label="Increase income by ₹50,000"
                        >
                          <i className="fas fa-plus"></i> 50k
                        </button>
                        <button
                          type="button"
                          className="nudge-chip"
                          onClick={() => setIncome((prev) => Math.min(50000000, (Number(prev) || 0) + 100000))}
                          title="Increase by ₹1,00,000"
                          aria-label="Increase income by ₹1,00,000"
                        >
                          <i className="fas fa-plus"></i> 1L
                        </button>
                        <button
                          type="button"
                          className="nudge-chip"
                          onClick={() => setIncome((prev) => Math.min(50000000, (Number(prev) || 0) + 500000))}
                          title="Increase by ₹5,00,000"
                          aria-label="Increase income by ₹5,00,000"
                        >
                          <i className="fas fa-plus"></i> 5L
                        </button>
                      </div>
                    </div>

                    {/* Right: Operational Run-Rate & Statutory Metric Cards */}
                    <div className="income-intelligence-tile">
                      <div className="intel-metric-row">
                        <div className="intel-metric-item">
                          <span className="intel-metric-lbl">MONTHLY GROSS RUN-RATE</span>
                          <strong className="intel-metric-val">
                            {formatINR(Math.round(income / 12))}
                            <small>/mo</small>
                          </strong>
                          <span className="intel-metric-sub">Prorated 12-month base</span>
                        </div>

                        <div className="intel-metric-item">
                          <span className="intel-metric-lbl">SEC 16(ia) STD. DEDUCTION</span>
                          <strong className="intel-metric-val val-std-ded">
                            ₹75k <small className="intel-vs">New</small> / ₹50k <small className="intel-vs">Old</small>
                          </strong>
                          <span className="intel-metric-sub">Auto-credited for salaried</span>
                        </div>
                      </div>

                      <div className="intel-taxable-strip">
                        <span className="strip-lbl">Taxable Base (New Regime):</span>
                        <strong className="strip-amt">{formatINR(Math.max(0, income - 75000))}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Precision Interactive Range Slider with Clickable Milestones */}
                  <div className="cockpit-slider-module">
                    <div className="slider-track-wrap">
                      <input
                        type="range"
                        min="300000"
                        max="5000000"
                        step="25000"
                        value={Math.min(5000000, Math.max(300000, income || 300000))}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        className="cockpit-slider"
                        aria-label="Gross Annual Income Range Slider"
                        style={{
                          background: `linear-gradient(90deg, #d4af37 0%, #f59e0b ${incomeSliderPct}%, rgba(255, 255, 255, 0.08) ${incomeSliderPct}%)`,
                        }}
                      />
                    </div>

                    <div className="slider-milestone-ticks">
                      <button
                        type="button"
                        className={`milestone-tick-btn ${income === 300000 ? 'active' : ''}`}
                        onClick={() => setIncome(300000)}
                        title="Set to ₹3,00,000 Basic Exemption"
                      >
                        <span className="tick-dot"></span>
                        <strong className="tick-amt">₹3L</strong>
                        <span className="tick-desc">Basic Exemption</span>
                      </button>
                      <button
                        type="button"
                        className={`milestone-tick-btn tick-zero-tax ${income === 750000 ? 'active' : ''}`}
                        onClick={() => setIncome(750000)}
                        title="Set to ₹7,50,000 Zero-Tax Threshold"
                      >
                        <span className="tick-dot"></span>
                        <strong className="tick-amt">₹7.5L</strong>
                        <span className="tick-desc">Zero-Tax Rebate</span>
                      </button>
                      <button
                        type="button"
                        className={`milestone-tick-btn ${income === 1500000 ? 'active' : ''}`}
                        onClick={() => setIncome(1500000)}
                        title="Set to ₹15,00,000 Mid-Executive"
                      >
                        <span className="tick-dot"></span>
                        <strong className="tick-amt">₹15L</strong>
                        <span className="tick-desc">Mid-Executive</span>
                      </button>
                      <button
                        type="button"
                        className={`milestone-tick-btn ${income >= 5000000 ? 'active' : ''}`}
                        onClick={() => setIncome(5000000)}
                        title="Set to ₹50,00,000 HNW Surcharge Tier"
                      >
                        <span className="tick-dot"></span>
                        <strong className="tick-amt">₹50L+</strong>
                        <span className="tick-desc">HNW Surcharge</span>
                      </button>
                    </div>
                  </div>

                  {/* Popular Assessment Tiers (Sleek Horizontal Dock) */}
                  <div className="cockpit-preset-tiers">
                    <span className="tiers-dock-title">
                      <i className="fas fa-bolt text-gold"></i> POPULAR ASSESSMENT TIERS:
                    </span>
                    <div className="tiers-dock-chips" role="radiogroup" aria-label="Popular Assessment Tiers">
                      {[
                        { label: '₹7.5 Lakh', sub: 'Zero-Tax', val: 750000, isZeroTax: true },
                        { label: '₹10 Lakh', sub: 'Standard', val: 1000000 },
                        { label: '₹15 Lakh', sub: 'Mid-Tier', val: 1500000 },
                        { label: '₹25 Lakh', sub: 'Senior Exec', val: 2500000 },
                        { label: '₹50 Lakh', sub: 'HNW Bracket', val: 5000000 },
                      ].map((tier) => (
                        <button
                          key={tier.val}
                          type="button"
                          role="radio"
                          aria-checked={income === tier.val}
                          className={`tier-pill-btn ${income === tier.val ? 'active' : ''} ${tier.isZeroTax ? 'tier-zero-tax' : ''}`}
                          onClick={() => setIncome(tier.val)}
                        >
                          <span className="tier-pill-amt">{tier.label}</span>
                          <span className="tier-pill-sub">{tier.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Taxpayer Category (3-Way Segmented Control Bar) */}
                  <div className="cockpit-category-module">
                    <div className="category-header-row">
                      <div className="category-title-stack">
                        <span className="category-kicker">ASSESSEE STATUTORY CATEGORY</span>
                        <h4 className="category-title">Taxpayer Category &amp; Exemption Limit</h4>
                      </div>
                      <span className="category-guidance">
                        Determines Old Regime basic exemption threshold
                      </span>
                    </div>

                    <div className="category-segmented-dock" role="radiogroup" aria-label="Taxpayer Category">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={ageGroup === 'below60'}
                        className={`category-dock-btn ${ageGroup === 'below60' ? 'active' : ''}`}
                        onClick={() => setAgeGroup('below60')}
                      >
                        <div className="category-btn-icon">
                          <i className="fas fa-user"></i>
                        </div>
                        <div className="category-btn-text">
                          <span className="category-name">Individual / General</span>
                          <span className="category-meta">&lt; 60 Years &bull; ₹2.5L Exemption</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={ageGroup === '60to80'}
                        className={`category-dock-btn ${ageGroup === '60to80' ? 'active' : ''}`}
                        onClick={() => setAgeGroup('60to80')}
                      >
                        <div className="category-btn-icon">
                          <i className="fas fa-user-tie"></i>
                        </div>
                        <div className="category-btn-text">
                          <span className="category-name">Senior Citizen</span>
                          <span className="category-meta">60–80 Years &bull; ₹3.0L Exemption</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={ageGroup === 'above80'}
                        className={`category-dock-btn ${ageGroup === 'above80' ? 'active' : ''}`}
                        onClick={() => setAgeGroup('above80')}
                      >
                        <div className="category-btn-icon">
                          <i className="fas fa-medal"></i>
                        </div>
                        <div className="category-btn-text">
                          <span className="category-name">Super Senior Citizen</span>
                          <span className="category-meta">&gt; 80 Years &bull; ₹5.0L Exemption</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Chapter VI-A Deductions Studio (FinTech Direct Matrix) */}
                <div className="deductions-studio-card">
                  {/* Header Row with Total Claimed Intelligence */}
                  <div className="deductions-studio-header">
                    <div className="deductions-header-text">
                      <div className="deductions-eyebrow-row">
                        <span className="deductions-eyebrow">
                          <i className="fas fa-shield-halved text-gold"></i> CHAPTER VI-A OPTIMIZER
                        </span>
                        <span className="deductions-regime-tag">Old Tax Regime Only</span>
                      </div>
                      <h3 className="deductions-title">Statutory Deductions &amp; Exemptions</h3>
                      <span className="deductions-desc">
                        Directly configure statutory investments below or pick a pre-calibrated scenario
                      </span>
                    </div>

                    <div className="claimed-total-chip">
                      <span className="claimed-chip-label">TOTAL OLD DEDUCTIONS</span>
                      <div className="claimed-chip-amount-wrap">
                        <strong className="claimed-chip-amount">
                          {formatINR(taxCalculation.totalOldDeductions)}
                        </strong>
                      </div>
                      <span className="claimed-chip-sub">Includes ₹50,000 Sec 16(ia) Std. Ded.</span>
                    </div>
                  </div>

                  {/* Real-time Math Breakdown Ribbon */}
                  <div className="deductions-math-ribbon">
                    <div className="math-ribbon-title">
                      <i className="fas fa-calculator text-gold"></i>
                      <span>CLAIM BREAKDOWN:</span>
                    </div>
                    <div className="math-ribbon-items">
                      <span className="math-pill math-pill-std" title="Standard Deduction under Section 16(ia)">
                        ₹50k Std. Ded.
                      </span>
                      <span className="math-op">+</span>
                      <span className={`math-pill ${sec80C > 0 ? 'math-pill-active' : ''}`} title="Section 80C">
                        80C: {formatINR(sec80C)}
                      </span>
                      <span className="math-op">+</span>
                      <span className={`math-pill ${sec80D > 0 ? 'math-pill-active' : ''}`} title="Section 80D Health">
                        80D: {formatINR(sec80D)}
                      </span>
                      <span className="math-op">+</span>
                      <span className={`math-pill ${nps80CCD > 0 ? 'math-pill-active' : ''}`} title="Section 80CCD(1B) NPS">
                        NPS: {formatINR(nps80CCD)}
                      </span>
                      <span className="math-op">+</span>
                      <span className={`math-pill ${homeLoan24b > 0 ? 'math-pill-active' : ''}`} title="Section 24(b) Home Loan">
                        Home: {formatINR(homeLoan24b)}
                      </span>
                      {(hraExempt > 0 || otherDeductions > 0) && (
                        <>
                          <span className="math-op">+</span>
                          <span className="math-pill math-pill-active" title="HRA & Other Exemptions">
                            Other: {formatINR(Number(hraExempt) + Number(otherDeductions))}
                          </span>
                        </>
                      )}
                      <span className="math-op math-equals">=</span>
                      <span className="math-pill math-pill-total">{formatINR(taxCalculation.totalOldDeductions)}</span>
                    </div>
                  </div>

                  {/* Sleek Scenario Presets Bar (Pill Dock) */}
                  <div className="deductions-scenario-dock">
                    <div className="scenario-dock-label">
                      <i className="fas fa-bolt text-gold"></i>
                      <span>PRESET PROFILES:</span>
                    </div>
                    <div className="scenario-dock-buttons" role="radiogroup" aria-label="Deduction Profiles">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={deductionStrategy === 'standard'}
                        className={`scenario-btn ${deductionStrategy === 'standard' ? 'active' : ''}`}
                        onClick={() => {
                          setDeductionStrategy('standard');
                          setSec80C(150000);
                          setSec80D(25000);
                          setNps80CCD(50000);
                          setHomeLoan24b(0);
                          setHraExempt(0);
                          setOtherDeductions(0);
                        }}
                      >
                        <i className="fas fa-briefcase"></i>
                        <span className="scenario-name">Salaried Standard</span>
                        <span className="scenario-val">₹2.25L</span>
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={deductionStrategy === 'homeowner'}
                        className={`scenario-btn ${deductionStrategy === 'homeowner' ? 'active' : ''}`}
                        onClick={() => {
                          setDeductionStrategy('homeowner');
                          setSec80C(150000);
                          setSec80D(25000);
                          setNps80CCD(50000);
                          setHomeLoan24b(200000);
                          setHraExempt(0);
                          setOtherDeductions(0);
                        }}
                      >
                        <i className="fas fa-house"></i>
                        <span className="scenario-name">Homeowner Max</span>
                        <span className="scenario-val">₹4.25L</span>
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={deductionStrategy === 'zero'}
                        className={`scenario-btn ${deductionStrategy === 'zero' ? 'active' : ''}`}
                        onClick={() => {
                          setDeductionStrategy('zero');
                          setSec80C(0);
                          setSec80D(0);
                          setNps80CCD(0);
                          setHomeLoan24b(0);
                          setHraExempt(0);
                          setOtherDeductions(0);
                        }}
                      >
                        <i className="fas fa-ban"></i>
                        <span className="scenario-name">Nil Deductions</span>
                        <span className="scenario-val">₹0</span>
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={deductionStrategy === 'custom'}
                        className={`scenario-btn ${deductionStrategy === 'custom' ? 'active' : ''}`}
                        onClick={() => setDeductionStrategy('custom')}
                      >
                        <i className="fas fa-sliders"></i>
                        <span className="scenario-name">Custom Mix</span>
                        <span className="scenario-val">Itemized</span>
                      </button>
                    </div>
                  </div>

                  {/* Direct 4-Pillar FinTech Deduction Grid (Always Visible) */}
                  <div className="deduction-matrix-grid">
                    {/* Tile 1: Section 80C */}
                    <div className={`deduction-tile ${sec80C > 0 ? 'has-value' : ''}`}>
                      <div className="tile-head">
                        <div className="tile-title-group">
                          <div className="tile-icon-box">
                            <i className="fas fa-wallet text-gold"></i>
                          </div>
                          <div>
                            <h4 className="tile-title">Section 80C</h4>
                            <span className="tile-sub">EPF, PPF, ELSS, Life Ins., School Fees</span>
                          </div>
                        </div>
                        <span className="tile-cap-tag">Cap: ₹1.5L</span>
                      </div>

                      <div className="tile-input-row">
                        <div className="tile-input-wrap">
                          <span className="tile-curr">₹</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={sec80C ? Number(sec80C).toLocaleString('en-IN') : ''}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              setSec80C(raw ? Math.min(150000, Number(raw)) : 0);
                              setDeductionStrategy('custom');
                            }}
                            className="tile-input"
                            placeholder="0"
                            aria-label="Section 80C Deduction Amount"
                          />
                        </div>
                        <div className="tile-cap-indicator">
                          <span className="cap-progress-pct">
                            {Math.round(((sec80C || 0) / 150000) * 100)}%
                          </span>
                          <div className="cap-mini-track">
                            <div
                              className={`cap-mini-fill ${sec80C >= 150000 ? 'fill-max' : ''}`}
                              style={{ width: `${Math.min(100, Math.round(((sec80C || 0) / 150000) * 100))}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="tile-quick-chips">
                        <button
                          type="button"
                          className={`chip-btn ${sec80C === 150000 ? 'active' : ''}`}
                          onClick={() => { setSec80C(150000); setDeductionStrategy('custom'); }}
                        >
                          ₹1.5L Max
                        </button>
                        <button
                          type="button"
                          className={`chip-btn ${sec80C === 100000 ? 'active' : ''}`}
                          onClick={() => { setSec80C(100000); setDeductionStrategy('custom'); }}
                        >
                          ₹1.0L
                        </button>
                        <button
                          type="button"
                          className={`chip-btn ${sec80C === 50000 ? 'active' : ''}`}
                          onClick={() => { setSec80C(50000); setDeductionStrategy('custom'); }}
                        >
                          ₹50k
                        </button>
                        <button
                          type="button"
                          className={`chip-btn chip-clear ${sec80C === 0 ? 'active' : ''}`}
                          onClick={() => { setSec80C(0); setDeductionStrategy('custom'); }}
                        >
                          Nil
                        </button>
                      </div>
                    </div>

                    {/* Tile 2: Section 80D Health */}
                    <div className={`deduction-tile ${sec80D > 0 ? 'has-value' : ''}`}>
                      <div className="tile-head">
                        <div className="tile-title-group">
                          <div className="tile-icon-box">
                            <i className="fas fa-heart-pulse text-gold"></i>
                          </div>
                          <div>
                            <h4 className="tile-title">Section 80D Health</h4>
                            <span className="tile-sub">Self, Spouse, Children &amp; Parents Mediclaim</span>
                          </div>
                        </div>
                        <span className="tile-cap-tag">Cap: ₹1.0L</span>
                      </div>

                      <div className="tile-input-row">
                        <div className="tile-input-wrap">
                          <span className="tile-curr">₹</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={sec80D ? Number(sec80D).toLocaleString('en-IN') : ''}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              setSec80D(raw ? Math.min(100000, Number(raw)) : 0);
                              setDeductionStrategy('custom');
                            }}
                            className="tile-input"
                            placeholder="0"
                            aria-label="Section 80D Health Insurance Deduction Amount"
                          />
                        </div>
                        <div className="tile-cap-indicator">
                          <span className="cap-progress-pct">
                            {Math.round(((sec80D || 0) / 100000) * 100)}%
                          </span>
                          <div className="cap-mini-track">
                            <div
                              className={`cap-mini-fill ${sec80D >= 100000 ? 'fill-max' : ''}`}
                              style={{ width: `${Math.min(100, Math.round(((sec80D || 0) / 100000) * 100))}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="tile-quick-chips">
                        <button
                          type="button"
                          className={`chip-btn ${sec80D === 25000 ? 'active' : ''}`}
                          onClick={() => { setSec80D(25000); setDeductionStrategy('custom'); }}
                        >
                          ₹25k (Self)
                        </button>
                        <button
                          type="button"
                          className={`chip-btn ${sec80D === 50000 ? 'active' : ''}`}
                          onClick={() => { setSec80D(50000); setDeductionStrategy('custom'); }}
                        >
                          ₹50k (+Parents)
                        </button>
                        <button
                          type="button"
                          className={`chip-btn ${sec80D === 100000 ? 'active' : ''}`}
                          onClick={() => { setSec80D(100000); setDeductionStrategy('custom'); }}
                        >
                          ₹1.0L Max
                        </button>
                        <button
                          type="button"
                          className={`chip-btn chip-clear ${sec80D === 0 ? 'active' : ''}`}
                          onClick={() => { setSec80D(0); setDeductionStrategy('custom'); }}
                        >
                          Nil
                        </button>
                      </div>
                    </div>

                    {/* Tile 3: NPS 80CCD(1B) */}
                    <div className={`deduction-tile ${nps80CCD > 0 ? 'has-value' : ''}`}>
                      <div className="tile-head">
                        <div className="tile-title-group">
                          <div className="tile-icon-box">
                            <i className="fas fa-landmark text-gold"></i>
                          </div>
                          <div>
                            <h4 className="tile-title">NPS 80CCD(1B)</h4>
                            <span className="tile-sub">National Pension System (Over &amp; above 80C)</span>
                          </div>
                        </div>
                        <span className="tile-cap-tag">Cap: ₹50k</span>
                      </div>

                      <div className="tile-input-row">
                        <div className="tile-input-wrap">
                          <span className="tile-curr">₹</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={nps80CCD ? Number(nps80CCD).toLocaleString('en-IN') : ''}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              setNps80CCD(raw ? Math.min(50000, Number(raw)) : 0);
                              setDeductionStrategy('custom');
                            }}
                            className="tile-input"
                            placeholder="0"
                            aria-label="NPS Section 80CCD 1B Deduction Amount"
                          />
                        </div>
                        <div className="tile-cap-indicator">
                          <span className="cap-progress-pct">
                            {Math.round(((nps80CCD || 0) / 50000) * 100)}%
                          </span>
                          <div className="cap-mini-track">
                            <div
                              className={`cap-mini-fill ${nps80CCD >= 50000 ? 'fill-max' : ''}`}
                              style={{ width: `${Math.min(100, Math.round(((nps80CCD || 0) / 50000) * 100))}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="tile-quick-chips">
                        <button
                          type="button"
                          className={`chip-btn ${nps80CCD === 50000 ? 'active' : ''}`}
                          onClick={() => { setNps80CCD(50000); setDeductionStrategy('custom'); }}
                        >
                          ₹50k Max
                        </button>
                        <button
                          type="button"
                          className={`chip-btn ${nps80CCD === 25000 ? 'active' : ''}`}
                          onClick={() => { setNps80CCD(25000); setDeductionStrategy('custom'); }}
                        >
                          ₹25k
                        </button>
                        <button
                          type="button"
                          className={`chip-btn chip-clear ${nps80CCD === 0 ? 'active' : ''}`}
                          onClick={() => { setNps80CCD(0); setDeductionStrategy('custom'); }}
                        >
                          Nil
                        </button>
                      </div>
                    </div>

                    {/* Tile 4: Sec 24(b) Home Loan */}
                    <div className={`deduction-tile ${homeLoan24b > 0 ? 'has-value' : ''}`}>
                      <div className="tile-head">
                        <div className="tile-title-group">
                          <div className="tile-icon-box">
                            <i className="fas fa-house-chimney text-gold"></i>
                          </div>
                          <div>
                            <h4 className="tile-title">Sec 24(b) Home Loan</h4>
                            <span className="tile-sub">Interest on Housing Loan (Self-Occupied)</span>
                          </div>
                        </div>
                        <span className="tile-cap-tag">Cap: ₹2.0L</span>
                      </div>

                      <div className="tile-input-row">
                        <div className="tile-input-wrap">
                          <span className="tile-curr">₹</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={homeLoan24b ? Number(homeLoan24b).toLocaleString('en-IN') : ''}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              setHomeLoan24b(raw ? Math.min(200000, Number(raw)) : 0);
                              setDeductionStrategy('custom');
                            }}
                            className="tile-input"
                            placeholder="0"
                            aria-label="Section 24b Home Loan Interest Deduction Amount"
                          />
                        </div>
                        <div className="tile-cap-indicator">
                          <span className="cap-progress-pct">
                            {Math.round(((homeLoan24b || 0) / 200000) * 100)}%
                          </span>
                          <div className="cap-mini-track">
                            <div
                              className={`cap-mini-fill ${homeLoan24b >= 200000 ? 'fill-max' : ''}`}
                              style={{ width: `${Math.min(100, Math.round(((homeLoan24b || 0) / 200000) * 100))}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="tile-quick-chips">
                        <button
                          type="button"
                          className={`chip-btn ${homeLoan24b === 200000 ? 'active' : ''}`}
                          onClick={() => { setHomeLoan24b(200000); setDeductionStrategy('custom'); }}
                        >
                          ₹2.0L Max
                        </button>
                        <button
                          type="button"
                          className={`chip-btn ${homeLoan24b === 100000 ? 'active' : ''}`}
                          onClick={() => { setHomeLoan24b(100000); setDeductionStrategy('custom'); }}
                        >
                          ₹1.0L
                        </button>
                        <button
                          type="button"
                          className={`chip-btn chip-clear ${homeLoan24b === 0 ? 'active' : ''}`}
                          onClick={() => { setHomeLoan24b(0); setDeductionStrategy('custom'); }}
                        >
                          Nil
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Exemptions (HRA & 80E / 80G Donations) */}
                  <div className="additional-exemptions-section">
                    <button
                      type="button"
                      className={`btn-additional-exemptions-toggle ${showCustomDeductions || hraExempt > 0 || otherDeductions > 0 ? 'open' : ''}`}
                      onClick={() => setShowCustomDeductions(!showCustomDeductions)}
                      aria-expanded={showCustomDeductions || hraExempt > 0 || otherDeductions > 0}
                    >
                      <div className="add-toggle-left">
                        <i className="fas fa-plus-circle text-gold"></i>
                        <span className="add-toggle-text">
                          Additional Exemptions (HRA Sec 10(13A) &amp; Other 80E / 80G)
                        </span>
                        {(hraExempt > 0 || otherDeductions > 0) && (
                          <span className="add-active-badge">
                            Active: {formatINR(Number(hraExempt) + Number(otherDeductions))}
                          </span>
                        )}
                      </div>
                      <span className="add-toggle-arrow">
                        <i className={`fas fa-chevron-${showCustomDeductions || hraExempt > 0 || otherDeductions > 0 ? 'up' : 'down'}`}></i>
                      </span>
                    </button>

                    {(showCustomDeductions || hraExempt > 0 || otherDeductions > 0) && (
                      <div className="additional-exemptions-drawer">
                        <div className="additional-grid">
                          {/* HRA Exemption */}
                          <div className="additional-field">
                            <div className="add-field-top">
                              <span className="add-field-name">HRA Exemption (Sec 10(13A))</span>
                              <span className="add-field-cap">Rent Paid Exemption</span>
                            </div>
                            <div className="add-input-wrap">
                              <span className="tile-curr">₹</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={hraExempt ? Number(hraExempt).toLocaleString('en-IN') : ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  setHraExempt(raw ? Number(raw) : 0);
                                  setDeductionStrategy('custom');
                                }}
                                className="tile-input"
                                placeholder="0"
                                aria-label="HRA Exemption Amount"
                              />
                            </div>
                            <div className="tile-quick-chips add-chips">
                              <button
                                type="button"
                                className={`chip-btn ${hraExempt === 120000 ? 'active' : ''}`}
                                onClick={() => { setHraExempt(120000); setDeductionStrategy('custom'); }}
                              >
                                ₹1.2L (10k/mo)
                              </button>
                              <button
                                type="button"
                                className={`chip-btn ${hraExempt === 240000 ? 'active' : ''}`}
                                onClick={() => { setHraExempt(240000); setDeductionStrategy('custom'); }}
                              >
                                ₹2.4L (20k/mo)
                              </button>
                              <button
                                type="button"
                                className={`chip-btn chip-clear ${hraExempt === 0 ? 'active' : ''}`}
                                onClick={() => { setHraExempt(0); setDeductionStrategy('custom'); }}
                              >
                                Nil
                              </button>
                            </div>
                          </div>

                          {/* Other Deductions 80E/80G */}
                          <div className="additional-field">
                            <div className="add-field-top">
                              <span className="add-field-name">Other Deductions (80E / 80G)</span>
                              <span className="add-field-cap">Edu Loan / Donations</span>
                            </div>
                            <div className="add-input-wrap">
                              <span className="tile-curr">₹</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={otherDeductions ? Number(otherDeductions).toLocaleString('en-IN') : ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  setOtherDeductions(raw ? Number(raw) : 0);
                                  setDeductionStrategy('custom');
                                }}
                                className="tile-input"
                                placeholder="0"
                                aria-label="Other Deductions Section 80E or 80G Amount"
                              />
                            </div>
                            <div className="tile-quick-chips add-chips">
                              <button
                                type="button"
                                className={`chip-btn ${otherDeductions === 25000 ? 'active' : ''}`}
                                onClick={() => { setOtherDeductions(25000); setDeductionStrategy('custom'); }}
                              >
                                ₹25k
                              </button>
                              <button
                                type="button"
                                className={`chip-btn ${otherDeductions === 50000 ? 'active' : ''}`}
                                onClick={() => { setOtherDeductions(50000); setDeductionStrategy('custom'); }}
                              >
                                ₹50k
                              </button>
                              <button
                                type="button"
                                className={`chip-btn chip-clear ${otherDeductions === 0 ? 'active' : ''}`}
                                onClick={() => { setOtherDeductions(0); setDeductionStrategy('custom'); }}
                              >
                                Nil
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            </div>

            {/* Results & Live Statutory Intelligence (Single-Column Architecture) */}
            <div className="tool-col-results">
              <div className="results-section-header">
                <div className="results-header-text">
                  <span className="results-eyebrow">
                    <i className="fas fa-chart-line text-gold"></i> STATUTORY REGIME ANALYSIS &bull; AY 2025-26
                  </span>
                  <h2 className="results-main-title">Tax Regime Comparison &amp; Recommendation</h2>
                </div>
                <span className="results-badge-live">
                  <span className="live-pulse-dot"></span> Real-Time Assessment
                </span>
              </div>

              {/* Grand Recommendation Banner */}
              <div className={`recommendation-banner-card ${taxCalculation.diff >= 0 ? 'win-new' : 'win-old'}`}>
                <div className="rec-badge-icon">
                  <i className={taxCalculation.diff >= 0 ? 'fas fa-bolt' : 'fas fa-award'}></i>
                </div>
                <div className="rec-text-wrap">
                  <div className="rec-header-row">
                    <div>
                      <span className="rec-kicker">OPTIMAL STATUTORY STRATEGY</span>
                      <h2 className="rec-title">
                        {taxCalculation.recommended === 'NEW REGIME'
                          ? 'New Tax Regime is More Beneficial!'
                          : taxCalculation.recommended === 'OLD REGIME'
                          ? 'Old Tax Regime Saves You More!'
                          : 'Both Regimes Result in Equal Tax'}
                      </h2>
                    </div>
                    {taxCalculation.savings > 0 && (
                      <div className="rec-savings-pill">
                        <span className="pill-sub">Net Annual Savings</span>
                        <strong className="pill-amt">{formatINR(taxCalculation.savings)}</strong>
                        <span className="pill-sub-monthly">+{formatINR(taxCalculation.monthlySavings)} / month</span>
                      </div>
                    )}
                  </div>

                  <p className="rec-desc">
                    {taxCalculation.savings > 0 ? (
                      <>
                        By opting for the <strong>{taxCalculation.recommended}</strong>, you legally preserve{' '}
                        <strong className="rec-highlight">{formatINR(taxCalculation.savings)}</strong> annually, putting an extra{' '}
                        <strong className="rec-highlight">{formatINR(taxCalculation.monthlySavings)}/month</strong> in take-home cash.
                      </>
                    ) : (
                      'Your Chapter VI-A deductions offset the slab differentials between regimes.'
                    )}
                  </p>

                  {/* Visual Comparison Section with Dual-Mode Toggle */}
                  {taxCalculation.gross > 0 && (() => {
                    const maxTaxVal = Math.max(taxCalculation.finalOldTax, taxCalculation.finalNewTax, 1);
                    const newTaxWidth = Math.max(8, Math.round((taxCalculation.finalNewTax / maxTaxVal) * 100));
                    const oldTaxWidth = Math.max(8, Math.round((taxCalculation.finalOldTax / maxTaxVal) * 100));
                    const taxSavedPercent = Math.max(taxCalculation.finalOldTax, taxCalculation.finalNewTax) > 0
                      ? Math.round((taxCalculation.savings / Math.max(taxCalculation.finalOldTax, taxCalculation.finalNewTax)) * 100)
                      : 0;

                    return (
                      <div className="rec-visual-comparison">
                        <div className="rec-chart-top-bar">
                          <span className="chart-legend-heading">
                            <i className="fas fa-chart-simple"></i>
                            {comparisonViewMode === 'tax' ? 'Statutory Tax Liability Differential' : 'Monthly Take-Home Cash Comparison'}
                          </span>
                          <div className="rec-view-toggle" role="tablist" aria-label="Comparison View Toggle">
                            <button
                              type="button"
                              role="tab"
                              aria-selected={comparisonViewMode === 'tax'}
                              className={`view-mode-pill ${comparisonViewMode === 'tax' ? 'active' : ''}`}
                              onClick={() => setComparisonViewMode('tax')}
                              title="Compare tax liability in rupees"
                            >
                              <i className="fas fa-file-invoice-dollar"></i> Tax Liability
                            </button>
                            <button
                              type="button"
                              role="tab"
                              aria-selected={comparisonViewMode === 'takeHome'}
                              className={`view-mode-pill ${comparisonViewMode === 'takeHome' ? 'active' : ''}`}
                              onClick={() => setComparisonViewMode('takeHome')}
                              title="Compare monthly take-home salary"
                            >
                              <i className="fas fa-wallet"></i> Monthly Take-Home
                            </button>
                          </div>
                        </div>

                        {comparisonViewMode === 'tax' ? (
                          <>
                            {/* New Regime Tax Bar */}
                            <div className="comparison-bar-row">
                              <div className="bar-labels">
                                <span className="bar-title">
                                  <span className="regime-dot new-dot"></span> New Regime Tax
                                  {taxCalculation.finalNewTax < taxCalculation.finalOldTax && (
                                    <span className="mini-winner-tag">Lower Tax</span>
                                  )}
                                </span>
                                <span className="bar-stats">
                                  <strong>{formatINR(taxCalculation.finalNewTax)}</strong> &bull; Effective: {taxCalculation.newEffectiveRate}%
                                </span>
                              </div>
                              <div className="bar-track">
                                <div
                                  className="bar-fill bar-fill-tax-new"
                                  style={{ width: `${newTaxWidth}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Old Regime Tax Bar */}
                            <div className="comparison-bar-row">
                              <div className="bar-labels">
                                <span className="bar-title">
                                  <span className="regime-dot old-dot"></span> Old Regime Tax
                                  {taxCalculation.finalOldTax < taxCalculation.finalNewTax && (
                                    <span className="mini-winner-tag">Lower Tax</span>
                                  )}
                                </span>
                                <span className="bar-stats">
                                  <strong>{formatINR(taxCalculation.finalOldTax)}</strong> &bull; Effective: {taxCalculation.oldEffectiveRate}%
                                </span>
                              </div>
                              <div className="bar-track">
                                <div
                                  className="bar-fill bar-fill-tax-old"
                                  style={{ width: `${oldTaxWidth}%` }}
                                ></div>
                              </div>
                            </div>

                            {taxCalculation.savings > 0 && (
                              <div className="tax-savings-delta-tag">
                                <i className="fas fa-bolt"></i>
                                <span>
                                  <strong>{formatINR(taxCalculation.savings)} ({taxSavedPercent}%)</strong> lower tax liability under {taxCalculation.recommended}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {/* Monthly Take-Home View */}
                            <div className="comparison-bar-row">
                              <div className="bar-labels">
                                <span className="bar-title">
                                  <span className="regime-dot new-dot"></span> New Regime Monthly In-Hand
                                  {taxCalculation.newMonthlyTakeHome > taxCalculation.oldMonthlyTakeHome && (
                                    <span className="mini-winner-tag">Higher Cash</span>
                                  )}
                                </span>
                                <span className="bar-stats">
                                  <strong>{formatINR(taxCalculation.newMonthlyTakeHome)}/mo</strong> ({taxCalculation.newTakeHomePct}% of CTC)
                                </span>
                              </div>
                              <div className="bar-track">
                                <div
                                  className="bar-fill bar-fill-new"
                                  style={{ width: `${taxCalculation.newTakeHomePct}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="comparison-bar-row">
                              <div className="bar-labels">
                                <span className="bar-title">
                                  <span className="regime-dot old-dot"></span> Old Regime Monthly In-Hand
                                  {taxCalculation.oldMonthlyTakeHome > taxCalculation.newMonthlyTakeHome && (
                                    <span className="mini-winner-tag">Higher Cash</span>
                                  )}
                                </span>
                                <span className="bar-stats">
                                  <strong>{formatINR(taxCalculation.oldMonthlyTakeHome)}/mo</strong> ({taxCalculation.oldTakeHomePct}% of CTC)
                                </span>
                              </div>
                              <div className="bar-track">
                                <div
                                  className="bar-fill bar-fill-old"
                                  style={{ width: `${taxCalculation.oldTakeHomePct}%` }}
                                ></div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Side-by-Side Symmetrical Regime Cards */}
              <div className="regime-comparison-pair">
                {/* New Tax Regime Card (Budget 2024) */}
                <div className={`regime-card ${taxCalculation.recommended === 'NEW REGIME' ? 'card-winner' : ''}`}>
                  {/* Top Status Capsule (Identical height slot for both cards) */}
                  <div className="regime-status-slot">
                    <span className="regime-badge badge-new">
                      <i className="fas fa-bolt"></i> Budget 2024 Revised
                    </span>
                    {taxCalculation.recommended === 'NEW REGIME' ? (
                      <span className="winner-pill-tag">
                        <i className="fas fa-check-circle"></i> Recommended
                      </span>
                    ) : (
                      <span className="alt-pill-tag">
                        Alternative
                      </span>
                    )}
                  </div>

                  {/* Title & Statutory Reference */}
                  <div className="regime-title-block">
                    <h3 className="regime-card-title">New Tax Regime</h3>
                    <span className="regime-section-ref">AY 2025-26 &bull; Section 115BAC (Revised)</span>
                  </div>

                  {/* Deductions & Taxable Income Rows */}
                  <div className="regime-stat-rows">
                    <div className="regime-row">
                      <span className="row-item-label">Gross Annual CTC</span>
                      <strong className="row-item-val">{formatINR(taxCalculation.gross)}</strong>
                    </div>
                    <div className="regime-row">
                      <span className="row-item-label">Standard Deduction</span>
                      <strong className="row-item-val val-deduction">- {formatINR(taxCalculation.newStdDeduction)}</strong>
                    </div>
                    <div className="regime-row">
                      <span className="row-item-label">Net Taxable Income</span>
                      <strong className="row-item-val">{formatINR(taxCalculation.taxableNew)}</strong>
                    </div>
                  </div>

                  {/* Executive Result Scorecard (Integrated 2-Cell Dual Metric) */}
                  <div className="regime-result-scorecard">
                    <div className="scorecard-cell cell-tax">
                      <span className="scorecard-cell-label">Total Tax Liability</span>
                      <div className="scorecard-cell-val tax-amount">{formatINR(taxCalculation.finalNewTax)}</div>
                      <span className="scorecard-cell-sub">Effective: {taxCalculation.newEffectiveRate}%</span>
                    </div>
                    <div className="scorecard-cell cell-inhand">
                      <span className="scorecard-cell-label">Monthly In-Hand</span>
                      <div className="scorecard-cell-val inhand-amount">{formatINR(taxCalculation.newMonthlyTakeHome)}</div>
                      <span className="scorecard-cell-sub">Take-home / mo</span>
                    </div>
                  </div>

                  {/* Hairline Statutory Footer */}
                  <div className="regime-card-footer">
                    <i className="fas fa-shield-halved"></i>
                    <span>Includes ₹75,000 std. deduction &amp; 87A rebate up to ₹7L</span>
                  </div>
                </div>

                {/* Old Tax Regime Card */}
                <div className={`regime-card ${taxCalculation.recommended === 'OLD REGIME' ? 'card-winner' : ''}`}>
                  {/* Top Status Capsule (Identical height slot for both cards) */}
                  <div className="regime-status-slot">
                    <span className="regime-badge badge-old">
                      <i className="fas fa-receipt"></i> Chapter VI-A Deductions
                    </span>
                    {taxCalculation.recommended === 'OLD REGIME' ? (
                      <span className="winner-pill-tag">
                        <i className="fas fa-check-circle"></i> Recommended
                      </span>
                    ) : (
                      <span className="alt-pill-tag">
                        Alternative
                      </span>
                    )}
                  </div>

                  {/* Title & Statutory Reference */}
                  <div className="regime-title-block">
                    <h3 className="regime-card-title">Old Tax Regime</h3>
                    <span className="regime-section-ref">AY 2025-26 &bull; Slabs with Exemptions</span>
                  </div>

                  {/* Deductions & Taxable Income Rows */}
                  <div className="regime-stat-rows">
                    <div className="regime-row">
                      <span className="row-item-label">Gross Annual CTC</span>
                      <strong className="row-item-val">{formatINR(taxCalculation.gross)}</strong>
                    </div>
                    <div className="regime-row">
                      <span className="row-item-label">Exemptions &amp; 80C/80D</span>
                      <strong className="row-item-val val-deduction">- {formatINR(taxCalculation.totalOldDeductions)}</strong>
                    </div>
                    <div className="regime-row">
                      <span className="row-item-label">Net Taxable Income</span>
                      <strong className="row-item-val">{formatINR(taxCalculation.taxableOld)}</strong>
                    </div>
                  </div>

                  {/* Executive Result Scorecard (Integrated 2-Cell Dual Metric) */}
                  <div className="regime-result-scorecard">
                    <div className="scorecard-cell cell-tax">
                      <span className="scorecard-cell-label">Total Tax Liability</span>
                      <div className="scorecard-cell-val tax-amount">{formatINR(taxCalculation.finalOldTax)}</div>
                      <span className="scorecard-cell-sub">Effective: {taxCalculation.oldEffectiveRate}%</span>
                    </div>
                    <div className="scorecard-cell cell-inhand">
                      <span className="scorecard-cell-label">Monthly In-Hand</span>
                      <div className="scorecard-cell-val inhand-amount">{formatINR(taxCalculation.oldMonthlyTakeHome)}</div>
                      <span className="scorecard-cell-sub">Take-home / mo</span>
                    </div>
                  </div>

                  {/* Hairline Statutory Footer */}
                  <div className="regime-card-footer">
                    <i className="fas fa-shield-halved"></i>
                    <span>Includes ₹50k std. deduction, 80C, 80D &amp; home loan interest</span>
                  </div>
                </div>
              </div>

              {/* Symmetrical Action Bar */}
              <div className="tool-cta-actions">
                <button type="button" className="btn-tool-consult" onClick={handleConsultDesk}>
                  <i className="fas fa-user-tie btn-consult-icon"></i>
                  <span className="btn-text">Book Senior CA Consultation</span>
                  <i className="fas fa-arrow-right btn-arrow"></i>
                </button>
                <button type="button" className="btn-tool-share" onClick={handleShareCalculation}>
                  <i className="fab fa-whatsapp btn-share-icon"></i>
                  <span className="btn-text">Share via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 2: GST LATE FEE & SECTION 50 INTEREST ESTIMATOR
            ======================================================= */}
        {activeTab === 'gst' && (
          <div className="tool-content-grid">
            <div className="tool-col-inputs">
              <div className="config-panel">
                <div className="config-panel-header">
                  <div className="config-header-text">
                    <span className="config-eyebrow">CGST ACT &bull; SECTIONS 47 &amp; 50</span>
                    <h2 className="config-main-title">GST Delay Parameters</h2>
                  </div>
                  <span className="config-badge-verified">
                    <i className="fas fa-gavel"></i> Statutory Ledger
                  </span>
                </div>

                <div className="config-body">
                  {/* Return Type */}
                  <div className="form-group-tax">
                    <label>GST Return Form</label>
                    <div className="tax-pill-selector">
                      {['GSTR-3B', 'GSTR-1', 'GSTR-4 (Composition)', 'CMP-08'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`pill-option ${gstReturnType === t ? 'selected' : ''}`}
                          onClick={() => setGstReturnType(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Return Status: Nil vs Regular */}
                  <div className="form-group-tax">
                    <label>Filing Nature</label>
                    <div className="tax-pill-selector">
                      <button
                        type="button"
                        className={`pill-option ${!isNilReturn ? 'selected' : ''}`}
                        onClick={() => setIsNilReturn(false)}
                      >
                        <i className="fas fa-coins"></i> Regular Return (Tax Liability)
                      </button>
                      <button
                        type="button"
                        className={`pill-option ${isNilReturn ? 'selected' : ''}`}
                        onClick={() => setIsNilReturn(true)}
                      >
                        <i className="fas fa-ban"></i> Nil Return (Zero Transactions)
                      </button>
                    </div>
                  </div>

                  {/* Days Delayed */}
                  <div className="form-group-tax">
                    <div className="tax-label-row">
                      <label htmlFor="days-input">Days Delayed Past Statutory Due Date (20th)</label>
                      <span className="tax-curr-display">{gstPenaltyCalculation.days} Days Late</span>
                    </div>
                    <input
                      id="days-input"
                      type="number"
                      min="1"
                      max="365"
                      value={daysDelayed || ''}
                      onChange={(e) => setDaysDelayed(Math.max(1, Number(e.target.value) || 0))}
                      className="tax-num-input"
                    />
                    <div className="range-slider-wrapper">
                      <input
                        type="range"
                        min="1"
                        max="180"
                        step="1"
                        value={Math.min(180, Math.max(1, daysDelayed || 1))}
                        onChange={(e) => setDaysDelayed(Number(e.target.value))}
                        className="tax-range-slider"
                        aria-label="Days delayed slider"
                        style={{
                          background: `linear-gradient(90deg, #f59e0b 0%, #ef4444 ${daysSliderPct}%, rgba(255, 255, 255, 0.12) ${daysSliderPct}%)`,
                        }}
                      />
                      <div className="slider-ticks-row">
                        <span>1 Day</span>
                        <span>30 Days</span>
                        <span>60 Days</span>
                        <span>90 Days</span>
                        <span>180 Days</span>
                      </div>
                    </div>
                    <div className="tax-presets-row">
                      <span className="presets-label"><i className="fas fa-clock"></i> Quick Delay:</span>
                      {[7, 15, 30, 45, 60, 90].map((d) => (
                        <button
                          key={d}
                          type="button"
                          className={`tax-preset-chip ${daysDelayed === d ? 'active-preset' : ''}`}
                          onClick={() => setDaysDelayed(d)}
                        >
                          {d} Days
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Net Cash Tax Liability (Only if not nil) */}
                  {!isNilReturn && (
                    <div className="form-group-tax">
                      <div className="tax-label-row">
                        <label htmlFor="liability-input">Net Cash Tax Liability Discharged (₹)</label>
                        <span className="tax-cap-hint">Payable via Cash Ledger (Excl. ITC)</span>
                      </div>
                      <input
                        id="liability-input"
                        type="number"
                        min="0"
                        step="5000"
                        value={netCashLiability || ''}
                        onChange={(e) => setNetCashLiability(Math.max(0, Number(e.target.value) || 0))}
                        className="tax-num-input"
                      />
                      <div className="tax-presets-row">
                        <span className="presets-label"><i className="fas fa-coins"></i> Cash Presets:</span>
                        {[25000, 50000, 100000, 250000, 500000].map((val) => (
                          <button
                            key={val}
                            type="button"
                            className={`tax-preset-chip ${netCashLiability === val ? 'active-preset' : ''}`}
                            onClick={() => setNetCashLiability(val)}
                          >
                            {val >= 100000 ? `₹${val / 100000}L` : `₹${val / 1000}k`}
                          </button>
                        ))}
                      </div>
                      <small className="form-hint-text">
                        Section 50(1) 18% annual interest applies strictly to cash ledger discharge under Finance Act amendment.
                      </small>
                    </div>
                  )}

                  {/* Aggregate Turnover Tier */}
                  {!isNilReturn && (
                    <div className="form-group-tax">
                      <label>Prior FY Annual Turnover (Determines Section 47 Fee Cap)</label>
                      <div className="tax-pill-selector">
                        <button
                          type="button"
                          className={`pill-option ${annualTurnover === 'upto1.5cr' ? 'selected' : ''}`}
                          onClick={() => setAnnualTurnover('upto1.5cr')}
                        >
                          &le; ₹1.5 Cr (Cap ₹2,000)
                        </button>
                        <button
                          type="button"
                          className={`pill-option ${annualTurnover === '1.5to5cr' ? 'selected' : ''}`}
                          onClick={() => setAnnualTurnover('1.5to5cr')}
                        >
                          ₹1.5Cr – ₹5Cr (Cap ₹5,000)
                        </button>
                        <button
                          type="button"
                          className={`pill-option ${annualTurnover === 'above5cr' ? 'selected' : ''}`}
                          onClick={() => setAnnualTurnover('above5cr')}
                        >
                          &gt; ₹5 Cr (Cap ₹10,000)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="tool-col-results">
              {/* Risk Status Indicator */}
              <div className={`risk-banner-card ${gstPenaltyCalculation.riskClass}`}>
                <div className="risk-icon">
                  <i className={`fas ${gstPenaltyCalculation.riskIcon}`}></i>
                </div>
                <div>
                  <span className="risk-tag">COMPLIANCE RISK RADAR</span>
                  <h3 className="risk-title">{gstPenaltyCalculation.riskLevel}</h3>
                  <p className="risk-sub">
                    Delay of {gstPenaltyCalculation.days} days beyond statutory deadline triggers daily automated interest accumulation on GSTN portal.
                  </p>
                </div>
              </div>

              {/* Penalty Breakdown Bento Box */}
              <div className="gst-penalty-bento">
                <div className="penalty-bento-header">
                  <div>
                    <span className="rec-kicker">STATUTORY LIABILITY BREAKDOWN</span>
                    <h3>Statutory Penalty &amp; Interest Ledger</h3>
                  </div>
                  <span className="gst-law-tag">CGST Act Sec 47 &amp; 50</span>
                </div>

                <div className="penalty-grid-metrics">
                  <div className="penalty-metric-card">
                    <span className="metric-label">Section 47 Late Fee</span>
                    <strong className="metric-value">{formatINR(gstPenaltyCalculation.lateFee)}</strong>
                    <span className="metric-note">
                      ₹{gstPenaltyCalculation.dailyRate}/day for {gstPenaltyCalculation.days} days &bull; Capped at {formatINR(gstPenaltyCalculation.maxCap)}
                    </span>
                    <div className="split-pills">
                      <span>CGST: {formatINR(gstPenaltyCalculation.cgstLateFee)}</span>
                      <span>SGST: {formatINR(gstPenaltyCalculation.sgstLateFee)}</span>
                    </div>
                  </div>

                  <div className="penalty-metric-card">
                    <span className="metric-label">Section 50(1) Cash Interest</span>
                    <strong className="metric-value">{formatINR(gstPenaltyCalculation.interest)}</strong>
                    <span className="metric-note">
                      18% p.a. pro-rata on cash liability ({formatINR(netCashLiability)})
                    </span>
                    <div className="split-pills">
                      <span>Accrues Daily</span>
                      <span>Mandatory on Portal</span>
                    </div>
                  </div>
                </div>

                <div className="penalty-grand-total">
                  <div className="total-lead">
                    <span>Total Estimated Statutory Exposure</span>
                    <small>Required to be discharged in GSTR-3B payment ledger</small>
                  </div>
                  <strong className="total-amount-display">{formatINR(gstPenaltyCalculation.totalPayable)}</strong>
                </div>
              </div>

              {/* Symmetrical Action Bar */}
              <div className="tool-cta-actions">
                <button type="button" className="btn-tool-consult" onClick={handleConsultDesk}>
                  <i className="fas fa-shield-halved btn-consult-icon"></i>
                  <span className="btn-text">Engage GST Advisory Desk</span>
                  <i className="fas fa-arrow-right btn-arrow"></i>
                </button>
                <button type="button" className="btn-tool-share" onClick={handleShareCalculation}>
                  <i className="fab fa-whatsapp btn-share-icon"></i>
                  <span className="btn-text">Share via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 3: ADVANCE TAX QUARTERLY SCHEDULE
            ======================================================= */}
        {activeTab === 'advance' && (
          <div className="tool-content-grid">
            <div className="tool-col-inputs">
              <div className="config-panel">
                <div className="config-panel-header">
                  <div className="config-header-text">
                    <span className="config-eyebrow">INCOME TAX ACT &bull; SEC 208 / 211</span>
                    <h2 className="config-main-title">Advance Tax Parameters</h2>
                  </div>
                  <span className="config-badge-verified">
                    <i className="fas fa-coins"></i> FY 2024-25 Schedule
                  </span>
                </div>

                <div className="config-body">
                  <div className="form-group-tax">
                    <div className="tax-label-row">
                      <label htmlFor="adv-tax-input">Total Estimated Gross Tax Liability (₹)</label>
                      <span className="tax-curr-display">{formatINR(advanceTaxSchedule.totalTax)}</span>
                    </div>
                    <input
                      id="adv-tax-input"
                      type="number"
                      step="10000"
                      min="0"
                      value={estimatedAnnualTax || ''}
                      onChange={(e) => setEstimatedAnnualTax(Math.max(0, Number(e.target.value) || 0))}
                      className="tax-num-input"
                    />
                    <div className="range-slider-wrapper">
                      <input
                        type="range"
                        min="10000"
                        max="2000000"
                        step="10000"
                        value={Math.min(2000000, Math.max(10000, estimatedAnnualTax || 10000))}
                        onChange={(e) => setEstimatedAnnualTax(Number(e.target.value))}
                        className="tax-range-slider"
                        aria-label="Estimated Annual Tax Slider"
                        style={{
                          background: `linear-gradient(90deg, #38bdf8 0%, #3b82f6 ${advTaxSliderPct}%, rgba(255, 255, 255, 0.12) ${advTaxSliderPct}%)`,
                        }}
                      />
                      <div className="slider-ticks-row">
                        <span>₹10k</span>
                        <span>₹2.5L</span>
                        <span>₹5L</span>
                        <span>₹10L</span>
                        <span>₹20L+</span>
                      </div>
                    </div>
                    <div className="tax-presets-row">
                      <span className="presets-label"><i className="fas fa-calculator"></i> Presets:</span>
                      {[50000, 100000, 250000, 500000, 1000000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          className={`tax-preset-chip ${estimatedAnnualTax === val ? 'active-preset' : ''}`}
                          onClick={() => setEstimatedAnnualTax(val)}
                        >
                          {val >= 100000 ? `₹${val / 100000}L` : `₹${val / 1000}k`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group-tax">
                    <div className="tax-label-row">
                      <label htmlFor="tds-input">Estimated TDS / TCS Credits (Form 26AS) (₹)</label>
                      <span className="tax-cap-hint">Tax already deducted by payers</span>
                    </div>
                    <input
                      id="tds-input"
                      type="number"
                      step="5000"
                      min="0"
                      value={tdsCredits || ''}
                      onChange={(e) => setTdsCredits(Math.max(0, Number(e.target.value) || 0))}
                      className="tax-num-input"
                    />
                    <div className="tax-presets-row">
                      <span className="presets-label"><i className="fas fa-percentage"></i> Quick TDS:</span>
                      {[
                        { label: '₹0 TDS', val: 0 },
                        { label: '25% TDS', val: Math.round(estimatedAnnualTax * 0.25) },
                        { label: '50% TDS', val: Math.round(estimatedAnnualTax * 0.5) },
                        { label: '75% TDS', val: Math.round(estimatedAnnualTax * 0.75) },
                        { label: '100% TDS', val: estimatedAnnualTax },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`tax-preset-chip ${tdsCredits === item.val ? 'active-preset' : ''}`}
                          onClick={() => setTdsCredits(item.val)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="tax-rule-card">
                    <h4><i className="fas fa-info-circle"></i> Section 208 Statutory Rule</h4>
                    <p>
                      Every taxpayer whose estimated net direct tax liability after TDS credits equals or exceeds <strong>₹10,000</strong> is legally obligated to deposit Advance Tax in 4 statutory installments. Failure triggers penal interest under Section 234B &amp; 234C.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advance Tax Installment Schedule */}
            <div className="tool-col-results">
              <div className="schedule-bento-box">
                <div className="schedule-header">
                  <div>
                    <span className="schedule-kicker">STATUTORY REVENUE CALENDAR</span>
                    <h3>Mandatory Quarterly Payment Schedule</h3>
                  </div>
                  <span className={`adv-mandatory-badge ${advanceTaxSchedule.isMandatory ? 'badge-mand-yes' : 'badge-mand-no'}`}>
                    {advanceTaxSchedule.isMandatory ? '● Advance Tax Mandatory' : 'Below ₹10,000 Threshold'}
                  </span>
                </div>

                <div className="installments-stack">
                  {advanceTaxSchedule.installments.map((inst, idx) => (
                    <div key={idx} className="installment-row-card">
                      <div className="inst-col-date">
                        <span className="inst-badge">{inst.quarter}</span>
                        <div>
                          <strong>{inst.due}</strong>
                          <span className="inst-sub">Cumulative {inst.percentage} of Net Tax</span>
                        </div>
                      </div>

                      <div className="inst-col-amounts">
                        <div className="inst-amount-box">
                          <span className="inst-amt-label">Quarterly Installment</span>
                          <strong className="inst-inc-val">{formatINR(inst.incrementalDue)}</strong>
                        </div>
                        <div className="inst-amount-box">
                          <span className="inst-amt-label">Cumulative Paid</span>
                          <span className="inst-cum-val">{formatINR(inst.cumulativeDue)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="schedule-summary-footer">
                  <div className="footer-metric">
                    <span>Net Advance Tax Payable:</span>
                    <strong>{formatINR(advanceTaxSchedule.netAdvanceLiability)}</strong>
                  </div>
                  <div className="footer-warning">
                    <i className="fas fa-shield-alt"></i>
                    <span>Pre-empt Section 234C 1% monthly interest by paying before each quarter deadline</span>
                  </div>
                </div>
              </div>

              {/* Symmetrical Action Bar */}
              <div className="tool-cta-actions">
                <button type="button" className="btn-tool-consult" onClick={handleConsultDesk}>
                  <i className="fas fa-calculator btn-consult-icon"></i>
                  <span className="btn-text">Schedule Advance Tax Filing</span>
                  <i className="fas fa-arrow-right btn-arrow"></i>
                </button>
                <button type="button" className="btn-tool-share" onClick={handleShareCalculation}>
                  <i className="fab fa-whatsapp btn-share-icon"></i>
                  <span className="btn-text">Share via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trust & Methodology Institutional Section */}
      <section className="tools-methodology-section">
        <div className="container">
          <div className="tools-trust-pillars-grid">
            <div className="trust-pillar-card">
              <div className="pillar-icon-box">
                <i className="fas fa-file-contract"></i>
              </div>
              <h4>Budget 2024 (AY 2025-26) Calibrated</h4>
              <p>
                Updated for Finance (No. 2) Act, 2024 revised tax slabs, enhanced ₹75,000 standard deduction, and Section 87A rebate marginal relief computations.
              </p>
            </div>

            <div className="trust-pillar-card">
              <div className="pillar-icon-box">
                <i className="fas fa-shield-halved"></i>
              </div>
              <h4>Direct CBDT &amp; GSTN Legal Basis</h4>
              <p>
                Calculations strictly follow CGST Act Section 47 late fee limits, Section 50(1) 18% cash interest rules, and Section 208 advance tax schedules.
              </p>
            </div>

            <div className="trust-pillar-card">
              <div className="pillar-icon-box">
                <i className="fas fa-user-check"></i>
              </div>
              <h4>Chartered Accountant Verified</h4>
              <p>
                Engineered under the direct supervision of senior Chartered Accountants at <strong>Shree Chamunda Associates</strong> for corporate and individual compliance.
              </p>
            </div>
          </div>

          <div className="methodology-card">
            <div className="meth-header">
              <i className="fas fa-book-open"></i>
              <h4>Statutory Basis &amp; Calculation Methodology</h4>
            </div>
            <p>
              Calculations on this portal are based on the Finance (No. 2) Act, 2024 effective for Assessment Year 2025-26, the Income Tax Act, 1961, and statutory notifications under Section 47 and Section 50 of the Central Goods &amp; Services Tax (CGST) Act, 2017. Results are computed strictly for indicative assessment. Final tax liability, surcharge thresholds (for high net worth individuals), and MAT/AMT provisions are customized during formal client advisory sessions by senior Chartered Accountants at <strong>Shree Chamunda Associates</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaxTools;
