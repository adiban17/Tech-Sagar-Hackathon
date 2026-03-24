import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  TrendingUp,
  Clock,
  Globe,
  Server,
  Database,
  Wifi,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProductPreview = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Mock transaction data
  const transactions = [
    { id: '#8829', status: 'Blocked', risk: 98, amount: '$12,450', time: '14:32:18' },
    { id: '#8830', status: 'Approved', risk: 12, amount: '$3,200', time: '14:32:22' },
    { id: '#8831', status: 'Blocked', risk: 95, amount: '$8,900', time: '14:32:25' },
    { id: '#8832', status: 'Approved', risk: 8, amount: '$1,150', time: '14:32:28' },
    { id: '#8833', status: 'Review', risk: 67, amount: '$5,600', time: '14:32:31' },
    { id: '#8834', status: 'Approved', risk: 15, amount: '$450', time: '14:32:34' },
    { id: '#8835', status: 'Blocked', risk: 99, amount: '$22,100', time: '14:32:37' },
    { id: '#8836', status: 'Approved', risk: 5, amount: '$780', time: '14:32:40' },
  ];

  // Mock chart data
  const chartData = [
    { time: '00:00', attempts: 45 },
    { time: '04:00', attempts: 32 },
    { time: '08:00', attempts: 78 },
    { time: '12:00', attempts: 95 },
    { time: '16:00', attempts: 67 },
    { time: '20:00', attempts: 52 },
    { time: '24:00', attempts: 38 },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      
      setMousePosition({ x: x * 10, y: y * 10 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Blocked':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-emerald" />;
      case 'Review':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Blocked':
        return 'text-red-400';
      case 'Approved':
        return 'text-emerald';
      case 'Review':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRiskColor = (risk) => {
    if (risk >= 90) return 'text-red-400';
    if (risk >= 70) return 'text-orange-400';
    if (risk >= 40) return 'text-yellow-400';
    return 'text-emerald';
  };

  return (
    <section className="py-20 section-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-white">Command Center</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time fraud detection and prevention dashboard
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          style={{
            transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
            transformStyle: 'preserve-3d',
          }}
          className="relative"
        >
          <div className="glass-effect rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid lg:grid-cols-4 gap-0">
              {/* Sidebar */}
              <div className="lg:col-span-1 bg-black/40 border-r border-white/10 p-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-emerald/10 rounded-lg">
                    <Shield className="w-5 h-5 text-emerald" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">NexFlow</h3>
                    <p className="text-xs text-gray-400">Security Console</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">System Status</span>
                      <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
                    </div>
                    <div className="text-xs text-emerald font-mono">OPERATIONAL</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Active Nodes</span>
                      <Server className="w-4 h-4 text-emerald" />
                    </div>
                    <div className="text-xl font-bold text-white">24/24</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Processing</span>
                      <Activity className="w-4 h-4 text-emerald" />
                    </div>
                    <div className="text-xl font-bold text-white">1.2K/s</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Uptime</span>
                      <Clock className="w-4 h-4 text-emerald" />
                    </div>
                    <div className="text-xl font-bold text-white">99.99%</div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-emerald" />
                        <span className="text-xs text-gray-400">Network: Optimal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald" />
                        <span className="text-xs text-gray-400">Storage: 78%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald" />
                        <span className="text-xs text-gray-400">Latency: 8ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Live Transaction Feed</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Real-time monitoring</span>
                    <div className="w-px h-4 bg-white/20" />
                    <span>Last updated: 14:32:40</span>
                  </div>
                </div>

                {/* Transactions List */}
                <div className="mb-8">
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {transactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <div className="text-sm font-mono text-gray-300">ID: {transaction.id}</div>
                            <div className="text-xs text-gray-500">{transaction.time}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-sm font-semibold ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </div>
                            <div className="text-xs text-gray-400">{transaction.amount}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${getRiskColor(transaction.risk)}`}>
                              {transaction.risk}%
                            </div>
                            <div className="text-xs text-gray-500">Risk</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Fraud Attempts Prevented (24h)</h4>
                  <div className="h-48 bg-black/20 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                        <XAxis 
                          dataKey="time" 
                          stroke="rgba(255, 255, 255, 0.3)"
                          tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
                        />
                        <YAxis 
                          stroke="rgba(255, 255, 255, 0.3)"
                          tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            borderRadius: '8px',
                          }}
                          labelStyle={{ color: '#00F0FF' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="attempts"
                          stroke="#00F0FF"
                          strokeWidth={2}
                          dot={{ fill: '#00F0FF', r: 4 }}
                          activeDot={{ r: 6, fill: '#00F0FF' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 240, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 240, 255, 0.5);
        }
      `}</style>
    </section>
  );
};

export default ProductPreview;
