from pathlib import Path
from typing import Any, Dict, List
import joblib
import numpy as np

from .config import MODELS_DIR
from .schemas import (
    CalorieFactorContribution,
    CaloriesPredictionResponse,
    LevelPredictionResponse,
    LevelProbability,
    UserStatsInput,
)

_models_loaded = False
_simple_lr = None
_multi_lr = None
_log_reg = None
_scaler_num = None
_scaler_all = None
_encoder = None
_metadata: Dict[str, Any] = {}


def load_models_service():
    global _models_loaded, _simple_lr, _multi_lr, _log_reg, _scaler_num, _scaler_all, _encoder, _metadata

    simple_path = MODELS_DIR / "simple_linear_regression.joblib"
    multi_path = MODELS_DIR / "multiple_linear_regression.joblib"
    log_path = MODELS_DIR / "logistic_regression.joblib"
    scaler_path = MODELS_DIR / "scaler.joblib"
    scaler_all_path = MODELS_DIR / "scaler_all.joblib"
    encoder_path = MODELS_DIR / "encoder.joblib"
    meta_path = MODELS_DIR / "training_metadata.joblib"

    if not all(p.exists() for p in [simple_path, multi_path, log_path, scaler_path, encoder_path, meta_path]):
        raise RuntimeError(
            f"Model artifacts not found in {MODELS_DIR}. Run scripts/train_models.py first."
        )

    _simple_lr = joblib.load(simple_path)
    _multi_lr = joblib.load(multi_path)
    _log_reg = joblib.load(log_path)
    _scaler_num = joblib.load(scaler_path)
    _scaler_all = joblib.load(scaler_all_path)
    _encoder = joblib.load(encoder_path)
    _metadata = joblib.load(meta_path)
    _models_loaded = True
    print("[✓] All ML models loaded into memory successfully.")


def are_models_ready() -> bool:
    return _models_loaded


def _build_feature_vectors(inp: UserStatsInput):
    # Calculate BMI
    bmi = round(inp.weight_kg / (inp.height_m ** 2), 2)

    # Numeric feature order:
    # ["Age", "Weight (kg)", "Height (m)", "Max_BPM", "Avg_BPM", "Resting_BPM",
    #  "Session_Duration (hours)", "Fat_Percentage", "Water_Intake (liters)",
    #  "Workout_Frequency (days/week)", "BMI"]
    num_vec = np.array([
        inp.age,
        inp.weight_kg,
        inp.height_m,
        inp.max_bpm,
        inp.avg_bpm,
        inp.resting_bpm,
        inp.session_duration_hours,
        inp.fat_percentage,
        inp.water_intake_liters,
        inp.workout_frequency_days,
        bmi,
    ]).reshape(1, -1)

    # Categorical encoding: [Gender, Workout_Type]
    cat_raw = np.array([[inp.gender, inp.workout_type]])
    cat_encoded = _encoder.transform(cat_raw)

    full_vector = np.hstack([num_vec, cat_encoded])
    return num_vec, full_vector, bmi


def predict_calories(inp: UserStatsInput) -> CaloriesPredictionResponse:
    if not _models_loaded:
        load_models_service()

    num_vec, full_vec, bmi = _build_feature_vectors(inp)

    # 1. Simple Linear Regression: Session_Duration -> Calories
    duration_arr = np.array([[inp.session_duration_hours]])
    pred_simple = float(_simple_lr.predict(duration_arr)[0])

    # 2. Multiple Linear Regression: all_features -> Calories
    pred_multiple = float(_multi_lr.predict(full_vec)[0])

    # Calculate contribution breakdown
    coefs = _multi_lr.coef_
    all_names = _metadata["all_feature_names"]
    intercept = float(_multi_lr.intercept_)

    contributions: List[CalorieFactorContribution] = []
    for val, coef, name in zip(full_vec[0], coefs, all_names):
        # Ignore zero dummy inputs in top display for clarity
        if val != 0:
            contributions.append(
                CalorieFactorContribution(
                    feature=name,
                    value=round(float(val), 2),
                    weight=round(float(coef), 2),
                    contribution=round(float(val * coef), 2),
                )
            )

    # Sort by absolute contribution impact
    contributions.sort(key=lambda x: abs(x.contribution), reverse=True)

    slr_meta = _metadata["simple_linear_regression"]
    mlr_meta = _metadata["multiple_linear_regression"]

    return CaloriesPredictionResponse(
        predicted_calories_multiple=round(max(50.0, pred_multiple), 1),
        predicted_calories_simple=round(max(50.0, pred_simple), 1),
        bmi=bmi,
        simple_regression_equation=slr_meta["equation"],
        multiple_regression_intercept=round(intercept, 2),
        top_contributing_factors=contributions[:6],
        r2_score_multiple=round(mlr_meta["r2_score"], 4),
        r2_score_simple=round(slr_meta["r2_score"], 4),
        rmse_multiple=round(mlr_meta["rmse"], 2),
    )


def predict_level(inp: UserStatsInput) -> LevelPredictionResponse:
    if not _models_loaded:
        load_models_service()

    _, full_vec, _ = _build_feature_vectors(inp)
    full_vec_scaled = _scaler_all.transform(full_vec)

    pred_code = int(_log_reg.predict(full_vec_scaled)[0])
    probs = _log_reg.predict_proba(full_vec_scaled)[0]

    level_names = {1: "Beginner", 2: "Intermediate", 3: "Advanced"}
    pred_name = level_names.get(pred_code, "Beginner")

    prob_items: List[LevelProbability] = []
    for cls_code, p in zip(_log_reg.classes_, probs):
        c_int = int(cls_code)
        prob_items.append(
            LevelProbability(
                level_code=c_int,
                level_name=level_names.get(c_int, f"Level {c_int}"),
                probability=round(float(p), 4),
                percentage=round(float(p) * 100, 1),
            )
        )

    # Recommendations based on classified level
    if pred_code == 1:
        rec = "Focus on aerobic base building, proper movement mechanics, and consistent 3x/week workout frequency before pushing for higher intensity."
    elif pred_code == 2:
        rec = "You have established solid endurance and metabolic adaptation. Introduce structured progressive overload and periodized HIIT training."
    else:
        rec = "High conditioning index detected. Optimize recovery windows, nutrition timing, and sport-specific peak performance intervals."

    clf_meta = _metadata["logistic_regression"]

    return LevelPredictionResponse(
        predicted_level_code=pred_code,
        predicted_level_name=pred_name,
        probabilities=prob_items,
        model_accuracy=round(clf_meta["accuracy"] * 100, 2),
        confidence=round(float(max(probs)) * 100, 1),
        training_confusion_matrix=clf_meta["confusion_matrix"],
        recommendation=rec,
    )

