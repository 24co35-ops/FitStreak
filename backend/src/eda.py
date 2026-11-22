from typing import Dict, List, Tuple
import numpy as np
import polars as pl
from .data_loader import load_dataset


Tuple_Dict = Tuple[List[Dict], List[Dict]]


def get_calories_histogram(num_bins: int = 10) -> List[Dict]:
    df = load_dataset()
    calories = df["Calories_Burned"].to_numpy()
    min_val, max_val = float(calories.min()), float(calories.max())
    
    counts, bin_edges = np.histogram(calories, bins=num_bins)
    
    result = []
    for i in range(len(counts)):
        start = round(float(bin_edges[i]), 1)
        end = round(float(bin_edges[i + 1]), 1)
        result.append({
            "bin_label": f"{int(start)}-{int(end)}",
            "bin_start": start,
            "bin_end": end,
            "count": int(counts[i]),
        })
    return result


def get_workout_countplot() -> List[Dict]:
    df = load_dataset()
    counts_df = (
        df.group_by("Workout_Type")
        .len()
        .sort("len", descending=True)
    )
    total = df.height
    result = []
    for row in counts_df.iter_rows(named=True):
        count = int(row["len"])
        result.append({
            "workout_type": str(row["Workout_Type"]),
            "count": count,
            "percentage": round((count / total) * 100, 2),
        })
    return result


def _calculate_boxplot_stats(series: pl.Series, group_label: str, gender: str) -> Dict:
    arr = series.to_numpy()
    q1 = float(np.percentile(arr, 25))
    median = float(np.percentile(arr, 50))
    q3 = float(np.percentile(arr, 75))
    iqr = q3 - q1
    lower_whisker = max(float(arr.min()), q1 - 1.5 * iqr)
    upper_whisker = min(float(arr.max()), q3 + 1.5 * iqr)
    outliers = arr[(arr < lower_whisker) | (arr > upper_whisker)]

    return {
        "group": group_label,
        "gender": gender,
        "min": round(float(arr.min()), 2),
        "q1": round(q1, 2),
        "median": round(median, 2),
        "q3": round(q3, 2),
        "max": round(float(arr.max()), 2),
        "mean": round(float(arr.mean()), 2),
        "outliers_count": len(outliers),
    }


def get_boxplots_by_gender() -> Tuple_Dict:
    df = load_dataset()
    genders = ["Male", "Female"]
    weight_stats = []
    bmi_stats = []

    for g in genders:
        sub_df = df.filter(pl.col("Gender") == g)
        weight_stats.append(_calculate_boxplot_stats(sub_df["Weight (kg)"], "Weight", g))
        bmi_stats.append(_calculate_boxplot_stats(sub_df["BMI"], "BMI", g))

    return weight_stats, bmi_stats

