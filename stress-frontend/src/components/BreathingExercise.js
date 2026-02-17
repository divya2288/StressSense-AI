import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BreathingExercise.css';

function BreathingExercise() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef(null);
  const timeRef = useRef(null);

  const phases = {
    inhale: { duration: 4000, text: 'Breathe In', next: 'hold1' },
    hold1: { duration: 7000, text: 'Hold', next: 'exhale' },
    exhale: { duration: 8000, text: 'Breathe Out', next: 'hold2' },
    hold2: { duration: 2000, text: 'Hold', next: 'inhale' },
  };

useEffect(() => {
  if (isActive && phase !== 'ready') {
    const phases = {
      inhale: { duration: 4000, text: 'Breathe In', next: 'hold1' },
      hold1: { duration: 7000, text: 'Hold', next: 'exhale' },
      exhale: { duration: 8000, text: 'Breathe Out', next: 'hold2' },
      hold2: { duration: 2000, text: 'Hold', next: 'inhale' },
    };
    
    const currentPhase = phases[phase];
    
    timerRef.current = setTimeout(() => {
      if (currentPhase.next === 'inhale') {
        setCycleCount((prev) => prev + 1);
      }
      setPhase(currentPhase.next);
    }, currentPhase.duration);

    timeRef.current = setInterval(() => {
      setTotalTime((prev) => prev + 1);
    }, 1000);
  }

  return () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (timeRef.current) clearInterval(timeRef.current);
  };
}, [phase, isActive]); // Dependencies are correct
  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCycleCount(0);
    setTotalTime(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('ready');
    if (timerRef.current) clearTimeout(timerRef.current);
    if (timeRef.current) clearInterval(timeRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseInstruction = () => {
    if (phase === 'ready') {
      return 'Click Start to begin the 4-7-8 breathing technique';
    }
    return phases[phase]?.text || '';
  };

  return (
    <div className="breathing-container">
      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>

        <div className="breathing-card">
          <h2>🧘 Breathing Exercise</h2>
          <p className="breathing-subtitle">
            The 4-7-8 technique helps reduce anxiety and promote relaxation
          </p>

          <div className="breathing-area">
            <div className={`breathing-circle ${phase} ${isActive ? 'active' : ''}`}>
              <div className="circle-content">
                <div className="phase-text">{getPhaseInstruction()}</div>
                {isActive && phase !== 'ready' && (
                  <div className="phase-timer">
                    {Math.ceil(phases[phase].duration / 1000)}s
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="breathing-stats">
            <div className="stat-item">
              <div className="stat-label">Cycles Completed</div>
              <div className="stat-value">{cycleCount}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Time Elapsed</div>
              <div className="stat-value">{formatTime(totalTime)}</div>
            </div>
          </div>

          <div className="breathing-controls">
            {!isActive ? (
              <button onClick={startExercise} className="btn-primary btn-large">
                Start Exercise
              </button>
            ) : (
              <button onClick={stopExercise} className="btn-secondary btn-large">
                Stop Exercise
              </button>
            )}
          </div>

          <div className="breathing-instructions">
            <h3>How it works:</h3>
            <ol>
              <li>
                <strong>Inhale (4s):</strong> Breathe in quietly through your nose
              </li>
              <li>
                <strong>Hold (7s):</strong> Hold your breath
              </li>
              <li>
                <strong>Exhale (8s):</strong> Exhale completely through your mouth
              </li>
              <li>
                <strong>Hold (2s):</strong> Brief pause before next cycle
              </li>
            </ol>
            <p className="tip">
              💡 <strong>Tip:</strong> Practice this 3-4 times daily for best results.
              Ideal before bed or during stressful moments.
            </p>
          </div>

          <div className="benefits-section">
            <h3>Benefits:</h3>
            <ul>
              <li>✅ Reduces anxiety and stress</li>
              <li>✅ Improves sleep quality</li>
              <li>✅ Lowers heart rate and blood pressure</li>
              <li>✅ Enhances focus and concentration</li>
              <li>✅ Activates relaxation response</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreathingExercise;