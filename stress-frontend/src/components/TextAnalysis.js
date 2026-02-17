import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import '../styles/TextAnalysis.css';

function TextAnalysis({ userId, onResult }) {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Voice input functionality
  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(text + ' ' + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setError('Voice input failed. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } else {
      setError('Voice input not supported in this browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (text.trim().length < 10) {
      setError('Please write at least 10 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await apiService.analyzeText(userId, text);
      onResult(result);
      navigate('/result');
    } catch (err) {
      setError('Failed to analyze. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickTests = [
    {
      emoji: '😰',
      label: 'High Stress',
      text: 'I have multiple deadlines tomorrow, feeling extremely overwhelmed and anxious, can\'t sleep',
    },
    {
      emoji: '😐',
      label: 'Medium Stress',
      text: 'Feeling a bit tired and pressured with work, but managing',
    },
    {
      emoji: '😊',
      label: 'Low Stress',
      text: 'Feeling relaxed and peaceful today, well rested and motivated',
    },
  ];

  return (
    <div className="text-analysis-container">
      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back
        </button>

        <div className="analysis-card modern-card">
          <div className="card-header">
            <div className="header-icon">💬</div>
            <div>
              <h2>How are you feeling today?</h2>
              <p className="subtitle">
                Share your thoughts. Our AI will analyze your emotional state in real-time.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="analysis-form">
            <div className="input-group">
              <div className="textarea-wrapper">
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setError('');
                  }}
                  placeholder="Type freely about your day, feelings, or what's on your mind..."
                  rows="6"
                  className={`modern-textarea ${error ? 'input-error' : ''}`}
                />
                
                <div className="textarea-footer">
                  <span className={`char-count ${text.length >= 10 ? 'valid' : 'invalid'}`}>
                    {text.length} {text.length >= 10 ? '✓' : '/ 10 min'}
                  </span>
                  
                  <button
                    type="button"
                    onClick={startVoiceInput}
                    className={`voice-btn ${isListening ? 'listening' : ''}`}
                    title="Voice input"
                  >
                    {isListening ? '🎤 Listening...' : '🎤 Speak'}
                  </button>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
            </div>

            <button
              type="submit"
              className="btn-primary btn-large"
              disabled={loading || text.length < 10}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="btn-icon">🧠</span>
                  Analyze My Stress
                </>
              )}
            </button>
          </form>

          <div className="quick-tests">
            <h3>
              <span className="icon">⚡</span>
              Quick Tests
            </h3>
            <div className="quick-tests-grid">
              {quickTests.map((test, index) => (
                <div
                  key={index}
                  className="quick-test-card"
                  onClick={() => setText(test.text)}
                >
                  <div className="test-emoji">{test.emoji}</div>
                  <div className="test-label">{test.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🔒</div>
              <div>
                <strong>Private & Secure</strong>
                <p>Your data is never stored or shared</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">⚡</div>
              <div>
                <strong>Instant Analysis</strong>
                <p>AI-powered results in seconds</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">💡</div>
              <div>
                <strong>Personalized Tips</strong>
                <p>Custom recommendations for you</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextAnalysis;