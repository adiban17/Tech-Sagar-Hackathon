import React, { useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement,
  PointElement, LineElement, RadialLinearScale, Filler
} from 'chart.js';
import { Bar, Pie, Doughnut, Scatter, Radar } from 'react-chartjs-2';

// Register all required Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement,
  PointElement, LineElement, RadialLinearScale, Filler
);

const Visualizations = ({ data, metrics }) => {
  // Filter out any trailing empty rows caused by CSV formatting
  const validData = useMemo(() => data?.filter(row => Object.keys(row).length > 2) || [], [data]);
  if (!validData || validData.length === 0) return null;

  // ==========================================
  // 1. ADVANCED AI VISUALIZATIONS (The New Charts)
  // ==========================================

  const getRiskTiers = () => {
    const counts = { 'High Risk': 0, 'Medium Risk': 0, 'Low Risk': 0 };
    validData.forEach(row => {
      if (row.risk_level && counts[row.risk_level] !== undefined) counts[row.risk_level]++;
    });
    return {
      labels: ['High Risk', 'Medium Risk', 'Low Risk'],
      datasets: [{
        data: [counts['High Risk'], counts['Medium Risk'], counts['Low Risk']],
        backgroundColor: ['#EF4444', '#FBBF24', '#10B981'],
        borderColor: 'rgba(0,0,0,0.5)',
        borderWidth: 2,
      }]
    };
  };

  const getThreatMatrix = () => {
    const highRisk = []; const medRisk = []; const lowRisk = [];
    validData.forEach(row => {
      const point = { x: Number(row.transaction_amount) || 0, y: Number(row.risk_score) || 0 };
      if (row.risk_level === 'High Risk') highRisk.push(point);
      else if (row.risk_level === 'Medium Risk') medRisk.push(point);
      else if (lowRisk.length < 500) lowRisk.push(point);
    });
    return {
      datasets: [
        { label: 'High Risk', data: highRisk, backgroundColor: '#EF4444', pointRadius: 5 },
        { label: 'Medium Risk', data: medRisk, backgroundColor: '#FBBF24', pointRadius: 4 },
        { label: 'Low Risk (Sample)', data: lowRisk, backgroundColor: '#10B981', pointRadius: 3, pointBackgroundColor: 'rgba(16, 185, 129, 0.4)' }
      ]
    };
  };

  const getHourlyRadar = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const fraudCounts = new Array(24).fill(0);
    validData.forEach(row => {
      const hour = Number(row.txn_hour);
      if (!isNaN(hour) && hour >= 0 && hour < 24 && Number(row.predicted_fraud) === 1) {
        fraudCounts[hour]++;
      }
    });
    return {
      labels: hours.map(h => `${h}:00`),
      datasets: [{
        label: 'Fraudulent Activity', data: fraudCounts,
        backgroundColor: 'rgba(239, 68, 68, 0.4)', borderColor: '#EF4444', borderWidth: 2, fill: true,
      }]
    };
  };

  const getVulnerabilityStack = () => {
    const payKeys = Object.keys(validData[0] || {}).filter(k => k.startsWith('pay_'));
    const safeCounts = {}; const fraudCounts = {};
    payKeys.forEach(k => { safeCounts[k] = 0; fraudCounts[k] = 0; });

    validData.forEach(row => {
      const isFraud = Number(row.predicted_fraud) === 1;
      payKeys.forEach(k => {
        if (Number(row[k]) === 1) {
          if (isFraud) { fraudCounts[k]++; }
          else { safeCounts[k]++; }
        }
      });
    });

    const labels = payKeys.map(k => k.replace('pay_', ''));
    
    return {
      labels,
      datasets: [
        { label: 'Safe Transactions', data: payKeys.map(k => safeCounts[k]), backgroundColor: '#10B981' },
        { label: 'Fraudulent', data: payKeys.map(k => fraudCounts[k]), backgroundColor: '#EF4444' }
      ]
    };
  };

  const getShapChartData = () => {
    if (!metrics?.shapData || metrics.shapData.length === 0) {
      return {
        labels: ['No SHAP data available'],
        datasets: [{
          label: 'Feature Importance',
          data: [0],
          backgroundColor: '#8B5CF6',
          borderColor: 'rgba(139, 92, 246, 0.5)',
          borderWidth: 1,
        }]
      };
    }

    return {
      labels: metrics.shapData.map(item => item.feature),
      datasets: [{
        label: 'Feature Importance',
        data: metrics.shapData.map(item => item.importance),
        backgroundColor: '#8B5CF6',
        borderColor: 'rgba(139, 92, 246, 0.5)',
        borderWidth: 1,
      }]
    };
  };

  // ==========================================
  // 2. DEMOGRAPHICS & DISTRIBUTIONS (The Original Charts)
  // ==========================================

  const getTop10 = (key) => {
    const counts = {};
    validData.forEach(row => {
      const val = row[key];
      if (val) counts[val] = (counts[val] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    return {
      labels: sorted.map(item => item[0]),
      datasets: [{
        label: `Top 10 ${key.replace('_', ' ').toUpperCase()}`,
        data: sorted.map(item => item[1]),
        backgroundColor: 'rgba(0, 240, 255, 0.6)', borderColor: '#00F0FF', borderWidth: 1,
      }]
    };
  };

  const getHistogram = (key, label) => {
    const values = validData.map(r => Number(r[key])).filter(v => !isNaN(v));
    if (values.length === 0) return { labels: [], datasets: [] };
    const min = Math.min(...values); const max = Math.max(...values);
    const binSize = (max - min) / 10;
    const binCounts = new Array(10).fill(0);
    
    values.forEach(v => {
      let index = Math.floor((v - min) / binSize);
      if (index === 10) index--;
      binCounts[index]++;
    });

    return {
      labels: Array.from({length: 10}, (_, i) => `${(min + i * binSize).toFixed(0)} - ${(min + (i + 1) * binSize).toFixed(0)}`),
      datasets: [{
        label: label, data: binCounts,
        backgroundColor: 'rgba(16, 185, 129, 0.6)', borderColor: '#10B981', borderWidth: 1,
        barPercentage: 1.0, categoryPercentage: 1.0,
      }]
    };
  };

  const getPieData = (originalCol, prefix, label) => {
    const counts = {};
    if (validData[0] && validData[0][originalCol] !== undefined) {
      validData.forEach(row => {
        const val = row[originalCol];
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
    } else {
      const keys = Object.keys(validData[0] || {}).filter(k => k.startsWith(prefix));
      keys.forEach(k => counts[k.replace(prefix, '')] = 0);
      
      validData.forEach(row => {
        keys.forEach(k => {
          if (Number(row[k]) === 1) { counts[k.replace(prefix, '')] += 1; }
        });
      });
    }
    const colors = ['#00F0FF', '#00D4CC', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];
    return {
      labels: Object.keys(counts),
      datasets: [{
        label: label, data: Object.values(counts),
        backgroundColor: colors.slice(0, Object.keys(counts).length), borderColor: 'rgba(0,0,0,0.5)', borderWidth: 1,
      }]
    };
  };

  // --- SHARED STYLING ---
  const darkThemeOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#e5e7eb' } } } };
  const standardBarOptions = { ...darkThemeOptions, scales: { y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { ticks: { color: '#9ca3af' }, grid: { display: false } } } };

  return (
    <div className="mt-8 space-y-12">
      
      {/* SECTION 1: AI THREAT INTELLIGENCE */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">AI Threat Intelligence</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md flex flex-col items-center">
            <div className="mb-4 text-center"><h3 className="text-white font-semibold text-lg">System Risk Assessment</h3></div>
            <div className="w-full h-64 relative">
              <Doughnut data={getRiskTiers()} options={{ ...darkThemeOptions, cutout: '70%' }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-white">{validData.length}</span>
                <span className="text-xs text-gray-400">Total Scans</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
            <div className="mb-4 text-center"><h3 className="text-white font-semibold text-lg">Threat Matrix</h3></div>
            <div className="w-full h-64">
              <Scatter data={getThreatMatrix()} options={{ ...darkThemeOptions, scales: { x: { ticks: { color: '#9ca3af' } }, y: { ticks: { color: '#9ca3af' } } } }} />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
            <div className="mb-4 text-center"><h3 className="text-white font-semibold text-lg">Vulnerabilities by Vector</h3></div>
            <div className="w-full h-64">
              <Bar data={getVulnerabilityStack()} options={{ ...darkThemeOptions, scales: { x: { stacked: true, ticks: { color: '#9ca3af' } }, y: { stacked: true, ticks: { color: '#9ca3af' } } } }} />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
            <div className="mb-4 text-center"><h3 className="text-white font-semibold text-lg">Temporal Threat Radar</h3></div>
            <div className="w-full h-64">
              <Radar data={getHourlyRadar()} options={{ ...darkThemeOptions, scales: { r: { pointLabels: { color: '#9ca3af' }, ticks: { display: false } } } }} />
            </div>
          </div>

          <div className="col-span-1 xl:col-span-2 bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
            <div className="mb-4 text-center"><h3 className="text-white font-semibold text-lg">AI Decision Drivers (SHAP Global Feature Importance)</h3></div>
            <div className="w-full h-64">
              <Bar 
                data={getShapChartData()} 
                options={{
                  ...darkThemeOptions,
                  indexAxis: 'y',
                  scales: {
                    x: { 
                      ticks: { color: '#9ca3af' },
                      grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: { 
                      ticks: { color: '#9ca3af' },
                      grid: { display: false }
                    }
                  }
                }} 
              />
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: TRANSACTION DEMOGRAPHICS */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">Transaction Demographics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
            <h3 className="text-white mb-4 text-center font-semibold">Account Balance Distribution</h3>
            <div className="w-full h-64"><Bar data={getHistogram('account_balance', 'Users')} options={standardBarOptions} /></div>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
            <h3 className="text-white mb-4 text-center font-semibold">Transaction Amount Distribution</h3>
            <div className="w-full h-64"><Bar data={getHistogram('transaction_amount', 'Transactions')} options={standardBarOptions} /></div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
            <h3 className="text-white mb-4 text-center font-semibold">Top User Locations</h3>
            <div className="w-full h-64"><Bar data={getTop10('user_location')} options={standardBarOptions} /></div>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
            <h3 className="text-white mb-4 text-center font-semibold">Top Merchant Locations</h3>
            <div className="w-full h-64"><Bar data={getTop10('merchant_location')} options={standardBarOptions} /></div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md flex flex-col items-center">
            <h3 className="text-white mb-4 text-center font-semibold">Payment Methods</h3>
            <div className="w-64 h-64"><Pie data={getPieData('payment_method', 'pay_', 'Payment Method')} options={darkThemeOptions} /></div>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md flex flex-col items-center">
            <h3 className="text-white mb-4 text-center font-semibold">Transaction Status</h3>
            <div className="w-64 h-64"><Pie data={getPieData('transaction_status', 'transaction_status_', 'Status')} options={darkThemeOptions} /></div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Visualizations;