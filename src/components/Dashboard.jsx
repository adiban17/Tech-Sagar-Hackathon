import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Shield, Activity, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import Papa from 'papaparse';
import Visualizations from './Visualizations';
import FinancialNews from './FinancialNews';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [cleanedData, setCleanedData] = useState(null);
  const [metrics, setMetrics] = useState({
    totalScans: 0,
    fraudDetected: 0,
    accuracyRate: "0%",
    f1Score: "0",
    shapData: []
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      handleFileUpload(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    
    // Read and parse CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      const data = lines.slice(1).map(line => line.split(','));
      
      setUploadedData({
        headers,
        rows: data.filter(row => row.length === headers.length),
        totalRows: data.length - 1
      });
    };
    reader.readAsText(uploadedFile);
  };

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://prolific-reprieve-production.up.railway.app/api/upload-csv', {
  method: 'POST',
  body: formData
});

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Catch hidden machine learning errors from backend
      if (data.metrics && data.metrics.error) {
        throw new Error("Python Backend Error: " + data.metrics.error);
      }

      // Debug: Log the raw metrics data from backend
      console.log("Backend Metrics:", data.metrics);

      // Update metrics state from API response with exact key matching
      const newMetrics = {
        totalScans: data.metrics.total_samples !== undefined ? data.metrics.total_samples : uploadedData.totalRows,
        fraudDetected: data.metrics.fraud_predictions !== undefined ? Math.round(data.metrics.fraud_predictions / 100) : 0,
        accuracyRate: data.metrics.accuracy !== undefined ? (data.metrics.accuracy * 100).toFixed(1) + "%" : "N/A",
        f1Score: data.metrics.f1_score !== undefined ? data.metrics.f1_score.toFixed(3) : "N/A",
        shapData: data.metrics.shap_values || []
      };

      setMetrics(newMetrics);
      
      // Parse the cleaned CSV data
      Papa.parse(data.csv_data, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          setCleanedData(result.data);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
        }
      });
      
      // Handle CSV download from the returned string
      const csvBlob = new Blob([data.csv_data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(csvBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessMsg('Analysis completed successfully! Download started.');
    } catch (error) {
      setErrorMsg('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050505' }}>
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack}
                className="p-2 rounded-lg glass-effect border border-white/10 text-white hover:bg-white/5 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Fraud Detection Dashboard</h1>
                <p className="text-gray-400 mt-1">Upload and analyze your transaction data</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
              <span className="text-emerald text-sm">System Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-lg p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Scans</p>
                <p className="text-2xl font-bold text-white mt-1">{metrics.totalScans}</p>
              </div>
              <Activity className="w-8 h-8 text-emerald" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-lg p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Fraud Detected</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{metrics.fraudDetected}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-lg p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Accuracy Rate</p>
                <p className="text-2xl font-bold text-emerald mt-1">{metrics.accuracyRate}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-lg p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">F1 Score</p>
                <p className="text-2xl font-bold text-white mt-1">{metrics.f1Score}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section - Takes 2/3 width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass-effect rounded-lg border border-white/10 p-8"
          >
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">Upload Transaction Data</h2>
            <p className="text-gray-400">Upload a CSV file to analyze transactions for fraud detection</p>
          </div>

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
                isDragging
                  ? 'border-emerald bg-emerald/5'
                  : 'border-white/20 hover:border-white/30'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">Drop your CSV file here</p>
              <p className="text-gray-400 mb-6">or click to browse</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #00F0FF, #00D4CC)',
                  color: '#000',
                  fontWeight: '600'
                }}
              >
                <FileText className="w-4 h-4" />
                Choose File
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald/10 border border-emerald/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-emerald" />
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setUploadedData(null);
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>

              {uploadedData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-effect rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm">Total Rows</p>
                      <p className="text-xl font-bold text-white">{uploadedData.totalRows}</p>
                    </div>
                    <div className="glass-effect rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm">Columns</p>
                      <p className="text-xl font-bold text-white">{uploadedData.headers.length}</p>
                    </div>
                    <div className="glass-effect rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm">Status</p>
                      <p className="text-xl font-bold text-emerald">Ready</p>
                    </div>
                  </div>

                  {cleanedData && (
                    <div className="glass-effect rounded-lg border border-white/10 p-4">
                      <h3 className="text-white font-medium mb-3">Data Preview with Risk Analysis</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/10">
                              {Object.keys(cleanedData[0] || {}).map((header, index) => (
                                <th key={index} className="text-left py-2 px-3 text-gray-400">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {cleanedData.slice(0, 5).map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-b border-white/5">
                                {Object.entries(row).map(([key, cell], cellIndex) => {
                                  // Apply color-coding for risk_level
                                  if (key === 'risk_level') {
                                    let colorClass = 'text-white';
                                    if (cell === 'High Risk') colorClass = 'text-red-400';
                                    else if (cell === 'Medium Risk') colorClass = 'text-yellow-400';
                                    else if (cell === 'Low Risk') colorClass = 'text-emerald-400';
                                    
                                    return (
                                      <td key={cellIndex} className={`py-2 px-3 ${colorClass}`}>
                                        {cell}
                                      </td>
                                    );
                                  }
                                  // Format risk_score as percentage
                                  else if (key === 'risk_score') {
                                    return (
                                      <td key={cellIndex} className="py-2 px-3 text-white">
                                        {cell}%
                                      </td>
                                    );
                                  }
                                  // Default styling for other cells
                                  else {
                                    return (
                                      <td key={cellIndex} className="py-2 px-3 text-white">
                                        {cell}
                                      </td>
                                    );
                                  }
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {cleanedData.length > 5 && (
                        <p className="text-gray-400 text-sm mt-3">
                          Showing 5 of {cleanedData.length} rows
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-center">
                    <button
                      onClick={handleAnalysis}
                      disabled={isAnalyzing}
                      className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg, #00F0FF, #00D4CC)',
                        color: '#000'
                      }}
                    >
                      {isAnalyzing ? 'Processing Pipeline...' : 'Start Analysis'}
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="text-center">
                      <p className="text-red-400 text-sm">{errorMsg}</p>
                    </div>
                  )}

                  {successMsg && (
                    <div className="text-center">
                      <p className="text-emerald text-sm">{successMsg}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          </motion.div>

          {/* Financial News Section - Takes 1/3 width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FinancialNews />
          </motion.div>
        </div>

        {/* Visualizations Section */}
        {cleanedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">Data Analysis Results</h2>
              <p className="text-gray-400">Visualizations of your cleaned transaction data</p>
            </div>
            <Visualizations data={cleanedData} metrics={metrics} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
