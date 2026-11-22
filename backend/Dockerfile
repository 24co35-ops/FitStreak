# Multi-stage Dockerfile for FitStreak FastAPI Backend using uv
FROM python:3.11-slim

# Install system dependencies and uv
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_SYSTEM_PYTHON=1

WORKDIR /app

# Install curl
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*

# Install uv directly
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy pyproject.toml and lockfile
COPY pyproject.toml uv.lock ./

# Install dependencies using uv sync
RUN uv sync --frozen --no-dev

# Copy application source, data, models, and scripts
COPY src ./src
COPY data ./data
COPY models ./models
COPY scripts ./scripts

# Ensure dataset and models are present
RUN uv run python scripts/fetch_dataset.py && uv run python scripts/train_models.py

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]

