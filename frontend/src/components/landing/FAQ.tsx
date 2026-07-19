import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How does the Hybrid Ensemble Model work?",
    answer: "Our system combines Extra Trees for tabular data, Multilayer Perceptrons for complex non-linear patterns, and an XGBoost Meta-Learner that dynamically weights the outputs. This architecture ensures high accuracy while minimizing false positives."
  },
  {
    question: "What is the typical integration timeline?",
    answer: "Most enterprise customers complete the integration within 2-4 weeks. We provide drop-in REST and GraphQL APIs, along with comprehensive documentation and dedicated technical account managers to support your engineering team."
  },
  {
    question: "How does FraudShield AI handle compliance and explainability?",
    answer: "Unlike black-box models, we use SHAP (SHapley Additive exPlanations) and LIME to reverse-engineer every decision. This provides human-readable rationales for why a transaction was flagged, fully satisfying regulatory requirements."
  },
  {
    question: "What are your data privacy and security standards?",
    answer: "We are SOC2 Type II certified and fully GDPR compliant. We offer options for on-premise deployment, VPC peering, and secure federated learning where your raw PII never leaves your environment."
  },
  {
    question: "Can it handle peak seasonal volumes (e.g., Black Friday)?",
    answer: "Yes. Our event-driven architecture built on Apache Kafka and Kubernetes auto-scales instantly. We maintain a sub-50ms p99 latency SLA even during 10x volume spikes."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-[800px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-semibold tracking-tight text-primary mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-500"
          >
            Everything you need to know about integrating and operating FraudShield AI.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border ${openIndex === index ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 bg-transparent hover:border-zinc-300 dark:hover:border-zinc-700'} rounded-xl transition-all duration-300 overflow-hidden`}
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`font-semibold text-sm ${openIndex === index ? 'text-primary' : 'text-zinc-600 dark:text-zinc-400'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : 'text-zinc-400'}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-sm text-zinc-500 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
