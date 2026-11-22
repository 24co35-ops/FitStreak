"""
FitStreak FastAPI ASGI Entrypoint.
Provides the top-level `app` object for Vercel Functions, Uvicorn, and ASGI servers.
"""
import sys
from pathlib import Path

# Add backend directory and src directory to Python path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from src.main import app

__all__ = ["app"]
