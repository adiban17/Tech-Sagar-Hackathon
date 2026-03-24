import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const InfrastructureGlobe = () => {
  const [fraudLocations, setFraudLocations] = useState([]);

  useEffect(() => {
    // Generate random fraud locations across the world
    const locations = [];
    for (let i = 0; i < 25; i++) {
      locations.push({
        id: i,
        lat: (Math.random() * 180 - 90), // -90 to 90
        lng: (Math.random() * 360 - 180), // -180 to 180
        severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      });
    }
    setFraudLocations(locations);
  }, []);

  // Convert lat/lng to x/y coordinates for map projection
  const latLngToXY = (lat, lng) => {
    const x = ((lng + 180) / 360) * 100; // 0-100%
    const y = ((90 - lat) / 180) * 100; // 0-100%
    return { x, y };
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative h-[500px] w-full max-w-[500px] mx-auto"
    >
      {/* Cyan Glow Effect */}
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{
          boxShadow: '0 0 50px rgba(6, 182, 212, 0.15)',
          zIndex: -1,
        }}
      />
      
      {/* Static World Map Container */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/40 backdrop-blur-sm border border-cyan-500/30">
        {/* Simple SVG World Map */}
        <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full">
          {/* Simple continent outlines */}
          <g fill="rgba(6, 182, 212, 0.1)" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5">
            {/* North America */}
            <path d="M 150 150 Q 200 120, 250 140 L 280 180 L 260 220 L 200 240 L 150 200 Z"/>
            {/* South America */}
            <path d="M 220 280 Q 240 260, 260 270 L 270 350 L 250 400 L 220 380 L 210 320 Z"/>
            {/* Europe */}
            <path d="M 480 140 Q 500 130, 520 140 L 510 180 L 490 170 Z"/>
            {/* Africa */}
            <path d="M 480 220 Q 510 200, 540 220 L 530 320 L 500 340 L 470 300 Z"/>
            {/* Asia */}
            <path d="M 550 120 Q 650 100, 750 130 L 780 200 L 700 220 L 600 180 L 550 150 Z"/>
            {/* Australia */}
            <path d="M 700 350 Q 750 340, 780 360 L 770 390 L 740 380 L 710 370 Z"/>
          </g>
          
          {/* Grid lines */}
          <g stroke="rgba(6, 182, 212, 0.1)" strokeWidth="0.2" fill="none">
            {/* Latitude lines */}
            <line x1="0" y1="125" x2="1000" y2="125" />
            <line x1="0" y1="250" x2="1000" y2="250" />
            <line x1="0" y1="375" x2="1000" y2="375" />
            {/* Longitude lines */}
            <line x1="250" y1="0" x2="250" y2="500" />
            <line x1="500" y1="0" x2="500" y2="500" />
            <line x1="750" y1="0" x2="750" y2="500" />
          </g>

          {/* Fraud Location Markers */}
          {fraudLocations.map(loc => {
            const { x, y } = latLngToXY(loc.lat, loc.lng);
            const svgX = (x / 100) * 1000;
            const svgY = (y / 100) * 500;
            
            return (
              <g key={loc.id}>
                {/* Pulsing circle */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r="8"
                  fill={loc.severity === 'high' ? 'rgba(239, 68, 68, 0.3)' : 
                        loc.severity === 'medium' ? 'rgba(245, 158, 11, 0.3)' : 
                        'rgba(6, 182, 212, 0.3)'}
                  className="animate-pulse"
                />
                {/* Center dot */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r="3"
                  fill={loc.severity === 'high' ? '#ef4444' : 
                        loc.severity === 'medium' ? '#f59e0b' : 
                        '#06b6d4'}
                />
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/20">
          <div className="text-xs font-mono text-cyan-400 mb-2">FRAUD HOTSPOTS</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-300">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Low Risk</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InfrastructureGlobe;
