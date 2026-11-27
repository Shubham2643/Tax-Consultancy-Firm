export const WORKBENCH_TABS = [
  { id: 'overview', num: '01', label: 'Scope & Deliverables', shortLabel: 'Overview', icon: 'fa-solid fa-layer-group' },
  { id: 'documents', num: '02', label: 'Documents Checklist', shortLabel: 'Documents', icon: 'fa-solid fa-clipboard-check' },
  { id: 'roadmap', num: '03', label: 'Filing Workflow', shortLabel: 'Workflow', icon: 'fa-solid fa-diagram-project' },
  { id: 'eligibility', num: '04', label: 'Eligibility & Continuity', shortLabel: 'Eligibility', icon: 'fa-solid fa-user-shield' },
];

export const CAPITAL_SLABS = [
  { id: '10L', label: '₹10 Lakh', sub: 'Standard MSME' },
  { id: '15L', label: '₹15 Lakh', sub: 'Zero Part-B Fee' },
  { id: '25L', label: '₹25 Lakh', sub: 'Growth Slab' },
  { id: '50L', label: '₹50 Lakh', sub: 'Corporate Capital' },
];

export const TURNOVER_TIERS = [
  { id: 'micro', label: '< ₹20L', sub: 'Solo / Freelance' },
  { id: 'sme', label: '₹20L–1.5Cr', sub: 'Active SME' },
  { id: 'mid', label: '₹1.5Cr–5Cr', sub: 'Growth Entity' },
  { id: 'enterprise', label: '> ₹5Cr', sub: 'Audit / Multi-State' },
];

export const FILING_FREQUENCIES = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'annual', label: 'Annual' },
];

export const CATEGORY_MAP = {
  startup: { label: 'Startup & Corporate Law', icon: 'fa-solid fa-rocket', code: 'CORP' },
  registration: { label: 'Statutory Licensing', icon: 'fa-solid fa-stamp', code: 'LIC' },
  tax: { label: 'Taxation & Regulatory', icon: 'fa-solid fa-file-invoice-dollar', code: 'TAX' },
  accounting: { label: 'Assurance & Accounts', icon: 'fa-solid fa-calculator', code: 'ACC' },
  general: { label: 'Corporate Advisory', icon: 'fa-solid fa-landmark', code: 'ADV' },
};

/**
 * Aligned with PricingSection STATUTORY_RETAINERS (INR 2,999 / 5,999 / 24,999 monthly base).
 */
const INDICATIVE_RETAINER_TIERS = {
  micro: { monthly: 2999, quarterly: 7999, annual: 2499, tierName: 'Foundational Practice' },
  sme: { monthly: 5999, quarterly: 15999, annual: 4999, tierName: 'Corporate & MSME' },
  mid: { monthly: 11999, quarterly: 31999, annual: 9999, tierName: 'Growth Multi-GSTIN' },
  enterprise: { monthly: 24999, quarterly: 64999, annual: 20999, tierName: 'Enterprise Virtual CFO' },
};

const COMPLEMENTARY_TYPE_MAP = {
  accounting: ['tax', 'startup'],
  tax: ['accounting', 'registration'],
  startup: ['registration', 'tax', 'accounting'],
  registration: ['tax', 'startup', 'accounting'],
  general: ['accounting', 'tax'],
};

/**
 * Derive governing statute, regulatory authority, portal, and watermark metadata for a service.
 */
