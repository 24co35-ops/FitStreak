# FitStreak — Fitness Analytics & Predictive ML Engine
> **College Course**: Data Science and Analytics (DSA) Mini-Project  
> **Student Authors**: **Ashwith Ashok Shetty** & **Shivam Swapnil Revankar**  
> **Dataset**: [Gym Members Exercise Dataset (Vala Khorasani, Kaggle)](https://www.kaggle.com/datasets/valakhorasani/gym-members-exercise-dataset)  
> **Platform**: Full-Stack Web Application (Next.js + FastAPI)

---

## 📌 1. Project Overview

**FitStreak** is a full-stack fitness analytics and machine learning application developed to demonstrate a complete, industry-standard data science lifecycle for a college **Data Science and Analytics (DSA)** curriculum. 

The application inverts typical monolithic data science workflows into a modular, production-ready full-stack architecture:
- **Backend**: Built with **FastAPI** utilizing **Polars** as the primary high-speed in-memory DataFrame engine, **Pydantic v2** for strict schema validation, and **Scikit-Learn** for statistical machine learning pipelines.
- **Frontend**: A responsive dashboard crafted in **Next.js (App Router, TypeScript, Tailwind CSS)** with **Recharts** interactive visualisations.
- **Local-First Design**: Runs entirely on `localhost` — no cloud deployment required for testing or demo.
- **Offline Resiliency**: Features transparent fallback caching so the app runs smoothly in offline evaluation environments without crashing.

---

## 🗺️ 2. Syllabus-to-Feature Mapping Table

This project directly maps each stage of the DSA syllabus into dedicated backend modules, endpoints, and frontend user interfaces:

| Syllabus Stage | Topic & Concepts Covered | Backend Endpoint & Module | Frontend UI & Visualisations |
|---|---|---|---|
| **Stage 1** | **Data Ingestion, Schema Auditing & Cleaning**<br>• High-throughput CSV ingestion<br>• Missing values auditing<br>• Outlier detection (IQR Method: $Q_1 - 1.5\text{IQR}$ to $Q_3 + 1.5\text{IQR}$)<br>• Feature standardization (`StandardScaler`) | `GET /api/eda/summary`<br>`backend/src/data_loader.py`<br>`backend/scripts/fetch_dataset.py` | **Stats & Profile** (`/upload`)<br>• Biometric inputs & real-time BMI calculator<br>• 5 sample presets from Kaggle dataset<br>• Summary cards & data dictionary |
| **Stage 2** | **Exploratory Data Analysis (EDA)**<br>• Univariate & Bivariate distributions<br>• Frequency countplots<br>• 5-number summary (Min, $Q_1$, Med, $Q_3$, Max) grouped by demographic strata | `GET /api/eda/charts`<br>`backend/src/eda.py` | **EDA Dashboard** (`/eda`)<br>• Calories Burned Histogram (10 bins)<br>• Workout Type Countplot (Cardio, HIIT, Strength, Yoga)<br>• Gender-stratified Weight & BMI Boxplot metrics<br>• Descriptive statistics table |
| **Stage 3** | **Correlation & Dimensionality Reduction**<br>• Pearson correlation matrix ($12 \times 12$)<br>• Multicollinearity diagnostics & alerts<br>• Variance Inflation Factor (VIF)<br>• Principal Component Analysis (stand-in for factor analysis) | `GET /api/insights/correlation`<br>`GET /api/insights/pca`<br>`backend/src/insights.py` | **Insights & PCA** (`/insights`)<br>• Interactive Correlation Heatmap<br>• VIF collinearity severity cards<br>• PCA Scree Plot (Eigenvalues & Cumulative Variance)<br>• Component Loadings matrix ($PC_1$ to $PC_5$) |
| **Stage 4** | **Supervised Machine Learning Models**<br>• One-Hot Encoding for categorical features<br>• Simple Linear Regression (Duration $\to$ Calories)<br>• Multiple Linear Regression ($R^2 = 0.9803$)<br>• Multinomial Logistic Regression (Experience Level Classifier: 87.7% accuracy) | `POST /api/predict/calories`<br>`POST /api/predict/level`<br>`backend/src/models_service.py`<br>`backend/scripts/train_models.py` | **ML Predict** (`/predict`)<br>• Calorie prediction with exact mathematical equation<br>• Linear feature contribution breakdown<br>• Level classifier with probability progress bars<br>• Prescriptive training recommendations |

---

## 🏗️ 3. Repository Directory Structure

```text
/FitStreak
├── backend/
│   ├── data/
│   │   └── gym_members_exercise_tracking.csv   # Kaggle dataset cache (973 rows)
│   ├── models/                                 # Serialized Scikit-Learn models
│   │   ├── simple_linear_regression.joblib
│   │   ├── multiple_linear_regression.joblib
│   │   ├── logistic_regression.joblib
│   │   ├── scaler.joblib
│   │   ├── encoder.joblib
│   │   └── training_metadata.json
│   ├── notebooks/
│   │   └── model_training.ipynb                # Documented DSA training notebook
│   ├── scripts/
│   │   ├── fetch_dataset.py                    # Kaggle API fetcher with env credentials
│   │   ├── train_models.py                     # Offline ML model training script
│   │   └── test_api.py                         # 8-point automated test suite
│   ├── src/
│   │   ├── main.py                             # FastAPI application entrypoint
│   │   ├── config.py                           # App settings & CORS configuration
│   │   ├── schemas.py                          # Pydantic v2 request/response models
│   │   ├── data_loader.py                      # Polars data extraction & IQR cleaning
│   │   ├── eda.py                              # Visual aggregation endpoints
│   │   ├── insights.py                         # Correlation, VIF & PCA analytics
│   │   └── models_service.py                   # Joblib model inference engine
│   ├── Dockerfile                              # Container image (optional local use)
│   ├── pyproject.toml                          # UV package management definition
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                        # 1. Home & syllabus map
│   │   │   ├── upload/page.tsx                 # 2. Member stats & profile
│   │   │   ├── eda/page.tsx                    # 3. EDA Visual dashboard
│   │   │   ├── insights/page.tsx               # 4. Correlation & PCA
│   │   │   └── predict/page.tsx                # 5. Live ML predictions
│   │   ├── components/
│   │   │   ├── Navbar.tsx                      # Header with backend reconnect modal
│   │   │   └── PipelineStepper.tsx             # Interactive 4-stage syllabus tracker
│   │   └── lib/
│   │       └── api.ts                          # Resilient API client with fallback data
│   ├── next.config.ts                          # Next.js configuration
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## ⚡ 4. Running Locally (Demo / Viva)

> Both servers must be running simultaneously. Use **two separate terminals**.

### Prerequisites
- Python 3.10+ and [uv](https://github.com/astral-sh/uv) (fast Python package manager)
- Node.js 18+ and npm

---

### Terminal 1 — Backend (FastAPI + Polars)

```bash
cd backend

# First-time setup only (skip if already done):
uv run python scripts/fetch_dataset.py      # Download Kaggle dataset
uv run python scripts/train_models.py        # Train & export ML models
uv run python scripts/test_api.py            # Run 8-point test suite (optional)

# Start the server:
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```
- **Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

### Terminal 2 — Frontend (Next.js)

```bash
cd frontend
npm install          # First-time only
npm run dev
```
- **Open**: [http://localhost:3000](http://localhost:3000)

---

## 👥 Authors & Academic Credits
- **Ashwith Ashok Shetty->24CO35**
- **Shivam Swapnil Revankar->24CO56**
- Mini-Project Submission for **Data Science and Analytics (DSA)**

