import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StressHeatmap.css';

function StressHeatmap() {
  const navigate = useNavigate();
  const [selectedAreas, setSelectedAreas] = useState({});
  const [hoveredArea, setHoveredArea] = useState(null);
  const [view, setView] = useState('front'); // 'front' or 'back'

  const bodyAreas = {
    front: [
      { 
        id: 'head', 
        name: 'Head & Mind', 
        x: 50, 
        y: 8,
        icon: '🧠',
        symptoms: ['Headaches', 'Brain fog', 'Difficulty concentrating'],
        relief: ['Deep breathing', 'Meditation', 'Adequate sleep']
      },
      { 
        id: 'neck', 
        name: 'Neck', 
        x: 50, 
        y: 18,
        icon: '🦴',
        symptoms: ['Stiffness', 'Pain', 'Limited mobility'],
        relief: ['Neck stretches', 'Posture correction', 'Warm compress']
      },
      { 
        id: 'shoulders', 
        name: 'Shoulders', 
        x: 50, 
        y: 25,
        icon: '💪',
        symptoms: ['Tension', 'Tightness', 'Knots'],
        relief: ['Shoulder rolls', 'Massage', 'Stress balls']
      },
      { 
        id: 'chest', 
        name: 'Chest', 
        x: 50, 
        y: 35,
        icon: '❤️',
        symptoms: ['Tightness', 'Rapid heartbeat', 'Shallow breathing'],
        relief: ['Deep breathing', 'Progressive relaxation', 'Cardio exercise']
      },
      { 
        id: 'stomach', 
        name: 'Stomach', 
        x: 50, 
        y: 48,
        icon: '🫃',
        symptoms: ['Butterflies', 'Nausea', 'Digestive issues'],
        relief: ['Mindful eating', 'Herbal tea', 'Abdominal breathing']
      },
      { 
        id: 'arms', 
        name: 'Arms & Hands', 
        x: 50, 
        y: 45,
        icon: '🤲',
        symptoms: ['Trembling', 'Sweating', 'Numbness'],
        relief: ['Hand exercises', 'Stress balls', 'Wrist stretches']
      },
      { 
        id: 'legs', 
        name: 'Legs', 
        x: 50, 
        y: 75,
        icon: '🦵',
        symptoms: ['Restlessness', 'Weakness', 'Tension'],
        relief: ['Walking', 'Leg stretches', 'Yoga']
      },
    ],
    back: [
      { 
        id: 'upper-back', 
        name: 'Upper Back', 
        x: 50, 
        y: 25,
        icon: '🔝',
        symptoms: ['Muscle knots', 'Pain between shoulder blades', 'Tightness'],
        relief: ['Upper back stretches', 'Foam rolling', 'Massage']
      },
      { 
        id: 'mid-back', 
        name: 'Mid Back', 
        x: 50, 
        y: 40,
        icon: '⬆️',
        symptoms: ['Stiffness', 'Dull ache', 'Reduced flexibility'],
        relief: ['Torso twists', 'Cat-cow stretches', 'Heat therapy']
      },
      { 
        id: 'lower-back', 
        name: 'Lower Back', 
        x: 50, 
        y: 55,
        icon: '⚡',
        symptoms: ['Sharp pain', 'Chronic ache', 'Limited movement'],
        relief: ['Lower back stretches', 'Core strengthening', 'Proper posture']
      },
    ]
  };

  const currentAreas = bodyAreas[view];

  const handleAreaClick = (areaId) => {
    if (selectedAreas[areaId]) {
      const newAreas = { ...selectedAreas };
      delete newAreas[areaId];
      setSelectedAreas(newAreas);
    } else {
      setSelectedAreas({
        ...selectedAreas,
        [areaId]: { intensity: 5, timestamp: Date.now() }
      });
    }
  };

  const handleIntensityChange = (areaId, intensity) => {
    setSelectedAreas({
      ...selectedAreas,
      [areaId]: { ...selectedAreas[areaId], intensity: parseInt(intensity) }
    });
  };

  const getIntensityColor = (intensity) => {
    if (intensity <= 3) return '#4caf50';
    if (intensity <= 6) return '#ff9800';
    return '#f44336';
  };

  const getIntensityGradient = (intensity) => {
    if (intensity <= 3) return 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)';
    if (intensity <= 6) return 'linear-gradient(135deg, #ffd89b 0%, #ff9800 100%)';
    return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)';
  };

  const getIntensityLabel = (intensity) => {
    if (intensity <= 3) return 'Mild';
    if (intensity <= 6) return 'Moderate';
    return 'Severe';
  };

  const clearAll = () => {
    setSelectedAreas({});
  };

  const getRecommendations = () => {
    const areas = Object.keys(selectedAreas);
    if (areas.length === 0) return [];

    const recommendations = new Set();
    areas.forEach(areaId => {
      const area = currentAreas.find(a => a.id === areaId);
      if (area) {
        area.relief.forEach(r => recommendations.add(r));
      }
    });

    return Array.from(recommendations);
  };

  const getTotalStressScore = () => {
    const areas = Object.keys(selectedAreas);
    if (areas.length === 0) return 0;
    const total = areas.reduce((sum, areaId) => sum + selectedAreas[areaId].intensity, 0);
    return Math.round((total / (areas.length * 10)) * 100);
  };

  const stressScore = getTotalStressScore();
  const recommendations = getRecommendations();

  return (
    <div className="heatmap-professional">
      <div className="heatmap-background">
        <div className="bg-orb-heat orb-heat-1"></div>
        <div className="bg-orb-heat orb-heat-2"></div>
        <div className="bg-orb-heat orb-heat-3"></div>
      </div>

      <div className="heatmap-container">
        <button onClick={() => navigate('/dashboard')} className="btn-back-modern">
          <span className="back-arrow">←</span> Back to Dashboard
        </button>

        <div className="heatmap-grid">
          {/* Left Panel - Body Visualization */}
          <div className="body-panel">
            <div className="panel-header">
              <h1>🔥 Body Stress Heatmap</h1>
              <p>Click on body areas where you feel tension or stress</p>
            </div>

            {/* View Toggle */}
            <div className="view-toggle">
              <button
                className={`toggle-btn ${view === 'front' ? 'active' : ''}`}
                onClick={() => setView('front')}
              >
                Front View
              </button>
              <button
                className={`toggle-btn ${view === 'back' ? 'active' : ''}`}
                onClick={() => setView('back')}
              >
                Back View
              </button>
            </div>

            {/* Body Visualization */}
            <div className="body-visualization">
              <svg
                viewBox="0 0 100 100"
                className="body-svg"
              >
                {/* Body Outline */}
                {view === 'front' ? (
                  <g className="body-outline">
                    {/* Head */}
                    <ellipse cx="50" cy="8" rx="8" ry="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    {/* Neck */}
                    <rect x="47" y="16" width="6" height="6" rx="1" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    {/* Shoulders */}
                    <path d="M 35 22 Q 50 24 65 22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round"/>
                    {/* Torso */}
                    <rect x="42" y="28" width="16" height="30" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    {/* Arms */}
                    <rect x="30" y="28" width="6" height="25" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    <rect x="64" y="28" width="6" height="25" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    {/* Legs */}
                    <rect x="44" y="60" width="5" height="35" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    <rect x="51" y="60" width="5" height="35" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                  </g>
                ) : (
                  <g className="body-outline">
                    {/* Head */}
                    <ellipse cx="50" cy="8" rx="8" ry="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    {/* Neck */}
                    <rect x="47" y="16" width="6" height="6" rx="1" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    {/* Upper Back */}
                    <rect x="42" y="22" width="16" height="15" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    {/* Mid Back */}
                    <rect x="42" y="37" width="16" height="12" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    {/* Lower Back */}
                    <rect x="42" y="49" width="16" height="12" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    {/* Legs */}
                    <rect x="44" y="62" width="5" height="33" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    <rect x="51" y="62" width="5" height="33" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                  </g>
                )}

                {/* Interactive Areas */}
                {currentAreas.map((area) => (
                  <g key={area.id}>
                    <circle
                      cx={area.x}
                      cy={area.y}
                      r={selectedAreas[area.id] ? "8" : "6"}
                      fill={selectedAreas[area.id] ? getIntensityColor(selectedAreas[area.id].intensity) : "rgba(102, 126, 234, 0.3)"}
                      stroke={selectedAreas[area.id] ? "white" : "rgba(102, 126, 234, 0.6)"}
                      strokeWidth={selectedAreas[area.id] ? "1" : "0.5"}
                      onClick={() => handleAreaClick(area.id)}
                      onMouseEnter={() => setHoveredArea(area)}
                      onMouseLeave={() => setHoveredArea(null)}
                      className={`body-point ${selectedAreas[area.id] ? 'active' : ''} ${hoveredArea?.id === area.id ? 'hovered' : ''}`}
                      style={{ cursor: 'pointer' }}
                    />
                    {selectedAreas[area.id] && (
                      <circle
                        cx={area.x}
                        cy={area.y}
                        r="12"
                        fill="none"
                        stroke={getIntensityColor(selectedAreas[area.id].intensity)}
                        strokeWidth="0.5"
                        opacity="0.5"
                        className="pulse-ring"
                      />
                    )}
                  </g>
                ))}
              </svg>

              {/* Hovered Area Tooltip */}
              {hoveredArea && !selectedAreas[hoveredArea.id] && (
                <div className="area-tooltip">
                  <div className="tooltip-icon">{hoveredArea.icon}</div>
                  <div className="tooltip-name">{hoveredArea.name}</div>
                  <div className="tooltip-hint">Click to select</div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="intensity-legend">
              <h3>Intensity Scale</h3>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="legend-color mild"></div>
                  <span>Mild (1-3)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color moderate"></div>
                  <span>Moderate (4-6)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color severe"></div>
                  <span>Severe (7-10)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Controls & Info */}
          <div className="controls-panel">
            {/* Overall Stress Score */}
            {Object.keys(selectedAreas).length > 0 && (
              <div className="stress-score-card">
                <h2>Overall Stress Score</h2>
                <div className="score-circle">
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <circle
                      cx="75"
                      cy="75"
                      r="65"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="75"
                      cy="75"
                      r="65"
                      fill="none"
                      stroke={getIntensityColor(stressScore / 10)}
                      strokeWidth="10"
                      strokeDasharray={`${(stressScore / 100) * 408} 408`}
                      strokeLinecap="round"
                      transform="rotate(-90 75 75)"
                      style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                  </svg>
                  <div className="score-overlay">
                    <div className="score-value">{stressScore}</div>
                    <div className="score-label">/ 100</div>
                  </div>
                </div>
                <div className="score-status" style={{ color: getIntensityColor(stressScore / 10) }}>
                  {getIntensityLabel(stressScore / 10)} Stress Level
                </div>
              </div>
            )}

            {/* Selected Areas */}
            {Object.keys(selectedAreas).length > 0 ? (
              <div className="selected-areas-section">
                <div className="section-header-controls">
                  <h2>Selected Areas ({Object.keys(selectedAreas).length})</h2>
                  <button className="btn-clear" onClick={clearAll}>
                    Clear All
                  </button>
                </div>

                <div className="selected-areas-list">
                  {Object.keys(selectedAreas).map(areaId => {
                    const area = currentAreas.find(a => a.id === areaId);
                    const data = selectedAreas[areaId];
                    return (
                      <div key={areaId} className="selected-area-card">
                        <div className="area-card-header">
                          <div className="area-info">
                            <span className="area-icon">{area.icon}</span>
                            <h3>{area.name}</h3>
                          </div>
                          <button
                            className="btn-remove"
                            onClick={() => handleAreaClick(areaId)}
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>

                        <div className="intensity-slider-section">
                          <div className="slider-header">
                            <span>Intensity</span>
                            <span 
                              className="intensity-value"
                              style={{ color: getIntensityColor(data.intensity) }}
                            >
                              {data.intensity} - {getIntensityLabel(data.intensity)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={data.intensity}
                            onChange={(e) => handleIntensityChange(areaId, e.target.value)}
                            className="intensity-slider"
                            style={{
                              background: `linear-gradient(to right, ${getIntensityColor(data.intensity)} 0%, ${getIntensityColor(data.intensity)} ${data.intensity * 10}%, rgba(255,255,255,0.1) ${data.intensity * 10}%, rgba(255,255,255,0.1) 100%)`
                            }}
                          />
                        </div>

                        <div className="area-details">
                          <div className="detail-section">
                            <h4>⚠️ Common Symptoms:</h4>
                            <ul>
                              {area.symptoms.map((symptom, i) => (
                                <li key={i}>{symptom}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="detail-section">
                            <h4>💊 Relief Methods:</h4>
                            <ul>
                              {area.relief.map((method, i) => (
                                <li key={i}>{method}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="empty-state-heatmap">
                <div className="empty-icon">👆</div>
                <h3>No Areas Selected</h3>
                <p>Click on the body diagram to mark areas where you feel stress or tension</p>
                <div className="quick-tips">
                  <h4>💡 Tips:</h4>
                  <ul>
                    <li>Select multiple areas to get comprehensive recommendations</li>
                    <li>Adjust intensity sliders for accurate assessment</li>
                    <li>Switch between front and back views</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="recommendations-section-heat">
                <h2>💡 Personalized Recommendations</h2>
                <div className="recommendations-grid-heat">
                  {recommendations.map((rec, index) => (
                    <div 
                      key={index} 
                      className="recommendation-chip"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="chip-check">✓</span>
                      <span className="chip-text">{rec}</span>
                    </div>
                  ))}
                </div>

                <div className="action-buttons-heat">
                  <button
                    className="btn-action-heat primary"
                    onClick={() => navigate('/breathing')}
                  >
                    <span className="btn-icon-heat">🧘</span>
                    Try Breathing Exercise
                  </button>
                  <button
                    className="btn-action-heat secondary"
                    onClick={() => navigate('/meditation')}
                  >
                    <span className="btn-icon-heat">🎵</span>
                    Listen to Meditation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StressHeatmap;