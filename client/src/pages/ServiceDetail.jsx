import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getServiceById, getServices, submitContact } from '../api';
import { findFallbackService, FALLBACK_SERVICES } from '../data/fallbackServices';
import useSEO from '../hooks/useSEO';
import './ServiceDetail.css';

const WORKBENCH_TABS = [
  { id: 'overview', num: '01', label: 'Scope & Deliverables', shortLabel: 'Overview', icon: 'fa-solid fa-layer-group' },
  { id: 'documents', num: '02', label: 'Documents Checklist', shortLabel: 'Documents', icon: 'fa-solid fa-clipboard-check' },
  { id: 'roadmap', num: '03', label: 'Filing Workflow', shortLabel: 'Workflow', icon: 'fa-solid fa-diagram-project' },
  { id: 'eligibility', num: '04', label: 'Eligibility & Continuity', shortLabel: 'Eligibility', icon: 'fa-solid fa-user-shield' },
];

const CAPITAL_SLABS = [
  { id: '10L', label: '₹10 Lakh', sub: 'Standard MSME' },
  { id: '15L', label: '₹15 Lakh', sub: 'Zero Part-B Fee' },
  { id: '25L', label: '₹25 Lakh', sub: 'Growth Slab' },
  { id: '50L', label: '₹50 Lakh', sub: 'Corporate Capital' },
];

const TURNOVER_TIERS = [
  { id: 'micro', label: '< ₹20L', sub: 'Solo / Freelance' },
  { id: 'sme', label: '₹20L–1.5Cr', sub: 'Active SME' },
  { id: 'mid', label: '₹1.5Cr–5Cr', sub: 'Growth Entity' },
  { id: 'enterprise', label: '> ₹5Cr', sub: 'Audit / Multi-State' },
];

const FILING_FREQUENCIES = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'annual', label: 'Annual' },
];

const CATEGORY_MAP = {
  startup: { label: 'Startup & Corporate Law', icon: 'fa-solid fa-rocket', code: 'CORP' },
  registration: { label: 'Statutory Licensing', icon: 'fa-solid fa-stamp', code: 'LIC' },
  tax: { label: 'Taxation & Regulatory', icon: 'fa-solid fa-file-invoice-dollar', code: 'TAX' },
  accounting: { label: 'Assurance & Accounts', icon: 'fa-solid fa-calculator', code: 'ACC' },
  general: { label: 'Corporate Advisory', icon: 'fa-solid fa-landmark', code: 'ADV' },
};

const getStatutoryAuthority = (title, type) => {
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
};

const getPostFilingRoadmap = (service, isIncorporation) => {
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
};

const getBenefitDescription = (benefitTitle) => {
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
};

