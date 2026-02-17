import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import '../styles/Questionnaire.css';

function Questionnaire({ userId, onResult }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    workload: 5,
    sleepHours: 7,
    motivation: 5,
    socialWithdrawal: 5,
    emotionalExhaustion: 5,
    cynicism: 5,
  });

  const questions = [
    {
      field: 'workload',
      icon: '💼',
      question: 'How heavy is your current workload?',
      min: 1,
      max: 10,
      labels: ['Very Light', 'Extremely Heavy'],
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      field: 'sleepHours',
      icon: '😴',
      question: 'How many hours do you sleep per night?',
      min: 1,
      max: 12,
      labels: ['1 hour', '12 hours'],
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      isHours: true,
    },
    {
      field: 'motivation',
      icon: '🎯',
      question: 'How motivated do you feel lately?',
      min: 1,
      max: 10,
      labels: ['No Motivation', 'Highly Motivated'],
      color: '#43e97b',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      field: 'socialWithdrawal',
      icon: '👥',
      question: 'How much are you avoiding social interactions?',
      min: 1,
      max: 10,
      labels: ['Very Social', 'Complete Isolation'],
      color: '#fa709a',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      field: 'emotionalExhaustion',
      icon: '😓',
      question: 'How emotionally drained do you feel?',
      min: 1,
      max: 10,
      labels: ['Energetic', 'Completely Drained'],
      color: '#ff6b6b',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    },
    {
      field: 'cynicism',
      icon: '😒',
      question: 'How cynical or negative are you feeling?',
      min: 1,
      max: 10,
      labels: ['Very Positive', 'Very Cynical'],
      color: '#a8edea',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleChange = (value) => {
    setFormData({ ...formData, [currentQuestion.field]: parseInt(value) });
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await apiService.analyzeBurnout(userId, formData);
      onResult(result);
      navigate('/result');
    } catch (err) {
      setError('Failed to analyze. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEmoji = (value, field) => {
    if (field === 'sleepHours') {
      if (value >= 7) return '😴✨';
      if (value >= 5) return '😪';
      return '🥱💤';
    }
    if (field === 'motivation') {
      if (value >= 7) return '🚀';
      if (value >= 4) return '😐';
      return '😔';
    }
    if (value >= 7) return '😰';
    if (value >= 4) return '😐';
    return '😊';
  };

  return (
    <div className="questionnaire-container">
      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back
        </button>

        <div className="questionnaire-card modern-card">
          {/* Progress Header */}
          <div className="progress-header" style={{ background: currentQuestion.gradient }}>
            <div className="progress-info">
              <h2>Burnout Assessment</h2>
              <p>Question {currentStep + 1} of {questions.length}</p>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Question Content */}
          <div className="question-content">
            <div className="question-icon" style={{ background: currentQuestion.gradient }}>
              {currentQuestion.icon}
            </div>

            <h3 className="question-text">{currentQuestion.question}</h3>

            {/* Value Display */}
            <div className="value-display" style={{ background: currentQuestion.gradient }}>
              <span className="value-emoji">
                {getEmoji(formData[currentQuestion.field], currentQuestion.field)}
              </span>
              <span className="value-number">
                {formData[currentQuestion.field]}
                {currentQuestion.isHours ? ' hours' : '/10'}
              </span>
            </div>

            {/* Modern Slider */}
            <div className="slider-wrapper">
              <div className="slider-labels">
                <span>{currentQuestion.labels[0]}</span>
                <span>{currentQuestion.labels[1]}</span>
              </div>
              <input
                type="range"
                min={currentQuestion.min}
                max={currentQuestion.max}
                value={formData[currentQuestion.field]}
                onChange={(e) => handleChange(e.target.value)}
                className="modern-slider"
                style={{
                  background: `linear-gradient(to right, ${currentQuestion.color} 0%, ${currentQuestion.color} ${((formData[currentQuestion.field] - currentQuestion.min) / (currentQuestion.max - currentQuestion.min)) * 100}%, #e0e0e0 ${((formData[currentQuestion.field] - currentQuestion.min) / (currentQuestion.max - currentQuestion.min)) * 100}%, #e0e0e0 100%)`
                }}
              />
              <div className="slider-markers">
                {Array.from({ length: currentQuestion.max - currentQuestion.min + 1 }).map((_, i) => (
                  <span
                    key={i}
                    className={`marker ${formData[currentQuestion.field] >= currentQuestion.min + i ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Navigation Buttons */}
            <div className="nav-buttons">
              <button
                onClick={prevStep}
                className="btn-secondary"
                disabled={currentStep === 0}
              >
                ← Previous
              </button>
              <button
                onClick={nextStep}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : currentStep === questions.length - 1 ? (
                  <>
                    Get Results 🎯
                  </>
                ) : (
                  <>
                    Next →
                  </>
                )}
              </button>
            </div>

            {/* Quick Overview */}
            <div className="quick-overview">
              <h4>📊 Your Responses:</h4>
              <div className="overview-grid">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    className={`overview-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <span className="overview-icon">{q.icon}</span>
                    <span className="overview-value">{formData[q.field]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questionnaire;