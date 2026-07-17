import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { AcademicTooltip } from "@/components/ui/AcademicTooltip";
import { Database, Filter, Layers, Brain, CheckCircle, UploadCloud, Server } from "lucide-react";

const DAGNode = ({ icon: Icon, title, desc, delay, academicTitle, academicContent }: any) => (
  <AcademicTooltip title={academicTitle} content={academicContent}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      className="flex flex-col items-center group cursor-default relative z-10"
    >
      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center group-hover:border-indigo-500 transition-colors z-10 relative">
        <Icon className="w-6 h-6 text-slate-500 group-hover:text-indigo-500 transition-colors" />
        
        {/* Animated pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay }}
          className="absolute inset-0 rounded-2xl border-2 border-indigo-500/50 pointer-events-none"
        />
      </div>
      <div className="mt-4 text-center">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-[120px]">{desc}</p>
      </div>
    </motion.div>
  </AcademicTooltip>
);

const Edge = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ delay: delay + 0.3, duration: 0.6 }}
    className="h-0.5 w-16 lg:w-24 bg-slate-200 dark:bg-slate-800 relative origin-left -mt-16 z-0 hidden md:block"
  >
    <motion.div
      animate={{ x: ["0%", "100%"], opacity: [0, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: delay + 0.8 }}
      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-500 blur-sm"
    />
  </motion.div>
);

export const TrainingPipeline = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12 overflow-x-hidden">
      <PageHeader 
        title="Training Pipeline (DAG)" 
        description="Live visualization of the automated ML training and evaluation workflow." 
      />

      <div className="min-h-[500px] w-full bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 flex items-center justify-center overflow-x-auto relative shadow-inner">
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-y-16 md:gap-y-0 min-w-max">
          
          <DAGNode 
            icon={Database} 
            title="Raw Dataset" 
            desc="10M+ transaction records"
            delay={0.1}
            academicTitle="Data Sourcing"
            academicContent="Raw data contains high cardinality features (Merchant ID, Device Fingerprint) and requires rigorous cleaning before modeling."
          />
          <Edge delay={0.1} />

          <DAGNode 
            icon={Filter} 
            title="SMOTE & Clean" 
            desc="Handle class imbalance"
            delay={0.4}
            academicTitle="Why SMOTE only on training data?"
            academicContent="Synthetic Minority Over-sampling Technique (SMOTE) is applied ONLY to the training set to prevent data leakage. If applied before splitting, synthetic samples bleed into validation, creating artificially high accuracy."
          />
          <Edge delay={0.4} />

          <DAGNode 
            icon={Layers} 
            title="Base Models" 
            desc="XGBoost + RF + MLP"
            delay={0.7}
            academicTitle="Ensemble Base Learners"
            academicContent="We train diverse models to capture different decision boundaries. XGBoost is excellent for tabular splits, while Multi-Layer Perceptrons (MLP) capture non-linear embeddings."
          />
          <Edge delay={0.7} />

          <DAGNode 
            icon={Brain} 
            title="Meta Stacking" 
            desc="Logistic Regression Meta-learner"
            delay={1.0}
            academicTitle="Why Stacking improves performance"
            academicContent="Stacking uses a meta-model (usually Logistic Regression) to learn how to best combine the predictions of the base models, effectively learning which model to trust in specific feature spaces."
          />
          <Edge delay={1.0} />

          <DAGNode 
            icon={CheckCircle} 
            title="Evaluation" 
            desc="PR-AUC & Calibration"
            delay={1.3}
            academicTitle="Why PR-AUC is primary"
            academicContent="In fraud detection (0.1% positive class), ROC-AUC is misleading because True Negatives dominate. Precision-Recall AUC focuses entirely on the minority class, providing a true measure of fraud capture capability."
          />
          <Edge delay={1.3} />

          <DAGNode 
            icon={UploadCloud} 
            title="Model Registry" 
            desc="Version v4.2.1-prod"
            delay={1.6}
            academicTitle="Model Artifacts"
            academicContent="The final pipeline (.pkl) contains the encoders, scaler, SMOTE transform, base models, and meta-learner, stored as an immutable version in the registry."
          />

        </div>

      </div>

    </div>
  );
};
