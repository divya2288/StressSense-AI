from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ======================================================
# STRESS DETECTOR (RULE BASED)
# ======================================================

class StressDetector:

    def __init__(self):
        self.keywords = ["stress","overwhelmed","anxious","panic","depressed","burnout","tired","pressure"]

    def predict(self,text):

        text=text.lower()
        hits=sum(1 for k in self.keywords if k in text)

        if hits>=2:
            level="High Stress"
            score=2
        elif hits==1:
            level="Medium Stress"
            score=1
        else:
            level="Low Stress"
            score=0

        return {
            "stress_level":level,
            "severity_score":score,
            "confidence":80,
            "keywords":[k for k in self.keywords if k in text],
            "timestamp":datetime.now().isoformat(),
            "input_text":text
        }

# ======================================================
# BURNOUT DETECTOR
# ======================================================

class BurnoutDetector:

    def detect(self,data):

        score=0

        score+=3 if data["workload"]>=8 else 2 if data["workload"]>=6 else 0
        score+=4 if data["sleep_hours"]<5 else 2 if data["sleep_hours"]<6 else 0
        score+=3 if data["motivation"]<=3 else 2 if data["motivation"]<=5 else 0
        score+=2 if data["social_withdrawal"]>=7 else 1 if data["social_withdrawal"]>=5 else 0
        score+=3 if data["emotional_exhaustion"]>=8 else 2 if data["emotional_exhaustion"]>=6 else 0
        score+=2 if data["cynicism"]>=7 else 1 if data["cynicism"]>=5 else 0

        percent=round((score/17)*100,1)

        if percent>70:
            risk="High"
        elif percent>40:
            risk="Moderate"
        else:
            risk="Low"

        return {
            "burnout_risk":risk,
            "risk_percentage":percent,
            "score":score,
            "recommendation":"Take rest & talk to someone" if risk=="High" else "Maintain balance",
            "timestamp":datetime.now().isoformat()
        }

stress_detector=StressDetector()
burnout_detector=BurnoutDetector()

# ======================================================
# ROUTES
# ======================================================

@app.route("/")
def home():
    return jsonify({"status":"StressSense ML running"})

@app.route("/health")
def health():
    return jsonify({"status":"healthy"})

@app.route("/predict",methods=["POST"])
def predict():

    data=request.json
    text=data.get("text","")

    if len(text)<3:
        return jsonify({"error":"Text too short"}),400

    result=stress_detector.predict(text)

    return jsonify(result)

@app.route("/burnout",methods=["POST"])
def burnout():

    data=request.json

    required=["workload","sleep_hours","motivation","social_withdrawal","emotional_exhaustion","cynicism"]

    for r in required:
        if r not in data:
            return jsonify({"error":f"Missing {r}"}),400

    result=burnout_detector.detect(data)

    return jsonify(result)

@app.route("/analyze-combined",methods=["POST"])
def combined():

    data=request.json

    stress=stress_detector.predict(data["text"])
    burnout=burnout_detector.detect(data["questionnaire"])

    combined=(stress["severity_score"]*20 + burnout["risk_percentage"])/2

    return jsonify({
        "stress":stress,
        "burnout":burnout,
        "combined_score":round(combined,1),
        "status":"Critical" if combined>70 else "Moderate" if combined>40 else "Low"
    })

# ======================================================

if __name__=="__main__":

    print("ML SERVER RUNNING → http://127.0.0.1:5000")

    app.run(debug=True,host="0.0.0.0",port=5000)
