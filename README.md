# 🌱 Smart Farming AI (AgriSaar)

## 🚀 Overview

Smart Farming AI is an intelligent decision-support system designed to help farmers make data-driven agricultural decisions. It transforms complex soil lab reports into simple, actionable insights including crop recommendations, fertilizer plans, weather-based advisories, and government scheme eligibility.

**"We convert complex soil data into simple farming decisions."**

---

## 🎯 Problem Statement

Farmers often receive technical soil reports that are difficult to understand. Due to lack of proper guidance, they:
* Select unsuitable crops
* Overuse or misuse fertilizers
* Ignore soil health
* Miss government benefits

This leads to reduced productivity, increased costs, and long-term soil degradation.

---

## 💡 Solution

Smart Farming AI bridges the gap between **soil data and real-world farming decisions** by providing:
* 🌾 Best crop recommendations
* 🧪 Precise fertilizer advisory
* 📊 Soil health analysis
* 🌧️ Weather-aware alerts
* 💰 Government scheme recommendations
* 📅 Step-by-step farming action plan

---

## 🔥 Key Features

### Core Features
* Soil report upload (PDF/Image)
* Manual soil data entry
* Soil health score and analysis
* Crop recommendation engine
* Fertilizer advisory (type, quantity, timing)
* Simple explanation (English + Hindi)

### Advanced Features
* Weather-based smart alerts
* Government scheme eligibility checker
* Action calendar for farming tasks
* Voice-based input (Hindi)
* Historical soil report tracking
* Market price prediction
* Mandi comparison

---

## 🛠️ Tech Stack

### Frontend
* React.js
* Tailwind CSS
* Recharts
* React Hook Form + Zod
* Lucide Icons

### Backend
* Node.js
* Express.js
* Google Gemini AI (2.5 Flash)
* Multer (file upload)
* OpenWeatherMap API

---

## 🧠 How It Works

1. User uploads soil report or enters data manually
2. System analyzes soil parameters (N, P, K, pH, etc.)
3. Generates soil health score (0-100)
4. Recommends best crops with suitability score
5. Suggests fertilizers with proper dosage and timing
6. Provides simple Hinglish explanation and actionable plan
7. Adds weather alerts and government scheme suggestions

---

## 📦 Folder Structure

```
smart-farming-ai/
├── backend/
│   ├── server.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/      (10 AI service modules)
│   ├── models/
│   ├── middleware/
│   └── utils/
├── frontend/
│   ├── src/
│   │   ├── pages/     (9 pages)
│   │   ├── components/ (13 components)
│   │   ├── services/
│   │   ├── hooks/
│   │   └── styles/
├── docs/
└── README.md
```

---

## ▶️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/your-username/smart-farming-ai.git
cd smart-farming-ai
```

### 2. Set Environment Variables
```bash
cp .env.example .env
# Edit .env and add your API keys
```

### 3. Install All Dependencies
```bash
npm run install:all
```

### 4. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 5. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 6. Run Both Together
```bash
npm run dev
```

---

## 🔑 Environment Variables (.env)

```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

---

## 🧪 Sample Use Case

👉 A farmer uploads a soil report
👉 System analyzes it and outputs:
* Soil Health Score: 62/100
* Best Crops: Wheat, Gram
* Fertilizer Plan: Urea + DAP with timing
* Weather Alert: Rain expected → delay fertilizer
* Scheme: Eligible for PM-Kisan

---

## 🎯 Target Users
* Farmers
* Agricultural advisors
* Government agencies
* Agri startups

---

## 🏆 Hackathon Value
* Solves real-world agricultural problems
* High social impact
* Combines AI + sustainability
* Practical and scalable solution

---

## 📌 Future Scope
* Mobile app for farmers
* Satellite-based soil insights
* AI chatbot for agriculture queries
* Marketplace integration (seeds, fertilizers)

---

## 👨‍💻 Author
* Abdul Haque

---

## 📜 License
This project is open-source and available under the MIT License.
