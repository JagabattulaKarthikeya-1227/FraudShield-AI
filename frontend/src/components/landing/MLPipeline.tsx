import React from 'react';
import { motion } from 'framer-motion';

const pipelineStages = [
  "Raw Data",
  "SMOTE Balancing",
  "Extra Trees",
  "MLP Neural Net",
  "Stacking",
  "XGBoost Meta",
  "Isotonic Calibration",
  "Prediction"
];

export function MLPipeline() {
  return (
    <section className="py-24 px-8 md:px-12 max-w-[1600px] mx-auto w-full relative z-20 overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-medium text-primary">The Architecture Flow</h2>
      </div>

      <div className="relative w-full max-w-5xl mx-auto py-12">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border/40 -translate-y-1/2 rounded-full" />
        
        {/* Animated Fill Line */}
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary via-accent to-success -translate-y-1/2 rounded-full"
        />

        <div className="relative flex justify-between items-center w-full">
          {pipelineStages.map((stage, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: i * 0.25 }}
              className="relative flex flex-col items-center group"
            >
              <div className="w-4 h-4 rounded-full bg-white border-2 border-primary shadow-[0_0_15px_rgba(22,42,43,0.3)] z-10 group-hover:scale-150 transition-transform duration-300" />
              <span className="absolute top-8 w-24 text-center text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                {stage}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