const getDeliverableSubtitle = (title) => {
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
};

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Workbench Active Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // Mandate Intake Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    entityName: '',
    message: '',
  });
  const [attachedFile, setAttachedFile] = useState(null);
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  });

  // Interactive Document Checklist & FAQ Accordion State
  const [docReadiness, setDocReadiness] = useState({});
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [faqFilter, setFaqFilter] = useState('');

  // Dynamic Calibration Slabs
  const [capitalSlab, setCapitalSlab] = useState('10L');
  const [directorCount, setDirectorCount] = useState(2);
  const [turnoverTier, setTurnoverTier] = useState('sme');
  const [filingFrequency, setFilingFrequency] = useState('annual');

  useSEO({
    title: service ? `${service.title} | Statutory Dossier & Mandate` : 'Statutory Practice Dossier',
    description:
      service?.description ||
      'Shree Chamunda Associates statutory practice dossier covering scope, mandatory deliverables, documents, and engagement fees.',
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('overview');
  }, [id]);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const [res, allRes] = await Promise.all([
          getServiceById(id).catch((err) => ({ success: false, error: err.message })),
          getServices().catch(() => ({ data: [] })),
        ]);

        if (res?.success && res?.data) {
          setService(res.data);
          setOpenFaq(0);
          setFilingFrequency(res.data.serviceType === 'accounting' ? 'monthly' : 'annual');
          const initialDocs = {};
          (res.data.documentsRequired || []).forEach((doc) => {
            initialDocs[doc] = false;
          });
          setDocReadiness(initialDocs);
        } else {
          const fallback = findFallbackService(id);
          if (fallback) {
            setService(fallback);
            setOpenFaq(0);
            setFilingFrequency(fallback.serviceType === 'accounting' ? 'monthly' : 'annual');
            const initialDocs = {};
            (fallback.documentsRequired || []).forEach((doc) => {
              initialDocs[doc] = false;
            });
            setDocReadiness(initialDocs);
          } else {
            setError(res?.error || 'Service portfolio record not found.');
          }
        }

        if (allRes?.success && Array.isArray(allRes?.data) && allRes.data.length > 0) {
          setAllServices(allRes.data);
        } else {
          setAllServices(FALLBACK_SERVICES);
        }
      } catch (err) {
        const fallback = findFallbackService(id);
        if (fallback) {
          setService(fallback);
          setOpenFaq(0);
          setFilingFrequency(fallback.serviceType === 'accounting' ? 'monthly' : 'annual');
          const initialDocs = {};
          (fallback.documentsRequired || []).forEach((doc) => {
            initialDocs[doc] = false;
          });
          setDocReadiness(initialDocs);
          setAllServices(FALLBACK_SERVICES);
        } else {
          setError(err.message || 'Failed to load statutory portfolio details.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetail();
  }, [id]);

  const isIncorporation = useMemo(() => {
    if (!service) return false;
    return (
      service.serviceType === 'startup' ||
      (service.title || '').toLowerCase().includes('company') ||
      (service.title || '').toLowerCase().includes('llp')
    );
  }, [service]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB statutory docket limit. Please attach a smaller scan or PDF.');
      return;
    }

    setAttachedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'Document',
    });
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  const toggleDocCheck = (docName) => {
    setDocReadiness((prev) => ({
      ...prev,
      [docName]: !prev[docName],
    }));
  };

  const jumpToWorkbenchTab = (tabId) => {
    setActiveTab(tabId);
    const el = document.getElementById('dossier-workbench');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: null });

    const readyDocs = Object.keys(docReadiness).filter((d) => docReadiness[d]);
    const fileInfoText = attachedFile ? `\nAttached KYC Docket: ${attachedFile.name} (${attachedFile.size})` : '';
    const docsStatusText = readyDocs.length > 0 ? `\nPrepared Documents (${readyDocs.length}): ${readyDocs.join(', ')}` : '';
    const paramDetails = isIncorporation
      ? `\nAuthorized Capital: ${capitalSlab} | Directors: ${directorCount}`
      : `\nTurnover Tier: ${turnoverTier.toUpperCase()} | Frequency: ${filingFrequency.toUpperCase()}`;

    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: service?.title,
        message: `Engagement Mandate: ${service?.title}\nCommercial Entity: ${formData.entityName || 'Proposed / In Setup'}${paramDetails}${docsStatusText}${fileInfoText}\nSpecific Instructions: ${formData.message || 'Standard engagement docket requested'}`,
      });

      setFormStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', email: '', phone: '', entityName: '', message: '' });
      setAttachedFile(null);
    } catch (err) {
      setFormStatus({
        submitting: false,
        success: false,
        error: err.message || 'Submission error. Please connect directly with our Nikol chambers hotline.',
      });
    }
  };

  const handleCopyChecklist = () => {
    const docs = Object.keys(docReadiness);
    const lines = [
      `MANDATORY STATUTORY COMPLIANCE CHECKLIST`,
      `Service: ${service?.title || 'Statutory Filing'}`,
      `Firm: Shree Chamunda Associates | Corporate Tax & Advisory Chambers`,
      `Chambers: 612, Hill Town Square, Nikol, Ahmedabad - 380049`,
      `Direct Advisory Hotline: +91 95109 84735`,
      `--------------------------------------------------`,
      ...docs.map((d, i) => `${docReadiness[d] ? '[READY]' : '[PENDING]'} ${i + 1}. ${d}`),
      `--------------------------------------------------`,
      `Status: ${docs.filter((d) => docReadiness[d]).length} of ${docs.length} assembled`,
      `Official Docket Date: ${new Date().toLocaleDateString('en-IN')}`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedChecklist(true);
    setTimeout(() => setCopiedChecklist(false), 2400);
  };

  const handleShareDossier = () => {
    const shareData = {
      title: `${service?.title} - Shree Chamunda Associates`,
      text: `Review the official compliance dossier, deliverables, and fees for ${service?.title}:`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    }
  };

  const handlePrintChecklist = () => {
    const printWin = window.open('', '_blank', 'width=850,height=950');
    if (!printWin) {
      window.print();
      return;
    }
    const docs = Object.keys(docReadiness);
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Compliance Document Checklist - ${service?.title} - Shree Chamunda Associates</title>
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
        <h1 class="title">${service?.title}</h1>
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
  };

  if (loading) {
    return (
      <div className="service-dossier-page">
        <div className="dossier-hero-skeleton">
          <div className="dossier-shell-wrap">
            <div className="skeleton-line" style={{ width: '28%', height: '20px', marginBottom: '20px' }}></div>
            <div className="skeleton-line" style={{ width: '54%', height: '54px', marginBottom: '14px' }}></div>
            <div className="skeleton-line" style={{ width: '70%', height: '22px', marginBottom: '32px' }}></div>
            <div className="skeleton-box" style={{ height: '380px', borderRadius: '22px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-dossier-page">
        <div className="dossier-shell-wrap dossier-error-wrap">
          <div className="dossier-error-card">
            <div className="error-icon-badge" aria-hidden="true">
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            <h2>Statutory Record Not Found</h2>
            <p>{error || 'The requested service portfolio could not be retrieved from the chambers catalog.'}</p>
            <button type="button" className="btn-return-services" onClick={() => navigate('/services')}>
              <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
              <span>Return to Practice Areas</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statutoryInfo = getStatutoryAuthority(service.title, service.serviceType);
  const currentCategory = CATEGORY_MAP[service.serviceType] || { label: 'Corporate Advisory', icon: 'fa-solid fa-briefcase', code: 'ADV' };
  const postFilingRoadmap = getPostFilingRoadmap(service, isIncorporation);

  const titleWords = (service.title || '').trim().split(/\s+/);
  const leadWords = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') : '';
  const highlightWord = titleWords.length > 1 ? titleWords[titleWords.length - 1] : service.title;

  // Dynamic Fee Calculations
  const baseGovtFee = service.governmentFee || 0;
  const baseProfFee = service.professionalFee || 0;
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
    if (turnoverTier === 'micro') {
      calculatedProfFee = Math.round(baseProfFee * 0.85);
    } else if (turnoverTier === 'sme') {
      calculatedProfFee = baseProfFee;
    } else if (turnoverTier === 'mid') {
      calculatedProfFee = Math.round(baseProfFee * 1.5);
    } else if (turnoverTier === 'enterprise') {
      calculatedProfFee = Math.round(baseProfFee * 2.2);
    }

    if (filingFrequency === 'monthly') {
      calculatedProfFee = Math.round(calculatedProfFee * 1.8);
    } else if (filingFrequency === 'quarterly') {
      calculatedProfFee = Math.round(calculatedProfFee * 1.3);
    }
  }

  const totalMandateFee = calculatedGovtFee + calculatedProfFee;
  const hasStructuredFees = baseGovtFee > 0 || baseProfFee > 0;

  const documents = Object.keys(docReadiness);
  const readyDocCount = documents.filter((d) => docReadiness[d]).length;
  const docPercentage = documents.length > 0 ? Math.round((readyDocCount / documents.length) * 100) : 0;

  const deliverables =
    service.deliverables && service.deliverables.length > 0
      ? service.deliverables
      : [
          'Certificate of Official Incorporation / Filing Acknowledgement',
          'Senior Corporate Tax Advisor Verification & Advisory Docket',
          'Permanent Confidential Archival on Client Portal with 24/7 Access',
          'Post-Filing Statutory Compliance & Deadline Calendar',
        ];

  const processSteps =
    service.processSteps && service.processSteps.length > 0
      ? service.processSteps
      : [
          {
            step: 1,
            title: 'Document Vetting & KYC Intake',
            description: 'Compliance specialists verify KYC credentials, bank trails, and statutory prerequisites.',
          },
          {
            step: 2,
            title: 'Drafting & Schedule Preparation',
            description: 'Statutory filings, reconciliations, and declarations prepared per current circulars.',
          },
          {
            step: 3,
            title: 'Official Portal Submission',
            description: 'Portal execution with government payment challan and official acknowledgement generation.',
          },
          {
            step: 4,
            title: 'Liaison & Digital Vault Delivery',
            description: 'Tracking departmental processing and archiving certified outputs in your Client Vault.',
          },
        ];

  const eligibilityList =
    service.eligibility && service.eligibility.length > 0
      ? service.eligibility
      : [
          'Proprietorships, Partnerships, LLPs, and Corporate Entities operating in India',
          'Founders, Promoters, and NRIs establishing Indian commercial operations',
          'Businesses seeking continuous statutory compliance, clean books, and audit readiness',
        ];

  const keyBenefits =
    service.keyBenefits && service.keyBenefits.length > 0
      ? service.keyBenefits
      : [
          '100% Statutory Compliance and penalty avoidance under Indian law',
          'Direct Senior Partner Supervision with verified documentation docket',
          'Rapid turnaround backed by direct portal integration & digital vault archival',
        ];

  const rawFaqs =
    service.faqs && service.faqs.length > 0
      ? service.faqs
      : [
          {
            question: `What is the typical turnaround timeline for ${service.title}?`,
            answer: `Our standard advisory turnaround is ${service.timeline || '3–7 working days'}, subject to regulatory portal queues and prompt verification of KYC/financial records.`,
          },
          {
            question: 'Are government portal receipts and challans provided to the client?',
            answer:
              'Yes. 100% of official treasury challans, acknowledgement receipts, and digitally signed filings are shared directly with you and archived permanently in your Client Vault.',
          },
          {
            question: 'Do I need to visit your physical chambers in Ahmedabad in person?',
            answer:
              'No physical presence is required. All documentation, digital signatures, and filings are executed seamlessly via our encrypted portal and WhatsApp desk, or in person at our Nikol Chambers.',
          },
        ];

  const filteredFaqs = rawFaqs.filter(
    (f) =>
      (f.question || '').toLowerCase().includes(faqFilter.toLowerCase()) ||
      (f.answer || '').toLowerCase().includes(faqFilter.toLowerCase())
  );

  const relatedServices = allServices
    .filter((s) => s._id !== service._id && s.slug !== service.slug && s.serviceType === service.serviceType)
    .slice(0, 3);

  const selectedTierObj = TURNOVER_TIERS.find((t) => t.id === turnoverTier) || TURNOVER_TIERS[1];
  const selectedFreqObj = FILING_FREQUENCIES.find((f) => f.id === filingFrequency) || FILING_FREQUENCIES[0];

  return (
    <div className="service-dossier-page">
      {/* ====================================================================
          BAND 01: EXECUTIVE SWISS-FINTECH HERO & INTEGRATED STATUTORY LEDGER
          ==================================================================== */}
      <header className="service-hero-band">
        <div className="dossier-shell-wrap service-hero-container">
          <span className="service-hero-watermark" aria-hidden="true">
            {statutoryInfo.watermark}
          </span>

          {/* Minimal Breadcrumb Trail */}
          <nav className="service-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">
              <i className="fa-solid fa-house" aria-hidden="true"></i>
              <span>Home</span>
            </Link>
            <i className="fa-solid fa-chevron-right sep" aria-hidden="true"></i>
            <Link to="/services">Practice Areas</Link>
            <i className="fa-solid fa-chevron-right sep sep-cat" aria-hidden="true"></i>
            <span className="cat-name">{currentCategory.label}</span>
            <i className="fa-solid fa-chevron-right sep" aria-hidden="true"></i>
            <span className="current-crumb">{service.title}</span>
          </nav>

          {/* Centered-Clean Editorial Hero Cluster */}
          <div className="service-hero-main">
            <div className="retainers-eyebrow-badge service-eyebrow">
              <span className="badge-index-chip">{currentCategory.code}</span>
              <span className="retainers-live-dot" aria-hidden="true"></span>
              <i className={currentCategory.icon} aria-hidden="true"></i>
              <span>
                {statutoryInfo.badge} &bull; {service.timeline || '3–7 Business Days'}
              </span>
            </div>

            <h1 className="service-hero-heading">
              {leadWords ? `${leadWords} ` : ''}
              <span className="title-burnished-gold">{highlightWord}</span>
            </h1>

            <p className="service-hero-lead">{service.description}</p>

            {/* Uncluttered Primary + Secondary Action Pair */}
            <div className="service-hero-actions">
              <a href="#consultation-intake" className="btn-service-primary">
                <span>Initiate Engagement Mandate</span>
                <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </a>
              <button type="button" onClick={handlePrintChecklist} className="btn-service-secondary">
                <i className="fa-solid fa-print" aria-hidden="true"></i>
                <span>Print Compliance Sheet</span>
              </button>
              <button
                type="button"
                onClick={handleShareDossier}
                className="btn-service-quiet"
                title="Copy shareable link"
              >
                <i className={copiedLink ? 'fa-solid fa-check' : 'fa-solid fa-share-nodes'} aria-hidden="true"></i>
                <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Anchored 4-Column Bottom Statutory Ledger Strip (Matches Careers Sec 01) */}
          <div className="service-stats-ledger" role="region" aria-label="Statutory Mandate Specifications">
            <div className="service-ledger-cell">
              <span className="ledger-icon-box" aria-hidden="true">
                <i className="fa-solid fa-scale-balanced"></i>
              </span>
              <div className="ledger-copy">
                <span className="ledger-label">Governing Statute</span>
                <strong>{statutoryInfo.statute}</strong>
              </div>
            </div>

            <div className="service-ledger-cell">
              <span className="ledger-icon-box" aria-hidden="true">
                <i className="fa-solid fa-landmark"></i>
              </span>
              <div className="ledger-copy">
                <span className="ledger-label">Regulatory Authority</span>
                <strong>{statutoryInfo.authority}</strong>
              </div>
            </div>

            <div className="service-ledger-cell">
              <span className="ledger-icon-box icon-emerald" aria-hidden="true">
                <i className="fa-regular fa-clock"></i>
              </span>
              <div className="ledger-copy">
                <span className="ledger-label">Turnaround &amp; Portal</span>
                <strong className="val-emerald">{service.timeline || '3–7 Days'} &bull; {statutoryInfo.portal}</strong>
              </div>
            </div>

            <button
              type="button"
              className="service-ledger-cell ledger-cell-action"
              onClick={() => jumpToWorkbenchTab('documents')}
            >
              <span className="ledger-icon-box icon-obsidian" aria-hidden="true">
                <i className="fa-solid fa-shield-halved"></i>
              </span>
              <div className="ledger-copy">
                <span className="ledger-label">Mandate &amp; Checklist</span>
                <strong>
                  {hasStructuredFees ? `Est. ₹${totalMandateFee.toLocaleString('en-IN')}+` : 'Custom Retainer'} &bull; {readyDocCount}/{documents.length} Ready
                </strong>
              </div>
              <i className="fa-solid fa-chevron-right ledger-arrow" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          BAND 02: INTERACTIVE STATUTORY DOSSIER WORKBENCH
          Asymmetric Obsidian + Editorial Tabs (Replaces 7-Card Wall)
          ==================================================================== */}
      <section id="dossier-workbench" className="dossier-shell-wrap workbench-band" aria-labelledby="workbench-heading">
        <div className="workbench-top-bar">
          <div className="workbench-heading-cluster">
            <div className="retainers-eyebrow-badge">
              <span className="badge-index-chip">02</span>
              <i className="fa-solid fa-book-open" aria-hidden="true"></i>
              <span>MANDATE ARCHITECTURE &amp; REQUIREMENTS</span>
            </div>
            <h2 id="workbench-heading" className="band-section-heading">
              Practice <span className="title-burnished-gold">Specifications</span>
            </h2>
          </div>

          {/* Interactive Segmented Tab Controls */}
          <div className="workbench-tabs-rail" role="tablist" aria-label="Service dossier sections">
            {WORKBENCH_TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`workbench-tab-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-idx">{tab.num}</span>
                  <i className={tab.icon} aria-hidden="true"></i>
                  <span className="tab-lbl-full">{tab.label}</span>
                  <span className="tab-lbl-short">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Stage */}
        <div className="workbench-stage">
          {/* TAB 01: SCOPE & DELIVERABLES (Asymmetric Obsidian Anchor + 2x2 Deliverables Grid) */}
          {activeTab === 'overview' && (
            <div id="overview" className="stage-overview-bento" role="tabpanel" aria-label="Scope and Deliverables">
              {/* Left Obsidian Anchor Panel */}
              <div className="overview-obsidian-panel">
                <div className="anchor-panel-top">
                  <span className="anchor-tag">STATUTORY BRIEF</span>
                  <h3>Legal Scope &amp; Oversight</h3>
                  <p>{service.detailedOverview || service.description}</p>
                </div>

                <div className="anchor-advantages-list">
                  <span className="anchor-sub-kicker">KEY COMPLIANCE ADVANTAGES</span>
                  {keyBenefits.map((benefit, idx) => (
                    <div key={idx} className="anchor-adv-row">
                      <span className="adv-check-dot" aria-hidden="true">
                        <i className="fa-solid fa-check"></i>
                      </span>
                      <div>
                        <strong>{benefit}</strong>
                        <p>{getBenefitDescription(benefit)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="anchor-panel-footer">
                  <i className="fa-solid fa-vault" aria-hidden="true"></i>
                  <span>Permanent Sec 128 Digital Vault &bull; 100% Challan Transparency</span>
                </div>
              </div>

              {/* Right Deliverables & Outputs Panel */}
              <div id="deliverables" className="overview-deliverables-panel">
                <div className="del-panel-header">
                  <div>
                    <span className="del-kicker">TANGIBLE OUTPUTS</span>
                    <h3>Certified Mandate Deliverables</h3>
                  </div>
                  <span className="del-count-pill">
                    <i className="fa-solid fa-file-lines" aria-hidden="true"></i>
                    <span>{deliverables.length} Official Outputs</span>
                  </span>
                </div>

                <div className="deliverables-quad-grid">
                  {deliverables.map((item, idx) => (
                    <div key={idx} className="del-quad-card">
                      <div className="del-quad-top">
                        <span className="del-quad-num">{String(idx + 1).padStart(2, '0')}</span>
                        <span className="del-certified-tag">
                          <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                          <span>Certified PDF</span>
                        </span>
                      </div>
                      <h4>{item}</h4>
                      <p>{getDeliverableSubtitle(item)}</p>
                    </div>
                  ))}
                </div>

                <div className="del-panel-action-bar">
                  <button
                    type="button"
                    className="btn-next-tab"
                    onClick={() => setActiveTab('documents')}
                  >
                    <span>Review Required Documents ({documents.length})</span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </button>
                  <button
                    type="button"
                    className="btn-next-tab secondary"
                    onClick={() => setActiveTab('roadmap')}
                  >
                    <span>View {processSteps.length}-Stage Workflow</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 02: INTERACTIVE MANDATORY DOCUMENTS VAULT */}
          {activeTab === 'documents' && (
            <div id="documents" className="stage-documents-panel" role="tabpanel" aria-label="Documents Checklist">
              <div className="docs-toolbar-header">
                <div className="docs-progress-cluster">
                  <div className="docs-progress-top">
                    <div>
                      <span className="del-kicker">PRE-FILING READINESS</span>
                      <h3>Interactive Statutory Document Checklist</h3>
                    </div>
                    <strong className="docs-progress-score">
                      {readyDocCount} of {documents.length} Assembled ({docPercentage}%)
                    </strong>
                  </div>
                  <div
                    className="docs-meter-track"
                    role="progressbar"
                    aria-valuenow={docPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="docs-meter-fill" style={{ width: `${docPercentage}%` }}></div>
                  </div>
                </div>

                <div className="docs-tools-group">
                  <button
                    type="button"
                    className={`btn-doc-tool ${copiedChecklist ? 'copied' : ''}`}
                    onClick={handleCopyChecklist}
                  >
                    <i className={copiedChecklist ? 'fa-solid fa-check' : 'fa-regular fa-copy'} aria-hidden="true"></i>
                    <span>{copiedChecklist ? 'Copied!' : 'Copy Checklist'}</span>
                  </button>
                  <button type="button" className="btn-doc-tool primary" onClick={handlePrintChecklist}>
                    <i className="fa-solid fa-print" aria-hidden="true"></i>
                    <span>Print A4 Sheet</span>
                  </button>
                </div>
              </div>

              <div className="docs-checklist-grid">
                {documents.map((doc, idx) => {
                  const isReady = Boolean(docReadiness[doc]);
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`doc-tile-btn ${isReady ? 'assembled' : ''}`}
                      onClick={() => toggleDocCheck(doc)}
                      aria-pressed={isReady}
                    >
                      <span className={`doc-tile-check ${isReady ? 'checked' : ''}`} aria-hidden="true">
                        {isReady ? <i className="fa-solid fa-check"></i> : String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="doc-tile-name">{doc}</span>
                      <span className={`doc-tile-status ${isReady ? 'ready' : ''}`}>
                        {isReady ? 'Assembled' : 'Required'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="docs-advisory-note">
                <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
                <span>
                  Click any document card above to mark it ready. Missing PAN/Aadhaar synchronization or prior financial statements? Mention it in Step 03 below—our Nikol desk handles rectification prior to portal upload.
                </span>
              </div>
            </div>
          )}

          {/* TAB 03: PROCEDURAL EXECUTION PIPELINE */}
          {activeTab === 'roadmap' && (
            <div id="roadmap" className="stage-roadmap-panel" role="tabpanel" aria-label="Filing Workflow">
              <div className="stage-intro-row">
                <div>
                  <span className="del-kicker">AUDIT-SAFE EXECUTION</span>
                  <h3>{processSteps.length}-Stage Portal Filing Workflow</h3>
                </div>
                <span className="stage-sla-pill">
                  <i className="fa-regular fa-clock" aria-hidden="true"></i>
                  <span>Target Completion: {service.timeline || '3–7 Working Days'}</span>
                </span>
              </div>

              <div className="pipeline-cards-grid">
                {processSteps.map((step, idx) => (
                  <div key={idx} className="pipeline-stage-card">
                    <div className="pipeline-card-top">
                      <span className="pipeline-num">{String(step.step || idx + 1).padStart(2, '0')}</span>
                      <span className="pipeline-tag">Stage {String(step.step || idx + 1).padStart(2, '0')}</span>
                    </div>
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 04: ELIGIBILITY & CONTEXT-AWARE POST-FILING CADENCE */}
          {activeTab === 'eligibility' && (
            <div id="eligibility" className="stage-eligibility-panel" role="tabpanel" aria-label="Eligibility and Continuity">
              <div className="elig-charter-split">
                <div className="elig-who-box">
                  <span className="del-kicker">APPLICABLE ENTITIES</span>
                  <h3>Who Should Engage This Mandate</h3>
                  <ul className="elig-clean-list">
                    {eligibilityList.map((item, idx) => (
                      <li key={idx}>
                        <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="elig-assurance-obsidian">
                  <span className="anchor-tag">CHAMBERS FIDUCIARY OATH</span>
                  <h3>Client Confidentiality &amp; Oversight</h3>
                  <ul className="elig-oath-list">
                    <li>
                      <i className="fa-solid fa-lock" aria-hidden="true"></i>
                      <span>
                        <strong>Strict NDA Protection:</strong> Financial statements, bank trails, and commercial projections stay strictly confidential.
                      </span>
                    </li>
                    <li>
                      <i className="fa-solid fa-user-tie" aria-hidden="true"></i>
                      <span>
                        <strong>Partner Supervision:</strong> Every ledger computation and statutory return is reviewed by senior specialists before filing.
                      </span>
                    </li>
                    <li>
                      <i className="fa-solid fa-receipt" aria-hidden="true"></i>
                      <span>
                        <strong>Direct Challan Proof:</strong> 100% government payment receipts shared transparently with zero intermediary markup.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="continuity-roadmap-block">
                <div className="continuity-head">
                  <span className="continuity-badge-icon" aria-hidden="true">
                    <i className="fa-solid fa-calendar-check"></i>
                  </span>
                  <div>
                    <h4>{postFilingRoadmap.heading}</h4>
                    <p>{postFilingRoadmap.sub}</p>
                  </div>
                </div>
                <div className="continuity-cards-row">
                  {postFilingRoadmap.items.map((m) => (
                    <div key={m.title} className="continuity-card">
                      <span className="cont-tag">{m.tag}</span>
                      <strong>{m.title}</strong>
                      <p>{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          BAND 03: FULL-WIDTH FEE CALIBRATION & MANDATE INTAKE WORKBENCH
          (Matches Pricing Sec 05 & Careers Sec 04 — Uncrowded & Roomy)
          ==================================================================== */}
      <section id="consultation-intake" className="dossier-shell-wrap engagement-band" aria-labelledby="engagement-heading">
        <div className="section-header-centered engagement-section-header">
          <div className="retainers-eyebrow-badge">
            <span className="badge-index-chip">03</span>
            <i className="fa-solid fa-sliders" aria-hidden="true"></i>
            <span>MANDATE CALIBRATION &amp; PARTNER INTAKE DESK</span>
          </div>
          <h2 id="engagement-heading" className="band-section-heading">
            Calibrate Scope &amp; <span className="title-burnished-gold">Initiate Engagement</span>
          </h2>
          <p className="band-section-subtext">
            Select your entity scale below to configure an engagement profile and transmit your brief directly to our Managing Partners.
          </p>
        </div>

        <div className="engagement-workbench-grid">
          {/* LEFT COLUMN: OBSIDIAN FEE & CHAMBERS DESK */}
          <aside className="engagement-obsidian-col">
            <div className="engagement-fee-card">
              <div className="eng-card-head">
                <div>
                  <span className="eng-kicker">FEE &amp; VOLUME CALIBRATOR</span>
                  <h3>{hasStructuredFees ? 'Transparent Mandate Estimate' : 'Scope & Retainer Profile'}</h3>
                </div>
                <span className="eng-lock-pill">
                  <i className="fa-solid fa-lock" aria-hidden="true"></i>
                  <span>Scope-Locked</span>
                </span>
              </div>

              {/* Calibrator Slabs */}
              <div className="eng-calibrator-controls">
                {isIncorporation ? (
                  <>
                    <div className="eng-ctrl-group">
                      <span className="eng-ctrl-label">Authorized Share Capital Slab</span>
                      <div className="eng-slab-grid">
                        {CAPITAL_SLABS.map((slab) => (
                          <button
                            key={slab.id}
                            type="button"
                            className={`eng-slab-btn ${capitalSlab === slab.id ? 'active' : ''}`}
                            onClick={() => setCapitalSlab(slab.id)}
                          >
                            <strong>{slab.label}</strong>
                            <span>{slab.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="eng-ctrl-group">
                      <span className="eng-ctrl-label">Designated Directors (DIN &amp; DSC)</span>
                      <div className="eng-stepper">
                        <button
                          type="button"
                          className="btn-eng-step"
                          disabled={directorCount <= 2}
                          onClick={() => setDirectorCount((c) => Math.max(2, c - 1))}
                          aria-label="Decrease directors"
                        >
                          <i className="fa-solid fa-minus" aria-hidden="true"></i>
                        </button>
                        <strong className="eng-step-val">{directorCount} Directors</strong>
                        <button
                          type="button"
                          className="btn-eng-step"
                          disabled={directorCount >= 6}
                          onClick={() => setDirectorCount((c) => Math.min(6, c + 1))}
                          aria-label="Increase directors"
                        >
                          <i className="fa-solid fa-plus" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="eng-ctrl-group">
                      <span className="eng-ctrl-label">Annual Turnover / Voucher Volume</span>
                      <div className="eng-slab-grid">
                        {TURNOVER_TIERS.map((tier) => (
                          <button
                            key={tier.id}
                            type="button"
                            className={`eng-slab-btn ${turnoverTier === tier.id ? 'active' : ''}`}
                            onClick={() => setTurnoverTier(tier.id)}
                          >
                            <strong>{tier.label}</strong>
                            <span>{tier.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="eng-ctrl-group">
                      <span className="eng-ctrl-label">Filing &amp; Accounting Frequency</span>
                      <div className="eng-freq-grid">
                        {FILING_FREQUENCIES.map((freq) => (
                          <button
                            key={freq.id}
                            type="button"
                            className={`eng-freq-btn ${filingFrequency === freq.id ? 'active' : ''}`}
                            onClick={() => setFilingFrequency(freq.id)}
                          >
                            {freq.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Fee Output Readout */}
              {hasStructuredFees ? (
                <div className="eng-readout-panel">
                  <div className="readout-hero-row">
                    <div>
                      <span className="readout-caption">Estimated Total Investment</span>
                      <div className="readout-amount">₹{totalMandateFee.toLocaleString('en-IN')}</div>
                    </div>
                    <span className="readout-tax-pill">Official Challan Included</span>
                  </div>
                  <div className="readout-ledger-rows">
                    <div className="r-row">
                      <span>Govt Portal &amp; Stamp Duty</span>
                      <strong>
                        {calculatedGovtFee > 0 ? `₹${calculatedGovtFee.toLocaleString('en-IN')}` : 'Nil (Exempt)'}
                      </strong>
                    </div>
                    <div className="r-row">
                      <span>Advisory &amp; Filing Retainer</span>
                      <strong>₹{calculatedProfFee.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="eng-readout-panel">
                  <div className="readout-hero-row">
                    <div>
                      <span className="readout-caption">Configured Scope Summary</span>
                      <div className="readout-amount amount-custom">Custom Scope Quote</div>
                    </div>
                    <span className="readout-tax-pill">{selectedFreqObj.label} Cycle</span>
                  </div>
                  <p className="custom-profile-text">
                    Calibrated for <strong>{selectedTierObj.label}</strong> ({selectedTierObj.sub}) on a{' '}
                    <strong>{selectedFreqObj.label}</strong> schedule.
                  </p>
                  <Link to="/pricing" className="btn-compare-retainers">
                    <span>Compare Monthly Fixed Retainer Plans</span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </Link>
                </div>
              )}

              {/* Direct Chambers Contact Strip (Safe Left Side) */}
              <div className="eng-chambers-footer">
                <div className="chambers-foot-meta">
                  <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                  <span>612, Hill Town Square, MG Road, Nikol, Ahmedabad &bull; Mon–Sat 9:30 AM–7:30 PM</span>
                </div>
                <div className="chambers-foot-btns">
                  <a href="tel:+919510984735" className="btn-chambers-pill phone">
                    <i className="fa-solid fa-phone" aria-hidden="true"></i>
                    <span>+91 95109 84735</span>
                  </a>
                  <a
                    href={`https://wa.me/919510984735?text=${encodeURIComponent(
                      `Hello Shree Chamunda Associates, I would like to consult on statutory mandate: ${service.title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-chambers-pill whatsapp"
                  >
                    <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                    <span>WhatsApp Chambers</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: SPACIOUS BOOK SERVICE ENGAGEMENT FORM */}
          <div className="engagement-form-card">
            <div className="intake-panel-header">
              <div>
                <span className="del-kicker">DIRECT PARTNER DESK</span>
                <h3>Book Service Engagement</h3>
              </div>
              <span className="intake-sla-tag">
                <span className="retainers-live-dot" aria-hidden="true"></span>
                <span>&lt; 2h Turnaround</span>
              </span>
            </div>

            <div className="intake-context-bar">
              <span className="ctx-label">Selected Mandate</span>
              <strong className="ctx-value">{service.title}</strong>
              <span className="ctx-meta">
                {isIncorporation
                  ? `${capitalSlab} Capital • ${directorCount} Directors`
                  : `${selectedTierObj.label} • ${selectedFreqObj.label}`}
              </span>
            </div>

            {formStatus.success && (
              <div className="form-alert-banner success">
                <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                <div>
                  <strong>Engagement Mandate Logged</strong>
                  <p>Our senior tax advisors will review your scope and connect within 2 business hours.</p>
                </div>
              </div>
            )}

            {formStatus.error && (
              <div className="form-alert-banner error">
                <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
                <div>
                  <strong>Submission Notice</strong>
                  <p>{formStatus.error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="spacious-intake-form">
              <div className="form-split-2">
                <div className="field-block">
                  <label htmlFor="name">Full Name *</label>
                  <div className="input-icon-shell">
                    <i className="fa-regular fa-user" aria-hidden="true"></i>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="dossier-field-input"
                    />
                  </div>
                </div>

                <div className="field-block">
                  <label htmlFor="phone">Phone / WhatsApp Number *</label>
                  <div className="input-icon-shell">
                    <i className="fa-solid fa-phone" aria-hidden="true"></i>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="dossier-field-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-split-2">
                <div className="field-block">
                  <label htmlFor="email">Corporate Email Address *</label>
                  <div className="input-icon-shell">
                    <i className="fa-regular fa-envelope" aria-hidden="true"></i>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="rahul@enterprise.com"
                      className="dossier-field-input"
                    />
                  </div>
                </div>

                <div className="field-block">
                  <label htmlFor="entityName">Commercial Entity / Proposed Name</label>
                  <div className="input-icon-shell">
                    <i className="fa-solid fa-building" aria-hidden="true"></i>
                    <input
                      type="text"
                      id="entityName"
                      name="entityName"
                      value={formData.entityName}
                      onChange={handleInputChange}
                      placeholder="e.g. Apex Logix Private Limited"
                      className="dossier-field-input"
                    />
                  </div>
                </div>
              </div>

              <div className="field-block">
                <label>Attach KYC / Financial Statements (Optional)</label>
                {!attachedFile ? (
                  <label className="spacious-dropzone">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      className="file-hidden-input"
                    />
                    <span className="dropzone-icon" aria-hidden="true">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                    </span>
                    <div className="dropzone-copy">
                      <strong>Upload PAN, Bank Statement, or Entity KYC (PDF / Image)</strong>
                      <span>Maximum 10 MB &bull; Encrypted transfer directly to Managing Partner desk</span>
                    </div>
                  </label>
                ) : (
                  <div className="attached-file-chip">
                    <div className="file-chip-meta">
                      <i className="fa-solid fa-file-pdf" aria-hidden="true"></i>
                      <div>
                        <strong>{attachedFile.name}</strong>
                        <span>{attachedFile.size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="btn-remove-attachment"
                      aria-label="Remove attached file"
                    >
                      <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>
                  </div>
                )}
              </div>

              <div className="field-block">
                <label htmlFor="message">Deadlines &amp; Practice Notes</label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Share monthly transaction volume, urgent statutory notice deadlines, or specific accounting requirements..."
                  className="dossier-field-textarea"
                ></textarea>
              </div>

              <button type="submit" className="btn-submit-engagement" disabled={formStatus.submitting}>
                {formStatus.submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                    <span>Transmitting Engagement Docket...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Engagement Mandate to Partner Desk</span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </>
                )}
              </button>

              <div className="intake-fiduciary-foot">
                <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                <span>Direct Nikol Chambers Desk &bull; Strict Non-Disclosure Guaranteed &bull; Zero Hidden Fees</span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ====================================================================
          BAND 04: OPEN STATUTORY FAQS + INTEGRATED BUNDLED SERVICES
          ==================================================================== */}
      <section id="faqs" className="dossier-shell-wrap faqs-band" aria-labelledby="faqs-heading">
        <div className="faqs-editorial-split">
          <div className="faqs-left-col">
            <div className="retainers-eyebrow-badge">
              <span className="badge-index-chip">04</span>
              <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
              <span>STATUTORY CLARIFICATIONS</span>
            </div>
            <h2 id="faqs-heading" className="faqs-heading">
              Common Mandate <span className="title-burnished-gold">Questions</span>
            </h2>
            <p className="faqs-lead">
              Answers reviewed by our advisory desk covering turnaround timelines, portal receipts, and statutory procedures.
            </p>

            <div className="faqs-filter-shell">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <input
                type="text"
                placeholder="Search clarifications..."
                value={faqFilter}
                onChange={(e) => setFaqFilter(e.target.value)}
                className="faqs-filter-input"
                aria-label="Search FAQs"
              />
            </div>
          </div>

          <div className="faqs-right-col">
            <div className="open-accordion-list">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className={`open-faq-row ${isOpen ? 'expanded' : ''}`}>
                      <button
                        type="button"
                        className="open-faq-trigger"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                      >
                        <span className="faq-num-tag">Q{String(idx + 1).padStart(2, '0')}</span>
                        <span className="faq-question-text">{faq.question}</span>
                        <i className="fa-solid fa-chevron-down faq-arrow-icon" aria-hidden="true"></i>
                      </button>
                      {isOpen && (
                        <div className="open-faq-body">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="faqs-empty-box">
                  <p>No clarifications matched &ldquo;{faqFilter}&rdquo;.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="dossier-shell-wrap bundled-band" aria-labelledby="bundled-heading">
          <div className="bundled-band-header">
            <div>
              <span className="del-kicker">INTEGRATED PRACTICE AREAS</span>
              <h2 id="bundled-heading" className="bundled-heading">
                Frequently Bundled Compliances
              </h2>
            </div>
            <Link to="/services" className="btn-all-services-link">
              <span>All Practice Areas</span>
              <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </Link>
          </div>

          <div className="bundled-editorial-grid">
            {relatedServices.map((rel) => (
              <Link key={rel.slug || rel._id} to={`/services/${rel.slug || rel._id}`} className="bundled-tile-card">
                <div className="bundled-tile-top">
                  <span className="bundled-cat-tag">{rel.serviceType}</span>
                  <h3>{rel.title}</h3>
                  <p>{rel.description}</p>
                </div>
                <div className="bundled-tile-foot">
                  <span>
                    <i className="fa-regular fa-clock" aria-hidden="true"></i> {rel.timeline || '3–5 Days'}
                  </span>
                  <strong className="tile-view-cta">
                    Inspect Dossier <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </strong>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceDetail;
