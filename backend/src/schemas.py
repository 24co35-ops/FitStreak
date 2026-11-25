from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# -------------------------------------------------------------
# EDA Schemas
# -------------------------------------------------------------
class DescribeStat(BaseModel):
    feature: str
    count: float
    mean: float
    std: float
    min: float
    q25: float
    median: float
    q75: float
    max: float


class OutlierStat(BaseModel):
    feature: str
    q1: float
    q3: float
    iqr: float
    lower_bound: float
    upper_bound: float
    outlier_count: int
    outlier_pct: float


class SummaryResponse(BaseModel):
    shape: Dict[str, int]
    dtypes: Dict[str, str]
    numeric_columns: List[str]
    categorical_columns: List[str]
    missing_values: Dict[str, int]
    describe: List[DescribeStat]
    outliers: List[OutlierStat]
    cleaned_rows_count: int
    raw_rows_count: int
    standardization_means: Dict[str, float]
    standardization_stds: Dict[str, float]


class HistogramBin(BaseModel):
    bin_label: str
    bin_start: float
    bin_end: float
    count: int


class CountplotItem(BaseModel):
    workout_type: str
    count: int
    percentage: float


class BoxplotStat(BaseModel):
    group: str
    gender: str
    min: float
    q1: float
    median: float
    q3: float
    max: float
    mean: float
    outliers_count: int


class ChartsResponse(BaseModel):
    calories_histogram: List[HistogramBin]
    workout_counts: List[CountplotItem]
    weight_by_gender_boxplot: List[BoxplotStat]
    bmi_by_gender_boxplot: List[BoxplotStat]


# -------------------------------------------------------------
# Insights Schemas
# -------------------------------------------------------------
class CorrelationCell(BaseModel):
    feature_x: str
    feature_y: str
    correlation: float


class MulticollinearityAlert(BaseModel):
    feature_1: str
    feature_2: str
    correlation: float
    description: str
    severity: str


class VifScore(BaseModel):
    feature: str
    vif: float
    interpretation: str


class CorrelationResponse(BaseModel):
    numeric_columns: List[str]
    matrix: List[List[float]]
    flat_matrix: List[CorrelationCell]
    multicollinearity_flags: List[MulticollinearityAlert]
    vif_scores: List[VifScore]


class ScreeItem(BaseModel):
    component: str
    eigenvalue: float
    variance_ratio: float
    cumulative_variance: float


class PCAScatterPoint(BaseModel):
    pc1: float
    pc2: float
    gender: str
    workout_type: str
    experience_level: int
    calories_burned: float


class PCAResponse(BaseModel):
    numeric_columns: List[str]
    scree_plot: List[ScreeItem]
    loadings: List[Dict[str, Any]]
    scatter_points: List[PCAScatterPoint]


# -------------------------------------------------------------
# Prediction Schemas
# -------------------------------------------------------------
class UserStatsInput(BaseModel):
    age: int = Field(..., ge=10, le=100, description="Age in years", examples=[28])
    gender: str = Field(..., description="Male or Female", examples=["Male"])
    weight_kg: float = Field(..., ge=30.0, le=200.0, description="Weight in kg", examples=[75.0])
    height_m: float = Field(..., ge=1.2, le=2.3, description="Height in meters", examples=[1.78])
    max_bpm: int = Field(..., ge=100, le=240, description="Maximum BPM during workout", examples=[175])
    avg_bpm: int = Field(..., ge=80, le=210, description="Average BPM during workout", examples=[145])
    resting_bpm: int = Field(..., ge=40, le=120, description="Resting BPM", examples=[62])
    session_duration_hours: float = Field(..., ge=0.2, le=5.0, description="Session duration in hours", examples=[1.25])
    workout_type: str = Field(..., description="Cardio, HIIT, Strength, or Yoga", examples=["HIIT"])
    fat_percentage: float = Field(..., ge=3.0, le=50.0, description="Body fat percentage", examples=[18.5])
    water_intake_liters: float = Field(..., ge=0.5, le=10.0, description="Water intake in liters", examples=[2.5])
    workout_frequency_days: int = Field(..., ge=1, le=7, description="Workouts per week", examples=[4])


class CalorieFactorContribution(BaseModel):
    feature: str
    value: float
    weight: float
    contribution: float


class CaloriesPredictionResponse(BaseModel):
    predicted_calories_multiple: float
    predicted_calories_simple: float
    bmi: float
    simple_regression_equation: str
    multiple_regression_intercept: float
    top_contributing_factors: List[CalorieFactorContribution]
    r2_score_multiple: float
    r2_score_simple: float
    rmse_multiple: float


class LevelProbability(BaseModel):
    level_code: int
    level_name: str
    probability: float
    percentage: float


class LevelPredictionResponse(BaseModel):
    predicted_level_code: int
    predicted_level_name: str
    probabilities: List[LevelProbability]
    model_accuracy: float
    confidence: float
    training_confusion_matrix: List[List[int]]
    recommendation: str


# -------------------------------------------------------------
# Sample Dataset Record
# -------------------------------------------------------------
class SampleMember(BaseModel):
    id: int
    age: int
    gender: str
    weight_kg: float
    height_m: float
    max_bpm: int
    avg_bpm: int
    resting_bpm: int
    session_duration_hours: float
    calories_burned: float
    workout_type: str
    fat_percentage: float
    water_intake_liters: float
    workout_frequency_days: int
    experience_level: int
    bmi: float

