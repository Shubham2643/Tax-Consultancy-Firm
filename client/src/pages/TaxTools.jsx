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
    title: 'Interactive Tax Tools & Budget 2024 Slabs Hub',
    description:
      'Compare New vs Old Tax Regime under Budget 2024, compute GST Section 47 Late Fees & Section 50 Interest, and calculate statutory Advance Tax quarterly liability with Shree Chamunda Associates.',
    url: typeof window !== 'undefined' ? window.location.href : '',
  });

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

  // Ensure seamless dark mode styling across header and body on Tax Tools Hub
  useEffect(() => {
    const root = document.documentElement;
    const prevTheme = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'dark');
    return () => {
      root.setAttribute('data-theme', prevTheme || 'light');
    };
  }, []);

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
    const newTakeHomePct = gross > 0 ? Math.max(0, Math.min(100, Math.round(((gross - finalNewTax) / gross) * 100))) : 100;
    const oldTakeHomePct = gross > 0 ? Math.max(0, Math.min(100, Math.round(((gross - finalOldTax) / gross) * 100))) : 100;

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
      oldTakeHome: gross - finalOldTax,
      newTakeHome: gross - finalNewTax,
      newEffectiveRate,
      oldEffectiveRate,
      newTakeHomePct,
      oldTakeHomePct,
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
    // Interest is calculated pro-rata: (Net Cash Liability * 18% * Days) / 365
    const interest = Math.round((liability * 0.18 * days) / 365);

    const totalPayable = lateFee + interest;

    // Notice Risk Level
    let riskLevel = 'Low';
    let riskClass = 'risk-low';
    if (days > 60 || liability > 100000) {
      riskLevel = 'Critical — Section 73 / DRC-01A Notice Risk';
      riskClass = 'risk-critical';
    } else if (days > 30 || liability > 50000) {
      riskLevel = 'Moderate — Automated GSTN Scrutiny Alert';
      riskClass = 'risk-moderate';
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
        cumulativeDue: Math.round(netAdvanceLiability * 0.15),
        incrementalDue: Math.round(netAdvanceLiability * 0.15),
      },
      {
        quarter: 'Q2',
        due: '15 September',
        percentage: '45%',
        cumulativeDue: Math.round(netAdvanceLiability * 0.45),
        incrementalDue: Math.round(netAdvanceLiability * 0.3),
      },
      {
        quarter: 'Q3',
        due: '15 December',
        percentage: '75%',
        cumulativeDue: Math.round(netAdvanceLiability * 0.75),
        incrementalDue: Math.round(netAdvanceLiability * 0.3),
      },
      {
        quarter: 'Q4',
        due: '15 March',
        percentage: '100%',
        cumulativeDue: netAdvanceLiability,
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

  // Share calculation on WhatsApp
  const handleShareCalculation = () => {
    let msg = '';
    if (activeTab === 'regime') {
      msg = `*Tax Regime Calculation by Shree Chamunda Associates*\nGross Income: ${formatINR(taxCalculation.gross)}\nOld Regime Tax: ${formatINR(taxCalculation.finalOldTax)}\nNew Regime Tax: ${formatINR(taxCalculation.finalNewTax)}\nRecommended: *${taxCalculation.recommended}* (Savings: ${formatINR(taxCalculation.savings)})\n\nNeed assistance with e-filing? Contact CA Desk: ${phone}`;
    } else if (activeTab === 'gst') {
      msg = `*GST Late Fee & Sec 50 Interest Estimate by Shree Chamunda Associates*\nReturn: ${gstReturnType}\nDays Delayed: ${gstPenaltyCalculation.days} days\nLate Fee: ${formatINR(gstPenaltyCalculation.lateFee)}\nInterest (18% p.a.): ${formatINR(gstPenaltyCalculation.interest)}\nTotal Exposure: *${formatINR(gstPenaltyCalculation.totalPayable)}*\n\nConsult CA Desk to file: ${phone}`;
    } else {
      msg = `*Advance Tax Schedule by Shree Chamunda Associates*\nNet Advance Tax: ${formatINR(advanceTaxSchedule.netAdvanceLiability)}\nMandatory Advance Tax: ${advanceTaxSchedule.isMandatory ? 'Yes (>= ₹10,000)' : 'No'}\n\nPlan with CA Desk: ${phone}`;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleConsultDesk = () => {
    const text = `Hello CA Team at Shree Chamunda Associates, I ran calculations on your Tax Tools Hub for ${
      activeTab === 'regime'
        ? `Income ₹${income.toLocaleString('en-IN')}`
        : activeTab === 'gst'
        ? `GST ${gstReturnType} delay of ${daysDelayed} days`
        : `Advance Tax of ₹${advanceTaxSchedule.netAdvanceLiability.toLocaleString('en-IN')}`
    }. I would like expert advice.`;
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
    Math.max(0, (((Math.min(2000000, Math.max(0, estimatedAnnualTax || 0))) - 10000) / (2000000 - 10000)) * 100)
  );

  return (
    <div className="tax-tools-page fade-in">
      {/* Executive Midnight Header */}
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
            Interactive <span className="hero-gradient-text">Tax &amp; Statutory Tools</span> Hub
          </h1>
          <p className="tools-hero-lead">
            Instantly compute your statutory tax liability under revised Budget 2024 slabs vs. Old Regime deductions, backed by verified CBDT &amp; GSTN rules.
          </p>

          {/* Tab Selection Navigation */}
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
              <i className="fas fa-scale-balanced"></i>
              <div className="tab-label-stack">
                <span className="tab-title">Budget 2024 Regime Calculator</span>
                <span className="tab-sub">New vs. Old Tax Slabs</span>
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
              <i className="fas fa-file-invoice-dollar"></i>
              <div className="tab-label-stack">
                <span className="tab-title">GST Late Fee &amp; Interest</span>
                <span className="tab-sub">Sec 47 &amp; 50 Estimator</span>
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
              <i className="fas fa-calendar-check"></i>
              <div className="tab-label-stack">
                <span className="tab-title">Advance Tax Radar</span>
                <span className="tab-sub">Quarterly Statutory Schedule</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Main Tool Canvas */}
      <div className="container tools-canvas-container">
        {/* =======================================================
            TAB 1: BUDGET 2024 NEW VS OLD REGIME
            ======================================================= */}
        {activeTab === 'regime' && (
          <div className="tool-content-grid">
            {/* Left Inputs Column */}
            <div className="tool-col-inputs">
              <div className="tool-card-box">
                <div className="tool-card-header">
                  <div className="tool-icon-circle">
                    <i className="fas fa-sliders"></i>
                  </div>
                  <div>
                    <h3>Enter Income &amp; Investments</h3>
                    <span className="card-subtext">FY 2024-25 (Assessment Year 2025-26)</span>
                  </div>
                </div>

                <div className="tool-form-body">
                  {/* Hero Gross Annual Income Box */}
                  <div className="hero-income-card">
                    <div className="hero-income-top">
                      <div className="hero-income-meta">
                        <label htmlFor="income-input" className="hero-income-label">
                          Gross Annual Income (CTC / Turnover)
                        </label>
                        <span className="hero-income-sub">Official CBDT FY 2024-25 Assessment</span>
                      </div>
                      <span className="hero-income-pill-badge">
                        <i className="fas fa-chart-pie"></i> Slabs Linked
                      </span>
                    </div>

                    <div className="hero-currency-input-wrap">
                      <span className="hero-currency-symbol">₹</span>
                      <input
                        id="income-input"
                        type="text"
                        inputMode="numeric"
                        value={income ? Number(income).toLocaleString('en-IN') : ''}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, '');
                          setIncome(raw ? Math.min(100000000, Number(raw)) : 0);
                        }}
                        className="hero-currency-input"
                        aria-label="Gross Annual Income"
                        placeholder="0"
                      />
                    </div>

                    {/* Interactive Range Slider */}
                    <div className="range-slider-wrapper">
                      <input
                        type="range"
                        min="300000"
                        max="5000000"
                        step="25000"
                        value={Math.min(5000000, Math.max(300000, income || 300000))}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        className="tax-range-slider"
                        aria-label="Gross Annual Income Slider"
                        style={{
                          background: `linear-gradient(90deg, #f59e0b 0%, #10b981 ${incomeSliderPct}%, rgba(255, 255, 255, 0.12) ${incomeSliderPct}%)`,
                        }}
                      />
                      <div className="slider-ticks-row">
                        <span>₹3L</span>
                        <span>₹10L</span>
                        <span>₹15L</span>
                        <span>₹25L</span>
                        <span>₹50L+</span>
                      </div>
                    </div>

                    {/* Curated Presets */}
                    <div className="tax-presets-row">
                      <span className="presets-label"><i className="fas fa-bolt"></i> Quick:</span>
                      {[
                        { label: '₹7.5L (0-Tax)', val: 750000 },
                        { label: '₹10L', val: 1000000 },
                        { label: '₹12.5L', val: 1250000 },
                        { label: '₹15L', val: 1500000 },
                        { label: '₹20L', val: 2000000 },
                        { label: '₹30L', val: 3000000 },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`tax-preset-chip ${income === item.val ? 'active-preset' : ''}`}
                          onClick={() => setIncome(item.val)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age Group Segmented Control */}
                  <div className="form-group-tax">
                    <label className="tax-subheading-label">Taxpayer Category</label>
                    <div className="segmented-age-control" role="radiogroup">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={ageGroup === 'below60'}
                        className={`segmented-tab ${ageGroup === 'below60' ? 'active' : ''}`}
                        onClick={() => setAgeGroup('below60')}
                      >
                        <span className="seg-icon-box"><i className="fas fa-user"></i></span>
                        <span className="seg-main">&lt; 60 Yrs</span>
                        <span className="seg-sub">Individual</span>
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={ageGroup === '60to80'}
                        className={`segmented-tab ${ageGroup === '60to80' ? 'active' : ''}`}
                        onClick={() => setAgeGroup('60to80')}
                      >
                        <span className="seg-icon-box"><i className="fas fa-user-tie"></i></span>
                        <span className="seg-main">60–80 Yrs</span>
                        <span className="seg-sub">Senior Citizen</span>
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={ageGroup === 'above80'}
                        className={`segmented-tab ${ageGroup === 'above80' ? 'active' : ''}`}
                        onClick={() => setAgeGroup('above80')}
                      >
                        <span className="seg-icon-box"><i className="fas fa-medal"></i></span>
                        <span className="seg-main">&gt; 80 Yrs</span>
                        <span className="seg-sub">Super Senior</span>
                      </button>
                    </div>
                  </div>

                  {/* Smart Old Regime Deductions Architect */}
                  <div className="deductions-architect-card">
                    <div className="deductions-card-header">
                      <div>
                        <span className="ded-section-kicker">CHAPTER VI-A DEDUCTIONS</span>
                        <h4 className="ded-section-title">Old Regime Investments &amp; Deductions</h4>
                      </div>
                      <div className="total-ded-claimed-badge">
                        <span className="badge-kicker">Total Claimed</span>
                        <strong className="badge-val">{formatINR(taxCalculation.totalOldDeductions)}</strong>
                      </div>
                    </div>

                    {/* 1-Tap Strategy Profiles */}
                    <div className="strategy-preset-shelf">
                      <span className="strategy-label">1-Tap Deduction Profile:</span>
                      <div className="strategy-options-row">
                        <button
                          type="button"
                          className={`strategy-chip ${deductionStrategy === 'standard' ? 'active' : ''}`}
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
                          <span className="strategy-icon-box"><i className="fas fa-briefcase"></i></span>
                          <span className="strategy-chip-text">
                            <span className="chip-name">Salaried Standard</span>
                            <span className="chip-val">₹2.25 Lakhs</span>
                          </span>
                        </button>

                        <button
                          type="button"
                          className={`strategy-chip ${deductionStrategy === 'homeowner' ? 'active' : ''}`}
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
                          <span className="strategy-icon-box"><i className="fas fa-house-chimney"></i></span>
                          <span className="strategy-chip-text">
                            <span className="chip-name">Home Loan Max</span>
                            <span className="chip-val">₹4.25 Lakhs</span>
                          </span>
                        </button>

                        <button
                          type="button"
                          className={`strategy-chip ${deductionStrategy === 'zero' ? 'active' : ''}`}
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
                          <span className="strategy-icon-box"><i className="fas fa-circle-xmark"></i></span>
                          <span className="strategy-chip-text">
                            <span className="chip-name">Zero / Nil</span>
                            <span className="chip-val">No Deductions</span>
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Toggle Customizer Button */}
                    <button
                      type="button"
                      className="btn-toggle-custom-ded"
                      onClick={() => setShowCustomDeductions(!showCustomDeductions)}
                    >
                      <span className="toggle-label-wrap">
                        <span className="toggle-icon-box"><i className={`fas fa-${showCustomDeductions ? 'chevron-up' : 'sliders'}`}></i></span>
                        <span>{showCustomDeductions ? 'Hide Fine-Tune Deductions' : 'Fine-Tune Specific Deductions (80C, 80D, NPS, Home Loan, HRA)'}</span>
                      </span>
                      <span className="toggle-hint-pill">{showCustomDeductions ? 'Collapse' : 'Customize ▾'}</span>
                    </button>

                    {/* Collapsible Clean Deduction Cards */}
                    {showCustomDeductions && (
                      <div className="custom-deductions-drawer">
                        {/* Section 80C */}
                        <div className="custom-ded-item">
                          <div className="ded-item-top">
                            <div>
                              <span className="ded-item-title">Section 80C (PPF, ELSS, EPF, LIC, Tuition)</span>
                              <span className="ded-item-cap">Max Cap ₹1,50,000</span>
                            </div>
                            <div className="ded-inline-input-wrap">
                              <span className="input-curr-symbol">₹</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={sec80C ? Number(sec80C).toLocaleString('en-IN') : ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  setSec80C(raw ? Math.min(150000, Number(raw)) : 0);
                                  setDeductionStrategy('custom');
                                }}
                                className="ded-inline-input"
                                placeholder="0"
                              />
                            </div>
                          </div>
                          <div className="ded-quick-chips">
                            {[
                              { label: 'Max ₹1.5L', val: 150000 },
                              { label: '₹1.0L', val: 100000 },
                              { label: '₹50k', val: 50000 },
                              { label: '₹0', val: 0 },
                            ].map((chip) => (
                              <button
                                key={chip.val}
                                type="button"
                                className={`ded-pill-chip ${sec80C === chip.val ? 'active' : ''}`}
                                onClick={() => {
                                  setSec80C(chip.val);
                                  setDeductionStrategy('custom');
                                }}
                              >
                                {chip.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Section 80D */}
                        <div className="custom-ded-item">
                          <div className="ded-item-top">
                            <div>
                              <span className="ded-item-title">Section 80D (Health Insurance Premium)</span>
                              <span className="ded-item-cap">Self + Senior Parents</span>
                            </div>
                            <div className="ded-inline-input-wrap">
                              <span className="input-curr-symbol">₹</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={sec80D ? Number(sec80D).toLocaleString('en-IN') : ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  setSec80D(raw ? Math.min(100000, Number(raw)) : 0);
                                  setDeductionStrategy('custom');
                                }}
                                className="ded-inline-input"
                                placeholder="0"
                              />
                            </div>
                          </div>
                          <div className="ded-quick-chips">
                            {[
                              { label: 'Self (₹25k)', val: 25000 },
                              { label: '+Parents (₹50k)', val: 50000 },
                              { label: 'Sr. Parents (₹1L)', val: 100000 },
                              { label: '₹0', val: 0 },
                            ].map((chip) => (
                              <button
                                key={chip.val}
                                type="button"
                                className={`ded-pill-chip ${sec80D === chip.val ? 'active' : ''}`}
                                onClick={() => {
                                  setSec80D(chip.val);
                                  setDeductionStrategy('custom');
                                }}
                              >
                                {chip.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Two Column Grid: NPS & Home Loan */}
                        <div className="custom-ded-two-col">
                          <div className="custom-ded-subcard">
                            <div className="subcard-header">
                              <span className="subcard-title">80CCD(1B) NPS</span>
                              <span className="subcard-cap">Max ₹50k</span>
                            </div>
                            <div className="ded-inline-input-wrap">
                              <span className="input-curr-symbol">₹</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={nps80CCD ? Number(nps80CCD).toLocaleString('en-IN') : ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  setNps80CCD(raw ? Math.min(50000, Number(raw)) : 0);
                                  setDeductionStrategy('custom');
                                }}
                                className="ded-inline-input"
                                placeholder="0"
                              />
                            </div>
                            <div className="ded-quick-chips">
                              {[
                                { label: 'Max ₹50k', val: 50000 },
                                { label: '₹25k', val: 25000 },
                                { label: '₹0', val: 0 },
                              ].map((chip) => (
                                <button
                                  key={chip.val}
                                  type="button"
                                  className={`ded-pill-chip ${nps80CCD === chip.val ? 'active' : ''}`}
                                  onClick={() => {
                                    setNps80CCD(chip.val);
                                    setDeductionStrategy('custom');
                                  }}
                                >
                                  {chip.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="custom-ded-subcard">
                            <div className="subcard-header">
                              <span className="subcard-title">Sec 24 Home Loan</span>
                              <span className="subcard-cap">Max ₹2L</span>
                            </div>
                            <div className="ded-inline-input-wrap">
                              <span className="input-curr-symbol">₹</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={homeLoan24b ? Number(homeLoan24b).toLocaleString('en-IN') : ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  setHomeLoan24b(raw ? Math.min(200000, Number(raw)) : 0);
                                  setDeductionStrategy('custom');
                                }}
                                className="ded-inline-input"
                                placeholder="0"
                              />
                            </div>
                            <div className="ded-quick-chips">
                              {[
                                { label: 'Max ₹2L', val: 200000 },
                                { label: '₹1L', val: 100000 },
                                { label: '₹0', val: 0 },
                              ].map((chip) => (
                                <button
                                  key={chip.val}
                                  type="button"
                                  className={`ded-pill-chip ${homeLoan24b === chip.val ? 'active' : ''}`}
                                  onClick={() => {
                                    setHomeLoan24b(chip.val);
                                    setDeductionStrategy('custom');
                                  }}
                                >
                                  {chip.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Special Allowances: HRA & Other */}
                        <div className="custom-ded-two-col">
                          <div className="custom-ded-subcard">
                            <div className="subcard-header">
                              <span className="subcard-title">HRA Exemption</span>
                            </div>
                            <div className="ded-inline-input-wrap">
                              <span className="input-curr-symbol">₹</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={hraExempt ? Number(hraExempt).toLocaleString('en-IN') : ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  setHraExempt(raw ? Number(raw) : 0);
                                  setDeductionStrategy('custom');
                                }}
                                className="ded-inline-input"
                                placeholder="0"
                              />
                            </div>
                            <div className="ded-quick-chips">
                              {[
                                { label: '₹1.2L', val: 120000 },
                                { label: '₹2.4L', val: 240000 },
                                { label: '₹0', val: 0 },
                              ].map((chip) => (
                                <button
                                  key={chip.val}
                                  type="button"
                                  className={`ded-pill-chip ${hraExempt === chip.val ? 'active' : ''}`}
                                  onClick={() => {
                                    setHraExempt(chip.val);
                                    setDeductionStrategy('custom');
                                  }}
                                >
                                  {chip.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="custom-ded-subcard">
                            <div className="subcard-header">
                              <span className="subcard-title">Other (80E/80G)</span>
                            </div>
                            <div className="ded-inline-input-wrap">
                              <span className="input-curr-symbol">₹</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={otherDeductions ? Number(otherDeductions).toLocaleString('en-IN') : ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  setOtherDeductions(raw ? Number(raw) : 0);
                                  setDeductionStrategy('custom');
                                }}
                                className="ded-inline-input"
                                placeholder="0"
                              />
                            </div>
                            <div className="ded-quick-chips">
                              {[
                                { label: '₹25k', val: 25000 },
                                { label: '₹50k', val: 50000 },
                                { label: '₹0', val: 0 },
                              ].map((chip) => (
                                <button
                                  key={chip.val}
                                  type="button"
                                  className={`ded-pill-chip ${otherDeductions === chip.val ? 'active' : ''}`}
                                  onClick={() => {
                                    setOtherDeductions(chip.val);
                                    setDeductionStrategy('custom');
                                  }}
                                >
                                  {chip.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Comparison & Recommendation Column */}
            <div className="tool-col-results">
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
                        <span className="pill-sub">Net Savings</span>
                        <strong className="pill-amt">{formatINR(taxCalculation.savings)}</strong>
                      </div>
                    )}
                  </div>
                  <p className="rec-desc">
                    {taxCalculation.savings > 0 ? (
                      <>
                        By choosing <strong>{taxCalculation.recommended}</strong>, you legally preserve{' '}
                        <strong className="rec-highlight">{formatINR(taxCalculation.savings)}</strong> in net tax liability.
                      </>
                    ) : (
                      'Your deductions exactly offset the slab differentials between regimes.'
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
                            {comparisonViewMode === 'tax' ? 'Statutory Tax Liability Comparison' : 'Annual Take-Home Wealth Comparison'}
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
                              <i className="fas fa-file-invoice-dollar"></i> Tax Payable
                            </button>
                            <button
                              type="button"
                              role="tab"
                              aria-selected={comparisonViewMode === 'takeHome'}
                              className={`view-mode-pill ${comparisonViewMode === 'takeHome' ? 'active' : ''}`}
                              onClick={() => setComparisonViewMode('takeHome')}
                              title="Compare take-home percentage"
                            >
                              <i className="fas fa-wallet"></i> Take-Home %
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
                                  <strong>{formatINR(taxCalculation.savings)} ({taxSavedPercent}%)</strong> less tax under {taxCalculation.recommended}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {/* Take-Home View */}
                            <div className="comparison-bar-row">
                              <div className="bar-labels">
                                <span className="bar-title">
                                  <span className="regime-dot new-dot"></span> New Regime Take-Home
                                </span>
                                <span className="bar-stats">
                                  <strong>{taxCalculation.newTakeHomePct}%</strong> ({formatINR(taxCalculation.newTakeHome)}) &bull; Tax: {taxCalculation.newEffectiveRate}%
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
                                  <span className="regime-dot old-dot"></span> Old Regime Take-Home
                                </span>
                                <span className="bar-stats">
                                  <strong>{taxCalculation.oldTakeHomePct}%</strong> ({formatINR(taxCalculation.oldTakeHome)}) &bull; Tax: {taxCalculation.oldEffectiveRate}%
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

              {/* Side-by-Side Regime Cards */}
              <div className="regime-comparison-pair">
                {/* New Tax Regime Card (Budget 2024) */}
                <div className={`regime-card ${taxCalculation.recommended === 'NEW REGIME' ? 'card-winner' : ''}`}>
                  <div className="regime-card-top">
                    <div>
                      <span className="regime-badge badge-new">BUDGET 2024 REVISED</span>
                      <h3>New Tax Regime</h3>
                    </div>
                    {taxCalculation.recommended === 'NEW REGIME' && (
                      <span className="winner-tag">
                        <i className="fas fa-check"></i> RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div className="regime-stat-rows">
                    <div className="regime-row">
                      <span>Gross Total Income</span>
                      <strong>{formatINR(taxCalculation.gross)}</strong>
                    </div>
                    <div className="regime-row">
                      <span>Standard Deduction</span>
                      <strong className="text-emerald">- {formatINR(taxCalculation.newStdDeduction)}</strong>
                    </div>
                    <div className="regime-row">
                      <span>Net Taxable Income</span>
                      <strong>{formatINR(taxCalculation.taxableNew)}</strong>
                    </div>
                    <div className="regime-divider"></div>
                    <div className="regime-row grand-tax-row">
                      <span>Final Tax + 4% Cess</span>
                      <strong className="regime-tax-num">{formatINR(taxCalculation.finalNewTax)}</strong>
                    </div>
                    <div className="regime-row takehome-row">
                      <span>Net Annual Take-Home</span>
                      <strong className="text-emerald">{formatINR(taxCalculation.newTakeHome)}</strong>
                    </div>
                  </div>

                  <div className="regime-highlights-strip">
                    <i className="fas fa-info-circle"></i>
                    <span>Includes ₹75,000 standard deduction &amp; Sec 87A rebate up to ₹7 Lakhs</span>
                  </div>
                </div>

                {/* Old Tax Regime Card */}
                <div className={`regime-card ${taxCalculation.recommended === 'OLD REGIME' ? 'card-winner' : ''}`}>
                  <div className="regime-card-top">
                    <div>
                      <span className="regime-badge badge-old">CHAPTER VI-A DEDUCTIONS</span>
                      <h3>Old Tax Regime</h3>
                    </div>
                    {taxCalculation.recommended === 'OLD REGIME' && (
                      <span className="winner-tag">
                        <i className="fas fa-check"></i> RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div className="regime-stat-rows">
                    <div className="regime-row">
                      <span>Gross Total Income</span>
                      <strong>{formatINR(taxCalculation.gross)}</strong>
                    </div>
                    <div className="regime-row">
                      <span>Total Exemptions &amp; 80C</span>
                      <strong className="text-emerald">- {formatINR(taxCalculation.totalOldDeductions)}</strong>
                    </div>
                    <div className="regime-row">
                      <span>Net Taxable Income</span>
                      <strong>{formatINR(taxCalculation.taxableOld)}</strong>
                    </div>
                    <div className="regime-divider"></div>
                    <div className="regime-row grand-tax-row">
                      <span>Final Tax + 4% Cess</span>
                      <strong className="regime-tax-num">{formatINR(taxCalculation.finalOldTax)}</strong>
                    </div>
                    <div className="regime-row takehome-row">
                      <span>Net Annual Take-Home</span>
                      <strong className="text-emerald">{formatINR(taxCalculation.oldTakeHome)}</strong>
                    </div>
                  </div>

                  <div className="regime-highlights-strip">
                    <i className="fas fa-info-circle"></i>
                    <span>Includes ₹50k standard deduction, 80C (up to 1.5L), 80D &amp; home loan interest</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="tool-cta-actions">
                <button type="button" className="btn-tool-consult" onClick={handleConsultDesk}>
                  <span className="btn-icon-wrap"><i className="fas fa-user-shield"></i></span>
                  <span>Book Senior CA Consultation</span>
                  <i className="fas fa-arrow-right btn-arrow"></i>
                </button>
                <button type="button" className="btn-tool-share" onClick={handleShareCalculation}>
                  <span className="btn-icon-wrap"><i className="fab fa-whatsapp"></i></span>
                  <span>Share Breakdown</span>
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
              <div className="tool-card-box">
                <div className="tool-card-header">
                  <div className="tool-icon-circle">
                    <i className="fas fa-gavel"></i>
                  </div>
                  <div>
                    <h3>GST Filing Delay Parameters</h3>
                    <span className="card-subtext">Central Goods &amp; Services Tax Act, 2017</span>
                  </div>
                </div>

                <div className="tool-form-body">
                  {/* Return Type */}
                  <div className="form-group-tax">
                    <label>GST Return Type</label>
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
                    <label>Return Nature</label>
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
                      <span className="tax-curr-display">{gstPenaltyCalculation.days} Days</span>
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
                      <span className="presets-label">Quick:</span>
                      {[7, 15, 30, 45, 60, 90].map((d) => (
                        <button
                          key={d}
                          type="button"
                          className={`tax-preset-chip ${daysDelayed === d ? 'active-preset' : ''}`}
                          onClick={() => setDaysDelayed(d)}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Net Cash Tax Liability (Only if not nil) */}
                  {!isNilReturn && (
                    <div className="form-group-tax">
                      <div className="tax-label-row">
                        <label htmlFor="liability-input">Net Cash Tax Liability (Payable in Cash) (₹)</label>
                        <span className="tax-cap-hint">Excluding ITC</span>
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
                        <span className="presets-label">Presets:</span>
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
                        Section 50(1) interest applies only on the net cash liability discharged via Electronic Cash Ledger.
                      </small>
                    </div>
                  )}

                  {/* Aggregate Turnover Tier */}
                  {!isNilReturn && (
                    <div className="form-group-tax">
                      <label>Prior FY Turnover (Determines Section 47 Fee Cap)</label>
                      <div className="tax-pill-selector">
                        <button
                          type="button"
                          className={`pill-option ${annualTurnover === 'upto1.5cr' ? 'selected' : ''}`}
                          onClick={() => setAnnualTurnover('upto1.5cr')}
                        >
                          &le; ₹1.5 Crore (Cap ₹2,000)
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
                          &gt; ₹5 Crore (Cap ₹10,000)
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
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div>
                  <span className="risk-tag">COMPLIANCE RISK ASSESSMENT</span>
                  <h3 className="risk-title">{gstPenaltyCalculation.riskLevel}</h3>
                  <p className="risk-sub">
                    Delay of {gstPenaltyCalculation.days} days beyond due date triggers automated interest calculations on GSTN portal.
                  </p>
                </div>
              </div>

              {/* Penalty Breakdown Bento Box */}
              <div className="gst-penalty-bento">
                <div className="penalty-bento-header">
                  <h3>Statutory Penalty &amp; Interest Breakdown</h3>
                  <span className="gst-law-tag">CGST Act Sections 47 &amp; 50</span>
                </div>

                <div className="penalty-grid-metrics">
                  <div className="penalty-metric-card">
                    <span className="metric-label">Section 47 Late Fee</span>
                    <strong className="metric-value">{formatINR(gstPenaltyCalculation.lateFee)}</strong>
                    <span className="metric-note">
                      ₹{gstPenaltyCalculation.dailyRate}/day ({gstPenaltyCalculation.days} days) &bull; Capped at {formatINR(gstPenaltyCalculation.maxCap)}
                    </span>
                    <div className="split-pills">
                      <span>CGST: {formatINR(gstPenaltyCalculation.cgstLateFee)}</span>
                      <span>SGST: {formatINR(gstPenaltyCalculation.sgstLateFee)}</span>
                    </div>
                  </div>

                  <div className="penalty-metric-card">
                    <span className="metric-label">Section 50(1) Interest</span>
                    <strong className="metric-value">{formatINR(gstPenaltyCalculation.interest)}</strong>
                    <span className="metric-note">
                      18% p.a. pro-rata on net cash liability ({formatINR(netCashLiability)})
                    </span>
                    <div className="split-pills">
                      <span>Accruing Daily</span>
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

              {/* Action Bar */}
              <div className="tool-cta-actions">
                <button type="button" className="btn-tool-consult" onClick={handleConsultDesk}>
                  <span className="btn-icon-wrap"><i className="fas fa-paper-plane"></i></span>
                  <span>Engage GST Desk Before Notice</span>
                  <i className="fas fa-arrow-right btn-arrow"></i>
                </button>
                <button type="button" className="btn-tool-share" onClick={handleShareCalculation}>
                  <span className="btn-icon-wrap"><i className="fab fa-whatsapp"></i></span>
                  <span>Share Estimate</span>
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
              <div className="tool-card-box">
                <div className="tool-card-header">
                  <div className="tool-icon-circle">
                    <i className="fas fa-coins"></i>
                  </div>
                  <div>
                    <h3>Advance Tax Estimation</h3>
                    <span className="card-subtext">Section 208/211 Income Tax Act, 1961</span>
                  </div>
                </div>

                <div className="tool-form-body">
                  <div className="form-group-tax">
                    <div className="tax-label-row">
                      <label htmlFor="adv-tax-input">Total Estimated Tax for FY 2024-25 (₹)</label>
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
                        value={Math.min(2000000, Math.max(0, estimatedAnnualTax || 0))}
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
                      <span className="presets-label">Presets:</span>
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
                      <span className="tax-cap-hint">TDS deducted by payers</span>
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
                      <span className="presets-label">Quick:</span>
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
                          <span className="inst-sub">Cumulative {inst.percentage}</span>
                        </div>
                      </div>

                      <div className="inst-col-amounts">
                        <div className="inst-amount-box">
                          <span className="inst-amt-label">Installment Due</span>
                          <strong className="inst-inc-val">{formatINR(inst.incrementalDue)}</strong>
                        </div>
                        <div className="inst-amount-box">
                          <span className="inst-amt-label">Total Cumulative Paid</span>
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

              {/* Action Bar */}
              <div className="tool-cta-actions">
                <button type="button" className="btn-tool-consult" onClick={handleConsultDesk}>
                  <span className="btn-icon-wrap"><i className="fas fa-calculator"></i></span>
                  <span>Schedule Advance Tax Filing</span>
                  <i className="fas fa-arrow-right btn-arrow"></i>
                </button>
                <button type="button" className="btn-tool-share" onClick={handleShareCalculation}>
                  <span className="btn-icon-wrap"><i className="fab fa-whatsapp"></i></span>
                  <span>Share Schedule</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trust & Methodology Disclaimer */}
      <section className="tools-methodology-section">
        <div className="container">
          <div className="methodology-card">
            <div className="meth-header">
              <i className="fas fa-book-open"></i>
              <h4>Statutory Basis &amp; Calculation Methodology</h4>
            </div>
            <p>
              Calculations on this portal are based on the Finance (No. 2) Act, 2024 (Budget 2024) effective for Assessment Year 2025-26, the Income Tax Act, 1961, and notifications issued under Section 47 and Section 50 of the Central Goods &amp; Services Tax (CGST) Act, 2017. Results are computed strictly for indicative assessment. Final tax liability, surcharge thresholds (for high net worth individuals), and MAT/AMT provisions are customized during formal client advisory sessions by senior Chartered Accountants at <strong>Shree Chamunda Associates</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaxTools;
