import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, getAuthConfig, requestPasswordResetOtp, resetPasswordWithOtp, verifyOtp } from '../api';
import { useAuth } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';
import './Login.css';

const Login = () => {
  useSEO({ title: 'Secure Workspace Login', description: 'Log in to your Shree Chamunda Associates secure tax advisory portal.' });
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Auth view states: 'login' | 'forgot_request' | 'otp_verify' | 'reset_password'
  const [viewMode, setViewMode] = useState('login');
  
  // Form states
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [resetTarget, setResetTarget] = useState('');
  const [otpCodeArray, setOtpCodeArray] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Feedback states
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthConfig, setOauthConfig] = useState({ googleClientId: '', microsoftClientId: '' });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Too Weak', color: '#ef4444' });

  // Refs for OTP focus shifting
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    getAuthConfig().then((res) => {
      if (res.success) setOauthConfig(res.data);
    }).catch(() => {});
  }, []);

  // Monitor password strength live
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({ score: 0, text: 'Too Weak', color: '#ef4444' });
      return;
    }
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 10) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    let text = 'Weak';
    let color = '#ef4444';
    if (score >= 4) {
      text = 'Strong';
      color = '#10b981';
    } else if (score >= 2) {
      text = 'Moderate';
      color = '#f59e0b';
    }
    setPasswordStrength({ score, text, color });
  }, [newPassword]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setLoading(true);
    try {
      const res = await loginUser(formData);
      if (res.success) {
        login(res.data.user, res.data.token);
        navigate(res.data.user.role === 'admin' ? '/admin' : '/portal');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Request for Forgot Password
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    if (!resetTarget.trim()) {
      setError('Please provide your email address or phone number');
      return;
    }
    setLoading(true);
    try {
      const res = await requestPasswordResetOtp({ target: resetTarget.trim() });
      if (res.success) {
        setInfoMessage('Verification code successfully dispatched!');
        setViewMode('otp_verify');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification request failed. No user matches.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Shifting inputs
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpCodeArray];
    newOtp[index] = value.substring(value.length - 1);
    setOtpCodeArray(newOtp);

    // Shift focus right
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Shift focus left on backspace
    if (e.key === 'Backspace' && !otpCodeArray[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  // Verify OTP Code
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    const code = otpCodeArray.join('');
    if (code.length !== 6) {
      setError('Please fill in the 6-digit OTP code');
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp({ target: resetTarget, otpCode: code });
      if (res.success) {
        setInfoMessage('Verification passcode approved. Create a new password.');
        setViewMode('reset_password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification passcode invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  // Save new password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    if (newPassword !== confirmPassword) {
      setError('Confirm passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const code = otpCodeArray.join('');
      const res = await resetPasswordWithOtp({
        target: resetTarget,
        otpCode: code,
        newPassword,
      });
      if (res.success) {
        setInfoMessage('Password updated successfully! Sign in using new details.');
        setViewMode('login');
        setFormData({ email: resetTarget.includes('@') ? resetTarget : '', password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed.');
    } finally {
      setLoading(false);
    }
  };

  const isDemoKey = (key) => !key || key.startsWith('your_');

  const handleGoogleLogin = () => {
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    if (isDemoKey(oauthConfig.googleClientId)) {
      window.location.href = `/auth/google/callback?code=demo_mode`;
    } else {
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${oauthConfig.googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&prompt=select_account`;
    }
  };

  return (
    <div className="split-auth-container">
      {/* LEFT SPLIT PANEL: BRANDING / GRAPHICS */}
      <div className="split-branding-panel">
        <div className="branding-mesh-overlay"></div>
        <div className="branding-content">
          <Link to="/" className="branding-logo-link">
            <img src="/assets/logo_new.jpg?v=3" alt="Shree Chamunda Logo" className="branding-logo" />
            <div className="branding-logo-text">
              <h2>SHREE CHAMUNDA</h2>
              <span>ASSOCIATES</span>
            </div>
          </Link>
          
          <div className="branding-showcase">
            <h1>Expert Tax Advisory & Financial Solutions</h1>
            <p>Access your secure compliance documents, track file submissions, and align with certified auditors in one place.</p>
          </div>

          <div className="branding-footer-stats">
            <div className="stat-capsule">
              <strong>99.8%</strong>
              <span>Accuracy</span>
            </div>
            <div className="stat-capsule">
              <strong>15+ Yrs</strong>
              <span>Experience</span>
            </div>
            <div className="stat-capsule text-amber">
              <strong>Secured</strong>
              <span>Vaults</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SPLIT PANEL: DYNAMIC AUTH FORMS */}
      <div className="split-forms-panel">
        <div className="auth-card-wrapper">
          
          {/* Back button for Forgot password steps */}
          {viewMode !== 'login' && (
            <button className="auth-back-link-btn" onClick={() => setViewMode(viewMode === 'reset_password' ? 'otp_verify' : 'login')}>
              <i className="fas fa-arrow-left"></i> Back to Previous
            </button>
          )}

          {/* MESSAGES */}
          {error && (
            <div className="auth-validation-alert error">
              <i className="fas fa-exclamation-triangle"></i> <span>{error}</span>
            </div>
          )}
          {infoMessage && (
            <div className="auth-validation-alert success">
              <i className="fas fa-check-circle"></i> <span>{infoMessage}</span>
            </div>
          )}

          {/* VIEW: LOGIN FORM */}
          {viewMode === 'login' && (
            <div className="auth-form-card animated fadeIn">
              <div className="auth-card-title">
                <h2>Secure Advisor Login</h2>
                <p>Welcome back! Sign in to audit your files.</p>
              </div>

              {/* Social Login Buttons */}
              <div className="social-login-grid single-provider">
                <button type="button" className="social-grid-btn google" onClick={handleGoogleLogin}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </div>

              <div className="auth-form-separator">
                <span>or log in using email credentials</span>
              </div>

              <form onSubmit={handleLoginSubmit} className="split-form-element">
                <div className="auth-form-group">
                  <label><i className="fas fa-envelope"></i> Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="name@company.com" />
                </div>
                
                <div className="auth-form-group">
                  <div className="label-with-action">
                    <label><i className="fas fa-lock"></i> Account Password</label>
                    <button type="button" className="inline-action-link" onClick={() => { setResetTarget(formData.email); setViewMode('forgot_request'); }}>Forgot Password?</button>
                  </div>
                  <input type="password" name="password" required value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
                </div>

                <button type="submit" className="secure-submit-auth-btn" disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Securing session...</> : 'Login Securely'}
                </button>
              </form>

              <div className="auth-form-footer">
                <p>New workspace? <Link to="/register">Create Client Account</Link></p>
              </div>
            </div>
          )}

          {/* VIEW: REQUEST FORGOT PASSWORD OTP */}
          {viewMode === 'forgot_request' && (
            <div className="auth-form-card animated fadeIn">
              <div className="auth-card-title">
                <h2>Account Verification</h2>
                <p>Input email or phone to receive a 6-digit OTP code.</p>
              </div>

              <form onSubmit={handleForgotRequest} className="split-form-element">
                <div className="auth-form-group">
                  <label><i className="fas fa-user-shield"></i> Registered Email or Phone</label>
                  <input
                    type="text"
                    value={resetTarget}
                    onChange={(e) => setResetTarget(e.target.value)}
                    placeholder="e.g. name@email.com or +919876543210"
                    required
                  />
                  <small className="help-text">We will verify this details with user database logs.</small>
                </div>

                <button type="submit" className="secure-submit-auth-btn" disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Dispatched code...</> : 'Send Verification OTP'}
                </button>
              </form>
            </div>
          )}

          {/* VIEW: OTP VERIFICATION CODE INPUTS */}
          {viewMode === 'otp_verify' && (
            <div className="auth-form-card animated fadeIn">
              <div className="auth-card-title">
                <h2>Enter 6-Digit Passcode</h2>
                <p>A verification OTP was sent to <strong>{resetTarget}</strong>. Enter code below.</p>
              </div>

              <form onSubmit={handleOtpSubmit} className="split-form-element">
                <div className="otp-digit-grid">
                  {otpCodeArray.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      maxLength="1"
                      className="otp-box-input"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <button type="submit" className="secure-submit-auth-btn" disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Validating...</> : 'Confirm Verification Code'}
                </button>
              </form>

              <div className="otp-resend-prompt">
                <p>Didn't receive passcode? <button type="button" className="inline-resend-btn" onClick={handleForgotRequest}>Resend OTP</button></p>
              </div>
            </div>
          )}

          {/* VIEW: RESET NEW PASSWORD */}
          {viewMode === 'reset_password' && (
            <div className="auth-form-card animated fadeIn">
              <div className="auth-card-title">
                <h2>Reset Password</h2>
                <p>Create a secure password containing numbers and uppercase letters.</p>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="split-form-element">
                <div className="auth-form-group">
                  <label><i className="fas fa-key"></i> New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create secure password"
                    required
                  />
                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="password-strength-bar-wrapper">
                      <div className="strength-bar-track">
                        <div
                          className="strength-bar-fill"
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            backgroundColor: passwordStrength.color,
                          }}
                        ></div>
                      </div>
                      <span className="strength-bar-text" style={{ color: passwordStrength.color }}>
                        Security: {passwordStrength.text}
                      </span>
                    </div>
                  )}
                </div>

                <div className="auth-form-group">
                  <label><i className="fas fa-check-double"></i> Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Verify secure password"
                    required
                  />
                </div>

                <button type="submit" className="secure-submit-auth-btn" disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving Password...</> : 'Update Account Password'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
