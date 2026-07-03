import { useState, useEffect } from 'react';
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
import ServiceDetail from './pages/ServiceDetail';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Login from './pages/Login';
import Register from './pages/Register';
import Portal from './pages/Portal';
import Admin from './pages/Admin';
import OAuthCallback from './pages/OAuthCallback';
import { AuthProvider } from './context/AuthContext';
import './App.css';


function App() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Connect to backend Socket.io server
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('🔌 Connected to Socket.io backend server');
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

    socket.on('inquiry_comment_added', (data) => {
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faqs" element={<FAQ />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth/google/callback" element={<OAuthCallback />} />
        </Routes>
      </main>
      
      {!isFullPageLayout && <NotificationConsent />}
      {!isFullPageLayout && <Footer />}
    </div>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
