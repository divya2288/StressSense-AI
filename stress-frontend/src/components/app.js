import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TextAnalysis from './components/TextAnalysis';
import Questionnaire from './components/Questionnaire';
import Result from './components/Result';
import Dashboard from './components/Dashboard';
import BreathingExercise from './components/BreathingExercise';
import AIChat from './components/AIChat';
import StressHeatmap from './components/StressHeatmap';
import MeditationPlayer from './components/MeditationPlayer';
import WeeklyReport from './components/WeeklyReport';
import './styles/app.css';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleLogin = (id) => {
    setUserId(id);
    localStorage.setItem('userId', id);
  };

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
    setAnalysisResult(null);
  };

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="container">
            <div>
              <h1>🧠 StressSense AI</h1>
              <p className="tagline">Your Mental Wellness Assistant</p>
            </div>
            {userId && (
              <div className="user-info">
                <span>Welcome, {userId}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                userId ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                userId ? (
                  <Dashboard userId={userId} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/text-analysis"
              element={
                userId ? (
                  <TextAnalysis
                    userId={userId}
                    onResult={setAnalysisResult}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/questionnaire"
              element={
                userId ? (
                  <Questionnaire
                    userId={userId}
                    onResult={setAnalysisResult}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/result"
              element={
                userId && analysisResult ? (
                  <Result result={analysisResult} userId={userId} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/breathing"
              element={
                userId ? (
                  <BreathingExercise />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/ai-chat"
              element={
                userId ? (
                  <AIChat userId={userId} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/heatmap"
              element={
                userId ? (
                  <StressHeatmap />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/meditation"
              element={
                userId ? (
                  <MeditationPlayer />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/weekly-report"
              element={
                userId ? (
                  <WeeklyReport userId={userId} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>
            ⚠️ This is not a medical diagnosis tool. For professional help,
            contact a mental health professional.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;