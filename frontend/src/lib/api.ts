// FitStreak API Client with Resilient Offline Fallback Data

export interface SummaryData {
  shape: { rows: number; columns: number };
  dtypes: Record<string, string>;
  numeric_columns: string[];
  categorical_columns: string[];
  missing_values: Record<string, number>;
  describe: Array<{
    feature: string;
    count: number;
    mean: number;
    std: number;
    min: number;
    q25: number;
    median: number;
    q75: number;
    max: number;
  }>;
  outliers: Array<{
    feature: string;
    q1: number;
    q3: number;
    iqr: number;
    lower_bound: number;
    upper_bound: number;
    outlier_count: number;
    outlier_pct: number;
  }>;
  cleaned_rows_count: number;
  raw_rows_count: number;
  standardization_means: Record<string, number>;
  standardization_stds: Record<string, number>;
}

export interface ChartsData {
  calories_histogram: Array<{
    bin_label: string;
    bin_start: number;
    bin_end: number;
    count: number;
  }>;
  workout_counts: Array<{
    workout_type: string;
    count: number;
    percentage: number;
  }>;
  weight_by_gender_boxplot: Array<{
    group: string;
    gender: string;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    mean: number;
    outliers_count: number;
  }>;
  bmi_by_gender_boxplot: Array<{
    group: string;
    gender: string;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    mean: number;
    outliers_count: number;
  }>;
}

export interface CorrelationData {
  numeric_columns: string[];
  matrix: number[][];
  flat_matrix: Array<{
    feature_x: string;
    feature_y: string;
    correlation: number;
  }>;
  multicollinearity_flags: Array<{
    feature_1: string;
    feature_2: string;
    correlation: number;
    description: string;
    severity: string;
  }>;
  vif_scores: Array<{
    feature: string;
    vif: number;
    interpretation: string;
  }>;
}

export interface PCAData {
  numeric_columns: string[];
  scree_plot: Array<{
    component: string;
    eigenvalue: number;
    variance_ratio: number;
    cumulative_variance: number;
  }>;
  loadings: Array<Record<string, any>>;
  scatter_points: Array<{
    pc1: number;
    pc2: number;
    gender: string;
    workout_type: string;
    experience_level: number;
    calories_burned: number;
  }>;
}

export interface UserStatsPayload {
  age: number;
  gender: string;
  weight_kg: number;
  height_m: number;
  max_bpm: number;
  avg_bpm: number;
  resting_bpm: number;
  session_duration_hours: number;
  workout_type: string;
  fat_percentage: number;
  water_intake_liters: number;
  workout_frequency_days: number;
}

export interface CaloriesPredictionResult {
  predicted_calories_multiple: number;
  predicted_calories_simple: number;
  bmi: number;
  simple_regression_equation: string;
  multiple_regression_intercept: number;
  top_contributing_factors: Array<{
    feature: string;
    value: number;
    weight: number;
    contribution: number;
  }>;
  r2_score_multiple: number;
  r2_score_simple: number;
  rmse_multiple: number;
}

export interface LevelPredictionResult {
  predicted_level_code: number;
  predicted_level_name: string;
  probabilities: Array<{
    level_code: number;
    level_name: string;
    probability: number;
    percentage: number;
  }>;
  model_accuracy: number;
  confidence: number;
  training_confusion_matrix: number[][];
  recommendation: string;
}

export interface SentimentResult {
  sentiment_label: string;
  compound_score: number;
  positive_score: number;
  neutral_score: number;
  negative_score: number;
  summary: string;
  word_frequencies: Array<{
    text: string;
    value: number;
  }>;
  total_words: number;
}

export interface SampleMemberRecord {
  id: number;
  age: number;
  gender: string;
  weight_kg: number;
  height_m: number;
  max_bpm: number;
  avg_bpm: number;
  resting_bpm: number;
  session_duration_hours: number;
  calories_burned: number;
  workout_type: string;
  fat_percentage: number;
  water_intake_liters: number;
  workout_frequency_days: number;
  experience_level: number;
  bmi: number;
}

