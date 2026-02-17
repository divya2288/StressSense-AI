import axios from 'axios';

// Connect directly to Python ML service
const BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const apiService = {
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  analyzeText: async (userId, text) => {
  try {
    const response = await api.post('/predict', { text });
    
    // Add recommendations based on stress level
    const recommendations = generateRecommendations(response.data);
    
    const result = {
      stress_analysis: response.data,
      recommendations: recommendations,
      timestamp: new Date().toISOString(),
      user_id: userId,
    };
    
    // Add emergency resources for high stress
    if (response.data.severity_score >= 2) {
      result.emergency_resources = [
        '🆘 Crisis Helpline: 1-800-273-8255 (24/7)',
        '💬 Crisis Text Line: Text HOME to 741741',
        '🌐 Online Therapy: BetterHelp.com',
        '🏥 Campus Counseling: Contact your institution',
        '👨‍⚕️ Primary Care: Schedule a check-up'
      ];
    }
    
    return result;
  } catch (error) {
    console.error('Text analysis failed:', error);
    throw error;
  }
},
  analyzeBurnout: async (userId, questionnaireData) => {
    try {
      console.log('Calling /burnout with:', questionnaireData); // DEBUG
      
      // Format data correctly for Python API
      const requestData = {
        workload: questionnaireData.workload,
        sleep_hours: questionnaireData.sleepHours, // Convert camelCase to snake_case
        motivation: questionnaireData.motivation,
        social_withdrawal: questionnaireData.socialWithdrawal,
        emotional_exhaustion: questionnaireData.emotionalExhaustion,
        cynicism: questionnaireData.cynicism,
      };
      
      const response = await api.post('/burnout', requestData);
      console.log('Response from /burnout:', response.data); // DEBUG
      
      return {
        burnout_analysis: response.data,
        timestamp: new Date().toISOString(),
        user_id: userId,
      };
    } catch (error) {
      console.error('Burnout analysis failed:', error);
      console.error('Error response:', error.response?.data); // DEBUG
      throw error;
    }
  },

  analyzeCombined: async (userId, text, questionnaireData) => {
    try {
      const results = {};
      
      if (text) {
        const textResponse = await api.post('/predict', { text });
        results.text_analysis = {
          stress_analysis: textResponse.data,
          recommendations: generateRecommendations(textResponse.data),
        };
      }
      
      if (questionnaireData) {
        const burnoutData = {
          workload: questionnaireData.workload,
          sleep_hours: questionnaireData.sleepHours,
          motivation: questionnaireData.motivation,
          social_withdrawal: questionnaireData.socialWithdrawal,
          emotional_exhaustion: questionnaireData.emotionalExhaustion,
          cynicism: questionnaireData.cynicism,
        };
        const burnoutResponse = await api.post('/burnout', burnoutData);
        results.burnout_analysis = {
          burnout_analysis: burnoutResponse.data,
        };
      }
      
      results.timestamp = new Date().toISOString();
      return results;
    } catch (error) {
      console.error('Combined analysis failed:', error);
      throw error;
    }
  },

  getTrend: async (userId) => {
    // Mock trend data (will be replaced when backend is ready)
    return {
      trend: 'no_data',
      averageStress: 0,
      insight: 'Start tracking your stress to see trends!',
      history: [],
    };
  },

  getHistory: async (userId) => {
    // Mock history (will be replaced when backend is ready)
    return [];
  },
};

// Helper function to generate recommendations
function generateRecommendations(stressData) {
  const recommendations = [];
  const keywords = stressData.keywords || [];
  const severityScore = stressData.severity_score || 0;
  
  // Keyword-based recommendations
  if (keywords.includes('deadline') || keywords.includes('exam')) {
    recommendations.push('📋 Break tasks into smaller, manageable chunks');
    recommendations.push('⏰ Use the Pomodoro Technique: 25min work, 5min break');
  }
  
  if (keywords.includes('tired') || keywords.includes('exhausted')) {
    recommendations.push('😴 Prioritize 7-8 hours of sleep tonight');
    recommendations.push('☕ Limit caffeine after 2 PM');
  }
  
  if (keywords.includes('overwhelmed') || keywords.includes('anxious')) {
    recommendations.push('🧘 Practice 4-7-8 breathing: Inhale 4s, Hold 7s, Exhale 8s');
    recommendations.push('📝 Write down your worries to externalize them');
  }
  
  if (keywords.includes('depressed') || keywords.includes('hopeless')) {
    recommendations.push('💬 Talk to a trusted friend or counselor TODAY');
    recommendations.push('☀️ Get 15 minutes of sunlight exposure');
  }
  
  // Severity-based recommendations
  if (severityScore >= 2) {
    recommendations.push('🚨 Take a 15-minute break RIGHT NOW');
    recommendations.push('🚶 Go for a short walk outside');
    recommendations.push('💧 Drink a glass of water');
    if (!recommendations.some(r => r.includes('Talk to'))) {
      recommendations.push('💬 Reach out to someone you trust');
    }
  } else if (severityScore === 1) {
    recommendations.push('⚖️ Review your work-life balance');
    recommendations.push('🎯 Focus on one task at a time');
  } else {
    recommendations.push('✅ Maintain your current healthy habits');
    recommendations.push('💚 Continue regular exercise and sleep routine');
  }
  
  // Remove duplicates and return top 5
  const uniqueRecommendations = [...new Set(recommendations)];
  return uniqueRecommendations.slice(0, 5);
}

export default apiService;