import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from src.main import app

def main():
    with TestClient(app) as client:
        print("1. Testing GET /")
        res = client.get("/")
        assert res.status_code == 200, res.text
        print("   [✓] Root OK:", res.json()["project"])

        print("2. Testing GET /api/health")
        res = client.get("/api/health")
        assert res.status_code == 200, res.text
        print("   [✓] Health OK:", res.json())

        print("3. Testing GET /api/eda/summary")
        res = client.get("/api/eda/summary")
        assert res.status_code == 200, res.text
        data = res.json()
        print(f"   [✓] EDA Summary OK: {data['shape']['rows']} rows, {len(data['dtypes'])} columns, {len(data['outliers'])} outlier features evaluated.")

        print("4. Testing GET /api/eda/charts")
        res = client.get("/api/eda/charts")
        assert res.status_code == 200, res.text
        data = res.json()
        print(f"   [✓] EDA Charts OK: {len(data['calories_histogram'])} histogram bins, {len(data['workout_counts'])} workout categories.")

        print("5. Testing GET /api/insights/correlation")
        res = client.get("/api/insights/correlation")
        assert res.status_code == 200, res.text
        data = res.json()
        print(f"   [✓] Correlation OK: {len(data['matrix'])}x{len(data['matrix'])} matrix, {len(data['multicollinearity_flags'])} multicollinearity flags, {len(data['vif_scores'])} VIF scores.")

        print("6. Testing GET /api/insights/pca")
        res = client.get("/api/insights/pca")
        assert res.status_code == 200, res.text
        data = res.json()
        print(f"   [✓] PCA OK: {len(data['scree_plot'])} scree components, {len(data['loadings'])} feature loadings.")

        sample_user = {
            "age": 28,
            "gender": "Male",
            "weight_kg": 78.5,
            "height_m": 1.78,
            "max_bpm": 180,
            "avg_bpm": 150,
            "resting_bpm": 65,
            "session_duration_hours": 1.5,
            "workout_type": "HIIT",
            "fat_percentage": 17.5,
            "water_intake_liters": 3.0,
            "workout_frequency_days": 4
        }

        print("7. Testing POST /api/predict/calories")
        res = client.post("/api/predict/calories", json=sample_user)
        assert res.status_code == 200, res.text
        data = res.json()
        print(f"   [✓] Calories Predicted: Multiple LR = {data['predicted_calories_multiple']} kcal | Simple LR = {data['predicted_calories_simple']} kcal")
        print(f"       Equation: {data['simple_regression_equation']}")

        print("8. Testing POST /api/predict/level")
        res = client.post("/api/predict/level", json=sample_user)
        assert res.status_code == 200, res.text
        data = res.json()
        probs_str = ", ".join([f"{p['level_name']}: {p['percentage']}%" for p in data['probabilities']])
        print(f"   [✓] Level Predicted: {data['predicted_level_name']} ({probs_str})")

        print("9. Testing POST /api/feedback/sentiment")
        res = client.post("/api/feedback/sentiment", json={"note": "Amazing high energy workout! Felt super strong and accomplished."})
        assert res.status_code == 200, res.text
        data = res.json()
        print(f"   [✓] Sentiment: {data['sentiment_label']} (Score: {data['compound_score']}) | Word frequencies: {len(data['word_frequencies'])}")

        print("\n=======================================================")
        print("  ALL 9 BACKEND ENDPOINTS VALIDATED & TESTED (100% PASS)  ")
        print("=======================================================")

if __name__ == "__main__":
    main()
