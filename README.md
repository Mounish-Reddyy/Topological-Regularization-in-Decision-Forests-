# 🌲 SPDF Studio: Shape Penalized Decision Forests

> A general-purpose, platform-agnostic machine learning web application and dashboard for imbalanced tabular data classification and model interpretability.

---

## 🚀 Overview

**SPDF Studio** is an advanced analytics and machine learning platform designed to tackle severe class imbalance in tabular datasets across multiple domains (e.g., customer churn, equipment failure, loan default, and fraud detection) **without relying on data resampling techniques** like SMOTE.

Traditional models often suffer from overfitting or fragmented decision boundaries when dealing with skewed classes. SPDF Studio introduces **Shape Penalized Decision Forests (SPDF)**, leveraging *Surface to Volume Ratio Trees* and explicit topological boundary regularization to yield smooth, robust, and highly generalizable decision boundaries.

---

## ✨ Key Features

* **Universal Dataset Upload & Batch Evaluation:** Drag-and-drop CSV parser supporting multi-domain tabular data with custom target label mapping.
* **Global Performance Metrics:** Real-time calculation of critical imbalanced classification metrics including **PR-AUC**, **MCC**, **Specificity**, **False Negative Rate (FNR)**, and **False Discovery Rate (FDR)**.
* **Interactive Prediction Simulator:** Dynamic input sliders and parameters to run single-row inferences and evaluate risk scores instantly.
* **SHAP Interpretability Integration:** Built-in explainability pipeline providing feature attribution breakdowns (waterfall/bar charts) to explain *why* a prediction was made.
* **Decision Boundary Insights:** Visual comparisons illustrating how SPDF avoids jagged overfitting boundaries compared to standard ensemble methods.

---

## 📊 Supported Data & Testing
SPDF Studio is designed to ingest general tabular datasets with mixed numerical and categorical features containing skewed binary targets (minority class imbalance). Sample datasets included in testing workflows:
* Customer Churn Telemetry (`churn_prediction_60.csv`)
* Predictive Maintenance Sensor Logs (`equipment_failure_60.csv`)
* Financial Risk & Loan Defaults (`loan_default_60.csv`)

---

## 🛠️ Tech Stack & Architecture

* **Frontend & Dashboard:** React, TypeScript, Tailwind CSS, Lucide Icons, Recharts / Chart.js.
* **Machine Learning & Core:** Python, NumPy, Scikit-Learn, Pandas, SHAP.
* **Platform Integration:** Lovable / GitHub CI/CD automated deployment pipeline.

---

## ⚙️ Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Mounish-Reddyy/spdf-studio.git](https://github.com/Mounish-Reddyy/spdf-studio.git)
   cd spdf-studio
