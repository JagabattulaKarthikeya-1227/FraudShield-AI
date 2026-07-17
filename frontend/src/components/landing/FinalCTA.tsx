import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function FinalCTA() {
  return (
    <section className="py-32 px-8 md:px-12 w-full relative z-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[48px] bg-gradient-to-b from-white/60 to-white/10 border border-border/40 backdrop-blur-xl p-16 md:p-24 shadow-[0_8px_40px_rgba(0,0,0,0.02)]"
        >
          <h2 className="text-5xl md:text-7xl font-medium tracking-tight text-primary mb-8">
            Ready to secure your <br /> transactions?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience the next generation of explainable artificial intelligence for enterprise fraud detection.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-16 px-10 text-lg rounded-2xl shadow-[0_8px_30px_rgba(22,42,43,0.2)] hover:-translate-y-1 transition-all" asChild>
              <Link to="/dashboard">Launch Platform</Link>
            </Button>
            <Button size="lg" variant="secondary" className="h-16 px-10 text-lg gap-2 rounded-2xl border border-border/60 bg-white/50 hover:bg-white/90 hover:-translate-y-1 transition-all group" asChild>
              <Link to="/research">View Architecture <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function PremiumFooter() {
  return (
    <footer className="border-t border-border/40 bg-white/20 backdrop-blur-md py-12 px-8 md:px-12 relative z-20">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">F</span>
          </div>
          <span className="font-semibold text-primary">FraudShield AI</span>
        </div>
        <p className="text-sm text-muted-foreground">&copy; 2026 Enterprise FinTech Solutions. All rights reserved.</p>
        <div className="flex gap-6 text-sm font-medium text-muted-foreground">
          <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
          <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
          <Link to="#" className="hover:text-primary transition-colors">Research</Link>
        </div>
      </div>
    </footer>
  );
}
