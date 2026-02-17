import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import TrendChart from './TrendChart';
import '../styles/Dashboard.css';

function Dashboard({ userId }) {
  const navigate = useNavigate();
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [quickStressLevel, setQuickStressLevel] = useState(null);
  const [showQuickTest, setShowQuickTest] = useState(false);
  const [todayMood, setTodayMood] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [trendData, historyData] = await Promise.all([
          apiService.getTrend(userId),
          apiService.getHistory(userId),
        ]);
        setTrend(trendData);
        setHistory(historyData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleQuickStressTest = (level) => {
    setQuickStressLevel(level);
    setTimeout(() => {
      setShowQuickTest(false);
      setQuickStressLevel(null);
    }, 3000);
  };

  const handleMoodSelection = (mood) => {
    setTodayMood(mood);
  };

  const moods = [
    { emoji: '😊', label: 'Great', color: '#4caf50' },
    { emoji: '😌', label: 'Good', color: '#8bc34a' },
    { emoji: '😐', label: 'Okay', color: '#ffc107' },
    { emoji: '😟', label: 'Not Good', color: '#ff9800' },
    { emoji: '😢', label: 'Bad', color: '#f44336' },
  ];

  return (
    <div className="dashboard-container modern-dashboard">
      <div className="container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <div className="welcome-text">
            <h2>Welcome back, {userId}! 👋</h2>
            <p>How are you feeling today?</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-value">7</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{history.length || 0}</span>
              <span className="stat-label">Assessments</span>
            </div>
          </div>
        </div>

        {/* Daily Mood Tracker */}
        <div className="mood-tracker-card">
          <div className="mood-header">
            <h3>📅 How's Your Day?</h3>
            <p className="mood-subtitle">Track your daily mood</p>
          </div>
          
          <div className="mood-selector">
            {moods.map((mood, index) => (
              <div
                key={index}
                className={`mood-option ${todayMood === mood.label ? 'selected' : ''}`}
                onClick={() => handleMoodSelection(mood.label)}
              >
                <div className="mood-emoji-circle" style={{ 
                  background: todayMood === mood.label ? mood.color : 'transparent',
                  borderColor: mood.color 
                }}>
                  <span className="mood-emoji">{mood.emoji}</span>
                </div>
                <span className="mood-label">{mood.label}</span>
              </div>
            ))}
          </div>
          
          {todayMood && (
            <div className="mood-feedback">
              <span className="feedback-icon">✅</span>
              Mood logged for {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          )}
        </div>

        {/* Quick Stress Test */}
        <div className="quick-stress-card">
          <h3>⚡ 5-Second Stress Check</h3>
          <p className="quick-test-subtitle">Rate your current stress level</p>
          
          {!showQuickTest ? (
            <button
              className="btn-primary btn-large"
              onClick={() => setShowQuickTest(true)}
            >
              Start Quick Test
            </button>
          ) : (
            <div className="stress-buttons">
              <button
                className="stress-btn low"
                onClick={() => handleQuickStressTest('low')}
              >
                <span className="stress-emoji">😊</span>
                <span>Low</span>
              </button>
              <button
                className="stress-btn medium"
                onClick={() => handleQuickStressTest('medium')}
              >
                <span className="stress-emoji">😐</span>
                <span>Medium</span>
              </button>
              <button
                className="stress-btn high"
                onClick={() => handleQuickStressTest('high')}
              >
                <span className="stress-emoji">😰</span>
                <span>High</span>
              </button>
            </div>
          )}
          
          {quickStressLevel && (
            <div className="quick-result">
              <p>✅ Logged: {quickStressLevel.toUpperCase()} stress</p>
              <p className="quick-tip">
                {quickStressLevel === 'high' ? '💡 Take a 5-min break!' : 
                 quickStressLevel === 'medium' ? '💡 Stay mindful today' : 
                 '💡 Keep up the good work!'}
              </p>
            </div>
          )}
        </div>

        {/* Main Action Cards */}
        <div className="main-actions">
          <h3>🎯 Wellness Tools</h3>
          <div className="quick-actions">
            <div
              className="action-card gradient-1"
              onClick={() => navigate('/text-analysis')}
            >
              <div className="action-icon">💬</div>
              <h3>AI Stress Analysis</h3>
              <p>Share your thoughts and get instant insights</p>
              <div className="action-badge">AI Powered</div>
            </div>

            <div
              className="action-card gradient-2"
              onClick={() => navigate('/questionnaire')}
            >
              <div className="action-icon">📋</div>
              <h3>Burnout Assessment</h3>
              <p>6-question comprehensive evaluation</p>
              <div className="action-badge">2 min</div>
            </div>

            <div
              className="action-card gradient-3"
              onClick={() => navigate('/breathing')}
            >
              <div className="action-icon">🧘</div>
              <h3>Breathing Exercise</h3>
              <p>Guided 4-7-8 relaxation technique</p>
              <div className="action-badge">Instant Relief</div>
            </div>
          </div>
        </div>

        {/* New Innovative Features */}
        <div className="innovative-features">
          <h3>🚀 Advanced Features</h3>
          <div className="feature-grid">
            <div
              className="feature-card"
              onClick={() => navigate('/ai-chat')}
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <div className="feature-icon">🤖</div>
              <h4>AI Wellness Chat</h4>
              <p>Talk to our AI companion anytime</p>
            </div>

            <div
              className="feature-card"
              onClick={() => navigate('/heatmap')}
              style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
            >
              <div className="feature-icon">🔥</div>
              <h4>Stress Heatmap</h4>
              <p>Map your body stress zones</p>
            </div>

            <div
              className="feature-card"
              onClick={() => navigate('/meditation')}
              style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
            >
              <div className="feature-icon">🎵</div>
              <h4>Meditation Audio</h4>
              <p>Guided relaxation sessions</p>
            </div>

            <div
              className="feature-card"
              onClick={() => navigate('/weekly-report')}
              style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}
            >
              <div className="feature-icon">📊</div>
              <h4>Weekly Report</h4>
              <p>Track your progress over time</p>
            </div>
          </div>
        </div>

        {/* Wellness Tips */}
        <div className="tips-card">
          <h3>💡 Today's Wellness Tip</h3>
          <div className="tip-content">
            <div className="tip-icon">🌟</div>
            <div>
              <p className="tip-text">
                <strong>Take Mini-Breaks:</strong> Every 25 minutes, take a 5-minute break to stretch, 
                walk, or simply look away from your screen. This helps prevent mental fatigue.
              </p>
              <button className="btn-secondary btn-sm" onClick={() => navigate('/breathing')}>
                Try Breathing Exercise
              </button>
            </div>
          </div>
        </div>

        {/* Trend Section */}
        {loading ? (
          <div className="loading">Loading your data</div>
        ) : trend && trend.trend !== 'no_data' ? (
          <div className="trend-section">
            <h3>📈 Your Progress</h3>
            <div className="trend-card">
              <div className={`trend-indicator ${trend.trend}`}>
                {trend.trend === 'increasing' && '📈 Rising'}
                {trend.trend === 'decreasing' && '📉 Improving'}
                {trend.trend === 'stable' && '📊 Stable'}
              </div>
              <p className="trend-insight">{trend.insight}</p>
              {trend.recommendation && (
                <p className="trend-recommendation">
                  💡 {trend.recommendation}
                </p>
              )}
            </div>

            {trend.history && trend.history.length > 0 && (
              <TrendChart data={trend.history} />
            )}
          </div>
        ) : (
          <div className="no-data-card">
            <div className="no-data-icon">📊</div>
            <h3>Start Your Wellness Journey</h3>
            <p>Complete your first assessment to track your progress over time</p>
            <button
              onClick={() => navigate('/text-analysis')}
              className="btn-primary btn-large"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Recent History */}
        {history.length > 0 && (
          <div className="history-section">
            <h3>📜 Recent Assessments</h3>
            <div className="history-list">
              {history.slice(0, 5).map((entry, index) => (
                <div key={index} className="history-item">
                  <div className="history-icon">
                    {entry.stressLevel === 'High Stress' ? '😰' :
                     entry.stressLevel === 'Medium Stress' ? '😐' : '😊'}
                  </div>
                  <div className="history-info">
                    <div className="history-date">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                    <div className={`history-level ${entry.stressLevel?.replace(' ', '-')}`}>
                      {entry.stressLevel}
                    </div>
                  </div>
                  <div className="history-confidence">
                    {entry.confidence}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;