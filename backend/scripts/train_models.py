"""
FitStreak ML Model Training Pipeline
Trains:
1. Simple Linear Regression: Session_Duration -> Calories_Burned
2. Multiple Linear Regression: [All Features + Dummies] -> Calories_Burned
3. Logistic Regression: [All Features + Dummies] -> Experience_Level (1, 2, 3)

Saves trained artifacts and metrics using joblib into backend/models/.
"""

import json
from pathlib import Path
import joblib
import numpy as np
import polars as pl
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, confusion_matrix, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "gym_members_exercise_tracking.csv"
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)


def train_and_export():
    print(f"Loading dataset with Polars from: {DATA_PATH}")
    df = pl.read_csv(DATA_PATH)
    print(f"Dataset shape: {df.shape}")

    # Standardize column mapping
    numeric_features = [
        "Age",
        "Weight (kg)",
        "Height (m)",
        "Max_BPM",
        "Avg_BPM",
        "Resting_BPM",
        "Session_Duration (hours)",
        "Fat_Percentage",
        "Water_Intake (liters)",
        "Workout_Frequency (days/week)",
        "BMI",
    ]
    categorical_features = ["Gender", "Workout_Type"]

    # Extract target arrays via Polars
    y_calories = df["Calories_Burned"].to_numpy()
    y_level = df["Experience_Level"].to_numpy()

    # OneHotEncoder for Categorical features using numpy
    cat_matrix = np.column_stack([df[col].to_list() for col in categorical_features])
    encoder = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
    encoder.fit(cat_matrix)
    cat_feature_names = encoder.get_feature_names_out(categorical_features).tolist()

    encoded_cats = encoder.transform(cat_matrix)
    X_num = df.select(numeric_features).to_numpy()
    X_all = np.hstack([X_num, encoded_cats])
    all_feature_names = numeric_features + cat_feature_names

    # Standard Scaler for numeric features
    scaler = StandardScaler()
    scaler.fit(X_num)

    # -------------------------------------------------------------
    # 1. Simple Linear Regression: Session_Duration -> Calories_Burned
    # -------------------------------------------------------------
    X_simple = df.select(["Session_Duration (hours)"]).to_numpy()
    X_train_s, X_test_s, y_train_cs, y_test_cs = train_test_split(
        X_simple, y_calories, test_size=0.2, random_state=42
    )

    simple_lr = LinearRegression()
    simple_lr.fit(X_train_s, y_train_cs)
    y_pred_s = simple_lr.predict(X_test_s)
    slr_r2 = float(r2_score(y_test_cs, y_pred_s))
    slr_coef = float(simple_lr.coef_[0])
    slr_intercept = float(simple_lr.intercept_)
    slr_rmse = float(np.sqrt(mean_squared_error(y_test_cs, y_pred_s)))

    print(f"\n[Simple Linear Regression]")
    print(f"Equation: Calories_Burned = {slr_coef:.2f} * Duration + {slr_intercept:.2f}")
    print(f"R²: {slr_r2:.4f}, RMSE: {slr_rmse:.2f}")

    # -------------------------------------------------------------
    # 2. Multiple Linear Regression: X_all -> Calories_Burned
    # -------------------------------------------------------------
    X_train_m, X_test_m, y_train_cm, y_test_cm = train_test_split(
        X_all, y_calories, test_size=0.2, random_state=42
    )

    multi_lr = LinearRegression()
    multi_lr.fit(X_train_m, y_train_cm)
    y_pred_m = multi_lr.predict(X_test_m)
    mlr_r2 = float(r2_score(y_test_cm, y_pred_m))
    n = len(y_test_cm)
    p = X_all.shape[1]
    mlr_adj_r2 = float(1 - (1 - mlr_r2) * (n - 1) / (n - p - 1)) if n > p + 1 else mlr_r2
    mlr_rmse = float(np.sqrt(mean_squared_error(y_test_cm, y_pred_m)))

    coefficients_dict = {
        name: float(coef) for name, coef in zip(all_feature_names, multi_lr.coef_)
    }

    print(f"\n[Multiple Linear Regression]")
    print(f"R²: {mlr_r2:.4f}, Adjusted R²: {mlr_adj_r2:.4f}, RMSE: {mlr_rmse:.2f}")
    print(f"Intercept: {float(multi_lr.intercept_):.2f}")
    print(f"Top Coefficients:")
    for k, v in sorted(coefficients_dict.items(), key=lambda item: abs(item[1]), reverse=True)[:5]:
        print(f"  {k}: {v:+.2f}")

    # -------------------------------------------------------------
    # 3. Logistic Regression: X_all -> Experience_Level (1, 2, 3)
    # -------------------------------------------------------------
    scaler_all = StandardScaler()
    X_all_scaled = scaler_all.fit_transform(X_all)

    X_train_clf, X_test_clf, y_train_l, y_test_l = train_test_split(
        X_all_scaled, y_level, test_size=0.2, random_state=42, stratify=y_level
    )

    log_reg = LogisticRegression(max_iter=1000, random_state=42)
    log_reg.fit(X_train_clf, y_train_l)
    y_pred_l = log_reg.predict(X_test_clf)
    clf_acc = float(accuracy_score(y_test_l, y_pred_l))
    conf_matrix = confusion_matrix(y_test_l, y_pred_l).tolist()
    clf_report = classification_report(y_test_l, y_pred_l, output_dict=True)

    print(f"\n[Logistic Regression - Experience Level Classifier]")
    print(f"Accuracy: {clf_acc * 100:.2f}%")
    print(f"Confusion Matrix:\n{np.array(conf_matrix)}")

    # -------------------------------------------------------------
    # 4. Save Models & Metadata
    # -------------------------------------------------------------
    metadata = {
        "dataset_rows": df.height,
        "dataset_cols": df.width,
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
        "cat_feature_names": cat_feature_names,
        "all_feature_names": all_feature_names,
        "experience_level_labels": {1: "Beginner", 2: "Intermediate", 3: "Advanced"},
        "simple_linear_regression": {
            "feature": "Session_Duration (hours)",
            "coefficient": slr_coef,
            "intercept": slr_intercept,
            "r2_score": slr_r2,
            "rmse": slr_rmse,
            "equation": f"Calories = {slr_coef:.2f} × Duration + {slr_intercept:.2f}",
        },
        "multiple_linear_regression": {
            "intercept": float(multi_lr.intercept_),
            "coefficients": coefficients_dict,
            "r2_score": mlr_r2,
            "adjusted_r2_score": mlr_adj_r2,
            "rmse": mlr_rmse,
        },
        "logistic_regression": {
            "accuracy": clf_acc,
            "confusion_matrix": conf_matrix,
            "classes": [int(c) for c in log_reg.classes_],
            "classification_report": clf_report,
        },
    }

    joblib.dump(simple_lr, MODELS_DIR / "simple_linear_regression.joblib")
    joblib.dump(multi_lr, MODELS_DIR / "multiple_linear_regression.joblib")
    joblib.dump(log_reg, MODELS_DIR / "logistic_regression.joblib")
    joblib.dump(scaler, MODELS_DIR / "scaler.joblib")
    joblib.dump(scaler_all, MODELS_DIR / "scaler_all.joblib")
    joblib.dump(encoder, MODELS_DIR / "encoder.joblib")
    joblib.dump(metadata, MODELS_DIR / "training_metadata.joblib")

    # Also export json metadata for convenience
    with open(MODELS_DIR / "training_metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\n[✓] All models and metadata exported successfully to {MODELS_DIR}")


if __name__ == "__main__":
    train_and_export()
