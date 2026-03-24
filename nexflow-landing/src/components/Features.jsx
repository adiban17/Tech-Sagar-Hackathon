import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Code, Settings, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Machine Learning Models',
    description: 'Advanced neural networks trained on billions of transactions to identify complex fraud patterns',
    gradient: 'from-emerald to-cyan',
  },
  {
    icon: Zap,
    title: 'Millisecond Latency',
    description: 'Process transactions in under 10ms with our optimized infrastructure and edge computing',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Code,
    title: 'API-First Integration',
    description: 'Simple RESTful APIs and SDKs for seamless integration with your existing infrastructure',
    gradient: 'from-green-500 to-emerald',
  },
  {
    icon: Settings,
    title: 'Custom Rule Engine',
    description: 'Configure custom fraud detection rules tailored to your specific business needs',
    gradient: 'from-slate-500 to-gray-600',
  },
];

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -2,
      }}
      className="group relative p-8 bg-white/3 rounded-2xl border border-white/10 glass-effect hover:border-white/15 transition-all duration-300 cursor-pointer"
    >
      {/* Subtle inner shadow effect */}
      <div className="absolute inset-0 rounded-2xl shadow-inner" />
      
      <div className="relative z-10">
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.gradient} mb-6`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-emerald transition-colors duration-300">
          {feature.title}
        </h3>
        
        <p className="text-gray-400 mb-6 leading-relaxed">
          {feature.description}
        </p>
        
        <div className="flex items-center gap-2 text-emerald opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-medium">Learn more</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
};

const Features = () => {
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
            <span className="glow-text">Powerful Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to protect your business from sophisticated fraud attacks
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-effect border border-white/10">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-emerald" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-300 ml-2">
              Trusted by 10,000+ businesses worldwide
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
