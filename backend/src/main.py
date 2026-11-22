from contextlib import asynccontextmanager
from typing import Dict, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import CORS_ORIGINS
from .data_loader import (
    compute_describe_stats,
    compute_missing_values,
    compute_outliers_iqr,
    compute_standardization_stats,
    get_dataset_info,
    get_sample_records,
    load_dataset,
)
from .eda import get_boxplots_by_gender, get_calories_histogram, get_workout_countplot
from .insights import get_correlation_insights, get_pca_insights
from .models_service import (
    are_models_ready,
    load_models_service,
    predict_calories,
    predict_level,
)
from .schemas import (
    CaloriesPredictionResponse,
    ChartsResponse,
    CorrelationResponse,
    LevelPredictionResponse,
    PCAResponse,
    SampleMember,
    SentimentInput,
    SentimentResponse,
    SummaryResponse,
    UserStatsInput,
)
from .sentiment import analyze_workout_feedback


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load dataset with Polars and load ML models
    print("[*] Starting FitStreak API...")
    try:
        load_dataset()
        print("[✓] Polars dataset loaded.")
    except Exception as e:
        print(f"[!] Warning during dataset load: {e}")

    try:
        load_models_service()
        print("[✓] ML model services ready.")
    except Exception as e:
        print(f"[!] Warning during models load: {e}")

    yield
    print("[*] Shutting down FitStreak API...")


app = FastAPI(
    title="FitStreak Fitness Analytics API",
    description="Full-stack Data Science Applications (DSA) Course Project API with Polars & Scikit-Learn",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
def root():
    return {
        "project": "FitStreak Fitness Analytics API",
        "course": "Data Science Applications (DSA) Mini-Project",
        "team": ["Ashwith Ashok Shetty", "Shivam Swapnil Revankar"],
        "pipeline_stages": [
            "1. Data Loading & Cleaning (/api/eda/summary)",
            "2. Visual EDA (/api/eda/charts)",
            "3. Correlation & Dimensionality Reduction (/api/insights/correlation, /api/insights/pca)",
            "4. Supervised ML Predictions (/api/predict/calories, /api/predict/level)",
            "5. Text Analytics & Sentiment (/api/feedback/sentiment)",
        ],
        "docs_url": "/docs",
    }


@app.get("/api/health", tags=["Health"])
def health_check():
    df = load_dataset()
    return {
        "status": "healthy",
        "dataset_rows": df.height,
        "dataset_columns": df.width,
        "models_ready": are_models_ready(),
    }


@app.get("/api/dataset/sample", response_model=List[SampleMember], tags=["Dataset"])
def get_sample():
    return get_sample_records(limit=6)


@app.get("/api/eda/summary", response_model=SummaryResponse, tags=["EDA"])
def eda_summary():
    try:
        info = get_dataset_info()
        missing = compute_missing_values()
        describe_stats = compute_describe_stats()
        outliers, cleaned_rows = compute_outliers_iqr()
        means, stds = compute_standardization_stats()

        return SummaryResponse(
            shape=info["shape"],
            dtypes=info["dtypes"],
            numeric_columns=info["numeric_columns"],
            categorical_columns=info["categorical_columns"],
            missing_values=missing,
            describe=describe_stats,
            outliers=outliers,
            cleaned_rows_count=cleaned_rows,
            raw_rows_count=info["shape"]["rows"],
            standardization_means=means,
            standardization_stds=stds,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"EDA summary error: {str(e)}")


@app.get("/api/eda/charts", response_model=ChartsResponse, tags=["EDA"])
def eda_charts():
    try:
        cal_hist = get_calories_histogram(num_bins=10)
        workout_counts = get_workout_countplot()
        weight_boxplots, bmi_boxplots = get_boxplots_by_gender()

        return ChartsResponse(
            calories_histogram=cal_hist,
            workout_counts=workout_counts,
            weight_by_gender_boxplot=weight_boxplots,
            bmi_by_gender_boxplot=bmi_boxplots,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"EDA charts error: {str(e)}")


@app.get("/api/insights/correlation", response_model=CorrelationResponse, tags=["Insights"])
def insights_correlation():
    try:
        data = get_correlation_insights()
        return CorrelationResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Correlation insights error: {str(e)}")


@app.get("/api/insights/pca", response_model=PCAResponse, tags=["Insights"])
def insights_pca():
    try:
        data = get_pca_insights()
        return PCAResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PCA insights error: {str(e)}")


@app.post("/api/predict/calories", response_model=CaloriesPredictionResponse, tags=["Predictions"])
def predict_calories_endpoint(user_input: UserStatsInput):
    try:
        return predict_calories(user_input)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calorie prediction error: {str(e)}")


@app.post("/api/predict/level", response_model=LevelPredictionResponse, tags=["Predictions"])
def predict_level_endpoint(user_input: UserStatsInput):
    try:
        return predict_level(user_input)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Experience level prediction error: {str(e)}")


@app.post("/api/feedback/sentiment", response_model=SentimentResponse, tags=["Text Analytics"])
def analyze_feedback(input_data: SentimentInput):
    try:
        return analyze_workout_feedback(input_data.note)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sentiment analysis error: {str(e)}")

