import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Services
export const getServices = async () => {
  const response = await API.get('/services');
  return response.data;
};

export const getServiceById = async (id) => {
  const response = await API.get(`/services/${id}`);
  return response.data;
};

// Features
export const getFeatures = async () => {
  const response = await API.get('/features');
  return response.data;
};

// Pricing
export const getPricing = async () => {
  const response = await API.get('/pricing');
  return response.data;
};

// Settings
export const getSettings = async () => {
  const response = await API.get('/settings');
  return response.data;
};

// Navigation Menu
export const getNavMenu = async () => {
  const response = await API.get('/navmenu');
  return response.data;
};

// Contact Form Submission
export const submitContact = async (formData) => {
  const response = await API.post('/contact', formData);
  return response.data;
};

// Blog Posts (All with search/category support)
export const getBlogs = async (params = {}) => {
  const response = await API.get('/blogs', { params });
  return response.data;
};

// Blog Post (Single by ID)
export const getBlogById = async (id) => {
  const response = await API.get(`/blogs/${id}`);
  return response.data;
};

// FAQs (All with search/category support)
export const getFAQs = async (params = {}) => {
  const response = await API.get('/faqs', { params });
  return response.data;
};

// ========== AUTH ==========
export const registerUser = async (data) => {
  const response = await API.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await API.post('/auth/login', data);
  return response.data;
};

export const sendOtp = async (data) => {
  const response = await API.post('/auth/otp/send', data);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await API.post('/auth/otp/verify', data);
  return response.data;
};

export const requestPasswordResetOtp = async (data) => {
  const response = await API.post('/auth/forgot-password/request', data);
  return response.data;
};

