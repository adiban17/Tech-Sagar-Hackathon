import numpy as np
import pandas as pd
import ipaddress
from sklearn.preprocessing import OneHotEncoder

class FraudDataPipeline:
    def __init__(self):
        # Dictionary for location mapping
        self.city_map = {
            'mumbai': 'Mumbai', 'bombay': 'Mumbai', 'bom': 'Mumbai', 'mumb...': 'Mumbai', 'm#': 'Mumbai',
            'jaipur': 'Jaipur', 'jai': 'Jaipur', 'j...': 'Jaipur', 'jai??': 'Jaipur',
            'lucknow': 'Lucknow', 'lko': 'Lucknow', 'lu#': 'Lucknow', 'luc#': 'Lucknow', 'l...': 'Lucknow', 'l??': 'Lucknow', 'luckn':'Lucknow', 'l':'Lucknow',
            'chennai': 'Chennai', 'maa': 'Chennai', 'madras': 'Chennai', 'chenna#': 'Chennai', 'madr#' :'Chennai', 'che': 'Chennai',
            'hyderabad': 'Hyderabad', 'hyd': 'Hyderabad', 'hyde': 'Hyderabad', 'hyde...': 'Hyderabad', 'hyderab#':'Hyderabad', 'hyder...':'Hyderabad',
            'kolkata': 'Kolkata', 'ccu': 'Kolkata', 'calcutta': 'Kolkata',
            'delhi': 'Delhi', 'del': 'Delhi', 'new delhi': 'Delhi', 'h...': 'Hyderabad', 'de...':'Delhi',
            'bangalore': 'Bangalore', 'blr': 'Bangalore', 'bengaluru': 'Bangalore', 'beng...': 'Bangalore', 'bangalo': 'Bangalore', 'ba': 'Bangalore',
            'ahmedabad': 'Ahmedabad', 'amd': 'Ahmedabad',
            'pune': 'Pune', 'pnq': 'Pune', 'pu...':'Pune', 'pu??':'Pune', 'pun??':'Pune',
            'new york': 'New York', 'new yor#': 'New York',
            'dubai': 'Dubai',
            'bangkok': 'Bangkok',
            'singapore': 'Singapore',
            'international': 'Unknown',
        }

        # Dictionary for geospatial coordinates
        self.city_coords = {
            'Mumbai': (19.0760, 72.8777), 'Jaipur': (26.9124, 75.7873), 'Lucknow': (26.8467, 80.9462),
            'Chennai': (13.0827, 80.2707), 'Hyderabad': (17.3850, 78.4867), 'Kolkata': (22.5726, 88.3639),
            'Delhi': (28.7041, 77.1025), 'Bangalore': (12.9716, 77.5946), 'Ahmedabad': (23.0225, 72.5714),
            'Pune': (18.5204, 73.8567), 'New York': (40.7128, -74.0060), 'Dubai': (25.2048, 55.2708),
            'Bangkok': (13.7563, 100.5018), 'Singapore': (1.3521, 103.8198), 'Unknown': (np.nan, np.nan)
        }

    def _clean_ids(self, df):
        # Transaction IDs
        df['is_duplicate_txn'] = (df.duplicated(subset=['transaction_id'], keep=False) & ~df.duplicated(keep=False)).astype(int)
        
        # User IDs
        user_profiles = df.groupby('user_id').agg(user_transaction_count=('user_id', 'count')).reset_index()
        df = df.merge(user_profiles, on='user_id', how='left')
        return df

    def _clean_amounts(self, df):
        missing_indicators = [None, np.nan, '', 'NaN', 'NULL', 'null', 'N/A']
        df['is_amount_missing'] = df['transaction_amount'].isin(missing_indicators).astype(int)
        
        df['transaction_amount'] = (
            df['transaction_amount'].astype(str)
            .str.replace('₹', '', regex=False)
            .str.replace('$', '', regex=False)
            .str.replace(',', '', regex=False)
            .str.strip()
        )
        df['transaction_amount'] = pd.to_numeric(df['transaction_amount'], errors='coerce')
        
        amt_median = df['transaction_amount'].median()
        df['transaction_amount'] = df['transaction_amount'].fillna(amt_median)
        df['is_amount_outlier'] = (df['transaction_amount'] > df['transaction_amount'].quantile(0.99)).astype(int)
        
        if 'amt' in df.columns:
            df = df.drop(columns=['amt'])
        return df

    def _parse_timestamp(self, ts):
        if pd.isna(ts):
            return pd.NaT
        ts_str = str(ts).strip()
        if ts_str.isdigit() and len(ts_str) == 10:
            return pd.to_datetime(int(ts_str), unit='s')
        if ts_str.isdigit() and len(ts_str) == 13:
            return pd.to_datetime(int(ts_str), unit='ms')
        try:
            return pd.to_datetime(ts_str, format='mixed')
        except Exception:
            return pd.NaT

    def _clean_timestamps(self, df):
        df['transaction_timestamp'] = df['transaction_timestamp'].apply(self._parse_timestamp)
        df['txn_month'] = df['transaction_timestamp'].dt.month
        df['txn_day'] = df['transaction_timestamp'].dt.day
        df['txn_hour'] = df['transaction_timestamp'].dt.hour
        df['txn_minute'] = df['transaction_timestamp'].dt.minute
        df['txn_day_of_week'] = df['transaction_timestamp'].dt.dayofweek
        df['txn_is_weekend'] = (df['transaction_timestamp'].dt.dayofweek >= 5).astype(int)
        return df

    def _apply_geospatial_encoding(self, df, col_name):
        lat_col, lon_col = f"{col_name}_lat", f"{col_name}_lon"
        df[lat_col] = df[col_name].apply(lambda city: self.city_coords.get(city, (np.nan, np.nan))[0])
        df[lon_col] = df[col_name].apply(lambda city: self.city_coords.get(city, (np.nan, np.nan))[1])
        return df

    def _clean_locations(self, df):
        for col in ['user_location', 'merchant_location']:
            df[col] = df[col].str.lower().str.strip()
            df[col] = df[col].replace(self.city_map)
            df[col] = df[col].str.title()
            df = self._apply_geospatial_encoding(df, col)
        return df

    def _clean_categories(self, df):
        df['merchant_category'] = df['merchant_category'].fillna("Unknown")
        user_cat_counts = df.groupby(['user_id', 'merchant_category']).size().reset_index(name='cat_count')
        user_total_counts = df.groupby('user_id').size().reset_index(name='total_count')
        
        affinity_df = pd.merge(user_cat_counts, user_total_counts, on='user_id')
        affinity_df['user_category_affinity'] = affinity_df['cat_count'] / affinity_df['total_count']
        
        df = pd.merge(df, affinity_df[['user_id', 'merchant_category', 'user_category_affinity']], on=['user_id', 'merchant_category'], how='left')
        
        cat_median_amounts = df.groupby('merchant_category')['transaction_amount'].median().to_dict()
        df['category_economic_weight'] = df['merchant_category'].map(cat_median_amounts)
        return df

    def _clean_devices(self, df):
        users_per_device = df.groupby('device_id')['user_id'].nunique().to_dict()
        df['unique_users_on_device'] = df['device_id'].map(users_per_device).fillna(1)
        df['is_unique_users_on_device_outlier'] = (df['unique_users_on_device'] > df['unique_users_on_device'].quantile(0.99)).astype(int)
        
        encoder = OneHotEncoder(drop="first", sparse_output=False)
        device_type_encoded = encoder.fit_transform(df[["device_type"]])
        encoded_df = pd.DataFrame(device_type_encoded, columns=encoder.get_feature_names_out(["device_type"]), index=df.index)
        df = pd.concat([df, encoded_df], axis=1)
        return df

    def _clean_financials(self, df):
        # Account Balance
        df['is_balance_missing'] = df['account_balance'].isnull().astype(int)
        df['account_balance'] = pd.to_numeric(df['account_balance'], errors='coerce')
        df['account_balance'] = df['account_balance'].fillna(df['account_balance'].median())
        
        conditions = [df['transaction_amount'] < 0, df['account_balance'] < 0]
        choices = [-1.0, -1.0]
        default_choice = df['transaction_amount'] / (df['account_balance'] + 0.01)
        df['balance_utilization'] = np.select(conditions, choices, default=default_choice)

        # Payment Method & Status
        df = pd.get_dummies(df, columns=['payment_method', 'transaction_status'], prefix=['pay', 'transaction_status'], drop_first=True, dtype=int)
        return df

    def _check_ip_suspicious(self, ip):
        if pd.isna(ip) or ip in ["", "NA", "$N/A$", "nan", "NULL"]:
            return 1
        try:
            ipaddress.ip_address(str(ip).strip())
            return 0
        except ValueError:
            return 1

    def _clean_ips(self, df):
        df['is_ip_suspicious'] = df['ip_address'].apply(self._check_ip_suspicious)
        return df

    def _extract_features(self, df):
        """
        Applies all fraud detection rules to the dataframe and creates a master is_fraud label.
        """
        # 0. Setup: Ensure timestamp is datetime for velocity calculations
        if not pd.api.types.is_datetime64_any_dtype(df['transaction_timestamp']):
            df['transaction_timestamp'] = pd.to_datetime(df['transaction_timestamp'])

        # 1. Pattern: Duplicate Transaction 
        df['pattern_duplicate'] = np.where(df['is_duplicate_txn'] == 1, 1, 0)

        # 2. Pattern: Suspicious IP
        df['pattern_ip'] = np.where(df['is_ip_suspicious'] == 1, 1, 0)

        # 3. Pattern: Extreme Balance Utilization (Top 1%)
        threshold_bal = df['balance_utilization'].quantile(0.99)
        df['pattern_balance'] = np.where(df['balance_utilization'] > threshold_bal, 1, 0)

        # 4. Pattern: Fraud Ring (Multiple users on one device)
        df['pattern_fraud_ring'] = np.where(df['unique_users_on_device'] >= 3, 1, 0)

        # 5. Pattern: Night Owl (Late night + extreme amounts)
        df['pattern_night_owl'] = (
            (df['txn_hour'] >= 1) & 
            (df['txn_hour'] <= 5) & 
            ((df['transaction_amount'] > 100000) | (df['transaction_amount'] < 25))
        ).astype(int)

        # 6. Pattern: Botnet (Multiple unique users on same IP)
        df['unique_users_on_ip'] = df.groupby('ip_address')['user_id'].transform('nunique')
        df['pattern_botnet'] = (df['unique_users_on_ip'] > 3).astype(int)

        # 7. Pattern: Velocity Fraud (High frequency in short time)
        # Sort values and temporarily set index for time-based rolling window
        df = df.sort_values(by=['user_id', 'transaction_timestamp'])
        df = df.set_index('transaction_timestamp')
        
        # Calculate transactions in a 1-hour window per user
        df['txn_count_in_window'] = df.groupby('user_id')['transaction_id'].transform(
            lambda x: x.rolling('1h').count()
        )
        df['pattern_velocity'] = (df['txn_count_in_window'] >= 3).astype(int)
        
        # Reset index to bring transaction_timestamp back as a regular column
        df = df.reset_index()

        # =====================================================================
        # MASTER IS_FRAUD TARGET
        # =====================================================================
        # Dynamically grab all columns we just created that start with 'pattern_'
        pattern_cols = [col for col in df.columns if col.startswith('pattern_')]

        # If ANY pattern is flagged as 1, the master is_fraud becomes 1
        df['is_fraud'] = df[pattern_cols].max(axis=1)

        return df

    def prepare_features(self, df, target_col='is_fraud'):
        """
        Strips non-predictive columns and separates the target variable for ML.
        """
        X = df.copy()
        y_true = None
        
        # 1. Extract the ground truth labels if they exist
        if target_col in X.columns:
            y_true = X[target_col].copy()
            X = X.drop(columns=[target_col])

        # 2. Define the junk/string columns that models hate
        cols_to_drop = [
            'transaction_id', 'user_id', 'device_id', 'ip_address',
            'transaction_timestamp', 'user_location', 'merchant_location',
            'merchant_category', 'device_type'
        ]
        
        # Safely drop only the columns that actually exist
        existing_cols_to_drop = [col for col in cols_to_drop if col in X.columns]
        X = X.drop(columns=existing_cols_to_drop)

        # 3. Handle Missing Values
        X = X.fillna(0)

        return X, y_true

    def run(self, df, prepare_for_ml=False, target_col='is_fraud'):
        """Executes the data cleaning pipeline with a smart bypass."""
        df_clean = df.copy()
        
        # SMART BYPASS: Check if the raw columns we need actually exist
        if 'payment_method' in df_clean.columns and 'transaction_status' in df_clean.columns:
            df_clean = self._clean_ids(df_clean)
            df_clean = self._clean_amounts(df_clean)
            df_clean = self._clean_timestamps(df_clean)
            df_clean = self._clean_locations(df_clean)
            df_clean = self._clean_categories(df_clean)
            df_clean = self._clean_devices(df_clean)
            df_clean = self._clean_financials(df_clean)
            df_clean = self._clean_ips(df_clean)
        else:
            print("Pre-processed data detected. Bypassing cleaning steps.")
            
        # Extract fraud features from cleaned data
        df_clean = self._extract_features(df_clean)
            
        # If we are running this for the ML model, strip the junk
        if prepare_for_ml:
            X, y_true = self.prepare_features(df_clean, target_col)
            return df_clean, X, y_true 
            
        return df_clean