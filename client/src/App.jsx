import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import NotificationConsent from './components/NotificationConsent';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import FAQ from './pages/FAQ';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import WhatsAppWidget from './components/WhatsAppWidget';
import './App.css';

// Dynamically split heavy pages to optimize initial bundle load
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Portal = lazy(() => import('./pages/Portal'));
const Admin = lazy(() => import('./pages/Admin'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const NotFound = lazy(() => import('./pages/NotFound'));


function App() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Connect to backend Socket.io server
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

    socket.on('connect', () => {
      console.log('🔌 Connected to Socket.io backend server');
      const token = localStorage.getItem('authToken');
      if (token) {
        socket.emit('authenticate', token);
      }
    });

    const addToast = (message) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message }]);
      
      // Auto-remove toast after 4.5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4500);
    };

    socket.on('inquiry_received', (data) => {
      addToast(data.message);
    });

    socket.on('inquiry_updated', (data) => {
      addToast(data.message);
    });

    socket.on('inquiry_status_changed', (inq) => {
      addToast(`Filing status updated to "${inq.status}" for ${inq.service || 'General Inquiry'}`);
    });

    socket.on('inquiry_comment_added', () => {
      addToast(`New comment reply posted on inquiry discussion thread.`);
    });

    socket.on('invoice_created', (inv) => {
      addToast(`A new invoice (${inv.invoiceNumber}) of ₹${inv.amount} has been generated.`);
    });

    socket.on('consultation_booked', (booking) => {
      addToast(`New consultation session requested for ${booking.serviceType}.`);
    });

    socket.on('consultation_status_changed', (booking) => {
      addToast(`Appointment slot status updated to "${booking.status}" on ${new Date(booking.date).toLocaleDateString('en-IN')}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const location = useLocation();
  const isFullPageLayout = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/portal') ||
    location.pathname.startsWith('/auth/') ||
    location.pathname === '/login' ||
    location.pathname === '/register';

  return (
    <div className="app">
      <ScrollToTop />
      {!isFullPageLayout && <Navbar />}
      
      {/* Real-time Toast Alerts */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast-alert">
            <div className="toast-icon">
              <i className="fas fa-bell"></i>
            </div>
            <div className="toast-text">{toast.message}</div>
          </div>
        ))}
      </div>

      <main className={isFullPageLayout ? "" : "main-content"}>
        <Suspense fallback={
          <div className="container py-5 text-center" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="skeleton skeleton-title" style={{ width: '200px', height: '24px' }}></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/portal" element={<ProtectedRoute><Portal /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
            <Route path="/auth/google/callback" element={<OAuthCallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      
      {!isFullPageLayout && <WhatsAppWidget />}
      {!isFullPageLayout && <NotificationConsent />}
      {!isFullPageLayout && <Footer />}
    </div>
  );
}

const RootApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default RootApp;
