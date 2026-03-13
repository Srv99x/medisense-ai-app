# =============================================================================
#  MediSense AI — Dockerfile for Hugging Face Spaces (Docker SDK)
#
#  Hugging Face Spaces requires the app to listen on port 7860.
#  The GEMINI_API_KEY must be set as a Space Secret in the HF settings.
# =============================================================================

# Use a slim Python 3.11 base image for a small, fast build
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy only the dependency list first (improves Docker layer caching)
COPY requirements.txt .

# Install Python dependencies (no cache to keep image size small)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application source files
COPY main.py .

# Expose port 7860 — this is the ONLY port Hugging Face Spaces forwards traffic to
EXPOSE 7860

# Start the FastAPI server on port 7860
# --host 0.0.0.0 makes it reachable from outside the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
