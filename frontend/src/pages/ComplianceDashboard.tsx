import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { AcademicTooltip } from '@/components/ui/AcademicTooltip';
import { ShieldCheck, ShieldAlert, Key, FileLock, Network, EyeOff, GlobeLock, Code } from 'lucide-react';

export const ComplianceDashboard: React.FC = () => {
  const owaspItems = [
    { 
      title: 'A01: Broken Access Control', 
      status: 'Secured', 
      icon: Key,
      desc: 'Enforced via strict JWT verification and Role-Based Access Control (RBAC).',
      academic: 'JWTs (JSON Web Tokens) are used to securely transmit identity. We use HttpOnly cookies to store refresh tokens to prevent JavaScript access (XSS), and short-lived access tokens to limit exposure.' 
    },
    { 
      title: 'A02: Cryptographic Failures', 
      status: 'Secured', 
      icon: FileLock,
      desc: 'All data in transit encrypted via TLS 1.3. Passwords hashed using Argon2id.',
      academic: 'Argon2id is the current industry standard for password hashing, resistant to both GPU cracking and side-channel attacks. We NEVER store plaintext passwords.'
    },
    { 
      title: 'A03: Injection (SQLi / XSS)', 
      status: 'Secured', 
      icon: Code,
      desc: 'ORM usage prevents SQL injection. React auto-escapes HTML to prevent XSS.',
      academic: 'Because we use SQLAlchemy/Prisma on the backend, SQL injection is inherently mitigated. React DOM escapes values by default, protecting against basic Cross-Site Scripting.'
    },
    { 
      title: 'A04: Insecure Design', 
      status: 'Secured', 
      icon: ShieldCheck,
      desc: 'Zero-trust architecture implemented across microservices.',
      academic: 'Zero Trust means no internal service trusts another by default. The ML prediction service requires explicit authentication from the API gateway.'
    },
    { 
      title: 'A05: Security Misconfiguration', 
      status: 'Secured', 
      icon: GlobeLock,
      desc: 'Strict Content Security Policy (CSP) and CORS headers enforced.',
      academic: 'CORS (Cross-Origin Resource Sharing) is configured to only allow requests from our specific frontend domains, preventing unauthorized external clients from calling our APIs.'
    },
    { 
      title: 'A07: Identification Failures', 
      status: 'Secured', 
      icon: EyeOff,
      desc: 'MFA enforcement available. Rate limiting on login endpoints.',
      academic: 'We employ Redis-backed rate limiting (e.g., max 5 attempts per minute) on the /auth/login endpoint to prevent brute-force and credential stuffing attacks.'
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader 
        title="Compliance & OWASP Governance" 
        description="Verify platform alignment with the OWASP Top 10 and enterprise security standards." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {owaspItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <AcademicTooltip key={i} title={item.title} content={item.academic}>
              <div className="h-full">
                <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                      <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {item.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                    {item.desc}
                  </p>
                </InteractiveCard>
              </div>
            </AcademicTooltip>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="font-semibold mb-4">Platform Certifications</h3>
        <div className="flex flex-wrap gap-4">
          <div className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">SOC 2 Type II Compliant</span>
          </div>
          <div className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">PCI-DSS Ready Architecture</span>
          </div>
          <div className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">GDPR Data Minimization</span>
          </div>
        </div>
      </div>
    </div>
  );
};
