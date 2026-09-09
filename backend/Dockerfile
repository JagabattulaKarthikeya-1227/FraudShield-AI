# ---------------------------------------------------------
# Stage 1: Build & Dependencies
# ---------------------------------------------------------
FROM python:3.12-slim as builder

WORKDIR /app

# Install system dependencies required for compiling Python packages (e.g. numpy, scikit-learn)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies into a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---------------------------------------------------------
# Stage 2: Production Runtime
# ---------------------------------------------------------
FROM python:3.12-slim

WORKDIR /app

# Copy the pre-built virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Create a non-root user for security
RUN groupadd -r fraudshield && useradd -r -g fraudshield fraudshield_user
RUN chown -R fraudshield_user:fraudshield /app

COPY . .

# Ensure the ML models directory has the correct permissions
RUN mkdir -p /app/ml_models && chown -R fraudshield_user:fraudshield /app/ml_models

USER fraudshield_user

EXPOSE 5000

# The default command runs the Gunicorn WSGI server for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--worker-class", "gevent", "run:app"]
