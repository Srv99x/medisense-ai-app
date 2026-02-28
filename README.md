<div align="center">

# 🩺 MediSense AI

### AI-Powered Neural Symptom Analysis

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://your-app.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://your-api.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> Describe your symptoms. Get an instant AI-powered preliminary analysis — powered by **Google Gemini**.

</div>

---

## ✨ Features

- 🤖 **AI Symptom Analysis** — Sends your symptoms to Google Gemini and returns a structured medical overview
- 📊 **Condition Probability Cards** — Visual breakdown of possible conditions with probability bars
- 🚨 **Urgency Level Detection** — Low / Medium / High urgency rating with color-coded indicators
- 💊 **Care Recommendations** — AI-generated next steps tailored to your symptoms
- ⚡ **Instant Fallback** — Falls back to curated mock data if the API is unavailable (great for demos)
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🌐 **Production Ready** — Deployed on Vercel (frontend) + Render (backend)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **UI Components** | shadcn/ui, Radix UI, Tailwind CSS |
| **Icons** | Lucide React |
| **Backend** | Python, FastAPI |
| **AI Model** | Google Gemini 2.5 Flash (`gemini-2.5-flash`) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render (free tier) |

---

## 🗂️ Project Structure

```
medisense-ai-app/
│
├── main.py                     # FastAPI backend — Gemini API integration
├── requirements.txt            # Python dependencies
├── .env.example                # Template for backend secrets
│
└── medisense-dashboard/        # React + Vite frontend
    ├── src/
    │   ├── pages/Index.tsx     # Main symptom analyzer UI
    │   └── components/         # shadcn/ui component library
    ├── public/
    │   └── favicon.svg         # Custom MediSense icon
    ├── index.html
    └── .env.example            # Template for frontend env vars
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- **Python** 3.10+
- A **Google Gemini API key** (free at [aistudio.google.com](https://aistudio.google.com/apikey))

### 1. Clone the repository

```bash
git clone https://github.com/Srv99x/medisense-ai-app.git
cd medisense-ai-app
```

### 2. Set up the Backend

```bash
# Install Python dependencies
pip install -r requirements.txt

# Create your environment file
cp .env.example .env
```

Open `.env` and add your key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Start the backend server:

```bash
uvicorn main:app --reload
# API is now live at http://localhost:8000
```

### 3. Set up the Frontend

```bash
cd medisense-dashboard

# Install Node dependencies
npm install

# Create your environment file
cp .env.example .env.local
```

Open `.env.local` and set the backend URL:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend dev server:

```bash
npm run dev
# App is now live at http://localhost:8080
```

---

## 🔌 API Reference

### `POST /api/analyze`

Analyzes patient-reported symptoms using the Gemini API.

**Request body:**
```json
{
  "symptoms": "I have a headache, fever, and sore throat for 2 days."
}
```

**Response:**
```json
{
  "possible_conditions": [
    {
      "name": "Common Cold",
      "probability": 82,
      "description": "A mild viral infection of the nose and throat."
    }
  ],
  "urgency_level": "Low",
  "recommendations": [
    "Rest and drink plenty of fluids",
    "Monitor temperature every 4 hours"
  ],
  "disclaimer": "EDUCATIONAL TOOL ONLY — NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE."
}
```

### `GET /`

Health check endpoint — returns `{ "status": "ok" }`.

---

## ☁️ Deployment

### Backend → Render

1. Push your code to GitHub
2. Create a **New Web Service** on [render.com](https://render.com) pointing to your repo
3. Set the **Start Command**:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. Add **Environment Variables** in the Render dashboard:
   | Variable | Value |
   |---|---|
   | `GEMINI_API_KEY` | Your Gemini API key |
   | `FRONTEND_URL` | Your Vercel deployment URL |

### Frontend → Vercel

1. Import your GitHub repo at [vercel.com](https://vercel.com)
2. Set the **Root Directory** to `medisense-dashboard`
3. Add **Environment Variables**:
   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | Your Render backend URL |

> **Note:** The Render free tier spins down after 15 min of inactivity. The first request may take ~30 seconds to wake up. The app has built-in fallback mock data so demos always work.

---

## ⚠️ Disclaimer

MediSense AI is an **educational tool only**. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition.

---

## 👤 Author

**Sourav** — [@Srv99x](https://github.com/Srv99x)

*Built as a portfolio project demonstrating full-stack AI integration.*

---

<div align="center">

**⭐ Star this repo if you found it useful!**

</div>
