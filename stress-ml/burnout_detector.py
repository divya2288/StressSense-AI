class BurnoutDetector:
    
    def __init__(self):
        self.burnout_thresholds = {
            'high': 8,
            'moderate': 5,
            'low': 0
        }
    
    def calculate_burnout_score(self, questionnaire_data):
        """
        Calculate burnout score based on questionnaire
        
        Expected input:
        {
            'workload': 8,           # 1-10 scale
            'sleep_hours': 4,        # hours per night
            'motivation': 2,         # 1-10 scale
            'social_withdrawal': 7,  # 1-10 scale
            'emotional_exhaustion': 8, # 1-10 scale
            'cynicism': 6            # 1-10 scale
        }
        """
        score = 0
        factors = []
        
        # Workload (0-3 points)
        workload = questionnaire_data.get('workload', 5)
        if workload >= 8:
            score += 3
            factors.append("Excessive workload")
        elif workload >= 6:
            score += 2
            factors.append("High workload")
        
        # Sleep deprivation (0-4 points)
        sleep = questionnaire_data.get('sleep_hours', 7)
        if sleep < 5:
            score += 4
            factors.append("Severe sleep deprivation")
        elif sleep < 6:
            score += 3
            factors.append("Insufficient sleep")
        elif sleep < 7:
            score += 1
            factors.append("Suboptimal sleep")
        
        # Motivation loss (0-3 points)
        motivation = questionnaire_data.get('motivation', 5)
        if motivation <= 3:
            score += 3
            factors.append("Low motivation")
        elif motivation <= 5:
            score += 2
            factors.append("Decreased motivation")
        
        # Social withdrawal (0-2 points)
        social = questionnaire_data.get('social_withdrawal', 5)
        if social >= 7:
            score += 2
            factors.append("Social withdrawal")
        elif social >= 5:
            score += 1
            factors.append("Reduced social interaction")
        
        # Emotional exhaustion (0-3 points)
        exhaustion = questionnaire_data.get('emotional_exhaustion', 5)
        if exhaustion >= 8:
            score += 3
            factors.append("Emotional exhaustion")
        elif exhaustion >= 6:
            score += 2
            factors.append("Emotional fatigue")
        
        # Cynicism (0-2 points)
        cynicism = questionnaire_data.get('cynicism', 5)
        if cynicism >= 7:
            score += 2
            factors.append("High cynicism")
        elif cynicism >= 5:
            score += 1
            factors.append("Developing cynicism")
        
        return score, factors
    
    def get_recommendations(self, risk_level, factors):
        """Get personalized recommendations"""
        recommendations = []
        
        if risk_level == 'High':
            recommendations.extend([
                "🚨 Consider speaking with a mental health professional",
                "📞 Reach out to your support system immediately",
                "🛑 Take a break from work/studies if possible",
                "💊 Consult a doctor about physical symptoms"
            ])
        
        if 'Severe sleep deprivation' in factors or 'Insufficient sleep' in factors:
            recommendations.append("😴 Prioritize 7-8 hours of sleep tonight")
            recommendations.append("📵 Avoid screens 1 hour before bed")
        
        if 'Excessive workload' in factors or 'High workload' in factors:
            recommendations.append("📋 Delegate tasks where possible")
            recommendations.append("⏱️ Use time-blocking to manage tasks")
        
        if 'Low motivation' in factors or 'Decreased motivation' in factors:
            recommendations.append("🎯 Set small, achievable daily goals")
            recommendations.append("🏆 Celebrate small wins")
        
        if 'Social withdrawal' in factors:
            recommendations.append("👥 Schedule time with friends/family")
            recommendations.append("💬 Join a support group or community")
        
        if 'Emotional exhaustion' in factors:
            recommendations.append("🧘 Practice mindfulness or meditation")
            recommendations.append("🚶 Take regular breaks during work")
        
        # General recommendations
        recommendations.extend([
            "🏃 Engage in physical activity",
            "📝 Maintain a stress journal",
            "🎨 Pursue a hobby or creative outlet"
        ])
        
        return recommendations[:6]  # Return top 6
    
    def detect_burnout(self, questionnaire_data):
        """Main burnout detection function"""
        
        score, factors = self.calculate_burnout_score(questionnaire_data)
        
        # Determine risk level
        if score >= self.burnout_thresholds['high']:
            risk_level = 'High'
            alert = 'Immediate intervention needed'
            risk_percentage = min(100, (score / 17) * 100)
        elif score >= self.burnout_thresholds['moderate']:
            risk_level = 'Moderate'
            alert = 'Monitor closely and take action'
            risk_percentage = (score / 17) * 100
        else:
            risk_level = 'Low'
            alert = 'Maintain healthy habits'
            risk_percentage = (score / 17) * 100
        
        recommendations = self.get_recommendations(risk_level, factors)
        
        return {
            'burnout_risk': risk_level,
            'risk_percentage': round(risk_percentage, 1),
            'score': score,
            'max_score': 17,
            'alert': alert,
            'contributing_factors': factors,
            'recommendations': recommendations,
            'severity_breakdown': {
                'workload': questionnaire_data.get('workload', 0),
                'sleep_quality': 10 - (questionnaire_data.get('sleep_hours', 7) * 1.2),
                'motivation_loss': 10 - questionnaire_data.get('motivation', 5),
                'social_impact': questionnaire_data.get('social_withdrawal', 0),
                'emotional_state': questionnaire_data.get('emotional_exhaustion', 0)
            }
        }