export function getStatutoryAuthority(title, type) {
  const t = (title || '').toLowerCase();
  const tp = (type || '').toLowerCase();

  if (t.includes('pvt') || t.includes('private limited') || t.includes('llp') || t.includes('opc') || tp === 'startup') {
    return {
      authority: 'Ministry of Corporate Affairs (MCA)',
      statute: 'Companies Act, 2013',
      portal: 'MCA-21 SPICe+ CRC',
      badge: 'MCA-21 Regulatory Filing',
      watermark: 'INCORPORATE',
    };
  }
  if (t.includes('gst') || t.includes('lut') || t.includes('gstr')) {
    return {
      authority: 'Goods & Services Tax Network (GSTN)',
      statute: 'Central GST Act, 2017 (Sec 22-25)',
      portal: 'gst.gov.in Official Portal',
      badge: 'GSTN Statutory Compliance',
      watermark: 'INDIRECT TAX',
    };
  }
  if (t.includes('itr') || t.includes('tax return') || t.includes('personal tax') || tp === 'tax') {
    return {
      authority: 'Income Tax Department (CBDT)',
      statute: 'Income-tax Act, 1961 (Sec 139)',
      portal: 'e-Filing 2.0 Portal',
      badge: 'Direct Tax Compliance',
      watermark: 'INCOME TAX',
    };
  }
  if (t.includes('audit') || t.includes('accounting') || t.includes('bookkeeping') || t.includes('payroll') || tp === 'accounting') {
    return {
      authority: 'Statutory Assurance Standard',
      statute: 'Standards on Auditing (SA 700) & Sec 128',
      portal: 'Cloud Ledger & Statutory Vault',
      badge: 'Assurance & Accounting',
      watermark: 'ASSURANCE',
    };
  }
  if (t.includes('iec') || t.includes('import')) {
    return {
      authority: 'Directorate General of Foreign Trade (DGFT)',
      statute: 'Foreign Trade (D&R) Act, 1992',
      portal: 'dgft.gov.in Portal',
      badge: 'Foreign Trade License',
      watermark: 'TRADE DESK',
    };
  }
  if (t.includes('msme') || t.includes('udyam')) {
    return {
      authority: 'Ministry of MSME, Govt of India',
      statute: 'MSMED Act, 2006',
      portal: 'udyamregistration.gov.in',
      badge: 'Central MSME Recognition',
      watermark: 'UDYAM DESK',
    };
  }
  return {
    authority: 'Central Statutory Registry',
    statute: 'Indian Regulatory Framework',
    portal: 'Official Government Gateway',
    badge: 'Statutory Practice Mandate',
    watermark: 'ADVISORY',
  };
}

/**
 * Return domain-specific post-filing continuity checkpoints for Tab 04.
 */
export function getPostFilingRoadmap(service, isIncorporation) {
  const tp = (service?.serviceType || '').toLowerCase();
  if (isIncorporation) {
    return {
      heading: 'Post-Incorporation Statutory Calendar',
      sub: 'Mandatory statutory registrations and corporate governance filings following incorporation:',
      items: [
        { tag: 'Within 30 Days', title: 'Corporate Bank Account', desc: 'Open current account backed by COI, PAN & Board Resolution.' },
        { tag: 'Within 30 Days', title: 'Statutory Appointment', desc: 'Formal statutory Form ADT-1 filing with Ministry of Corporate Affairs.' },
        { tag: 'Within 180 Days', title: 'Commencement Filing', desc: 'Mandatory paid-up capital declaration via Form INC-20A.' },
        { tag: 'Periodic Cycle', title: 'GST, TDS & Annual ROC', desc: 'Ongoing monthly/quarterly returns and annual AOC-4 / MGT-7 filings.' },
      ],
    };
  }
  if (tp === 'accounting') {
    return {
      heading: 'Recurring Ledger & Governance Cadence',
      sub: 'Synchronized monthly accounting checkpoints keeping your ledgers 100% audit-ready year-round:',
      items: [
        { tag: 'By 5th Monthly', title: 'Bank & Gateway Sync', desc: 'Dual-entry posting of all current accounts, UPI, and card statements.' },
        { tag: 'By 11th Monthly', title: 'GSTR-2B Vendor Matching', desc: 'Algorithmic ITC reconciliation prior to outward & GSTR-3B filings.' },
        { tag: 'By 7th Monthly', title: 'TDS Challan Remittance', desc: 'Sec 194C/194J withholding computations and timely treasury challans.' },
        { tag: 'Quarter Close', title: 'Trial Balance & MIS Pack', desc: 'Partner-reviewed P&L statements, aging schedules, and Sec 128 cloud archive.' },
      ],
    };
  }
  if (tp === 'tax') {
    return {
      heading: 'Post-Filing Assessment & Tax Hygiene',
      sub: 'Key direct and indirect tax follow-through actions after portal submission:',
      items: [
        { tag: 'Within 30 Days', title: 'Return E-Verification', desc: 'Immediate Aadhaar OTP / EV-code verification for valid return processing.' },
        { tag: 'Quarterly Review', title: 'AIS & Form 26AS Sync', desc: 'Continuous matching of high-value financial trails and TDS credits.' },
        { tag: '15th Jun / Sep / Dec', title: 'Advance Tax Calibration', desc: 'Quarterly profit projections under Sec 208–211 to prevent Sec 234B/C interest.' },
        { tag: '8-Year Custody', title: 'Scrutable Audit Archive', desc: 'Permanent storage of computation sheets, challans, and acknowledgements.' },
      ],
    };
  }
  return {
    heading: 'Post-Approval Compliance Continuity',
    sub: 'Essential operational steps to preserve regulatory good standing after license issuance:',
    items: [
      { tag: 'Day 1 Approval', title: 'Statutory Certificate Display', desc: 'Verify official seal, registration number, and premises display rules.' },
      { tag: 'Immediate', title: 'Credential & Portal Custody', desc: 'Secure archiving of login tokens, DSC validity, and approval PDFs.' },
      { tag: 'Recurring', title: 'Periodical Renewals', desc: 'Timely annual updates, LUT renewals, and statutory event modifications.' },
      { tag: 'On Demand', title: 'Modification & Notice Defense', desc: 'Partner representation for department queries or entity detail amendments.' },
    ],
  };
}