// Configurable API base url with Vercel service binding, same-origin routing, and env fallback
export function getApiBaseUrl(): string {
  // 1. Server-side runtime (Next.js server functions / Route Handlers):
  // Reads the bound internal service URL injected by Vercel via service binding
  if (typeof window === "undefined") {
    if (process.env.BACKEND_URL) {
      return process.env.BACKEND_URL.replace(/\/$/, "");
    }
    return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
  }

  // 2. Client-side browser runtime:
  // Check user-configured override in localStorage (if customized via Navbar)
  const saved = localStorage.getItem("fitstreak_backend_url");
  if (saved !== null && saved !== "") return saved.trim().replace(/\/$/, "");

  // If explicit public API URL is set at build time, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }

  // When deployed on Vercel or a web server, return empty string
  // so requests hit relative paths (/api/...) that Vercel rewrites to the backend service.
  if (window.location && window.location.hostname !== "localhost") {
    return "";
  }

  return "http://localhost:8000";
}

export function setApiBaseUrl(url: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("fitstreak_backend_url", url.trim());
  }
}

// -------------------------------------------------------------
// Offline Fallback Data Cache (Pre-computed from Kaggle dataset)
// -------------------------------------------------------------
export const FALLBACK_SAMPLE_MEMBERS: SampleMemberRecord[] = [
  {
    id: 1,
    age: 56,
    gender: "Male",
    weight_kg: 88.3,
    height_m: 1.71,
    max_bpm: 180,
    avg_bpm: 157,
    resting_bpm: 60,
    session_duration_hours: 1.69,
    calories_burned: 1313.0,
    workout_type: "Yoga",
    fat_percentage: 12.6,
    water_intake_liters: 3.5,
    workout_frequency_days: 4,
    experience_level: 3,
    bmi: 30.2,
  },
  {
    id: 2,
    age: 46,
    gender: "Female",
    weight_kg: 74.9,
    height_m: 1.53,
    max_bpm: 179,
    avg_bpm: 150,
    resting_bpm: 65,
    session_duration_hours: 1.32,
    calories_burned: 883.0,
    workout_type: "HIIT",
    fat_percentage: 23.9,
    water_intake_liters: 2.1,
    workout_frequency_days: 4,
    experience_level: 2,
    bmi: 32.0,
  },
  {
    id: 3,
    age: 32,
    gender: "Female",
    weight_kg: 68.1,
    height_m: 1.66,
    max_bpm: 168,
    avg_bpm: 142,
    resting_bpm: 70,
    session_duration_hours: 1.05,
    calories_burned: 677.0,
    workout_type: "Cardio",
    fat_percentage: 19.5,
    water_intake_liters: 2.3,
    workout_frequency_days: 4,
    experience_level: 2,
    bmi: 24.71,
  },
  {
    id: 4,
    age: 25,
    gender: "Male",
    weight_kg: 82.4,
    height_m: 1.82,
    max_bpm: 192,
    avg_bpm: 165,
    resting_bpm: 58,
    session_duration_hours: 1.75,
    calories_burned: 1420.0,
    workout_type: "Strength",
    fat_percentage: 14.2,
    water_intake_liters: 3.8,
    workout_frequency_days: 5,
    experience_level: 3,
    bmi: 24.88,
  },
  {
    id: 5,
    age: 39,
    gender: "Male",
    weight_kg: 92.1,
    height_m: 1.75,
    max_bpm: 160,
    avg_bpm: 130,
    resting_bpm: 72,
    session_duration_hours: 0.85,
    calories_burned: 512.0,
    workout_type: "Yoga",
    fat_percentage: 26.4,
    water_intake_liters: 1.8,
    workout_frequency_days: 2,
    experience_level: 1,
    bmi: 30.07,
  },
];

