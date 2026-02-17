import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Result.css';

function Result({ result, userId }) {
  const navigate = useNavigate();

  // Safely extract data with fallbacks
  const stressData = result?.stress_analysis || result?.text_analysis?.stress_analysis || null;
  const burnoutData = result?.burnout_analysis?.burnout_analysis || result?.burnout_analysis || null;
  const recommendations = result?.recommendations || [];
  const emergencyResources = result?.emergency_resources || [];

  const getSeverityClass = (level) => {
    if (!level) return 'medium';
    const levelStr = typeof level === 'string' ? level.toLowerCase() : '';
    if (levelStr.includes('high')) return 'high';
    if (levelStr.includes('medium') || levelStr.includes('moderate')) return 'medium';
    if (levelStr.includes('low')) return 'low';
    return 'medium';
  };

  return (
    <div className="result-container">
      <div className="container">
     <button
  onClick={() => window.print()}
  className="btn-secondary"
>
  🖨️ Print/Save Results
</button>

        <div className="result-card">
          <h2>Your Analysis Results</h2>

          {/* Stress Analysis Results */}
          {stressData && (
            <div className="analysis-section">
              <h3>💬 Text-Based Stress Analysis</h3>
              
              <div className={`stress-level-badge ${getSeverityClass(stressData.stress_level)}`}>
                {stressData.stress_level || 'Unknown'}
              </div>

              {stressData.confidence !== undefined && (
                <div className="confidence-bar">
                  <div className="confidence-label">
                    Confidence: {stressData.confidence}%
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${stressData.confidence}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {stressData.description && (
                <p className="description">{stressData.description}</p>
              )}

              {stressData.keywords && stressData.keywords.length > 0 && (
                <div className="keywords-section">
                  <h4>🔍 Detected Keywords:</h4>
                  <div className="keywords">
                    {stressData.keywords.map((keyword, index) => (
                      <span key={index} className="keyword-badge">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {stressData.probabilities && (
                <div className="probabilities">
                  <h4>📊 Probability Breakdown:</h4>
                  <div className="prob-bars">
                    <div className="prob-item">
                      <span>Low Stress</span>
                      <div className="prob-bar">
                        <div
                          style={{ width: `${stressData.probabilities.low}%` }}
                          className="prob-fill low"
                        ></div>
                      </div>
                      <span>{stressData.probabilities.low}%</span>
                    </div>
                    <div className="prob-item">
                      <span>Medium Stress</span>
                      <div className="prob-bar">
                        <div
                          style={{ width: `${stressData.probabilities.medium}%` }}
                          className="prob-fill medium"
                        ></div>
                      </div>
                      <span>{stressData.probabilities.medium}%</span>
                    </div>
                    <div className="prob-item">
                      <span>High Stress</span>
                      <div className="prob-bar">
                        <div
                          style={{ width: `${stressData.probabilities.high}%` }}
                          className="prob-fill high"
                        ></div>
                      </div>
                      <span>{stressData.probabilities.high}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Burnout Analysis Results */}
          {burnoutData && (
            <div className="analysis-section">
              <h3>📋 Burnout Risk Assessment</h3>
              
              <div className={`burnout-level-badge ${getSeverityClass(burnoutData.burnout_risk || burnoutData.burnoutRisk)}`}>
                {burnoutData.burnout_risk || burnoutData.burnoutRisk || 'Unknown'} Risk
              </div>

              {(burnoutData.risk_percentage !== undefined || burnoutData.riskPercentage !== undefined) && (
                <div className="risk-meter">
                  <div className="risk-label">
                    Risk Level: {burnoutData.risk_percentage || burnoutData.riskPercentage}%
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getSeverityClass(burnoutData.burnout_risk || burnoutData.burnoutRisk)}`}
                      style={{ width: `${burnoutData.risk_percentage || burnoutData.riskPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {(burnoutData.score !== undefined) && (
                <div className="burnout-score">
                  Score: {burnoutData.score} / {burnoutData.max_score || burnoutData.maxScore || 17}
                </div>
              )}

              {burnoutData.alert && (
                <div className="alert-box">
                  ⚠️ {burnoutData.alert}
                </div>
              )}

              {burnoutData.contributing_factors && burnoutData.contributing_factors.length > 0 && (
                <div className="factors-section">
                  <h4>🎯 Contributing Factors:</h4>
                  <ul className="factors-list">
                    {burnoutData.contributing_factors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}

              {burnoutData.recommendations && burnoutData.recommendations.length > 0 && (
                <div className="recommendations-section">
                  <h3>💡 Burnout-Specific Recommendations</h3>
                  <div className="recommendations-list">
                    {burnoutData.recommendations.map((rec, index) => (
                      <div key={index} className="recommendation-item">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* General Recommendations */}
          {recommendations && recommendations.length > 0 && !burnoutData && (
            <div className="recommendations-section">
              <h3>💡 Personalized Recommendations</h3>
              <div className="recommendations-list">
                {recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Resources */}
          {emergencyResources && emergencyResources.length > 0 && (
            <div className="emergency-section">
              <h3>🆘 Emergency Resources</h3>
              <div className="emergency-list">
                {emergencyResources.map((resource, index) => (
                  <div key={index} className="emergency-item">
                    {resource}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!stressData && !burnoutData && (
            <div className="no-data">
              <p>No analysis data available. Please try again.</p>
            </div>
          )}

          {/* Actions */}
          <div className="result-actions">
            <button
              onClick={() => navigate('/breathing')}
              className="btn-secondary"
            >
              🧘 Try Breathing Exercise
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;