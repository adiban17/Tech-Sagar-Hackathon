import React from 'react';
import { motion } from 'framer-motion';

const LiquidBackground = () => {
  const blobs = [
    {
      id: 1,
      size: 'w-96 h-96',
      color: 'bg-[#00F0FF]',
      initialX: '-20%',
      initialY: '-10%',
      animateX: '30%',
      animateY: '20%',
    },
    {
      id: 2,
      size: 'w-[500px] h-[500px]',
      color: 'bg-[#7000FF]',
      initialX: '80%',
      initialY: '60%',
      animateX: '20%',
      animateY: '-30%',
    },
    {
      id: 3,
      size: 'w-80 h-80',
      color: 'bg-slate-600',
      initialX: '10%',
      initialY: '80%',
      animateX: '60%',
      animateY: '10%',
    },
    {
      id: 4,
      size: 'w-[600px] h-[600px]',
      color: 'bg-[#00F0FF]',
      initialX: '70%',
      initialY: '-20%',
      animateX: '-10%',
      animateY: '70%',
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated Liquid Blobs */}
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className={`absolute rounded-full ${blob.size} ${blob.color} opacity-20 blur-3xl`}
          initial={{
            x: blob.initialX,
            y: blob.initialY,
            rotate: 0,
            scale: 1,
          }}
          animate={{
            x: [blob.initialX, blob.animateX, blob.initialX],
            y: [blob.initialY, blob.animateY, blob.initialY],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20 + blob.id * 5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
          style={{
            filter: 'blur(80px)',
          }}
        />
      ))}

      {/* Liquid Glass Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backdropFilter: 'blur(120px)',
          WebkitBackdropFilter: 'blur(120px)',
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(112, 0, 255, 0.1) 50%, rgba(71, 85, 105, 0.1) 100%)',
        }}
      />

      {/* Additional subtle gradient for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(0, 240, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(112, 0, 255, 0.05) 0%, transparent 50%)',
        }}
      />
    </div>
  );
};

export default LiquidBackground;
