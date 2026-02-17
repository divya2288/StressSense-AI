import joblib
import numpy as np
from utils.text_preprocessor import TextPreprocessor

class StressDetector:
    def __init__(self):
        try:
            self.model = joblib.load('models/stress_classifier.pkl')
            self.vectorizer = joblib.load('models/vectorizer.pkl')
            self.preprocessor = joblib.load('models/preprocessor.pkl')
            print("✅ Models loaded successfully")
        except Exception as e:
            print(f"❌ Error loading models: {e}")
            raise
        
        self.stress_labels = {
            0: "Low Stress",
            1: "Medium Stress",
            2: "High Stress"
        }
        
        self.stress_keywords = [
            'deadline', 'exam', 'tired', 'exhausted', 'overwhelmed',
            'anxious', 'pressure', 'workload', 'sleepless', 'depressed',
            'burnout', 'frustrated', 'worried', 'panic', 'stressed',
            'fear', 'hopeless', 'breakdown', 'failing', 'crying'
        ]
    
    def extract_stress_keywords(self, text):
        """Extract stress-related keywords from text"""
        text_lower = text.lower()
        found = [word for word in self.stress_keywords if word in text_lower]
        return found[:5]  # Return top 5
    
    def get_severity_description(self, level):
        """Get detailed description of stress level"""
        descriptions = {
            0: "You're doing well! Stress levels are manageable.",
            1: "Moderate stress detected. Consider taking breaks.",
            2: "High stress alert! Immediate action recommended."
        }
        return descriptions.get(level, "Unknown")
    
    def predict(self, text):
        """Main prediction function"""
        if not text or len(text.strip()) < 3:
            return {
                "error": "Please provide more detailed input",
                "stress_level": "Unknown",
                "confidence": 0,
                "keywords": [],
                "severity_score": 0
            }
        
        try:
            # Preprocess
            cleaned_text = self.preprocessor.preprocess(text)
            
            # Vectorize
            X = self.vectorizer.transform([cleaned_text])
            
            # Predict
            prediction = self.model.predict(X)[0]
            probabilities = self.model.predict_proba(X)[0]
            confidence = float(np.max(probabilities) * 100)
            
            # Extract keywords
            keywords = self.extract_stress_keywords(text)
            
            # Build result
            result = {
                "stress_level": self.stress_labels[prediction],
                "confidence": round(confidence, 2),
                "keywords": keywords,
                "severity_score": int(prediction),
                "description": self.get_severity_description(prediction),
                "probabilities": {
                    "low": round(float(probabilities[0]) * 100, 2),
                    "medium": round(float(probabilities[1]) * 100, 2),
                    "high": round(float(probabilities[2]) * 100, 2)
                }
            }
            
            return result
            
        except Exception as e:
            return {
                "error": f"Prediction failed: {str(e)}",
                "stress_level": "Unknown",
                "confidence": 0,
                "keywords": [],
                "severity_score": 0
            }