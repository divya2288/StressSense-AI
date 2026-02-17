import React, { useState } from 'react';
import '../styles/WeeklyReport.css';

function WeeklyReport({ userId }) {
  const [generating, setGenerating] = useState(false);
  const [reportData] = useState({
    weekStart: '2024-01-15',
    weekEnd: '2024-01-21',
    overallScore: 72,
    stressLevel: 'Moderate',
    assessmentsCompleted: 5,
    meditationMinutes: 45,
    breathingExercises: 8,
    achievements: [
      { name: '7-Day Streak', icon: '🔥', unlocked: true },
      { name: 'Meditation Master', icon: '🧘', unlocked: true },
      { name: 'Stress Warrior', icon: '⚔️', unlocked: false },
    ],
    weeklyTrend: [
      { day: 'Mon', stress: 6, mood: 'okay' },
      { day: 'Tue', stress: 4, mood: 'good' },
      { day: 'Wed', stress: 7, mood: 'not-good' },
      { day: 'Thu', stress: 5, mood: 'okay' },
      { day: 'Fri', stress: 3, mood: 'great' },
      { day: 'Sat', stress: 2, mood: 'great' },
      { day: 'Sun', stress: 4, mood: 'good' },
    ],
    insights: [
      'Your stress levels peaked mid-week',
      'Meditation helped reduce stress by 40%',
      'Weekend showed significant improvement',
      'Consider more breathing exercises on busy days',
    ],
    goals: [
      { text: 'Complete 7 daily check-ins', progress: 85, completed: true },
      { text: 'Meditate for 60 minutes', progress: 75, completed: false },
      { text: 'Practice breathing 10 times', progress: 80, completed: false },
    ],
  });

  const generatePDF = () => {
    setGenerating(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      setGenerating(false);
      alert('PDF report generated! (In a real app, this would download a PDF)');
    }, 2000);
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      'great': '😊',
      'good': '😌',
      'okay': '😐',
      'not-good': '😟',
      'bad': '😢',
    };
    return moodMap[mood] || '😐';
  };

  const getStressColor = (level) => {
    if (level <= 3) return '#4caf50';
    if (level <= 6) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <div className="report-title">
          <h2>📊 Your Weekly Wellness Report</h2>
          <p>{reportData.weekStart} to {reportData.weekEnd}</p>
        </div>
        <button 
          className="btn-download" 
          onClick={generatePDF}
          disabled={generating}
        >
          {generating ? '⏳ Generating...' : '📥 Download PDF'}
        </button>
      </div>

      <div className="report-content">
        {/* Overall Score */}
        <div className="score-card-large">
          <h3>Overall Wellness Score</h3>
          <div className="score-display">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="15"
              />
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke={reportData.overallScore >= 70 ? '#4caf50' : reportData.overallScore >= 40 ? '#ff9800' : '#f44336'}
                strokeWidth="15"
                strokeDasharray={`${(reportData.overallScore / 100) * 534} 534`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                className="score-circle"
              />
            </svg>
            <div className="score-text">
              <span className="score-number">{reportData.overallScore}</span>
              <span className="score-label">/100</span>
            </div>
          </div>
          <p className="score-status">
            {reportData.overallScore >= 70 ? '🎉 Excellent!' : 
             reportData.overallScore >= 40 ? '⚠️ Good Progress' : 
             '🚨 Needs Attention'}
          </p>
        </div>

        {/* Weekly Stats */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{reportData.assessmentsCompleted}</div>
            <div className="stat-label">Assessments</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">🧘</div>
            <div className="stat-value">{reportData.meditationMinutes}</div>
            <div className="stat-label">Minutes Meditated</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">💨</div>
            <div className="stat-value">{reportData.breathingExercises}</div>
            <div className="stat-label">Breathing Exercises</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📈</div>
            <div className="stat-value">{reportData.stressLevel}</div>
            <div className="stat-label">Avg Stress Level</div>
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <div className="trend-chart-card">
          <h3>📈 Weekly Stress Trend</h3>
          <div className="chart-bars">
            {reportData.weeklyTrend.map((day, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(day.stress / 10) * 100}%`,
                      background: getStressColor(day.stress),
                    }}
                  >
                    <span className="bar-value">{day.stress}</span>
                  </div>
                </div>
                <div className="chart-day">{day.day}</div>
                <div className="chart-mood">{getMoodEmoji(day.mood)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements-card">
          <h3>🏆 Achievements</h3>
          <div className="achievements-grid">
            {reportData.achievements.map((achievement, index) => (
              <div
                key={index}
                className={`achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-name">{achievement.name}</div>
                {achievement.unlocked && <div className="achievement-check">✓</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="insights-card">
          <h3>💡 Personalized Insights</h3>
          <div className="insights-list">
            {reportData.insights.map((insight, index) => (
              <div key={index} className="insight-item">
                <span className="insight-bullet">•</span>
                {insight}
              </div>
            ))}
          </div>
        </div>

        {/* Goals Progress */}
        <div className="goals-card">
          <h3>🎯 Weekly Goals</h3>
          <div className="goals-list">
            {reportData.goals.map((goal, index) => (
              <div key={index} className="goal-item">
                <div className="goal-header">
                  <span className={`goal-status ${goal.completed ? 'completed' : ''}`}>
                    {goal.completed ? '✓' : '○'}
                  </span>
                  <span className="goal-text">{goal.text}</span>
                  <span className="goal-percentage">{goal.progress}%</span>
                </div>
                <div className="goal-progress-bar">
                  <div
                    className="goal-progress-fill"
                    style={{
                      width: `${goal.progress}%`,
                      background: goal.completed ? '#4caf50' : '#11998e',
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyReport;