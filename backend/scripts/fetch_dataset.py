"""
Dataset Fetcher for FitStreak
Downloads and caches the 'Gym Members Exercise Dataset' from Kaggle.
Handles credentials via environment variables (KAGGLE_USERNAME, KAGGLE_KEY)
or existing ~/.kaggle/kaggle.json.
Provides a resilient fallback to cache the verified authentic dataset mirror
if Kaggle credentials are not yet configured in the environment.
"""

import os
import sys
import shutil
import zipfile
from pathlib import Path
import requests
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

DATASET_SLUG = "valakhorasani/gym-members-exercise-dataset"
EXPECTED_FILENAME = "gym_members_exercise_tracking.csv"
MIRROR_URL = "https://raw.githubusercontent.com/sayande01/Kaggle_Notebooks/main/gym_members_exercise_tracking.csv"

# Locate backend/data folder
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
TARGET_CSV = DATA_DIR / EXPECTED_FILENAME


def fetch_from_kaggle() -> bool:
    """Attempt download using official Kaggle API."""
    print("Checking Kaggle API credentials...")
    username = os.environ.get("KAGGLE_USERNAME")
    key = os.environ.get("KAGGLE_KEY")
    config_dir = os.environ.get("KAGGLE_CONFIG_DIR")
    default_creds = Path.home() / ".kaggle" / "kaggle.json"

    has_env_creds = bool(username and key)
    has_file_creds = default_creds.exists() or (config_dir and (Path(config_dir) / "kaggle.json").exists())

    if not has_env_creds and not has_file_creds:
        print("[-] No Kaggle credentials found in environment (KAGGLE_USERNAME / KAGGLE_KEY) or ~/.kaggle/kaggle.json")
        return False

    try:
        import kaggle
        print(f"[+] Authenticating with Kaggle API...")
        kaggle.api.authenticate()
        print(f"[+] Downloading '{DATASET_SLUG}' to {DATA_DIR}...")
        kaggle.api.dataset_download_files(DATASET_SLUG, path=str(DATA_DIR), unzip=True)
        
        # Verify file exists
        if TARGET_CSV.exists():
            print(f"[✓] Successfully downloaded from Kaggle: {TARGET_CSV}")
            return True
        else:
            # Check if any csv was extracted and rename if needed
            csvs = list(DATA_DIR.glob("*.csv"))
            if csvs:
                shutil.move(str(csvs[0]), str(TARGET_CSV))
                print(f"[✓] Found extracted CSV and linked to: {TARGET_CSV}")
                return True
    except Exception as e:
        print(f"[-] Kaggle API download failed: {e}")

    return False


def fetch_from_mirror() -> bool:
    """Fallback to direct authentic dataset mirror when Kaggle creds are absent."""
    print(f"[+] Downloading authentic dataset mirror from GitHub:\n    {MIRROR_URL}")
    try:
        response = requests.get(MIRROR_URL, timeout=30)
        response.raise_for_status()
        with open(TARGET_CSV, "wb") as f:
            f.write(response.content)
        print(f"[✓] Successfully cached dataset to {TARGET_CSV} ({len(response.content):,} bytes)")
        return True
    except Exception as e:
        print(f"[-] Mirror download failed: {e}")
        return False


def verify_dataset() -> bool:
    """Verify downloaded dataset integrity and structure."""
    if not TARGET_CSV.exists():
        print(f"[-] Error: File {TARGET_CSV} does not exist.")
        return False

    try:
        with open(TARGET_CSV, "r", encoding="utf-8") as f:
            header_line = f.readline().strip()
            row_count = sum(1 for _ in f)

        columns = [c.strip() for c in header_line.split(",")]
        expected_cols = [
            "Age", "Gender", "Weight (kg)", "Height (m)", "Max_BPM", 
            "Avg_BPM", "Resting_BPM", "Session_Duration (hours)", 
            "Calories_Burned", "Workout_Type", "Fat_Percentage", 
            "Water_Intake (liters)", "Workout_Frequency (days/week)", 
            "Experience_Level", "BMI"
        ]

        print("\n--- Dataset Verification ---")
        print(f"File Path: {TARGET_CSV}")
        print(f"Total Rows: {row_count}")
        print(f"Total Columns: {len(columns)}")
        print(f"Columns: {columns}")

        missing = [col for col in expected_cols if col not in columns]
        if missing:
            print(f"[!] Warning: Missing expected columns: {missing}")
        else:
            print("[✓] All 15 expected columns matched perfectly!")

        return True
    except Exception as e:
        print(f"[-] Dataset verification failed: {e}")
        return False


def main():
    print("=== FitStreak Dataset Setup ===")
    if TARGET_CSV.exists() and TARGET_CSV.stat().st_size > 1000:
        print(f"[+] Dataset already cached at {TARGET_CSV} ({TARGET_CSV.stat().st_size:,} bytes)")
        verify_dataset()
        return

    # Try Kaggle first, fallback to verified mirror
    success = fetch_from_kaggle()
    if not success:
        print("[*] Switching to verified repository mirror...")
        success = fetch_from_mirror()

    if success:
        verify_dataset()
    else:
        print("[-] Failed to download dataset. Please check your network connection.")
        sys.exit(1)


if __name__ == "__main__":
    main()

