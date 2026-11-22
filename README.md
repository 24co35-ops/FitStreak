# FitStreak — Fitness Analytics & Predictive ML Engine
> **College Course**: Data Science Applications (DSA) Mini-Project  
> **Student Authors**: **Ashwith Ashok Shetty** & **Shivam Swapnil Revankar**  
> **Dataset**: [Gym Members Exercise Dataset (Vala Khorasani, Kaggle)](https://www.kaggle.com/datasets/valakhorasani/gym-members-exercise-dataset)  
> **Mobile Target**: Android Debug APK via Capacitor

---

## 📌 1. Project Overview

**FitStreak** is a full-stack fitness analytics and machine learning application developed to demonstrate a complete, industry-standard data science lifecycle for a college **Data Science Applications (DSA)** curriculum. 

The application inverts typical monolithic data science workflows into a modular, production-ready full-stack architecture:
- **Backend**: Built with **FastAPI** utilizing **Polars** as the primary high-speed in-memory DataFrame engine, **Pydantic v2** for strict schema validation, and **Scikit-Learn** for statistical machine learning pipelines.
- **Frontend**: A responsive dashboard crafted in **Next.js (App Router, TypeScript, Tailwind CSS)** with **Recharts** interactive visualisations.
- **Mobile Packaging**: Wrapped with **Capacitor** into an Android native project buildable as a standalone Android APK.
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
| **Stage 5** | **Qualitative Text Analytics & Sentiment**<br>• Lexical sentiment scoring (VADER compound, positive, neutral, negative)<br>• Stopwords filtering & token frequency extraction | `POST /api/feedback/sentiment`<br>`backend/src/sentiment.py` | **Feedback** (`/feedback`)<br>• Workout note reflection input<br>• Compound score badge (-1.0 to +1.0)<br>• Key descriptor tag cloud |

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
│   │   └── test_api.py                         # 9-point automated test suite
│   ├── src/
│   │   ├── main.py                             # FastAPI application entrypoint
│   │   ├── config.py                           # App settings & CORS configuration
│   │   ├── schemas.py                          # Pydantic v2 request/response models
│   │   ├── data_loader.py                      # Polars data extraction & IQR cleaning
│   │   ├── eda.py                              # Visual aggregation endpoints
│   │   ├── insights.py                         # Correlation, VIF & PCA analytics
│   │   ├── models_service.py                   # Joblib model inference engine
│   │   └── sentiment.py                        # VADER text analytics & tokenization
│   ├── Dockerfile                              # UV-based container image
│   ├── render.yaml                             # Render deployment blueprint
│   ├── Procfile                                # Railway / Heroku start command
│   ├── pyproject.toml                          # UV package management definition
│   └── .env.example
├── frontend/
│   ├── android/                                # Capacitor Native Android project
│   │   ├── app/src/main/assets/public/         # Bundled Next.js static export
│   │   ├── build.gradle
│   │   └── gradlew.bat                         # Gradle build wrapper
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                        # 1. Home & syllabus map
│   │   │   ├── upload/page.tsx                 # 2. Member stats & profile
│   │   │   ├── eda/page.tsx                    # 3. EDA Visual dashboard
│   │   │   ├── insights/page.tsx               # 4. Correlation & PCA
│   │   │   ├── predict/page.tsx                # 5. Live ML predictions
│   │   │   └── feedback/page.tsx               # 6. Text analytics & sentiment
│   │   ├── components/
│   │   │   ├── Navbar.tsx                      # Header with backend reconnect modal
│   │   │   └── PipelineStepper.tsx             # Interactive 5-stage syllabus tracker
│   │   └── lib/
│   │       └── api.ts                          # Resilient API client with fallback data
│   ├── capacitor.config.ts                     # Capacitor configuration
│   ├── next.config.ts                          # Next.js static export configuration
│   ├── package.json
│   └── vercel.json                             # Vercel deployment config
└── README.md
```

---

## ⚡ 4. How to Run Locally

### Prerequisites
- Python 3.10+ and [uv](https://github.com/astral-sh/uv) (fast Python package manager)
- Node.js 18+ and npm

---

### Step 1: Start the Backend (FastAPI + Polars + UV)

1. Open your terminal and navigate to `/backend`:
   ```bash
   cd backend
   ```

2. Download and cache the Kaggle dataset:
   ```bash
   # Optional: set KAGGLE_USERNAME and KAGGLE_KEY in your environment or .env
   uv run python scripts/fetch_dataset.py
   ```
   *(If Kaggle credentials are not provided, the script automatically falls back to fetching the verified authentic dataset mirror).*

3. Train and export the machine learning models:
   ```bash
   uv run python scripts/train_models.py
   ```

4. Run the automated API verification test suite:
   ```bash
   uv run python scripts/test_api.py
   ```

5. Launch the FastAPI development server:
   ```bash
   uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```
   - **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Health Endpoint**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### Step 2: Start the Frontend (Next.js)

1. Open a second terminal and navigate to `/frontend`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 📱 5. Building the Android APK with Capacitor

FitStreak is pre-configured with **Capacitor** to wrap the Next.js static export into a native Android application.

### Prerequisites

| Requirement | Version | Install Command |
|---|---|---|
| **JDK 21** (Required by Capacitor 7 & Gradle 8.x; JDK 25 is too new for Gradle) | 21.x | `winget install --id EclipseAdoptium.Temurin.21.JDK -e` |
| **Android SDK** | API 35+ / 36 | Install via [Android Studio](https://developer.android.com/studio) or Android command-line tools |

> [!IMPORTANT]
> After installing JDK 21, the project's `frontend/android/gradle.properties` already includes:
> ```properties
> org.gradle.java.home=C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.13.10002-hotspot
> ```
> Update this path if your JDK 21 is installed elsewhere.
>
> The Android SDK path is set in `frontend/android/local.properties` (`sdk.dir=...`). Update it to match your SDK location if different.

### Exact Build Steps:

1. **Statically Export the Next.js Web Application**:
   ```bash
   cd frontend
   npm run build
   ```
   This generates the production assets in `frontend/out/`.

2. **Sync the Web Assets into the Android Native Project**:
   ```bash
   npm run cap:sync
   ```
   *(Or run `npx cap sync android`). This copies all HTML, JS, CSS, and SVG assets into `frontend/android/app/src/main/assets/public/`.*

3. **Build the Debug APK via Gradle**:
   - On Windows:
     ```bash
     cd android
     .\gradlew.bat assembleDebug
     ```
   - On macOS/Linux:
     ```bash
     cd android
     ./gradlew assembleDebug
     ```
   The built APK will be generated at:
   ```text
   frontend/android/app/build/outputs/apk/debug/app-debug.apk
   ```

4. **Alternatively, Open in Android Studio**:
   ```bash
   cd frontend
   npx cap open android
   ```
   Click **Run 'app'** or **Build > Build Bundle(s) / APK(s) > Build APK(s)** to deploy to an emulator or USB-connected Android phone.

> **💡 Android Network Note**:
> When running the APK inside an Android Emulator, the local backend is reachable via `http://10.0.2.2:8000` (the Android emulator host loopback). Click the **Server Pill** in the top navigation bar to adjust the backend URL anytime. If offline, FitStreak's built-in fallback dataset ensures the charts and predictions still render seamlessly!

---

## ☁️ 6. Cloud Deployment

### Deploy Backend to Render or Railway
- The backend contains a `render.yaml`, `Procfile`, and `Dockerfile`.
- **Render**: Connect the GitHub repository and select `/backend` as the root directory. Render will detect `render.yaml` or run:
  ```bash
  uv sync && uv run python scripts/fetch_dataset.py && uv run python scripts/train_models.py
  uv run uvicorn src.main:app --host 0.0.0.0 --port $PORT
  ```

### Deploy Frontend to Vercel
- The frontend includes `vercel.json`.
- In Vercel, set the root directory to `frontend`.
- Build Command: `npm run build`
- Output Directory: `out`
- Add environment variable `NEXT_PUBLIC_API_URL` pointing to your deployed backend URL.

---

## 👥 Authors & Academic Credits
- **Ashwith Ashok Shetty->24CO35**
- **Shivam Swapnil Revankar->24CO56**
- Mini-Project Submission for **Data Science and Analytics (DSA)**

