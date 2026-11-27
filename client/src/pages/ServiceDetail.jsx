import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getServiceById, getServices, submitContact } from '../api';
import { findFallbackService, FALLBACK_SERVICES } from '../data/fallbackServices';
import useSEO from '../hooks/useSEO';
import {
  CATEGORY_MAP,
  getStatutoryAuthority,
  getPostFilingRoadmap,
  selectBundledServices,
  calculateMandatePricing,
  printChecklistDocument,
} from '../components/service-detail/serviceDetailHelpers';
import ServiceSpecsWorkbench from '../components/service-detail/ServiceSpecsWorkbench';
import ServiceEngagementDesk from '../components/service-detail/ServiceEngagementDesk';
import ServiceClarificationsVault from '../components/service-detail/ServiceClarificationsVault';
import ServiceBundledEcosystem from '../components/service-detail/ServiceBundledEcosystem';
import './ServiceDetail.css';

const buildInitialReadiness = (docs) => {
  const initialDocs = {};
  (docs || []).forEach((doc) => {
    initialDocs[doc] = false;
  });
  return initialDocs;
};

/**
 * Dynamic Service Dossier page composing executive overview, specs workbench,
 * scope/retainer calibrator, clarifications vault, and integrated practice areas.
 */
const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    entityName: '',
    message: '',
  });
  const [attachedFile, setAttachedFile] = useState(null);
  const [formStatus, setFormStatus] = useState({ submitting: false, success: false, error: null });

  const [docReadiness, setDocReadiness] = useState({});
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [faqFilter, setFaqFilter] = useState('');

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
    const hydrateService = (data) => {
      setService(data);
      setOpenFaq(0);
      setFilingFrequency(data.serviceType === 'accounting' ? 'monthly' : 'annual');
      setDocReadiness(buildInitialReadiness(data.documentsRequired));
    };

    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const [res, allRes] = await Promise.all([
          getServiceById(id).catch((err) => ({ success: false, error: err.message })),
          getServices().catch(() => ({ data: [] })),
        ]);

        if (res?.success && res?.data) {
          hydrateService(res.data);
        } else {
          const fallback = findFallbackService(id);
          if (fallback) {
            hydrateService(fallback);
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
          hydrateService(fallback);
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.type || 'Document',
    });
  };

  const toggleDocCheck = (docName) => {
    setDocReadiness((prev) => ({ ...prev, [docName]: !prev[docName] }));
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
      'MANDATORY STATUTORY COMPLIANCE CHECKLIST',
      `Service: ${service?.title || 'Statutory Filing'}`,
      'Firm: Shree Chamunda Associates | Corporate Tax & Advisory Chambers',
      'Chambers: 612, Hill Town Square, Nikol, Ahmedabad - 380049',
      'Direct Advisory Hotline: +91 95109 84735',
      '--------------------------------------------------',
      ...docs.map((d, i) => `${docReadiness[d] ? '[READY]' : '[PENDING]'} ${i + 1}. ${d}`),
      '--------------------------------------------------',
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
  const currentCategory = CATEGORY_MAP[service.serviceType] || {
    label: 'Corporate Advisory',
    icon: 'fa-solid fa-briefcase',
    code: 'ADV',
  };
  const postFilingRoadmap = getPostFilingRoadmap(service, isIncorporation);
  const pricingSummary = calculateMandatePricing(service, isIncorporation, {
    capitalSlab,
    directorCount,
    turnoverTier,
    filingFrequency,
  });

  const titleWords = (service.title || '').trim().split(/\s+/);
  const leadWords = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') : '';
  const highlightWord = titleWords.length > 1 ? titleWords[titleWords.length - 1] : service.title;

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

  const relatedServices = selectBundledServices(allServices, service);

  return (
    <div className="service-dossier-page">
      {/* BAND 01: EXECUTIVE SWISS-FINTECH HERO & STATUTORY LEDGER */}
      <header className="service-hero-band">
        <div className="dossier-shell-wrap service-hero-container">
          <span className="service-hero-watermark" aria-hidden="true">
            {statutoryInfo.watermark}
          </span>

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

            <div className="service-hero-actions">
              <a href="#consultation-intake" className="btn-service-primary">
                <span>Initiate Engagement Mandate</span>
                <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </a>
              <button
                type="button"
                onClick={() => printChecklistDocument(service.title, documents, docReadiness)}
                className="btn-service-secondary"
              >
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
                <span className="ledger-label">Filing &amp; Vault Channel</span>
                <strong className="val-emerald">{statutoryInfo.portal} &bull; Partner Vetted</strong>
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
                <span className="ledger-label">Retainer &amp; Checklist</span>
                <strong>
                  {pricingSummary.heroMandateFeeLabel} &bull; {readyDocCount}/{documents.length} Ready
                </strong>
              </div>
              <i className="fa-solid fa-chevron-right ledger-arrow" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </header>

      <ServiceSpecsWorkbench
        service={service}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        keyBenefits={keyBenefits}
        deliverables={deliverables}
        documents={documents}
        docReadiness={docReadiness}
        readyDocCount={readyDocCount}
        docPercentage={docPercentage}
        onToggleDocCheck={toggleDocCheck}
        copiedChecklist={copiedChecklist}
        onCopyChecklist={handleCopyChecklist}
        onPrintChecklist={() => printChecklistDocument(service.title, documents, docReadiness)}
        processSteps={processSteps}
        eligibilityList={eligibilityList}
        postFilingRoadmap={postFilingRoadmap}
      />

      <ServiceEngagementDesk
        service={service}
        isIncorporation={isIncorporation}
        capitalSlab={capitalSlab}
        onCapitalSlabChange={setCapitalSlab}
        directorCount={directorCount}
        onDirectorCountChange={setDirectorCount}
        turnoverTier={turnoverTier}
        onTurnoverTierChange={setTurnoverTier}
        filingFrequency={filingFrequency}
        onFilingFrequencyChange={setFilingFrequency}
        pricingSummary={pricingSummary}
        formData={formData}
        onInputChange={handleInputChange}
        attachedFile={attachedFile}
        onFileUpload={handleFileUpload}
        onRemoveFile={() => setAttachedFile(null)}
        formStatus={formStatus}
        onFormSubmit={handleFormSubmit}
      />

      <ServiceClarificationsVault
        serviceTitle={service.title}
        rawFaqs={rawFaqs}
        filteredFaqs={filteredFaqs}
        faqFilter={faqFilter}
        onFaqFilterChange={setFaqFilter}
        openFaq={openFaq}
        onToggleFaq={setOpenFaq}
      />

      <ServiceBundledEcosystem relatedServices={relatedServices} />
    </div>
  );
};

export default ServiceDetail;
