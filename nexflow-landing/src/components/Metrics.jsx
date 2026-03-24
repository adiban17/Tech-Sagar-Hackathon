import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Clock, Globe } from 'lucide-react';

const MetricCard = ({ endValue, suffix, label, icon: Icon, gradient, delay }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      const duration = 2000;
      const steps = 60;
      const increment = endValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= endValue) {
          current = endValue;
          clearInterval(timer);
          setHasAnimated(true);
        }
        setCount(Math.floor(current));
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [endValue, hasAnimated]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald/5 to-cyan/5 rounded-2xl blur-xl opacity-50" />
      <div className="relative glass-effect p-8 rounded-2xl border border-white/10">
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${gradient} mb-6`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl sm:text-5xl font-black">
            <span className={`bg-gradient-to-r ${gradient} text-transparent bg-clip-text`}>
              {count}
            </span>
          </span>
          <span className="text-2xl sm:text-3xl text-gray-400">{suffix}</span>
        </div>
        
        <p className="text-gray-300 font-medium">{label}</p>
      </div>
    </motion.div>
  );
};

const Metrics = () => {
  const metrics = [
    {
      endValue: 2,
      suffix: 'B+',
      label: 'Fraud Prevented',
      icon: TrendingUp,
      gradient: 'from-emerald to-cyan',
      delay: 0.1,
    },
    {
      endValue: 99.9,
      suffix: '%',
      label: 'Accuracy Rate',
      icon: Shield,
      gradient: 'from-emerald to-cyan',
      delay: 0.2,
    },
    {
      endValue: 10,
      suffix: 'ms',
      label: 'Response Time',
      icon: Clock,
      gradient: 'from-emerald to-cyan',
      delay: 0.3,
    },
    {
      endValue: 150,
      suffix: '+',
      label: 'Countries Protected',
      icon: Globe,
      gradient: 'from-emerald to-cyan',
      delay: 0.4,
    },
  ];

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
            <span className="glow-text">Trusted by the Best</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our numbers speak for themselves. Join thousands of businesses protecting their revenue with NexFlow.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="glass-effect p-8 rounded-2xl border border-white/10 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold glow-text mb-1">24/7</div>
              <div className="text-sm text-gray-400">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold glow-text mb-1">1M+</div>
              <div className="text-sm text-gray-400">Transactions/Second</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold glow-text mb-1">99.99%</div>
              <div className="text-sm text-gray-400">Uptime SLA</div>
            </div>
          </div>
          
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our infrastructure is built for scale and reliability. With data centers across the globe, 
            we ensure your transactions are protected 24/7 with enterprise-grade security and compliance.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Metrics;
