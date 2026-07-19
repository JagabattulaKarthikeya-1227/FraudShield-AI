import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "FraudShield AI reduced our false positive rate by 40% in the first month. The explainability features made it easy to get approval from our compliance team.",
    author: "Sarah Jenkins",
    role: "VP of Risk Management",
    company: "GlobalBank"
  },
  {
    quote: "The sub-50ms latency is incredible. We integrated the API directly into our core checkout flow and haven't seen a single timeout. It's a game-changer.",
    author: "David Chen",
    role: "Head of Engineering",
    company: "PayStream"
  },
  {
    quote: "Unlike black-box models, FraudShield gives us the 'why' behind every decision. It's exactly what enterprise financial institutions need.",
    author: "Elena Rodriguez",
    role: "Chief Compliance Officer",
    company: "Nexus Financial"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 relative bg-background">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-semibold tracking-tight text-primary mb-4"
          >
            Trusted by Risk Leaders
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-500 max-w-2xl mx-auto"
          >
            See how top financial institutions use FraudShield AI to protect their platforms and accelerate growth.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-300 shadow-sm"
            >
              <div>
                <Quote className="w-6 h-6 text-zinc-300 dark:text-zinc-700 mb-6" />
                <p className="text-primary font-medium leading-relaxed mb-8 text-sm">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 font-bold text-sm border border-zinc-200 dark:border-zinc-700">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-primary text-sm">{t.author}</h4>
                  <p className="text-xs text-zinc-500">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
