# Healthcare BMI Bot
Live Demo: https://bmi-health-bot.onrender.com

# 🏥 HealthCare-BMI  
### Smart Health Records & AI Wellness Advisor

**HealthCare-BMI** is a healthcare-focused application designed to help users **manage health records, track lifestyle metrics, calculate BMI, and receive AI-powered wellness advice** — all in one place.

This project was developed and presented by **Team NOVA**, and proudly won **HackBattle 2.0 – Coding Competition** organized by **IEEE GHRCEM Student Branch** at **GH Raisoni College of Engineering and Management, Pune**. 🏆

---

## 🚀 Hackathon Achievement

🥇 **Winner – HackBattle 2.0 (Coding Competition)**  
📍 Organized by IEEE GHRCEM Student Branch  
🏫 GH Raisoni College of Engineering and Management, Pune  

> *Innovation, teamwork, and a little bit of madness – that’s how Team NOVA won HackBattle 2.0.*  
>  
> This victory represents not just a win, but the **learning, collaboration, and passion** shared throughout the journey.

---

## 🧠 Problem Statement

Many individuals struggle to:
- Maintain organized health records  
- Track lifestyle habits consistently  
- Understand BMI and its health implications  
- Get personalized health guidance  

**HealthCare-BMI** solves this by providing a **centralized dashboard** with **AI-driven insights** to promote better health decisions.

---
![IMG_3901](https://github.com/user-attachments/assets/87976840-14d6-464c-8400-613557102b39)
![WhatsApp Image 2025-10-02 at 02 18 06_4b928fb0](https://github.com/user-attachments/assets/f7b74413-7707-488d-be58-17d2a0ecca3b)
![IMG_4059](https://github.com/user-attachments/assets/4337618f-6964-415b-a230-921f053ccc91)


## ✨ Features

- 📊 **Health Records Dashboard**
- ⚖️ **BMI Calculation & Classification**
- 🧬 **Lifestyle Tracking**
  - Weight
  - Height
  - Activity level
- 🤖 **AI-Powered Health Advisor**
- 📈 **Personalized Wellness Suggestions**
- 🔐 Secure and user-friendly design

---
 
## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend / Logic:** Python  
- **AI Module:** Rule-based / ML-based health suggestions  
- **Tools:** VS Code, GitHub  
- **Concepts Used:**
  - BMI Algorithms
  - Data Handling
  - Conditional Logic
  - Modular Programming

---
![IMG_3913](https://github.com/user-attachments/assets/48725aab-67ac-4c17-a819-37ab195e3522)


## 📂 Project Structure

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

