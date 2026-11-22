from typing import Any, Dict, List, Tuple
import numpy as np
import polars as pl
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from statsmodels.stats.outliers_influence import variance_inflation_factor

from .data_loader import NUMERIC_COLUMNS, load_dataset


def get_correlation_insights() -> Dict[str, Any]:
    df = load_dataset()
    X = df.select(NUMERIC_COLUMNS).to_numpy()
    
    # Pearson Correlation Matrix
    corr_matrix = np.corrcoef(X, rowvar=False)
    num_cols = len(NUMERIC_COLUMNS)

    matrix_2d: List[List[float]] = []
    flat_cells: List[Dict[str, Any]] = []
    multicollinearity_flags: List[Dict[str, Any]] = []

    for i in range(num_cols):
        row = []
        for j in range(num_cols):
            val = round(float(corr_matrix[i, j]), 4)
            row.append(val)
            flat_cells.append({
                "feature_x": NUMERIC_COLUMNS[i],
                "feature_y": NUMERIC_COLUMNS[j],
                "correlation": val,
            })
            # Flag distinct pairs with correlation > 0.65
            if i < j and abs(val) >= 0.65:
                severity = "High" if abs(val) >= 0.80 else "Moderate"
                desc = (
                    f"Strong collinearity between {NUMERIC_COLUMNS[i]} and {NUMERIC_COLUMNS[j]} (r = {val:+.2f}). "
                    f"May inflate standard errors in regression models."
                )
                multicollinearity_flags.append({
                    "feature_1": NUMERIC_COLUMNS[i],
                    "feature_2": NUMERIC_COLUMNS[j],
                    "correlation": val,
                    "description": desc,
                    "severity": severity,
                })
        matrix_2d.append(row)

    # Calculate VIF (Variance Inflation Factor)
    vif_scores: List[Dict[str, Any]] = []
    # Standardize X to stabilize VIF computation
    X_std = StandardScaler().fit_transform(X)
    for idx, feature_name in enumerate(NUMERIC_COLUMNS):
        try:
            val_vif = float(variance_inflation_factor(X_std, idx))
            if np.isinf(val_vif) or np.isnan(val_vif):
                val_vif = 99.99
        except Exception:
            val_vif = 1.0

        val_vif = round(val_vif, 2)
        if val_vif > 10.0:
            interp = "Severe Multicollinearity (VIF > 10) - consider regularization or feature reduction"
        elif val_vif > 5.0:
            interp = "Moderate Multicollinearity (VIF > 5) - monitor feature stability"
        else:
            interp = "Low Multicollinearity (VIF < 5) - safe for linear regression"

        vif_scores.append({
            "feature": feature_name,
            "vif": val_vif,
            "interpretation": interp,
        })

    return {
        "numeric_columns": NUMERIC_COLUMNS,
        "matrix": matrix_2d,
        "flat_matrix": flat_cells,
        "multicollinearity_flags": multicollinearity_flags,
        "vif_scores": vif_scores,
    }


def get_pca_insights() -> Dict[str, Any]:
    df = load_dataset()
    X = df.select(NUMERIC_COLUMNS).to_numpy()
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    pca = PCA()
    X_pca = pca.fit_transform(X_scaled)

    # Scree plot metrics: eigenvalues and explained variances
    eigenvalues = pca.explained_variance_
    var_ratios = pca.explained_variance_ratio_
    cum_var = np.cumsum(var_ratios)

    scree_plot = []
    for i in range(len(eigenvalues)):
        scree_plot.append({
            "component": f"PC{i+1}",
            "eigenvalue": round(float(eigenvalues[i]), 4),
            "variance_ratio": round(float(var_ratios[i]), 4),
            "cumulative_variance": round(float(cum_var[i]), 4),
        })

    # Loadings matrix (Correlation between original features and PCs)
    # pca.components_ has shape (n_components, n_features)
    loadings = []
    for f_idx, feature in enumerate(NUMERIC_COLUMNS):
        row_dict: Dict[str, Any] = {"feature": feature}
        for pc_idx in range(min(5, len(pca.components_))):
            row_dict[f"PC{pc_idx+1}"] = round(float(pca.components_[pc_idx, f_idx]), 4)
        loadings.append(row_dict)

    # Sample 2D scatter points (take 80 evenly spaced samples for fast rendering)
    scatter_points = []
    step = max(1, df.height // 80)
    for i in range(0, df.height, step):
        row = df.row(i, named=True)
        scatter_points.append({
            "pc1": round(float(X_pca[i, 0]), 3),
            "pc2": round(float(X_pca[i, 1]), 3),
            "gender": str(row["Gender"]),
            "workout_type": str(row["Workout_Type"]),
            "experience_level": int(row["Experience_Level"]),
            "calories_burned": round(float(row["Calories_Burned"]), 1),
        })

    return {
        "numeric_columns": NUMERIC_COLUMNS,
        "scree_plot": scree_plot,
        "loadings": loadings,
        "scatter_points": scatter_points,
    }

