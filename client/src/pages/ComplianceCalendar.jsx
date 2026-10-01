import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useSiteContext } from '../context/SiteContext';
import './ComplianceCalendar.css';

// Master Statutory Compliance Deadlines for FY 2024-25 & 2025-26
const STATUTORY_DEADLINES = [
  // MONTHLY RECURRING
  {
    id: 'tds-monthly',
    day: '07',
    month: 'Every Month',
    title: 'TDS & TCS Challan 281 Deposit',
    category: 'Income Tax',
    badgeType: 'urgent',
    statute: 'Section 200(1) / Rule 30 of Income Tax Act, 1961',
    applicability: 'All corporate and business deductors who deducted tax at source in the previous calendar month.',
    consequence: 'Interest penalty @ 1.5% per month under Section 201(1A) from the date of deduction till actual payment.',
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
    statute: 'Section 37 of CGST Act, 2017 & Rule 59',
    applicability: 'Regular GST registered taxpayers with aggregate turnover exceeding ₹5 Crores or opting for monthly filing.',
    consequence: 'Late fee of ₹50/day (₹20/day for Nil return) up to ₹10,000 under Section 47. Blocks e-way bill generation.',
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
    statute: 'Rule 59(2) of CGST Rules, 2017',
    applicability: 'Small taxpayers opted under QRMP scheme to pass input tax credit (B2B invoices) to buyers for the first 2 months of quarter.',
    consequence: 'Buyer cannot view inward invoices in GSTR-2B; credit remains blocked for recipient.',
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
    statute: 'Employees Provident Fund Act, 1952 & ESI Act, 1948',
    applicability: 'Establishments employing 20+ persons (PF) or 10+ persons (ESIC) paying wages up to ₹21,000.',
    consequence: 'Damages under Section 14B up to 25% p.a. + penal interest under Section 7Q. Non-deposit of employee share is a criminal breach of trust.',
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
    statute: 'Section 39 of CGST Act, 2017 & Rule 61',
    applicability: 'Mandatory for all regular registered taxpayers to discharge monthly output tax after adjusting GSTR-2B ITC.',
    consequence: 'Late fee ₹50/day + 18% per annum penal interest on net cash tax liability under Section 50. Suspension of GSTIN if delayed > 30 days.',
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
    statute: 'Section 39(1) of CGST Act (QRMP Scheme)',
    applicability: 'Quarterly filers located in Gujarat, Maharashtra, Goa, and Southern States with turnover up to ₹5 Crores.',
    consequence: 'Late fee ₹50/day up to ₹5,000 + 18% interest on deferred tax payments.',
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
    statute: 'Gujarat State Tax on Professions, Trades, Callings & Employments Act, 1976',
    applicability: 'Employers in Gujarat deducting Professional Tax from employee monthly salaries (salaries > ₹12,000/mo).',
    consequence: '18% interest per annum on delayed remittance + monetary penalties levied by municipal corporation.',
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
    statute: 'Section 208 & 211(1)(a) of Income Tax Act, 1961',
    applicability: 'All taxpayers (corporate, LLP, firm, individuals) whose estimated annual net tax liability exceeds ₹10,000.',
    consequence: 'Mandatory interest penalty @ 1% per month for 3 months under Section 234C on the shortfall.',
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
    statute: 'Section 139(1) of Income Tax Act, 1961',
    applicability: 'Individuals, salaried employees, HUFs, partnership firms not subject to statutory tax audit under Section 44AB.',
    consequence: 'Late fee up to ₹5,000 under Section 234F + 1% per month interest under Section 234A. Complete forfeiture of carry-forward losses.',
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
    statute: 'Section 200(3) & Rule 31A (Form 24Q & 26Q)',
    applicability: 'All entities withholding tax on salary, contract, rent, or professional fees in Q1.',
    consequence: 'Late filing fee of ₹200 per day under Section 234E + penalty up to ₹1,00,000 under Section 271H.',
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
    statute: 'Section 208 & 211(1)(b) of Income Tax Act, 1961',
    applicability: 'Cumulative 45% of estimated total direct tax liability must be deposited via Challan 280.',
    consequence: '1% per month penal interest under Section 234C on deficit below 36% of total tax liability.',
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
    statute: 'Rule 12A of Companies (Appointment and Qualification of Directors) Rules, 2014',
    applicability: 'Every individual holding an approved Director Identification Number (DIN / DPIN) allotted by MCA on or before 31st March.',
    consequence: 'Hefty late fee of ₹5,000 per DIN. Immediate deactivation of DIN, disqualifying director from signing financial statements or MCA filings.',
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
    statute: 'Section 44AB of Income Tax Act, 1961',
    applicability: 'Business turnover > ₹1 Crore (or ₹10 Crores if 95% transactions are digital) and Professionals with gross receipts > ₹50 Lakhs.',
    consequence: 'Severe penalty under Section 271B equal to 0.5% of turnover or ₹1,50,000, whichever is less.',
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
    statute: 'Section 200(3) (Form 24Q & 26Q)',
    applicability: 'All corporate and non-corporate entities deducting tax at source in the July-September quarter.',
    consequence: '₹200 per day statutory late fee under Section 234E until return is uploaded.',
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
    statute: 'Section 137 of Companies Act, 2013 & Rule 12',
    applicability: 'All registered Private Limited, OPC, and Public Limited companies within 30 days of Annual General Meeting (AGM).',
    consequence: 'Late fee of ₹100 per day per form with no upper ceiling. Company and defaulting directors liable for fine under Section 137(3).',
    actionUrl: '/contact',
    actionText: 'File AOC-4 with CA',
  },
  {
    id: 'mgt7-mca',
    day: '29',
    month: 'November',
    title: 'MCA Annual Return (Form MGT-7 / MGT-7A)',
    category: 'MCA & ROC',
    badgeType: 'critical',
    statute: 'Section 92 of Companies Act, 2013 & Rule 11',
    applicability: 'Every incorporated company within 60 days of holding the Annual General Meeting.',
    consequence: '₹100 per day continuing penalty without upper limit. Defaulters risk strike-off notices under Section 248.',
    actionUrl: '/contact',
    actionText: 'File MGT-7 with CA',
  },
  {
    id: 'adv-tax-q3',
    day: '15',
    month: 'December',
    title: 'Advance Tax 3rd Installment (75% Cumulative)',
    category: 'Income Tax',
    badgeType: 'urgent',
    statute: 'Section 208 & 211(1)(c) of Income Tax Act, 1961',
    applicability: 'Cumulative 75% of total estimated annual tax liability must be discharged.',
    consequence: '1% per month interest under Section 234C on deficit below 75% installment.',
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
    statute: 'Section 44 of CGST Act, 2017 & Rule 80',
    applicability: 'GSTR-9 mandatory for turnover > ₹2 Crores; GSTR-9C self-certified reconciliation statement for turnover > ₹5 Crores.',
    consequence: 'Late fee of ₹200/day (₹50/day for turnover up to ₹5 Cr) under Section 47. Departmental scrutiny under Section 61.',
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
    statute: 'Section 208 & 211(1)(d) of Income Tax Act, 1961',
    applicability: 'Final 100% settlement of estimated tax for the financial year before year-end close.',
    consequence: 'Triggers both Section 234C interest and continuing Section 234B interest (1% per month until full payment).',
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
    statute: 'Section 139(4) & 139(5) of Income Tax Act, 1961',
    applicability: 'Last date to submit missed returns or rectify computational errors for the preceding Assessment Year.',
    consequence: 'After March 31, return cannot be filed online under Section 139; only Section 139(8A) Updated Return (ITR-U) with up to 50% additional tax is allowed.',
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
    statute: 'Rule 25(1) of LLP Rules, 2009',
    applicability: 'All Limited Liability Partnerships (LLPs) registered on or before 30th September of preceding year.',
    consequence: 'Late fee of ₹100 per day without limit until filed on MCA portal.',
    actionUrl: '/contact',
    actionText: 'File LLP Form 11',
  },
];

