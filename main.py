"""
=============================================================================
  MediSense AI - FastAPI Backend
  File: main.py
  Description: This is the main server file. It creates a web server using
               FastAPI that listens for symptom data, sends it to Google's
               Gemini API for analysis, and returns the AI's response.

  ⭐ SWITCHED FROM: OpenAI GPT (paid, quota limited)
  ⭐ SWITCHED TO:   Google Gemini API (FREE tier available!)
                   Free tier: 15 requests/min, 1500 requests/day
                   Get your free key at: https://aistudio.google.com/apikey

=============================================================================

  HOW IT WORKS (Simple Flow):
  1. Your frontend sends a POST request to /api/analyze with a JSON body
     containing a "symptoms" string, e.g. { "symptoms": "headache and fever" }
  2. This server receives the symptoms.
  3. It forwards the symptoms to the Google Gemini API as a prompt.
  4. Gemini sends back an AI-generated analysis in JSON format.
  5. This server sends that JSON analysis back to your frontend.

=============================================================================
"""

# --- IMPORTS ---
# We import all the libraries (tools) we need for this server to work.

# 'os' lets us read environment variables (like our secret API key) from the system.
import os

# 'json' lets us convert text into Python dictionaries and vice versa.
import json

# 'dotenv' reads the .env file and loads the variables inside it into our environment.
# This is how we keep secrets (like API keys) OUT of our code.
from dotenv import load_dotenv

# 'FastAPI' is the web framework we use to create our server and define routes.
# 'HTTPException' lets us send back proper error messages with HTTP status codes.
from fastapi import FastAPI, HTTPException

# 'CORSMiddleware' handles Cross-Origin Resource Sharing (CORS).
# Without this, web browsers BLOCK requests from a frontend (e.g., on port 5500)
# to a backend on a different port (e.g., port 8000). This middleware says "it's OK".
from fastapi.middleware.cors import CORSMiddleware

# 'BaseModel' from Pydantic lets us define the exact shape of data we expect to receive.
# FastAPI uses this to automatically validate incoming request data.
from pydantic import BaseModel

# 'genai' is the official Google Generative AI Python library for talking to Gemini.
import google.generativeai as genai


# =============================================================================
# STEP 1: Load Environment Variables
# =============================================================================
# This reads the .env file in the same folder and loads the values inside it.
# After this line runs, we can access our API key using os.getenv().
load_dotenv()


# =============================================================================
# STEP 2: Create the FastAPI Application Instance
# =============================================================================
# 'app' is our server object. All our routes (endpoints) will be attached to it.
app = FastAPI(
    title="MediSense AI API",
    description="A FastAPI backend that analyzes patient symptoms using Google Gemini.",
    version="2.0.0",
)


# =============================================================================
# STEP 3: Add CORS Middleware
# =============================================================================
# This is CRITICAL for allowing your frontend to talk to this server.
# Browsers enforce a "Same-Origin Policy" — they block requests between different
# origins (domains/ports). CORS Middleware tells the browser: "Requests from
# any origin are allowed."
#
# For production, replace allow_origins=["*"] with your specific frontend URL.
# Read the allowed frontend origin from an environment variable.
# - In production on Render: set FRONTEND_URL=https://your-app.vercel.app
# - In local development: leave it unset — it defaults to "*" so everything works.
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

# If a specific URL is provided, use only that. Otherwise allow all origins.
allowed_origins = [FRONTEND_URL] if FRONTEND_URL != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Locked to your Vercel URL in production.
    allow_credentials=True,
    allow_methods=["*"],            # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],            # Allows all headers (Content-Type, etc.)
)


# =============================================================================
# STEP 4: Initialize the Google Gemini Client
# =============================================================================
# We read the API key from the environment and configure the Gemini library.
# Get your FREE key at: https://aistudio.google.com/apikey
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("⚠️  WARNING: GEMINI_API_KEY not found in environment variables!")
    print("   Please create a .env file with your API key. See .env.example for details.")
    print("   Get a free key at: https://aistudio.google.com/apikey")

# Configure the Gemini library with your API key.
genai.configure(api_key=api_key)

# Create the Gemini model instance.
# "gemini-1.5-flash" is fast, capable, and available on the FREE tier.
# Free tier limits: 15 requests/minute, 1500 requests/day — plenty for development!
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    # ⭐ CRUCIAL: This forces Gemini to ALWAYS return a valid JSON object.
    # This is the Gemini equivalent of OpenAI's response_format={"type": "json_object"}.
    generation_config=genai.types.GenerationConfig(
        response_mime_type="application/json",
        temperature=0.2,  # Low temperature = consistent, deterministic responses
    ),
)


# =============================================================================
# STEP 5: Define the Request Body Model (Data Shape Validation)
# =============================================================================
# This class defines what data we EXPECT to receive in the POST request body.
# Pydantic will automatically validate that "symptoms" is present and is a string.
class SymptomRequest(BaseModel):
    """Defines the expected shape of the incoming JSON request body."""

    # 'symptoms' is a required string field.
    # Example value: "I have a headache, fever, and sore throat for 2 days."
    symptoms: str


