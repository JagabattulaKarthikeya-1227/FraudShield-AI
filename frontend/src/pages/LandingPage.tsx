import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FadeIn, SlideUp } from "@/components/motion";
import { GlassShield, AICore } from "@/components/3d";
import { ShieldAlert, ArrowRight } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-accent-foreground">
      <nav className="h-20 flex items-center justify-between px-8 max-w-7xl mx-auto border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <span className="font-semibold text-lg tracking-tight">FraudShield</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/features" className="text-sm font-medium hover:text-accent transition-colors">Platform</Link>
          <Link to="/research" className="text-sm font-medium hover:text-accent transition-colors">Research</Link>
          <Button variant="default" asChild>
            <Link to="/dashboard">Enter Platform</Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="max-w-2xl">
          <SlideUp>
            <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold mb-6 text-muted-foreground shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-success mr-2"></span>
              XGBoost Ensemble v2.0 Live
            </div>
          </SlideUp>
          <SlideUp delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6">
              Explainable <br />
              <span className="text-muted-foreground">Fraud Intelligence.</span>
            </h1>
          </SlideUp>
          <SlideUp delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              A premium financial security platform utilizing Explainable AI to provide real-time transaction auditing, risk assessment, and transparent feature attribution.
            </p>
          </SlideUp>
          <SlideUp delay={0.3} className="flex gap-4">
            <Button size="lg" className="h-14 px-8 text-base">
              Start Auditing
            </Button>
            <Button size="lg" variant="secondary" className="h-14 px-8 text-base gap-2">
              View Research <ArrowRight className="h-4 w-4" />
            </Button>
          </SlideUp>
        </div>
        
        <FadeIn delay={0.4} className="relative h-[500px] w-full">
          {/* 3D Hero Graphic */}
          <GlassShield />
        </FadeIn>
      </main>

      <section className="bg-card py-24 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-semibold mb-16">Enterprise Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border rounded-2xl bg-background/50">
              <div className="h-[200px] mb-6 rounded-xl overflow-hidden"><AICore /></div>
              <h3 className="text-xl font-medium mb-3">Explainable AI</h3>
              <p className="text-muted-foreground">Deep integrations with SHAP and LIME for transparent model attributions.</p>
            </div>
            {/* Additional feature stubs can go here */}
          </div>
        </div>
      </section>
    </div>
  );
}