const CATEGORIES = ['All', 'Income Tax', 'GST', 'MCA & ROC', 'Labour & Payroll'];
const MONTHS = ['All Months', 'Every Month', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];

const ComplianceCalendar = () => {
  const { settings } = useSiteContext();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const phone = settings?.phone || '+91 95109 84735';
  const cleanPhone = '919510984735';

  useSEO({
    title: 'Statutory Compliance & Due Date Calendar 2024-25 | Shree Chamunda Associates',
    description: 'Comprehensive tax and MCA regulatory compliance calendar: GSTR-1, GSTR-3B, Advance Tax, TDS Challan 281, Section 44AB audits, DIR-3 KYC, and AOC-4 filing due dates.',
  });

  const filteredDeadlines = useMemo(() => {
    return STATUTORY_DEADLINES.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchMonth = selectedMonth === 'All Months' || item.month === selectedMonth;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.statute.toLowerCase().includes(q) ||
        item.applicability.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchMonth && matchQuery;
    });
  }, [selectedCategory, selectedMonth, searchQuery]);

  const handleAddToGoogleCalendar = (item) => {
    const title = encodeURIComponent(`Statutory Due Date: ${item.title}`);
    const details = encodeURIComponent(
      `Statute: ${item.statute}\nApplicability: ${item.applicability}\nConsequences: ${item.consequence}\nAssisted by Shree Chamunda Associates (Chartered Accountants): +91 95109 84735`
    );
    const location = encodeURIComponent('Government Portals (GSTN / MCA / Income Tax)');
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank');
  };

  const handleCopyDetails = (item) => {
    const text = `📌 STATUTORY COMPLIANCE DEADLINE\nDue Date: ${item.day} ${item.month}\nFiling: ${item.title}\nCategory: ${item.category}\nStatute: ${item.statute}\nPenalty: ${item.consequence}\nAdvisory Desk: Shree Chamunda Associates (+91 95109 84735)`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  return (
    <div className="compliance-calendar-page fade-in">
      {/* 1. HERO BANNER */}
      <section className="calendar-hero" aria-labelledby="calendar-hero-title">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="calendar-hero-glow glow-gold" aria-hidden="true"></div>
        <div className="calendar-hero-glow glow-emerald" aria-hidden="true"></div>

        <div className="container">
          <div className="calendar-hero-badge">
            <span className="live-dot pulse"></span>
            <i className="fas fa-calendar-check"></i>
            <span>STATUTORY COMPLIANCE RADAR &bull; ZERO PENALTY ASSURANCE</span>
          </div>

          <h1 id="calendar-hero-title">
            Statutory Due Dates &amp; <span className="hero-gradient-text">Compliance Calendar</span>
          </h1>

          <p className="calendar-hero-lead">
            Comprehensive regulatory roadmap across Income Tax, GST, MCA Company Governance, and Labour Laws.
            Stay ahead of statutory deadlines and safeguard your enterprise against late fees and interest penalties.
          </p>

          <div className="calendar-stats-ribbon">
            <div className="stat-ribbon-item">
              <span className="stat-num text-emerald">100%</span>
              <span className="stat-desc">Timely Filing Track Record</span>
            </div>
            <span className="stat-sep">&bull;</span>
            <div className="stat-ribbon-item">
              <span className="stat-num text-gold">4+</span>
              <span className="stat-desc">Regulatory Authorities Monitored</span>
            </div>
            <span className="stat-sep">&bull;</span>
            <div className="stat-ribbon-item">
              <span className="stat-num text-blue">&lt; 24h</span>
              <span className="stat-desc">Urgent Notice Response Desk</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE CONTROLS BAR */}
      <div className="calendar-controls-wrapper sticky-top">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="container calendar-controls-container">
          {/* Category Tabs */}
          <div className="calendar-category-tabs" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat}
                className={`cal-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>

          {/* Search & Month Filter */}
          <div className="calendar-filter-toolbar">
            <div className="cal-search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search GSTR-3B, Advance Tax, AOC-4, TDS..."
                className="cal-search-input"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="cal-search-clear">
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="cal-month-select"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. COMPLIANCE CARDS GRID */}
      <main className="container calendar-main-grid">
        <div className="calendar-results-meta">
          <span>Showing <strong>{filteredDeadlines.length}</strong> statutory compliance mandates</span>
          {(selectedCategory !== 'All' || selectedMonth !== 'All Months' || searchQuery) && (
            <button
              type="button"
              className="btn-clear-filters"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedMonth('All Months');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="deadlines-cards-stack">
          {filteredDeadlines.map((item) => (
            <div key={item.id} className={`deadline-card ${item.badgeType}`}>
              <div className="card-calendar-badge">
                <span className="badge-day">{item.day}</span>
                <span className="badge-month">{item.month}</span>
              </div>

              <div className="card-content-side">
                <div className="card-kicker-row">
                  <span className={`category-tag tag-${item.category.toLowerCase().replace(/[^a-z]/g, '')}`}>
                    {item.category}
                  </span>
                  <span className="statute-code-label">
                    <i className="fas fa-landmark"></i> {item.statute}
                  </span>
                </div>

                <h3 className="card-deadline-title">{item.title}</h3>

                <div className="card-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Who Must File:</span>
                    <p className="detail-text">{item.applicability}</p>
                  </div>

                  <div className="detail-item penalty-item">
                    <span className="detail-label text-warning">
                      <i className="fas fa-triangle-exclamation"></i> Consequence of Delay:
                    </span>
                    <p className="detail-text text-warning-muted">{item.consequence}</p>
                  </div>
                </div>

                <div className="card-actions-row">
                  <button
                    type="button"
                    className="btn-cal-action cal-google"
                    onClick={() => handleAddToGoogleCalendar(item)}
                    title="Add to Google Calendar"
                  >
                    <i className="far fa-calendar-plus"></i>
                    <span>Add to Google Cal</span>
                  </button>

                  <button
                    type="button"
                    className={`btn-cal-action cal-copy ${copiedId === item.id ? 'copied' : ''}`}
                    onClick={() => handleCopyDetails(item)}
                    title="Copy details"
                  >
                    <i className={copiedId === item.id ? 'fas fa-check' : 'far fa-copy'}></i>
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <Link to={item.actionUrl} className="btn-cal-action cal-primary">
                    <span>{item.actionText}</span>
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 4. PENALTY RISK MATRIX */}
      <section className="container calendar-penalties-section">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="section-header-centered">
          <span className="about-eyebrow-tag">
            <i className="fas fa-shield-halved"></i>
            <span>FINANCIAL EXPOSURE AUDIT</span>
          </span>
          <h2>The True Cost of Deferred Filings</h2>
          <p className="section-subtext">
            Statutory authorities levy cascading daily late fees, penal interest, and corporate prosecution for delayed filings.
          </p>
        </div>

        <div className="penalties-matrix-grid">
          <div className="penalty-matrix-card">
            <div className="matrix-icon text-emerald"><i className="fas fa-receipt"></i></div>
            <h4>GST Act Penalties (Sec 47 &amp; 50)</h4>
            <ul>
              <li><strong>Late Fees:</strong> ₹50/day (₹25 CGST + ₹25 SGST) per day.</li>
              <li><strong>Interest:</strong> 18% p.a. on net cash tax liability.</li>
              <li><strong>E-Way Bill Block:</strong> Auto-blocked if returns delayed for 2 consecutive months.</li>
              <li><strong>GSTIN Cancellation:</strong> Department notice issued if non-compliant &gt; 6 months.</li>
            </ul>
          </div>

          <div className="penalty-matrix-card">
            <div className="matrix-icon text-gold"><i className="fas fa-calculator"></i></div>
            <h4>Income Tax Act (Sec 234F &amp; 234C)</h4>
            <ul>
              <li><strong>Late Filing Fee (234F):</strong> Up to ₹5,000 for delayed ITR submission.</li>
              <li><strong>Loss Forfeiture:</strong> Business &amp; capital losses cannot be carried forward.</li>
              <li><strong>Interest (234A/B/C):</strong> 1% per month cascading interest on tax dues.</li>
              <li><strong>Audit Penalty (271B):</strong> ₹1.5 Lakhs or 0.5% of turnover for delayed audit.</li>
            </ul>
          </div>

          <div className="penalty-matrix-card">
            <div className="matrix-icon text-blue"><i className="fas fa-building"></i></div>
            <h4>MCA / Companies Act (Sec 137 &amp; 92)</h4>
            <ul>
              <li><strong>No Upper Cap:</strong> ₹100 per day per form (AOC-4 &amp; MGT-7) with zero ceiling.</li>
              <li><strong>DIN Deactivation:</strong> ₹5,000 fine for delayed DIR-3 KYC + DIN freeze.</li>
              <li><strong>Strike-Off Danger:</strong> ROC registrar issues Section 248 removal notices.</li>
              <li><strong>Director Disqualification:</strong> 5-year corporate directorship disqualification.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. WHATSAPP ALERT LEAD CAPTURE & CTA */}
      <section className="container calendar-cta-section">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="calendar-cta-card">
          <div className="cta-left">
            <div className="cta-kicker">
              <span className="live-dot pulse"></span>
              <span>ZERO-PENALTY ASSURANCE DESK</span>
            </div>
            <h2>Never Miss a Statutory Deadline Again</h2>
            <p>
              Retain Shree Chamunda Associates for automated pre-reconciliation, prompt tax filing, and guaranteed zero late fees.
            </p>
          </div>

          <div className="cta-right">
            <Link to="/contact" className="btn-cta-primary">
              <i className="fas fa-calendar-check"></i>
              <span>Book Retainer Consultation</span>
            </Link>
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello CA Team, I would like to subscribe to free monthly Gujarat CA compliance due date alerts on WhatsApp.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta-wa"
            >
              <i className="fab fa-whatsapp"></i>
              <span>Subscribe on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComplianceCalendar;