/**
 * Generate a tailored benefit summary line from its heading.
 */
export function getBenefitDescription(benefitTitle) {
  const b = (benefitTitle || '').toLowerCase();
  if (b.includes('deduction') || b.includes('optim') || b.includes('tax')) {
    return 'Legitimate tax structuring under governing statutes to protect cash flow and minimize liability.';
  }
  if (b.includes('penalty') || b.includes('scrutiny') || b.includes('notice') || b.includes('complian')) {
    return 'Cross-verification against central statutory databases to eliminate defect notices and late fees.';
  }
  if (b.includes('bank') || b.includes('credit') || b.includes('loan') || b.includes('dossier')) {
    return 'Clean, bank-grade financial documentation recognized cleanly for credit approvals and tenders.';
  }
  if (b.includes('vault') || b.includes('archival') || b.includes('record') || b.includes('control')) {
    return 'Encrypted Section 128 cloud recordkeeping with round-the-clock retrieval of ledgers and challans.';
  }
  if (b.includes('partner') || b.includes('supervis') || b.includes('vet')) {
    return 'Senior corporate advisory review on every schedule and filing before portal upload.';
  }
  return 'Complete adherence to regulatory circulars ensuring clean statutory standing at every stage.';
}

/**
 * Generate a concrete sub-caption for each tangible deliverable card.
 */
export function getDeliverableSubtitle(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('profit') || t.includes('loss') || t.includes('financial statement') || t.includes('balance')) {
    return 'Structured monthly operating margin, revenue, and expense statements.';
  }
  if (t.includes('reconcil') || t.includes('bank')) {
    return 'Line-by-line statement matching resolving unrecorded entries and variances.';
  }
  if (t.includes('payable') || t.includes('receivable') || t.includes('ledger')) {
    return 'Updated vendor bills, customer receivables, and clear aging schedules.';
  }
  if (t.includes('expense') || t.includes('analytic') || t.includes('voucher')) {
    return 'Categorized overhead trends and verified input-credit voucher records.';
  }
  if (t.includes('salary') || t.includes('payslip') || t.includes('payroll')) {
    return 'Computed monthly salary registers and digitized employee pay statements.';
  }
  if (t.includes('pf') || t.includes('esic') || t.includes('24q') || t.includes('tds') || t.includes('challan')) {
    return 'Reconciled treasury payment challans and quarterly statutory return proofs.';
  }
  if (t.includes('incorporat') || t.includes('coi') || t.includes('certificate')) {
    return 'Official government registration certificate and permanent statutory ID record.';
  }
  if (t.includes('moa') || t.includes('aoa') || t.includes('agreement') || t.includes('deed')) {
    return 'Legally vetted constitutional charter drafted and stamped per current rules.';
  }
  if (t.includes('pan') || t.includes('tan') || t.includes('dsc')) {
    return 'Tax identification allotment and encrypted Class-3 digital signing keys.';
  }
  if (t.includes('gst') || t.includes('lut') || t.includes('return') || t.includes('itr')) {
    return 'Portal-verified return summary, computation sheet, and official receipt.';
  }
  if (t.includes('calendar') || t.includes('vault') || t.includes('archival')) {
    return 'Due-date alert schedule backed by encrypted 8-year digital portal custody.';
  }
  return 'Partner-verified statutory record delivered and archived in your Client Vault.';
}

/**
 * Assign a distinct FontAwesome 6 icon per related service card to avoid horizontal repetition.
 */