export const resetPasswordWithOtp = async (data) => {
  const response = await API.post('/auth/forgot-password/reset', data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post('/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const getAuthConfig = async () => {
  const response = await API.get('/auth/config');
  return response.data;
};


export const loginWithGoogle = async (code, redirectUri) => {
  const response = await API.post('/auth/google', { code, redirectUri });
  return response.data;
};



// ========== CLIENT PORTAL ==========
export const getMyDocuments = async () => {
  const response = await API.get('/portal/documents');
  return response.data;
};

export const uploadDocument = async (data) => {
  const response = await API.post('/portal/upload', data);
  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await API.delete(`/portal/documents/${id}`);
  return response.data;
};

export const updateDocument = async (id, data) => {
  const response = await API.put(`/portal/documents/${id}`, data);
  return response.data;
};

export const getMyInquiries = async () => {
  const response = await API.get('/portal/inquiries');
  return response.data;
};

// ========== ADMIN ==========
export const getAdminStats = async () => {
  const response = await API.get('/admin/stats');
  return response.data;
};

export const getAdminInquiries = async (params = {}) => {
  const response = await API.get('/admin/inquiries', { params });
  return response.data;
};

export const updateInquiryStatus = async (id, status) => {
  const response = await API.put(`/admin/inquiries/${id}`, { status });
  return response.data;
};

export const getAdminDocuments = async (params = {}) => {
  const response = await API.get('/admin/documents', { params });
  return response.data;
};

export const updateDocumentStatus = async (id, data) => {
  const response = await API.put(`/admin/documents/${id}`, data);
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await API.get('/admin/users');
  return response.data;
};

export const createBlogPost = async (data) => {
  const response = await API.post('/admin/blogs', data);
  return response.data;
};

export const updateBlogPost = async (id, data) => {
  const response = await API.put(`/admin/blogs/${id}`, data);
  return response.data;
};

export const deleteBlogPost = async (id) => {
  const response = await API.delete(`/admin/blogs/${id}`);
  return response.data;
};

// Inquiries deletion
export const deleteInquiry = async (id) => {
  const response = await API.delete(`/admin/inquiries/${id}`);
  return response.data;
};

// Document deletion
export const deleteAdminDocument = async (id) => {
  const response = await API.delete(`/admin/documents/${id}`);
  return response.data;
};

// Users management
export const updateUserRole = async (id, role) => {
  const response = await API.put(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/admin/users/${id}`);
  return response.data;
};

// Services CRUD
export const getAdminServices = async () => {
  const response = await API.get('/admin/services');
  return response.data;
};

export const createService = async (data) => {
  const response = await API.post('/admin/services', data);
  return response.data;
};

export const updateService = async (id, data) => {
  const response = await API.put(`/admin/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await API.delete(`/admin/services/${id}`);
  return response.data;
};

// FAQs CRUD
export const getAdminFAQs = async () => {
  const response = await API.get('/admin/faqs');
  return response.data;
};

export const createFAQ = async (data) => {
  const response = await API.post('/admin/faqs', data);
  return response.data;
};

export const updateFAQ = async (id, data) => {
  const response = await API.put(`/admin/faqs/${id}`, data);
  return response.data;
};

export const deleteFAQ = async (id) => {
  const response = await API.delete(`/admin/faqs/${id}`);
  return response.data;
};

// Pricing CRUD
export const getAdminPricing = async () => {
  const response = await API.get('/admin/pricing');
  return response.data;
};

export const createPricingPlan = async (data) => {
  const response = await API.post('/admin/pricing', data);
  return response.data;
};

export const updatePricingPlan = async (id, data) => {
  const response = await API.put(`/admin/pricing/${id}`, data);
  return response.data;
};

export const deletePricingPlan = async (id) => {
  const response = await API.delete(`/admin/pricing/${id}`);
  return response.data;
};

// Site Settings CRUD
export const getAdminSettings = async () => {
  const response = await API.get('/admin/settings');
  return response.data;
};

export const updateAdminSettings = async (data) => {
  const response = await API.put('/admin/settings', data);
  return response.data;
};

// Admin NavMenu CRUD
export const getAdminNavMenu = async () => {
  const response = await API.get('/navmenu/all');
  return response.data;
};

export const createNavMenuItem = async (data) => {
  const response = await API.post('/navmenu', data);
  return response.data;
};

export const updateNavMenuItem = async (id, data) => {
  const response = await API.put(`/navmenu/${id}`, data);
  return response.data;
};

export const deleteNavMenuItem = async (id) => {
  const response = await API.delete(`/navmenu/${id}`);
  return response.data;
};

// Admin Features CRUD
export const getAdminFeatures = async () => {
  const response = await API.get('/features/all');
  return response.data;
};

export const createFeature = async (data) => {
  const response = await API.post('/features', data);
  return response.data;
};

export const updateFeature = async (id, data) => {
  const response = await API.put(`/features/${id}`, data);
  return response.data;
};

export const deleteFeature = async (id) => {
  const response = await API.delete(`/features/${id}`);
  return response.data;
};

// Team Members CRUD
export const getTeamMembers = async () => {
  const response = await API.get('/team');
  return response.data;
};

export const getAdminTeamMembers = async () => {
  const response = await API.get('/team/admin');
  return response.data;
};

export const createTeamMember = async (data) => {
  const response = await API.post('/team', data);
  return response.data;
};

export const updateTeamMember = async (id, data) => {
  const response = await API.put(`/team/${id}`, data);
  return response.data;
};

export const deleteTeamMember = async (id) => {
  const response = await API.delete(`/team/${id}`);
  return response.data;
};

// ========== CONSULTATIONS ==========
export const bookConsultation = async (data) => {
  const response = await API.post('/consultations/book', data);
  return response.data;
};

export const getClientConsultations = async () => {
  const response = await API.get('/consultations/client');
  return response.data;
};

export const getAdminConsultations = async () => {
  const response = await API.get('/consultations/admin');
  return response.data;
};

export const updateConsultation = async (id, data) => {
  const response = await API.put(`/consultations/admin/${id}`, data);
  return response.data;
};

// ========== INVOICES & BILLING ==========
export const getClientInvoices = async () => {
  const response = await API.get('/portal/invoices');
  return response.data;
};

export const payInvoice = async (id) => {
  const response = await API.put(`/portal/invoices/${id}/pay`);
  return response.data;
};

export const createInvoice = async (data) => {
  const response = await API.post('/admin/invoices', data);
  return response.data;
};

export const getAdminInvoices = async () => {
  const response = await API.get('/admin/invoices');
  return response.data;
};

export const deleteInvoice = async (id) => {
  const response = await API.delete(`/admin/invoices/${id}`);
  return response.data;
};

// ========== DISCUSSION THREAD COMMENTS ==========
export const postClientComment = async (id, text) => {
  const response = await API.post(`/portal/inquiries/${id}/comment`, { text });
  return response.data;
};

export const postAdminComment = async (id, text) => {
  const response = await API.post(`/admin/inquiries/${id}/comment`, { text });
  return response.data;
};

export default API;