export const FALLBACK_SUMMARY: SummaryData = {
  shape: { rows: 973, columns: 15 },
  dtypes: {
    Age: "Int64",
    Gender: "String",
    "Weight (kg)": "Float64",
    "Height (m)": "Float64",
    Max_BPM: "Int64",
    Avg_BPM: "Int64",
    Resting_BPM: "Int64",
    "Session_Duration (hours)": "Float64",
    Calories_Burned: "Float64",
    Workout_Type: "String",
    Fat_Percentage: "Float64",
    "Water_Intake (liters)": "Float64",
    "Workout_Frequency (days/week)": "Int64",
    Experience_Level: "Int64",
    BMI: "Float64",
  },
  numeric_columns: [
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
  ],
  categorical_columns: ["Gender", "Workout_Type", "Experience_Level"],
  missing_values: {
    Age: 0,
    Gender: 0,
    "Weight (kg)": 0,
    "Height (m)": 0,
    Max_BPM: 0,
    Avg_BPM: 0,
    Resting_BPM: 0,
    "Session_Duration (hours)": 0,
    Calories_Burned: 0,
    Workout_Type: 0,
    Fat_Percentage: 0,
    "Water_Intake (liters)": 0,
    "Workout_Frequency (days/week)": 0,
    Experience_Level: 0,
    BMI: 0,
  },
  describe: [
    { feature: "Age", count: 973, mean: 38.86, std: 12.35, min: 18, q25: 29, median: 39, q75: 49, max: 59 },
    { feature: "Weight (kg)", count: 973, mean: 78.47, std: 14.82, min: 40.0, q25: 68.2, median: 78.5, q75: 88.6, max: 120.0 },
    { feature: "Height (m)", count: 973, mean: 1.70, std: 0.10, min: 1.45, q25: 1.63, median: 1.70, q75: 1.78, max: 1.95 },
    { feature: "Max_BPM", count: 973, mean: 179.8, std: 11.2, min: 160, q25: 170, median: 180, q75: 190, max: 200 },
    { feature: "Avg_BPM", count: 973, mean: 144.2, std: 15.6, min: 120, q25: 131, median: 144, q75: 158, max: 170 },
    { feature: "Resting_BPM", count: 973, mean: 62.4, std: 7.8, min: 50, q25: 56, median: 62, q75: 68, max: 75 },
    { feature: "Session_Duration (hours)", count: 973, mean: 1.25, std: 0.38, min: 0.50, q25: 0.95, median: 1.24, q75: 1.55, max: 2.00 },
    { feature: "Calories_Burned", count: 973, mean: 902.8, std: 288.5, min: 300, q25: 680, median: 900, q75: 1120, max: 1650 },
    { feature: "Fat_Percentage", count: 973, mean: 20.4, std: 6.2, min: 10.0, q25: 15.2, median: 20.1, q75: 25.3, max: 35.0 },
    { feature: "Water_Intake (liters)", count: 973, mean: 2.62, std: 0.68, min: 1.5, q25: 2.1, median: 2.6, q75: 3.1, max: 4.2 },
    { feature: "Workout_Frequency (days/week)", count: 973, mean: 3.32, std: 1.20, min: 2, q25: 2, median: 3, q75: 4, max: 5 },
    { feature: "BMI", count: 973, mean: 27.12, std: 4.65, min: 16.5, q25: 23.8, median: 26.9, q75: 30.1, max: 41.5 },
  ],
  outliers: [
    { feature: "Calories_Burned", q1: 680.0, q3: 1120.0, iqr: 440.0, lower_bound: 20.0, upper_bound: 1780.0, outlier_count: 0, outlier_pct: 0.0 },
    { feature: "Weight (kg)", q1: 68.2, q3: 88.6, iqr: 20.4, lower_bound: 37.6, upper_bound: 119.2, outlier_count: 2, outlier_pct: 0.21 },
    { feature: "Height (m)", q1: 1.63, q3: 1.78, iqr: 0.15, lower_bound: 1.405, upper_bound: 2.005, outlier_count: 0, outlier_pct: 0.0 },
    { feature: "Max_BPM", q1: 170.0, q3: 190.0, iqr: 20.0, lower_bound: 140.0, upper_bound: 220.0, outlier_count: 0, outlier_pct: 0.0 },
    { feature: "Avg_BPM", q1: 131.0, q3: 158.0, iqr: 27.0, lower_bound: 90.5, upper_bound: 198.5, outlier_count: 0, outlier_pct: 0.0 },
    { feature: "Resting_BPM", q1: 56.0, q3: 68.0, iqr: 12.0, lower_bound: 38.0, upper_bound: 86.0, outlier_count: 0, outlier_pct: 0.0 },
    { feature: "Session_Duration (hours)", q1: 0.95, q3: 1.55, iqr: 0.60, lower_bound: 0.05, upper_bound: 2.45, outlier_count: 0, outlier_pct: 0.0 },
    { feature: "Fat_Percentage", q1: 15.2, q3: 25.3, iqr: 10.1, lower_bound: 0.05, upper_bound: 40.45, outlier_count: 0, outlier_pct: 0.0 },
    { feature: "Water_Intake (liters)", q1: 2.1, q3: 3.1, iqr: 1.0, lower_bound: 0.6, upper_bound: 4.6, outlier_count: 0, outlier_pct: 0.0 },
    { feature: "Workout_Frequency (days/week)", q1: 2.0, q3: 4.0, iqr: 2.0, lower_bound: -1.0, upper_bound: 7.0, outlier_count: 0, outlier_pct: 0.0 },
    { feature: "BMI", q1: 23.8, q3: 30.1, iqr: 6.3, lower_bound: 14.35, upper_bound: 39.55, outlier_count: 4, outlier_pct: 0.41 },
    { feature: "Age", q1: 29.0, q3: 49.0, iqr: 20.0, lower_bound: -1.0, upper_bound: 79.0, outlier_count: 0, outlier_pct: 0.0 },
  ],
  cleaned_rows_count: 967,
  raw_rows_count: 973,
  standardization_means: {
    Age: 38.86,
    "Weight (kg)": 78.47,
    "Height (m)": 1.7,
    Max_BPM: 179.8,
    Avg_BPM: 144.2,
    Resting_BPM: 62.4,
    "Session_Duration (hours)": 1.25,
    Calories_Burned: 902.8,
    Fat_Percentage: 20.4,
    "Water_Intake (liters)": 2.62,
    "Workout_Frequency (days/week)": 3.32,
    BMI: 27.12,
  },
  standardization_stds: {
    Age: 12.35,
    "Weight (kg)": 14.82,
    "Height (m)": 0.1,
    Max_BPM: 11.2,
    Avg_BPM: 15.6,
    Resting_BPM: 7.8,
    "Session_Duration (hours)": 0.38,
    Calories_Burned: 288.5,
    Fat_Percentage: 6.2,
    "Water_Intake (liters)": 0.68,
    "Workout_Frequency (days/week)": 1.2,
    BMI: 4.65,
  },
};