export function getRelatedServiceIcon(rel) {
  const t = (rel?.title || '').toLowerCase();
  if (t.includes('payroll') || t.includes('pf') || t.includes('esic')) return 'fa-solid fa-users-gear';
  if (t.includes('setup') || t.includes('system')) return 'fa-solid fa-laptop-code';
  if (t.includes('statement') || t.includes('balance') || t.includes('financial')) return 'fa-solid fa-chart-pie';
  if (t.includes('gst') || t.includes('lut')) return 'fa-solid fa-percent';
  if (t.includes('tds')) return 'fa-solid fa-receipt';
  if (t.includes('tax') || t.includes('itr')) return 'fa-solid fa-file-invoice-dollar';
  if (t.includes('audit')) return 'fa-solid fa-magnifying-glass-chart';
  if (t.includes('company') || t.includes('llp') || t.includes('incorporat')) return 'fa-solid fa-building-columns';
  if (t.includes('trademark') || t.includes('msme') || t.includes('iec')) return 'fa-solid fa-certificate';
  return (CATEGORY_MAP[rel?.serviceType] || CATEGORY_MAP.general).icon;
}

/**
 * Select 2 same-category adjacent services + 1 complementary cross-category compliance when available.
 */
export function selectBundledServices(allServices, currentService) {
  if (!Array.isArray(allServices) || !currentService) return [];

  const others = allServices.filter(
    (s) => s._id !== currentService._id && s.slug !== currentService.slug
  );
  const sameCategory = others.filter((s) => s.serviceType === currentService.serviceType);
  const complementaryTypes = COMPLEMENTARY_TYPE_MAP[currentService.serviceType] || ['tax', 'accounting'];
  const crossCategory = others.filter((s) => complementaryTypes.includes(s.serviceType));

  const picked = [];
  const seen = new Set();
  const pushUnique = (item) => {
    if (!item) return;
    const key = item.slug || item._id || item.title;
    if (seen.has(key)) return;
    seen.add(key);
    picked.push(item);
  };

  // Pick up to 2 close peers + 1 natural adjacent category mandate for diverse bundling.
  sameCategory.slice(0, 2).forEach(pushUnique);
  if (crossCategory.length > 0) {
    pushUnique(crossCategory[0]);
  }
  // Fill remaining up to 3 from same-category or general pool.
  sameCategory.slice(2).forEach((s) => {
    if (picked.length < 3) pushUnique(s);
  });
  others.forEach((s) => {
    if (picked.length < 3) pushUnique(s);
  });

  return picked.slice(0, 3);
}

/**
 * Calculate either structured statutory fees or indicative retainer pricing for a service mandate.
 */
export function calculateMandatePricing(service, isIncorporation, { capitalSlab, directorCount, turnoverTier, filingFrequency }) {
  const baseGovtFee = service?.governmentFee || 0;
  const baseProfFee = service?.professionalFee || 0;
  const hasStructuredFees = baseGovtFee > 0 || baseProfFee > 0;

  let calculatedGovtFee = baseGovtFee;
  let calculatedProfFee = baseProfFee;

  if (isIncorporation && baseProfFee > 0) {
    if (capitalSlab === '1L' || capitalSlab === '10L' || capitalSlab === '15L') {
      calculatedGovtFee = 1500;
    } else if (capitalSlab === '25L') {
      calculatedGovtFee = 1500 + 36000;
    } else if (capitalSlab === '50L') {
      calculatedGovtFee = 2500 + 72000;
    }
    if (directorCount > 2) {
      calculatedProfFee += (directorCount - 2) * 1500;
    }
  } else if (!isIncorporation && baseProfFee > 0) {
    if (turnoverTier === 'micro') calculatedProfFee = Math.round(baseProfFee * 0.85);
    else if (turnoverTier === 'mid') calculatedProfFee = Math.round(baseProfFee * 1.5);
    else if (turnoverTier === 'enterprise') calculatedProfFee = Math.round(baseProfFee * 2.2);

    if (filingFrequency === 'monthly') calculatedProfFee = Math.round(calculatedProfFee * 1.8);
    else if (filingFrequency === 'quarterly') calculatedProfFee = Math.round(calculatedProfFee * 1.3);
  }

  const totalMandateFee = calculatedGovtFee + calculatedProfFee;

  // Indicative retainer figures for ongoing/retainer mandates without fixed DB fee entries.
  const tierPricing = INDICATIVE_RETAINER_TIERS[turnoverTier] || INDICATIVE_RETAINER_TIERS.sme;
  const freqAmount = tierPricing[filingFrequency] || tierPricing.monthly;
  const freqUnit = filingFrequency === 'quarterly' ? '/qtr' : '/mo';
  const billingNote =
    filingFrequency === 'annual'
      ? 'Effective monthly rate on annual retainer'
      : filingFrequency === 'quarterly'
        ? 'Consolidated quarterly retainer pack'
        : 'Monthly cloud bookkeeping & statutory pack';

  const heroMandateFeeLabel = hasStructuredFees
    ? `Est. ₹${totalMandateFee.toLocaleString('en-IN')}+`
    : `From ₹${freqAmount.toLocaleString('en-IN')}${freqUnit}`;

  return {
    hasStructuredFees,
    calculatedGovtFee,
    calculatedProfFee,
    totalMandateFee,
    indicativeAmount: freqAmount,
    indicativeUnit: freqUnit,
    indicativeTierName: tierPricing.tierName,
    indicativeBillingNote: billingNote,
    heroMandateFeeLabel,
  };
}

