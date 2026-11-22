import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
CSV_PATH = DATA_DIR / "gym_members_exercise_tracking.csv"

# Server configuration
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8000"))
ENVIRONMENT = os.environ.get("ENVIRONMENT", "development")

CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "capacitor://localhost",
    "http://localhost",
    "https://*",
]
raw_cors = os.environ.get("CORS_ORIGINS", "")
if raw_cors:
    CORS_ORIGINS.extend([origin.strip() for origin in raw_cors.split(",") if origin.strip()])

