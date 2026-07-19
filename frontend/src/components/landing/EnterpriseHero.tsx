import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Activity, Clock } from "lucide-react";
import { Hero3DScene } from "@/components/3d/Hero3DScene";

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export function EnterpriseHero() {
  return (
    <section id="hero" className="relative z-10 flex flex-col items-center max-w-[1400px] w-full mx-auto px-6 md:px-12 pt-24 lg:pt-32 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center w-full min-h-[60vh]">
        
        {/* Left Content */}
        <div className="flex flex-col pt-10 lg:pt-0 max-w-2xl">
          <Reveal>
            <div className="inline-flex items-center text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-6 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              Enterprise AI Platform
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-slate-900">
              Detect Fraud.<br />
              Protect Revenue.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-[90%]">
              AI-powered fraud detection with explainable machine learning and enterprise-grade intelligence.
            </p>
          </Reveal>

          <Reveal delay={0.3} className="flex flex-wrap gap-4 mb-16">
            <Button size="lg" className="h-12 px-8 text-sm rounded-xl shadow-sm bg-slate-900 hover:bg-slate-800 text-white transition-all duration-200 font-medium">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-sm rounded-xl bg-white text-slate-900 border-slate-200 hover:bg-slate-50 transition-all duration-200 font-medium">
              Explore Platform
            </Button>
          </Reveal>

          {/* Mini Stats */}
          <Reveal delay={0.4} className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-slate-200 pt-8">
            <div className="flex flex-col gap-1">
              <div className="font-bold text-slate-900 text-lg flex items-center gap-1.5">
                99.8%
              </div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Detection Accuracy</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-bold text-slate-900 text-lg flex items-center gap-1.5">
                &lt; 50ms
              </div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Prediction Time</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-bold text-slate-900 text-lg flex items-center gap-1.5">
                10B+
              </div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Transactions Processed</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-bold text-slate-900 text-lg flex items-center gap-1.5">
                99.99%
              </div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Availability</div>
            </div>
          </Reveal>
        </div>

        {/* Right Content - Premium 3D Scene */}
        <Reveal delay={0.2} className="relative w-full h-[450px] lg:h-[600px] flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 pointer-events-auto">
            <Hero3DScene />
          </div>
        </Reveal>

      </div>
    </section>
  );
}
