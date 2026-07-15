import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Search, Shield, Activity, Zap, Server } from 'lucide-react';

const KNOWLEDGE_ARTICLES = [
  {
    title: "Understanding SHAP Values",
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    content: "SHAP (SHapley Additive exPlanations) is a game theoretic approach to explain the output of any machine learning model. It connects optimal credit allocation with local explanations using the classic Shapley values from cooperative game theory. In FraudShield, SHAP tells us exactly which feature (e.g., Amount, V2) contributed the most to the final risk score.",
  },
  {
    title: "The Hybrid Meta-Ensemble",
    icon: <Server className="w-6 h-6 text-indigo-500" />,
    content: "We use a Stacking Classifier. Base learners include XGBoost (Gradient Boosting), Extra Trees, and a Deep Neural Network. Their predictions are fed into a Meta-Model (Logistic Regression) which learns how to optimally weigh the base learners' predictions, achieving >99% AUROC.",
  },
  {
    title: "Isotonic Probability Calibration",
    icon: <Activity className="w-6 h-6 text-green-500" />,
    content: "Tree-based models often push probabilities away from 0 and 1. Isotonic Regression is applied post-training to rigidly map the model's raw output score to a true empirical likelihood. If the calibrated model says 80% risk, it strictly means 80 out of 100 similar transactions were fraud.",
  },
  {
    title: "OWASP Security Hardening",
    icon: <Shield className="w-6 h-6 text-red-500" />,
    content: "FraudShield API uses JSON Web Tokens (JWT) for stateless authentication. We employ bcrypt for password hashing. Nginx handles Rate Limiting (10 req/s) to prevent DDoS, while strictly enforcing HSTS and XSS protection headers.",
  }
];

export const KnowledgeCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = KNOWLEDGE_ARTICLES.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center">
            <Book className="w-8 h-8 mr-3 text-indigo-600" />
            Knowledge Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Search the official documentation, MLOps explanations, and platform guidelines.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all shadow-sm"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                {article.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{article.title}</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              {article.content}
            </p>
          </motion.div>
        ))}
      </div>
      
      {filteredArticles.length === 0 && (
        <div className="text-center py-20">
          <Book className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No articles found</h3>
          <p className="text-slate-500">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
};
