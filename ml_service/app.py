from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import numpy as np
import os

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend')

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
CORS(app)

# Load the trained model
try:
    model_path = os.path.join(os.path.dirname(__file__), "bmi_model.pkl")
    model = pickle.load(open(model_path, "rb"))
except FileNotFoundError:
    model = None
    print(f"Model file not found at {model_path}. Please train the model first.")

@app.route('/')
def serve_dashboard():
    return send_from_directory(app.static_folder, 'dashboard.html')

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500

    data = request.json
    height = float(data.get('height'))
    weight = float(data.get('weight'))
    
    # Calculate BMI
    bmi = weight / ((height / 100) ** 2)
    
    # Predict label
    prediction = model.predict([[height, weight]])[0]
    
    # Dynamic Recommendations Pools
    import random
    
    diet_pools = {
        'Underweight': [
            "Add healthy fats like avocados, nuts, and olive oil.",
            "Eat more protein-rich foods like chicken, eggs, and beans.",
            "Include complex carbohydrates like oats and brown rice.",
            "Snack on dried fruits and smoothies for extra calories.",
            "Eat more frequently (5-6 small meals a day).",
            "Drink milk or protein shakes post-workout."
        ],
        'Normal': [
            "Maintain a balanced diet with varied nutrients.",
            "Stay hydrated with at least 8 glasses of water daily.",
            "Eat seasonal fruits and vegetables for variety.",
            "Limit processed foods and sugary snacks.",
            "Ensure you get enough fiber from whole grains.",
            "Practice mindful eating portion control."
        ],
        'Overweight': [
            "Reduce intake of processed sugars and sweets.",
            "Increase fiber intake with leafy greens and legumes.",
            "Practice portion control directly on your plate.",
            "Drink a glass of water before every meal.",
            "Avoid late-night snacking.",
            "Choose lean proteins over fatty meats."
        ],
        'Obese': [
            "Consult a nutritionist for a personalized plan.",
            "Focus on whole, unprocessed foods.",
            "Eliminate sugary drinks and sodas completely.",
            "Prioritize vegetables at every meal.",
            "Keep a food journal to track intake.",
            "Cook meals at home to control ingredients."
        ]
    }

    exercise_pools = {
        'Underweight': [
            "Focus on strength training to build muscle mass.",
            "Limit excessive cardio which burns too many calories.",
            "Try compound lifts like squats and deadlifts.",
            "Incorporate yoga for flexibility and strength.",
            "Rest adequately to allow muscle recovery."
        ],
        'Normal': [
            "Mix cardio (running, swimming) with strength training.",
            "Aim for 150 minutes of moderate activity per week.",
            "Try flexibility exercises or Pilates.",
            "Join a sports team or group class for fun.",
            "Take the stairs instead of the elevator."
        ],
        'Overweight': [
            "Try High-Intensity Interval Training (HIIT).",
            "Commit to a daily 30-minute brisk walk.",
            "Swim or cycle to reduce joint impact.",
            "Incorporate strength training 2-3 times a week.",
            "Stand up and move every hour if working at a desk."
        ],
        'Obese': [
            "Start with low-impact cardio like swimming or water aerobics.",
            "Try stationary cycling to protect your knees.",
            "Focus on consistency rather than intensity initially.",
            "Incorporate daily walking, gradually increasing distance.",
            "Try chair exercises if mobility is limited."
        ]
    }
    
    insight_pools = {
        'Underweight': ["Focus on gaining strength, not just weight.", "Fuel your body to build a stronger you.", "Consistency in eating is key."],
        'Normal': ["Great job! Keep up your healthy lifestyle.", "Balance is the secret to long-term health.", "Your body thanks you for your care."],
        'Overweight': ["Small daily changes lead to big results.", "Focus on health, not just the scale.", "Every healthy meal is a victory."],
        'Obese': ["A journey of a thousand miles begins with a single step.", "Be patient and kind to yourself.", "Consistent small steps are key to long-term health."]
    }
    
    # Select 3 random tips
    label = prediction
    rec_diet = random.sample(diet_pools.get(label, diet_pools['Normal']), k=min(3, len(diet_pools.get(label, []))))
    rec_exercise = random.sample(exercise_pools.get(label, exercise_pools['Normal']), k=min(3, len(exercise_pools.get(label, []))))
    rec_insight = random.choice(insight_pools.get(label, insight_pools['Normal']))
    
    recommendations = {
        'diet': rec_diet,
        'exercise': rec_exercise,
        'insight': rec_insight
    }

    return jsonify({
        'bmi': round(bmi, 2),
        'label': prediction,
        'recommendations': recommendations
    })

if __name__ == '__main__':
    print(f"Serving frontend from: {FRONTEND_DIR}")
    app.run(port=5000, debug=True)
