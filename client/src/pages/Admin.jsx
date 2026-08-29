import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats,
  getAdminInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getAdminDocuments,
  updateDocumentStatus,
  deleteAdminDocument,
  getAdminUsers,
  updateUserRole,
  deleteUser,
  getAdminServices,
  createService,
  updateService,
  deleteService,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getAdminPricing,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  getAdminSettings,
  updateAdminSettings,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogs,
  getAdminNavMenu,
  createNavMenuItem,
  updateNavMenuItem,
  deleteNavMenuItem,
  getAdminFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
  getAdminTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getAdminConsultations,
  updateConsultation,
  getAdminInvoices,
  createInvoice,
  deleteInvoice,
  postAdminComment,
  downloadAdminDocument
} from '../api';
import useSEO from '../hooks/useSEO';
import './Admin.css';

const Admin = () => {
  useSEO({ title: 'Admin Control Center | Shree Chamunda Associates', description: 'Enterprise management command center for Shree Chamunda Associates' });
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  
  // Navigation
  const [tab, setTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem('adminSidebarCollapsed') === 'true');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.removeItem('adminTab');
  }, []);

  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Loading/Messages
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Data States
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [settings, setSettings] = useState(null);
  const [navMenus, setNavMenus] = useState([]);
  const [siteFeatures, setSiteFeatures] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Invoicing & Comment states
  const [newCommentText, setNewCommentText] = useState({});
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ client: '', amount: '', serviceName: 'GST Registration & Filing', description: '', dueDate: '' });
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  // Search, Filter, Pagination States
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [servicePage, setServicePage] = useState(1);

  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('all');
  const [faqPage, setFaqPage] = useState(1);

  const [blogSearch, setBlogSearch] = useState('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('all');
  const [blogPage, setBlogPage] = useState(1);

  const [inqSearch, setInqSearch] = useState('');
  const [inqStatusFilter, setInqStatusFilter] = useState('all');
  const [inqPage, setInqPage] = useState(1);

  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userPage, setUserPage] = useState(1);
  
  const [teamSearch, setTeamSearch] = useState('');
  const [teamPage, setTeamPage] = useState(1);

  const itemsPerPage = 8;

  // Edit/Modal States
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState('');
  const [documentNote, setDocumentNote] = useState({});

  // Custom Delete Confirm Modal States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState(null);
  const [deleteItemTitle, setDeleteItemTitle] = useState('');

  const confirmDelete = (title, onConfirm) => {
    setDeleteItemTitle(title);
    setDeleteAction(() => onConfirm);
    setDeleteConfirmOpen(true);
  };

  // Forms
  const [serviceForm, setServiceForm] = useState({
    title: '', description: '', icon: 'fas fa-file-invoice-dollar', slug: '', order: 0, isActive: true,
    detailedOverview: '', timeline: '3-5 working days', serviceType: 'general',
    governmentFee: 0, professionalFee: 0, deliverables: '', documentsRequired: '',
    eligibility: '', keyBenefits: ''
  });

  const [faqForm, setFaqForm] = useState({
    question: '', answer: '', category: 'General', order: 0, isActive: true
  });

  const [pricingForm, setPricingForm] = useState({
    name: '', price: 0, period: 'month', features: '', isPopular: false, order: 0, isActive: true
  });

  const [blogForm, setBlogForm] = useState({
    title: '', slug: '', category: 'General', excerpt: '', content: '', bannerImage: '', author: 'Admin'
  });

  const [settingsForm, setSettingsForm] = useState({
    heroTitle: '', heroSubtitle: '', heroDescription: '', phone: '', email: '', address: '',
    workingHours: '', companyDescription: '', trustMainText: '', trustDescription: '',
    trustDescription2: '', socialLinks: { whatsapp: '', instagram: '', facebook: '' }
  });

  const [navForm, setNavForm] = useState({
    label: '', href: '#', order: 0, children: []
  });

  const [featureForm, setFeatureForm] = useState({
    title: '', description: '', icon: 'fas fa-star', order: 0, isActive: true
  });

  const [teamForm, setTeamForm] = useState({
    name: '', role: '', specialty: '', img: '/assets/shreeChamundalogo.png', order: 0, isActive: true
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, inqRes, docRes, userRes, srvRes, faqRes, prcRes, blogRes, setRes, navRes, featRes, teamRes, consRes, invRes] = await Promise.all([
        getAdminStats(),
        getAdminInquiries(),
        getAdminDocuments(),
        getAdminUsers(),
        getAdminServices(),
        getAdminFAQs(),
        getAdminPricing(),
        getBlogs(),
        getAdminSettings(),
        getAdminNavMenu(),
        getAdminFeatures(),
        getAdminTeamMembers(),
        getAdminConsultations(),
        getAdminInvoices()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (inqRes.success) setInquiries(inqRes.data);
      if (docRes.success) setDocuments(docRes.data);
      if (userRes.success) setUsers(userRes.data);
      if (srvRes.success) setServices(srvRes.data);
      if (faqRes.success) setFaqs(faqRes.data);
      if (prcRes.success) setPricing(prcRes.data);
      if (blogRes.success) setBlogs(blogRes.data || []);
      if (navRes.success) setNavMenus(navRes.data || []);
      if (featRes.success) setSiteFeatures(featRes.data || []);
      if (teamRes.success) setTeamMembers(teamRes.data || []);
      if (consRes.success) setConsultations(consRes.data || []);
      if (invRes.success) setInvoices(invRes.data || []);
      if (setRes.success) {
        setSettings(setRes.data);
        setSettingsForm({
          ...setRes.data,
          socialLinks: {
            whatsapp: setRes.data.socialLinks?.whatsapp || '',
            instagram: setRes.data.socialLinks?.instagram || '',
            facebook: setRes.data.socialLinks?.facebook || ''
          }
        });
      }
    } catch {
      showToast('error', 'Failed to load panel records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user, loadData]);

  // INQUIRIES
  const handleInquiryStatus = async (id, status) => {
    try {
      const res = await updateInquiryStatus(id, status);
      if (res.success) {
        setInquiries(prev => prev.map(item => item._id === id ? { ...item, status } : item));
        showToast('success', 'Inquiry updated');
      }
    } catch {
      showToast('error', 'Status update failed');
    }
  };

  const handleInquiryDelete = (id) => {
    confirmDelete('this client contact inquiry', async () => {
      try {
        const res = await deleteInquiry(id);
        if (res.success) {
          setInquiries(prev => prev.filter(item => item._id !== id));
          showToast('success', 'Inquiry deleted');
        }
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  const handleUpdateConsultationStatus = async (id, status) => {
    try {
      const res = await updateConsultation(id, { status });
      if (res.success) {
        setConsultations(prev => prev.map(c => c._id === id ? res.data : c));
        showToast('success', `Appointment marked ${status}`);
      }
    } catch {
      showToast('error', 'Failed to update consultation');
    }
  };

  const handleCreateInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceForm.client || !invoiceForm.amount || !invoiceForm.dueDate) {
      showToast('error', 'Please fill in client, amount and due date.');
      return;
    }
    setInvoiceLoading(true);
    try {
      const res = await createInvoice(invoiceForm);
      if (res.success) {
        setInvoices(prev => [res.data, ...prev]);
        showToast('success', `Invoice ${res.data.invoiceNumber} created!`);
        setInvoiceModalOpen(false);
        setInvoiceForm({ client: '', amount: '', serviceName: 'GST Registration & Filing', description: '', dueDate: '' });
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Invoice generation failed');
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleDeleteInvoice = (id, invoiceNumber) => {
    confirmDelete(`Invoice #${invoiceNumber}`, async () => {
      try {
        const res = await deleteInvoice(id);
        if (res.success) {
          setInvoices(prev => prev.filter(inv => inv._id !== id));
          showToast('success', 'Invoice deleted');
        }
      } catch {
        showToast('error', 'Failed to delete invoice');
      }
    });
  };

  const handlePostAdminComment = async (inquiryId) => {
    const text = newCommentText[inquiryId];
    if (!text || !text.trim()) return;

    try {
      const res = await postAdminComment(inquiryId, text.trim());
      if (res.success) {
        setNewCommentText(prev => ({ ...prev, [inquiryId]: '' }));
        setInquiries(prev => prev.map(inq => inq._id === inquiryId ? res.data : inq));
        showToast('success', 'CA reply sent to client');
      }
    } catch {
      showToast('error', 'Failed to post reply');
    }
  };

  // DOCUMENTS
  const handleDocStatus = async (id, status) => {
    const adminNote = documentNote[id] || '';
    try {
      const res = await updateDocumentStatus(id, { status, adminNote });
      if (res.success) {
        setDocuments(prev => prev.map(item => item._id === id ? { ...item, status, adminNote } : item));
        showToast('success', 'Document status updated');
      }
    } catch {
      showToast('error', 'Document update failed');
    }
  };

  const handleDocDelete = (id) => {
    confirmDelete('this document file record', async () => {
      try {
        const res = await deleteAdminDocument(id);
        if (res.success) {
          setDocuments(prev => prev.filter(item => item._id !== id));
          showToast('success', 'Document deleted');
        }
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  // USERS
  const handleRoleChange = async (id, role) => {
    try {
      const res = await updateUserRole(id, role);
      if (res.success) {
        setUsers(prev => prev.map(item => item._id === id ? { ...item, role } : item));
        showToast('success', 'User role updated');
      }
    } catch {
      showToast('error', 'Role change failed');
    }
  };

  const handleUserDelete = (id) => {
    confirmDelete('this client account (this blocks their portal access)', async () => {
      try {
        const res = await deleteUser(id);
        if (res.success) {
          setUsers(prev => prev.filter(item => item._id !== id));
          showToast('success', 'User account deleted');
        }
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  // SERVICES CRUD
  const handleOpenServiceModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setServiceForm({
        title: item.title,
        description: item.description,
        icon: item.icon,
        slug: item.slug,
        order: item.order,
        isActive: item.isActive,
        detailedOverview: item.detailedOverview || '',
        timeline: item.timeline || '3-5 working days',
        serviceType: item.serviceType || 'general',
        governmentFee: item.governmentFee || 0,
        professionalFee: item.professionalFee || 0,
        deliverables: item.deliverables?.join('\n') || '',
        documentsRequired: item.documentsRequired?.join('\n') || '',
        eligibility: item.eligibility?.join('\n') || '',
        keyBenefits: item.keyBenefits?.join('\n') || ''
      });
    } else {
      setEditingItem(null);
      setServiceForm({
        title: '', description: '', icon: 'fas fa-file-invoice-dollar', slug: '', order: 0, isActive: true,
        detailedOverview: '', timeline: '3-5 working days', serviceType: 'general',
        governmentFee: 0, professionalFee: 0, deliverables: '', documentsRequired: '',
        eligibility: '', keyBenefits: ''
      });
    }
    setModalType('service');
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const payload = {
      ...serviceForm,
      deliverables: serviceForm.deliverables.split('\n').map(x => x.trim()).filter(Boolean),
      documentsRequired: serviceForm.documentsRequired.split('\n').map(x => x.trim()).filter(Boolean),
      eligibility: serviceForm.eligibility.split('\n').map(x => x.trim()).filter(Boolean),
      keyBenefits: serviceForm.keyBenefits.split('\n').map(x => x.trim()).filter(Boolean)
    };
    try {
      if (editingItem) {
        const res = await updateService(editingItem._id, payload);
        if (res.success) {
          setServices(prev => prev.map(item => item._id === editingItem._id ? res.data : item));
          showToast('success', 'Service updated successfully');
        }
      } else {
        const res = await createService(payload);
        if (res.success) {
          setServices(prev => [...prev, res.data]);
          showToast('success', 'Service created successfully');
        }
      }
      setModalType('');
    } catch {
      showToast('error', 'Service operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleServiceDelete = (id) => {
    confirmDelete('this service entry', async () => {
      try {
        const res = await deleteService(id);
        if (res.success) {
          setServices(prev => prev.filter(item => item._id !== id));
          showToast('success', 'Service deleted');
        }
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  // FAQS CRUD
  const handleOpenFAQModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFaqForm({ question: item.question, answer: item.answer, category: item.category, order: item.order, isActive: item.isActive });
    } else {
      setEditingItem(null);
      setFaqForm({ question: '', answer: '', category: 'General', order: 0, isActive: true });
    }
    setModalType('faq');
  };

  const handleFAQSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        const res = await updateFAQ(editingItem._id, faqForm);
        if (res.success) {
          setFaqs(prev => prev.map(item => item._id === editingItem._id ? res.data : item));
          showToast('success', 'FAQ updated');
        }
      } else {
        const res = await createFAQ(faqForm);
        if (res.success) {
          setFaqs(prev => [...prev, res.data]);
          showToast('success', 'FAQ created');
        }
      }
      setModalType('');
    } catch {
      showToast('error', 'FAQ operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFAQDelete = (id) => {
    confirmDelete('this FAQ question', async () => {
      try {
        const res = await deleteFAQ(id);
        if (res.success) {
          setFaqs(prev => prev.filter(item => item._id !== id));
          showToast('success', 'FAQ deleted');
        }
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  // PRICING CRUD
  const handleOpenPricingModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setPricingForm({
        name: item.name, price: item.price, period: item.period,
        features: item.features?.join('\n') || '', isPopular: item.isPopular,
        order: item.order, isActive: item.isActive
      });
    } else {
      setEditingItem(null);
      setPricingForm({ name: '', price: 0, period: 'month', features: '', isPopular: false, order: 0, isActive: true });
    }
    setModalType('pricing');
  };

  const handlePricingSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const payload = {
      ...pricingForm,
      features: pricingForm.features.split('\n').map(x => x.trim()).filter(Boolean)
    };
    try {
      if (editingItem) {
        const res = await updatePricingPlan(editingItem._id, payload);
        if (res.success) {
          setPricing(prev => prev.map(item => item._id === editingItem._id ? res.data : item));
          showToast('success', 'Pricing tier updated');
        }
      } else {
        const res = await createPricingPlan(payload);
        if (res.success) {
          setPricing(prev => [...prev, res.data]);
          showToast('success', 'Pricing tier created');
        }
      }
      setModalType('');
    } catch {
      showToast('error', 'Pricing operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePricingDelete = (id) => {
    confirmDelete('this pricing tier plan', async () => {
      try {
        const res = await deletePricingPlan(id);
        if (res.success) {
          setPricing(prev => prev.filter(item => item._id !== id));
          showToast('success', 'Pricing tier deleted');
        }
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  // BLOGS CRUD
  const handleOpenBlogModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setBlogForm({
        title: item.title, slug: item.slug, category: item.category, excerpt: item.excerpt,
        content: item.content, bannerImage: item.bannerImage || '', author: item.author || 'Admin'
      });
    } else {
      setEditingItem(null);
      setBlogForm({ title: '', slug: '', category: 'General', excerpt: '', content: '', bannerImage: '', author: 'Admin' });
    }
    setModalType('blog');
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        const res = await updateBlogPost(editingItem._id, blogForm);
        if (res.success) {
          setBlogs(prev => prev.map(item => item._id === editingItem._id ? res.data : item));
          showToast('success', 'Article updated');
        }
      } else {
        const res = await createBlogPost(blogForm);
        if (res.success) {
          setBlogs(prev => [...prev, res.data]);
          showToast('success', 'Article published');
        }
      }
      setModalType('');
    } catch {
      showToast('error', 'Blog operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlogDelete = (id) => {
    confirmDelete('this published blog article', async () => {
      try {
        const res = await deleteBlogPost(id);
        if (res.success) {
          setBlogs(prev => prev.filter(item => item._id !== id));
          showToast('success', 'Article deleted');
        }
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  // NAV MENU CRUD
  const handleOpenNavModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setNavForm({
        label: item.label, href: item.href, order: item.order,
        children: item.children ? JSON.stringify(item.children, null, 2) : '[]'
      });
    } else {
      setEditingItem(null);
      setNavForm({ label: '', href: '#', order: 0, children: '[]' });
    }
    setModalType('navmenu');
  };

  const handleNavSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    let parsedChildren = [];
    try {
      parsedChildren = JSON.parse(navForm.children || '[]');
    } catch {
      showToast('error', 'Submenu JSON syntax is invalid');
      setActionLoading(false);
      return;
    }
    const payload = { ...navForm, children: parsedChildren };
    try {
      if (editingItem) {
        const res = await updateNavMenuItem(editingItem._id, payload);
        if (res.success) {
          setNavMenus(prev => prev.map(item => item._id === editingItem._id ? res.data : item));
          showToast('success', 'Navigation item updated');
        }
      } else {
        const res = await createNavMenuItem(payload);
        if (res.success) {
          setNavMenus(prev => [...prev, res.data]);
          showToast('success', 'Navigation item created');
        }
      }
      setModalType('');
    } catch {
      showToast('error', 'Navigation operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleNavDelete = (id) => {
    confirmDelete('this navigation menu item', async () => {
      try {
        await deleteNavMenuItem(id);
        setNavMenus(prev => prev.filter(item => item._id !== id));
        showToast('success', 'Navigation item deleted');
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  // FEATURES CRUD
  const handleOpenFeatureModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFeatureForm({ title: item.title, description: item.description, icon: item.icon, order: item.order, isActive: item.isActive });
    } else {
      setEditingItem(null);
      setFeatureForm({ title: '', description: '', icon: 'fas fa-star', order: 0, isActive: true });
    }
    setModalType('feature');
  };

  const handleFeatureSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        const res = await updateFeature(editingItem._id, featureForm);
        if (res.success) {
          setSiteFeatures(prev => prev.map(item => item._id === editingItem._id ? res.data : item));
          showToast('success', 'Feature updated');
        }
      } else {
        const res = await createFeature(featureForm);
        if (res.success) {
          setSiteFeatures(prev => [...prev, res.data]);
          showToast('success', 'Feature created');
        }
      }
      setModalType('');
    } catch {
      showToast('error', 'Feature operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeatureDelete = (id) => {
    confirmDelete('this feature highlight', async () => {
      try {
        await deleteFeature(id);
        setSiteFeatures(prev => prev.filter(item => item._id !== id));
        showToast('success', 'Feature deleted');
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  // TEAM MEMBERS CRUD
  const handleOpenTeamModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setTeamForm({
        name: item.name || '',
        role: item.role || '',
        specialty: item.specialty || '',
        img: item.img || '/assets/shreeChamundalogo.png',
        order: item.order || 0,
        isActive: item.isActive !== undefined ? item.isActive : true
      });
    } else {
      setEditingItem(null);
      setTeamForm({
        name: '', role: '', specialty: '', img: '/assets/shreeChamundalogo.png', order: 0, isActive: true
      });
    }
    setModalType('team');
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        const res = await updateTeamMember(editingItem._id, teamForm);
        if (res.success) {
          setTeamMembers(prev => prev.map(item => item._id === editingItem._id ? res.data : item));
          showToast('success', 'Team member updated');
        }
      } else {
        const res = await createTeamMember(teamForm);
        if (res.success) {
          setTeamMembers(prev => [...prev, res.data]);
          showToast('success', 'Team member created');
        }
      }
      setModalType('');
    } catch {
      showToast('error', 'Team member update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTeamDelete = (id) => {
    confirmDelete('this team member profile', async () => {
      try {
        await deleteTeamMember(id);
        setTeamMembers(prev => prev.filter(item => item._id !== id));
        showToast('success', 'Team member deleted');
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  // SETTINGS
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await updateAdminSettings(settingsForm);
      if (res.success) {
        setSettings(res.data);
        showToast('success', 'Global settings updated successfully');
      }
    } catch {
      showToast('error', 'Settings update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const renderAnalyticsChart = () => {
    const days = [];
    const counts = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateLabel = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const key = d.toISOString().split('T')[0];
      const count = inquiries.filter(inq => {
        const inqDate = new Date(inq.createdAt).toISOString().split('T')[0];
        return inqDate === key;
      }).length;
      days.push(dateLabel);
      counts.push(count);
    }

    const maxVal = Math.max(...counts, 4);
    const height = 180;
    const width = 500;
    const padding = 28;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = counts.map((c, i) => {
      const x = padding + (i * (chartWidth / 6));
      const y = height - padding - (c / maxVal) * chartHeight;
      return { x, y, count: c, day: days[i] };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = points.length ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` : '';

    return (
      <div className="admin-bento-card chart-bento-card">
        <div className="bento-card-header">
          <div className="bento-header-left">
            <div className="bento-header-icon"><i className="fas fa-chart-line"></i></div>
            <div className="bento-header-title">
              <span className="bento-kicker">REAL-TIME TELEMETRY</span>
              <h3>Client Inquiries Traffic Trend</h3>
            </div>
          </div>
        </div>
        <div className="bento-card-body">
          <div className="chart-svg-wrapper">
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f8b400" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#f8b400" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.33, 0.66, 1].map((ratio, index) => {
                const y = padding + ratio * chartHeight;
                const labelVal = Math.round(maxVal * (1 - ratio));
                return (
                  <g key={index}>
                    <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                    <text x={padding - 6} y={y + 4} fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="600">{labelVal}</text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}

              {/* Main Trend Line */}
              {linePath && <path d={linePath} fill="none" stroke="#f8b400" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

              {/* Data points */}
              {points.map((p, i) => (
                <g key={i} className="chart-point-group">
                  <circle cx={p.x} cy={p.y} r="5" fill="#071324" stroke="#f8b400" strokeWidth="2.5" />
                  <text x={p.x} y={height - 6} fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="600">{p.day}</text>
                  <text x={p.x} y={p.y - 10} fill="#071324" fontSize="11" textAnchor="middle" fontWeight="800">{p.count}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    );
  };

  // Filter and pagination computations
  const filteredInqs = inquiries.filter(i => {
    const matchSearch = (i.name || '').toLowerCase().includes(inqSearch.toLowerCase()) ||
                        (i.email || '').toLowerCase().includes(inqSearch.toLowerCase()) ||
                        (i.service || '').toLowerCase().includes(inqSearch.toLowerCase()) ||
                        (i.message || '').toLowerCase().includes(inqSearch.toLowerCase());
    const matchStatus = inqStatusFilter === 'all' || i.status === inqStatusFilter;
    return matchSearch && matchStatus;
  });
  const paginatedInquiries = filteredInqs.slice((inqPage - 1) * itemsPerPage, inqPage * itemsPerPage);
  const totalInqPages = Math.ceil(filteredInqs.length / itemsPerPage) || 1;

  const filteredServices = services.filter(s => {
    const matchSearch = (s.title || '').toLowerCase().includes(serviceSearch.toLowerCase()) ||
                        (s.description || '').toLowerCase().includes(serviceSearch.toLowerCase());
    const matchType = serviceTypeFilter === 'all' || s.serviceType === serviceTypeFilter;
    return matchSearch && matchType;
  });
  const paginatedServices = filteredServices.slice((servicePage - 1) * itemsPerPage, servicePage * itemsPerPage);
  const totalServicePages = Math.ceil(filteredServices.length / itemsPerPage) || 1;

  const filteredFaqs = faqs.filter(f => {
    const matchSearch = (f.question || '').toLowerCase().includes(faqSearch.toLowerCase()) ||
                        (f.answer || '').toLowerCase().includes(faqSearch.toLowerCase());
    const matchCat = faqCategoryFilter === 'all' || f.category === faqCategoryFilter;
    return matchSearch && matchCat;
  });
  const paginatedFaqs = filteredFaqs.slice((faqPage - 1) * itemsPerPage, faqPage * itemsPerPage);
  const totalFaqPages = Math.ceil(filteredFaqs.length / itemsPerPage) || 1;

  const filteredBlogs = blogs.filter(b => {
    const matchSearch = (b.title || '').toLowerCase().includes(blogSearch.toLowerCase()) ||
                        (b.excerpt || '').toLowerCase().includes(blogSearch.toLowerCase());
    const matchCat = blogCategoryFilter === 'all' || b.category === blogCategoryFilter;
    return matchSearch && matchCat;
  });
  const paginatedBlogs = filteredBlogs.slice((blogPage - 1) * itemsPerPage, blogPage * itemsPerPage);
  const totalBlogPages = Math.ceil(filteredBlogs.length / itemsPerPage) || 1;

  const filteredUsers = users.filter(u => {
    const matchSearch = (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                        (u.email || '').toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchSearch && matchRole;
  });
  const paginatedUsers = filteredUsers.slice((userPage - 1) * itemsPerPage, userPage * itemsPerPage);
  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  const filteredTeam = teamMembers.filter(item => {
    return (item.name || '').toLowerCase().includes(teamSearch.toLowerCase()) ||
           (item.role || '').toLowerCase().includes(teamSearch.toLowerCase()) ||
           (item.specialty || '').toLowerCase().includes(teamSearch.toLowerCase());
  });
  const paginatedTeam = filteredTeam.slice((teamPage - 1) * itemsPerPage, teamPage * itemsPerPage);
  const totalTeamPages = Math.ceil(filteredTeam.length / itemsPerPage) || 1;

  const pendingDocsCount = documents.filter(d => d.status === 'pending').length;
  const pendingConsCount = consultations.filter(c => c.status === 'pending').length;
  const unpaidInvoicesCount = invoices.filter(i => i.status === 'unpaid').length;

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner"></div>
        <p>Verifying ICAI administrative clearance...</p>
      </div>
    );
  }

  const getSectionTitle = () => {
    const titles = {
      dashboard: 'Dashboard Summary',
      inquiries: 'Client Inquiries',
      documents: 'Verification Vault',
      users: 'Clients Database',
      consultations: 'CA Consultations',
      invoices: 'Invoices & Billing',
      services: 'Services Directory',
      faqs: 'Knowledge Base (FAQ)',
      pricing: 'Pricing Retainers',
      blogs: 'Article Publisher',
      navmenu: 'Megamenu Builder',
      features: 'Why Choose Us Cards',
      team: 'Partners & Team',
      settings: 'Global Firm Config'
    };
    return titles[tab] || 'Admin Console';
  };

  return (
    <div className="admin-dashboard-container">
      {/* Mobile Drawer Backdrop */}
      {isMobileDrawerOpen && (
        <div className="admin-drawer-backdrop" onClick={() => setIsMobileDrawerOpen(false)}></div>
      )}

      {/* ========================================================
          SIDEBAR: Executive Midnight Admin Command Center
          ======================================================== */}
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileDrawerOpen ? 'mobile-open' : ''}`}>
        {/* Toggle Collapse Button */}
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          title={isSidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
        >
          <i className={`fas ${isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>

        {/* Sidebar Brand Header */}
        <div className="admin-sidebar-brand">
          <div className="admin-brand-crest">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="admin-brand-meta">
            <h3>SCA Audit Console</h3>
            <span className="admin-live-badge">
              <span className="live-pulse-dot"></span> Senior Auditor
            </span>
          </div>
          <button 
            type="button" 
            className="admin-sidebar-mobile-close" 
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-label="Close navigation"
          >
            &times;
          </button>
        </div>

        {/* Sidebar Categorized Menu */}
        <nav className="admin-sidebar-nav">
          {/* GROUP 1: CORE COMPLIANCE */}
          <div className="admin-nav-group-header">CORE COMPLIANCE</div>
          
          <button 
            className={`admin-nav-btn ${tab === 'dashboard' ? 'active' : ''}`} 
            onClick={() => { setTab('dashboard'); setIsMobileDrawerOpen(false); }}
            title="Executive Dashboard"
          >
            <div className="nav-icon-box"><i className="fas fa-chart-pie"></i></div>
            <span className="nav-label">Executive Overview</span>
          </button>

          <button 
            className={`admin-nav-btn ${tab === 'inquiries' ? 'active' : ''}`} 
            onClick={() => { setTab('inquiries'); setIsMobileDrawerOpen(false); }}
            title="Client Inquiries"
          >
            <div className="nav-icon-box"><i className="fas fa-inbox"></i></div>
            <span className="nav-label">Client Inquiries</span>
            {inquiries.length > 0 && <span className="nav-counter blue">{inquiries.length}</span>}
          </button>

          <button 
            className={`admin-nav-btn ${tab === 'documents' ? 'active' : ''}`} 
            onClick={() => { setTab('documents'); setIsMobileDrawerOpen(false); }}
            title="Document Vault"
          >
            <div className="nav-icon-box"><i className="fas fa-folder-open"></i></div>
            <span className="nav-label">Verification Vault</span>
            {pendingDocsCount > 0 && <span className="nav-counter amber">{pendingDocsCount}</span>}
          </button>

          <button 
            className={`admin-nav-btn ${tab === 'consultations' ? 'active' : ''}`} 
            onClick={() => { setTab('consultations'); setIsMobileDrawerOpen(false); }}
            title="Consultation Bookings"
          >
            <div className="nav-icon-box"><i className="fas fa-calendar-check"></i></div>
            <span className="nav-label">CA Consultations</span>
            {pendingConsCount > 0 && <span className="nav-counter green">{pendingConsCount}</span>}
          </button>

          <button 
            className={`admin-nav-btn ${tab === 'invoices' ? 'active' : ''}`} 
            onClick={() => { setTab('invoices'); setIsMobileDrawerOpen(false); }}
            title="Invoices & Settlements"
          >
            <div className="nav-icon-box"><i className="fas fa-file-invoice-dollar"></i></div>
            <span className="nav-label">Invoices &amp; Billing</span>
            {unpaidInvoicesCount > 0 && <span className="nav-counter red">{unpaidInvoicesCount}</span>}
          </button>

          <button 
            className={`admin-nav-btn ${tab === 'users' ? 'active' : ''}`} 
            onClick={() => { setTab('users'); setIsMobileDrawerOpen(false); }}
            title="Users Directory"
          >
            <div className="nav-icon-box"><i className="fas fa-users"></i></div>
            <span className="nav-label">Clients Database</span>
            {users.length > 0 && <span className="nav-counter slate">{users.length}</span>}
          </button>

          {/* GROUP 2: CONTENT & CMS */}
          <div className="admin-nav-group-header">CONTENT &amp; CMS</div>

          <button 
            className={`admin-nav-btn ${tab === 'services' ? 'active' : ''}`} 
            onClick={() => { setTab('services'); setIsMobileDrawerOpen(false); }}
            title="Services Directory"
          >
            <div className="nav-icon-box"><i className="fas fa-briefcase"></i></div>
            <span className="nav-label">Services Directory</span>
          </button>

          <button 
            className={`admin-nav-btn ${tab === 'blogs' ? 'active' : ''}`} 
            onClick={() => { setTab('blogs'); setIsMobileDrawerOpen(false); }}
            title="Article Publisher"
          >
            <div className="nav-icon-box"><i className="fas fa-newspaper"></i></div>
            <span className="nav-label">Article Publisher</span>
          </button>

          <button 
            className={`admin-nav-btn ${tab === 'pricing' ? 'active' : ''}`} 
            onClick={() => { setTab('pricing'); setIsMobileDrawerOpen(false); }}
            title="Pricing Plans"
          >
            <div className="nav-icon-box"><i className="fas fa-tags"></i></div>
            <span className="nav-label">Pricing Retainers</span>
          </button>

          <button 
            className={`admin-nav-btn ${tab === 'faqs' ? 'active' : ''}`} 
            onClick={() => { setTab('faqs'); setIsMobileDrawerOpen(false); }}
            title="FAQ Database"
          >
            <div className="nav-icon-box"><i className="fas fa-question-circle"></i></div>
            <span className="nav-label">Knowledge Base (FAQ)</span>
          </button>

          <button 
            className={`admin-nav-btn ${tab === 'team' ? 'active' : ''}`} 
            onClick={() => { setTab('team'); setIsMobileDrawerOpen(false); }}
            title="Team Members"
          >
            <div className="nav-icon-box"><i className="fas fa-user-tie"></i></div>
            <span className="nav-label">Partners &amp; Team</span>
          </button>

          <button 
            className={`admin-nav-btn ${tab === 'features' ? 'active' : ''}`} 
            onClick={() => { setTab('features'); setIsMobileDrawerOpen(false); }}
            title="Why Choose Us (Features)"
          >
            <div className="nav-icon-box"><i className="fas fa-shield-alt"></i></div>
            <span className="nav-label">Why Choose Us Cards</span>
          </button>

          <button 
            className={`admin-nav-btn ${tab === 'navmenu' ? 'active' : ''}`} 
            onClick={() => { setTab('navmenu'); setIsMobileDrawerOpen(false); }}
            title="Nav Menu Builder"
          >
            <div className="nav-icon-box"><i className="fas fa-bars"></i></div>
            <span className="nav-label">Megamenu Builder</span>
          </button>

          {/* GROUP 3: SYSTEM & CONFIG */}
          <div className="admin-nav-group-header">SYSTEM &amp; CONFIG</div>

          <button 
            className={`admin-nav-btn ${tab === 'settings' ? 'active' : ''}`} 
            onClick={() => { setTab('settings'); setIsMobileDrawerOpen(false); }}
            title="Global Settings"
          >
            <div className="nav-icon-box"><i className="fas fa-sliders-h"></i></div>
            <span className="nav-label">Global Firm Config</span>
          </button>
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="admin-sidebar-footer">
          <Link to="/" className="sidebar-live-site-btn" title="View Public Website">
            <i className="fas fa-external-link-alt"></i> <span>View Live Site</span>
          </Link>
          <button className="sidebar-admin-logout" onClick={() => logout().then(() => navigate('/'))}>
            <i className="fas fa-sign-out-alt"></i> <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          MAIN STAGE: Admin Command Console
          ======================================================== */}
      <main className="admin-main-panel">
        {/* Modern Top Header Bar */}
        <header className="admin-executive-topbar">
          <div className="admin-topbar-left">
            <button className="admin-mobile-toggle" onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)} aria-label="Toggle Navigation">
              <i className="fas fa-bars"></i>
            </button>
            <div className="admin-tab-icon-badge">
              {tab === 'dashboard' && <i className="fas fa-chart-pie"></i>}
              {tab === 'inquiries' && <i className="fas fa-inbox"></i>}
              {tab === 'documents' && <i className="fas fa-folder-open"></i>}
              {tab === 'consultations' && <i className="fas fa-calendar-check"></i>}
              {tab === 'invoices' && <i className="fas fa-file-invoice-dollar"></i>}
              {tab === 'users' && <i className="fas fa-users"></i>}
              {tab === 'services' && <i className="fas fa-briefcase"></i>}
              {tab === 'blogs' && <i className="fas fa-newspaper"></i>}
              {tab === 'pricing' && <i className="fas fa-tags"></i>}
              {tab === 'faqs' && <i className="fas fa-question-circle"></i>}
              {tab === 'team' && <i className="fas fa-user-tie"></i>}
              {tab === 'features' && <i className="fas fa-star"></i>}
              {tab === 'navmenu' && <i className="fas fa-bars"></i>}
              {tab === 'settings' && <i className="fas fa-sliders-h"></i>}
            </div>
            <div className="admin-title-block">
              <div className="admin-breadcrumb">
                <span className="breadcrumb-root">Admin Console</span>
                <i className="fas fa-chevron-right breadcrumb-separator"></i>
                <span className="breadcrumb-current">{getSectionTitle()}</span>
              </div>
              <span className="admin-sub-kicker">Shree Chamunda Associates &bull; ICAI Statutory Compliance Portal</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <button className="topbar-action-btn refresh" onClick={loadData} title="Sync Latest Records">
              <i className="fas fa-sync-alt"></i>
              <span>Refresh Records</span>
            </button>

            <Link to="/" className="topbar-action-btn website" target="_blank" rel="noopener noreferrer">
              <i className="fas fa-globe"></i>
              <span>Public Site</span>
            </Link>

            <div className="admin-user-profile-chip">
              <div className="admin-avatar-circle">{user.name.charAt(0).toUpperCase()}</div>
              <div className="admin-user-info">
                <strong>{user.name}</strong>
                <span>Lead Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Global Toast Alert */}
        {message && message.text && (
          <div className={`admin-toast-message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{message.text}</span>
          </div>
        )}

        {/* Body Viewport Area */}
        <div className="admin-body-stage">
          {loading ? (
            <div className="admin-content-loader">
              <div className="admin-spinner"></div>
              <p>Fetching encrypted database records...</p>
            </div>
          ) : (
            <div className="admin-tab-content-flow fade-in">
              {/* ========================================================
                  TAB 1: DASHBOARD SUMMARY
                  ======================================================== */}
              {tab === 'dashboard' && stats && (
                <div className="dashboard-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Executive Audit &amp; Operations Command</h1>
                      <p>Real-time analytics on client inquiries, document approvals, statutory filings, and retainer settlements.</p>
                    </div>
                    <div className="hero-action-buttons">
                      <button className="btn-admin-hero-primary" onClick={() => setInvoiceModalOpen(true)}>
                        <i className="fas fa-plus"></i> Create Client Invoice
                      </button>
                      <button className="btn-admin-hero-secondary" onClick={() => setTab('inquiries')}>
                        <i className="fas fa-tasks"></i> Review Filings ({stats.newInquiries})
                      </button>
                    </div>
                  </div>

                  {/* 4 Bento Metric Cards */}
                  <div className="admin-kpi-grid">
                    <div className="admin-kpi-card" onClick={() => setTab('inquiries')}>
                      <div className="kpi-icon-wrap blue"><i className="fas fa-inbox"></i></div>
                      <div className="kpi-info-wrap">
                        <span className="kpi-number">{stats.newInquiries} <small>/ {stats.totalInquiries}</small></span>
                        <span className="kpi-label">New Inquiries</span>
                      </div>
                      <i className="fas fa-arrow-right kpi-corner-arrow"></i>
                    </div>

                    <div className="admin-kpi-card" onClick={() => setTab('documents')}>
                      <div className="kpi-icon-wrap amber"><i className="fas fa-folder-open"></i></div>
                      <div className="kpi-info-wrap">
                        <span className="kpi-number">{stats.pendingDocs} <small>/ {stats.totalDocs}</small></span>
                        <span className="kpi-label">Pending Verifications</span>
                      </div>
                      <i className="fas fa-arrow-right kpi-corner-arrow"></i>
                    </div>

                    <div className="admin-kpi-card" onClick={() => setTab('users')}>
                      <div className="kpi-icon-wrap green"><i className="fas fa-user-shield"></i></div>
                      <div className="kpi-info-wrap">
                        <span className="kpi-number">{stats.totalUsers}</span>
                        <span className="kpi-label">Registered Clients</span>
                      </div>
                      <i className="fas fa-arrow-right kpi-corner-arrow"></i>
                    </div>

                    <div className="admin-kpi-card" onClick={() => setTab('services')}>
                      <div className="kpi-icon-wrap purple"><i className="fas fa-briefcase"></i></div>
                      <div className="kpi-info-wrap">
                        <span className="kpi-number">{services.length}</span>
                        <span className="kpi-label">Active Practice Areas</span>
                      </div>
                      <i className="fas fa-arrow-right kpi-corner-arrow"></i>
                    </div>
                  </div>

                  {/* Dual Grid: Fast Actions & Telemetry Chart */}
                  <div className="admin-dual-grid">
                    <div className="admin-bento-card launchpad-card">
                      <div className="bento-card-header">
                        <div className="bento-header-left">
                          <div className="bento-header-icon"><i className="fas fa-bolt"></i></div>
                          <div className="bento-header-title">
                            <span className="bento-kicker">QUICK COMMANDS</span>
                            <h3>Fast Management Shortcuts</h3>
                          </div>
                        </div>
                      </div>
                      <div className="bento-card-body">
                        <div className="launchpad-tiles-stack">
                          <button className="launchpad-tile" onClick={() => setTab('inquiries')}>
                            <div className="tile-icon blue"><i className="fas fa-inbox"></i></div>
                            <div className="tile-info">
                              <strong>Resolve Client Inquiries</strong>
                              <span>Review active filings and post CA milestone comments</span>
                            </div>
                            <i className="fas fa-chevron-right"></i>
                          </button>

                          <button className="launchpad-tile" onClick={() => setTab('documents')}>
                            <div className="tile-icon amber"><i className="fas fa-file-signature"></i></div>
                            <div className="tile-info">
                              <strong>Approve Vault Documents</strong>
                              <span>Review client Form 16, balance sheets, and PAN copies</span>
                            </div>
                            <i className="fas fa-chevron-right"></i>
                          </button>

                          <button className="launchpad-tile" onClick={() => setTab('invoices')}>
                            <div className="tile-icon green"><i className="fas fa-receipt"></i></div>
                            <div className="tile-info">
                              <strong>Generate Client Invoices</strong>
                              <span>Issue Razorpay invoices for statutory retainers</span>
                            </div>
                            <i className="fas fa-chevron-right"></i>
                          </button>

                          <button className="launchpad-tile" onClick={() => setTab('services')}>
                            <div className="tile-icon purple"><i className="fas fa-cogs"></i></div>
                            <div className="tile-info">
                              <strong>Update Service Catalog</strong>
                              <span>Configure pricing, deliverables, and practice fields</span>
                            </div>
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {renderAnalyticsChart()}
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 2: CLIENT INQUIRIES & DISCUSSIONS
                  ======================================================== */}
              {tab === 'inquiries' && (
                <div className="inquiries-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Client Inquiries &amp; Service Filings</h1>
                      <p>Manage tax compliance requests, update milestone statuses, and collaborate directly with clients through live discussion threads.</p>
                    </div>
                  </div>

                  <div className="admin-filter-bar-card">
                    <div className="filter-search-box">
                      <i className="fas fa-search"></i>
                      <input
                        type="text"
                        placeholder="Search inquiries by client name, email, service, or message..."
                        value={inqSearch}
                        onChange={(e) => { setInqSearch(e.target.value); setInqPage(1); }}
                      />
                      {inqSearch && <button className="clear-btn" onClick={() => setInqSearch('')}>&times;</button>}
                    </div>

                    <div className="filter-pill-selector">
                      {['all', 'new', 'in-progress', 'resolved', 'closed'].map(st => (
                        <button
                          key={st}
                          className={`filter-chip ${inqStatusFilter === st ? 'active' : ''}`}
                          onClick={() => { setInqStatusFilter(st); setInqPage(1); }}
                        >
                          {st === 'all' ? 'All Inquiries' : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredInqs.length === 0 ? (
                    <div className="admin-empty-state-box">
                      <i className="fas fa-inbox"></i>
                      <h3>No Client Inquiries Found</h3>
                      <p>There are no inquiries matching your current search parameters.</p>
                    </div>
                  ) : (
                    <div className="inquiries-cards-stack">
                      {paginatedInquiries.map(inq => (
                        <div key={inq._id} className="admin-bento-card inq-management-card">
                          <div className="inq-card-top-row">
                            <div className="inq-client-info">
                              <div className="client-avatar-badge">{inq.name.charAt(0).toUpperCase()}</div>
                              <div>
                                <h4>{inq.name}</h4>
                                <span className="inq-meta-line">
                                  <i className="fas fa-envelope"></i> {inq.email} &bull; <i className="fas fa-phone-alt"></i> {inq.phone || 'N/A'} &bull; <i className="far fa-calendar-alt"></i> {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                            </div>

                            <div className="inq-actions-cluster">
                              <select
                                value={inq.status}
                                onChange={(e) => handleInquiryStatus(inq._id, e.target.value)}
                                className={`admin-status-dropdown ${inq.status}`}
                              >
                                <option value="new">Status: New</option>
                                <option value="in-progress">Status: In Progress</option>
                                <option value="resolved">Status: Resolved</option>
                                <option value="closed">Status: Closed</option>
                              </select>
                              <button className="btn-action-delete" onClick={() => handleInquiryDelete(inq._id)} title="Delete Inquiry">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </div>

                          <div className="inq-service-badge-strip">
                            <span className="inq-service-pill"><i className="fas fa-tag"></i> {inq.service || 'General Tax Advisory'}</span>
                          </div>

                          <div className="inq-quote-box">
                            <i className="fas fa-quote-left"></i>
                            <p>{inq.message}</p>
                          </div>

                          {/* Live CA-Client Discussion Thread */}
                          <div className="admin-chat-thread-box">
                            <div className="chat-thread-title">
                              <i className="fas fa-comments"></i>
                              <span>Advisory Thread ({(inq.comments || []).length} messages)</span>
                            </div>

                            <div className="chat-thread-scroll">
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
                                <p className="no-chat-text">No replies posted yet. Post a status update or request missing documents below.</p>
                              )}
                            </div>

                            <div className="admin-chat-input-bar">
                              <input
                                type="text"
                                value={newCommentText[inq._id] || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setNewCommentText(prev => ({ ...prev, [inq._id]: val }));
                                }}
                                placeholder="Reply to client as Senior Chartered Accountant..."
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handlePostAdminComment(inq._id);
                                }}
                              />
                              <button className="btn-chat-send" onClick={() => handlePostAdminComment(inq._id)}>
                                <span>Send Reply</span> <i className="fas fa-paper-plane"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Pagination Controls */}
                      {totalInqPages > 1 && (
                        <div className="admin-pagination-strip">
                          <button disabled={inqPage <= 1} onClick={() => setInqPage(prev => prev - 1)}>
                            <i className="fas fa-chevron-left"></i> Previous
                          </button>
                          <span>Page {inqPage} of {totalInqPages}</span>
                          <button disabled={inqPage >= totalInqPages} onClick={() => setInqPage(prev => prev + 1)}>
                            Next <i className="fas fa-chevron-right"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 3: DOCUMENT VERIFICATION VAULT
                  ======================================================== */}
              {tab === 'documents' && (
                <div className="documents-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Confidential Document Verification Vault</h1>
                      <p>Inspect client tax filings, salary statements, P&amp;L accounts, and approve compliance status with direct download access.</p>
                    </div>
                  </div>

                  {documents.length === 0 ? (
                    <div className="admin-empty-state-box">
                      <i className="fas fa-folder-open"></i>
                      <h3>No Vault Documents Uploaded</h3>
                      <p>When clients submit documents from their portal, they will appear here for audit review.</p>
                    </div>
                  ) : (
                    <div className="admin-bento-card data-table-bento">
                      <div className="table-responsive-wrapper">
                        <table className="admin-modern-table">
                          <thead>
                            <tr>
                              <th>Client &amp; Status</th>
                              <th>Document File</th>
                              <th>Category &amp; Date</th>
                              <th>Auditor Review Note</th>
                              <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {documents.map(doc => (
                              <tr key={doc._id}>
                                <td>
                                  <div className="table-card-head">
                                    <div>
                                      <strong>{doc.user?.name || 'Client'}</strong>
                                      <span className="table-sub-text">{doc.user?.email || 'N/A'}</span>
                                    </div>
                                    <select
                                      value={doc.status}
                                      onChange={(e) => handleDocStatus(doc._id, e.target.value)}
                                      className={`admin-status-dropdown ${doc.status}`}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="approved">Approved</option>
                                      <option value="rejected">Rejected</option>
                                    </select>
                                  </div>
                                </td>
                                <td>
                                  <div className="vault-file-cell">
                                    <span className="file-badge pdf"><i className="fas fa-file-alt"></i></span>
                                    <button
                                      type="button"
                                      onClick={() => downloadAdminDocument(doc._id, doc.originalName)}
                                      className="filename-download-link"
                                      title={`Download ${doc.originalName}`}
                                    >
                                      {doc.originalName}
                                    </button>
                                  </div>
                                </td>
                                <td><span className="vault-tag-pill">{doc.serviceSlug || 'General'}</span> &bull; <span className="table-date">{new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Add CA review note..."
                                    defaultValue={doc.adminNote || ''}
                                    onBlur={(e) => {
                                      if (e.target.value !== doc.adminNote) {
                                        setDocumentNote(prev => ({ ...prev, [doc._id]: e.target.value }));
                                        updateDocumentStatus(doc._id, { status: doc.status, adminNote: e.target.value }).then(() => {
                                          showToast('success', 'Auditor note saved');
                                        });
                                      }
                                    }}
                                    className="table-inline-note-input"
                                  />
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <div className="table-actions-stack">
                                    <button
                                      className="btn-table-icon download"
                                      onClick={() => downloadAdminDocument(doc._id, doc.originalName)}
                                      title="Download File"
                                    >
                                      <i className="fas fa-download"></i> <span>Download</span>
                                    </button>
                                    <button
                                      className="btn-table-icon delete"
                                      onClick={() => handleDocDelete(doc._id)}
                                      title="Delete Document"
                                    >
                                      <i className="fas fa-trash-alt"></i> <span>Delete</span>
                                    </button>
                                  </div>
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

              {/* ========================================================
                  TAB 4: USERS DATABASE
                  ======================================================== */}
              {tab === 'users' && (
                <div className="users-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Registered Clients &amp; Access Directory</h1>
                      <p>Inspect registered taxpayer profiles, assign administrative roles, and manage secure portal access.</p>
                    </div>
                  </div>

                  <div className="admin-filter-bar-card">
                    <div className="filter-search-box">
                      <i className="fas fa-search"></i>
                      <input
                        type="text"
                        placeholder="Search users by full name or email address..."
                        value={userSearch}
                        onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                      />
                      {userSearch && <button className="clear-btn" onClick={() => setUserSearch('')}>&times;</button>}
                    </div>

                    <div className="filter-pill-selector">
                      {['all', 'client', 'admin'].map(rl => (
                        <button
                          key={rl}
                          className={`filter-chip ${userRoleFilter === rl ? 'active' : ''}`}
                          onClick={() => { setUserRoleFilter(rl); setUserPage(1); }}
                        >
                          {rl === 'all' ? 'All Roles' : rl === 'admin' ? 'Administrators' : 'Clients'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="admin-bento-card data-table-bento">
                    <div className="table-responsive-wrapper">
                      <table className="admin-modern-table">
                        <thead>
                          <tr>
                            <th>User Name &amp; Role</th>
                            <th>Contact Info</th>
                            <th>Joined Date</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedUsers.map(u => (
                            <tr key={u._id}>
                              <td>
                                <div className="table-card-head">
                                  <div className="user-table-cell">
                                    <div className="user-avatar-tiny">{u.name.charAt(0).toUpperCase()}</div>
                                    <strong>{u.name}</strong>
                                  </div>
                                  <select
                                    value={u.role}
                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                    className={`admin-status-dropdown role-${u.role}`}
                                    disabled={u._id === user._id}
                                  >
                                    <option value="client">Client</option>
                                    <option value="admin">Administrator</option>
                                  </select>
                                </div>
                              </td>
                              <td><span className="monospace-text">{u.email}</span> &bull; <span>{u.phone || 'No phone'}</span></td>
                              <td><span className="table-date">Joined: {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></td>
                              <td style={{ textAlign: 'right' }}>
                                {u._id !== user._id && (
                                  <button
                                    className="btn-table-icon delete"
                                    onClick={() => handleUserDelete(u._id)}
                                    title="Delete User Account"
                                  >
                                    <i className="fas fa-trash-alt"></i> <span>Delete</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {totalUserPages > 1 && (
                      <div className="admin-pagination-strip">
                        <button disabled={userPage <= 1} onClick={() => setUserPage(prev => prev - 1)}>
                          <i className="fas fa-chevron-left"></i> Previous
                        </button>
                        <span>Page {userPage} of {totalUserPages}</span>
                        <button disabled={userPage >= totalUserPages} onClick={() => setUserPage(prev => prev + 1)}>
                          Next <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 5: CONSULTATIONS SCHEDULER
                  ======================================================== */}
              {tab === 'consultations' && (
                <div className="consultations-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>CA Consultations &amp; Strategy Desk</h1>
                      <p>Review 1-on-1 consultation requests for notice handling, balance sheet audits, and business startup incorporations.</p>
                    </div>
                  </div>

                  {consultations.length === 0 ? (
                    <div className="admin-empty-state-box">
                      <i className="far fa-calendar-times"></i>
                      <h3>No Consultation Bookings Found</h3>
                      <p>Client booking requests will be organized here for time slot verification.</p>
                    </div>
                  ) : (
                    <div className="consultations-cards-grid">
                      {consultations.map(c => (
                        <div key={c._id} className="admin-bento-card consultation-admin-card">
                          <div className="consultation-card-top">
                            <div className="client-badge-group">
                              <span className="practice-tag">{c.serviceType}</span>
                              <h4>{c.name}</h4>
                              <span className="consultation-contact-line">
                                <i className="fas fa-envelope"></i> {c.email} &bull; <i className="fas fa-phone-alt"></i> {c.phone || 'N/A'}
                              </span>
                            </div>
                            <span className={`status-pill ${c.status}`}>{c.status}</span>
                          </div>

                          <div className="appointment-slot-highlight">
                            <div>
                              <i className="far fa-calendar-alt"></i>
                              <strong>{new Date(c.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                            </div>
                            <div>
                              <i className="far fa-clock"></i>
                              <span>{c.timeSlot}</span>
                            </div>
                          </div>

                          <p className="consultation-notes-quote">"{c.notes}"</p>

                          <div className="consultation-card-footer">
                            <select
                              value={c.status}
                              onChange={(e) => handleUpdateConsultationStatus(c._id, e.target.value)}
                              className={`admin-status-dropdown ${c.status}`}
                            >
                              <option value="pending">Status: Pending</option>
                              <option value="confirmed">Status: Confirmed</option>
                              <option value="completed">Status: Completed</option>
                              <option value="cancelled">Status: Cancelled</option>
                            </select>

                            <a
                              href={`https://wa.me/${c.phone ? c.phone.replace(/[^0-9]/g, '') : '919510984735'}?text=Hello%20${encodeURIComponent(c.name)},%20this%20is%20Shree%20Chamunda%20Associates%20regarding%20your%20scheduled%20CA%20Consultation.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-action-wa"
                            >
                              <i className="fab fa-whatsapp"></i> Chat
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 6: INVOICES & BILLING
                  ======================================================== */}
              {tab === 'invoices' && (
                <div className="invoices-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Client Invoices &amp; Razorpay Retainers</h1>
                      <p>Issue professional accounting fee invoices, track online settlements, and manage automated payment links.</p>
                    </div>
                    <div className="hero-action-buttons">
                      <button className="btn-admin-hero-primary" onClick={() => setInvoiceModalOpen(true)}>
                        <i className="fas fa-plus"></i> Generate New Invoice
                      </button>
                    </div>
                  </div>

                  {invoices.length === 0 ? (
                    <div className="admin-empty-state-box">
                      <i className="fas fa-receipt"></i>
                      <h3>No Invoices Issued Yet</h3>
                      <p>Create an invoice for any client to enable instant UPI and card settlements via Razorpay.</p>
                      <button className="btn-admin-hero-primary" onClick={() => setInvoiceModalOpen(true)}>
                        Generate First Invoice &rarr;
                      </button>
                    </div>
                  ) : (
                    <div className="admin-bento-card data-table-bento">
                      <div className="table-responsive-wrapper">
                        <table className="admin-modern-table">
                          <thead>
                            <tr>
                              <th>Invoice &amp; Client</th>
                              <th>Practice Area</th>
                              <th>Fee &amp; Due Date</th>
                              <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoices.map(inv => (
                              <tr key={inv._id}>
                                <td>
                                  <div className="table-card-head">
                                    <div>
                                      <span className="monospace-code">{inv.invoiceNumber}</span> &bull; <strong>{inv.client?.name || 'Client'}</strong>
                                    </div>
                                    <span className={`status-pill ${inv.status}`}>{inv.status}</span>
                                  </div>
                                </td>
                                <td><span className="table-meta-item"><span className="meta-key">Service:</span> <strong>{inv.serviceName}</strong></span></td>
                                <td>
                                  <span className="table-meta-item">
                                    <span className="meta-key">Amount:</span> <strong className="invoice-amount-text">₹{Number(inv.amount).toLocaleString('en-IN')}</strong>
                                  </span>
                                  &bull; <span className="table-date">Due: {new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <div className="table-actions-stack">
                                    <button
                                      className="btn-table-icon delete"
                                      onClick={() => handleDeleteInvoice(inv._id, inv.invoiceNumber)}
                                      title="Delete Invoice"
                                    >
                                      <i className="fas fa-trash-alt"></i> <span>Delete</span>
                                    </button>
                                  </div>
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

              {/* ========================================================
                  TAB 7: SERVICES DIRECTORY
                  ======================================================== */}
              {tab === 'services' && (
                <div className="services-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Practice Areas &amp; Service Catalog</h1>
                      <p>Create and customize practice areas, statutory fee schedules, checklists, and deliverables shown across the platform.</p>
                    </div>
                    <div className="hero-action-buttons">
                      <button className="btn-admin-hero-primary" onClick={() => handleOpenServiceModal()}>
                        <i className="fas fa-plus"></i> Add New Practice Field
                      </button>
                    </div>
                  </div>

                  <div className="admin-filter-bar-card">
                    <div className="filter-search-box">
                      <i className="fas fa-search"></i>
                      <input
                        type="text"
                        placeholder="Search services by title or description..."
                        value={serviceSearch}
                        onChange={(e) => { setServiceSearch(e.target.value); setServicePage(1); }}
                      />
                    </div>

                    <div className="filter-pill-selector">
                      {['all', 'accounting', 'tax', 'registration', 'startup', 'general'].map(st => (
                        <button
                          key={st}
                          className={`filter-chip ${serviceTypeFilter === st ? 'active' : ''}`}
                          onClick={() => { setServiceTypeFilter(st); setServicePage(1); }}
                        >
                          {st === 'all' ? 'All Types' : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="admin-bento-card data-table-bento">
                    <div className="table-responsive-wrapper">
                      <table className="admin-modern-table">
                        <thead>
                          <tr>
                            <th>Practice Area Title</th>
                            <th>Category &amp; Route</th>
                            <th>CA Fee</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedServices.map(s => (
                            <tr key={s._id}>
                              <td>
                                <div className="table-card-head">
                                  <div className="service-title-cell">
                                    <span className="service-icon-tile-tiny"><i className={s.icon || 'fas fa-file-invoice'}></i></span>
                                    <strong>{s.title}</strong>
                                  </div>
                                  <span className={`status-pill ${s.isActive ? 'approved' : 'rejected'}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
                                </div>
                              </td>
                              <td><span className="vault-tag-pill">{s.serviceType || 'general'}</span> <span className="monospace-text">/{s.slug}</span></td>
                              <td><span className="table-meta-item"><span className="meta-key">CA Fee:</span> <strong className="invoice-amount-text">₹{Number(s.professionalFee || 0).toLocaleString('en-IN')}</strong></span></td>
                              <td><span className={`status-pill ${s.isActive ? 'approved' : 'rejected'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="table-actions-stack">
                                  <button className="btn-table-icon edit" onClick={() => handleOpenServiceModal(s)} title="Edit Service">
                                    <i className="fas fa-edit"></i> <span>Edit</span>
                                  </button>
                                  <button className="btn-table-icon delete" onClick={() => handleServiceDelete(s._id)} title="Delete Service">
                                    <i className="fas fa-trash-alt"></i> <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {totalServicePages > 1 && (
                      <div className="admin-pagination-strip">
                        <button disabled={servicePage <= 1} onClick={() => setServicePage(prev => prev - 1)}>
                          <i className="fas fa-chevron-left"></i> Previous
                        </button>
                        <span>Page {servicePage} of {totalServicePages}</span>
                        <button disabled={servicePage >= totalServicePages} onClick={() => setServicePage(prev => prev + 1)}>
                          Next <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 8: BLOGS & ARTICLES
                  ======================================================== */}
              {tab === 'blogs' && (
                <div className="blogs-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Tax Guide &amp; Article Publisher</h1>
                      <p>Publish statutory compliance articles, GST regulatory notices, and advisory insights to educate taxpayers.</p>
                    </div>
                    <div className="hero-action-buttons">
                      <button className="btn-admin-hero-primary" onClick={() => handleOpenBlogModal()}>
                        <i className="fas fa-pen"></i> Write New Article
                      </button>
                    </div>
                  </div>

                  <div className="admin-filter-bar-card">
                    <div className="filter-search-box">
                      <i className="fas fa-search"></i>
                      <input
                        type="text"
                        placeholder="Search published articles..."
                        value={blogSearch}
                        onChange={(e) => { setBlogSearch(e.target.value); setBlogPage(1); }}
                      />
                    </div>
                  </div>

                  <div className="admin-bento-card data-table-bento">
                    <div className="table-responsive-wrapper">
                      <table className="admin-modern-table">
                        <thead>
                          <tr>
                            <th>Article Title</th>
                            <th>Author &amp; Date</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedBlogs.map(b => (
                            <tr key={b._id}>
                              <td>
                                <div className="table-card-head">
                                  <strong>{b.title}</strong>
                                  <span className="vault-tag-pill">{b.category || 'General'}</span>
                                </div>
                              </td>
                              <td><span className="table-meta-item"><span className="meta-key">By:</span> <span>{b.author || 'Admin'}</span></span> &bull; <span className="table-date">{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="table-actions-stack">
                                  <button className="btn-table-icon edit" onClick={() => handleOpenBlogModal(b)} title="Edit Article">
                                    <i className="fas fa-edit"></i> <span>Edit</span>
                                  </button>
                                  <button className="btn-table-icon delete" onClick={() => handleBlogDelete(b._id)} title="Delete Article">
                                    <i className="fas fa-trash-alt"></i> <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {totalBlogPages > 1 && (
                      <div className="admin-pagination-strip">
                        <button disabled={blogPage <= 1} onClick={() => setBlogPage(prev => prev - 1)}>
                          <i className="fas fa-chevron-left"></i> Previous
                        </button>
                        <span>Page {blogPage} of {totalBlogPages}</span>
                        <button disabled={blogPage >= totalBlogPages} onClick={() => setBlogPage(prev => prev + 1)}>
                          Next <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 9: PRICING PLANS
                  ======================================================== */}
              {tab === 'pricing' && (
                <div className="pricing-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Retainer Plans &amp; Pricing Tiers</h1>
                      <p>Configure monthly and annual CA retainer packages, deliverables, and popular tier highlights.</p>
                    </div>
                    <div className="hero-action-buttons">
                      <button className="btn-admin-hero-primary" onClick={() => handleOpenPricingModal()}>
                        <i className="fas fa-plus"></i> Add Pricing Tier
                      </button>
                    </div>
                  </div>

                  <div className="admin-bento-card data-table-bento">
                    <div className="table-responsive-wrapper">
                      <table className="admin-modern-table">
                        <thead>
                          <tr>
                            <th>Plan Name</th>
                            <th>Pricing Structure</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pricing.map(p => (
                            <tr key={p._id}>
                              <td>
                                <div className="table-card-head">
                                  <strong>{p.name}</strong>
                                  <span className={`status-pill ${p.isPopular ? 'approved' : 'closed'}`}>{p.isPopular ? 'Popular' : 'Standard'}</span>
                                </div>
                              </td>
                              <td>
                                <span className="table-meta-item">
                                  <span className="meta-key">Fee:</span> 
                                  <strong className="invoice-amount-text">₹{Number(p.price).toLocaleString('en-IN')}</strong> 
                                  <span className="monospace-text">/{p.period}</span>
                                </span>
                              </td>
                              <td><span className={`status-pill ${p.isActive ? 'approved' : 'rejected'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="table-actions-stack">
                                  <button className="btn-table-icon edit" onClick={() => handleOpenPricingModal(p)} title="Edit Plan">
                                    <i className="fas fa-edit"></i> <span>Edit</span>
                                  </button>
                                  <button className="btn-table-icon delete" onClick={() => handlePricingDelete(p._id)} title="Delete Plan">
                                    <i className="fas fa-trash-alt"></i> <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 10: FAQ KNOWLEDGE BASE
                  ======================================================== */}
              {tab === 'faqs' && (
                <div className="faqs-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Knowledge Base &amp; FAQ Engine</h1>
                      <p>Organize common compliance questions and answers shown in accordion cards across the platform.</p>
                    </div>
                    <div className="hero-action-buttons">
                      <button className="btn-admin-hero-primary" onClick={() => handleOpenFAQModal()}>
                        <i className="fas fa-plus"></i> Add New FAQ
                      </button>
                    </div>
                  </div>

                  <div className="admin-bento-card data-table-bento">
                    <div className="table-responsive-wrapper">
                      <table className="admin-modern-table">
                        <thead>
                          <tr>
                            <th>Question</th>
                            <th>Category &amp; Order</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedFaqs.map(f => (
                            <tr key={f._id}>
                              <td>
                                <div className="table-card-head">
                                  <strong>{f.question}</strong>
                                  <span className={`status-pill ${f.isActive ? 'approved' : 'rejected'}`}>{f.isActive ? 'Active' : 'Inactive'}</span>
                                </div>
                              </td>
                              <td><span className="vault-tag-pill">{f.category || 'General'}</span> &bull; <span className="table-meta-item"><span className="meta-key">Order:</span> <strong>{f.order}</strong></span></td>
                              <td><span className={`status-pill ${f.isActive ? 'approved' : 'rejected'}`}>{f.isActive ? 'Active' : 'Inactive'}</span></td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="table-actions-stack">
                                  <button className="btn-table-icon edit" onClick={() => handleOpenFAQModal(f)} title="Edit FAQ">
                                    <i className="fas fa-edit"></i> <span>Edit</span>
                                  </button>
                                  <button className="btn-table-icon delete" onClick={() => handleFAQDelete(f._id)} title="Delete FAQ">
                                    <i className="fas fa-trash-alt"></i> <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {totalFaqPages > 1 && (
                      <div className="admin-pagination-strip">
                        <button disabled={faqPage <= 1} onClick={() => setFaqPage(prev => prev - 1)}>
                          <i className="fas fa-chevron-left"></i> Previous
                        </button>
                        <span>Page {faqPage} of {totalFaqPages}</span>
                        <button disabled={faqPage >= totalFaqPages} onClick={() => setFaqPage(prev => prev + 1)}>
                          Next <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 11: TEAM PROFILES
                  ======================================================== */}
              {tab === 'team' && (
                <div className="team-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Chartered Partners &amp; Team Profiles</h1>
                      <p>Manage firm leadership profiles, credentials, and practice areas displayed on the public website.</p>
                    </div>
                    <div className="hero-action-buttons">
                      <button className="btn-admin-hero-primary" onClick={() => handleOpenTeamModal()}>
                        <i className="fas fa-plus"></i> Add Team Member
                      </button>
                    </div>
                  </div>

                  <div className="admin-bento-card data-table-bento">
                    <div className="table-responsive-wrapper">
                      <table className="admin-modern-table">
                        <thead>
                          <tr>
                            <th>Partner Name</th>
                            <th>Role / Designation</th>
                            <th>Practice Specialty</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedTeam.map(t => (
                            <tr key={t._id}>
                              <td>
                                <div className="table-card-head">
                                  <strong>{t.name}</strong>
                                  <span className={`status-pill ${t.isActive ? 'approved' : 'rejected'}`}>{t.isActive ? 'Active' : 'Inactive'}</span>
                                </div>
                              </td>
                              <td><span className="table-meta-item"><span className="meta-key">Role:</span> <span>{t.role}</span></span></td>
                              <td><span className="vault-tag-pill">{t.specialty}</span></td>
                              <td><span className={`status-pill ${t.isActive ? 'approved' : 'rejected'}`}>{t.isActive ? 'Active' : 'Inactive'}</span></td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="table-actions-stack">
                                  <button className="btn-table-icon edit" onClick={() => handleOpenTeamModal(t)} title="Edit Profile">
                                    <i className="fas fa-edit"></i> <span>Edit</span>
                                  </button>
                                  <button className="btn-table-icon delete" onClick={() => handleTeamDelete(t._id)} title="Delete Profile">
                                    <i className="fas fa-trash-alt"></i> <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 12: WHY CHOOSE US (FEATURES)
                  ======================================================== */}
              {tab === 'features' && (
                <div className="features-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Homepage "Why Choose Us" Feature Cards</h1>
                      <p>Customize the 3 strategic value proposition cards displayed in the "Why Choose Us • The Chartered Advantage" section on the public homepage.</p>
                    </div>
                    <div className="hero-action-buttons">
                      <button className="btn-admin-hero-primary" onClick={() => handleOpenFeatureModal()}>
                        <i className="fas fa-plus"></i> Add Feature Card
                      </button>
                    </div>
                  </div>

                  <div className="admin-bento-card data-table-bento">
                    <div className="table-responsive-wrapper">
                      <table className="admin-modern-table">
                        <thead>
                          <tr>
                            <th>Feature Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {siteFeatures.map(feat => (
                            <tr key={feat._id}>
                              <td>
                                <div className="table-card-head">
                                  <div className="table-title-with-icon">
                                    <i className={feat.icon || 'fas fa-star'}></i>
                                    <strong>{feat.title}</strong>
                                  </div>
                                  <span className={`status-pill ${feat.isActive ? 'approved' : 'rejected'}`}>{feat.isActive ? 'Active' : 'Inactive'}</span>
                                </div>
                              </td>
                              <td><span className="table-desc-text">{feat.description}</span></td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="table-actions-stack">
                                  <button className="btn-table-icon edit" onClick={() => handleOpenFeatureModal(feat)} title="Edit Feature">
                                    <i className="fas fa-edit"></i> <span>Edit</span>
                                  </button>
                                  <button className="btn-table-icon delete" onClick={() => handleFeatureDelete(feat._id)} title="Delete Feature">
                                    <i className="fas fa-trash-alt"></i> <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 13: NAV MENU BUILDER
                  ======================================================== */}
              {tab === 'navmenu' && (
                <div className="navmenu-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Megamenu Navigation Hierarchy</h1>
                      <p>Configure navbar items, dropdown megamenu hierarchies, and destination links.</p>
                    </div>
                    <div className="hero-action-buttons">
                      <button className="btn-admin-hero-primary" onClick={() => handleOpenNavModal()}>
                        <i className="fas fa-plus"></i> Add Menu Entry
                      </button>
                    </div>
                  </div>

                  <div className="admin-bento-card data-table-bento">
                    <div className="table-responsive-wrapper">
                      <table className="admin-modern-table">
                        <thead>
                          <tr>
                            <th>Menu Label</th>
                            <th>Destination Route</th>
                            <th>Display Order</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {navMenus.map(m => (
                            <tr key={m._id}>
                              <td>
                                <div className="table-card-head">
                                  <strong>{m.label}</strong>
                                  <span className="vault-tag-pill">{(m.children || []).length} Submenus</span>
                                </div>
                              </td>
                              <td><span className="table-meta-item"><span className="meta-key">Route:</span> <span className="monospace-text">{m.href}</span></span></td>
                              <td><span className="table-meta-item"><span className="meta-key">Order:</span> <strong>{m.order}</strong></span></td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="table-actions-stack">
                                  <button className="btn-table-icon edit" onClick={() => handleOpenNavModal(m)} title="Edit Menu Item">
                                    <i className="fas fa-edit"></i> <span>Edit</span>
                                  </button>
                                  <button className="btn-table-icon delete" onClick={() => handleNavDelete(m._id)} title="Delete Menu Item">
                                    <i className="fas fa-trash-alt"></i> <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 14: GLOBAL FIRM CONFIGURATION
                  ======================================================== */}
              {tab === 'settings' && (
                <div className="settings-tab-suite">
                  {/* Executive Hero Banner */}
                  <div className="admin-hero-banner">
                    <div className="hero-text-content">
                      <h1>Global Firm Configuration &amp; Contact Desk</h1>
                      <p>Manage office address, official helpline numbers, social media links, and firm mission statements.</p>
                    </div>
                  </div>

                  <div className="admin-bento-card settings-form-bento">
                    <form onSubmit={handleSettingsSubmit} className="admin-form-stack">
                      <div className="admin-form-grid-2">
                        <div className="admin-form-group">
                          <label><i className="fas fa-phone-alt"></i> Official Phone Helpline</label>
                          <input
                            type="text"
                            value={settingsForm.phone || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                            placeholder="+91 95109 84735"
                            required
                          />
                        </div>

                        <div className="admin-form-group">
                          <label><i className="fas fa-envelope"></i> Official Advisory Email</label>
                          <input
                            type="email"
                            value={settingsForm.email || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                            placeholder="shreechamundaassociates0905@gmail.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="admin-form-grid-2">
                        <div className="admin-form-group">
                          <label><i className="fas fa-clock"></i> Consultation &amp; Working Hours</label>
                          <input
                            type="text"
                            value={settingsForm.workingHours || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                            placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
                          />
                        </div>

                        <div className="admin-form-group">
                          <label><i className="fab fa-whatsapp"></i> WhatsApp Business Link</label>
                          <input
                            type="text"
                            value={settingsForm.socialLinks?.whatsapp || ''}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              socialLinks: { ...settingsForm.socialLinks, whatsapp: e.target.value }
                            })}
                            placeholder="https://wa.me/919510984735"
                          />
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label><i className="fas fa-map-marker-alt"></i> Head Office Address</label>
                        <textarea
                          rows="2"
                          value={settingsForm.address || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                          placeholder="Ahmedabad, Gujarat"
                        ></textarea>
                      </div>

                      <div className="admin-form-grid-2">
                        <div className="admin-form-group">
                          <label><i className="fab fa-instagram"></i> Instagram Handle Link</label>
                          <input
                            type="text"
                            value={settingsForm.socialLinks?.instagram || ''}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              socialLinks: { ...settingsForm.socialLinks, instagram: e.target.value }
                            })}
                            placeholder="https://instagram.com/..."
                          />
                        </div>

                        <div className="admin-form-group">
                          <label><i className="fab fa-facebook-f"></i> Facebook Page Link</label>
                          <input
                            type="text"
                            value={settingsForm.socialLinks?.facebook || ''}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value }
                            })}
                            placeholder="https://facebook.com/..."
                          />
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label><i className="fas fa-info-circle"></i> Firm Bio &amp; Statutory Statement</label>
                        <textarea
                          rows="3"
                          value={settingsForm.companyDescription || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, companyDescription: e.target.value })}
                          placeholder="A premier Chartered Accountancy firm..."
                        ></textarea>
                      </div>

                      <div className="settings-submit-bar">
                        <button type="submit" className="btn-admin-hero-primary" disabled={actionLoading}>
                          {actionLoading ? <><i className="fas fa-spinner fa-spin"></i> Saving Settings...</> : <><i className="fas fa-save"></i> Save Global Configurations</>}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ========================================================
          MODAL: INVOICE GENERATOR
          ======================================================== */}
      {invoiceModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-window">
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <i className="fas fa-file-invoice-dollar"></i>
                <h3>Generate Client Invoice</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setInvoiceModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateInvoiceSubmit}>
              <div className="modal-body-content">
                <div className="admin-form-group">
                  <label>Select Client *</label>
                  <select
                    value={invoiceForm.client}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, client: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Client --</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Service / Practice Field *</label>
                    <input
                      type="text"
                      value={invoiceForm.serviceName}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, serviceName: e.target.value })}
                      placeholder="e.g. GST Registration & Audit"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Fee Amount (INR) *</label>
                    <input
                      type="number"
                      value={invoiceForm.amount}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                      placeholder="e.g. 5000"
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Fee Description / Deliverables</label>
                  <textarea
                    rows="2"
                    value={invoiceForm.description}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                    placeholder="Professional fees for FY 2025-26 statutory compliance..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-bottom-bar">
                <button type="button" className="btn-modal-cancel" onClick={() => setInvoiceModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-admin-hero-primary" disabled={invoiceLoading}>
                  {invoiceLoading ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : 'Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: SERVICE FORM
          ======================================================== */}
      {modalType === 'service' && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-window large-modal">
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <i className="fas fa-briefcase"></i>
                <h3>{editingItem ? 'Edit Practice Field' : 'Add New Practice Field'}</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setModalType('')}>&times;</button>
            </div>
            <form onSubmit={handleServiceSubmit}>
              <div className="modal-body-content">
                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Service Title *</label>
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>URL Slug *</label>
                    <input
                      type="text"
                      value={serviceForm.slug}
                      onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-grid-3">
                  <div className="admin-form-group">
                    <label>Category Type</label>
                    <select
                      value={serviceForm.serviceType}
                      onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
                    >
                      <option value="accounting">Accounting</option>
                      <option value="tax">Tax Solutions</option>
                      <option value="registration">Registration</option>
                      <option value="startup">Start a Business</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Government Fee (₹)</label>
                    <input
                      type="number"
                      value={serviceForm.governmentFee}
                      onChange={(e) => setServiceForm({ ...serviceForm, governmentFee: Number(e.target.value) })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Professional Fee (₹)</label>
                    <input
                      type="number"
                      value={serviceForm.professionalFee}
                      onChange={(e) => setServiceForm({ ...serviceForm, professionalFee: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Short Description</label>
                  <textarea
                    rows="2"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="admin-form-group">
                  <label>Detailed Overview</label>
                  <textarea
                    rows="3"
                    value={serviceForm.detailedOverview}
                    onChange={(e) => setServiceForm({ ...serviceForm, detailedOverview: e.target.value })}
                  ></textarea>
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Deliverables (1 per line)</label>
                    <textarea
                      rows="3"
                      value={serviceForm.deliverables}
                      onChange={(e) => setServiceForm({ ...serviceForm, deliverables: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="admin-form-group">
                    <label>Documents Required (1 per line)</label>
                    <textarea
                      rows="3"
                      value={serviceForm.documentsRequired}
                      onChange={(e) => setServiceForm({ ...serviceForm, documentsRequired: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-bottom-bar">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalType('')}>Cancel</button>
                <button type="submit" className="btn-admin-hero-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: BLOG FORM
          ======================================================== */}
      {modalType === 'blog' && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-window large-modal">
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <i className="fas fa-newspaper"></i>
                <h3>{editingItem ? 'Edit Tax Article' : 'Publish New Tax Article'}</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setModalType('')}>&times;</button>
            </div>
            <form onSubmit={handleBlogSubmit}>
              <div className="modal-body-content">
                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Article Title *</label>
                    <input
                      type="text"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>URL Slug *</label>
                    <input
                      type="text"
                      value={blogForm.slug}
                      onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Author</label>
                    <input
                      type="text"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Excerpt / Summary</label>
                  <textarea
                    rows="2"
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="admin-form-group">
                  <label>Full Content (Markdown Supported)</label>
                  <textarea
                    rows="6"
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-bottom-bar">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalType('')}>Cancel</button>
                <button type="submit" className="btn-admin-hero-primary" disabled={actionLoading}>
                  {actionLoading ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: FAQ FORM
          ======================================================== */}
      {modalType === 'faq' && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-window">
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <i className="fas fa-question-circle"></i>
                <h3>{editingItem ? 'Edit FAQ' : 'Add FAQ'}</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setModalType('')}>&times;</button>
            </div>
            <form onSubmit={handleFAQSubmit}>
              <div className="modal-body-content">
                <div className="admin-form-group">
                  <label>Question *</label>
                  <input
                    type="text"
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Answer *</label>
                  <textarea
                    rows="4"
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={faqForm.category}
                      onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Display Order</label>
                    <input
                      type="number"
                      value={faqForm.order}
                      onChange={(e) => setFaqForm({ ...faqForm, order: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-bottom-bar">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalType('')}>Cancel</button>
                <button type="submit" className="btn-admin-hero-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: PRICING FORM
          ======================================================== */}
      {modalType === 'pricing' && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-window">
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <i className="fas fa-tags"></i>
                <h3>{editingItem ? 'Edit Pricing Plan' : 'Add Pricing Plan'}</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setModalType('')}>&times;</button>
            </div>
            <form onSubmit={handlePricingSubmit}>
              <div className="modal-body-content">
                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Plan Name *</label>
                    <input
                      type="text"
                      value={pricingForm.name}
                      onChange={(e) => setPricingForm({ ...pricingForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      value={pricingForm.price}
                      onChange={(e) => setPricingForm({ ...pricingForm, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Features Checklist (1 per line)</label>
                  <textarea
                    rows="4"
                    value={pricingForm.features}
                    onChange={(e) => setPricingForm({ ...pricingForm, features: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-bottom-bar">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalType('')}>Cancel</button>
                <button type="submit" className="btn-admin-hero-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TEAM FORM
          ======================================================== */}
      {modalType === 'team' && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-window">
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <i className="fas fa-user-tie"></i>
                <h3>{editingItem ? 'Edit Partner Profile' : 'Add Partner Profile'}</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setModalType('')}>&times;</button>
            </div>
            <form onSubmit={handleTeamSubmit}>
              <div className="modal-body-content">
                <div className="admin-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Role / Designation *</label>
                  <input
                    type="text"
                    value={teamForm.role}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Practice Specialty</label>
                  <input
                    type="text"
                    value={teamForm.specialty}
                    onChange={(e) => setTeamForm({ ...teamForm, specialty: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-bottom-bar">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalType('')}>Cancel</button>
                <button type="submit" className="btn-admin-hero-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: FEATURE FORM
          ======================================================== */}
      {modalType === 'feature' && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-window">
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <i className="fas fa-star"></i>
                <h3>{editingItem ? 'Edit Feature Highlight' : 'Add Feature Highlight'}</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setModalType('')}>&times;</button>
            </div>
            <form onSubmit={handleFeatureSubmit}>
              <div className="modal-body-content">
                <div className="admin-form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={featureForm.title}
                    onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Description *</label>
                  <textarea
                    rows="3"
                    value={featureForm.description}
                    onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-bottom-bar">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalType('')}>Cancel</button>
                <button type="submit" className="btn-admin-hero-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Feature'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: NAV MENU FORM
          ======================================================== */}
      {modalType === 'navmenu' && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-window">
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <i className="fas fa-bars"></i>
                <h3>{editingItem ? 'Edit Navigation Entry' : 'Add Navigation Entry'}</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setModalType('')}>&times;</button>
            </div>
            <form onSubmit={handleNavSubmit}>
              <div className="modal-body-content">
                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Menu Label *</label>
                    <input
                      type="text"
                      value={navForm.label}
                      onChange={(e) => setNavForm({ ...navForm, label: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Destination Route *</label>
                    <input
                      type="text"
                      value={navForm.href}
                      onChange={(e) => setNavForm({ ...navForm, href: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Submenu Entries JSON</label>
                  <textarea
                    rows="4"
                    value={navForm.children}
                    onChange={(e) => setNavForm({ ...navForm, children: e.target.value })}
                    className="monospace-code-box"
                  ></textarea>
                </div>
              </div>
              <div className="modal-bottom-bar">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalType('')}>Cancel</button>
                <button type="submit" className="btn-admin-hero-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Menu Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: DELETE CONFIRMATION
          ======================================================== */}
      {deleteConfirmOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-window delete-warning-window">
            <div className="modal-top-bar">
              <div className="modal-title-wrap text-danger">
                <i className="fas fa-exclamation-triangle"></i>
                <h3>Confirm Permanent Deletion?</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setDeleteConfirmOpen(false)}>&times;</button>
            </div>
            <div className="modal-body-content">
              <p>Are you sure you want to permanently delete <strong>{deleteItemTitle}</strong>?</p>
              <span className="warning-sub">This action cannot be undone and will expunge all related records immediately.</span>
            </div>
            <div className="modal-bottom-bar">
              <button className="btn-modal-cancel" onClick={() => setDeleteConfirmOpen(false)}>Cancel</button>
              <button
                className="btn-delete-confirm"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  if (deleteAction) deleteAction();
                }}
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