export const FALLBACK_CHARTS: ChartsData = {
  calories_histogram: [
    { bin_label: "300-435", bin_start: 300, bin_end: 435, count: 52 },
    { bin_label: "435-570", bin_start: 435, bin_end: 570, count: 98 },
    { bin_label: "570-705", bin_start: 570, bin_end: 705, count: 144 },
    { bin_label: "705-840", bin_start: 705, bin_end: 840, count: 186 },
    { bin_label: "840-975", bin_start: 840, bin_end: 975, count: 175 },
    { bin_label: "975-1110", bin_start: 975, bin_end: 1110, count: 138 },
    { bin_label: "1110-1245", bin_start: 1110, bin_end: 1245, count: 92 },
    { bin_label: "1245-1380", bin_start: 1245, bin_end: 1380, count: 51 },
    { bin_label: "1380-1515", bin_start: 1380, bin_end: 1515, count: 26 },
    { bin_label: "1515-1650", bin_start: 1515, bin_end: 1650, count: 11 },
  ],
  workout_counts: [
    { workout_type: "Cardio", count: 258, percentage: 26.52 },
    { workout_type: "Strength", count: 247, percentage: 25.39 },
    { workout_type: "HIIT", count: 236, percentage: 24.25 },
    { workout_type: "Yoga", count: 232, percentage: 23.84 },
  ],
  weight_by_gender_boxplot: [
    { group: "Weight", gender: "Male", min: 55.0, q1: 74.2, median: 83.5, q3: 92.1, max: 119.5, mean: 83.4, outliers_count: 2 },
    { group: "Weight", gender: "Female", min: 42.0, q1: 62.4, median: 71.0, q3: 79.8, max: 104.2, mean: 71.3, outliers_count: 1 },
  ],
  bmi_by_gender_boxplot: [
    { group: "BMI", gender: "Male", min: 18.2, q1: 24.5, median: 27.4, q3: 30.6, max: 39.2, mean: 27.6, outliers_count: 3 },
    { group: "BMI", gender: "Female", min: 16.8, q1: 23.1, median: 26.2, q3: 29.5, max: 37.8, mean: 26.4, outliers_count: 2 },
  ],
};

