# 🩺 MediSense AI

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://medisense-ai-app.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://your-api.onrender.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-90%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**Describe your symptoms. Get instant AI-powered health insights — structured, urgent-aware, and always honest about its limits.**

[🚀 Try It Live](https://medisense-ai-app.vercel.app) · [📡 API Docs](https://your-api.onrender.com/docs) · [🐛 Report Bug](https://github.com/Srv99x/medisense-ai-app/issues) · [💡 Request Feature](https://github.com/Srv99x/medisense-ai-app/issues)

</div>

## 🤔 Why MediSense?

Most AI health tools just return a wall of text. MediSense is different:

| Feature | Generic ChatGPT | MediSense AI |
|---------|----------------|--------------|
| Structured output | ❌ Unformatted | ✅ Condition cards with probability bars |
| Urgency detection | ❌ None | ✅ Low / Medium / High with color coding |
| Demo reliability | ❌ Fails if API is down | ✅ Built-in fallback mock data |
| Medical disclaimer | ❌ Buried in fine print | ✅ Prominent, on every response |
| Mobile responsive | ❌ Varies | ✅ Fully responsive (Tailwind + shadcn/ui) |

MediSense doesn't pretend to be a doctor. It gives you a **structured, readable starting point** — and always tells you to see a real professional.

---

## ✨ Features

- 🤖 **AI Symptom Analysis** — Structured medical overview powered by Google Gemini 2.5 Flash
- 📊 **Condition Probability Cards** — Visual breakdown of possible conditions with probability bars
- 🚨 **Urgency Level Detection** — Low / Medium / High urgency with color-coded indicators
- 💊 **Care Recommendations** — Tailored next steps based on your symptoms
- ⚡ **Instant Fallback** — Curated mock data if the API is unavailable — demos always work
- 📱 **Fully Responsive** — Mobile, tablet, and desktop ready
- 🌐 **Production Deployed** — Vercel (frontend) + Render (backend)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **UI Components** | shadcn/ui, Radix UI, Tailwind CSS |
| **Icons** | Lucide React |
| **Backend** | Python 3.10+, FastAPI |
| **AI Model** | Google Gemini 2.5 Flash (`gemini-2.5-flash`) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render (free tier) |

---

## 🏗️ Architecture

```
[User] ──symptoms──▶ [React Frontend (Vercel)]
                              │
                         POST /api/analyze
                              │
                     [FastAPI Backend (Render)]
                              │
                    Structured prompt + JSON schema
                              │
                  [Google Gemini 2.5 Flash API]
                              │
                    { conditions, urgency, recommendations }
                              │
                     [React renders result cards]
```

---

## 📁 Project Structure

```
medisense-ai-app/
│
├── main.py                       # FastAPI backend — Gemini API integration
├── requirements.txt              # Python dependencies
├── .env.example                  # Template for backend secrets
├── docs/
│   └── screenshots/              # UI screenshots for README
│
└── medisense-dashboard/          # React + Vite frontend
    ├── src/
    │   ├── pages/Index.tsx       # Main symptom analyzer UI
    │   └── components/           # shadcn/ui component library
    ├── public/
    │   └── favicon.svg
    ├── .env.example              # Template for frontend env vars
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- **Python** 3.10+
- A **Google Gemini API key** — free at [aistudio.google.com](https://aistudio.google.com/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/Srv99x/medisense-ai-app.git
cd medisense-ai-app
```

### 2. Set up the Backend

```bash
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and add your key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Start the backend:

```bash
uvicorn main:app --reload
# API live at http://localhost:8000
# Interactive docs at http://localhost:8000/docs
```

### 3. Set up the Frontend

```bash
cd medisense-dashboard
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
# App live at http://localhost:8080
```

---

## 🔌 API Reference

### `POST /api/analyze`

Analyzes symptoms using the Gemini API and returns a structured health overview.

**Request:**

```json
{
  "symptoms": "I have a headache, fever of 38.5°C, and sore throat for 2 days."
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
    },
    {
      "name": "Influenza",
      "probability": 55,
      "description": "A more severe respiratory illness with systemic symptoms."
    }
  ],
  "urgency_level": "Low",
  "recommendations": [
    "Rest and drink plenty of fluids",
    "Monitor your temperature every 4 hours",
    "Consider OTC fever reducers if temperature exceeds 39°C"
  ],
  "disclaimer": "⚠️ This is an educational tool only. Not a substitute for professional medical advice."
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `possible_conditions` | array | Conditions with name, probability (0–100), and description |
| `urgency_level` | string | `"Low"`, `"Medium"`, or `"High"` |
| `recommendations` | array | AI-generated next steps |
| `disclaimer` | string | Medical disclaimer (always present) |

### `GET /`

Health check — returns `{ "status": "ok" }`.

---

## ☁️ Deployment

### Backend → Render

1. Push to GitHub
2. Create a **New Web Service** on [render.com](https://render.com) pointing to your repo
3. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables**:

| Variable | Value |
|----------|-------|
| `GEMINI_API_KEY` | Your Gemini API key |
| `FRONTEND_URL` | Your Vercel deployment URL |

### Frontend → Vercel

1. Import your GitHub repo at [vercel.com](https://vercel.com)
2. Set **Root Directory** to `medisense-dashboard`
3. Add **Environment Variables**:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your Render backend URL |

> **Note:** Render's free tier spins down after 15 min of inactivity. The first request may take ~30s to wake up. The app has built-in fallback mock data so demos always work regardless.

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

---

## ⚠️ Medical Disclaimer

> **MediSense AI is an educational tool only.**
>
> It is **not** intended to be a substitute for professional medical advice, diagnosis, or treatment. The AI-generated output is based on patterns in training data and may be incomplete or inaccurate. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition. **Never disregard professional medical advice or delay seeking it because of something you read here.**

---

## 👤 Author

**Sourav Chakraborty**
B.Tech CSE | AI/ML Enthusiast | Full-Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/srv99x/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/Srv99x)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
⭐ If MediSense helped you, please give it a star — it helps more people find it!
</div>
