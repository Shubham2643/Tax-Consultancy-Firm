import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  postAdminComment
} from '../api';
import useSEO from '../hooks/useSEO';
import './Admin.css';

const Admin = () => {
  useSEO({ title: 'Admin Control Center', description: 'Enterprise management interface for Shree Chamunda Associates' });
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  
  // Navigation
  const [tab, setTab] = useState(() => localStorage.getItem('adminTab') || 'dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem('adminSidebarCollapsed') === 'true');

  useEffect(() => {
    localStorage.setItem('adminTab', tab);
  }, [tab]);

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
  const [activeInquiryComments, setActiveInquiryComments] = useState(null);
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
  const [editingItem, setEditingItem] = useState(null); // holds the item currently being edited
  const [modalType, setModalType] = useState(''); // 'service', 'faq', 'pricing', 'blog', ''
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
    } catch (err) {
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
        showToast('success', `Appointment ${status}`);
      }
    } catch {
      showToast('error', 'Failed to update consultation');
    }
  };

  const handleCreateInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceForm.client || !invoiceForm.amount || !invoiceForm.dueDate) {
      showToast('error', 'Required invoice parameters missing');
      return;
    }
    setInvoiceLoading(true);
    try {
      const res = await createInvoice(invoiceForm);
      if (res.success) {
        showToast('success', 'Invoice generated successfully!');
        setInvoiceForm({ client: '', amount: '', serviceName: 'GST Registration & Filing', description: '', dueDate: '' });
        setInvoiceModalOpen(false);
        loadData();
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Invoice generation failed');
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleDeleteInvoiceAction = (id) => {
    confirmDelete('this client billing invoice', async () => {
      try {
        const res = await deleteInvoice(id);
        if (res.success) {
          setInvoices(prev => prev.filter(inv => inv._id !== id));
          showToast('success', 'Invoice deleted successfully');
        }
      } catch {
        showToast('error', 'Delete failed');
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
      showToast('error', 'Service update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleServiceDelete = (id) => {
    confirmDelete('this service option from the directory', async () => {
      try {
        await deleteService(id);
        setServices(prev => prev.filter(item => item._id !== id));
        showToast('success', 'Service deleted');
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  // FAQS CRUD
  const handleOpenFAQModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFaqForm(item);
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
      showToast('error', 'FAQ action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFAQDelete = (id) => {
    confirmDelete('this FAQ record', async () => {
      try {
        await deleteFAQ(id);
        setFaqs(prev => prev.filter(item => item._id !== id));
        showToast('success', 'FAQ deleted');
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
        ...item,
        features: item.features?.join('\n') || ''
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
          showToast('success', 'Pricing plan updated');
        }
      } else {
        const res = await createPricingPlan(payload);
        if (res.success) {
          setPricing(prev => [...prev, res.data]);
          showToast('success', 'Pricing plan created');
        }
      }
      setModalType('');
    } catch {
      showToast('error', 'Pricing update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePricingDelete = (id) => {
    confirmDelete('this pricing tier plan', async () => {
      try {
        await deletePricingPlan(id);
        setPricing(prev => prev.filter(item => item._id !== id));
        showToast('success', 'Pricing plan deleted');
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
        title: item.title || '',
        slug: item.slug || '',
        category: item.category || 'General',
        excerpt: item.summary || item.excerpt || '',
        content: item.content || '',
        bannerImage: item.image || item.bannerImage || '',
        author: item.author || 'Admin',
      });
    } else {
      setEditingItem(null);
      setBlogForm({ title: '', slug: '', category: 'General', excerpt: '', content: '', bannerImage: '', author: 'Admin' });
    }
    setModalType('blog');
  };

  const handleBlogTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    setBlogForm(prev => ({ ...prev, title, slug }));
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        const res = await updateBlogPost(editingItem._id, blogForm);
        if (res.success) {
          setBlogs(prev => prev.map(item => item._id === editingItem._id ? res.data : item));
          showToast('success', 'Blog article updated');
        }
      } else {
        const res = await createBlogPost(blogForm);
        if (res.success) {
          setBlogs(prev => [res.data, ...prev]);
          showToast('success', 'Blog article published');
        }
      }
      setModalType('');
    } catch {
      showToast('error', 'Blog upload failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlogDelete = (id) => {
    confirmDelete('this published blog article', async () => {
      try {
        await deleteBlogPost(id);
        setBlogs(prev => prev.filter(item => item._id !== id));
        showToast('success', 'Blog deleted');
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  // NAVMENU CRUD
  const handleOpenNavModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setNavForm({
        label: item.label || '',
        href: item.href || '#',
        order: item.order || 0,
        children: item.children || []
      });
    } else {
      setEditingItem(null);
      setNavForm({ label: '', href: '#', order: 0, children: [] });
    }
    setModalType('navmenu');
  };

  const handleNavSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        const res = await updateNavMenuItem(editingItem._id, navForm);
        if (res.success) {
          setNavMenus(prev => prev.map(item => item._id === editingItem._id ? res.data : item));
          showToast('success', 'Menu item updated');
        }
      } else {
        const res = await createNavMenuItem(navForm);
        if (res.success) {
          setNavMenus(prev => [...prev, res.data]);
          showToast('success', 'Menu item created');
        }
      }
      setModalType('');
    } catch {
      showToast('error', 'Nav menu update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleNavDelete = (id) => {
    confirmDelete('this navigation menu item', async () => {
      try {
        await deleteNavMenuItem(id);
        setNavMenus(prev => prev.filter(item => item._id !== id));
        showToast('success', 'Menu item deleted');
      } catch {
        showToast('error', 'Delete failed');
      }
    });
  };

  // FEATURES CRUD
  const handleOpenFeatureModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFeatureForm({
        title: item.title || '',
        description: item.description || '',
        icon: item.icon || 'fas fa-star',
        order: item.order || 0,
        isActive: item.isActive !== undefined ? item.isActive : true
      });
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
          showToast('success', 'Feature highlight updated');
        }
      } else {
        const res = await createFeature(featureForm);
        if (res.success) {
          setSiteFeatures(prev => [...prev, res.data]);
          showToast('success', 'Feature highlight created');
        }
      }
      setModalType('');
    } catch {
      showToast('error', 'Feature update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeatureDelete = (id) => {
    confirmDelete('this feature highlight card', async () => {
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
        name: '',
        role: '',
        specialty: '',
        img: '/assets/shreeChamundalogo.png',
        order: 0,
        isActive: true
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

  const statusClass = (status) => {
    const map = { new: 'blue', 'in-progress': 'amber', resolved: 'green', closed: 'gray', pending: 'amber', approved: 'green', rejected: 'red' };
    return map[status] || 'gray';
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
    const height = 200;
    const width = 500;
    const padding = 30;
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
      <div className="panel-card-half" style={{ minHeight: '260px' }}>
        <h3 style={{ borderBottom: '1.5px solid var(--border-light)', paddingBottom: '12px', marginBottom: '20px' }}>
          <i className="fas fa-chart-line" style={{ color: 'var(--accent)', marginRight: '8px' }}></i>
          Client Inquiries Trend
        </h3>
        <div className="chart-svg-wrapper" style={{ position: 'relative' }}>
          <svg width="100%" height={height - 20} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = padding + ratio * chartHeight;
              const labelVal = Math.round(maxVal * (1 - ratio));
              return (
                <g key={index}>
                  <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--border-light)" strokeDasharray="3 3" />
                  <text x={padding - 8} y={y + 4} fill="var(--text-muted)" fontSize="10" textAnchor="end" fontWeight="600">{labelVal}</text>
                </g>
              );
            })}

            {/* Area fill */}
            {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}

            {/* Line stroke */}
            {linePath && <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

            {/* Data Points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="var(--accent)" strokeWidth="2.5" />
                <text x={p.x} y={height - 8} fill="var(--text-muted)" fontSize="9.5" textAnchor="middle" fontWeight="700">{p.day}</text>
                <title>{`${p.day}: ${p.count} inquiry(s)`}</title>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  // Inquiries filtering & pagination
  const filteredInqs = inquiries.filter(inq => {
    const matchesSearch = (inq.name?.toLowerCase().includes(inqSearch.toLowerCase()) || 
                           inq.email?.toLowerCase().includes(inqSearch.toLowerCase()) || 
                           (inq.message || '').toLowerCase().includes(inqSearch.toLowerCase()));
    const matchesStatus = inqStatusFilter === 'all' || inq.status === inqStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const paginatedInqs = filteredInqs.slice((inqPage - 1) * itemsPerPage, inqPage * itemsPerPage);
  const totalInqPages = Math.ceil(filteredInqs.length / itemsPerPage) || 1;

  // Users filtering & pagination
  const filteredUsers = users.filter(usr => {
    const matchesSearch = (usr.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
                           usr.email?.toLowerCase().includes(userSearch.toLowerCase()) || 
                           (usr.phone || '').toLowerCase().includes(userSearch.toLowerCase()));
    const matchesRole = userRoleFilter === 'all' || usr.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });
  const paginatedUsers = filteredUsers.slice((userPage - 1) * itemsPerPage, userPage * itemsPerPage);
  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;


  // Services filtering & pagination
  const filteredServices = services.filter(srv => {
    const matchesSearch = (srv.title?.toLowerCase().includes(serviceSearch.toLowerCase()) || 
                           srv.slug?.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                           (srv.description || '').toLowerCase().includes(serviceSearch.toLowerCase()));
    const matchesType = serviceTypeFilter === 'all' || srv.serviceType === serviceTypeFilter;
    return matchesSearch && matchesType;
  });
  const paginatedServices = filteredServices.slice((servicePage - 1) * itemsPerPage, servicePage * itemsPerPage);
  const totalServicePages = Math.ceil(filteredServices.length / itemsPerPage) || 1;

  // FAQs filtering & pagination
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = (faq.question?.toLowerCase().includes(faqSearch.toLowerCase()) || 
                           faq.answer?.toLowerCase().includes(faqSearch.toLowerCase()));
    const matchesCat = faqCategoryFilter === 'all' || faq.category === faqCategoryFilter;
    return matchesSearch && matchesCat;
  });
  const paginatedFaqs = filteredFaqs.slice((faqPage - 1) * itemsPerPage, faqPage * itemsPerPage);
  const totalFaqPages = Math.ceil(filteredFaqs.length / itemsPerPage) || 1;

  // Blogs filtering & pagination
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = (blog.title?.toLowerCase().includes(blogSearch.toLowerCase()) || 
                           (blog.summary || blog.excerpt || '').toLowerCase().includes(blogSearch.toLowerCase()) || 
                           (blog.author || '').toLowerCase().includes(blogSearch.toLowerCase()));
    const matchesCat = blogCategoryFilter === 'all' || blog.category === blogCategoryFilter;
    return matchesSearch && matchesCat;
  });
  const paginatedBlogs = filteredBlogs.slice((blogPage - 1) * itemsPerPage, blogPage * itemsPerPage);
  const totalBlogPages = Math.ceil(filteredBlogs.length / itemsPerPage) || 1;

  // Team filtering & pagination
  const filteredTeam = teamMembers.filter(item => {
    return (item.name || '').toLowerCase().includes(teamSearch.toLowerCase()) ||
           (item.role || '').toLowerCase().includes(teamSearch.toLowerCase()) ||
           (item.specialty || '').toLowerCase().includes(teamSearch.toLowerCase());
  });
  const paginatedTeam = filteredTeam.slice((teamPage - 1) * itemsPerPage, teamPage * itemsPerPage);
  const totalTeamPages = Math.ceil(filteredTeam.length / itemsPerPage) || 1;

  if (authLoading || !user || user.role !== 'admin') {
    return <div className="admin-page"><div className="admin-loading">Verifying authentication credentials...</div></div>;
  }

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar Layout */}
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          title={isSidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
        >
          <i className={`fas ${isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>

        <div className="sidebar-logo">
          <i className="fas fa-shield-alt"></i>
          <div>
            <h3>Shree Chamunda Associates Admin</h3>
            <span className="badge-role">System Auditor</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-btn ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>
            <i className="fas fa-chart-pie"></i> <span className="nav-label">Dashboard Summary</span>
          </button>
          <button className={`nav-btn ${tab === 'inquiries' ? 'active' : ''}`} onClick={() => setTab('inquiries')}>
            <i className="fas fa-inbox"></i> 
            <span className="nav-label">Client Inquiries</span>
            {inquiries.length > 0 && <span className="nav-badge">{inquiries.length}</span>}
          </button>
          <button className={`nav-btn ${tab === 'documents' ? 'active' : ''}`} onClick={() => setTab('documents')}>
            <i className="fas fa-file-invoice"></i> 
            <span className="nav-label">Verification Portal</span>
            {documents.filter(d=>d.status==='pending').length > 0 && <span className="nav-badge">{documents.filter(d=>d.status==='pending').length}</span>}
          </button>
          <button className={`nav-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            <i className="fas fa-users"></i> <span className="nav-label">Users Database</span>
          </button>
          <button className={`nav-btn ${tab === 'consultations' ? 'active' : ''}`} onClick={() => setTab('consultations')}>
            <i className="fas fa-calendar-check"></i> 
            <span className="nav-label">Consultations</span>
            {consultations.filter(c=>c.status==='pending').length > 0 && <span className="nav-badge warning">{consultations.filter(c=>c.status==='pending').length}</span>}
          </button>
          <button className={`nav-btn ${tab === 'invoices' ? 'active' : ''}`} onClick={() => setTab('invoices')}>
            <i className="fas fa-file-invoice-dollar"></i> 
            <span className="nav-label">Invoices Vault</span>
            {invoices.filter(i=>i.status==='unpaid').length > 0 && <span className="nav-badge danger">{invoices.filter(i=>i.status==='unpaid').length}</span>}
          </button>
          <div className="nav-divider">SITE SECTIONS CRUD</div>
          <button className={`nav-btn ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>
            <i className="fas fa-file-invoice-dollar"></i> <span className="nav-label">Services Directory</span>
          </button>
          <button className={`nav-btn ${tab === 'faqs' ? 'active' : ''}`} onClick={() => setTab('faqs')}>
            <i className="fas fa-question-circle"></i> <span className="nav-label">FAQ Database</span>
          </button>
          <button className={`nav-btn ${tab === 'pricing' ? 'active' : ''}`} onClick={() => setTab('pricing')}>
            <i className="fas fa-tags"></i> <span className="nav-label">Pricing Tiers</span>
          </button>
          <button className={`nav-btn ${tab === 'blogs' ? 'active' : ''}`} onClick={() => setTab('blogs')}>
            <i className="fas fa-blog"></i> <span className="nav-label">Article Publisher</span>
          </button>
          <button className={`nav-btn ${tab === 'navmenu' ? 'active' : ''}`} onClick={() => setTab('navmenu')}>
            <i className="fas fa-bars"></i> <span className="nav-label">Nav Menu Builder</span>
          </button>
          <button className={`nav-btn ${tab === 'features' ? 'active' : ''}`} onClick={() => setTab('features')}>
            <i className="fas fa-star"></i> <span className="nav-label">Feature Highlights</span>
          </button>
          <button className={`nav-btn ${tab === 'team' ? 'active' : ''}`} onClick={() => setTab('team')}>
            <i className="fas fa-user-tie"></i> <span className="nav-label">Team Members</span>
          </button>
          <button className={`nav-btn ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
            <i className="fas fa-sliders-h"></i> <span className="nav-label">Global Config</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={() => logout().then(() => navigate('/'))}>
            <i className="fas fa-sign-out-alt"></i> <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="admin-main-panel">
        {message.text && (
          <div className={`admin-toast-message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{message.text}</span>
          </div>
        )}

        <div className="panel-scroll-content">
          {loading ? (
            <div className="panel-loading-wrapper">
              <div className="oauth-spinner"></div>
              <p>Fetching database tables...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: SUMMARY */}
              {tab === 'dashboard' && stats && (
                <div className="admin-tab-section">
                  <div className="section-title-bar">
                    <h2>Dashboard Statistics Summary</h2>
                    <button className="btn-action-outline" onClick={loadData}><i className="fas fa-sync"></i> Refresh Data</button>
                  </div>

                  <div className="stats-dashboard-grid">
                    <div className="stat-box-card">
                      <div className="icon-wrapper blue"><i className="fas fa-envelope-open-text"></i></div>
                      <div className="info">
                        <h4>{stats.newInquiries} / {stats.totalInquiries}</h4>
                        <p>New Inquiries</p>
                      </div>
                    </div>
                    <div className="stat-box-card">
                      <div className="icon-wrapper amber"><i className="fas fa-file-signature"></i></div>
                      <div className="info">
                        <h4>{stats.pendingDocs} / {stats.totalDocs}</h4>
                        <p>Pending Documents</p>
                      </div>
                    </div>
                    <div className="stat-box-card">
                      <div className="icon-wrapper green"><i className="fas fa-user-friends"></i></div>
                      <div className="info">
                        <h4>{stats.totalUsers}</h4>
                        <p>Registered Clients</p>
                      </div>
                    </div>
                    <div className="stat-box-card">
                      <div className="icon-wrapper purple"><i className="fas fa-cogs"></i></div>
                      <div className="info">
                        <h4>{services.length}</h4>
                        <p>Total Services</p>
                      </div>
                    </div>
                  </div>

                  <div className="admin-card-row">
                    <div className="panel-card-half">
                      <h3>Quick Navigation Links</h3>
                      <div className="quick-links-list">
                        <button onClick={() => setTab('inquiries')} className="ql-item"><i className="fas fa-inbox text-blue"></i> Resolve Inquiries</button>
                        <button onClick={() => setTab('documents')} className="ql-item"><i className="fas fa-file-check text-amber"></i> Approve Uploads</button>
                        <button onClick={() => setTab('services')} className="ql-item"><i className="fas fa-edit text-green"></i> Modify Services Catalog</button>
                        <button onClick={() => setTab('settings')} className="ql-item"><i className="fas fa-cog text-purple"></i> Edit Website Contact info</button>
                      </div>
                    </div>
                    {renderAnalyticsChart()}
                  </div>
                </div>
              )}

              {/* TAB 2: INQUIRIES */}
              {tab === 'inquiries' && (
                <div className="admin-tab-section">
                  <div className="section-title-bar">
                    <h2>Manage Client Inquiries ({filteredInqs.length})</h2>
                  </div>

                  <div className="table-controls-bar" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div className="search-box-wrapper" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-search search-bar-icon" style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }}></i>
                      <input
                        type="text"
                        placeholder="Search by client name, email, or content..."
                        value={inqSearch}
                        onChange={e => { setInqSearch(e.target.value); setInqPage(1); }}
                        className="search-bar-input"
                        style={{ paddingLeft: '38px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '10px 10px 10px 38px' }}
                      />
                    </div>
                    <div className="filter-dropdown-wrapper">
                      <select
                        value={inqStatusFilter}
                        onChange={e => { setInqStatusFilter(e.target.value); setInqPage(1); }}
                        className="filter-dropdown-select"
                        style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        <option value="all">All Statuses</option>
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="panel-data-table">
                      <thead>
                        <tr>
                          <th>Client Name</th>
                          <th>Contact details</th>
                          <th>Desired Service</th>
                          <th>Inquiry Content</th>
                          <th>Action status</th>
                          <th>Option</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedInqs.length === 0 ? (
                          <tr><td colSpan="6" className="text-center" style={{ padding: '30px' }}>No matching inquiries found.</td></tr>
                        ) : (
                          paginatedInqs.map(inq => (
                            <tr key={inq._id}>
                              <td><strong>{inq.name}</strong></td>
                              <td>
                                <div>{inq.email}</div>
                                <div className="text-sub">{inq.phone}</div>
                              </td>
                              <td><span className="slug-badge">{inq.service || 'General inquiry'}</span></td>
                              <td className="msg-td-cell">{inq.message}</td>
                              <td>
                                <select
                                  className={`status-select ${statusClass(inq.status)}`}
                                  value={inq.status}
                                  onChange={(e) => handleInquiryStatus(inq._id, e.target.value)}
                                >
                                  <option value="new">New</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="resolved">Resolved</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </td>
                              <td>
                                <div className="actions-flex">
                                  <button className="btn-edit" onClick={() => setActiveInquiryComments(inq)} title="Open Comments Thread">
                                    <i className="fas fa-comments"></i>
                                  </button>
                                  <button className="btn-delete" onClick={() => handleInquiryDelete(inq._id)}>
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalInqPages > 1 && (
                    <div className="paginator-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                      <button
                        type="button"
                        className="btn-action-outline"
                        disabled={inqPage === 1}
                        onClick={() => setInqPage(prev => Math.max(1, prev - 1))}
                        style={{ padding: '8px 16px' }}
                      >
                        <i className="fas fa-chevron-left"></i> Prev
                      </button>
                      <span className="page-indicator" style={{ fontWeight: 600 }}>Page <strong>{inqPage}</strong> of {totalInqPages}</span>
                      <button
                        type="button"
                        className="btn-action-outline"
                        disabled={inqPage === totalInqPages}
                        onClick={() => setInqPage(prev => Math.min(totalInqPages, prev + 1))}
                        style={{ padding: '8px 16px' }}
                      >
                        Next <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DOCUMENTS */}
              {tab === 'documents' && (
                <div className="admin-tab-section">
                  <div className="section-title-bar">
                    <h2>Verify Documents ({documents.length})</h2>
                  </div>

                  <div className="table-wrapper">
                    <table className="panel-data-table">
                      <thead>
                        <tr>
                          <th>Client Name</th>
                          <th>Document File</th>
                          <th>Service code</th>
                          <th>Verification remarks</th>
                          <th>Actions</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.length === 0 ? (
                          <tr><td colSpan="6" className="text-center">No documents uploaded.</td></tr>
                        ) : (
                          documents.map(doc => (
                            <tr key={doc._id}>
                              <td>
                                <strong>{doc.userId?.name || 'Deleted Client'}</strong>
                                <div className="text-sub">{doc.userId?.email}</div>
                              </td>
                              <td>
                                <a href={`http://localhost:5000/api/admin/documents/download/${doc._id}?token=${localStorage.getItem('authToken')}`} target="_blank" rel="noreferrer" className="btn-link-action">
                                  <i className="fas fa-file-pdf"></i> {doc.originalName}
                                </a>
                                <div className="text-sub">{(doc.fileSize / 1024).toFixed(1)} KB</div>
                              </td>
                              <td><span className="slug-badge">{doc.serviceSlug || 'General'}</span></td>
                              <td>
                                <input
                                  type="text"
                                  className="table-remarks-input"
                                  placeholder="Write notes back to portal..."
                                  defaultValue={doc.adminNote}
                                  onChange={(e) => setDocumentNote({ ...documentNote, [doc._id]: e.target.value })}
                                />
                              </td>
                              <td>
                                <div className="actions-flex">
                                  <button className="btn-circle-approve" onClick={() => handleDocStatus(doc._id, 'approved')}>
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <button className="btn-circle-reject" onClick={() => handleDocStatus(doc._id, 'rejected')}>
                                    <i className="fas fa-times"></i>
                                  </button>
                                  <span className={`portal-badge ${statusClass(doc.status)}`}>{doc.status}</span>
                                </div>
                              </td>
                              <td>
                                <button className="btn-delete" onClick={() => handleDocDelete(doc._id)}>
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: USERS */}
              {tab === 'users' && (
                <div className="admin-tab-section">
                  <div className="section-title-bar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fas fa-users-cog" style={{ fontSize: '1.6rem', color: 'var(--accent)' }}></i>
                      <h2 style={{ margin: 0 }}>Registered User Accounts</h2>
                      <span style={{ fontSize: '0.82rem', fontWeight: '750', background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb', padding: '4px 12px', borderRadius: '12px', marginLeft: '6px' }}>{filteredUsers.length} Total</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Manage database access keys, update auditor authorization roles, and revoke client access tokens.</p>
                  </div>

                  <div className="table-controls-bar" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div className="search-box-wrapper" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-search search-bar-icon" style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }}></i>
                      <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={userSearch}
                        onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
                        className="search-bar-input"
                        style={{ paddingLeft: '38px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '10px 10px 10px 38px' }}
                      />
                    </div>
                    <div className="filter-dropdown-wrapper">
                      <select
                        value={userRoleFilter}
                        onChange={e => { setUserRoleFilter(e.target.value); setUserPage(1); }}
                        className="filter-dropdown-select"
                        style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        <option value="all">All Roles</option>
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="panel-data-table users-db-table">
                      <thead>
                        <tr>
                          <th>Account Name</th>
                          <th>Email Address</th>
                          <th>Phone Number</th>
                          <th>Security Role</th>
                          <th>Joined At</th>
                          <th style={{ textAlign: 'right' }}>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.length === 0 ? (
                          <tr><td colSpan="6" className="text-center" style={{ padding: '30px' }}>No matching accounts found.</td></tr>
                        ) : (
                          paginatedUsers.map(u => (
                            <tr key={u._id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: u.role === 'admin' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'linear-gradient(135deg, #f8b400 0%, #d97706 100%)',
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    fontSize: '0.95rem',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                                    flexShrink: 0
                                  }}>
                                    {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>{u.name}</span>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace', letterSpacing: '-0.3px' }}>ID: {u._id.substring(0, 8)}</span>
                                  </div>
                                </div>
                              </td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <i className="far fa-envelope" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{u.email}</span>
                                </div>
                              </td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <i className="fas fa-phone-alt" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}></i>
                                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{u.phone || '-'}</span>
                                </div>
                              </td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                <select
                                  className={`role-select-badge ${u.role === 'admin' ? 'role-admin' : 'role-client'}`}
                                  value={u.role}
                                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                >
                                  <option value="client">Client</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <i className="far fa-calendar-alt" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                              </td>
                              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                {user._id !== u._id ? (
                                  <button className="btn-delete" onClick={() => handleUserDelete(u._id)} title="Delete Account" style={{ padding: '8px 10px', borderRadius: '8px' }}>
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                ) : (
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '5px 12px',
                                    borderRadius: '12px',
                                    background: 'rgba(76, 175, 80, 0.08)',
                                    color: '#4CAF50',
                                    fontWeight: '750',
                                    fontSize: '0.78rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                  }}>
                                    <span style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      background: '#4CAF50',
                                      display: 'inline-block',
                                      animation: 'pulseGlow 1.5s infinite'
                                    }}></span>
                                    Current Session
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalUserPages > 1 && (
                    <div className="paginator-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                      <button
                        type="button"
                        className="btn-action-outline"
                        disabled={userPage === 1}
                        onClick={() => setUserPage(prev => Math.max(1, prev - 1))}
                        style={{ padding: '8px 16px' }}
                      >
                        <i className="fas fa-chevron-left"></i> Prev
                      </button>
                      <span className="page-indicator" style={{ fontWeight: 600 }}>Page <strong>{userPage}</strong> of {totalUserPages}</span>
                      <button
                        type="button"
                        className="btn-action-outline"
                        disabled={userPage === totalUserPages}
                        onClick={() => setUserPage(prev => Math.min(totalUserPages, prev + 1))}
                        style={{ padding: '8px 16px' }}
                      >
                        Next <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SERVICES */}
              {tab === 'services' && (
                <div className="admin-tab-section">
                  <div className="section-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-file-invoice-dollar" style={{ fontSize: '1.6rem', color: 'var(--accent)' }}></i>
                        <h2 style={{ margin: 0 }}>Services Directory</h2>
                        <span style={{ fontSize: '0.82rem', fontWeight: '750', background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb', padding: '4px 12px', borderRadius: '12px', marginLeft: '6px' }}>{filteredServices.length} Active</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Publish tax filing forms, incorporate custom pricing catalogs, and update standard delivery timelines.</p>
                    </div>
                    <button className="btn-action-primary" onClick={() => handleOpenServiceModal(null)} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <i className="fas fa-plus"></i> Add Service
                    </button>
                  </div>

                  <div className="table-controls-bar" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div className="search-box-wrapper" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-search search-bar-icon" style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }}></i>
                      <input
                        type="text"
                        placeholder="Search by service name, slug, or description..."
                        value={serviceSearch}
                        onChange={e => { setServiceSearch(e.target.value); setServicePage(1); }}
                        className="search-bar-input"
                        style={{ paddingLeft: '38px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '10px 10px 10px 38px' }}
                      />
                    </div>
                    <div className="filter-dropdown-wrapper">
                      <select
                        value={serviceTypeFilter}
                        onChange={e => { setServiceTypeFilter(e.target.value); setServicePage(1); }}
                        className="filter-dropdown-select"
                        style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        <option value="all">All Service Types</option>
                        <option value="incorporation">Incorporation</option>
                        <option value="compliance">Compliance</option>
                        <option value="registration">Registration</option>
                        <option value="return">Return Filing</option>
                        <option value="accounting">Accounting</option>
                        <option value="others">Others</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="panel-data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '80px' }}>Order</th>
                          <th>Service Details</th>
                          <th>Category</th>
                          <th>Pricing Details</th>
                          <th>Timeline</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right', width: '120px' }}>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedServices.length === 0 ? (
                          <tr><td colSpan="7" className="text-center" style={{ padding: '30px' }}>No services found matching filters.</td></tr>
                        ) : (
                          paginatedServices.map(srv => (
                            <tr key={srv._id}>
                              <td style={{ fontWeight: '750', color: 'var(--text-main)' }}>#{srv.order}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: 'rgba(37, 99, 235, 0.06)',
                                    color: 'var(--accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                                    flexShrink: 0
                                  }}>
                                    {srv.icon && (srv.icon.startsWith('/') || srv.icon.startsWith('http')) ? (
                                      <img src={srv.icon} alt="" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                                    ) : (
                                      <i className={srv.icon || 'fas fa-file-invoice'}></i>
                                    )}
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem' }}>{srv.title}</span>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>/{srv.slug}</span>
                                  </div>
                                </div>
                              </td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                <span className="slug-badge">{srv.serviceType}</span>
                              </td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: '750', color: 'var(--text-main)' }}>₹{srv.professionalFee + srv.governmentFee}</span>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Prof: ₹{srv.professionalFee} | Gov: ₹{srv.governmentFee}</span>
                                </div>
                              </td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                  <i className="far fa-clock" style={{ color: 'var(--text-muted)' }}></i>
                                  <span>{srv.timeline}</span>
                                </div>
                              </td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '4px 10px',
                                  borderRadius: '12px',
                                  background: srv.isActive ? 'rgba(76, 175, 80, 0.08)' : 'rgba(100, 116, 139, 0.08)',
                                  color: srv.isActive ? '#4CAF50' : 'var(--text-muted)',
                                  fontWeight: '700',
                                  fontSize: '0.78rem',
                                  textTransform: 'uppercase'
                                }}>
                                  <span style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: srv.isActive ? '#4CAF50' : 'var(--text-muted)',
                                    display: 'inline-block',
                                    animation: srv.isActive ? 'pulseGlow 1.5s infinite' : 'none'
                                  }}></span>
                                  {srv.isActive ? 'Active' : 'Draft'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <div className="actions-flex" style={{ display: 'inline-flex', gap: '8px' }}>
                                  <button className="btn-edit" onClick={() => handleOpenServiceModal(srv)} title="Edit Service" style={{ padding: '8px 10px', borderRadius: '8px' }}><i className="fas fa-edit"></i></button>
                                  <button className="btn-delete" onClick={() => handleServiceDelete(srv._id)} title="Delete Service" style={{ padding: '8px 10px', borderRadius: '8px' }}><i className="fas fa-trash-alt"></i></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalServicePages > 1 && (
                    <div className="paginator-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                      <button
                        type="button"
                        className="btn-action-outline"
                        disabled={servicePage === 1}
                        onClick={() => setServicePage(prev => Math.max(1, prev - 1))}
                        style={{ padding: '8px 16px' }}
                      >
                        <i className="fas fa-chevron-left"></i> Prev
                      </button>
                      <span className="page-indicator" style={{ fontWeight: 600 }}>Page <strong>{servicePage}</strong> of {totalServicePages}</span>
                      <button
                        type="button"
                        className="btn-action-outline"
                        disabled={servicePage === totalServicePages}
                        onClick={() => setServicePage(prev => Math.min(totalServicePages, prev + 1))}
                        style={{ padding: '8px 16px' }}
                      >
                        Next <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: FAQS */}
              {tab === 'faqs' && (
                <div className="admin-tab-section">
                  <div className="section-title-bar">
                    <h2>FAQ Database ({filteredFaqs.length})</h2>
                    <button className="btn-action-primary" onClick={() => handleOpenFAQModal(null)}><i className="fas fa-plus"></i> Add FAQ</button>
                  </div>

                  <div className="table-controls-bar" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div className="search-box-wrapper" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-search search-bar-icon" style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }}></i>
                      <input
                        type="text"
                        placeholder="Search by question or answer..."
                        value={faqSearch}
                        onChange={e => { setFaqSearch(e.target.value); setFaqPage(1); }}
                        className="search-bar-input"
                        style={{ paddingLeft: '38px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '10px 10px 10px 38px' }}
                      />
                    </div>
                    <div className="filter-dropdown-wrapper">
                      <select
                        value={faqCategoryFilter}
                        onChange={e => { setFaqCategoryFilter(e.target.value); setFaqPage(1); }}
                        className="filter-dropdown-select"
                        style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        <option value="all">All Categories</option>
                        {Array.from(new Set(faqs.map(f => f.category))).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="panel-data-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Category</th>
                          <th>Question</th>
                          <th>Answer Snippet</th>
                          <th>Status</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedFaqs.length === 0 ? (
                          <tr><td colSpan="6" className="text-center" style={{ padding: '30px' }}>No matching FAQs found.</td></tr>
                        ) : (
                          paginatedFaqs.map(item => (
                            <tr key={item._id}>
                              <td>{item.order}</td>
                              <td><span className="slug-badge">{item.category}</span></td>
                              <td><strong>{item.question}</strong></td>
                              <td className="msg-td-cell">{item.answer}</td>
                              <td>
                                <span className={`portal-badge ${item.isActive ? 'green' : 'gray'}`}>
                                  {item.isActive ? 'Active' : 'Hidden'}
                                </span>
                              </td>
                              <td>
                                <div className="actions-flex">
                                  <button className="btn-edit" onClick={() => handleOpenFAQModal(item)}><i className="fas fa-edit"></i></button>
                                  <button className="btn-delete" onClick={() => handleFAQDelete(item._id)}><i className="fas fa-trash-alt"></i></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalFaqPages > 1 && (
                    <div className="paginator-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                      <button
                        type="button"
                        className="btn-action-outline"
                        disabled={faqPage === 1}
                        onClick={() => setFaqPage(prev => Math.max(1, prev - 1))}
                        style={{ padding: '8px 16px' }}
                      >
                        <i className="fas fa-chevron-left"></i> Prev
                      </button>
                      <span className="page-indicator" style={{ fontWeight: 600 }}>Page <strong>{faqPage}</strong> of {totalFaqPages}</span>
                      <button
                        type="button"
                        className="btn-action-outline"
                        disabled={faqPage === totalFaqPages}
                        onClick={() => setFaqPage(prev => Math.min(totalFaqPages, prev + 1))}
                        style={{ padding: '8px 16px' }}
                      >
                        Next <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: PRICING */}
              {tab === 'pricing' && (
                <div className="admin-tab-section">
                  <div className="section-title-bar">
                    <h2>Pricing Plans ({pricing.length})</h2>
                    <button className="btn-action-primary" onClick={() => handleOpenPricingModal(null)}><i className="fas fa-plus"></i> Add Plan</button>
                  </div>

                  <div className="table-wrapper">
                    <table className="panel-data-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Plan Name</th>
                          <th>Price</th>
                          <th>Billing</th>
                          <th>Features Count</th>
                          <th>Highlight</th>
                          <th>Status</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pricing.map(item => (
                          <tr key={item._id}>
                            <td>{item.order}</td>
                            <td><strong>{item.name}</strong></td>
                            <td>₹{item.price}</td>
                            <td>/{item.period}</td>
                            <td>{item.features?.length || 0} items</td>
                            <td>{item.isPopular ? <span className="popular-highlight">Popular ★</span> : '-'}</td>
                            <td>
                              <span className={`portal-badge ${item.isActive ? 'green' : 'gray'}`}>
                                {item.isActive ? 'Active' : 'Disabled'}
                              </span>
                            </td>
                            <td>
                              <div className="actions-flex">
                                <button className="btn-edit" onClick={() => handleOpenPricingModal(item)}><i className="fas fa-edit"></i></button>
                                <button className="btn-delete" onClick={() => handlePricingDelete(item._id)}><i className="fas fa-trash-alt"></i></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 8: BLOGS */}
              {tab === 'blogs' && (
                <div className="admin-tab-section">
                  <div className="section-title-bar">
                    <h2>Articles and Publications ({filteredBlogs.length})</h2>
                    <button className="btn-action-primary" onClick={() => handleOpenBlogModal(null)}><i className="fas fa-plus"></i> Write Article</button>
                  </div>

                  <div className="table-controls-bar" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div className="search-box-wrapper" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-search search-bar-icon" style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }}></i>
                      <input
                        type="text"
                        placeholder="Search by article title, summary, or author..."
                        value={blogSearch}
                        onChange={e => { setBlogSearch(e.target.value); setBlogPage(1); }}
                        className="search-bar-input"
                        style={{ paddingLeft: '38px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '10px 10px 10px 38px' }}
                      />
                    </div>
                    <div className="filter-dropdown-wrapper">
                      <select
                        value={blogCategoryFilter}
                        onChange={e => { setBlogCategoryFilter(e.target.value); setBlogPage(1); }}
                        className="filter-dropdown-select"
                        style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        <option value="all">All Categories</option>
                        {Array.from(new Set(blogs.map(b => b.category))).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="panel-data-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Slug</th>
                          <th>Category</th>
                          <th>Author</th>
                          <th>Excerpt Summary</th>
                          <th>Published Date</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedBlogs.length === 0 ? (
                          <tr><td colSpan="7" className="text-center" style={{ padding: '30px' }}>No matching articles found.</td></tr>
                        ) : (
                          paginatedBlogs.map(blog => (
                            <tr key={blog._id}>
                              <td><strong>{blog.title}</strong></td>
                              <td><code>{blog.slug}</code></td>
                              <td><span className="slug-badge">{blog.category}</span></td>
                              <td>{blog.author}</td>
                              <td className="msg-td-cell">{blog.summary || blog.excerpt}</td>
                              <td>{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                              <td>
                                <div className="actions-flex">
                                  <button className="btn-edit" onClick={() => handleOpenBlogModal(blog)}><i className="fas fa-edit"></i></button>
                                  <button className="btn-delete" onClick={() => handleBlogDelete(blog._id)}><i className="fas fa-trash-alt"></i></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalBlogPages > 1 && (
                    <div className="paginator-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                      <button
                        type="button"
                        className="btn-action-outline"
                        disabled={blogPage === 1}
                        onClick={() => setBlogPage(prev => Math.max(1, prev - 1))}
                        style={{ padding: '8px 16px' }}
                      >
                        <i className="fas fa-chevron-left"></i> Prev
                      </button>
                      <span className="page-indicator" style={{ fontWeight: 600 }}>Page <strong>{blogPage}</strong> of {totalBlogPages}</span>
                      <button
                        type="button"
                        className="btn-action-outline"
                        disabled={blogPage === totalBlogPages}
                        onClick={() => setBlogPage(prev => Math.min(totalBlogPages, prev + 1))}
                        style={{ padding: '8px 16px' }}
                      >
                        Next <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: TEAM MEMBERS */}
              {tab === 'team' && (
                <div className="admin-tab-section">
                  <div className="section-title-bar">
                    <h2>Dynamic Team Members ({teamMembers.length})</h2>
                    <button className="btn-action-primary" onClick={() => handleOpenTeamModal(null)}><i className="fas fa-plus"></i> Add Team Member</button>
                  </div>

                  <div className="table-controls-bar" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div className="search-box-wrapper" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-search search-bar-icon" style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }}></i>
                      <input
                        type="text"
                        placeholder="Search team by name, role or specialty..."
                        value={teamSearch}
                        onChange={(e) => { setTeamSearch(e.target.value); setTeamPage(1); }}
                        className="table-search-input"
                        style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="panel-data-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Profile Photo</th>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Specialty Domain</th>
                          <th>Status</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTeam.length === 0 ? (
                          <tr><td colSpan="7" className="text-center" style={{ padding: '30px' }}>No team members found.</td></tr>
                        ) : (
                          paginatedTeam.map(item => (
                            <tr key={item._id}>
                              <td><code>{item.order}</code></td>
                              <td>
                                <div className="avatar-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-accent)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                                  <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                </div>
                              </td>
                              <td><strong>{item.name}</strong></td>
                              <td><code>{item.role}</code></td>
                              <td><span className="specialty-badge" style={{ background: 'rgba(26,62,114,0.06)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>{item.specialty}</span></td>
                              <td>
                                <span className={`portal-badge ${item.isActive ? 'green' : 'gray'}`}>
                                  {item.isActive ? 'Active' : 'Hidden'}
                                </span>
                              </td>
                              <td>
                                <div className="actions-flex">
                                  <button className="btn-edit" onClick={() => handleOpenTeamModal(item)}><i className="fas fa-edit"></i></button>
                                  <button className="btn-delete" onClick={() => handleTeamDelete(item._id)}><i className="fas fa-trash-alt"></i></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {totalTeamPages > 1 && (
                    <div className="table-pagination-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                      <span className="pagination-info">Showing page <strong>{teamPage}</strong> of <strong>{totalTeamPages}</strong></span>
                      <div className="pagination-buttons" style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-action-secondary"
                          disabled={teamPage === 1}
                          onClick={() => setTeamPage(prev => Math.max(1, prev - 1))}
                          style={{ padding: '8px 16px' }}
                        >
                          <i className="fas fa-chevron-left"></i> Prev
                        </button>
                        <button
                          className="btn-action-secondary"
                          disabled={teamPage === totalTeamPages}
                          onClick={() => setTeamPage(prev => Math.min(totalTeamPages, prev + 1))}
                          style={{ padding: '8px 16px' }}
                        >
                          Next <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 9: SETTINGS */}
              {tab === 'settings' && settings && (
                <div className="admin-tab-section">
                  <div className="section-title-bar">
                    <h2>Global Website Configuration</h2>
                  </div>

                  <form onSubmit={handleSettingsSubmit} className="admin-config-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'none', border: 'none', padding: 0, boxShadow: 'none' }}>
                    
                    <div className="form-section-card">
                      <h4 className="form-section-title"><i className="fas fa-building"></i> Company Contact Information</h4>
                      <div className="form-grid">
                        <div className="form-field">
                          <label>Phone Line</label>
                          <input type="text" placeholder="e.g. +91 98765 43210" value={settingsForm.phone} onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })} />
                        </div>
                        <div className="form-field">
                          <label>Email Address</label>
                          <input type="email" placeholder="e.g. contact@taxfirm.com" value={settingsForm.email} onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })} />
                        </div>
                        <div className="form-field">
                          <label>Working Hours</label>
                          <input type="text" placeholder="e.g. Mon-Fri, 9AM to 6PM" value={settingsForm.workingHours} onChange={e => setSettingsForm({ ...settingsForm, workingHours: e.target.value })} />
                        </div>
                        <div className="form-field full-width">
                          <label>Physical Address</label>
                          <input type="text" placeholder="e.g. 123 Business Avenue, City, State" value={settingsForm.address} onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })} />
                        </div>
                      </div>
                    </div>

                    <div className="form-section-card">
                      <h4 className="form-section-title"><i className="fas fa-home"></i> Homepage Hero Section Config</h4>
                      <div className="form-grid">
                        <div className="form-field">
                          <label>Hero Bold Title</label>
                          <input type="text" value={settingsForm.heroTitle} onChange={e => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })} />
                        </div>
                        <div className="form-field">
                          <label>Hero Subtitle</label>
                          <input type="text" value={settingsForm.heroSubtitle} onChange={e => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })} />
                        </div>
                        <div className="form-field full-width">
                          <label>Hero Section Description</label>
                          <textarea rows={3} value={settingsForm.heroDescription} onChange={e => setSettingsForm({ ...settingsForm, heroDescription: e.target.value })} />
                        </div>
                      </div>
                    </div>

                    <div className="form-section-card">
                      <h4 className="form-section-title"><i className="fas fa-share-alt"></i> Social Media Links</h4>
                      <div className="form-grid">
                        <div className="form-field">
                          <label>WhatsApp Link</label>
                          <input type="text" placeholder="e.g. https://wa.me/..." value={settingsForm.socialLinks.whatsapp} onChange={e => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, whatsapp: e.target.value } })} />
                        </div>
                        <div className="form-field">
                          <label>Instagram Link</label>
                          <input type="text" placeholder="e.g. https://instagram.com/..." value={settingsForm.socialLinks.instagram} onChange={e => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, instagram: e.target.value } })} />
                        </div>
                        <div className="form-field">
                          <label>Facebook Page Link</label>
                          <input type="text" placeholder="e.g. https://facebook.com/..." value={settingsForm.socialLinks.facebook} onChange={e => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value } })} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button type="submit" className="btn-action-primary" disabled={actionLoading} style={{ padding: '14px 30px', fontSize: '1rem' }}>
                        {actionLoading ? 'Saving config...' : <><i className="fas fa-save"></i> Save Global Configuration</>}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: NAV MENU BUILDER */}
              {tab === 'navmenu' && (
                <div className="admin-tab-section">
                  <div className="section-title-bar">
                    <h2>Navigation Menu Links ({navMenus.length})</h2>
                    <button className="btn-action-primary" onClick={() => handleOpenNavModal(null)}><i className="fas fa-plus"></i> Add Nav Link</button>
                  </div>

                  <div className="table-wrapper">
                    <table className="panel-data-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Label</th>
                          <th>URL / Anchor</th>
                          <th>Sub-items count</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {navMenus.length === 0 ? (
                          <tr><td colSpan="5" className="text-center" style={{ padding: '30px' }}>No navigation menu items defined.</td></tr>
                        ) : (
                          [...navMenus].sort((a,b) => a.order - b.order).map(item => (
                            <tr key={item._id}>
                              <td><code>{item.order}</code></td>
                              <td><strong>{item.label}</strong></td>
                              <td><code>{item.href}</code></td>
                              <td>{item.children?.length || 0}</td>
                              <td>
                                <div className="actions-flex">
                                  <button className="btn-edit" onClick={() => handleOpenNavModal(item)}><i className="fas fa-edit"></i></button>
                                  <button className="btn-delete" onClick={() => handleNavDelete(item._id)}><i className="fas fa-trash-alt"></i></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: FEATURE HIGHLIGHTS */}
              {tab === 'features' && (
                <div className="admin-tab-section">
                  <div className="section-title-bar">
                    <h2>Homepage Highlight Cards ({siteFeatures.length})</h2>
                    <button className="btn-action-primary" onClick={() => handleOpenFeatureModal(null)}><i className="fas fa-plus"></i> Add Highlight</button>
                  </div>

                  <div className="table-wrapper">
                    <table className="panel-data-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Icon Preview</th>
                          <th>Title</th>
                          <th>Description Content</th>
                          <th>Status</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {siteFeatures.length === 0 ? (
                          <tr><td colSpan="6" className="text-center" style={{ padding: '30px' }}>No highlights configured.</td></tr>
                        ) : (
                          [...siteFeatures].sort((a,b) => a.order - b.order).map(item => (
                            <tr key={item._id}>
                              <td><code>{item.order}</code></td>
                              <td><i className={`${item.icon}`} style={{ fontSize: '1.2rem', color: 'var(--accent)', marginRight: '6px' }}></i> <code>{item.icon}</code></td>
                              <td><strong>{item.title}</strong></td>
                              <td className="msg-td-cell">{item.description}</td>
                              <td>
                                <span className={`portal-badge ${item.isActive ? 'green' : 'gray'}`}>
                                  {item.isActive ? 'Active' : 'Hidden'}
                                </span>
                              </td>
                              <td>
                                <div className="actions-flex">
                                  <button className="btn-edit" onClick={() => handleOpenFeatureModal(item)}><i className="fas fa-edit"></i></button>
                                  <button className="btn-delete" onClick={() => handleFeatureDelete(item._id)}><i className="fas fa-trash-alt"></i></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: CONSULTATIONS SCHEDULER */}
              {tab === 'consultations' && (
                <div className="admin-tab-section">
                  <div className="section-title-bar">
                    <h2>Consultations & Appointments Scheduler ({consultations.length})</h2>
                  </div>

                  {/* Summary Metric Widgets Row */}
                  <div className="stats-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
                    <div className="stat-summary-card" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Bookings</span>
                        <div style={{ background: 'rgba(30, 64, 175, 0.1)', color: '#1e40af', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-calendar-alt"></i>
                        </div>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1e293b' }}>{consultations.length}</h3>
                    </div>
                    
                    <div className="stat-summary-card" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Pending Approval</span>
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#b45309', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-clock"></i>
                        </div>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1e293b' }}>{consultations.filter(c => c.status === 'pending').length}</h3>
                    </div>

                    <div className="stat-summary-card" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Approved Sessions</span>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#065f46', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-check"></i>
                        </div>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1e293b' }}>{consultations.filter(c => c.status === 'approved').length}</h3>
                    </div>

                    <div className="stat-summary-card" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Completed</span>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-check-double"></i>
                        </div>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1e293b' }}>{consultations.filter(c => c.status === 'completed').length}</h3>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="panel-data-table">
                      <thead>
                        <tr>
                          <th>Client Details</th>
                          <th>Field</th>
                          <th>Meeting Time</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consultations.length === 0 ? (
                          <tr><td colSpan="5" className="text-center" style={{ padding: '30px' }}>No consultations scheduled.</td></tr>
                        ) : (
                          consultations.map(booking => (
                            <tr key={booking._id}>
                              <td>
                                <strong>{booking.name}</strong>
                                <div className="text-sub">{booking.email}</div>
                                <div className="text-sub">{booking.phone}</div>
                              </td>
                              <td><span className="slug-badge">{booking.serviceType}</span></td>
                              <td>
                                <div><i className="far fa-calendar-alt"></i> {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                <div className="text-sub"><i className="far fa-clock"></i> {booking.timeSlot}</div>
                              </td>
                              <td>
                                <span className={`status-badge-capsule ${booking.status}`}>{booking.status}</span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                {booking.status === 'pending' && (
                                  <div className="actions-flex" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                                    <button 
                                      className="btn-action-primary" 
                                      onClick={() => handleUpdateConsultationStatus(booking._id, 'approved')}
                                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                    >
                                      <i className="fas fa-check"></i> Approve
                                    </button>
                                    <button 
                                      className="btn-action-outline" 
                                      onClick={() => handleUpdateConsultationStatus(booking._id, 'rejected')}
                                      style={{ padding: '6px 12px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', fontSize: '0.85rem' }}
                                    >
                                      <i className="fas fa-times"></i> Reject
                                    </button>
                                  </div>
                                )}
                                {booking.status === 'approved' && (
                                  <button 
                                    className="btn-action-outline" 
                                    onClick={() => handleUpdateConsultationStatus(booking._id, 'completed')}
                                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                  >
                                    <i className="fas fa-check-double"></i> Complete
                                  </button>
                                )}
                                {booking.status === 'completed' && (
                                  <span style={{ color: '#15803d', background: '#dcfce7', padding: '6px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}><i className="fas fa-check-circle"></i> Closed</span>
                                )}
                                {booking.status === 'rejected' && (
                                  <span style={{ color: '#b91c1c', background: '#fee2e2', padding: '6px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}><i className="fas fa-times-circle"></i> Declined</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: INVOICES VAULT */}
              {tab === 'invoices' && (
                <div className="admin-tab-section">
                  <div className="section-title-bar">
                    <h2>Invoices & Billing Vault ({invoices.length})</h2>
                    <button 
                      className="btn-action-primary" 
                      onClick={() => {
                        setInvoiceForm({ client: '', amount: '', serviceName: 'GST Registration & Filing', description: '', dueDate: '' });
                        setInvoiceModalOpen(true);
                      }}
                    >
                      <i className="fas fa-plus"></i> Generate Invoice
                    </button>
                  </div>

                  <div className="table-wrapper">
                    <table className="panel-data-table">
                      <thead>
                        <tr>
                          <th>Invoice #</th>
                          <th>Client</th>
                          <th>Service Name</th>
                          <th>Amount</th>
                          <th>Due Date</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.length === 0 ? (
                          <tr><td colSpan="7" className="text-center" style={{ padding: '30px' }}>No billing invoices generated.</td></tr>
                        ) : (
                          invoices.map(inv => (
                            <tr key={inv._id}>
                              <td><span className="monospace-code">{inv.invoiceNumber}</span></td>
                              <td>
                                <strong>{inv.client?.name || 'Unknown User'}</strong>
                                <div className="text-sub">{inv.client?.email}</div>
                              </td>
                              <td><strong>{inv.serviceName}</strong></td>
                              <td>₹{inv.amount}</td>
                              <td>{new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                              <td>
                                <span className={`status-badge-capsule ${inv.status}`}>{inv.status}</span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button className="btn-delete" onClick={() => handleDeleteInvoiceAction(inv._id)}>
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ============================================
         EDITING MODALS
         ============================================ */}
      {modalType && (
        <div className="modal-overlay-container">
          <div className={`modal-card-box ${['service', 'faq', 'blog', 'pricing', 'feature', 'navmenu', 'team'].includes(modalType) ? 'modal-wide' : ''}`}>
            <div className="modal-title-header">
              <h3>{editingItem ? 'Edit Existing Record' : 'Create New Record'}</h3>
              <button className="btn-close-modal" onClick={() => setModalType('')}>&times;</button>
            </div>

            <div className="modal-body-scroll">
              {/* SERVICE MODAL */}
              {modalType === 'service' && (
                <form onSubmit={handleServiceSubmit} className="modal-form-flex">
                  
                  <div className="form-section-card">
                    <h4 className="form-section-title"><i className="fas fa-info-circle"></i> Basic Information</h4>
                    <div className="modal-form-grid">
                      <div className="form-field full-width">
                        <label>Service Title</label>
                        <input type="text" required placeholder="e.g., Personal Tax Return" value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>URL Slug (lowercase, no spaces)</label>
                        <input type="text" required placeholder="e.g., personal-tax" value={serviceForm.slug} onChange={e => setServiceForm({ ...serviceForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
                      </div>
                      <div className="form-field">
                        <label>Icon (FontAwesome Class)</label>
                        <input type="text" required placeholder="e.g., fas fa-calculator" value={serviceForm.icon} onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="form-section-card">
                    <h4 className="form-section-title"><i className="fas fa-tags"></i> Classification & Pricing</h4>
                    <div className="modal-form-grid">
                      <div className="form-field">
                        <label>Category Group</label>
                        <select value={serviceForm.serviceType} onChange={e => setServiceForm({ ...serviceForm, serviceType: e.target.value })}>
                          <option value="tax">Tax Returns</option>
                          <option value="startup">Startups</option>
                          <option value="accounting">Accounting & Payroll</option>
                          <option value="registration">Business Registrations</option>
                          <option value="general">Others</option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label>Timeline Description</label>
                        <input type="text" required placeholder="e.g., 3-5 working days" value={serviceForm.timeline} onChange={e => setServiceForm({ ...serviceForm, timeline: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Government Fee</label>
                        <div className="input-with-icon">
                          <span className="input-icon">₹</span>
                          <input type="number" required value={serviceForm.governmentFee} onChange={e => setServiceForm({ ...serviceForm, governmentFee: Number(e.target.value) })} />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Professional Fee</label>
                        <div className="input-with-icon">
                          <span className="input-icon">₹</span>
                          <input type="number" required value={serviceForm.professionalFee} onChange={e => setServiceForm({ ...serviceForm, professionalFee: Number(e.target.value) })} />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Sort Order Index</label>
                        <input type="number" required value={serviceForm.order} onChange={e => setServiceForm({ ...serviceForm, order: Number(e.target.value) })} />
                      </div>
                    </div>
                  </div>

                  <div className="form-section-card">
                    <h4 className="form-section-title"><i className="fas fa-align-left"></i> Content & Details</h4>
                    <div className="modal-form-grid">
                      <div className="form-field full-width">
                        <label>Short Description Summary</label>
                        <textarea rows={2} required placeholder="Brief summary of the service" value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} />
                      </div>
                      <div className="form-field full-width">
                        <label>Detailed Overview Description</label>
                        <textarea rows={4} placeholder="Full details for the service page..." value={serviceForm.detailedOverview} onChange={e => setServiceForm({ ...serviceForm, detailedOverview: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="form-section-card">
                    <h4 className="form-section-title"><i className="fas fa-list-check"></i> Requirements & Deliverables</h4>
                    <div className="form-field-hint">Enter one item per line. These will be automatically formatted as bullet points on the website.</div>
                    <div className="modal-form-grid">
                      <div className="form-field">
                        <label>Documents Required</label>
                        <textarea rows={4} placeholder="e.g. PAN Card copy\nAddress Proof\nBank Statement" value={serviceForm.documentsRequired} onChange={e => setServiceForm({ ...serviceForm, documentsRequired: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Deliverables (What the client gets)</label>
                        <textarea rows={4} placeholder="e.g. GST Registration Certificate\nLogin Credentials" value={serviceForm.deliverables} onChange={e => setServiceForm({ ...serviceForm, deliverables: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer-btns full-width" style={{ marginTop: '10px' }}>
                    <button type="button" className="btn-action-outline" onClick={() => setModalType('')}>Cancel</button>
                    <button type="submit" className="btn-action-primary" disabled={actionLoading}>
                      {actionLoading ? 'Saving...' : <><i className="fas fa-save"></i> Save Service Record</>}
                    </button>
                  </div>
                </form>
              )}

              {/* FAQ MODAL */}
              {modalType === 'faq' && (
                <form onSubmit={handleFAQSubmit} className="modal-form-flex">
                  <div className="form-section-card">
                    <h4 className="form-section-title"><i className="fas fa-question-circle"></i> FAQ Content</h4>
                    <div className="modal-form-grid">
                      <div className="form-field full-width">
                        <label>Question text</label>
                        <input type="text" required placeholder="e.g. What is the process for registering a new business?" value={faqForm.question} onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} />
                      </div>
                      <div className="form-field full-width">
                        <label>Answer text</label>
                        <textarea rows={4} required placeholder="Provide a detailed answer here..." value={faqForm.answer} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="form-section-card">
                    <h4 className="form-section-title"><i className="fas fa-layer-group"></i> Organization</h4>
                    <div className="modal-form-grid">
                      <div className="form-field">
                        <label>Category Name</label>
                        <input type="text" required placeholder="e.g. Tax Returns" value={faqForm.category} onChange={e => setFaqForm({ ...faqForm, category: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Order Index</label>
                        <input type="number" required value={faqForm.order} onChange={e => setFaqForm({ ...faqForm, order: Number(e.target.value) })} />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer-btns full-width" style={{ marginTop: '10px' }}>
                    <button type="button" className="btn-action-outline" onClick={() => setModalType('')}>Cancel</button>
                    <button type="submit" className="btn-action-primary" disabled={actionLoading}>
                      {actionLoading ? 'Saving...' : <><i className="fas fa-save"></i> Save FAQ Record</>}
                    </button>
                  </div>
                </form>
              )}

              {/* PRICING MODAL */}
              {modalType === 'pricing' && (
                <form onSubmit={handlePricingSubmit} className="modal-form-flex">
                  <div className="form-section-card">
                    <h4 className="form-section-title"><i className="fas fa-tag"></i> Plan Details & Pricing</h4>
                    <div className="modal-form-grid">
                      <div className="form-field">
                        <label>Plan Name</label>
                        <input type="text" required placeholder="e.g. Basic Plan" value={pricingForm.name} onChange={e => setPricingForm({ ...pricingForm, name: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Price Amount</label>
                        <div className="input-with-icon">
                          <span className="input-icon">₹</span>
                          <input type="number" required value={pricingForm.price} onChange={e => setPricingForm({ ...pricingForm, price: Number(e.target.value) })} />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Billing Period</label>
                        <input type="text" required placeholder="e.g. month, year, or one-time" value={pricingForm.period} onChange={e => setPricingForm({ ...pricingForm, period: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Order Index</label>
                        <input type="number" required value={pricingForm.order} onChange={e => setPricingForm({ ...pricingForm, order: Number(e.target.value) })} />
                      </div>
                      <div className="form-field full-width" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <input type="checkbox" id="isPopular" checked={pricingForm.isPopular} onChange={e => setPricingForm({ ...pricingForm, isPopular: e.target.checked })} style={{ width: '18px', height: '18px', margin: 0 }} />
                        <label htmlFor="isPopular" style={{ cursor: 'pointer', margin: 0, fontSize: '0.95rem' }}>Highlight as "Most Popular" tier</label>
                      </div>
                    </div>
                  </div>

                  <div className="form-section-card">
                    <h4 className="form-section-title"><i className="fas fa-list"></i> Plan Features</h4>
                    <div className="form-field-hint">Enter one feature per line. These will be formatted as a bulleted checklist on the pricing card.</div>
                    <div className="modal-form-grid">
                      <div className="form-field full-width">
                        <textarea rows={5} required placeholder="e.g. Free Registration&#10;Dedicated Support&#10;Monthly Reports" value={pricingForm.features} onChange={e => setPricingForm({ ...pricingForm, features: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer-btns full-width" style={{ marginTop: '10px' }}>
                    <button type="button" className="btn-action-outline" onClick={() => setModalType('')}>Cancel</button>
                    <button type="submit" className="btn-action-primary" disabled={actionLoading}>
                      {actionLoading ? 'Saving...' : <><i className="fas fa-save"></i> Save Pricing Plan</>}
                    </button>
                  </div>
                </form>
              )}

              {/* BLOG MODAL */}
              {modalType === 'blog' && (
                <form onSubmit={handleBlogSubmit} className="modal-form-flex">
                  <div className="form-section-card">
                    <h4 className="form-section-title"><i className="fas fa-newspaper"></i> Article Information</h4>
                    <div className="modal-form-grid">
                      <div className="form-field">
                        <label>Title</label>
                        <input type="text" required placeholder="e.g. 5 Tax Saving Tips" value={blogForm.title} onChange={handleBlogTitleChange} />
                      </div>
                      <div className="form-field">
                        <label>URL Slug (Auto-generated)</label>
                        <input type="text" readOnly placeholder="e.g. 5-tax-saving-tips" value={blogForm.slug} />
                      </div>
                      <div className="form-field">
                        <label>Category</label>
                        <input type="text" required placeholder="e.g. Tax Planning" value={blogForm.category} onChange={e => setBlogForm({ ...blogForm, category: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Excerpt Summary</label>
                        <input type="text" required placeholder="A short 1-sentence summary..." value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} />
                      </div>
                      <div className="form-field full-width">
                        <label>Cover Image URL</label>
                        <input type="text" placeholder="e.g. https://images.unsplash.com/photo-... or leave blank for default banner screenshot" value={blogForm.bannerImage} onChange={e => setBlogForm({ ...blogForm, bannerImage: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="form-section-card">
                    <h4 className="form-section-title"><i className="fab fa-markdown"></i> Article Content</h4>
                    <div className="form-field-hint">Write your article using Markdown format for headings, bold text, lists, and links.</div>
                    <div className="modal-form-grid">
                      <div className="form-field full-width">
                        <textarea rows={12} required placeholder="# Main Heading&#10;&#10;Start writing your article here..." value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} style={{ fontFamily: 'monospace', lineHeight: '1.5' }} />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer-btns full-width" style={{ marginTop: '10px' }}>
                    <button type="button" className="btn-action-outline" onClick={() => setModalType('')}>Cancel</button>
                    <button type="submit" className="btn-action-primary" disabled={actionLoading}>
                      {actionLoading ? 'Publishing...' : <><i className="fas fa-paper-plane"></i> Publish Article</>}
                    </button>
                  </div>
                </form>
              )}

              {/* NAVMENU MODAL */}
              {modalType === 'navmenu' && (
                <form onSubmit={handleNavSubmit} className="modal-form-flex">
                  <div className="form-section-card">
                    <h4 className="form-section-title"><i className="fas fa-bars"></i> Nav Link Information</h4>
                    <div className="modal-form-grid">
                      <div className="form-field">
                        <label>Menu Label</label>
                        <input type="text" required placeholder="e.g. Services" value={navForm.label} onChange={e => setNavForm({ ...navForm, label: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Href Path / Target URL</label>
                        <input type="text" required placeholder="e.g. /services or #about" value={navForm.href} onChange={e => setNavForm({ ...navForm, href: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Display Sort Order</label>
                        <input type="number" required placeholder="e.g. 1" value={navForm.order} onChange={e => setNavForm({ ...navForm, order: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                  </div>

                  <div className="form-section-card full-width" style={{ marginTop: '20px' }}>
                    <h4 className="form-section-title"><i className="fas fa-list-ul"></i> Sub-Menu Links (Dropdown Children)</h4>
                    <div className="form-field-hint" style={{ marginBottom: '14px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Add child links that will display under this menu item in a dropdown.
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {navForm.children && navForm.children.map((child, index) => (
                        <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div className="form-field" style={{ flex: 1, margin: 0 }}>
                            <input
                              type="text"
                              placeholder="Sub-link Label (e.g. Income Tax Return)"
                              value={child.label}
                              required
                              onChange={e => {
                                const newChildren = [...navForm.children];
                                newChildren[index].label = e.target.value;
                                setNavForm({ ...navForm, children: newChildren });
                              }}
                              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', width: '100%' }}
                            />
                          </div>
                          <div className="form-field" style={{ flex: 1, margin: 0 }}>
                            <input
                              type="text"
                              placeholder="Sub-link Href (e.g. /services/itr)"
                              value={child.href}
                              required
                              onChange={e => {
                                const newChildren = [...navForm.children];
                                newChildren[index].href = e.target.value;
                                setNavForm({ ...navForm, children: newChildren });
                              }}
                              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            className="btn-delete"
                            onClick={() => {
                              const newChildren = navForm.children.filter((_, i) => i !== index);
                              setNavForm({ ...navForm, children: newChildren });
                            }}
                            style={{ padding: '10px 12px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px' }}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="btn-action-outline"
                        onClick={() => {
                          const newChildren = [...(navForm.children || []), { label: '', href: '' }];
                          setNavForm({ ...navForm, children: newChildren });
                        }}
                        style={{ padding: '10px 16px', alignSelf: 'flex-start', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <i className="fas fa-plus"></i> Add Sub-Link Item
                      </button>
                    </div>
                  </div>

                  <div className="modal-footer-btns full-width" style={{ marginTop: '20px' }}>
                    <button type="button" className="btn-action-outline" onClick={() => setModalType('')}>Cancel</button>
                    <button type="submit" className="btn-action-primary" disabled={actionLoading}>
                      {actionLoading ? 'Saving Link...' : <><i className="fas fa-save"></i> Save Nav Link</>}
                    </button>
                  </div>
                </form>
              )}

              {/* FEATURE HIGHLIGHT MODAL */}
              {modalType === 'feature' && (
                <form onSubmit={handleFeatureSubmit} className="modal-form-flex">
                  <div className="form-section-card">
                    <h4 className="form-section-title"><i className="fas fa-star"></i> Highlight Card Details</h4>
                    <div className="modal-form-grid">
                      <div className="form-field">
                        <label>Card Title</label>
                        <input type="text" required placeholder="e.g. Quick Tax Approvals" value={featureForm.title} onChange={e => setFeatureForm({ ...featureForm, title: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Icon (FontAwesome Class)</label>
                        <input type="text" required placeholder="e.g. fas fa-bolt" value={featureForm.icon} onChange={e => setFeatureForm({ ...featureForm, icon: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Display Sort Order</label>
                        <input type="number" required placeholder="e.g. 2" value={featureForm.order} onChange={e => setFeatureForm({ ...featureForm, order: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '30px' }}>
                        <input type="checkbox" id="featureActive" checked={featureForm.isActive} onChange={e => setFeatureForm({ ...featureForm, isActive: e.target.checked })} style={{ width: 'auto', cursor: 'pointer' }} />
                        <label htmlFor="featureActive" style={{ cursor: 'pointer' }}>Show on Homepage</label>
                      </div>
                      <div className="form-field full-width">
                        <label>Highlight Description</label>
                        <textarea rows={3} required placeholder="Brief detail about this feature..." value={featureForm.description} onChange={e => setFeatureForm({ ...featureForm, description: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer-btns full-width" style={{ marginTop: '10px' }}>
                    <button type="button" className="btn-action-outline" onClick={() => setModalType('')}>Cancel</button>
                    <button type="submit" className="btn-action-primary" disabled={actionLoading}>
                      {actionLoading ? 'Saving Feature...' : <><i className="fas fa-save"></i> Save Feature</>}
                    </button>
                  </div>
                </form>
              )}

              {/* TEAM MEMBER MODAL */}
              {modalType === 'team' && (
                <form onSubmit={handleTeamSubmit} className="modal-form-flex">
                  <div className="form-section-card" style={{ flex: '0.9', minWidth: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(26,62,114,0.02)', border: '1px dashed var(--border-color)', padding: '24px', borderRadius: '12px' }}>
                    <h4 className="form-section-title" style={{ width: '100%', marginBottom: '10px' }}><i className="fas fa-eye"></i> Live Profile Mockup</h4>
                    <div className="form-field-hint" style={{ marginBottom: '15px', fontSize: '0.8rem', textAlign: 'center' }}>This is exactly how this team member's card will render on the About Us page.</div>
                    
                    <div style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      width: '100%',
                      maxWidth: '240px',
                      overflow: 'hidden',
                      position: 'relative',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
                        zIndex: 2
                      }}></div>
                      
                      <div style={{
                        height: '160px',
                        background: 'linear-gradient(135deg, rgba(26,62,114,0.03) 0%, rgba(248,180,0,0.05) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        borderBottom: '1px solid rgba(0,0,0,0.04)'
                      }}>
                        <img
                          src={teamForm.img || '/assets/shreeChamundalogo.png'}
                          alt="Live Preview"
                          onError={(e) => { e.target.src = '/assets/shreeChamundalogo.png'; }}
                          style={{
                            width: '94px',
                            height: '94px',
                            borderRadius: '50%',
                            objectFit: 'contain',
                            background: '#ffffff',
                            border: '3px solid white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          }}
                        />
                      </div>
                      <div style={{ padding: '18px 16px' }}>
                        <h5 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0b1c34', margin: '0 0 4px', fontFamily: 'Inter, sans-serif' }}>{teamForm.name || 'Full Name'}</h5>
                        <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>{teamForm.role || 'Corporate Role'}</p>
                        <span style={{
                          display: 'inline-block',
                          background: 'rgba(26,62,114,0.05)',
                          color: 'var(--primary)',
                          fontSize: '0.72rem',
                          padding: '5px 12px',
                          borderRadius: '100px',
                          fontWeight: '700',
                          border: '1px solid rgba(26,62,114,0.08)'
                        }}>{teamForm.specialty || 'Specialty Domain'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-section-card" style={{ flex: '1.1' }}>
                    <h4 className="form-section-title"><i className="fas fa-user-tie"></i> Profile Specifications</h4>
                    <div className="modal-form-grid">
                      <div className="form-field">
                        <label>Full Name</label>
                        <input type="text" required placeholder="e.g. Pragnesh Adiyecha" value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Corporate Title / Role</label>
                        <input type="text" required placeholder="e.g. Founder & Consultant" value={teamForm.role} onChange={e => setTeamForm({ ...teamForm, role: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Specialty Domain</label>
                        <input type="text" required placeholder="e.g. GST & Corporate Tax Advisory" value={teamForm.specialty} onChange={e => setTeamForm({ ...teamForm, specialty: e.target.value })} />
                      </div>
                      <div className="form-field">
                        <label>Display Sort Order</label>
                        <input type="number" required placeholder="e.g. 1" value={teamForm.order} onChange={e => setTeamForm({ ...teamForm, order: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div className="form-field full-width">
                        <label>Profile Picture URL</label>
                        <input type="text" placeholder="e.g. /assets/shreeChamundalogo.png or custom image link" value={teamForm.img} onChange={e => setTeamForm({ ...teamForm, img: e.target.value })} />
                      </div>
                      <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                        <input type="checkbox" id="teamActive" checked={teamForm.isActive} onChange={e => setTeamForm({ ...teamForm, isActive: e.target.checked })} style={{ width: 'auto', cursor: 'pointer' }} />
                        <label htmlFor="teamActive" style={{ cursor: 'pointer', fontWeight: '600' }}>Show in Public Directory</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-footer-btns full-width" style={{ marginTop: '10px' }}>
                    <button type="button" className="btn-action-outline" onClick={() => setModalType('')}>Cancel</button>
                    <button type="submit" className="btn-action-primary" disabled={actionLoading}>
                      {actionLoading ? 'Saving Team Member...' : <><i className="fas fa-save"></i> Save Member Profile</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteConfirmOpen && (
        <div className="modal-overlay-container confirm-modal-overlay">
          <div className="modal-card-box confirm-modal-card">
            <div className="confirm-modal-body">
              <div className="confirm-icon-danger">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete <strong>{deleteItemTitle}</strong>?</p>
              <p className="confirm-warning-subtext">This action cannot be undone and will permanently remove this record from the database.</p>
              <div className="confirm-modal-buttons">
                <button type="button" className="btn-action-outline" onClick={() => setDeleteConfirmOpen(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-action-danger" 
                  onClick={() => {
                    if (deleteAction) deleteAction();
                    setDeleteConfirmOpen(false);
                  }}
                >
                  <i className="fas fa-trash-alt"></i> Delete Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE INVOICE MODAL */}
      {invoiceModalOpen && (
        <div className="modal-overlay-container">
          <div className="modal-card-box">
            <div className="modal-title-header">
              <h3><i className="fas fa-file-invoice-dollar"></i> Generate New Client Invoice</h3>
              <button className="btn-close-modal" onClick={() => setInvoiceModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateInvoiceSubmit} className="modal-form-flex" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0, gap: 0 }}>
              <div className="modal-body-scroll" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-field">
                  <label>Target Client Profile</label>
                  <select 
                    value={invoiceForm.client} 
                    onChange={e => setInvoiceForm({ ...invoiceForm, client: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  >
                    <option value="">-- Select Client --</option>
                    {users.filter(u => u.role === 'client').map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Filing Service</label>
                  <select 
                    value={invoiceForm.serviceName} 
                    onChange={e => setInvoiceForm({ ...invoiceForm, serviceName: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  >
                    <option value="GST Registration & Filing">GST Registration & Filing</option>
                    <option value="Income Tax Audits (ITR)">Income Tax Audits (ITR)</option>
                    <option value="Startup Registration">Startup Registration</option>
                    <option value="Bookkeeping Consultancy">Bookkeeping & Accounting</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Invoice Amount (INR)</label>
                  <input 
                    type="number" 
                    min="1"
                    placeholder="e.g. 2500" 
                    value={invoiceForm.amount} 
                    onChange={e => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                    required 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div className="form-field">
                  <label>Due Date</label>
                  <input 
                    type="date" 
                    value={invoiceForm.dueDate} 
                    onChange={e => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    required 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div className="form-field">
                  <label>Bill description / Scope of Work</label>
                  <textarea 
                    rows="3" 
                    placeholder="Describe scope, government fees, and audits details..." 
                    value={invoiceForm.description} 
                    onChange={e => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>
              </div>

              <div className="modal-card-footer" style={{ borderTop: '1px solid var(--border-light)', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f8fafc', borderRadius: '0 0 20px 20px' }}>
                <button type="button" className="btn-action-outline" onClick={() => setInvoiceModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-action-primary" disabled={invoiceLoading}>
                  {invoiceLoading ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : <><i className="fas fa-check-double"></i> Generate Invoice</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISCUSSION COMMENTS OVERLAY */}
      {activeInquiryComments && (
        <div className="modal-overlay-container">
          <div className="modal-card-box modal-comments-thread" style={{ maxWidth: '650px' }}>
            <div className="modal-title-header">
              <h3><i className="fas fa-comments"></i> discussion Thread: {activeInquiryComments.service || 'General inquiry'}</h3>
              <button className="btn-close-modal" onClick={() => setActiveInquiryComments(null)}>&times;</button>
            </div>
            <div className="modal-body-scroll comments-thread-body" style={{ padding: '20px' }}>
              <div className="inquiry-context-info" style={{ background: '#f5f7fa', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 6px' }}><strong>Client:</strong> {activeInquiryComments.name} ({activeInquiryComments.email})</p>
                <p style={{ margin: 0 }}><strong>Initial Inquiry Message:</strong> "{activeInquiryComments.message}"</p>
              </div>
              
              <div className="admin-comments-list-pane" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                {(activeInquiryComments.comments || []).map((comm, idx) => (
                  <div key={idx} className={`discussion-comment-item ${comm.senderRole}`} style={{ padding: '10px 14px', borderRadius: '8px', background: comm.senderRole === 'admin' ? '#e2ecf8' : '#f1f1f1', alignSelf: comm.senderRole === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div className="comment-meta" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>
                      <strong>{comm.senderName} ({comm.senderRole === 'admin' ? 'Auditor' : 'Client'})</strong>
                      <span>{new Date(comm.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="comment-text" style={{ margin: 0, fontSize: '0.92rem', color: '#333' }}>{comm.text}</p>
                  </div>
                ))}
                {(activeInquiryComments.comments || []).length === 0 && (
                  <p className="no-comments-prompt" style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem', padding: '16px 0' }}>No messages posted. Start discussion with client regarding query or documents.</p>
                )}
              </div>
            </div>
            
            <div className="modal-footer-chat-input" style={{ display: 'flex', borderTop: '1px solid var(--border-light)', padding: '16px' }}>
              <input 
                type="text" 
                value={newCommentText[activeInquiryComments._id] || ''} 
                onChange={(e) => {
                  const val = e.target.value;
                  setNewCommentText(prev => ({ ...prev, [activeInquiryComments._id]: val }));
                }} 
                placeholder="Type reply to client..." 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePostAdminComment(activeInquiryComments._id).then(() => {
                      const updated = inquiries.find(i => i._id === activeInquiryComments._id);
                      if (updated) setActiveInquiryComments(updated);
                    });
                  }
                }}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '6px 0 0 6px', border: '1px solid var(--border-light)', outline: 'none' }}
              />
              <button 
                className="btn-action-primary" 
                onClick={() => {
                  handlePostAdminComment(activeInquiryComments._id).then(() => {
                    const updated = inquiries.find(i => i._id === activeInquiryComments._id);
                    if (updated) setActiveInquiryComments(updated);
                  });
                }}
                style={{ borderRadius: '0 6px 6px 0', padding: '10px 20px' }}
              >
                <i className="fas fa-paper-plane"></i> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
