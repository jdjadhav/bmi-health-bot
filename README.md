# Healthcare BMI Bot
Live Demo: https://bmi-health-bot.onrender.com

A simple full-stack application to calculate BMI using a Python-based Machine Learning service and a Node.js backend.

## Project Structure

- `frontend/`: HTML, CSS, JS for the user interface.
- `backend/`: Node.js Express server acting as an API gateway.
- `ml_service/`: Python Flask service running the BMI prediction model.
- `dataset/`: Dataset used to train the BMI model.

## Prerequisites

- Node.js & npm
- Python 3.x
- pip

## Setup Instructions

### 1. Install Dependencies

Open a terminal in the `ml_service` directory:
```bash
cd ml_service
pip install flask flask-cors pandas scikit-learn
```

### 2. Train Model and Run App

Train the model:
```bash
python train_model.py
```

Start the Application:
```bash
python app.py
```

### 3. Usage

Open your browser and navigate to:
`http://localhost:5000`

Enter your Height (cm) and Weight (kg) to get your BMI prediction!

