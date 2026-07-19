import React, { Suspense } from "react";
import { StickyNav } from "@/components/landing/StickyNav";

// Lazy load all components for better performance
const EnterpriseHero = React.lazy(() => import('@/components/landing/EnterpriseHero').then(m => ({ default: m.EnterpriseHero })));
const TrustBar = React.lazy(() => import('@/components/landing/TrustBar').then(m => ({ default: m.TrustBar })));
const PlatformOverview = React.lazy(() => import('@/components/landing/PlatformOverview').then(m => ({ default: m.PlatformOverview })));
const AIDecisionEngine = React.lazy(() => import('@/components/landing/AIDecisionEngine').then(m => ({ default: m.AIDecisionEngine })));
const LiveDemo = React.lazy(() => import('@/components/landing/LiveDemo').then(m => ({ default: m.LiveDemo })));
const EnterpriseFeatures = React.lazy(() => import('@/components/landing/EnterpriseFeatures').then(m => ({ default: m.EnterpriseFeatures })));
const ExplainableAI = React.lazy(() => import('@/components/landing/ExplainableAI').then(m => ({ default: m.ExplainableAI })));
const PlatformArchitecture = React.lazy(() => import('@/components/landing/PlatformArchitecture').then(m => ({ default: m.PlatformArchitecture })));
const Testimonials = React.lazy(() => import('@/components/landing/Testimonials').then(m => ({ default: m.Testimonials })));
const FAQ = React.lazy(() => import('@/components/landing/FAQ').then(m => ({ default: m.FAQ })));
const FinalCTA = React.lazy(() => import('@/components/landing/FinalCTA').then(m => ({ default: m.FinalCTA })));
const PremiumFooter = React.lazy(() => import('@/components/landing/FinalCTA').then(m => ({ default: m.PremiumFooter })));

const SectionLoader = () => (
  <div className="w-full h-32 flex items-center justify-center">
    <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin"></div>
  </div>
);

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden flex flex-col font-sans">
      
      <StickyNav />

      {/* ASSEMBLED ENTERPRISE SECTIONS */}
      <main className="relative z-10 w-full flex-1">
        <Suspense fallback={<SectionLoader />}>
          <EnterpriseHero />
          <TrustBar />
          
          <PlatformOverview />
          
          <AIDecisionEngine />
          
          <div id="solutions">
            <EnterpriseFeatures />
          </div>
          
          <LiveDemo />
          <ExplainableAI />
          <PlatformArchitecture />
          <Testimonials />
          
          {/* Navigation Anchors for Coming Soon / External pages */}
          <div id="pricing" className="hidden" />
          <div id="docs" className="hidden" />
          <div id="about" className="hidden" />
          <div id="contact" className="hidden" />
          
          <FAQ />
          <FinalCTA />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <PremiumFooter />
      </Suspense>

    </div>
  );
}