/**
 * Open a clean A4-formatted printable statutory document checklist in a popup window.
 */
export function printChecklistDocument(title, docs, docReadiness) {
  const printWin = window.open('', '_blank', 'width=850,height=950');
  if (!printWin) {
    window.print();
    return;
  }

  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Compliance Document Checklist - ${title} - Shree Chamunda Associates</title>
      <style>
        @page { size: A4 portrait; margin: 16mm; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #071324; margin: 0; padding: 24px; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #d4af37; padding-bottom: 16px; margin-bottom: 24px; }
        .firm-name { font-size: 20px; font-weight: 800; color: #071324; text-transform: uppercase; letter-spacing: 0.5px; }
        .firm-desc { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-top: 3px; }
        .firm-meta { text-align: right; font-size: 11px; color: #334155; line-height: 1.45; }
        .doc-badge { display: inline-block; background: #fffbeb; color: #9a6c04; border: 1px solid #d4af37; font-size: 10px; font-weight: 750; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .title { font-size: 22px; font-weight: 800; color: #071324; margin: 0 0 8px 0; }
        .lead { font-size: 13px; color: #475569; margin: 0 0 24px 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f8fafc; color: #071324; padding: 10px 12px; text-align: left; font-size: 11.5px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; border-top: 1px solid #e2e8f0; }
        td { padding: 11px 12px; border-bottom: 1px solid #edf2f7; font-size: 12.5px; }
        .box { width: 16px; height: 16px; border: 1.5px solid #071324; border-radius: 3px; display: inline-block; text-align: center; line-height: 16px; font-size: 11px; font-weight: bold; }
        .box.checked { background: #071324; color: #f8b400; }
        .notes-box { border: 1.5px dashed #cbd5e1; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; min-height: 70px; }
        .notes-box strong { font-size: 11.5px; color: #071324; text-transform: uppercase; display: block; margin-bottom: 4px; }
        .footer { border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10.5px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="firm-name">Shree Chamunda Associates</div>
          <div class="firm-desc">Corporate Tax &amp; Advisory Chambers</div>
        </div>
        <div class="firm-meta">
          612, Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad - 380049<br/>
          Advisory Hotline: +91 95109 84735 &bull; shreechamundaassociates0905@gmail.com
        </div>
      </div>
      <span class="doc-badge">Official Statutory Document Verification Docket</span>
      <h1 class="title">${title}</h1>
      <p class="lead">Please assemble the following mandatory statutory KYC and entity records for portal filing. Digital scans may be submitted directly or presented at our Nikol Chambers.</p>
      <table>
        <thead>
          <tr>
            <th style="width: 44px; text-align: center;">Ready</th>
            <th style="width: 36px;">#</th>
            <th>Mandatory Statutory Record</th>
            <th style="width: 130px; text-align: center;">Original Inspected</th>
            <th style="width: 130px; text-align: center;">Digital PDF Archival</th>
          </tr>
        </thead>
        <tbody>
          ${docs.map((doc, idx) => `
            <tr>
              <td style="text-align: center;"><span class="box ${docReadiness[doc] ? 'checked' : ''}">${docReadiness[doc] ? '&#10003;' : ''}</span></td>
              <td style="color: #64748b; font-weight: 600;">${idx + 1}</td>
              <td><strong>${doc}</strong></td>
              <td style="text-align: center; color: #94a3b8;">[&nbsp;&nbsp;&nbsp;&nbsp;]</td>
              <td style="text-align: center; color: #94a3b8;">[&nbsp;&nbsp;&nbsp;&nbsp;]</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="notes-box">
        <strong>Advisory Verification Notes &amp; Client File Docket:</strong>
      </div>
      <div class="footer">
        <span>Date Issued: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        <span>Shree Chamunda Associates &bull; Statutory Client File Confidential</span>
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWin.document.close();
}
