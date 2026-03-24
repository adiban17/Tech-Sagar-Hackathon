import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleStartDetecting = () => {
    navigate('/dashboard');
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden section-container">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
          style={{
            objectPosition: 'center',
          }}
        >
          <source src="/dark-liquid-bg.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Overlay - Crucial for seamless integration */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(6, 7, 9, 0.4) 0%, transparent 50%, rgba(6, 7, 9, 1) 100%)',
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Security Status Bar */}
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-lg glass-effect border border-white/10 font-mono text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
              <span className="text-emerald">System Status: Active</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald" />
              <span className="text-gray-300">SOC2 Type II Compliant</span>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6"
        >
          <span 
            className="block mb-2"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e5e5e5 50%, #d4d4d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            NexFlow
          </span>
          <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mt-2 text-white font-semibold">
            Next-Generation Fraud Prevention
          </span>
          <span className="block text-xl sm:text-2xl lg:text-3xl mt-4 text-gray-400 font-normal">
            Powered by AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-12"
          style={{
            lineHeight: '1.8',
            letterSpacing: '0.02em',
          }}
        >
          Stop fraud in milliseconds with our advanced machine learning models. 
          Protect your business with 99.9% accuracy and real-time threat detection.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Hardware-style Primary CTA */}
          <button 
            onClick={handleStartDetecting}
            className="group relative overflow-hidden transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #00F0FF, #00D4CC)',
              borderRadius: '8px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 240, 255, 0.15)',
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: 'linear-gradient(135deg, #00D4CC, #00F0FF)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 6px 20px rgba(0, 240, 255, 0.25)',
              }}
            />
            <span className="relative z-10 flex items-center gap-3 text-black font-semibold px-10 py-5 text-lg">
              <Zap className="w-5 h-5" />
              Start Detecting
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </span>
          </button>
          
          {/* Secondary CTA */}
          <button className="glass-effect px-10 py-5 rounded-lg border border-white/10 text-white font-semibold hover:bg-white/5 transition-all duration-200 flex items-center gap-3 text-lg">
            View Documentation
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div 
              className="text-3xl font-bold mb-1"
              style={{
                background: 'linear-gradient(135deg, #00F0FF, #00D4CC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              $2B+
            </div>
            <div className="text-sm text-gray-400 mt-1">Fraud Prevented</div>
          </div>
          <div className="text-center">
            <div 
              className="text-3xl font-bold mb-1"
              style={{
                background: 'linear-gradient(135deg, #00F0FF, #00D4CC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              99.9%
            </div>
            <div className="text-sm text-gray-400 mt-1">Accuracy</div>
          </div>
          <div className="text-center">
            <div 
              className="text-3xl font-bold mb-1"
              style={{
                background: 'linear-gradient(135deg, #00F0FF, #00D4CC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              &lt;10ms
            </div>
            <div className="text-sm text-gray-400 mt-1">Response Time</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="animate-bounce">
          <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
