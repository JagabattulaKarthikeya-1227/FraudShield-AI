import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function FinalCTA() {
  return (
    <section className="py-24 px-6 md:px-12 w-full relative z-20 overflow-hidden bg-background">
      <div className="max-w-[1200px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2rem] bg-zinc-950 dark:bg-white border border-zinc-900 dark:border-zinc-200 shadow-xl overflow-hidden p-16 md:p-24 flex flex-col items-center"
        >
          {/* Subtle noise texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

          <div className="relative z-10 w-full max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white dark:text-zinc-950 mb-6">
              Ready to secure your platform?
            </h2>
            <p className="text-lg text-zinc-400 dark:text-zinc-600 mb-10 max-w-2xl mx-auto font-medium">
              Join leading financial institutions using FraudShield AI to eliminate fraud and automate compliance.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all bg-white text-zinc-950 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900" asChild>
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-sm font-medium gap-2 rounded-lg border border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white dark:border-zinc-300 dark:text-zinc-700 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all group" asChild>
                <Link to="/contact">Contact Sales <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" /></Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function PremiumFooter() {
  return (
    <footer className="bg-background border-t border-zinc-200 dark:border-zinc-800 pt-20 pb-10 px-6 md:px-12 relative z-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo.svg" alt="FraudShield AI Logo" className="w-5 h-5 dark:invert" />
              <span className="font-semibold text-lg tracking-tight text-primary">FraudShield</span>
            </div>
            <p className="text-sm text-zinc-500 mb-8 max-w-sm leading-relaxed">
              The standard in enterprise fraud prevention. Explainable AI for modern financial infrastructure.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-400 hover:text-primary transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="text-zinc-400 hover:text-primary transition-colors"><Github className="w-4 h-4" /></a>
              <a href="#" className="text-zinc-400 hover:text-primary transition-colors"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-primary text-sm mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-zinc-500 font-medium">
              <li><Link to="#" className="hover:text-primary transition-colors">Platform</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Decision Engine</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary text-sm mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-zinc-500 font-medium">
              <li><Link to="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">API Reference</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Case Studies</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-zinc-500 font-medium">
              <li><Link to="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Security</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-zinc-500">
            &copy; {new Date().getFullYear()} FraudShield AI, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-zinc-500 font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
