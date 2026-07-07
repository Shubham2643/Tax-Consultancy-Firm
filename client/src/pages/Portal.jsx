import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  postClientComment 
} from '../api';
import useSEO from '../hooks/useSEO';
import axios from 'axios';
import './Portal.css';

const Portal = () => {
  useSEO({ title: 'Client Portal Dashboard', description: 'Manage your documents, track filings, and communicate with tax advisors.' });
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [tab, setTab] = useState('overview');
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
  const [activeInquiryDetails, setActiveInquiryDetails] = useState(null);

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
      setMessage({ type: 'error', text: 'File must be under 10MB' });
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
          setMessage({ type: 'success', text: 'Document uploaded successfully!' });
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

  // Trigger custom edit modal
  const handleOpenEdit = (doc) => {
    setEditingDoc(doc);
    setEditName(doc.originalName);
    setEditService(doc.serviceSlug || '');
    setEditFile(null);
    setMessage({ type: '', text: '' });
  };

  // Submit edits
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

  // Trigger custom warning delete modal
  const handleOpenDelete = (doc) => {
    setDeletingDoc(doc);
    setMessage({ type: '', text: '' });
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteDocument(deletingDoc._id);
      setDocuments((prev) => prev.filter((d) => d._id !== deletingDoc._id));
      setMessage({ type: 'success', text: 'Document deleted successfully!' });
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
      setMessage({ type: 'error', text: 'Please fill in the date and reason for appointment.' });
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
        setMessage({ type: 'success', text: 'Appointment request submitted successfully!' });
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
        setMessage({ type: 'error', text: 'Razorpay SDK failed to load. Please check your network connection.' });
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
          image: window.location.origin + '/assets/shreeChamundalogo.png',
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
                setMessage({ type: 'success', text: 'Payment successful! Invoice has been cleared.' });
                fetchInvoices();
              } else {
                setMessage({ type: 'error', text: verifyRes.data.message || 'Signature verification failed.' });
              }
            } catch (err) {
              setMessage({ type: 'error', text: err.response?.data?.message || 'Verification request failed.' });
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
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to initialize payment.' });
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
        if (activeInquiryDetails?._id === inquiryId) {
          setActiveInquiryDetails(res.data);
        }
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
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return { icon: 'fa-file-image', class: 'image' };
    if (['doc', 'docx'].includes(ext)) return { icon: 'fa-file-word', class: 'word' };
    if (['xls', 'xlsx', 'csv'].includes(ext)) return { icon: 'fa-file-excel', class: 'excel' };
    return { icon: 'fa-file-alt', class: 'generic' };
  };

  const totalDocs = documents.length;
  const totalInquiries = inquiries.length;
  const activeInquiries = inquiries.filter(i => ['new', 'pending', 'in-progress'].includes(i.status)).length;
  const resolvedInquiries = inquiries.filter(i => ['resolved', 'approved', 'closed'].includes(i.status)).length;

  const getLatestDate = () => {
    const dates = [
      ...documents.map(d => new Date(d.uploadedAt)),
      ...inquiries.map(i => new Date(i.createdAt))
    ].filter(d => !isNaN(d.getTime()));
    
    if (dates.length === 0) return 'No recent activity';
    const latest = new Date(Math.max(...dates));
    return latest.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (authLoading || !user) return <div className="portal-loading-screen"><div className="portal-spinner"></div><p>Verifying secure session...</p></div>;

  return (
    <div className="portal-dashboard">
      {/* Sidebar Navigation */}
      <aside className="portal-sidebar">
        <div className="sidebar-brand">
          <i className="fas fa-shield-alt"></i>
          <div>
            <h3>SCA Workspace</h3>
            <span>Secure Client Portal</span>
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="profile-details">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`sidebar-nav-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
            <i className="fas fa-th-large"></i> Overview
          </button>
          <button className={`sidebar-nav-btn ${tab === 'inquiries' ? 'active' : ''}`} onClick={() => setTab('inquiries')}>
            <i className="fas fa-envelope-open-text"></i> Filings & Services
            {activeInquiries > 0 && <span className="sidebar-count">{activeInquiries}</span>}
          </button>
          <button className={`sidebar-nav-btn ${tab === 'documents' ? 'active' : ''}`} onClick={() => setTab('documents')}>
            <i className="fas fa-folder-open"></i> Document Vault
            {totalDocs > 0 && <span className="sidebar-count docs">{totalDocs}</span>}
          </button>
          <button className={`sidebar-nav-btn ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
            <i className="fas fa-calendar-check"></i> Book Consultation
          </button>
          <button className={`sidebar-nav-btn ${tab === 'billing' ? 'active' : ''}`} onClick={() => setTab('billing')}>
            <i className="fas fa-file-invoice-dollar"></i> Billing Vault
          </button>
          <button className={`sidebar-nav-btn ${tab === 'upload' ? 'active' : ''}`} onClick={() => setTab('upload')}>
            <i className="fas fa-cloud-upload-alt"></i> Upload Files
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="portal-main">
        {/* Top Navbar */}
        <header className="portal-topbar">
          <h2>{tab.charAt(0).toUpperCase() + tab.slice(1)} Dashboard</h2>
          <div className="topbar-actions">
            <span className="topbar-status"><span className="pulse-dot"></span> Secure Connection</span>
          </div>
        </header>

        {/* Messaging Area */}
        {message && message.text && (
          <div className={`portal-alert-message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })} className="alert-close-btn">&times;</button>
          </div>
        )}

        {/* Tab Viewports */}
        <div className="portal-viewport">
          {loadingData ? (
            <div className="portal-loading-container"><div className="portal-spinner"></div><p>Fetching secure database records...</p></div>
          ) : tab === 'overview' ? (
            /* TAB: OVERVIEW */
            <div className="overview-tab-view">
              <div className="portal-greeting-card">
                <h1>Welcome back, {user.name}!</h1>
                <p>Manage your uploaded documents, track active service requests, and review tax filing feedback in your secure advisory folder.</p>
              </div>

              {/* Metric Card Widgets Grid */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon blue"><i className="fas fa-file-signature"></i></div>
                  <div className="metric-info">
                    <h3>{activeInquiries}</h3>
                    <p>Active Filings</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon amber"><i className="fas fa-folder"></i></div>
                  <div className="metric-info">
                    <h3>{totalDocs}</h3>
                    <p>Vault Documents</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon green"><i className="fas fa-check-double"></i></div>
                  <div className="metric-info">
                    <h3>{resolvedInquiries}</h3>
                    <p>Completed Filings</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon slate"><i className="fas fa-history"></i></div>
                  <div className="metric-info">
                    <h3>{getLatestDate()}</h3>
                    <p>Latest Activity</p>
                  </div>
                </div>
              </div>

              {/* Dual Layout */}
              <div className="overview-split-layout">
                {/* Recent Activities */}
                <div className="overview-split-card">
                  <h3>Recent Activities</h3>
                  <div className="activity-timeline">
                    {documents.slice(0, 3).map((doc) => (
                      <div key={doc._id} className="activity-item">
                        <div className="activity-dot doc"></div>
                        <div className="activity-details">
                          <p>Uploaded <strong>{doc.originalName}</strong></p>
                          <span>{new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    ))}
                    {inquiries.slice(0, 2).map((inq) => (
                      <div key={inq._id} className="activity-item">
                        <div className="activity-dot inq"></div>
                        <div className="activity-details">
                          <p>Submitted inquiry for <strong>{inq.service || 'General'}</strong></p>
                          <span>{new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    ))}
                    {documents.length === 0 && inquiries.length === 0 && (
                      <p className="no-activities">No recent actions logged.</p>
                    )}
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="overview-split-card quick-actions-panel">
                  <h3>Quick Tools</h3>
                  <div className="quick-actions-buttons">
                    <button className="quick-action-btn" onClick={() => setTab('upload')}>
                      <i className="fas fa-upload"></i> Upload Tax Document
                    </button>
                    <button className="quick-action-btn secondary" onClick={() => navigate('/services')}>
                      <i className="fas fa-search-dollar"></i> Catalog Services
                    </button>
                    <button className="quick-action-btn tertiary" onClick={() => setTab('inquiries')}>
                      <i className="fas fa-file-invoice"></i> Track My Filings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : tab === 'inquiries' ? (
            /* TAB: FILINGS & INQUIRIES */
            <div className="portal-section-pane">
              <div className="pane-header-group">
                <h3>Tax Services & Inquiries</h3>
                <p>Track progress milestones for tax advisory requests submitted through our contact channels.</p>
              </div>

              {inquiries.length === 0 ? (
                <div className="portal-empty-state"><i className="fas fa-inbox"></i><p>No active filings found. Select a service from our catalog to submit an inquiry.</p></div>
              ) : (
                <div className="inquiry-milestones-list">
                  {inquiries.map((inq) => {
                    const step1 = true; // Always submitted
                    const step2 = ['pending', 'in-progress', 'resolved', 'approved', 'closed'].includes(inq.status);
                    const step3 = ['in-progress', 'resolved', 'approved', 'closed'].includes(inq.status);
                    const step4 = ['resolved', 'approved', 'closed'].includes(inq.status);

                    return (
                      <div key={inq._id} className="inquiry-progress-card">
                        <div className="inquiry-card-header">
                          <div>
                            <h4>{inq.service || 'General Consultation'}</h4>
                            <span className="inquiry-date"><i className="far fa-calendar-alt"></i> Submitted: {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <span className={`status-badge-capsule ${inq.status}`}>{inq.status}</span>
                        </div>

                        <p className="inquiry-card-message">"{inq.message}"</p>

                        {/* Interactive Timeline Tracker */}
                        <div className="timeline-tracker">
                          <div className={`timeline-step ${step1 ? 'active' : ''}`}>
                            <div className="timeline-node"><i className="fas fa-paper-plane"></i></div>
                            <div className="timeline-label">Inquiry Sent</div>
                          </div>
                          <div className={`timeline-connector ${step2 ? 'active' : ''}`}></div>

                          <div className={`timeline-step ${step2 ? 'active' : ''}`}>
                            <div className="timeline-node"><i className="fas fa-search"></i></div>
                            <div className="timeline-label">Reviewing Info</div>
                          </div>
                          <div className={`timeline-connector ${step3 ? 'active' : ''}`}></div>

                          <div className={`timeline-step ${step3 ? 'active' : ''}`}>
                            <div className="timeline-node"><i className="fas fa-cogs"></i></div>
                            <div className="timeline-label">Processing / Filing</div>
                          </div>
                          <div className={`timeline-connector ${step4 ? 'active' : ''}`}></div>

                          <div className={`timeline-step ${step4 ? 'active' : ''}`}>
                            <div className="timeline-node"><i className="fas fa-check-circle"></i></div>
                            <div className="timeline-label">Filing Completed</div>
                          </div>
                        </div>

                        {/* Advisor-Client Discussion Thread */}
                        <div className="inquiry-discussion-thread">
                          <h5><i className="fas fa-comments"></i> CA-Client Discussion Thread</h5>
                          <div className="discussion-comments-list">
                            {(inq.comments || []).map((comm, idx) => (
                              <div key={idx} className={`discussion-comment-item ${comm.senderRole}`}>
                                <div className="comment-meta">
                                  <strong>{comm.senderName}</strong>
                                  <span>{new Date(comm.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="comment-text">{comm.text}</p>
                              </div>
                            ))}
                            {(inq.comments || []).length === 0 && (
                              <p className="no-comments-prompt">No messages posted. Discuss document corrections or file requirements with your advisor below.</p>
                            )}
                          </div>
                          <div className="discussion-comment-input-box">
                            <input 
                              type="text" 
                              value={newCommentText[inq._id] || ''} 
                              onChange={(e) => {
                                const val = e.target.value;
                                setNewCommentText(prev => ({ ...prev, [inq._id]: val }));
                              }} 
                              placeholder="Type message for your Chartered Accountant..." 
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handlePostComment(inq._id);
                              }}
                            />
                            <button className="comment-send-btn" onClick={() => handlePostComment(inq._id)}>
                              <i className="fas fa-paper-plane"></i>
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
            /* TAB: DOCUMENT VAULT */
            <div className="portal-section-pane">
              <div className="pane-header-group">
                <h3>Secure Document Vault</h3>
                <p>Manage tax receipts, business invoices, and filing documents uploaded to our advisors.</p>
              </div>

              {documents.length === 0 ? (
                <div className="portal-empty-state"><i className="fas fa-folder-open"></i><p>Your vault is empty. Upload tax files to begin secure advisory audits.</p></div>
              ) : (
                <div className="vault-table-wrapper">
                  <table className="vault-table">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Target Service</th>
                        <th>Date Uploaded</th>
                        <th>File Size</th>
                        <th>Advisor Note</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => {
                        const fileInfo = getFileIcon(doc.originalName);
                        return (
                          <tr key={doc._id}>
                            <td>
                              <div className="vault-filename-cell">
                                <span className={`file-badge-icon ${fileInfo.class}`}><i className={`fas ${fileInfo.icon}`}></i></span>
                                <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portal/documents/download/${doc._id}?token=${localStorage.getItem('authToken')}`} target="_blank" rel="noreferrer" className="filename-text-link" title={doc.originalName}>
                                  {doc.originalName}
                                </a>
                              </div>
                            </td>
                            <td><span className="vault-service-slug">{doc.serviceSlug || 'General'}</span></td>
                            <td><span className="vault-date-cell">{new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></td>
                            <td><span className="vault-size-cell">{(doc.fileSize / 1024).toFixed(1)} KB</span></td>
                            <td>
                              {doc.adminNote ? (
                                <span className="vault-note-tooltip" title={doc.adminNote}>
                                  <i className="fas fa-comment-dots"></i> View Note
                                </span>
                              ) : (
                                <span className="no-note-cell">-</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="vault-action-group-cell">
                                <button className="vault-edit-action-btn" onClick={() => handleOpenEdit(doc)} title="Edit Document Details">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="vault-delete-action-btn" onClick={() => handleOpenDelete(doc)} title="Delete Document">
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : tab === 'upload' ? (
            /* TAB: UPLOAD FILE */
            <div className="portal-section-pane">
              <div className="pane-header-group">
                <h3>Secure Document Upload</h3>
                <p>Select tax declarations, invoices, or salary Slips to share with our advisory team.</p>
              </div>

              <div className="portal-drag-drop-zone">
                <div className="drag-drop-icon"><i className="fas fa-cloud-upload-alt"></i></div>
                <h4>Select File to Upload</h4>
                <p>Supports PDF, JPEG, PNG, DOCX up to 10MB</p>
                
                <input type="file" id="portal-drag-file-input" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" onChange={handleFileChange} />
                <label htmlFor="portal-drag-file-input" className="file-input-selector-btn">
                  <i className="fas fa-file-signature"></i> {uploadFile ? uploadFile.name : 'Choose Target File'}
                </label>

                <div className="upload-service-slug-input">
                  <label><i className="fas fa-cog"></i> Associated Service (Optional)</label>
                  <input type="text" value={serviceSlug} onChange={(e) => setServiceSlug(e.target.value)} placeholder="e.g. gst-registration or bookkeeping" />
                </div>

                <button className="portal-submit-upload-btn" disabled={!uploadFile || uploadLoading} onClick={handleUpload}>
                  {uploadLoading ? <><i className="fas fa-spinner fa-spin"></i> Processing Secure Upload...</> : <><i className="fas fa-check-double"></i> Upload Secure Document</>}
                </button>
              </div>
            </div>
          ) : tab === 'bookings' ? (
            /* TAB: BOOK CONSULTATIONS */
            <div className="portal-section-pane">
              <div className="pane-header-group">
                <h3>Consultation & Meetings Scheduler</h3>
                <p>Book live advisory sessions with our Chartered Accountants and track your scheduled slots.</p>
              </div>
              
              <div className="bookings-split-view">
                <div className="booking-form-card">
                  <h4>Schedule Advisory Meeting</h4>
                  <form onSubmit={handleBookConsultation} className="booking-actual-form">
                    <div className="form-field">
                      <label>Select Service Field</label>
                      <select 
                        value={bookingForm.serviceType} 
                        onChange={(e) => setBookingForm(prev => ({ ...prev, serviceType: e.target.value }))}
                      >
                        <option value="GST Filing">GST Registration & Filing</option>
                        <option value="Income Tax Return">Income Tax Audits (ITR)</option>
                        <option value="Business Startup Advisory">Startup Registration</option>
                        <option value="Bookkeeping Consultancy">Bookkeeping & Accounting</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Desired Date</label>
                      <input 
                        type="date" 
                        value={bookingForm.date} 
                        onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                        required 
                      />
                    </div>
                    <div className="form-field">
                      <label>Preferred Time Slot</label>
                      <select 
                        value={bookingForm.timeSlot} 
                        onChange={(e) => setBookingForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                      >
                        <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                        <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                        <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                        <option value="03:30 PM - 04:30 PM">03:30 PM - 04:30 PM</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Reason / Notes</label>
                      <textarea 
                        value={bookingForm.notes} 
                        onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))} 
                        placeholder="Briefly describe your tax questions..." 
                        rows="3"
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="booking-submit-btn" disabled={bookingLoading}>
                      {bookingLoading ? <><i className="fas fa-spinner fa-spin"></i> Booking...</> : <><i className="fas fa-calendar-check"></i> Request Slot</>}
                    </button>
                  </form>
                </div>

                <div className="bookings-history-card">
                  <h4>My Appointments</h4>
                  {consultations.length === 0 ? (
                    <div className="empty-bookings-notice"><i className="far fa-calendar"></i><p>No booked consultations found.</p></div>
                  ) : (
                    <div className="bookings-timeline-list">
                      {consultations.map(booking => (
                        <div key={booking._id} className="booking-item-card">
                          <div className="booking-item-header">
                            <span className="booking-service-tag">{booking.serviceType}</span>
                            <span className={`status-badge-capsule ${booking.status}`}>{booking.status}</span>
                          </div>
                          <p className="booking-item-notes">"{booking.notes}"</p>
                          <div className="booking-item-meta">
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
          ) : (
            /* TAB: BILLING & INVOICES */
            <div className="portal-section-pane">
              <div className="pane-header-group">
                <h3>Secure Billing & Invoice Vault</h3>
                <p>Review advisor fee invoices and log mock payments to clear your accounting balance.</p>
              </div>

              {invoices.length === 0 ? (
                <div className="portal-empty-state"><i className="fas fa-file-invoice-dollar"></i><p>No billing invoices generated yet. Invoices appear here once tax filing fees are compiled.</p></div>
              ) : (
                <div className="vault-table-wrapper">
                  <table className="vault-table">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th>Service Name</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(inv => (
                        <tr key={inv._id}>
                          <td><span className="monospace-code">{inv.invoiceNumber}</span></td>
                          <td><strong>{inv.serviceName}</strong></td>
                          <td>₹{inv.amount}</td>
                          <td><span className="vault-date-cell">{new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></td>
                          <td><span className={`status-badge-capsule ${inv.status}`}>{inv.status}</span></td>
                          <td style={{ textAlign: 'right' }}>
                            {inv.status === 'unpaid' ? (
                              <button 
                                className="invoice-pay-btn" 
                                onClick={() => handlePayInvoice(inv._id)}
                                disabled={paymentProcessing}
                              >
                                {paymentProcessing && processingInvoiceId === inv._id ? (
                                  <><i className="fas fa-spinner fa-spin"></i> Secure Connecting...</>
                                ) : (
                                  <><i className="fas fa-credit-card"></i> Pay Invoice</>
                                )}
                              </button>
                            ) : (
                              <span className="invoice-paid-tag"><i className="fas fa-check-circle"></i> Paid</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* CUSTOM EDIT/UPDATE MODAL DIALOG */}
      {editingDoc && (
        <div className="portal-modal-overlay">
          <div className="portal-modal-card">
            <div className="modal-card-header">
              <h3><i className="fas fa-edit"></i> Edit Document Details</h3>
              <button className="modal-close-btn" onClick={() => setEditingDoc(null)}>&times;</button>
            </div>
            <div className="modal-card-body">
              <div className="form-field">
                <label>Document Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter new filename"
                />
              </div>
              <div className="form-field">
                <label>Related Service</label>
                <input
                  type="text"
                  value={editService}
                  onChange={(e) => setEditService(e.target.value)}
                  placeholder="e.g. gst-registration"
                />
              </div>
              <div className="form-field file-replace-field">
                <label><i className="fas fa-sync-alt"></i> Replace File (optional)</label>
                <input
                  type="file"
                  id="edit-file-replace"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => setEditFile(e.target.files[0])}
                />
                <label htmlFor="edit-file-replace" className="file-replace-label">
                  <i className="fas fa-paperclip"></i> {editFile ? editFile.name : 'Choose Replacement File'}
                </label>
              </div>
            </div>
            <div className="modal-card-footer">
              <button className="portal-cancel-btn" onClick={() => setEditingDoc(null)}>Cancel</button>
              <button className="portal-save-btn" disabled={editLoading} onClick={handleSaveEdit}>
                {editLoading ? <><i className="fas fa-spinner fa-spin"></i> Saving Updates...</> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM WARNING DELETE CONFIRMATION DIALOG */}
      {deletingDoc && (
        <div className="portal-modal-overlay">
          <div className="portal-modal-card delete-warning">
            <div className="modal-card-header">
              <h3><i className="fas fa-exclamation-triangle"></i> Delete Document?</h3>
              <button className="modal-close-btn" onClick={() => setDeletingDoc(null)}>&times;</button>
            </div>
            <div className="modal-card-body">
              <p>Are you sure you want to permanently delete <strong>{deletingDoc.originalName}</strong>?</p>
              <span>This action cannot be undone and the document will be permanently removed from our secure audit vaults.</span>
            </div>
            <div className="modal-card-footer">
              <button className="portal-cancel-btn" onClick={() => setDeletingDoc(null)}>Cancel</button>
              <button className="portal-confirm-delete-btn" disabled={deleteLoading} onClick={handleConfirmDelete}>
                {deleteLoading ? <><i className="fas fa-spinner fa-spin"></i> Deleting...</> : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portal;
