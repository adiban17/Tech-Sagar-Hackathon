import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Key, Shield, Zap } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 section-container relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-white/10 mb-8">
            <Key className="w-4 h-4 text-emerald" />
            <span className="text-sm text-emerald font-medium">Free API Keys Available</span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
        >
          <span className="block glow-text mb-2">Ready to Protect</span>
          <span className="block text-white">Your Business?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Get started with NexFlow today. Add enterprise-grade fraud protection to your application in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <button className="cyber-button group text-lg px-10 py-5">
            <span className="flex items-center gap-3">
              <Key className="w-5 h-5" />
              Get Your API Keys
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
          
          <button className="glass-effect px-10 py-5 rounded-lg border border-white/10 text-white font-semibold hover:bg-white/5 transition-all duration-200 text-lg flex items-center gap-3">
            <Shield className="w-5 h-5" />
            Schedule Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-emerald/10 rounded-lg">
                <Zap className="w-5 h-5 text-emerald" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-1">Quick Setup</h3>
            <p className="text-sm text-gray-400">Integrate in under 5 minutes</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-1">Free Tier</h3>
            <p className="text-sm text-gray-400">10,000 transactions/month</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-slate-500/10 rounded-lg">
                <Key className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-1">No Credit Card</h3>
            <p className="text-sm text-gray-400">Start protecting instantly</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <p className="text-gray-400 text-sm">
            Join 10,000+ companies already using NexFlow to protect their revenue
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
