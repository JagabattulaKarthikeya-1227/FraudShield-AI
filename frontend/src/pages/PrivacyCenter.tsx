import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { AcademicTooltip } from '@/components/ui/AcademicTooltip';
import { Database, Lock, EyeOff, UserX, Trash2 } from 'lucide-react';

export const PrivacyCenter: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader 
        title="Privacy & Data Integrity Center" 
        description="Documentation of our data handling practices and synthetic data guarantees." 
      />

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-6">
          <InteractiveCard tilt={false} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Data Privacy Principles</h2>
            
            <div className="space-y-8">
              
              <section>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <Database className="w-5 h-5 text-indigo-500" /> Synthetic Data Guarantee
                </h3>
                <AcademicTooltip 
                  title="Why Synthetic Data?" 
                  content="This platform is designed as an academic demonstration of enterprise ML capabilities. To ensure zero risk of PII leakage, the entire 14-million row dataset was synthetically generated to mirror real-world distributions without containing any real human data."
                >
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    FraudShield AI strictly operates on <strong>100% synthetic data</strong>. No real credit card numbers (PANs), Social Security Numbers, or actual user transactions are stored or processed by this application. The dataset is mathematically generated to mimic financial fraud patterns for training purposes only.
                  </p>
                </AcademicTooltip>
              </section>

              <section>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <Lock className="w-5 h-5 text-emerald-500" /> Identity Protection
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Authentication within the platform uses the <code>Argon2id</code> hashing algorithm for passwords. Identity is verified via short-lived JSON Web Tokens (JWT) signed with HS256. Long-lived refresh tokens are stored in secure, HttpOnly, SameSite cookies to protect against credential harvesting.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <EyeOff className="w-5 h-5 text-slate-500" /> Environment & Secrets
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  All sensitive configuration (JWT secrets, database URIs, API keys) is injected at runtime via Environment Variables. No secrets are hardcoded into the source code, adhering to the Twelve-Factor App methodology.
                </p>
              </section>
              
            </div>
          </InteractiveCard>
        </div>

        {/* Sidebar Info */}
        <div className="lg:w-1/3 space-y-6">
          <InteractiveCard tilt={false} className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
            <h3 className="font-semibold text-rose-900 dark:text-rose-300 mb-4 flex items-center gap-2">
              <UserX className="w-5 h-5"/> GDPR Compliance
            </h3>
            <p className="text-sm text-rose-800 dark:text-rose-200/80 leading-relaxed mb-4">
              Even though the data is synthetic, the platform architecture supports GDPR principles:
            </p>
            <ul className="space-y-3 text-sm text-rose-800 dark:text-rose-200/80">
              <li className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Right to Erasure (Hard Delete)
              </li>
              <li className="flex items-center gap-2">
                <EyeOff className="w-4 h-4" /> Data Minimization
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-4 h-4" /> Portability (CSV Export)
              </li>
            </ul>
          </InteractiveCard>
        </div>

      </div>
    </div>
  );
};
