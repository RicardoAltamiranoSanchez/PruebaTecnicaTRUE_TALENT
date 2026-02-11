# Stage 1: Builder
FROM python:3.11-slim as builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Final
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Playwright (minimal)
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Copy python dependencies
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

COPY . .

# Install ONLY chromium
RUN playwright install chromium
# RUN playwright install-deps chromium # Skipping this as it fails on some slim images, we rely on manual apt-get if needed
# Instead, we install common deps manually to be safe
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    socat \
    && rm -rf /var/lib/apt/lists/*


ENV PYTHONUNBUFFERED=1

CMD sh -c "socat TCP-LISTEN:8000,fork TCP:backend:8000 & uvicorn main:app --host 0.0.0.0 --port 8001"
