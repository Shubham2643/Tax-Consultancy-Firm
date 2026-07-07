import { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationConsent.css';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

// Utility helper to convert base64 VAPID public key to Uint8Array
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const NotificationConsent = () => {
  const [permission, setPermission] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.log('⚠️ Browser does not support push notifications');
      return;
    }

    setPermission(Notification.permission);
    
    // Only show consent bar if permission is 'default' (not yet allowed or denied)
    if (Notification.permission === 'default') {
      // Small delay to let the page load smoothly
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      setIsSubmitting(true);
      const reqPermission = await Notification.requestPermission();
      setPermission(reqPermission);

      if (reqPermission !== 'granted') {
        console.log('⚠️ Push permission denied by user');
        setIsVisible(false);
        setIsSubmitting(false);
        return;
      }

      // Register /sw.js service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('⚙️ Service Worker registered for push notifications');

      // Fetch VAPID Public Key from backend API
      const keyResponse = await axios.get(`${API_BASE_URL}/notifications/vapid-key`);
      const vapidPublicKey = keyResponse.data.publicKey;

      if (!vapidPublicKey) {
        throw new Error('Could not fetch VAPID key');
      }

      // Convert VAPID key to format browser requires
      const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

      // Subscribe user
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });

      // Save subscription payload in backend MongoDB database
      await axios.post(`${API_BASE_URL}/notifications/subscribe`, subscription);
      console.log('✅ Subscription saved successfully in database');

      setIsVisible(false);
    } catch (error) {
      console.error('❌ Failed to subscribe to push notifications:', error);
    } finally {
      setIsSubmitting(false);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="push-consent-bar card-animate">
      <div className="push-consent-inner">
        <div className="push-consent-content">
          <div className="push-consent-icon-box">
            <i className="fas fa-bell"></i>
          </div>
          <div className="push-consent-text">
            <h4>Enable Live Notifications</h4>
            <p>Get instant desktop alerts for tax deadlines, return filings, and status updates.</p>
          </div>
        </div>
        <div className="push-consent-actions">
          <button className="push-btn-secondary" onClick={handleDismiss} disabled={isSubmitting}>
            Later
          </button>
          <button className="push-btn-primary" onClick={handleSubscribe} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Enabling...
              </>
            ) : (
              <>
                Allow <i className="fas fa-check"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationConsent;
