from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
import numpy as np
import io
import joblib
import shap
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# Import the class you just saved
from pipeline import FraudDataPipeline 

app = FastAPI(title="Fraud Detection Data Cleaner API")

# Crucial Step: Set up CORS so your React frontend can talk to this backend
app.add_middleware(
    CORSMiddleware,
    # REPLACE the URL below with your actual Netlify URL!
    allow_origins=["https://statuesque-tarsier-02266a.netlify.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize your pipeline
cleaner = FraudDataPipeline()

# Load the trained model
try:
    model = joblib.load('fraud_model.joblib')
    print("Model loaded successfully")
except FileNotFoundError:
    print("Warning: fraud_model.joblib not found. Model predictions will not be available.")
    model = None

@app.post("/api/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    # 1. Read the uploaded CSV file bytes into memory
    contents = await file.read()
    
    # 2. Convert those bytes into a Pandas DataFrame
    raw_df = pd.read_csv(io.BytesIO(contents))
    
    # 3. Pass the raw data through your cleaning pipeline with ML preparation
    cleaned_df, X, y_true = cleaner.run(raw_df, prepare_for_ml=True, target_col='is_fraud')
    
    # 4. Make predictions if model is available
    predictions = None
    metrics_dict = {}
    
    if model is not None and X is not None:
        try:
            # Add Shape Alignment: Check model's expected columns and align X
            expected_cols = getattr(model, "feature_names_in_", getattr(model, "feature_name_", None))
            if expected_cols is not None:
                # Add missing columns with 0 values
                for col in expected_cols:
                    if col not in X.columns:
                        X[col] = 0
                # Filter and reorder X to match expected columns exactly
                X = X[expected_cols]
                
                # --- SHAP VALUE CALCULATION ---
                top_10_shap = []
                try:
                    # 1. Extract the actual classifier from the imblearn Pipeline if necessary
                    if hasattr(model, 'steps'):
                        classifier = model.steps[-1][1]
                    else:
                        classifier = model
                        
                    # 2. Initialize the Explainer (TreeExplainer is optimized for RF/XGBoost)
                    explainer = shap.TreeExplainer(classifier)
                    
                    # 3. Sample data to keep the API lightning fast (500 rows is plenty for global importance)
                    X_sample = X.sample(min(500, len(X)), random_state=42) if len(X) > 500 else X
                    shap_values_raw = explainer.shap_values(X_sample)
                    
                    # 4. Handle output shape differences between algorithms (RF vs XGBoost)
                    if isinstance(shap_values_raw, list):
                        shap_values_class1 = shap_values_raw[1] # We want the fraud class (1)
                    elif len(shap_values_raw.shape) == 3:
                        shap_values_class1 = shap_values_raw[:, :, 1]
                    else:
                        shap_values_class1 = shap_values_raw
                        
                    # 5. Calculate Mean Absolute SHAP values per feature
                    mean_abs_shap = np.abs(shap_values_class1).mean(axis=0)
                    
                    # 6. Map to feature names, sort descending, and grab the Top 10
                    feature_importance = [
                        {"feature": col, "importance": float(val)} 
                        for col, val in zip(X.columns, mean_abs_shap)
                    ]
                    feature_importance.sort(key=lambda x: x["importance"], reverse=True)
                    top_10_shap = feature_importance[:10]
                    
                except Exception as e:
                    print(f"Warning: SHAP calculation skipped or failed: {e}")
                # ------------------------------
            
            # Adjust Prediction Logic: Use probabilities with optimal threshold
            probabilities = model.predict_proba(X)[:, 1]
            predictions = (probabilities > 0.0978).astype(int)
            cleaned_df['predicted_fraud'] = predictions
            
            # Add risk scoring and categorization
            cleaned_df['risk_score'] = (probabilities * 100).round(1)
            
            # Create risk levels based on probability thresholds
            risk_conditions = [
                probabilities < 0.10,      # Low Risk
                (probabilities >= 0.10) & (probabilities <= 0.45),  # Medium Risk
                probabilities > 0.45       # High Risk
            ]
            risk_choices = ['Low Risk', 'Medium Risk', 'High Risk']
            cleaned_df['risk_level'] = np.select(risk_conditions, risk_choices, default='Low Risk')
            
            # Calculate metrics if true labels are available
            if y_true is not None:
                accuracy = float(accuracy_score(y_true, predictions))
                precision = float(precision_score(y_true, predictions, zero_division=0))
                recall = float(recall_score(y_true, predictions, zero_division=0))
                f1 = float(f1_score(y_true, predictions, zero_division=0))
                conf_matrix = confusion_matrix(y_true, predictions).tolist()
                
                # Calculate risk level counts
                risk_level_counts = cleaned_df['risk_level'].value_counts().to_dict()
                
                metrics_dict = {
                    "accuracy": accuracy,
                    "precision": precision,
                    "recall": recall,
                    "f1_score": f1,
                    "confusion_matrix": conf_matrix,
                    "total_samples": len(y_true),
                    "fraud_predictions": int(sum(predictions)),
                    "actual_fraud": int(sum(y_true)),
                    "high_risk_count": int(risk_level_counts.get('High Risk', 0)),
                    "medium_risk_count": int(risk_level_counts.get('Medium Risk', 0)),
                    "low_risk_count": int(risk_level_counts.get('Low Risk', 0)),
                    "shap_values": top_10_shap  # <--- NEW SHAP DATA
                }
            else:
                # Calculate risk level counts
                risk_level_counts = cleaned_df['risk_level'].value_counts().to_dict()
                
                metrics_dict = {
                    "message": "No true labels available for metrics calculation",
                    "total_samples": len(predictions),
                    "fraud_predictions": int(sum(predictions)),
                    "high_risk_count": int(risk_level_counts.get('High Risk', 0)),
                    "medium_risk_count": int(risk_level_counts.get('Medium Risk', 0)),
                    "low_risk_count": int(risk_level_counts.get('Low Risk', 0)),
                    "shap_values": top_10_shap  # <--- NEW SHAP DATA
                }
        except Exception as e:
            metrics_dict = {
                "error": f"Model prediction failed: {str(e)}",
                "total_samples": len(cleaned_df) if cleaned_df is not None else 0
            }
    else:
        metrics_dict = {
            "message": "Model not available or no features for prediction",
            "total_samples": len(cleaned_df) if cleaned_df is not None else 0
        }
    
    # 5. Convert the cleaned DataFrame back to a CSV string in memory
    csv_stream = io.StringIO()
    cleaned_df.to_csv(csv_stream, index=False)
    csv_string = csv_stream.getvalue()
    
    # 6. Return JSON response with metrics and CSV data
    return {
        "metrics": metrics_dict,
        "csv_data": csv_string,
        "filename": f"scored_{file.filename}"
    }

@app.get("/")
def read_root():
    return {"message": "Fraud Detection Backend is running!"}