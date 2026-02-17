import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your stress patterns'
    },
    {
      icon: '📊',
      title: 'Real-Time Insights',
      description: 'Get instant feedback and personalized recommendations'
    },
    {
      icon: '🧘',
      title: 'Wellness Tools',
      description: 'Meditation, breathing exercises, and stress relief techniques'
    },
    {
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Monitor your mental wellness journey over time'
    }
  ];

  const statistics = [
    { value: '10K+', label: 'Active Users' },
    { value: '95%', label: 'Success Rate' },
    { value: '24/7', label: 'AI Support' },
    { value: '50+', label: 'Wellness Tools' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userId.trim()) {
      setError('Please enter your username');
      return;
    }

    if (userId.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onLogin(userId.trim());
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const quickLogin = (username) => {
    setUserId(username);
    setTimeout(() => {
      onLogin(username);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="login-page-professional">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="login-container-pro">
        {/* Left Side - Branding */}
        <div className="login-left">
          <div className="branding-section">
            <div className="logo-section">
              <div className="logo-icon">🧠</div>
              <h1 className="brand-name">StressSense AI</h1>
              <p className="brand-tagline">Your Intelligent Mental Wellness Companion</p>
            </div>

            <div className="feature-showcase">
              <h3>Why Choose StressSense?</h3>
              <div className="features-grid">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="feature-card-login"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="feature-icon">{feature.icon}</div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="statistics-section">
              {statistics.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right">
          <div className="login-card-pro">
            <div className="login-header-pro">
              <h2>Welcome Back</h2>
              <p>Sign in to continue your wellness journey</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form-pro">
              <div className="input-group-pro">
                <label htmlFor="userId">Username</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your username"
                    className={error ? 'input-error' : ''}
                    disabled={isLoading}
                  />
                </div>
                {error && <span className="error-message">{error}</span>}
              </div>

              <button 
                type="submit" 
                className="btn-login-pro"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="quick-login">
              <button 
                className="quick-btn student"
                onClick={() => quickLogin('student123')}
                disabled={isLoading}
              >
                <span className="quick-icon">🎓</span>
                <div>
                  <div className="quick-title">Student Account</div>
                  <div className="quick-subtitle">Quick demo access</div>
                </div>
              </button>
              <button 
                className="quick-btn guest"
                onClick={() => quickLogin('guest')}
                disabled={isLoading}
              >
                <span className="quick-icon">👋</span>
                <div>
                  <div className="quick-title">Guest Access</div>
                  <div className="quick-subtitle">Try without signup</div>
                </div>
              </button>
            </div>

            <div className="login-footer">
              <p>
                New to StressSense? 
                <button 
                  className="link-btn"
                  onClick={() => setShowFeatures(!showFeatures)}
                >
                  Learn More
                </button>
              </p>
            </div>

            {showFeatures && (
              <div className="feature-modal">
                <div className="modal-content">
                  <button 
                    className="modal-close"
                    onClick={() => setShowFeatures(false)}
                  >
                    ×
                  </button>
                  <h3>🌟 Premium Features</h3>
                  <ul className="features-list">
                    <li>✅ AI-powered stress detection</li>
                    <li>✅ Personalized wellness plans</li>
                    <li>✅ 24/7 AI chatbot support</li>
                    <li>✅ Guided meditation library</li>
                    <li>✅ Progress tracking & analytics</li>
                    <li>✅ Burnout prevention tools</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="trust-badges">
            <div className="badge">🔒 Secure & Private</div>
            <div className="badge">✓ HIPAA Compliant</div>
            <div className="badge">⚡ Real-time Analysis</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;