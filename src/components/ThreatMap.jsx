import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Activity, Shield } from 'lucide-react';

const TransactionNode = ({ x, y, isFraud, isBlocked, delay }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className="absolute w-3 h-3 rounded-full"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.div
        className={`w-full h-full rounded-full ${
          isFraud 
            ? isBlocked ? 'bg-red-500' : 'bg-orange-500'
            : 'bg-emerald'
        }`}
        animate={{
          scale: isFraud && !isBlocked ? [1, 1.5, 1] : 1,
          opacity: isBlocked ? 0.5 : 1,
        }}
        transition={{
          duration: isFraud && !isBlocked ? 0.5 : 0.3,
          repeat: isFraud && !isBlocked ? Infinity : 0,
        }}
      />
      {isFraud && !isBlocked && (
        <motion.div
          className="absolute inset-0 rounded-full bg-orange-500"
          animate={{ scale: [1, 2, 3], opacity: [0.8, 0.4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

const ThreatMap = () => {
  const [transactions, setTransactions] = useState([]);
  const [blockedCount, setBlockedCount] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    const generateTransaction = () => {
      const isFraud = Math.random() < 0.15;
      const isBlocked = isFraud && Math.random() < 0.95;
      
      return {
        id: Date.now() + Math.random(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        isFraud,
        isBlocked,
        delay: Math.random() * 0.5,
      };
    };

    const interval = setInterval(() => {
      const newTransaction = generateTransaction();
      setTransactions(prev => {
        const updated = [...prev, newTransaction];
        return updated.slice(-50);
      });
      
      setTotalTransactions(prev => prev + 1);
      if (newTransaction.isFraud && newTransaction.isBlocked) {
        setBlockedCount(prev => prev + 1);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

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
            <span className="glow-text">Live Threat Detection</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch as NexFlow instantly identifies and blocks fraudulent transactions in real-time
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-96 bg-black/40 rounded-2xl border border-white/10 overflow-hidden glass-effect">
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Transaction nodes */}
              {transactions.map((transaction) => (
                <TransactionNode key={transaction.id} {...transaction} />
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald rounded-full" />
                  <span className="text-xs text-gray-400">Legitimate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <span className="text-xs text-gray-400">Suspicious</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full opacity-50" />
                  <span className="text-xs text-gray-400">Blocked</span>
                </div>
              </div>

              {/* Live indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-red-400 font-medium">LIVE</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-effect p-6 rounded-xl border border-white/10">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald/10 rounded-lg">
                  <Activity className="w-6 h-6 text-emerald" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Real-Time Processing</h3>
                  <p className="text-gray-400">
                    Every transaction is analyzed in milliseconds using our advanced ML algorithms
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-effect p-6 rounded-xl border border-white/10">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Instant Detection</h3>
                  <p className="text-gray-400">
                    Suspicious patterns are identified immediately with 99.9% accuracy
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-effect p-6 rounded-xl border border-white/10">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Automatic Blocking</h3>
                  <p className="text-gray-400">
                    Fraudulent transactions are blocked before they can cause damage
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center p-4 glass-effect rounded-lg border border-white/10"
              >
                <div className="text-2xl font-bold text-emerald">{totalTransactions}</div>
                <div className="text-sm text-gray-400">Total Processed</div>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-center p-4 glass-effect rounded-lg border border-red-500/20"
              >
                <div className="text-2xl font-bold text-red-500">{blockedCount}</div>
                <div className="text-sm text-gray-400">Threats Blocked</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ThreatMap;