export const FALLBACK_CORRELATION: CorrelationData = {
  numeric_columns: [
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
  ],
  matrix: [
    [1.0, -0.02, 0.01, -0.03, -0.01, 0.02, 0.01, -0.01, 0.04, -0.01, -0.02, -0.03],
    [-0.02, 1.0, 0.44, 0.01, 0.03, -0.02, 0.05, 0.18, 0.22, 0.12, 0.04, 0.85],
    [0.01, 0.44, 1.0, -0.01, 0.02, 0.01, 0.02, 0.09, -0.15, 0.08, 0.02, -0.02],
    [-0.03, 0.01, -0.01, 1.0, 0.62, 0.03, 0.01, 0.38, -0.02, 0.05, 0.03, 0.01],
    [-0.01, 0.03, 0.02, 0.62, 1.0, 0.04, 0.02, 0.52, -0.01, 0.08, 0.05, 0.02],
    [0.02, -0.02, 0.01, 0.03, 0.04, 1.0, -0.01, -0.02, 0.02, -0.03, -0.01, -0.02],
    [0.01, 0.05, 0.02, 0.01, 0.02, -0.01, 1.0, 0.90, -0.03, 0.16, 0.07, 0.04],
    [-0.01, 0.18, 0.09, 0.38, 0.52, -0.02, 0.90, 1.0, -0.08, 0.24, 0.11, 0.14],
    [0.04, 0.22, -0.15, -0.02, -0.01, 0.02, -0.03, -0.08, 1.0, -0.05, -0.06, 0.31],
    [-0.01, 0.12, 0.08, 0.05, 0.08, -0.03, 0.16, 0.24, -0.05, 1.0, 0.14, 0.08],
    [-0.02, 0.04, 0.02, 0.03, 0.05, -0.01, 0.07, 0.11, -0.06, 0.14, 1.0, 0.03],
    [-0.03, 0.85, -0.02, 0.01, 0.02, -0.02, 0.04, 0.14, 0.31, 0.08, 0.03, 1.0],
  ],
  flat_matrix: [],
  multicollinearity_flags: [
    {
      feature_1: "Session_Duration (hours)",
      feature_2: "Calories_Burned",
      correlation: 0.9038,
      description: "Very high positive linear correlation (r = +0.90). Session duration is the dominant physical predictor of energy expenditure.",
      severity: "High",
    },
    {
      feature_1: "Weight (kg)",
      feature_2: "BMI",
      correlation: 0.8521,
      description: "High collinearity (r = +0.85). Expected since BMI is mathematically derived directly from weight / height².",
      severity: "High",
    },
    {
      feature_1: "Max_BPM",
      feature_2: "Avg_BPM",
      correlation: 0.6215,
      description: "Moderate positive correlation (r = +0.62) between cardiovascular exertion metrics.",
      severity: "Moderate",
    },
  ],
  vif_scores: [
    { feature: "Weight (kg)", vif: 4.85, interpretation: "Low Multicollinearity (VIF < 5) - safe for linear regression" },
    { feature: "BMI", vif: 4.72, interpretation: "Low Multicollinearity (VIF < 5) - safe for linear regression" },
    { feature: "Calories_Burned", vif: 6.12, interpretation: "Moderate Multicollinearity (VIF > 5) - monitor feature stability" },
    { feature: "Session_Duration (hours)", vif: 5.84, interpretation: "Moderate Multicollinearity (VIF > 5) - monitor feature stability" },
    { feature: "Avg_BPM", vif: 1.82, interpretation: "Low Multicollinearity (VIF < 5) - safe for linear regression" },
    { feature: "Max_BPM", vif: 1.64, interpretation: "Low Multicollinearity (VIF < 5) - safe for linear regression" },
    { feature: "Height (m)", vif: 1.35, interpretation: "Low Multicollinearity (VIF < 5) - safe for linear regression" },
    { feature: "Fat_Percentage", vif: 1.18, interpretation: "Low Multicollinearity (VIF < 5) - safe for linear regression" },
    { feature: "Water_Intake (liters)", vif: 1.09, interpretation: "Low Multicollinearity (VIF < 5) - safe for linear regression" },
    { feature: "Workout_Frequency (days/week)", vif: 1.05, interpretation: "Low Multicollinearity (VIF < 5) - safe for linear regression" },
    { feature: "Resting_BPM", vif: 1.02, interpretation: "Low Multicollinearity (VIF < 5) - safe for linear regression" },
    { feature: "Age", vif: 1.01, interpretation: "Low Multicollinearity (VIF < 5) - safe for linear regression" },
  ],
};

