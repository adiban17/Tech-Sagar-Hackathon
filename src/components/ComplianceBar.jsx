import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Server, CheckCircle } from 'lucide-react';

const ComplianceBar = () => {
  const complianceItems = [
    {
      name: 'PCI DSS Level 1',
      icon: Shield,
      description: 'Payment Card Industry Data Security Standard',
      hoverColor: 'text-red-500',
    },
    {
      name: 'GDPR Compliant',
      icon: Lock,
      description: 'General Data Protection Regulation',
      hoverColor: 'text-blue-500',
    },
    {
      name: 'ISO 27001',
      icon: Server,
      description: 'Information Security Management',
      hoverColor: 'text-emerald',
    },
    {
      name: 'SCA Ready',
      icon: CheckCircle,
      description: 'Strong Customer Authentication',
      hoverColor: 'text-purple-500',
    },
  ];

  return (
    <section className="py-16 section-container border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Enterprise-Grade Compliance & Security
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Trusted by leading financial institutions worldwide
          </p>
        </motion.div>

        {/* Compliance Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
        >
          {complianceItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
                className="group text-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <div 
                    className={`w-16 h-16 rounded-xl flex items-center justify-center border border-white/10 transition-all duration-300 group-hover:border-opacity-30`}
                  >
                    <Icon 
                      className={`w-8 h-8 text-gray-500 opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:${item.hoverColor}`} 
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-emerald transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Security Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-effect p-8 rounded-2xl border border-white/10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Military-Grade Security Infrastructure
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  NexFlow uses <span className="font-mono text-emerald">256-bit</span> encryption and enterprise-grade infrastructure 
                  to secure <span className="font-mono text-emerald">$2B+</span> in annual transaction volume.
                </p>
                <div className="mt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald rounded-full" />
                    <span className="text-sm text-gray-400">AES-256 Encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald rounded-full" />
                    <span className="text-sm text-gray-400">SOC2 Type II</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald rounded-full" />
                    <span className="text-sm text-gray-400">24/7 Monitoring</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-white/3 rounded-lg border border-white/5">
                  <div className="text-2xl font-bold text-emerald font-mono">99.99%</div>
                  <div className="text-xs text-gray-400 mt-1">Uptime SLA</div>
                </div>
                <div className="p-4 bg-white/3 rounded-lg border border-white/5">
                  <div className="text-2xl font-bold text-emerald font-mono">&lt;10ms</div>
                  <div className="text-xs text-gray-400 mt-1">Response Time</div>
                </div>
                <div className="p-4 bg-white/3 rounded-lg border border-white/5">
                  <div className="text-2xl font-bold text-emerald font-mono">256-bit</div>
                  <div className="text-xs text-gray-400 mt-1">Encryption</div>
                </div>
                <div className="p-4 bg-white/3 rounded-lg border border-white/5">
                  <div className="text-2xl font-bold text-emerald font-mono">$2B+</div>
                  <div className="text-xs text-gray-400 mt-1">Secured Volume</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400 text-center md:text-left">
              © 2024 NexFlow. All rights reserved. | Enterprise fraud protection for modern businesses.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-emerald transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-emerald transition-colors">Security</a>
              <a href="#" className="hover:text-emerald transition-colors">Compliance</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComplianceBar;
