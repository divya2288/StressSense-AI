# Stress Detection ML Service

AI-powered stress and burnout detection using NLP and machine learning.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Train the model:
```bash
python train_model.py
```

3. Run the Flask API:
```bash
python app.py
```

## API Endpoints

### 1. Text-based Stress Detection
```bash
POST http://localhost:5000/predict
Content-Type: application/json

{
  "text": "I feel overwhelmed with deadlines"
}
```

### 2. Burnout Detection
```bash
POST http://localhost:5000/burnout
Content-Type: application/json

{
  "workload": 8,
  "sleep_hours": 4,
  "motivation": 2,
  "social_withdrawal": 7,
  "emotional_exhaustion": 8,
  "cynicism": 6
}
```

## Model Performance

- Algorithm: Random Forest Classifier
- Features: TF-IDF (1000 features, 1-2 grams)
- Accuracy: ~85-90% (depends on dataset)
- Classes: Low (0), Medium (1), High (2) Stress