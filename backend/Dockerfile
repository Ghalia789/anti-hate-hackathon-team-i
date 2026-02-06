FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create cache directory for transformers
RUN mkdir -p /app/.cache
ENV TRANSFORMERS_CACHE=/app/.cache

# Pre-download models during build to avoid HuggingFace rate limits at runtime
# This adds ~2GB to image but ensures instant startup and no download failures
RUN python download_models.py

# Expose port (Cloud Run uses 8080)
EXPOSE 8080

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Create non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8080/api/health', timeout=5)"

# Run with gunicorn (Cloud Run compatible)
# Optimized: 2 workers, 4 threads each, timeout 120s
CMD exec gunicorn --bind :$PORT --workers 2 --threads 4 --worker-class gthread --timeout 120 --access-logfile - --error-logfile - app:app
