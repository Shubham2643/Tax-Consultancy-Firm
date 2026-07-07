import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, getAuthConfig, sendOtp } from '../api';
import { useAuth } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';
import './Login.css';

const Register = () => {
  useSEO({ title: 'Workspace Registration', description: 'Create your Shree Chamunda Associates secure tax workspace profile.' });
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Registration states: 'form' | 'otp_verify'
  const [viewMode, setViewMode] = useState('form');

  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [otpCodeArray, setOtpCodeArray] = useState(['', '', '', '', '', '']);
  
  // Visibility toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Feedback states
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthConfig, setOauthConfig] = useState({ googleClientId: '', microsoftClientId: '' });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Too Weak', color: '#ef4444' });

  // Refs for OTP input boxes focus shifting
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    getAuthConfig().then((res) => {
      if (res.success) setOauthConfig(res.data);
    }).catch(() => {});
  }, []);

  // Monitor password strength live
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength({ score: 0, text: 'Too Weak', color: '#ef4444' });
      return;
    }
    let score = 0;
    if (formData.password.length >= 6) score += 1;
    if (formData.password.length >= 10) score += 1;
    if (/[A-Z]/.test(formData.password)) score += 1;
    if (/[0-9]/.test(formData.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) score += 1;

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
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Registration Form details & request Verification OTP code
  const handleRegisterFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Send verification code to the client's email address
      const res = await sendOtp({ target: formData.email.trim() });
      if (res.success) {
        setInfoMessage('Verification passcode dispatched to your email address!');
        setViewMode('otp_verify');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch registration verification code.');
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

  // Verify OTP and complete registration
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
      const res = await registerUser({
        name: formData.name,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        otpCode: code,
      });
      if (res.success) {
        login(res.data.user, res.data.token);
        navigate('/portal');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification passcode invalid or expired.');
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
          
          {/* Back button */}
          {viewMode !== 'form' && (
            <button className="auth-back-link-btn" onClick={() => setViewMode('form')}>
              <i className="fas fa-arrow-left"></i> Edit Details
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

          {/* VIEW: REGISTER REGISTRATION FORM */}
          {viewMode === 'form' && (
            <div className="auth-form-card animated fadeIn">
              <div className="auth-card-title">
                <h2>Create Secure Account</h2>
                <p>Register to manage tax services and upload files.</p>
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
                  <span>Google</span>
                </button>
              </div>

              <div className="auth-form-separator">
                <span>or register with email details</span>
              </div>

              <form onSubmit={handleRegisterFormSubmit} className="split-form-element">
                <div className="auth-form-group">
                  <label><i className="fas fa-user"></i> Full Name</label>
                  <input type="text" name="name" required minLength={2} value={formData.name} onChange={handleChange} placeholder="John Doe" />
                </div>

                <div className="auth-form-group">
                  <label><i className="fas fa-envelope"></i> Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                </div>

                <div className="auth-form-group">
                  <label><i className="fas fa-phone"></i> Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                </div>

                <div className="auth-form-group">
                  <label><i className="fas fa-lock"></i> Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      required 
                      minLength={6} 
                      value={formData.password} 
                      onChange={handleChange} 
                      placeholder="Min. 6 characters" 
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn" 
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
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
                  <label><i className="fas fa-check-double"></i> Confirm Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword" 
                      required 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      placeholder="Re-enter password" 
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <button type="submit" className="secure-submit-auth-btn" disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Dispatched code...</> : 'Send Verification OTP'}
                </button>
              </form>

              <div className="auth-form-footer">
                <p>Already have an account? <Link to="/login">Sign In</Link></p>
              </div>
            </div>
          )}

          {/* VIEW: REGISTRATION OTP VERIFICATION */}
          {viewMode === 'otp_verify' && (
            <div className="auth-form-card animated fadeIn">
              <div className="auth-card-title">
                <h2>Email Verification Code</h2>
                <p>A 6-digit verification code has been dispatched to <strong>{formData.email}</strong>.</p>
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
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Registering Account...</> : 'Confirm Code & Register'}
                </button>
              </form>

              <div className="otp-resend-prompt">
                <p>Didn't receive code? <button type="button" className="inline-resend-btn" onClick={handleRegisterFormSubmit}>Resend OTP</button></p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Register;
