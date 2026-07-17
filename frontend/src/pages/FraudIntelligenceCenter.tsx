import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePredictSingle, usePredictBatch } from "@/core/api/hooks/usePredict";
import { UploadCloud, CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const singlePredictSchema = z.object({
  Amount: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive("Amount must be positive")),
  Merchant: z.string().min(2, "Merchant name is required"),
  Category: z.string().min(2, "Category is required"),
  V1: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().default(0)),
});

type PredictFormValues = z.infer<typeof singlePredictSchema>;

export const FraudIntelligenceCenter = () => {
  const { mutate: predictSingle, isPending: singlePending } = usePredictSingle();
  const { mutate: predictBatch, isPending: batchPending } = usePredictBatch();
  
  const [singleResult, setSingleResult] = useState<any>(null);
  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [batchResult, setBatchResult] = useState<any>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<PredictFormValues>({
    resolver: zodResolver(singlePredictSchema),
    defaultValues: {
      Amount: 150.0,
      Merchant: "Apple Store",
      Category: "Electronics",
      V1: 0.5
    }
  });

  const onSingleSubmit = (data: PredictFormValues) => {
    predictSingle(data, {
      onSuccess: (res) => {
        setSingleResult(res.data.risk_assessment);
      }
    });
  };

  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBatchFile(e.target.files[0]);
    }
  };

  const submitBatch = () => {
    if (batchFile) {
      predictBatch(batchFile, {
        onSuccess: (res) => {
          setBatchResult(res.data.batch_results);
        }
      });
    }
  };

  const getRiskColor = (level: string) => {
    switch(level) {
      case "Low Risk": return "bg-success/10 text-success border-success/20";
      case "Review Required": return "bg-warning/10 text-warning border-warning/20";
      case "High Risk": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "";
    }
  };

  const getRiskIcon = (level: string) => {
    switch(level) {
      case "Low Risk": return <CheckCircle className="w-12 h-12 text-success mb-4" />;
      case "Review Required": return <AlertTriangle className="w-12 h-12 text-warning mb-4" />;
      case "High Risk": return <XCircle className="w-12 h-12 text-destructive mb-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="AI Decision Lab" 
        description="Run real-time transaction inference through the Hybrid Ensemble Engine." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Single Prediction Form */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Single Transaction Predictor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSingleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Merchant</label>
                  <Input {...register("Merchant")} placeholder="e.g. Amazon" className="bg-background/50" />
                  {errors.Merchant && <p className="text-xs text-rose-500">{errors.Merchant.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Category</label>
                  <Input {...register("Category")} placeholder="e.g. Retail" className="bg-background/50" />
                  {errors.Category && <p className="text-xs text-rose-500">{errors.Category.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Amount (USD)</label>
                  <Input {...register("Amount")} type="number" step="0.01" className="bg-background/50" />
                  {errors.Amount && <p className="text-xs text-rose-500">{errors.Amount.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">V1 (PCA Feature)</label>
                  <Input {...register("V1")} type="number" step="0.01" className="bg-background/50" />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={singlePending}>
                {singlePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Run Inference
              </Button>
            </form>

            {/* Prediction Result Display */}
            {singleResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-8 p-6 rounded-xl border flex flex-col items-center justify-center text-center ${getRiskColor(singleResult.risk_level)}`}
              >
                {getRiskIcon(singleResult.risk_level)}
                <h3 className="text-2xl font-semibold mb-2">{singleResult.risk_level}</h3>
                <p className="text-sm opacity-80 mb-4">
                  Fraud Probability: {(singleResult.probability * 100).toFixed(2)}%
                </p>
                <Badge variant="outline" className="bg-background/50 backdrop-blur-md">
                  Action: {singleResult.suggested_action.toUpperCase()}
                </Badge>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Batch Upload */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Batch CSV Processing</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            <div className="border-2 border-dashed border-border/50 rounded-xl p-12 w-full flex flex-col items-center justify-center text-center bg-background/20 hover:bg-background/40 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleBatchUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Drag & drop your dataset here</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {batchFile ? batchFile.name : "or click to browse CSV files"}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={!batchFile || batchPending}
              onClick={submitBatch}
            >
              {batchPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Process Batch
            </Button>

            {batchResult && (
              <div className="w-full mt-4 bg-background/50 rounded-lg p-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                <p className="text-sm font-medium mb-2">Processed {batchResult.length} rows</p>
                {batchResult.slice(0,5).map((res: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs py-1 border-b border-border/50 last:border-0">
                    <span className="opacity-70">Row {idx+1} (${res.Amount})</span>
                    <span className={res.Risk === 'High Risk' ? 'text-rose-500' : 'text-emerald-500'}>
                      {res.Risk} ({(res.Probability * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
                {batchResult.length > 5 && <p className="text-xs text-center mt-2 opacity-50">...and {batchResult.length - 5} more</p>}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