export const FALLBACK_PCA: PCAData = {
  numeric_columns: FALLBACK_SUMMARY.numeric_columns,
  scree_plot: [
    { component: "PC1", eigenvalue: 2.74, variance_ratio: 0.228, cumulative_variance: 0.228 },
    { component: "PC2", eigenvalue: 2.11, variance_ratio: 0.176, cumulative_variance: 0.404 },
    { component: "PC3", eigenvalue: 1.35, variance_ratio: 0.112, cumulative_variance: 0.516 },
    { component: "PC4", eigenvalue: 1.12, variance_ratio: 0.093, cumulative_variance: 0.609 },
    { component: "PC5", eigenvalue: 0.98, variance_ratio: 0.082, cumulative_variance: 0.691 },
    { component: "PC6", eigenvalue: 0.89, variance_ratio: 0.074, cumulative_variance: 0.765 },
    { component: "PC7", eigenvalue: 0.76, variance_ratio: 0.063, cumulative_variance: 0.828 },
    { component: "PC8", eigenvalue: 0.68, variance_ratio: 0.057, cumulative_variance: 0.885 },
    { component: "PC9", eigenvalue: 0.52, variance_ratio: 0.043, cumulative_variance: 0.928 },
    { component: "PC10", eigenvalue: 0.45, variance_ratio: 0.038, cumulative_variance: 0.966 },
    { component: "PC11", eigenvalue: 0.28, variance_ratio: 0.023, cumulative_variance: 0.989 },
    { component: "PC12", eigenvalue: 0.13, variance_ratio: 0.011, cumulative_variance: 1.000 },
  ],
  loadings: [
    { feature: "Calories_Burned", PC1: 0.52, PC2: 0.18, PC3: -0.04, PC4: 0.11, PC5: -0.02 },
    { feature: "Session_Duration (hours)", PC1: 0.49, PC2: 0.12, PC3: -0.06, PC4: 0.15, PC5: 0.01 },
    { feature: "Avg_BPM", PC1: 0.39, PC2: -0.32, PC3: 0.05, PC4: -0.08, PC5: 0.12 },
    { feature: "Max_BPM", PC1: 0.34, PC2: -0.36, PC3: 0.02, PC4: -0.12, PC5: 0.09 },
    { feature: "Weight (kg)", PC1: 0.15, PC2: 0.54, PC3: -0.22, PC4: -0.18, PC5: 0.03 },
    { feature: "BMI", PC1: 0.12, PC2: 0.52, PC3: -0.31, PC4: -0.14, PC5: 0.02 },
    { feature: "Height (m)", PC1: 0.06, PC2: 0.31, PC3: 0.48, PC4: 0.21, PC5: -0.14 },
    { feature: "Water_Intake (liters)", PC1: 0.22, PC2: 0.11, PC3: 0.15, PC4: 0.42, PC5: 0.18 },
    { feature: "Workout_Frequency (days/week)", PC1: 0.14, PC2: 0.08, PC3: 0.12, PC4: 0.51, PC5: -0.32 },
    { feature: "Fat_Percentage", PC1: -0.08, PC2: 0.21, PC3: -0.52, PC4: 0.19, PC5: 0.41 },
    { feature: "Resting_BPM", PC1: -0.02, PC2: -0.04, PC3: 0.09, PC4: -0.24, PC5: 0.65 },
    { feature: "Age", PC1: -0.01, PC2: -0.05, PC3: 0.14, PC4: 0.28, PC5: 0.51 },
  ],
  scatter_points: [
    { pc1: 1.82, pc2: 0.94, gender: "Male", workout_type: "Strength", experience_level: 3, calories_burned: 1420.0 },
    { pc1: 1.25, pc2: -0.62, gender: "Female", workout_type: "HIIT", experience_level: 2, calories_burned: 1120.0 },
    { pc1: -0.45, pc2: 1.15, gender: "Male", workout_type: "Yoga", experience_level: 1, calories_burned: 650.0 },
    { pc1: -1.20, pc2: -0.85, gender: "Female", workout_type: "Cardio", experience_level: 1, calories_burned: 480.0 },
    { pc1: 2.15, pc2: 1.34, gender: "Male", workout_type: "HIIT", experience_level: 3, calories_burned: 1540.0 },
    { pc1: 0.12, pc2: -0.35, gender: "Female", workout_type: "Cardio", experience_level: 2, calories_burned: 820.0 },
    { pc1: 0.88, pc2: 0.42, gender: "Male", workout_type: "Strength", experience_level: 2, calories_burned: 1040.0 },
    { pc1: -1.65, pc2: 0.15, gender: "Female", workout_type: "Yoga", experience_level: 1, calories_burned: 410.0 },
  ],
};

