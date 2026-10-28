import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getServiceById, getServices, submitContact } from '../api';
import './ServiceDetail.css';

const NAV_SECTIONS = [
  { id: 'overview', label: '1. Overview & Purview', shortLabel: 'Overview', icon: 'fas fa-book-open' },
  { id: 'deliverables', label: '2. Deliverables Docket', shortLabel: 'Deliverables', icon: 'fas fa-certificate' },
  { id: 'documents', label: '3. Mandatory Documents', shortLabel: 'Documents', icon: 'fas fa-clipboard-list' },
  { id: 'roadmap', label: '4. Filing Workflow', shortLabel: 'Workflow', icon: 'fas fa-stream' },
  { id: 'eligibility', label: '5. Eligibility & Scope', shortLabel: 'Eligibility', icon: 'fas fa-user-check' },
  { id: 'faqs', label: '6. Statutory FAQs', shortLabel: 'FAQs', icon: 'fas fa-question-circle' },
];

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Interactive Document Checklist Readiness Tracker
  const [docReadiness, setDocReadiness] = useState({});
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [faqFilter, setFaqFilter] = useState('');
  const [activeNav, setActiveNav] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Dynamic Statutory Share Capital / Entity Slabs (For Incorporation / Corporate Services)
  const [capitalSlab, setCapitalSlab] = useState('10L');
  const [directorCount, setDirectorCount] = useState(2);

  // Dynamic Turnover Slabs (For Tax / Return / Accounting Services)
  const [turnoverTier, setTurnoverTier] = useState('sme');
  const [filingFrequency, setFilingFrequency] = useState('annual');

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const [res, allRes] = await Promise.all([
          getServiceById(id),
          getServices().catch(() => ({ data: [] })),
        ]);

        if (res.success && res.data) {
          setService(res.data);
          setOpenFaq(0);

          // Initialize document readiness
          const initialDocs = {};
          (res.data.documentsRequired || []).forEach((doc) => {
            initialDocs[doc] = false;
          });
          setDocReadiness(initialDocs);
        } else {
          setError('Service portfolio record not found.');
        }

        if (allRes.success && Array.isArray(allRes.data)) {
          setAllServices(allRes.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load statutory portfolio details.');
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetail();
  }, [id]);

  // Track active scroll section for sticky in-page nav
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 170;

      for (const section of NAV_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveNav(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      `📋 MANDATORY STATUTORY COMPLIANCE CHECKLIST`,
      `Service: ${service?.title || 'Statutory Filing'}`,
      `Firm: Shree Chamunda Associates | Corporate Tax & Advisory Chambers`,
      `Chambers: 612, Hill Town Square, Nikol, Ahmedabad - 380049`,
      `Direct Advisory Hotline: +91 95109 84735`,
      `--------------------------------------------------`,
      ...docs.map((d, i) => `${docReadiness[d] ? '[✓ READY]' : '[  PENDING]'} ${i + 1}. ${d}`),
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
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 24px; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #b45309; padding-bottom: 16px; margin-bottom: 24px; }
          .firm-name { font-size: 20px; font-weight: 800; color: #071324; text-transform: uppercase; letter-spacing: 0.5px; }
          .firm-desc { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-top: 3px; }
          .firm-meta { text-align: right; font-size: 11px; color: #334155; line-height: 1.45; }
          .doc-badge { display: inline-block; background: #fffbeb; color: #b45309; border: 1px solid #fde68a; font-size: 10px; font-weight: 750; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
          .title { font-size: 22px; font-weight: 800; color: #071324; margin: 0 0 8px 0; }
          .lead { font-size: 13px; color: #475569; margin: 0 0 24px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { background: #f8fafc; color: #0f172a; padding: 10px 12px; text-align: left; font-size: 11.5px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; border-top: 1px solid #e2e8f0; }
          td { padding: 11px 12px; border-bottom: 1px solid #edf2f7; font-size: 12.5px; }
          .box { width: 16px; height: 16px; border: 1.5px solid #071324; border-radius: 3px; display: inline-block; text-align: center; line-height: 16px; font-size: 11px; font-weight: bold; }
          .box.checked { background: #071324; color: #f59e0b; }
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
        <p class="lead">Please assemble the following mandatory statutory KYC and entity records for statutory portal filing. Digital scans may be submitted directly or presented at our Nikol Chambers.</p>
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
                <td style="text-align: center;"><span class="box ${docReadiness[doc] ? 'checked' : ''}">${docReadiness[doc] ? '✓' : ''}</span></td>
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

  const getStatutoryAuthority = (title, type) => {
    const t = (title || '').toLowerCase();
    const tp = (type || '').toLowerCase();
    if (t.includes('pvt') || t.includes('private limited') || t.includes('llp') || t.includes('opc') || tp === 'startup') {
      return {
        authority: 'Ministry of Corporate Affairs (MCA)',
        statute: 'Companies Act, 2013',
        portal: 'MCA-21 SPICe+ CRC',
        badge: 'MCA-21 Regulatory Filing',
      };
    }
    if (t.includes('gst') || t.includes('lut') || t.includes('gstr')) {
      return {
        authority: 'Goods & Services Tax Network (GSTN)',
        statute: 'Central GST Act, 2017 (Sec 22-25)',
        portal: 'gst.gov.in Official Portal',
        badge: 'GSTN Statutory Compliance',
      };
    }
    if (t.includes('itr') || t.includes('tax return') || t.includes('personal tax') || tp === 'tax') {
      return {
        authority: 'Income Tax Department (CBDT)',
        statute: 'Income-tax Act, 1961 (Sec 139)',
        portal: 'e-Filing 2.0 Portal',
        badge: 'Direct Tax Compliance',
      };
    }
    if (t.includes('audit') || t.includes('accounting') || tp === 'accounting') {
      return {
        authority: 'Statutory Assurance Standard',
        statute: 'Standards on Auditing (SA 700)',
        portal: 'Central Regulatory Filing',
        badge: 'Assurance & Accounting',
      };
    }
    if (t.includes('iec') || t.includes('import')) {
      return {
        authority: 'Directorate General of Foreign Trade (DGFT)',
        statute: 'Foreign Trade (D&R) Act, 1992',
        portal: 'dgft.gov.in Portal',
        badge: 'Foreign Trade License',
      };
    }
    if (t.includes('msme') || t.includes('udyam')) {
      return {
        authority: 'Ministry of MSME, Govt of India',
        statute: 'MSMED Act, 2006',
        portal: 'udyamregistration.gov.in',
        badge: 'Central MSME Recognition',
      };
    }
    return {
      authority: 'Central Statutory Registry',
      statute: 'Indian Regulatory Framework',
      portal: 'Official Government Gateway',
      badge: 'Statutory Practice Mandate',
    };
  };

  const categoryMap = {
    startup: { label: 'Startup & Corporate Law', icon: 'fa-solid fa-rocket' },
    registration: { label: 'Statutory Licensing', icon: 'fa-solid fa-stamp' },
    tax: { label: 'Taxation & Regulatory', icon: 'fa-solid fa-file-invoice-dollar' },
    accounting: { label: 'Assurance & Accounts', icon: 'fa-solid fa-calculator' },
    general: { label: 'Corporate Advisory', icon: 'fa-solid fa-landmark' },
  };

  if (loading) {
    return (
      <div className="service-dossier-page">
        <div className="dossier-content-wrap py-5">
          <div className="skeleton-line" style={{ width: '30%', height: '24px', marginBottom: '20px' }}></div>
          <div className="skeleton-line" style={{ width: '60%', height: '48px', marginBottom: '16px' }}></div>
          <div className="skeleton-line" style={{ width: '80%', height: '20px', marginBottom: '40px' }}></div>
          <div className="skeleton-box" style={{ height: '400px', borderRadius: '16px' }}></div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-dossier-page">
        <div className="dossier-content-wrap py-5 text-center">
          <div className="error-card">
            <i className="fas fa-exclamation-circle error-icon"></i>
            <h2>Statutory Record Not Found</h2>
            <p>{error || 'The requested service portfolio could not be retrieved.'}</p>
            <button className="btn-return-services" onClick={() => navigate('/services')}>
              <i className="fas fa-arrow-left"></i> Return to Practice Areas
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statutoryInfo = getStatutoryAuthority(service.title, service.serviceType);
  const currentCategory = categoryMap[service.serviceType] || { label: 'Corporate Advisory', icon: 'fa-solid fa-briefcase' };

  // Determine if service is corporate incorporation or periodic tax/accounting
  const isIncorporation =
    service.serviceType === 'startup' ||
    (service.title || '').toLowerCase().includes('company') ||
    (service.title || '').toLowerCase().includes('llp');

  // Dynamic Fee Calculations
  const baseGovtFee = service.governmentFee || 0;
  const baseProfFee = service.professionalFee || 0;

  let calculatedGovtFee = baseGovtFee;
  let calculatedProfFee = baseProfFee;

  if (isIncorporation && baseProfFee > 0) {
    // Under MCA SPICe+ rules:
    // Authorized capital <= 15 Lakhs has 0 INR MCA portal fee, only state stamp duty applies.
    if (capitalSlab === '1L' || capitalSlab === '10L' || capitalSlab === '15L') {
      calculatedGovtFee = 1500; // State Stamp Duty (e-MOA/AOA, SPICe)
    } else if (capitalSlab === '25L') {
      calculatedGovtFee = 1500 + 36000; // MCA Part B Slab fee
    } else if (capitalSlab === '50L') {
      calculatedGovtFee = 2500 + 72000;
    }

    // Additional director DSC/DIN fee
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

  const deliverables = service.deliverables && service.deliverables.length > 0
    ? service.deliverables
    : [
        'Certificate of Official Incorporation / Filing Acknowledgement',
        'Senior Corporate Tax Advisor Verification & Advisory Docket',
        'Permanent Digital Vault Archival on Client Portal with 24/7 Access',
        'Post-Filing Statutory Compliance & Deadline Calendar',
      ];

  const processSteps = service.processSteps && service.processSteps.length > 0
    ? service.processSteps
    : [
        { step: 1, title: 'Document Vetting & KYC Intake', description: 'Our legal and compliance team verifies identity proofs, addresses, and statutory prerequisites.' },
        { step: 2, title: 'Application Drafting & Statutory Review', description: 'Preparation of statutory forms, affidavits, declarations, and legal disclosures in accordance with regulations.' },
        { step: 3, title: 'Official Portal Filing & Fee Payment', description: 'Execution on the government portal with generation of the official acknowledgement receipt.' },
        { step: 4, title: 'Liaison & Approval Issuance', description: 'Monitoring processing with the regulatory authority and obtaining the final signed certificate.' },
      ];

  const eligibilityList = service.eligibility && service.eligibility.length > 0
    ? service.eligibility
    : [
        'Proprietorships, Partnerships, LLPs, and Corporate Entities operating in India',
        'Founders, Promoters, and NRIs establishing Indian commercial operations',
        'Businesses seeking mandatory statutory compliance, tax defense, and licensing',
      ];

  const keyBenefits = service.keyBenefits && service.keyBenefits.length > 0
    ? service.keyBenefits
    : [
        '100% Statutory Compliance and penalty avoidance under applicable Indian law',
        'Direct Partner Supervision with verified documentation docket',
        'Faster turnaround backed by official portal direct integration',
      ];

  const rawFaqs = service.faqs && service.faqs.length > 0
    ? service.faqs
    : [
        {
          question: `What is the typical turnaround timeline for ${service.title}?`,
          answer: `Our standard advisory turnaround is ${service.timeline || '3–7 working days'}, subject to government department processing queues and timely submission of verified KYC records.`,
        },
        {
          question: 'Are government portal receipts and challans provided to the client?',
          answer: 'Yes. 100% of official government payment challans, acknowledgment receipts, and digitally signed certificates are delivered directly to you and permanently archived in your client portal.',
        },
        {
          question: 'Do I need to visit your physical chambers in Ahmedabad in person?',
          answer: 'No physical presence is required. All documentation, digital signatures, and filings are managed through our secure portal and WhatsApp hotline. You are also welcome to visit our Nikol Chambers anytime during business hours.',
        },
      ];

  const filteredFaqs = rawFaqs.filter((f) =>
    (f.question || '').toLowerCase().includes(faqFilter.toLowerCase()) ||
    (f.answer || '').toLowerCase().includes(faqFilter.toLowerCase())
  );

  // Cross-Compliance bundled services
  const relatedServices = allServices
    .filter((s) => s._id !== service._id && s.serviceType === service.serviceType)
    .slice(0, 3);

  const getBenefitDescription = (benefitTitle) => {
    const b = (benefitTitle || '').toLowerCase();
    if (b.includes('deduction') || b.includes('optim') || b.includes('tax')) {
      return 'Legitimate tax planning under governing provisions to maximize eligible exemptions and minimize net liability.';
    }
    if (b.includes('penalty') || b.includes('scrutiny') || b.includes('notice') || b.includes('complian')) {
      return 'Comprehensive cross-reconciliation against central tax databases to insulate returns from defect notices.';
    }
    if (b.includes('bank') || b.includes('credit') || b.includes('loan') || b.includes('dossier')) {
      return 'Formally certified financial computation sheet recognized by institutional banks for credit approvals.';
    }
    if (b.includes('vault') || b.includes('archival') || b.includes('record')) {
      return 'Encrypted secure digital storage with round-the-clock redownload of filed acknowledgments and challans.';
    }
    if (b.includes('partner') || b.includes('supervis') || b.includes('vet')) {
      return 'Direct technical vetting by senior compliance practitioners prior to portal submission.';
    }
    return 'Full statutory adherence executed in accordance with official department guidelines to ensure filing validity.';
  };

  const activeSectionObj = NAV_SECTIONS.find((s) => s.id === activeNav) || NAV_SECTIONS[0];

  return (
    <div className="service-dossier-page">
      {/* Top Gold Brand Accent */}
      <div className="dossier-top-accent" aria-hidden="true"></div>

      {/* ============================================================
          1. EXECUTIVE STATUTORY HERO BANNER
          ============================================================ */}
      <header className="executive-hero">
        <div className="dossier-content-wrap">
          {/* Breadcrumb Navigation */}
          <nav className="hero-breadcrumb" aria-label="Breadcrumb">
            <Link to="/"><i className="fas fa-home"></i> Home</Link>
            <span className="sep">/</span>
            <Link to="/services">Practice Areas</Link>
            <span className="sep sep-cat">/</span>
            <span className="cat-name">{currentCategory.label}</span>
            <span className="sep">/</span>
            <span className="current-page">{service.title}</span>
          </nav>

          <div className="hero-grid-header">
            <div className="hero-title-cluster">
              {/* Statutory Badges Strip */}
              <div className="hero-badges-strip">
                <span className="hero-badge badge-authority">
                  <i className="fa-solid fa-landmark"></i> {statutoryInfo.badge}
                </span>
                <span className="hero-badge badge-statute">
                  <i className="fa-solid fa-scale-balanced"></i> {statutoryInfo.statute}
                </span>
                <span className="hero-badge badge-sla">
                  <span className="live-dot"></span> SLA: {service.timeline || '3–5 Business Days'}
                </span>
              </div>

              <h1 className="hero-h1">{service.title}</h1>
              <p className="hero-description">{service.description}</p>

              {/* Quick Hero Actions */}
              <div className="hero-cta-group">
                <a href="#consultation-intake" className="btn-hero-primary">
                  <i className="fas fa-file-contract"></i> Initiate Engagement Mandate
                </a>
                <button type="button" onClick={handlePrintChecklist} className="btn-hero-secondary">
                  <i className="fas fa-print"></i> Print Compliance Sheet
                </button>
                <button type="button" onClick={handleShareDossier} className="btn-hero-share" title="Share with Partners">
                  <i className="fas fa-share-alt"></i> {copiedLink ? 'Link Copied!' : 'Share with Partners'}
                </button>
                <a href="tel:+919510984735" className="hero-hotline-link">
                  <i className="fas fa-phone-alt"></i> Chambers: +91 95109 84735
                </a>
              </div>
            </div>

            {/* Quick Statutory Fact Box in Hero (Desktop Only) */}
            <div className="hero-stats-docket">
              <div className="stat-docket-header">
                <i className="fa-solid fa-shield-halved"></i>
                <div>
                  <strong>Statutory Filing Purview</strong>
                  <span>Official Government Gateway</span>
                </div>
              </div>
              <div className="stat-docket-body">
                <div className="stat-row">
                  <span className="stat-lbl">Regulatory Body</span>
                  <span className="stat-val">{statutoryInfo.authority}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-lbl">Filing Portal</span>
                  <span className="stat-val">{statutoryInfo.portal}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-lbl">Standard Turnaround</span>
                  <span className="stat-val font-semibold">{service.timeline || '3–7 Days'}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-lbl">Practice Oversight</span>
                  <span className="stat-val text-amber">Senior Partner Vetted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          2. STICKY IN-PAGE NAVIGATION (Desktop Row + Mobile/Tablet Drawer)
             Zero awkward horizontal scrolling on mobile/tablet!
          ============================================================ */}
      <nav className="dossier-sticky-subnav" aria-label="Section shortcuts">
        <div className="dossier-content-wrap">
          {/* Desktop Navigation Row (>= 992px) */}
          <div className="subnav-desktop-row">
            {NAV_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className={`subnav-pill ${activeNav === sec.id ? 'active' : ''}`}
                onClick={() => setActiveNav(sec.id)}
              >
                {sec.label}
              </a>
            ))}
          </div>

          {/* Mobile & Tablet Interactive Navigator (< 992px) */}
          <div className="subnav-mobile-bar">
            <div className="mobile-active-section">
              <span className="mobile-sec-badge">
                Section {NAV_SECTIONS.findIndex((s) => s.id === activeNav) + 1} of 6
              </span>
              <strong className="mobile-sec-title">
                <i className={activeSectionObj.icon}></i> {activeSectionObj.shortLabel}
              </strong>
            </div>

            <button
              type="button"
              className="btn-mobile-jump"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-expanded={mobileNavOpen}
            >
              <span>Jump to Section</span>
              <i className={`fas fa-chevron-${mobileNavOpen ? 'up' : 'down'} chevron-icon`}></i>
            </button>
          </div>

          {/* Mobile Quick-Jump Drawer */}
          {mobileNavOpen && (
            <>
              <div
                className="mobile-nav-backdrop"
                onClick={() => setMobileNavOpen(false)}
                aria-hidden="true"
              />
              <div className="mobile-nav-drawer">
                <div className="mobile-nav-grid">
                  {NAV_SECTIONS.map((sec, idx) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className={`mobile-nav-tile ${activeNav === sec.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveNav(sec.id);
                        setMobileNavOpen(false);
                      }}
                    >
                      <div className="tile-top">
                        <span className="tile-num">0{idx + 1}</span>
                        <i className={sec.icon}></i>
                      </div>
                      <strong className="tile-name">{sec.shortLabel}</strong>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* ============================================================
          3. MAIN 2-COLUMN DOSSIER LAYOUT
             Left Column (~68%): Comprehensive Statutory Content
             Right Column (~32%): Sticky Engagement & Action Console
          ============================================================ */}
      <div className="dossier-content-wrap dossier-grid-container">
        {/* ========================================================
            LEFT COLUMN: THE STATUTORY DOSSIER (~68%)
            ======================================================== */}
        <main className="dossier-primary-col">
          {/* SECTION 1: STATUTORY OVERVIEW & REGULATORY SCOPE */}
          <section id="overview" className="dossier-panel">
            <div className="panel-header">
              <div className="panel-badge-icon">
                <i className="fas fa-book-open"></i>
              </div>
              <div>
                <span className="panel-eyebrow">REGULATORY PURVIEW</span>
                <h2 className="panel-heading">Statutory Scope &amp; Legal Foundation</h2>
              </div>
            </div>
            <div className="panel-body">
              <p className="dossier-text-p">
                {service.detailedOverview || service.description}
              </p>

              {/* Statutory Specifications Ledger (Clean, Professional Table on Mobile) */}
              <div className="statutory-specs-ledger">
                <div className="ledger-entry">
                  <span className="ledger-entry-lbl"><i className="fa-solid fa-scale-balanced"></i> Governing Statute</span>
                  <strong className="ledger-entry-val">{statutoryInfo.statute}</strong>
                </div>
                <div className="ledger-entry">
                  <span className="ledger-entry-lbl"><i className="fa-solid fa-landmark"></i> Regulatory Authority</span>
                  <strong className="ledger-entry-val">{statutoryInfo.authority}</strong>
                </div>
                <div className="ledger-entry">
                  <span className="ledger-entry-lbl"><i className="far fa-clock"></i> Filing SLA Turnaround</span>
                  <strong className="ledger-entry-val text-emerald">{service.timeline || '3–7 Business Days'}</strong>
                </div>
                <div className="ledger-entry">
                  <span className="ledger-entry-lbl"><i className="fa-solid fa-vault"></i> Archival &amp; Verification</span>
                  <strong className="ledger-entry-val">Permanent Client Docket &bull; Senior Vetted</strong>
                </div>
              </div>

              {/* Key Strategic Benefits */}
              <div className="benefits-section-wrap">
                <h3 className="sub-heading">Strategic Benefits &amp; Statutory Compliance</h3>
                <div className="benefits-card-grid">
                  {keyBenefits.map((benefit, idx) => (
                    <div key={idx} className="benefit-card">
                      <div className="benefit-badge">
                        <i className="fas fa-check"></i>
                      </div>
                      <div className="benefit-body">
                        <h4>{benefit}</h4>
                        <p>{getBenefitDescription(benefit)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: OFFICIAL DELIVERABLES DOCKET */}
          <section id="deliverables" className="dossier-panel">
            <div className="panel-header">
              <div className="panel-badge-icon badge-emerald">
                <i className="fas fa-certificate"></i>
              </div>
              <div>
                <span className="panel-eyebrow">MANDATE OUTPUTS</span>
                <h2 className="panel-heading">Certified Tangible Deliverables</h2>
              </div>
            </div>
            <div className="panel-body">
              <p className="dossier-text-p">
                Upon successful filing and regulatory adjudication, the client is issued an official statutory compliance docket containing all certificates, official filings, and digitally verified records:
              </p>

              {/* Official Deliverables Registry (Clean, High-Density on Mobile) */}
              <div className="deliverables-docket-grid">
                {deliverables.map((item, idx) => (
                  <div key={idx} className="deliverable-item-card">
                    <div className="del-index-badge">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="del-text-block">
                      <h4>{item}</h4>
                    </div>
                    <span className="del-badge-pill">Official Certified PDF</span>
                  </div>
                ))}
              </div>

              <div className="panel-disclaimer-box">
                <i className="fa-solid fa-shield-halved"></i>
                <div>
                  <strong>Official Government Filing Receipts Guaranteed</strong>
                  <p>All portal transaction fees, challans, and acknowledgments are provided with complete audit transparency.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: MANDATORY STATUTORY DOCUMENTS */}
          <section id="documents" className="dossier-panel">
            <div className="panel-header panel-header-between">
              <div className="header-cluster">
                <div className="panel-badge-icon badge-gold">
                  <i className="fas fa-clipboard-list"></i>
                </div>
                <div>
                  <span className="panel-eyebrow">STATUTORY PREREQUISITES</span>
                  <h2 className="panel-heading">Mandatory Statutory Documents</h2>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="panel-tools">
                <button
                  type="button"
                  className={`btn-panel-action ${copiedChecklist ? 'btn-copied' : ''}`}
                  onClick={handleCopyChecklist}
                  title="Copy checklist to clipboard"
                >
                  <i className={copiedChecklist ? 'fas fa-check' : 'far fa-copy'}></i>
                  <span>{copiedChecklist ? 'Copied!' : 'Copy List'}</span>
                </button>
                <button
                  type="button"
                  className="btn-panel-action btn-print-docket"
                  onClick={handlePrintChecklist}
                  title="Print official letterhead docket"
                >
                  <i className="fas fa-print"></i>
                  <span>Print Sheet</span>
                </button>
              </div>
            </div>
            <div className="panel-body">
              {/* Executive Document Guidance Callout */}
              <div className="document-guideline-strip">
                <i className="fas fa-info-circle"></i>
                <span>All records must be clear, color PDF scans. Identity records must match the central government database exactly. Click any item to mark it assembled:</span>
              </div>

              {/* Interactive Readiness Progress Meter */}
              <div className="readiness-meter-box">
                <div className="meter-label-row">
                  <span className="meter-title">Client Preparedness</span>
                  <strong className="meter-count">{readyDocCount} of {documents.length} Assembled ({docPercentage}%)</strong>
                </div>
                <div className="meter-track">
                  <div className="meter-fill" style={{ width: `${docPercentage}%` }}></div>
                </div>
              </div>

              {/* Clean Document Registry (No Redundant Text) */}
              <div className="documents-list-table">
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className={`document-row-card ${docReadiness[doc] ? 'row-assembled' : ''}`}
                    onClick={() => toggleDocCheck(doc)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        toggleDocCheck(doc);
                      }
                    }}
                  >
                    <div className="doc-num-col">
                      <span className={`doc-check-indicator ${docReadiness[doc] ? 'active' : ''}`}>
                        {docReadiness[doc] ? <i className="fas fa-check"></i> : idx + 1}
                      </span>
                    </div>
                    <div className="doc-content-col">
                      <h4 className="doc-title">{doc}</h4>
                    </div>
                    <div className="doc-status-col">
                      <span className={`doc-tag-pill ${docReadiness[doc] ? 'tag-ready' : 'tag-mandatory'}`}>
                        {docReadiness[doc] ? 'Assembled' : 'Required'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dossier-callout-strip">
                <i className="fas fa-lightbulb"></i>
                <span>
                  <strong>Advisory Note:</strong> If any director or authorized signatory lacks updated Aadhaar mobile linkage or PAN credentials, our compliance desk will facilitate instant rectification prior to portal filing.
                </span>
              </div>
            </div>
          </section>

          {/* SECTION 4: STEP-BY-STEP FILING WORKFLOW */}
          <section id="roadmap" className="dossier-panel">
            <div className="panel-header">
              <div className="panel-badge-icon badge-blue">
                <i className="fas fa-stream"></i>
              </div>
              <div>
                <span className="panel-eyebrow">PROCEDURAL PROTOCOL</span>
                <h2 className="panel-heading">Step-by-Step Filing Workflow</h2>
              </div>
            </div>
            <div className="panel-body">
              <p className="dossier-text-p">
                Our engagement follows a transparent, 5-stage procedural workflow designed to guarantee zero notice exposure and rapid statutory clearance:
              </p>

              <div className="statutory-timeline">
                {processSteps.map((step, idx) => (
                  <div key={idx} className="timeline-node">
                    <div className="timeline-marker">
                      <span className="marker-number">{step.step || idx + 1}</span>
                    </div>
                    <div className="timeline-card">
                      <div className="timeline-card-header">
                        <span className="timeline-phase-tag">Stage 0{step.step || idx + 1}</span>
                        <h3>{step.title}</h3>
                      </div>
                      <p className="timeline-desc">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5: ELIGIBILITY CRITERIA */}
          <section id="eligibility" className="dossier-panel">
            <div className="panel-header">
              <div className="panel-badge-icon">
                <i className="fas fa-user-check"></i>
              </div>
              <div>
                <span className="panel-eyebrow">QUALIFICATION</span>
                <h2 className="panel-heading">Eligibility &amp; Mandatory Preconditions</h2>
              </div>
            </div>
            <div className="panel-body">
              <div className="eligibility-split-grid">
                <div className="eligibility-box">
                  <h4 className="box-title"><i className="fas fa-check-circle text-emerald"></i> Who Should Avail This Service</h4>
                  <ul className="eligibility-ul">
                    {eligibilityList.map((item, idx) => (
                      <li key={idx}>
                        <i className="fas fa-arrow-right"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="eligibility-box box-highlighted">
                  <h4 className="box-title"><i className="fa-solid fa-lock text-amber"></i> Client Assurance Commitments</h4>
                  <ul className="eligibility-ul">
                    <li>
                      <i className="fas fa-shield-alt"></i>
                      <span><strong>NDA Protection:</strong> All proprietary business plans and financial statements remain strictly confidential.</span>
                    </li>
                    <li>
                      <i className="fas fa-user-tie"></i>
                      <span><strong>Senior Supervision:</strong> All documentation vetted by senior corporate practitioners before portal upload.</span>
                    </li>
                    <li>
                      <i className="fas fa-receipt"></i>
                      <span><strong>Direct Portal Receipts:</strong> 100% government fee challans provided directly to your accounting department.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* High-Value Advisory: Post-Filing Compliances */}
              <div className="post-filing-compliance-box">
                <div className="post-compliance-header">
                  <i className="fa-solid fa-calendar-check"></i>
                  <div>
                    <h4>Post-Filing Statutory Compliance Roadmap</h4>
                    <p>Maintaining regulatory good standing after initial registration is mandatory under Indian law:</p>
                  </div>
                </div>
                <div className="post-compliance-grid">
                  <div className="compliance-mini-card">
                    <span className="comp-day">Within 30 Days</span>
                    <strong>Current Bank Account</strong>
                    <p>Formal opening of entity bank account with official COI &amp; PAN.</p>
                  </div>
                  <div className="compliance-mini-card">
                    <span className="comp-day">Within 30 Days</span>
                    <strong>Auditor Appointment</strong>
                    <p>Statutory appointment of auditor via Ministry Form ADT-1.</p>
                  </div>
                  <div className="compliance-mini-card">
                    <span className="comp-day">Within 180 Days</span>
                    <strong>Commencement of Business</strong>
                    <p>Mandatory capital subscription filing via Form INC-20A.</p>
                  </div>
                  <div className="compliance-mini-card">
                    <span className="comp-day">Periodic</span>
                    <strong>GST &amp; TDS Compliances</strong>
                    <p>Timely monthly/quarterly return filings to avoid compounding penalties.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: STATUTORY FAQS ACCORDION */}
          <section id="faqs" className="dossier-panel">
            <div className="panel-header panel-header-between">
              <div className="header-cluster">
                <div className="panel-badge-icon">
                  <i className="fas fa-question-circle"></i>
                </div>
                <div>
                  <span className="panel-eyebrow">CLARIFICATIONS</span>
                  <h2 className="panel-heading">Statutory &amp; Practice FAQs</h2>
                </div>
              </div>
              <div className="faq-search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={faqFilter}
                  onChange={(e) => setFaqFilter(e.target.value)}
                  className="faq-search-input"
                />
              </div>
            </div>
            <div className="panel-body">
              <div className="dossier-accordion">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, idx) => (
                    <div key={idx} className={`accordion-item ${openFaq === idx ? 'expanded' : ''}`}>
                      <button
                        type="button"
                        className="accordion-trigger"
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        aria-expanded={openFaq === idx}
                      >
                        <span className="faq-q-text">{faq.question}</span>
                        <i className={`fas fa-chevron-${openFaq === idx ? 'up' : 'down'}`}></i>
                      </button>
                      {openFaq === idx && (
                        <div className="accordion-content">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="faq-empty-state">
                    <p>No questions matched your search term.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 7: FREQUENTLY BUNDLED STATUTORY COMPLIANCES */}
          {relatedServices.length > 0 && (
            <section className="dossier-panel bundled-compliances-panel">
              <div className="panel-header">
                <div className="panel-badge-icon badge-gold">
                  <i className="fas fa-cubes"></i>
                </div>
                <div>
                  <span className="panel-eyebrow">INTEGRATED MANDATES</span>
                  <h2 className="panel-heading">Frequently Bundled Compliances</h2>
                </div>
              </div>
              <div className="panel-body">
                <div className="bundled-cards-grid">
                  {relatedServices.map((rel) => (
                    <div key={rel._id} className="bundled-card">
                      <div className="bundled-card-top">
                        <span className="bundled-type">{rel.serviceType}</span>
                        <h4>{rel.title}</h4>
                        <p>{rel.description}</p>
                      </div>
                      <div className="bundled-card-footer">
                        <span className="bundled-timeline"><i className="far fa-clock"></i> {rel.timeline || '3–5 Days'}</span>
                        <Link to={`/services/${rel._id}`} className="btn-bundled-view">
                          View Dossier <i className="fas fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        {/* ========================================================
            RIGHT COLUMN: STICKY EXECUTIVE ACTION CONSOLE (~32%)
            ======================================================== */}
        <aside className="dossier-sidebar-col">
          <div className="sticky-action-stack">
            {/* SIDEBAR CARD 1: TRANSPARENT STATUTORY FEE BREAKDOWN */}
            <div className="sidebar-card fee-schedule-card">
              <div className="sidebar-card-top">
                <span className="sidebar-kicker">ENGAGEMENT SCHEDULE</span>
                <h3 className="sidebar-title">Transparent Mandate Pricing</h3>
              </div>

              {hasStructuredFees ? (
                <div className="fee-structure-block">
                  {/* Dynamic Slab Selector for Incorporation */}
                  {isIncorporation && (
                    <div className="slab-selector-cluster">
                      <div className="slab-group">
                        <label className="slab-label">Authorized Share Capital Slab</label>
                        <div className="slab-btn-row">
                          {[
                            { id: '10L', label: '₹10 Lakh' },
                            { id: '15L', label: '₹15 Lakh' },
                            { id: '25L', label: '₹25 Lakh' },
                            { id: '50L', label: '₹50 Lakh' },
                          ].map((slab) => (
                            <button
                              key={slab.id}
                              type="button"
                              className={`slab-tab ${capitalSlab === slab.id ? 'active' : ''}`}
                              onClick={() => setCapitalSlab(slab.id)}
                            >
                              {slab.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="slab-group">
                        <label className="slab-label">Designated Directors (DIN &amp; DSC)</label>
                        <div className="director-stepper">
                          <button
                            type="button"
                            className="btn-stepper"
                            disabled={directorCount <= 2}
                            onClick={() => setDirectorCount((c) => Math.max(2, c - 1))}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="stepper-val">{directorCount} Directors</span>
                          <button
                            type="button"
                            className="btn-stepper"
                            disabled={directorCount >= 6}
                            onClick={() => setDirectorCount((c) => Math.min(6, c + 1))}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Slab Selector for Tax / Returns */}
                  {!isIncorporation && (
                    <div className="slab-selector-cluster">
                      <div className="slab-group">
                        <label className="slab-label">Annual Turnover / Volume Tier</label>
                        <div className="slab-btn-row">
                          {[
                            { id: 'micro', label: '< ₹20L' },
                            { id: 'sme', label: '₹20L–1.5Cr' },
                            { id: 'mid', label: '₹1.5Cr–5Cr' },
                            { id: 'enterprise', label: '> ₹5Cr' },
                          ].map((tier) => (
                            <button
                              key={tier.id}
                              type="button"
                              className={`slab-tab ${turnoverTier === tier.id ? 'active' : ''}`}
                              onClick={() => setTurnoverTier(tier.id)}
                            >
                              {tier.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="slab-group">
                        <label className="slab-label">Filing Frequency Model</label>
                        <div className="slab-btn-row">
                          {[
                            { id: 'annual', label: 'Annual' },
                            { id: 'quarterly', label: 'Quarterly' },
                            { id: 'monthly', label: 'Monthly' },
                          ].map((freq) => (
                            <button
                              key={freq.id}
                              type="button"
                              className={`slab-tab ${filingFrequency === freq.id ? 'active' : ''}`}
                              onClick={() => setFilingFrequency(freq.id)}
                            >
                              {freq.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="fee-primary-display">
                    <span className="fee-label">Total Estimated Investment</span>
                    <div className="fee-sum">₹{totalMandateFee.toLocaleString('en-IN')}</div>
                    <span className="fee-subtext">Statutory portal fees + Senior legal drafting retainer</span>
                  </div>

                  <div className="fee-itemized-ledger">
                    <div className="ledger-row">
                      <span className="ledger-lbl">
                        Government Portal &amp; Stamp Duty
                        <small className="block-sub">Official MCA/GSTN challan provided</small>
                      </span>
                      <strong className="ledger-val">
                        {calculatedGovtFee > 0 ? `₹${calculatedGovtFee.toLocaleString('en-IN')}` : 'Nil (Govt Waiver)'}
                      </strong>
                    </div>

                    <div className="ledger-row">
                      <span className="ledger-lbl">
                        Advisory &amp; Drafting Retainer
                        <small className="block-sub">Includes Class-3 DSC &amp; Senior vetting</small>
                      </span>
                      <strong className="ledger-val">
                        ₹{calculatedProfFee.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <div className="ledger-divider"></div>

                    <div className="ledger-row total-row">
                      <span className="total-name">Total Outlay</span>
                      <strong className="total-num">₹{totalMandateFee.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className="fee-guarantee-note">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Official government payment challan provided directly to client. Zero hidden fees.</span>
                  </div>
                </div>
              ) : (
                <div className="fee-structure-block">
                  <div className="fee-primary-display">
                    <span className="fee-label">Advisory Retainer</span>
                    <div className="fee-sum">Custom Mandate</div>
                    <span className="fee-subtext">Scope-based engagement tailored to entity turnover</span>
                  </div>
                  <div className="fee-guarantee-note">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Includes complimentary initial statutory compliance assessment.</span>
                  </div>
                </div>
              )}

              {/* Engagement Assurance Badges */}
              <div className="sidebar-trust-strip">
                <div className="trust-pill"><i className="fa-solid fa-file-invoice"></i> 100% Official Receipts</div>
                <div className="trust-pill"><i className="fa-solid fa-shield-alt"></i> Non-Disclosure Protected</div>
                <div className="trust-pill"><i className="fa-solid fa-user-shield"></i> Senior Advisor Vetted</div>
              </div>
            </div>

            {/* SIDEBAR CARD 2: FAST-TRACK MANDATE INTAKE FORM WITH DIRECT FILE DROPZONE */}
            <div className="sidebar-card intake-form-card" id="consultation-intake">
              <div className="sidebar-card-top">
                <span className="sidebar-kicker">MANDATE INTAKE DESK</span>
                <h3 className="sidebar-title">Book Service Engagement</h3>
                <p className="sidebar-desc">Submit your details to receive our formal statutory engagement docket within 2 business hours.</p>
              </div>

              {formStatus.success && (
                <div className="form-alert-box alert-success">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Mandate Logged Successfully</strong>
                    <p>Our senior corporate tax advisors will review your file and reach out today.</p>
                  </div>
                </div>
              )}

              {formStatus.error && (
                <div className="form-alert-box alert-error">
                  <i className="fas fa-exclamation-circle"></i>
                  <div>
                    <strong>Submission Note</strong>
                    <p>{formStatus.error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="dossier-intake-form">
                <div className="form-group-field">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="form-control-input"
                  />
                </div>

                <div className="form-group-field">
                  <label htmlFor="phone">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="form-control-input"
                  />
                </div>

                <div className="form-group-field">
                  <label htmlFor="email">Corporate Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="rahul@enterprise.com"
                    className="form-control-input"
                  />
                </div>

                <div className="form-group-field">
                  <label htmlFor="entityName">Commercial Entity / Proposed Name</label>
                  <input
                    type="text"
                    id="entityName"
                    name="entityName"
                    value={formData.entityName}
                    onChange={handleInputChange}
                    placeholder="e.g. Apex Logix Private Limited"
                    className="form-control-input"
                  />
                </div>

                {/* Direct KYC Docket File Upload Attachment */}
                <div className="form-group-field">
                  <label>Attach KYC / Statutory Records (Optional)</label>
                  {!attachedFile ? (
                    <label className="file-dropzone-label">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        className="file-hidden-input"
                      />
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Upload PAN / Aadhaar / Entity Document (PDF/Image)</span>
                      <small>Max file size: 10 MB</small>
                    </label>
                  ) : (
                    <div className="attached-file-pill">
                      <div className="file-pill-left">
                        <i className="fas fa-file-pdf"></i>
                        <div>
                          <strong>{attachedFile.name}</strong>
                          <span>{attachedFile.size}</span>
                        </div>
                      </div>
                      <button type="button" onClick={handleRemoveFile} className="btn-file-remove" title="Remove attachment">
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group-field">
                  <label htmlFor="message">Filing Deadlines / Specific Notes</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="2"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Mention any urgent deadline, turnover volume, or query..."
                    className="form-control-textarea"
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit-mandate" disabled={formStatus.submitting}>
                  {formStatus.submitting ? (
                    <span><i className="fas fa-spinner fa-spin"></i> Processing Docket...</span>
                  ) : (
                    <span>Submit Engagement Mandate <i className="fas fa-arrow-right"></i></span>
                  )}
                </button>
              </form>
            </div>

            {/* SIDEBAR CARD 3: PHYSICAL CHAMBERS & DIRECT COUNSEL */}
            <div className="sidebar-card chambers-docket-card">
              <div className="chambers-docket-header">
                <i className="fas fa-landmark text-amber"></i>
                <div>
                  <strong>Shree Chamunda Associates</strong>
                  <span>Corporate Tax &amp; Advisory Chambers</span>
                </div>
              </div>

              <div className="chambers-docket-body">
                <p className="chambers-street">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>612, Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad - 380049</span>
                </p>

                <div className="chambers-direct-actions">
                  <a
                    href={`https://wa.me/919510984735?text=${encodeURIComponent(
                      `Hello Shree Chamunda Associates, I would like to consult on statutory mandate: ${service.title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-chambers-wa"
                  >
                    <i className="fab fa-whatsapp"></i> Chat with Senior Counsel
                  </a>
                  <a href="tel:+919510984735" className="btn-chambers-call">
                    <i className="fas fa-phone-alt"></i> Call Nikol Chambers: +91 95109 84735
                  </a>
                </div>

                <div className="chambers-timing">
                  <i className="far fa-clock"></i>
                  <span>Chambers Hours: Mon–Sat, 9:30 AM – 7:30 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ServiceDetail;
