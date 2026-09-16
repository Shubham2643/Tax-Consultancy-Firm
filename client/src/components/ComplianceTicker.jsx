import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ComplianceTicker.css';

const COMPLIANCE_DEADLINES = [
  {
    id: 1,
    badge: 'ADVANCE TAX',
    badgeType: 'urgent',
    date: '15 Sep',
    title: 'Advance Tax Q2 (FY 24-25)',
    mobileTitle: 'Advance Tax Q2 Due',
    description: 'Mandatory second installment (45% cumulative) for all eligible corporate & individual taxpayers.',
    statute: 'Sec 208/211 Income Tax Act',
    actionText: 'Calculate Advance Tax',
    link: '/tax-tools?tool=advance-tax',
  },
  {
    id: 2,
    badge: 'GST RETURN',
    badgeType: 'warning',
    date: '20 Sep',
    title: 'GSTR-3B Monthly Return',
    mobileTitle: 'GSTR-3B Return Due',
    description: 'Monthly summary return & net cash liability payment with GSTR-2B inward ITC reconciliation.',
    statute: 'CGST Act Sec 39',
    actionText: 'Estimate GST Late Fee',
    link: '/tax-tools?tool=gst-fee',
  },
  {
    id: 3,
    badge: 'TDS / TCS',
    badgeType: 'info',
    date: '07 Oct',
    title: 'Monthly Challan 281 Deposit',
    mobileTitle: 'TDS Challan 281 Due',
    description: 'Statutory deposit of tax deducted at source (TDS) under Salaries, Contractors & Professional fees.',
    statute: 'Sec 200(1) Income Tax Act',
    actionText: 'Book TDS Filing',
    link: '/services/tds-return-filing',
  },
  {
    id: 4,
    badge: 'TAX AUDIT',
    badgeType: 'urgent',
    date: '31 Oct',
    title: 'Section 44AB Tax Audit Report',
    mobileTitle: 'Sec 44AB Audit Due',
    description: 'Mandatory electronic submission of Form 3CA/3CB-3CD for corporate & eligible business entities.',
    statute: 'Sec 44AB Income Tax Act',
    actionText: 'Schedule Audit Desk',
    link: '/services/income-tax-audit-44ab',
  },
  {
    id: 5,
    badge: 'ROC FILING',
    badgeType: 'info',
    date: '30 Nov',
    title: 'MCA Annual Governance (AOC-4)',
    mobileTitle: 'MCA Annual Filing Due',
    description: 'Annual statutory financial statement filing on MCA 21 portal for all incorporated companies.',
    statute: 'Companies Act, 2013',
    actionText: 'Consult ROC Advisor',
    link: '/services/annual-roc-filings',
  },
];

const ComplianceTicker = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [mobileIdx, setMobileIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMobileIdx((prev) => (prev + 1) % COMPLIANCE_DEADLINES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  if (isDismissed) return null;

  const currentItem = COMPLIANCE_DEADLINES[mobileIdx];

  return (
    <div 
      className="compliance-ticker-strip" 
      aria-label="Statutory Compliance & Due Date Ticker"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* DESKTOP VIEW (> 768px): Seamless Infinite Scrolling Marquee */}
      <div className="compliance-ticker-container desktop-ticker-view">
        {/* Left Status Beacon & Kicker */}
        <div className="compliance-ticker-header">
          <span className="ticker-live-beacon" aria-hidden="true">
            <span className="beacon-ping"></span>
            <span className="beacon-core"></span>
          </span>
          <div className="ticker-label-group">
            <span className="ticker-title">LIVE COMPLIANCE RADAR</span>
            <span className="ticker-sub">Statutory Deadlines</span>
          </div>
        </div>

        {/* Scrolling Deadlines Marquee */}
        <div className="compliance-marquee-wrapper">
          <div className={`compliance-marquee-track ${isPaused ? 'marquee-paused' : ''}`}>
            {/* Duplicated list for seamless infinite loop */}
            {[...COMPLIANCE_DEADLINES, ...COMPLIANCE_DEADLINES].map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="compliance-ticker-item">
                <span className={`compliance-pill-badge badge-${item.badgeType}`}>
                  {item.badge}
                </span>
                <span className="compliance-date-chip">
                  <i className="far fa-calendar-alt"></i>
                  <strong>{item.date}</strong>
                </span>
                <span className="compliance-item-name">{item.title}</span>
                <span className="compliance-statute-tag">{item.statute}</span>
                <Link to={item.link} className="compliance-inline-action">
                  <span>{item.actionText}</span>
                  <i className="fas fa-chevron-right"></i>
                </Link>
                <span className="compliance-item-sep">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Tools Hub CTA & Dismiss */}
        <div className="compliance-ticker-tools">
          <Link to="/tax-tools" className="ticker-tools-btn" title="Open Interactive Tax & Late Fee Calculators">
            <i className="fas fa-calculator"></i>
            <span>Tax Tools Hub</span>
          </Link>
          <button 
            type="button" 
            className="ticker-dismiss-btn" 
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss compliance ticker"
            title="Dismiss ticker for this session"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* MOBILE VIEW (<= 768px): Dedicated Full-Width Rotating Due Date Pill */}
      <div className="compliance-ticker-container mobile-ticker-view">
        {/* Dynamic Rotating Single-Item Card with Integrated Beacon Date Pill */}
        <div className="mobile-item-carousel">
          <Link 
            key={currentItem.id} 
            to={currentItem.link} 
            className="mobile-item-chip-link"
            title={`${currentItem.title} (${currentItem.date}) - Tap to open statutory tool`}
          >
            {/* Live Beacon Integrated Date Badge */}
            <span className={`mobile-radar-date-badge badge-${currentItem.badgeType}`}>
              <span className="ticker-live-beacon" aria-hidden="true">
                <span className="beacon-ping"></span>
                <span className="beacon-core"></span>
              </span>
              <span>{currentItem.date}</span>
            </span>

            {/* Crystal Clear Full Due Date Title */}
            <span className="mobile-item-title">
              {currentItem.mobileTitle || currentItem.title}
            </span>

            <i className="fas fa-chevron-right mobile-arrow-icon" aria-hidden="true"></i>
          </Link>
        </div>

        {/* Compact Tool & Dismiss Actions */}
        <div className="mobile-ticker-actions">
          <Link to="/tax-tools" className="mobile-tools-btn" title="Open Tax Tools Hub" aria-label="Tax Tools">
            <i className="fas fa-calculator"></i>
          </Link>
          <button 
            type="button" 
            className="ticker-dismiss-btn" 
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss compliance ticker"
            title="Dismiss ticker"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceTicker;
