import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginWithGoogle } from '../api';
import useSEO from '../hooks/useSEO';
import './OAuthCallback.css';

const OAuthCallback = () => {
  useSEO({ title: 'Authenticating...', description: 'Please wait while we secure your connection.' });
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const code = new URLSearchParams(location.search).get('code');

    if (!code) {
      setStatus('error');
      setErrorMsg('Authorization code was not returned by Google.');
      return;
    }

    const authenticate = async () => {
      try {
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        const res = await loginWithGoogle(code, redirectUri);

        if (res.success) {
          login(res.data.user, res.data.token);
          setStatus('success');
          setTimeout(() => {
            navigate('/portal');
          }, 1500);
        } else {
          throw new Error('Authentication failed.');
        }
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.response?.data?.message || 'Failed to log in with your Google account.');
      }
    };

    authenticate();
  }, [location, navigate, login]);

  return (
    <div className="oauth-callback-page">
      <div className="oauth-callback-card">
        {status === 'loading' && (
          <div className="oauth-status loading">
            <div className="oauth-spinner"></div>
            <h2>Connecting Account...</h2>
            <p>Please wait while we verify your credentials and secure your session.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="oauth-status success">
            <div className="oauth-success-icon"><i className="fas fa-check"></i></div>
            <h2>Sign In Successful!</h2>
            <p>Welcome back! Redirecting you to your client portal dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="oauth-status error">
            <div className="oauth-error-icon"><i className="fas fa-exclamation-triangle"></i></div>
            <h2>Authentication Failed</h2>
            <p className="error-text">{errorMsg}</p>
            <button className="auth-btn" onClick={() => navigate('/login')}>
              <i className="fas fa-arrow-left"></i> Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
