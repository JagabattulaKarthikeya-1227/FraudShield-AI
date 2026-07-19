import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BrainCircuit, Activity, Crosshair, BarChart3, Code2 } from 'lucide-react';

const features = [
  {
    title: "Real-Time Detection",
    description: "Sub-50ms inference latency for synchronous authorization.",
    icon: <Zap className="w-5 h-5 text-emerald-600" />
  },
  {
    title: "Explainable AI",
    description: "Instant SHAP values for every blocked transaction.",
    icon: <BrainCircuit className="w-5 h-5 text-emerald-600" />
  },
  {
    title: "Model Monitoring",
    description: "Continuous evaluation for concept and data drift.",
    icon: <Activity className="w-5 h-5 text-emerald-600" />
  },
  {
    title: "High Accuracy",
    description: "99.8% precision through hybrid ensemble modeling.",
    icon: <Crosshair className="w-5 h-5 text-emerald-600" />
  },
  {
    title: "Fraud Analytics",
    description: "Deep insights into geographical and temporal risk patterns.",
    icon: <BarChart3 className="w-5 h-5 text-emerald-600" />
  },
  {
    title: "REST API",
    description: "Developer-first endpoints for rapid integration.",
    icon: <Code2 className="w-5 h-5 text-emerald-600" />
  }
];

export function EnterpriseFeatures() {
  return (
    <section className="py-24 bg-white relative z-10 border-t border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Platform Capabilities
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Everything you need to secure your financial infrastructure.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#F8FAFC] p-8 rounded-[18px] border border-slate-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
