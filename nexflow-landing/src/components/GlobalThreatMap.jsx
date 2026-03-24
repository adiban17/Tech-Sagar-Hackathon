import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InfrastructureGlobe from './InfrastructureGlobe';

const GlobalThreatMap = () => {
  const [blockedCount, setBlockedCount] = useState(24109);

  // Simulate live blocked count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockedCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: '#060709' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Typography Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Eyebrow Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <span className="text-emerald font-mono text-sm tracking-wider uppercase">
                GLOBAL INFRASTRUCTURE
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight"
            >
              Real-time threat isolation across 
              <span className="block text-emerald">150+ edge networks.</span>
            </motion.h2>

            {/* Live Stat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
              <span className="text-gray-300 font-mono text-sm">
                Live Fraud Nodes Blocked: 
              </span>
              <span className="text-emerald font-bold font-mono text-lg">
                {blockedCount.toLocaleString()}
              </span>
            </motion.div>

            {/* Additional Info */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-400 text-lg leading-relaxed max-w-lg"
            >
              Our distributed network spans six continents, providing millisecond-level fraud detection 
              and prevention for businesses worldwide. Each node operates independently but shares 
              threat intelligence in real-time.
            </motion.p>

            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-6 pt-6"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald">150+</div>
                <div className="text-xs text-gray-400 mt-1">Edge Networks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald">&lt;10ms</div>
                <div className="text-xs text-gray-400 mt-1">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald">24/7</div>
                <div className="text-xs text-gray-400 mt-1">Monitoring</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Interactive 3D Globe */}
          <InfrastructureGlobe />
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-16 flex justify-center"
      >
        <div className="flex items-center gap-8 glass-effect px-6 py-3 rounded-lg border border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-gray-300">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald" />
            <span className="text-sm text-gray-300">Monitored</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-300">Protected</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default GlobalThreatMap;