# =============================================================================
# STEP 6: Define the System Prompt for Gemini
# =============================================================================
# The SYSTEM PROMPT tells the AI model WHO it is and HOW it should behave.
# You mentioned you will provide the final prompt later — replace the text
# inside the triple-quotes below with your real prompt when you're ready.
#
# IMPORTANT: Since we set response_mime_type="application/json", the prompt
# MUST instruct the model to respond with JSON. The library requires this.
SYSTEM_PROMPT = """
You are MediSense AI, a helpful and empathetic medical AI assistant.
Your role is to analyze patient-reported symptoms and provide a preliminary,
informational assessment. You are NOT a replacement for a real doctor.

Always respond with a valid JSON object containing the exact following structure. 
It is CRITICAL that "possible_conditions" is a list of objects, and "probability" is a number.

Example response format:
{
  "possible_conditions": [
    {
      "name": "Common Cold",
      "probability": 85,
      "description": "A mild viral infection of the nose and throat."
    },
    {
      "name": "Allergies",
      "probability": 40,
      "description": "An immune system reaction to a foreign substance."
    }
  ],
  "urgency_level": "Low",
  "recommendations": [
    "Rest and drink fluids",
    "Take over-the-counter fever reducers if needed"
  ],
  "disclaimer": "EDUCATIONAL TOOL ONLY — THIS IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT."
}
"""
# NOTE TO DEVELOPER: Replace the content of SYSTEM_PROMPT above with your
# finalized prompt when you're ready!


# =============================================================================
# STEP 7: Define the API Endpoint (The Main Route)
# =============================================================================
# This is the heart of our API. The @app.post decorator registers this function
# as a handler for HTTP POST requests to the "/api/analyze" path.
@app.post("/api/analyze")
async def analyze_symptoms(request: SymptomRequest):
    """
    Analyzes patient symptoms using the Google Gemini API.

    Receives:
        request (SymptomRequest): A JSON body with a 'symptoms' string.

    Returns:
        A JSON object with the AI's medical analysis.
    """

    # Safety check: Make sure the symptoms field is not empty or just whitespace.
    if not request.symptoms.strip():
        # HTTPException sends a proper HTTP error response back to the client.
        # Status code 400 means "Bad Request" — the client sent invalid data.
        raise HTTPException(
            status_code=400,
            detail="The 'symptoms' field cannot be empty. Please describe your symptoms."
        )

    # Good practice: Print a log message so you can see activity in your terminal.
    print(f"\n📨 Received analysis request.")
    print(f"   Symptoms: {request.symptoms[:100]}...")  # Only print first 100 chars

    # --- Call the Gemini API ---
    # We wrap this in a try-except block so that if anything goes wrong
    # (network error, invalid API key, etc.), we send a friendly message back.
    try:
        print("🤖 Sending request to Google Gemini...")

        # Build the full prompt by combining the system instructions with the
        # user's symptoms. Gemini's generate_content() takes a single prompt string.
        full_prompt = f"{SYSTEM_PROMPT}\n\nPlease analyze the following symptoms: {request.symptoms}"

        # Make the API call to Gemini.
        response = model.generate_content(full_prompt)

        # Extract the text content from the response object.
        raw_content = response.text

        print("✅ Successfully received response from Gemini.")

        # Convert the JSON string from Gemini into a Python dictionary.
        # We then return it directly — FastAPI automatically converts it
        # back into a JSON HTTP response for the client.
        analysis_result = json.loads(raw_content)

        return analysis_result

    except json.JSONDecodeError:
        # This error means Gemini returned something that isn't valid JSON.
        # This is rare since we forced application/json response type.
        print("❌ Error: Could not parse JSON response from Gemini.")
        raise HTTPException(
            status_code=500,
            detail="The AI returned an invalid response format. Please try again."
        )

    except Exception as e:
        # Catch any other unexpected errors (network issues, invalid API key, etc.)
        print(f"❌ An unexpected error occurred: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while contacting the AI service: {str(e)}"
        )


# =============================================================================
# STEP 8: Add a Simple Health-Check Endpoint
# =============================================================================
# A GET request to "/" lets you quickly confirm the server is alive and running.
@app.get("/")
def health_check():
    """A simple health check to confirm the server is running."""
    return {"status": "ok", "message": "MediSense AI Backend is running! 🩺 (Powered by Gemini)"}


# =============================================================================
# STEP 9: Entry Point for Direct Python Execution (Optional)
# =============================================================================
# This block only runs if you execute this file DIRECTLY with Python:
#   > python main.py
#
# The RECOMMENDED way to run is: py -m uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn

    print("🚀 Starting MediSense AI server (Gemini edition)...")
    uvicorn.run(
        "main:app",   # "filename:FastAPI_instance_variable"
        host="0.0.0.0",  # Listen on all network interfaces
        port=8000,        # Access via http://localhost:8000
        reload=True,      # Auto-restart when you save changes
    )
