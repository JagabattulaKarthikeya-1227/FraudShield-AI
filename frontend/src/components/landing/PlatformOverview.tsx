import React from 'react';
import { motion } from 'framer-motion';
import { Network, BrainCircuit, ShieldCheck, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: "1",
    title: "Transaction Ingested",
    description: "Real-time transaction data is captured from multiple sources.",
    icon: <Network className="w-5 h-5 text-slate-400" />
  },
  {
    number: "2",
    title: "AI Analysis",
    description: "Our hybrid ML/DL models analyze patterns and detect anomalies.",
    icon: <BrainCircuit className="w-5 h-5 text-slate-400" />
  },
  {
    number: "3",
    title: "Risk Scoring",
    description: "Each transaction gets a risk score with confidence level.",
    icon: <ShieldCheck className="w-5 h-5 text-slate-400" />
  },
  {
    number: "4",
    title: "Explain & Act",
    description: "Get explainable insights and automated risk actions.",
    icon: <CheckCircle2 className="w-5 h-5 text-slate-400" />
  }
];

export function PlatformOverview() {
  return (
    <section id="platform" className="py-24 relative overflow-hidden bg-[#F8FAFC]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
        
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4"
          >
            HOW IT WORKS
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6"
          >
            Intelligent. Fast. Explainable.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col text-left hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 mb-8">
                {step.number}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">{step.description}</p>
              
              <div className="p-3 rounded-full border border-slate-100 self-start mt-auto">
                {step.icon}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
