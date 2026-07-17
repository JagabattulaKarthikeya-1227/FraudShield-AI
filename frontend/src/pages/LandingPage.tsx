import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MousePointer2 } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Hero3DScene } from "@/components/3d/Hero3DScene";
import { StickyNav } from "@/components/landing/StickyNav";

// Lazy load heavy components
const TrustBar = React.lazy(() => import('@/components/landing/TrustBar').then(m => ({ default: m.TrustBar })));
const ProblemSection = React.lazy(() => import('@/components/landing/ProblemSection').then(m => ({ default: m.ProblemSection })));
const SolutionPipeline = React.lazy(() => import('@/components/landing/SolutionPipeline').then(m => ({ default: m.SolutionPipeline })));
const WhyOurModel = React.lazy(() => import('@/components/landing/WhyOurModel').then(m => ({ default: m.WhyOurModel })));
const FeaturesBentoGrid = React.lazy(() => import('@/components/landing/FeaturesBentoGrid').then(m => ({ default: m.FeaturesBentoGrid })));
const PlatformPreview = React.lazy(() => import('@/components/landing/PlatformPreview').then(m => ({ default: m.PlatformPreview })));
const ExplainabilityStory = React.lazy(() => import('@/components/landing/ExplainabilityStory').then(m => ({ default: m.ExplainabilityStory })));
const MLPipeline = React.lazy(() => import('@/components/landing/MLPipeline').then(m => ({ default: m.MLPipeline })));
const SecurityShield = React.lazy(() => import('@/components/landing/SecurityShield').then(m => ({ default: m.SecurityShield })));
const DashboardShowcase = React.lazy(() => import('@/components/landing/DashboardShowcase').then(m => ({ default: m.DashboardShowcase })));
const TechStackOrbit = React.lazy(() => import('@/components/landing/TechStackOrbit').then(m => ({ default: m.TechStackOrbit })));
const ResearchCards = React.lazy(() => import('@/components/landing/ResearchCards').then(m => ({ default: m.ResearchCards })));
const FinalCTA = React.lazy(() => import('@/components/landing/FinalCTA').then(m => ({ default: m.FinalCTA })));
const PremiumFooter = React.lazy(() => import('@/components/landing/FinalCTA').then(m => ({ default: m.PremiumFooter })));

import { NeuralLoader } from '@/components/motion/NeuralLoader';

// Loading Fallback
const SectionLoader = () => <NeuralLoader />;

// Counter component for animated statistics
function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  React.useEffect(() => {
    if (!isInView) return;
    
    let startTime: number | null = null;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 5);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    
    requestAnimationFrame(animateCount);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-accent selection:text-accent-foreground flex flex-col font-sans">
      
      <StickyNav />

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none fixed">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-success/5 blur-[100px]" />
      </div>

      {/* 1. HERO SECTION */}
      <main id="hero" className="relative z-10 flex-1 flex items-center max-w-[1600px] w-full mx-auto px-8 md:px-12 pt-32 lg:pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-8 items-center w-full min-h-[75vh]">
          
          {/* Left Content */}
          <div className="max-w-2xl pt-10 lg:pt-0">
            <Reveal>
              <div className="inline-flex items-center rounded-full border border-border/60 bg-white/40 backdrop-blur-md px-4 py-1.5 text-xs font-semibold mb-8 text-primary shadow-[0_2px_10px_rgba(0,0,0,0.02)] tracking-wide">
                <span className="flex h-2 w-2 rounded-full bg-success mr-2 shadow-[0_0_8px_rgba(74,103,65,0.4)] animate-pulse"></span>
                Hybrid Ensemble Framework v2.0
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-medium tracking-tighter leading-[1.05] mb-6 text-primary">
                FraudShield <br />
                <span className="text-muted-foreground font-light">AI.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-xl sm:text-2xl text-primary font-medium mb-4 leading-tight tracking-tight">
                An Explainable Hybrid Ensemble Framework for Intelligent Credit Card Fraud Detection.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-lg text-muted-foreground mb-4 max-w-[90%] leading-relaxed font-light">
                FraudShield AI combines the raw predictive power of <strong className="font-medium text-primary">Extra Trees</strong>, <strong className="font-medium text-primary">Multilayer Perceptron</strong>, and an <strong className="font-medium text-primary">XGBoost</strong> Meta-Learner.
              </p>
            </Reveal>

            <Reveal delay={0.4} className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" className="h-14 px-8 text-base rounded-2xl shadow-[0_4px_24px_rgba(22,42,43,0.15)] hover:shadow-[0_8px_32px_rgba(22,42,43,0.2)]">
                Launch Platform
              </Button>
              <Button size="lg" variant="secondary" className="h-14 px-8 text-base gap-2 rounded-2xl border border-border/40 bg-white/60 backdrop-blur-md hover:bg-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] group">
                View AI Architecture 
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Reveal>
          </div>

          {/* Right Content - 3D Scene */}
          <Reveal delay={0.3} className="relative w-full h-[500px] lg:h-full min-h-[600px] rounded-[32px] overflow-hidden lg:ml-8 border border-border/40 bg-gradient-to-br from-white/20 to-transparent shadow-[0_8px_60px_rgba(0,0,0,0.02)] backdrop-blur-sm group">
            <Hero3DScene />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-xs font-medium text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <MousePointer2 className="w-3 h-3" />
              Interactive 3D Simulation
            </div>
          </Reveal>

        </div>
      </main>

      {/* STATISTICS */}
      <section className="relative z-20 max-w-[1600px] w-full mx-auto px-8 md:px-12 pb-16 pt-8 flex flex-col items-center">
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -top-6 w-8 h-12 rounded-full border border-border/80 bg-white/50 backdrop-blur-md flex justify-center p-2 shadow-sm"
        >
          <div className="w-1 h-2 bg-primary/40 rounded-full" />
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full pt-12">
          {[
            { label: "Transactions Analysed", value: 284807, suffix: "+" },
            { label: "Fraud Detection Accuracy", value: 99.9, suffix: "%" },
            { label: "Model Response Time", value: 45, suffix: "ms" },
            { label: "Explainability Coverage", value: 100, suffix: "%" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={0.6 + i * 0.1} className="flex flex-col items-start border-l-2 border-primary/10 pl-6 hover:border-accent transition-colors duration-300">
              <span className="text-4xl md:text-5xl font-semibold text-primary tracking-tight mb-2">
                <AnimatedCounter end={stat.value} duration={2.5} suffix={stat.suffix} />
              </span>
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ASSEMBLED STORYTELLING SECTIONS */}
      <Suspense fallback={<SectionLoader />}>
        <TrustBar />
        <ProblemSection />
        <SolutionPipeline />
        <WhyOurModel />
        <FeaturesBentoGrid />
        <PlatformPreview />
        <ExplainabilityStory />
        <MLPipeline />
        <SecurityShield />
        <DashboardShowcase />
        <TechStackOrbit />
        <ResearchCards />
        <FinalCTA />
        <PremiumFooter />
      </Suspense>

    </div>
  );
}