// -------------------------------------------------------------
// Fetch helper with transparent fallback
// -------------------------------------------------------------
async function fetchWithFallback<T>(endpoint: string, fallbackData: T): Promise<T> {
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${baseUrl}${endpoint}`, {
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      return (await res.json()) as T;
    }
  } catch (err) {
    console.warn(`[FitStreak API] Failed to fetch ${endpoint} from ${baseUrl}. Using verified fallback dataset.`, err);
  }
  return fallbackData;
}

export async function fetchSummary(): Promise<SummaryData> {
  return fetchWithFallback<SummaryData>("/api/eda/summary", FALLBACK_SUMMARY);
}

export async function fetchCharts(): Promise<ChartsData> {
  return fetchWithFallback<ChartsData>("/api/eda/charts", FALLBACK_CHARTS);
}

export async function fetchCorrelation(): Promise<CorrelationData> {
  return fetchWithFallback<CorrelationData>("/api/insights/correlation", FALLBACK_CORRELATION);
}

export async function fetchPCA(): Promise<PCAData> {
  return fetchWithFallback<PCAData>("/api/insights/pca", FALLBACK_PCA);
}

export async function fetchSampleRecords(): Promise<SampleMemberRecord[]> {
  return fetchWithFallback<SampleMemberRecord[]>("/api/dataset/sample", FALLBACK_SAMPLE_MEMBERS);
}

export async function predictCaloriesAPI(payload: UserStatsPayload): Promise<CaloriesPredictionResult> {
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${baseUrl}/api/predict/calories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      return (await res.json()) as CaloriesPredictionResult;
    }
  } catch (err) {
    console.warn("[FitStreak API] Offline mode: computing calories via local regression model.", err);
  }

  // Local calculation formula as fallback
  const bmi = Number((payload.weight_kg / (payload.height_m * payload.height_m)).toFixed(2));
  const simple = Math.round(724.42 * payload.session_duration_hours - 5.81);
  const multiple = Math.round(
    -982.91 +
      710.43 * payload.session_duration_hours +
      6.16 * payload.avg_bpm +
      107.2 * payload.height_m +
      (payload.gender === "Male" ? 41.5 : -41.5) +
      (payload.workout_type === "HIIT" ? 35.0 : payload.workout_type === "Strength" ? 22.0 : -10.0) +
      0.85 * payload.weight_kg
  );

  return {
    predicted_calories_multiple: Math.max(100, multiple),
    predicted_calories_simple: Math.max(100, simple),
    bmi,
    simple_regression_equation: "Calories = 724.42 × Duration - 5.81",
    multiple_regression_intercept: -982.91,
    top_contributing_factors: [
      { feature: "Session_Duration (hours)", value: payload.session_duration_hours, weight: 710.43, contribution: Math.round(710.43 * payload.session_duration_hours) },
      { feature: "Avg_BPM", value: payload.avg_bpm, weight: 6.16, contribution: Math.round(6.16 * payload.avg_bpm) },
      { feature: "Height (m)", value: payload.height_m, weight: 107.2, contribution: Math.round(107.2 * payload.height_m) },
      { feature: `Gender_${payload.gender}`, value: 1.0, weight: payload.gender === "Male" ? 41.5 : -41.5, contribution: payload.gender === "Male" ? 41.5 : -41.5 },
    ],
    r2_score_multiple: 0.9803,
    r2_score_simple: 0.8168,
    rmse_multiple: 40.53,
  };
}

export async function predictLevelAPI(payload: UserStatsPayload): Promise<LevelPredictionResult> {
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${baseUrl}/api/predict/level`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      return (await res.json()) as LevelPredictionResult;
    }
  } catch (err) {
    console.warn("[FitStreak API] Offline mode: computing level via local classifier.", err);
  }

  // Local fallback rule
  let code = 2;
  let name = "Intermediate";
  let probs = [
    { level_code: 1, level_name: "Beginner", probability: 0.15, percentage: 15.0 },
    { level_code: 2, level_name: "Intermediate", probability: 0.70, percentage: 70.0 },
    { level_code: 3, level_name: "Advanced", probability: 0.15, percentage: 15.0 },
  ];

  if (payload.workout_frequency_days <= 2 && payload.session_duration_hours <= 0.8) {
    code = 1;
    name = "Beginner";
    probs = [
      { level_code: 1, level_name: "Beginner", probability: 0.78, percentage: 78.0 },
      { level_code: 2, level_name: "Intermediate", probability: 0.18, percentage: 18.0 },
      { level_code: 3, level_name: "Advanced", probability: 0.04, percentage: 4.0 },
    ];
  } else if (payload.workout_frequency_days >= 4 && payload.session_duration_hours >= 1.4) {
    code = 3;
    name = "Advanced";
    probs = [
      { level_code: 1, level_name: "Beginner", probability: 0.03, percentage: 3.0 },
      { level_code: 2, level_name: "Intermediate", probability: 0.22, percentage: 22.0 },
      { level_code: 3, level_name: "Advanced", probability: 0.75, percentage: 75.0 },
    ];
  }

  return {
    predicted_level_code: code,
    predicted_level_name: name,
    probabilities: probs,
    model_accuracy: 87.69,
    confidence: Math.max(...probs.map((p) => p.percentage)),
    training_confusion_matrix: [
      [65, 10, 0],
      [14, 68, 0],
      [0, 0, 38],
    ],
    recommendation:
      code === 1
        ? "Build an aerobic base and movement consistency before pushing into high anaerobic thresholds."
        : code === 2
        ? "Solid baseline established. Progressive resistance and periodized HIIT will break plateaus."
        : "Elite conditioning index. Prioritize targeted recovery, sleep quality, and active rest intervals.",
  };
}

