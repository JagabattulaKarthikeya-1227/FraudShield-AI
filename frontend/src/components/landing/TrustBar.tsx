import React from 'react';
import { motion } from 'framer-motion';

const techLogos = [
  "Research Paper", "Kaggle Dataset", "IEEE", "React", 
  "Flask", "TensorFlow", "XGBoost", "SHAP", "LIME", 
  "Extra Trees", "MLP"
];

export function TrustBar() {
  // Duplicate array for seamless infinite scroll
  const duplicatedLogos = [...techLogos, ...techLogos];

  return (
    <div className="w-full border-y border-border/40 bg-white/10 backdrop-blur-sm overflow-hidden py-8 flex relative z-20">
      {/* Gradient Fades for edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      <motion.div 
        className="flex gap-12 sm:gap-24 items-center px-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 30, repeat: Infinity }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 text-xl md:text-2xl font-bold text-muted-foreground/40 hover:text-primary transition-colors duration-500 cursor-default"
          >
            {logo}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
