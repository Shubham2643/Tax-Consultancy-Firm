import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getMyDocuments, 
  uploadDocument, 
  deleteDocument, 
  getMyInquiries, 
  updateDocument, 
  getClientConsultations, 
  bookConsultation, 
  getClientInvoices, 
  postClientComment,
  downloadPortalDocument
} from '../api';
import useSEO from '../hooks/useSEO';
import axios from 'axios';
import './Portal.css';

const Portal = () => {
  useSEO({ title: 'Client Portal Dashboard | Shree Chamunda Associates', description: 'Secure workspace for document management, tax filing tracking, and consultations.' });
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [tab, setTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [documents, setDocuments] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  
  // Razorpay state handlers
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [processingInvoiceId, setProcessingInvoiceId] = useState(null);
  const [serviceSlug, setServiceSlug] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Booking & Invoicing form states
  const [bookingForm, setBookingForm] = useState({ date: '', timeSlot: '10:00 AM - 11:00 AM', serviceType: 'GST Filing', notes: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState({});

  // Custom Dialog/Modal States
  const [editingDoc, setEditingDoc] = useState(null);
  const [editName, setEditName] = useState('');
  const [editService, setEditService] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [deletingDoc, setDeletingDoc] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await getMyDocuments();
      if (res.success) setDocuments(res.data);
    } catch { /* ignore */ }
  }, []);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await getMyInquiries();
      if (res.success) setInquiries(res.data);
    } catch { /* ignore */ }
  }, []);

  const fetchConsultations = useCallback(async () => {
    try {
      const res = await getClientConsultations();
      if (res.success) setConsultations(res.data);
    } catch { /* ignore */ }
  }, []);

  const fetchInvoices = useCallback(async () => {
    try {
      const res = await getClientInvoices();
      if (res.success) setInvoices(res.data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (user) {
      setLoadingData(true);
      Promise.all([
        fetchDocuments(), 
        fetchInquiries(),
        fetchConsultations(),
        fetchInvoices()
      ]).finally(() => setLoadingData(false));
    }
  }, [user, fetchDocuments, fetchInquiries, fetchConsultations, fetchInvoices]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be under 10MB' });
      return;
    }
    setUploadFile(file);
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploadLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          await uploadDocument({
            fileData: reader.result,
            originalName: uploadFile.name,
            mimeType: uploadFile.type,
            serviceSlug,
          });
          setMessage({ type: 'success', text: 'Document uploaded successfully to your vault!' });
          setUploadFile(null);
          setServiceSlug('');
          setTab('documents');
          fetchDocuments();
        } catch (err) {
          setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed' });
        } finally {
          setUploadLoading(false);
        }
      };
      reader.readAsDataURL(uploadFile);
    } catch {
      setUploadLoading(false);
    }
  };

  const handleOpenEdit = (doc) => {
    setEditingDoc(doc);
    setEditName(doc.originalName);
    setEditService(doc.serviceSlug || '');
    setEditFile(null);
    setMessage({ type: '', text: '' });
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      setMessage({ type: 'error', text: 'Document name is required' });
      return;
    }
    setEditLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        originalName: editName.trim(),
        serviceSlug: editService.trim()
      };

      if (editFile) {
        const fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(editFile);
        });
        payload.fileData = fileData;
        payload.mimeType = editFile.type;
      }

      const res = await updateDocument(editingDoc._id, payload);
      if (res.success) {
        setMessage({ type: 'success', text: 'Document updated successfully!' });
        setEditingDoc(null);
        fetchDocuments();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleOpenDelete = (doc) => {
    setDeletingDoc(doc);
    setMessage({ type: '', text: '' });
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteDocument(deletingDoc._id);
      setDocuments((prev) => prev.filter((d) => d._id !== deletingDoc._id));
      setMessage({ type: 'success', text: 'Document deleted successfully from vault.' });
      setDeletingDoc(null);
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete document' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBookConsultation = async (e) => {
    e.preventDefault();
    if (!bookingForm.date || !bookingForm.notes.trim()) {
      setMessage({ type: 'error', text: 'Please fill in the appointment date and discussion objective.' });
      return;
    }
    setBookingLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await bookConsultation({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        serviceType: bookingForm.serviceType,
        notes: bookingForm.notes
      });
      if (res.success) {
        setMessage({ type: 'success', text: 'Consultation slot requested! Our CA coordinator will confirm shortly.' });
        setBookingForm({ date: '', timeSlot: '10:00 AM - 11:00 AM', serviceType: 'GST Filing', notes: '' });
        fetchConsultations();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
    } finally {
      setBookingLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayInvoice = async (invoiceId) => {
    setPaymentProcessing(true);
    setProcessingInvoiceId(invoiceId);
    setMessage({ type: '', text: '' });
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setMessage({ type: 'error', text: 'Payment gateway failed to initialize. Please check your network connection.' });
        setPaymentProcessing(false);
        setProcessingInvoiceId(null);
        return;
      }

      const token = localStorage.getItem('authToken');
      const invoiceObj = invoices.find(inv => inv._id === invoiceId);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portal/payments/create-order`,
        { invoiceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const { orderId, amount, currency, keyId } = res.data;

        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: "Shree Chamunda Associates",
          description: `Invoice ${invoiceObj.invoiceNumber}`,
          image: window.location.origin + '/assets/logo_new.jpg',
          order_id: orderId,
          handler: async function (response) {
            try {
              setPaymentProcessing(true);
              setProcessingInvoiceId(invoiceObj._id);
              const verifyRes = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portal/payments/verify-signature`,
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  invoiceId: invoiceObj._id
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (verifyRes.data.success) {
                setMessage({ type: 'success', text: 'Payment verified! Invoice marked as paid.' });
                fetchInvoices();
              } else {
                setMessage({ type: 'error', text: verifyRes.data.message || 'Signature verification failed.' });
              }
            } catch (err) {
              setMessage({ type: 'error', text: err.response?.data?.message || 'Verification failed.' });
            } finally {
              setPaymentProcessing(false);
              setProcessingInvoiceId(null);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || ''
          },
          theme: {
            color: "#071324"
          },
          modal: {
            ondismiss: function () {
              setPaymentProcessing(false);
              setProcessingInvoiceId(null);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setPaymentProcessing(false);
        setProcessingInvoiceId(null);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to initialize payment gateway.' });
      setPaymentProcessing(false);
      setProcessingInvoiceId(null);
    }
  };

  const handlePostComment = async (inquiryId) => {
    const text = newCommentText[inquiryId];
    if (!text || !text.trim()) return;

    try {
      const res = await postClientComment(inquiryId, text.trim());
      if (res.success) {
        setNewCommentText(prev => ({ ...prev, [inquiryId]: '' }));
        setInquiries(prev => prev.map(inq => inq._id === inquiryId ? res.data : inq));
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to post comment' });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getFileIcon = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    if (ext === 'pdf') return { icon: 'fa-file-pdf', class: 'pdf' };
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return { icon: 'fa-file-image', class: 'image' };
    if (['doc', 'docx'].includes(ext)) return { icon: 'fa-file-word', class: 'word' };
    if (['xls', 'xlsx', 'csv'].includes(ext)) return { icon: 'fa-file-excel', class: 'excel' };
    return { icon: 'fa-file-alt', class: 'generic' };
  };

  const totalDocs = documents.length;
  const activeInquiries = inquiries.filter(i => ['new', 'pending', 'in-progress'].includes(i.status)).length;
  const resolvedInquiries = inquiries.filter(i => ['resolved', 'approved', 'closed'].includes(i.status)).length;

  const getLatestDate = () => {
    const dates = [
      ...documents.map(d => new Date(d.uploadedAt)),
      ...inquiries.map(i => new Date(i.createdAt))
    ].filter(d => !isNaN(d.getTime()));
    
    if (dates.length === 0) return 'No actions yet';
    const latest = new Date(Math.max(...dates));
    return latest.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (authLoading || !user) {
    return (
      <div className="portal-loading-screen">
        <div className="portal-spinner"></div>
        <p>Verifying 256-bit encrypted session...</p>
      </div>
    );
  }

  return (
    <div className="portal-app-container">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div className="portal-drawer-backdrop" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* ========================================================
          SIDEBAR: Executive Midnight Command Center
          ======================================================== */}
      <aside className={`portal-sidebar-panel ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand-box">
          <div className="brand-crest-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="brand-meta-info">
            <h3>SCA Workspace</h3>
            <span className="vault-live-badge">
              <span className="live-pulse-dot"></span> CA Audit Vault
            </span>
          </div>
          <button 
            type="button" 
            className="portal-sidebar-mobile-close" 
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close navigation"
          >
            &times;
          </button>
        </div>

        {/* User Profile Card */}
        <div className="sidebar-user-card">
          <div className="user-avatar-circle">{user.name.charAt(0).toUpperCase()}</div>
          <div className="user-meta-details">
            <h4>{user.name}</h4>
            <span className="user-role-tag">Verified Client</span>
            <p className="user-email-text">{user.email}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="sidebar-menu-list">
          <button 
            className={`sidebar-tab-btn ${tab === 'overview' ? 'active' : ''}`} 
            onClick={() => { setTab('overview'); setIsSidebarOpen(false); }}
          >
            <div className="tab-icon-wrap"><i className="fas fa-chart-pie"></i></div>
            <span className="tab-label">Executive Overview</span>
          </button>

          <button 
            className={`sidebar-tab-btn ${tab === 'inquiries' ? 'active' : ''}`} 
            onClick={() => { setTab('inquiries'); setIsSidebarOpen(false); }}
          >
            <div className="tab-icon-wrap"><i className="fas fa-tasks"></i></div>
            <span className="tab-label">Tax Filings &amp; Status</span>
            {activeInquiries > 0 && <span className="tab-badge-counter active-count">{activeInquiries}</span>}
          </button>

          <button 
            className={`sidebar-tab-btn ${tab === 'documents' ? 'active' : ''}`} 
            onClick={() => { setTab('documents'); setIsSidebarOpen(false); }}
          >
            <div className="tab-icon-wrap"><i className="fas fa-folder-open"></i></div>
            <span className="tab-label">Document Vault</span>
            {totalDocs > 0 && <span className="tab-badge-counter docs-count">{totalDocs}</span>}
          </button>

          <button 
            className={`sidebar-tab-btn ${tab === 'bookings' ? 'active' : ''}`} 
            onClick={() => { setTab('bookings'); setIsSidebarOpen(false); }}
          >
            <div className="tab-icon-wrap"><i className="fas fa-calendar-check"></i></div>
            <span className="tab-label">Book CA Consultation</span>
          </button>

          <button 
            className={`sidebar-tab-btn ${tab === 'billing' ? 'active' : ''}`} 
            onClick={() => { setTab('billing'); setIsSidebarOpen(false); }}
          >
            <div className="tab-icon-wrap"><i className="fas fa-receipt"></i></div>
            <span className="tab-label">Invoices &amp; Billing</span>
          </button>

          <button 
            className={`sidebar-tab-btn ${tab === 'upload' ? 'active' : ''}`} 
            onClick={() => { setTab('upload'); setIsSidebarOpen(false); }}
          >
            <div className="tab-icon-wrap"><i className="fas fa-cloud-upload-alt"></i></div>
            <span className="tab-label">Fast Document Upload</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-bottom-actions">
          <Link to="/" className="sidebar-website-btn">
            <i className="fas fa-arrow-left"></i> Back to Main Site
          </Link>
          <button className="sidebar-logout-pill" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout Session
          </button>
        </div>
      </aside>

      {/* ========================================================
          MAIN VIEWPORT: Dashboard Stage
          ======================================================== */}
      <main className="portal-content-stage">
        {/* Modern Top Header Bar */}
        <header className="portal-executive-topbar">
          <div className="topbar-left-zone">
            <button className="portal-mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle Navigation">
              <i className="fas fa-bars"></i>
            </button>
            <div className="topbar-tab-icon-badge">
              {tab === 'overview' && <i className="fas fa-chart-pie"></i>}
              {tab === 'inquiries' && <i className="fas fa-tasks"></i>}
              {tab === 'documents' && <i className="fas fa-folder-open"></i>}
              {tab === 'bookings' && <i className="fas fa-calendar-check"></i>}
              {tab === 'billing' && <i className="fas fa-receipt"></i>}
              {tab === 'upload' && <i className="fas fa-cloud-upload-alt"></i>}
            </div>
            <div className="topbar-title-block">
              <div className="topbar-breadcrumb">
                <span className="breadcrumb-root">Workspace</span>
                <i className="fas fa-chevron-right breadcrumb-separator"></i>
                <span className="breadcrumb-current">
                  {tab === 'overview' && 'Executive Overview'}
                  {tab === 'inquiries' && 'Tax Filings Tracker'}
                  {tab === 'documents' && 'Document Vault'}
                  {tab === 'bookings' && 'CA Consultations'}
                  {tab === 'billing' && 'Invoices & Billing'}
                  {tab === 'upload' && 'Document Upload'}
                </span>
              </div>
              <span className="topbar-sub-kicker">Shree Chamunda Associates &bull; ICAI Compliant Audit Session</span>
            </div>
          </div>

          <div className="topbar-right-zone">
            {tab !== 'upload' && (
              <button className="topbar-quick-upload-btn" onClick={() => setTab('upload')}>
                <i className="fas fa-plus"></i>
                <span>Upload File</span>
              </button>
            )}

            <a 
              href="https://wa.me/919510984735?text=Hello%20CA%20Team!%20I%20am%20logged%20into%20my%20SCA%20Client%20Portal%20and%20need%20assistance."
              target="_blank" 
              rel="noopener noreferrer" 
              className="topbar-wa-btn"
            >
              <i className="fab fa-whatsapp"></i>
              <span>WhatsApp Expert Desk</span>
            </a>

            <div className="topbar-user-mini-chip">
              <div className="topbar-user-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <div className="topbar-user-info">
                <strong>{user.name}</strong>
                <span className="topbar-user-badge">
                  <span className="live-status-dot"></span> Verified Client
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Alert Notifications */}
        {message && message.text && (
          <div className={`portal-alert-ribbon ${message.type}`}>
            <div className="alert-content-left">
              <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage({ type: '', text: '' })} className="alert-dismiss-btn">&times;</button>
          </div>
        )}

        {/* Body Viewport Area */}
        <div className="portal-body-stage">
          {loadingData ? (
            <div className="portal-content-loader">
              <div className="portal-spinner"></div>
              <p>Fetching encrypted client records...</p>
            </div>
          ) : tab === 'overview' ? (
            /* ========================================================
               TAB: OVERVIEW
               ======================================================== */
            <div className="overview-flow fade-in">
              {/* Executive Hero Banner */}
              <div className="portal-hero-card">
                <div className="hero-text-content">
                  <h1>Welcome to your tax command center, {user.name}!</h1>
                  <p>Track ongoing GST/ITR filings, collaborate directly with your assigned Chartered Accountant, and access confidential tax records anytime.</p>
                </div>
                <div className="hero-action-buttons">
                  <button className="btn-hero-primary" onClick={() => setTab('upload')}>
                    <i className="fas fa-cloud-upload-alt"></i> Upload Document
                  </button>
                  <button className="btn-hero-secondary" onClick={() => setTab('bookings')}>
                    <i className="fas fa-calendar-alt"></i> Book CA Slot
                  </button>
                </div>
              </div>

              {/* 4 Bento Metric KPI Cards */}
              <div className="portal-kpi-grid">
                <div className="kpi-bento-card" onClick={() => setTab('inquiries')}>
                  <div className="kpi-icon-wrap blue">
                    <i className="fas fa-file-signature"></i>
                  </div>
                  <div className="kpi-info-wrap">
                    <span className="kpi-number">{activeInquiries}</span>
                    <span className="kpi-label">Active Tax Filings</span>
                  </div>
                  <i className="fas fa-arrow-right kpi-corner-arrow"></i>
                </div>

                <div className="kpi-bento-card" onClick={() => setTab('documents')}>
                  <div className="kpi-icon-wrap gold">
                    <i className="fas fa-folder"></i>
                  </div>
                  <div className="kpi-info-wrap">
                    <span className="kpi-number">{totalDocs}</span>
                    <span className="kpi-label">Vault Documents</span>
                  </div>
                  <i className="fas fa-arrow-right kpi-corner-arrow"></i>
                </div>

                <div className="kpi-bento-card">
                  <div className="kpi-icon-wrap green">
                    <i className="fas fa-check-double"></i>
                  </div>
                  <div className="kpi-info-wrap">
                    <span className="kpi-number">{resolvedInquiries}</span>
                    <span className="kpi-label">Completed Filings</span>
                  </div>
                </div>

                <div className="kpi-bento-card">
                  <div className="kpi-icon-wrap slate">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="kpi-info-wrap">
                    <span className="kpi-number text-date">{getLatestDate()}</span>
                    <span className="kpi-label">Latest Vault Activity</span>
                  </div>
                </div>
              </div>

              {/* Dual Intelligence Stage */}
              <div className="overview-dual-grid">
                {/* Recent Activities Timeline */}
                <div className="portal-bento-card activity-timeline-card">
                  <div className="bento-card-header">
                    <div className="bento-header-left">
                      <div className="bento-header-icon"><i className="fas fa-history"></i></div>
                      <div className="bento-header-title">
                        <span className="bento-kicker">AUDIT TRAIL</span>
                        <h3>Recent Vault Activity</h3>
                      </div>
                    </div>
                  </div>

                  <div className="bento-card-body">
                    <div className="timeline-flow-list">
                      {documents.slice(0, 3).map((doc) => (
                        <div key={doc._id} className="timeline-event-row">
                          <div className="event-icon-circle doc"><i className="fas fa-file-alt"></i></div>
                          <div className="event-details-box">
                            <p>Document uploaded: <strong>{doc.originalName}</strong></p>
                            <span>{new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} &bull; {doc.serviceSlug || 'General'}</span>
                          </div>
                        </div>
                      ))}
                      {inquiries.slice(0, 2).map((inq) => (
                        <div key={inq._id} className="timeline-event-row">
                          <div className="event-icon-circle inq"><i className="fas fa-paper-plane"></i></div>
                          <div className="event-details-box">
                            <p>Inquiry created: <strong>{inq.service || 'General Advisory'}</strong></p>
                            <span>{new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} &bull; Status: {inq.status}</span>
                          </div>
                        </div>
                      ))}
                      {documents.length === 0 && inquiries.length === 0 && (
                        <div className="empty-state-card">
                          <i className="fas fa-inbox"></i>
                          <p>No recent actions logged. Upload your first document to begin.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assigned CA Desk & Quick Actions */}
                <div className="portal-bento-card ca-desk-card">
                  <div className="bento-card-header">
                    <div className="bento-header-left">
                      <div className="bento-header-icon"><i className="fas fa-user-tie"></i></div>
                      <div className="bento-header-title">
                        <span className="bento-kicker">ADVISORY TEAM</span>
                        <h3>Assigned CA Support Desk</h3>
                      </div>
                    </div>
                  </div>

                  <div className="bento-card-body">
                    <div className="ca-advisor-box">
                      <div className="ca-avatar-ring">
                        <i className="fas fa-user-shield"></i>
                      </div>
                      <div className="ca-info-text">
                        <h4>Senior Compliance Team</h4>
                        <span>ICAI Registered Tax &amp; Corporate Auditors</span>
                        <p>Direct assistance available for notice handling, balance sheets, and ROC filings.</p>
                      </div>
                    </div>

                    <div className="desk-shortcuts-stack">
                      <button className="shortcut-tile-btn" onClick={() => setTab('upload')}>
                        <div className="shortcut-icon"><i className="fas fa-cloud-upload-alt"></i></div>
                        <div className="shortcut-text">
                          <strong>Fast Document Drop</strong>
                          <span>Upload Form 16, Bank Statements, or P&amp;L</span>
                        </div>
                        <i className="fas fa-chevron-right"></i>
                      </button>

                      <button className="shortcut-tile-btn" onClick={() => setTab('bookings')}>
                        <div className="shortcut-icon"><i className="fas fa-calendar-check"></i></div>
                        <div className="shortcut-text">
                          <strong>Schedule 1-on-1 CA Session</strong>
                          <span>Book direct audit video call or meeting</span>
                        </div>
                        <i className="fas fa-chevron-right"></i>
                      </button>

                      <button className="shortcut-tile-btn" onClick={() => setTab('inquiries')}>
                        <div className="shortcut-icon"><i className="fas fa-comments"></i></div>
                        <div className="shortcut-text">
                          <strong>Active Filing Discussions</strong>
                          <span>Send inquiries and review filing drafts</span>
                        </div>
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : tab === 'inquiries' ? (
            /* ========================================================
               TAB: FILINGS & INQUIRIES
               ======================================================== */
            <div className="filings-flow fade-in">
              {/* Executive Hero Banner */}
              <div className="portal-hero-card">
                <div className="hero-text-content">
                  <h1>Tax Filings &amp; Service Milestones</h1>
                  <p>Monitor progress stages for statutory filings, GST registrations, direct tax inquiries, and collaborate directly with your assigned CA auditor.</p>
                </div>
                <div className="hero-action-buttons">
                  <button className="btn-hero-primary" onClick={() => navigate('/services')}>
                    <i className="fas fa-search-dollar"></i> Catalog Services
                  </button>
                  <button className="btn-hero-secondary" onClick={() => setTab('upload')}>
                    <i className="fas fa-cloud-upload-alt"></i> Upload Files
                  </button>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="portal-bento-card empty-vault-box">
                  <div className="empty-icon-wrap"><i className="fas fa-inbox"></i></div>
                  <h3>No Active Service Filings Found</h3>
                  <p>Submit an inquiry through our services catalog or contact desk to start tracking milestones here.</p>
                  <button className="btn-hero-primary" onClick={() => navigate('/services')}>
                    Browse Service Catalog &rarr;
                  </button>
                </div>
              ) : (
                <div className="filings-cards-stack">
                  {inquiries.map((inq) => {
                    const step1 = true;
                    const step2 = ['pending', 'in-progress', 'resolved', 'approved', 'closed'].includes(inq.status);
                    const step3 = ['in-progress', 'resolved', 'approved', 'closed'].includes(inq.status);
                    const step4 = ['resolved', 'approved', 'closed'].includes(inq.status);

                    return (
                      <div key={inq._id} className="portal-bento-card filing-tracker-card">
                        <div className="filing-card-top">
                          <div className="filing-header-left">
                            <span className="filing-badge-icon"><i className="fas fa-file-invoice"></i></span>
                            <div className="filing-title-group">
                              <div className="filing-title-flex">
                                <h3>{inq.service || 'General Tax Consultation'}</h3>
                                <span className={`status-pill ${inq.status}`}>{inq.status}</span>
                              </div>
                              <span className="filing-date-text">
                                <i className="far fa-calendar-alt"></i> Initiated on {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="filing-client-quote">
                          <i className="fas fa-quote-left"></i>
                          <p>{inq.message}</p>
                        </div>

                        {/* Interactive 4-Stage Milestone Tracker */}
                        <div className="portal-milestone-rail">
                          <div className={`milestone-node-wrap ${step1 ? 'completed' : ''}`}>
                            <div className="milestone-circle"><i className="fas fa-paper-plane"></i></div>
                            <span className="milestone-name">Request Logged</span>
                          </div>
                          <div className={`milestone-line ${step2 ? 'completed' : ''}`}></div>

                          <div className={`milestone-node-wrap ${step2 ? 'completed' : ''}`}>
                            <div className="milestone-circle"><i className="fas fa-search"></i></div>
                            <span className="milestone-name">CA Verification</span>
                          </div>
                          <div className={`milestone-line ${step3 ? 'completed' : ''}`}></div>

                          <div className={`milestone-node-wrap ${step3 ? 'completed' : ''}`}>
                            <div className="milestone-circle"><i className="fas fa-cogs"></i></div>
                            <span className="milestone-name">Filing &amp; Computation</span>
                          </div>
                          <div className={`milestone-line ${step4 ? 'completed' : ''}`}></div>

                          <div className={`milestone-node-wrap ${step4 ? 'completed' : ''}`}>
                            <div className="milestone-circle"><i className="fas fa-check-circle"></i></div>
                            <span className="milestone-name">Filing Approved</span>
                          </div>
                        </div>

                        {/* Live CA-Client Discussion Thread */}
                        <div className="filing-chat-thread">
                          <div className="chat-thread-header">
                            <i className="fas fa-comments"></i>
                            <h4>CA-Client Advisory Discussion</h4>
                          </div>

                          <div className="chat-messages-container">
                            {(inq.comments || []).map((comm, idx) => (
                              <div key={idx} className={`chat-bubble-row ${comm.senderRole === 'admin' ? 'advisor' : 'client'}`}>
                                <div className="chat-bubble">
                                  <div className="bubble-header">
                                    <strong>{comm.senderName}</strong>
                                    <span>{new Date(comm.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p>{comm.text}</p>
                                </div>
                              </div>
                            ))}
                            {(inq.comments || []).length === 0 && (
                              <p className="no-chat-prompt">No messages posted yet. Use the box below to ask questions or post document clarifications.</p>
                            )}
                          </div>

                          <div className="chat-input-bar">
                            <input 
                              type="text" 
                              value={newCommentText[inq._id] || ''} 
                              onChange={(e) => {
                                const val = e.target.value;
                                setNewCommentText(prev => ({ ...prev, [inq._id]: val }));
                              }} 
                              placeholder="Write a message to your Chartered Accountant..." 
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handlePostComment(inq._id);
                              }}
                            />
                            <button className="chat-send-btn" onClick={() => handlePostComment(inq._id)}>
                              <span>Send</span> <i className="fas fa-paper-plane"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : tab === 'documents' ? (
            /* ========================================================
               TAB: DOCUMENT VAULT
               ======================================================== */
            <div className="vault-flow fade-in">
              {/* Executive Hero Banner */}
              <div className="portal-hero-card">
                <div className="hero-text-content">
                  <h1>Confidential Document Vault</h1>
                  <p>Access audit files, salary slips, P&amp;L balance sheets, and tax acknowledgments stored in encrypted cloud storage with instant download.</p>
                </div>
                <div className="hero-action-buttons">
                  <button className="btn-hero-primary" onClick={() => setTab('upload')}>
                    <i className="fas fa-cloud-upload-alt"></i> Upload New File
                  </button>
                  <button className="btn-hero-secondary" onClick={() => setTab('bookings')}>
                    <i className="fas fa-calendar-alt"></i> Book CA Slot
                  </button>
                </div>
              </div>

              {documents.length === 0 ? (
                <div className="portal-bento-card empty-vault-box">
                  <div className="empty-icon-wrap"><i className="fas fa-folder-open"></i></div>
                  <h3>Your Document Vault is Empty</h3>
                  <p>Upload your tax receipts, PAN/Aadhaar copies, or GST invoices to start secure compliance auditing.</p>
                  <button className="btn-hero-primary" onClick={() => setTab('upload')}>
                    Upload Document Now &rarr;
                  </button>
                </div>
              ) : (
                <div className="portal-bento-card vault-table-card">
                  <div className="table-responsive-box">
                    <table className="portal-data-table">
                      <thead>
                        <tr>
                          <th>Document Title</th>
                          <th>Category &amp; Date</th>
                          <th>CA Review Note</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((doc) => {
                          const fileInfo = getFileIcon(doc.originalName);
                          return (
                            <tr key={doc._id}>
                              <td>
                                <div className="table-card-head">
                                  <div className="vault-file-cell">
                                    <span className={`file-badge ${fileInfo.class}`}>
                                      <i className={`fas ${fileInfo.icon}`}></i>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => downloadPortalDocument(doc._id, doc.originalName)}
                                      className="filename-download-trigger"
                                      title={`Download ${doc.originalName}`}
                                    >
                                      {doc.originalName}
                                    </button>
                                  </div>
                                  <span className="table-size">{(doc.fileSize / 1024).toFixed(1)} KB</span>
                                </div>
                              </td>
                              <td>
                                <span className="vault-tag-pill">{doc.serviceSlug || 'General'}</span> &bull; <span className="table-date">{new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </td>
                              <td>
                                {doc.adminNote ? (
                                  <span className="ca-note-chip" title={doc.adminNote}>
                                    <i className="fas fa-comment-dots"></i> {doc.adminNote}
                                  </span>
                                ) : (
                                  <span className="empty-dash">-</span>
                                )}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="table-action-btns">
                                  <button 
                                    className="btn-table-action edit" 
                                    onClick={() => handleOpenEdit(doc)} 
                                    title="Edit Document"
                                  >
                                    <i className="fas fa-edit"></i> <span>Edit</span>
                                  </button>
                                  <button 
                                    className="btn-table-action delete" 
                                    onClick={() => handleOpenDelete(doc)} 
                                    title="Delete Document"
                                  >
                                    <i className="fas fa-trash-alt"></i> <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : tab === 'upload' ? (
            /* ========================================================
               TAB: UPLOAD FILE
               ======================================================== */
            <div className="upload-flow fade-in">
              {/* Executive Hero Banner */}
              <div className="portal-hero-card">
                <div className="hero-text-content">
                  <h1>Fast &amp; Secure Document Drop</h1>
                  <p>Upload bank statements, Form-16, invoices, and accounting ledgers directly to our CA audit desk.</p>
                </div>
                <div className="hero-action-buttons">
                  <button className="btn-hero-primary" onClick={() => setTab('documents')}>
                    <i className="fas fa-folder-open"></i> View Vault
                  </button>
                  <button className="btn-hero-secondary" onClick={() => setTab('inquiries')}>
                    <i className="fas fa-tasks"></i> Filings
                  </button>
                </div>
              </div>

              <div className="portal-bento-card upload-center-card">
                <div className="dropzone-core-box">
                  <input 
                    type="file" 
                    id="portal-file-picker" 
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" 
                    onChange={handleFileChange} 
                  />

                  {!uploadFile ? (
                    <label htmlFor="portal-file-picker" className="mobile-upload-tapzone">
                      <div className="dropzone-icon-ring"><i className="fas fa-cloud-upload-alt"></i></div>
                      <h3>Tap to Choose Document</h3>
                      <p className="dropzone-formats">PDF, JPG, PNG, DOCX, XLSX up to 10MB</p>
                      <span className="btn-file-select">
                        <i className="fas fa-folder-open"></i> Choose File from Device
                      </span>
                    </label>
                  ) : (
                    <div className="upload-file-ready-box">
                      <div className="selected-file-preview-card">
                        <div className="file-preview-icon">
                          <i className={`fas ${getFileIcon(uploadFile.name).icon}`}></i>
                        </div>
                        <div className="file-preview-meta">
                          <strong title={uploadFile.name}>{uploadFile.name}</strong>
                          <span>{(uploadFile.size / 1024).toFixed(1)} KB &bull; Ready to transmit</span>
                        </div>
                        <button 
                          type="button" 
                          className="btn-clear-selected-file" 
                          onClick={() => setUploadFile(null)}
                          title="Remove file"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <label htmlFor="portal-file-picker" className="btn-change-file">
                        <i className="fas fa-sync-alt"></i> Choose Different File
                      </label>
                    </div>
                  )}

                  <div className="upload-meta-fields">
                    <div className="form-group-custom">
                      <label><i className="fas fa-tag"></i> Select Category</label>
                      <div className="quick-tags-list">
                        {['GST Filing', 'ITR Return', 'Bank Statement', 'Form 16', 'KYC / PAN', 'Balance Sheet'].map(cat => (
                          <button
                            type="button"
                            key={cat}
                            className={`quick-tag-chip ${serviceSlug === cat ? 'active' : ''}`}
                            onClick={() => setServiceSlug(cat)}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <input 
                        type="text" 
                        value={serviceSlug} 
                        onChange={(e) => setServiceSlug(e.target.value)} 
                        placeholder="Or enter custom category name" 
                      />
                    </div>
                  </div>

                  <button 
                    className="btn-submit-upload" 
                    disabled={!uploadFile || uploadLoading} 
                    onClick={handleUpload}
                  >
                    {uploadLoading ? (
                      <span><i className="fas fa-spinner fa-spin"></i> Encrypting &amp; Uploading...</span>
                    ) : (
                      <span><i className="fas fa-lock"></i> Encrypt &amp; Save to Vault</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : tab === 'bookings' ? (
            /* ========================================================
               TAB: BOOK CONSULTATIONS
               ======================================================== */
            <div className="bookings-flow fade-in">
              {/* Executive Hero Banner */}
              <div className="portal-hero-card">
                <div className="hero-text-content">
                  <h1>Consultations &amp; Advisory Scheduler</h1>
                  <p>Book live strategy sessions with our senior Chartered Accountants for tax minimization, notice defense, and corporate structuring.</p>
                </div>
                <div className="hero-action-buttons">
                  <a 
                    href="https://wa.me/919510984735?text=Hello%20CA%20Team!%20I%20would%20like%20to%20schedule%20an%20urgent%20consultation." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-hero-primary"
                  >
                    <i className="fab fa-whatsapp"></i> Instant WhatsApp Desk
                  </a>
                </div>
              </div>

              <div className="bookings-dual-grid">
                {/* Appointment Form */}
                <div className="portal-bento-card booking-form-bento">
                  <div className="bento-card-header">
                    <div className="bento-header-left">
                      <div className="bento-header-icon"><i className="fas fa-calendar-plus"></i></div>
                      <div className="bento-header-title">
                        <span className="bento-kicker">APPOINTMENT REQUEST</span>
                        <h3>Schedule CA Strategy Session</h3>
                      </div>
                    </div>
                  </div>

                  <div className="bento-card-body">
                    <form onSubmit={handleBookConsultation} className="portal-form-stack">
                      <div className="form-group-custom">
                        <label>Select Practice Field</label>
                        <select 
                          value={bookingForm.serviceType} 
                          onChange={(e) => setBookingForm(prev => ({ ...prev, serviceType: e.target.value }))}
                        >
                          <option value="GST Filing">GST Registration &amp; Monthly Filing</option>
                          <option value="Income Tax Return">Income Tax Audits &amp; Returns (ITR)</option>
                          <option value="Business Startup Advisory">Company / LLP Incorporation</option>
                          <option value="Bookkeeping Consultancy">Bookkeeping &amp; Accounting Retainer</option>
                          <option value="Virtual CFO Leadership">Virtual CFO Strategic Advisory</option>
                        </select>
                      </div>

                      <div className="form-row-custom">
                        <div className="form-group-custom">
                          <label>Desired Date</label>
                          <input 
                            type="date" 
                            value={bookingForm.date} 
                            onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                            required 
                          />
                        </div>
                        <div className="form-group-custom">
                          <label>Time Slot (IST)</label>
                          <select 
                            value={bookingForm.timeSlot} 
                            onChange={(e) => setBookingForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                          >
                            <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                            <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                            <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                            <option value="03:30 PM - 04:30 PM">03:30 PM - 04:30 PM</option>
                            <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group-custom">
                        <label>Consultation Agenda / Notes</label>
                        <textarea 
                          value={bookingForm.notes} 
                          onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))} 
                          placeholder="Describe the tax query or notice requirement you want to discuss..." 
                          rows="4"
                          required
                        ></textarea>
                      </div>

                      <button type="submit" className="btn-hero-primary full-width" disabled={bookingLoading}>
                        {bookingLoading ? (
                          <span><i className="fas fa-spinner fa-spin"></i> Submitting Request...</span>
                        ) : (
                          <span><i className="fas fa-calendar-check"></i> Request Consultation Slot</span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Scheduled Bookings History */}
                <div className="portal-bento-card bookings-list-bento">
                  <div className="bento-card-header">
                    <div className="bento-header-left">
                      <div className="bento-header-icon"><i className="fas fa-history"></i></div>
                      <div className="bento-header-title">
                        <span className="bento-kicker">APPOINTMENT LOG</span>
                        <h3>My Scheduled Sessions</h3>
                      </div>
                    </div>
                  </div>

                  <div className="bento-card-body">
                    {consultations.length === 0 ? (
                      <div className="empty-state-card">
                        <i className="far fa-calendar-times"></i>
                        <p>No booked consultations found. Fill out the scheduler form to reserve your slot.</p>
                      </div>
                    ) : (
                      <div className="appointment-items-stack">
                        {consultations.map(booking => (
                          <div key={booking._id} className="appointment-card">
                            <div className="appointment-card-top">
                              <span className="appointment-service-tag">{booking.serviceType}</span>
                              <span className={`status-pill ${booking.status}`}>{booking.status}</span>
                            </div>
                            <p className="appointment-notes">"{booking.notes}"</p>
                            <div className="appointment-meta-row">
                              <span><i className="far fa-calendar-alt"></i> {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              <span><i className="far fa-clock"></i> {booking.timeSlot}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================
               TAB: BILLING & INVOICES
               ======================================================== */
            <div className="billing-flow fade-in">
              {/* Executive Hero Banner */}
              <div className="portal-hero-card">
                <div className="hero-text-content">
                  <h1>Invoices &amp; Retainer Clearances</h1>
                  <p>Review statutory advisory retainers and clear audit fees online via UPI, Credit/Debit Cards, or Net Banking powered by Razorpay.</p>
                </div>
                <div className="hero-action-buttons">
                  <button className="btn-hero-primary" onClick={() => setTab('overview')}>
                    <i className="fas fa-chart-pie"></i> View Overview
                  </button>
                </div>
              </div>

              {invoices.length === 0 ? (
                <div className="portal-bento-card empty-vault-box">
                  <div className="empty-icon-wrap"><i className="fas fa-receipt"></i></div>
                  <h3>No Billing Invoices Pending</h3>
                  <p>Invoices generated for audits and retainers will appear here for one-click settlement.</p>
                </div>
              ) : (
                <div className="portal-bento-card vault-table-card">
                  <div className="table-responsive-box">
                    <table className="portal-data-table">
                      <thead>
                        <tr>
                          <th>Invoice &amp; Status</th>
                          <th>Service Description</th>
                          <th>Fee &amp; Due Date</th>
                          <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map(inv => (
                          <tr key={inv._id}>
                            <td>
                              <div className="table-card-head">
                                <span className="monospace-code">{inv.invoiceNumber}</span>
                                <span className={`status-pill ${inv.status}`}>{inv.status}</span>
                              </div>
                            </td>
                            <td><strong>{inv.serviceName}</strong></td>
                            <td>
                              <span className="table-meta-item">
                                <span className="meta-key">Amount:</span> <strong className="invoice-amount-text">₹{Number(inv.amount).toLocaleString('en-IN')}</strong>
                              </span>
                              &bull; <span className="table-date">Due: {new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {inv.status === 'unpaid' ? (
                                <button 
                                  className="btn-pay-razorpay" 
                                  onClick={() => handlePayInvoice(inv._id)}
                                  disabled={paymentProcessing}
                                >
                                  {paymentProcessing && processingInvoiceId === inv._id ? (
                                    <span><i className="fas fa-spinner fa-spin"></i> Processing...</span>
                                  ) : (
                                    <span><i className="fas fa-credit-card"></i> Pay Online</span>
                                  )}
                                </button>
                              ) : (
                                <span className="paid-success-pill"><i className="fas fa-check-circle"></i> Settled</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ========================================================
          MODAL: EDIT DOCUMENT METADATA
          ======================================================== */}
      {editingDoc && (
        <div className="portal-modal-overlay">
          <div className="portal-modal-window">
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <i className="fas fa-edit"></i>
                <h3>Edit Document Details</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setEditingDoc(null)}>&times;</button>
            </div>
            <div className="modal-body-content">
              <div className="form-group-custom">
                <label>Document Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter filename"
                />
              </div>
              <div className="form-group-custom">
                <label>Associated Service</label>
                <input
                  type="text"
                  value={editService}
                  onChange={(e) => setEditService(e.target.value)}
                  placeholder="e.g. gst-filing"
                />
              </div>
              <div className="form-group-custom">
                <label><i className="fas fa-sync-alt"></i> Replace File (Optional)</label>
                <input
                  type="file"
                  id="modal-replace-file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => setEditFile(e.target.files[0])}
                />
                <label htmlFor="modal-replace-file" className="file-picker-trigger">
                  <i className="fas fa-paperclip"></i> {editFile ? editFile.name : 'Select Replacement File'}
                </label>
              </div>
            </div>
            <div className="modal-bottom-bar">
              <button className="btn-modal-cancel" onClick={() => setEditingDoc(null)}>Cancel</button>
              <button className="btn-hero-primary" disabled={editLoading} onClick={handleSaveEdit}>
                {editLoading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: DELETE CONFIRMATION
          ======================================================== */}
      {deletingDoc && (
        <div className="portal-modal-overlay">
          <div className="portal-modal-window delete-warning-window">
            <div className="modal-top-bar">
              <div className="modal-title-wrap text-danger">
                <i className="fas fa-exclamation-triangle"></i>
                <h3>Delete Document Permanently?</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setDeletingDoc(null)}>&times;</button>
            </div>
            <div className="modal-body-content">
              <p>Are you sure you want to delete <strong>{deletingDoc.originalName}</strong>?</p>
              <span className="warning-sub">This action cannot be undone. The document will be permanently expunged from the audit repository.</span>
            </div>
            <div className="modal-bottom-bar">
              <button className="btn-modal-cancel" onClick={() => setDeletingDoc(null)}>Cancel</button>
              <button className="btn-delete-confirm" disabled={deleteLoading} onClick={handleConfirmDelete}>
                {deleteLoading ? <><i className="fas fa-spinner fa-spin"></i> Deleting...</> : 'Delete Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portal;
