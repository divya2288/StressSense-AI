import re
import nltk
from nltk.corpus import stopwords

# Download required NLTK data (run once)
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class TextPreprocessor:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        # Keep stress-related words
        self.stress_keywords = {
            'stressed', 'anxious', 'worried', 'overwhelmed', 
            'tired', 'exhausted', 'depressed', 'burnout'
        }
        self.stop_words -= self.stress_keywords
    
    def clean_text(self, text):
        # Lowercase
        text = text.lower()
        
        # Remove special characters
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Remove extra spaces
        text = ' '.join(text.split())
        
        return text
    
    def remove_stopwords(self, text):
        words = text.split()
        filtered = [w for w in words if w not in self.stop_words]
        return ' '.join(filtered)
    
    def preprocess(self, text):
        text = self.clean_text(text)
        text = self.remove_stopwords(text)
        return text