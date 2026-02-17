import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
from utils.text_preprocessor import TextPreprocessor

def train_stress_model():
    print("🚀 Starting Model Training...")
    
    # Load data
    df = pd.read_csv('data/stress_dataset.csv')
    print(f"✅ Loaded {len(df)} samples")
    
    # Preprocess
    preprocessor = TextPreprocessor()
    df['cleaned_text'] = df['text'].apply(preprocessor.preprocess)
    
    # Features and labels
    X = df['cleaned_text']
    y = df['stress_level']
    
    print(f"📊 Class distribution:")
    print(y.value_counts())
    
    # Vectorize
    vectorizer = TfidfVectorizer(
        max_features=1000,
        ngram_range=(1, 2),
        min_df=2
    )
    X_vec = vectorizer.fit_transform(X)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_vec, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train model
    print("\n🧠 Training Random Forest...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=20,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n✨ Training Complete!")
    print(f"📈 Accuracy: {accuracy * 100:.2f}%")
    print("\n📋 Classification Report:")
    print(classification_report(y_test, y_pred, 
                                target_names=['Low Stress', 'Medium Stress', 'High Stress']))
    
    # Save models
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/stress_classifier.pkl')
    joblib.dump(vectorizer, 'models/vectorizer.pkl')
    joblib.dump(preprocessor, 'models/preprocessor.pkl')
    
    print("\n💾 Models saved successfully!")
    
    # Test with examples
    print("\n🧪 Testing with examples:")
    test_examples = [
        "I have deadlines and feel overwhelmed",
        "Feeling great today, well rested",
        "Moderate stress but managing okay"
    ]
    
    for example in test_examples:
        cleaned = preprocessor.preprocess(example)
        X_example = vectorizer.transform([cleaned])
        pred = model.predict(X_example)[0]
        proba = model.predict_proba(X_example)[0]
        
        labels = ['Low', 'Medium', 'High']
        print(f"\nText: {example}")
        print(f"Prediction: {labels[pred]} Stress")
        print(f"Confidence: {max(proba)*100:.1f}%")

if __name__ == "__main__":
    train_stress_model()