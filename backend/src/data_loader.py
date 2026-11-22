from typing import Dict, List, Tuple
import numpy as np
import polars as pl
from sklearn.preprocessing import StandardScaler
from .config import CSV_PATH

_cached_df: pl.DataFrame = None

NUMERIC_COLUMNS = [
    "Age",
    "Weight (kg)",
    "Height (m)",
    "Max_BPM",
    "Avg_BPM",
    "Resting_BPM",
    "Session_Duration (hours)",
    "Calories_Burned",
    "Fat_Percentage",
    "Water_Intake (liters)",
    "Workout_Frequency (days/week)",
    "BMI",
]

CATEGORICAL_COLUMNS = ["Gender", "Workout_Type", "Experience_Level"]


def load_dataset() -> pl.DataFrame:
    global _cached_df
    if _cached_df is not None:
        return _cached_df

    if not CSV_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at {CSV_PATH}. Please run scripts/fetch_dataset.py first."
        )

    _cached_df = pl.read_csv(CSV_PATH)
    return _cached_df


def get_dataset_info() -> Dict:
    df = load_dataset()
    dtypes_map = {col: str(dtype) for col, dtype in df.schema.items()}
    return {
        "shape": {"rows": df.height, "columns": df.width},
        "dtypes": dtypes_map,
        "numeric_columns": NUMERIC_COLUMNS,
        "categorical_columns": CATEGORICAL_COLUMNS,
    }


def compute_missing_values() -> Dict[str, int]:
    df = load_dataset()
    return {col: df[col].null_count() for col in df.columns}


def compute_describe_stats() -> List[Dict]:
    df = load_dataset()
    describe_list = []
    for col in NUMERIC_COLUMNS:
        series = df[col]
        describe_list.append({
            "feature": col,
            "count": float(len(series)),
            "mean": round(float(series.mean()), 2),
            "std": round(float(series.std()), 2),
            "min": round(float(series.min()), 2),
            "q25": round(float(series.quantile(0.25)), 2),
            "median": round(float(series.median()), 2),
            "q75": round(float(series.quantile(0.75)), 2),
            "max": round(float(series.max()), 2),
        })
    return describe_list


def compute_outliers_iqr() -> Tuple[List[Dict], int]:
    df = load_dataset()
    outlier_stats = []
    
    # We will build an expression to flag rows having outliers across core variables
    filter_expr = pl.lit(False)

    for col in NUMERIC_COLUMNS:
        q1 = float(df[col].quantile(0.25))
        q3 = float(df[col].quantile(0.75))
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr

        col_outlier_expr = (pl.col(col) < lower_bound) | (pl.col(col) > upper_bound)
        outlier_count = df.filter(col_outlier_expr).height
        outlier_pct = round((outlier_count / df.height) * 100, 2)

        outlier_stats.append({
            "feature": col,
            "q1": round(q1, 2),
            "q3": round(q3, 2),
            "iqr": round(iqr, 2),
            "lower_bound": round(lower_bound, 2),
            "upper_bound": round(upper_bound, 2),
            "outlier_count": outlier_count,
            "outlier_pct": outlier_pct,
        })

        if col in ["Calories_Burned", "Avg_BPM", "Max_BPM", "Weight (kg)"]:
            filter_expr = filter_expr | col_outlier_expr

    cleaned_df = df.filter(~filter_expr)
    return outlier_stats, cleaned_df.height


def compute_standardization_stats() -> Tuple[Dict[str, float], Dict[str, float]]:
    df = load_dataset()
    X = df.select(NUMERIC_COLUMNS).to_numpy()
    scaler = StandardScaler().fit(X)

    means = {col: round(float(m), 4) for col, m in zip(NUMERIC_COLUMNS, scaler.mean_)}
    stds = {col: round(float(s), 4) for col, s in zip(NUMERIC_COLUMNS, scaler.scale_)}
    return means, stds


def get_sample_records(limit: int = 5) -> List[Dict]:
    df = load_dataset()
    records = []
    for i in range(min(limit, df.height)):
        row = df.row(i, named=True)
        records.append({
            "id": i + 1,
            "age": int(row["Age"]),
            "gender": str(row["Gender"]),
            "weight_kg": float(row["Weight (kg)"]),
            "height_m": float(row["Height (m)"]),
            "max_bpm": int(row["Max_BPM"]),
            "avg_bpm": int(row["Avg_BPM"]),
            "resting_bpm": int(row["Resting_BPM"]),
            "session_duration_hours": float(row["Session_Duration (hours)"]),
            "calories_burned": float(row["Calories_Burned"]),
            "workout_type": str(row["Workout_Type"]),
            "fat_percentage": float(row["Fat_Percentage"]),
            "water_intake_liters": float(row["Water_Intake (liters)"]),
            "workout_frequency_days": int(row["Workout_Frequency (days/week)"]),
            "experience_level": int(row["Experience_Level"]),
            "bmi": float(row["BMI"]),
        })
    return records