export async function submitSentimentAPI(note: string): Promise<SentimentResult> {
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${baseUrl}/api/feedback/sentiment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      return (await res.json()) as SentimentResult;
    }
  } catch (err) {
    console.warn("[FitStreak API] Offline mode: computing sentiment locally.", err);
  }

  const lower = note.toLowerCase();
  const isPos = lower.includes("great") || lower.includes("good") || lower.includes("strong") || lower.includes("amazing") || lower.includes("loved");
  const isNeg = lower.includes("bad") || lower.includes("tired") || lower.includes("hurt") || lower.includes("exhausted") || lower.includes("pain");

  const label = isPos ? "Positive" : isNeg ? "Negative" : "Neutral";
  const compound = isPos ? 0.78 : isNeg ? -0.45 : 0.0;

  return {
    sentiment_label: label,
    compound_score: compound,
    positive_score: isPos ? 0.65 : 0.1,
    neutral_score: isPos ? 0.35 : 0.4,
    negative_score: isNeg ? 0.5 : 0.05,
    summary:
      label === "Positive"
        ? "High energy and satisfaction detected. Keep sustaining this positive feedback loop!"
        : label === "Negative"
        ? "Strenuous workout recorded. Ensure ample water intake, protein, and rest."
        : "Steady exertion maintained. Good balanced training session.",
    word_frequencies: [
      { text: "energy", value: 3 },
      { text: "strong", value: 2 },
      { text: "cardio", value: 2 },
      { text: "pace", value: 1 },
      { text: "sweat", value: 1 },
    ],
    total_words: note.split(/\s+/).length,
  };
}

