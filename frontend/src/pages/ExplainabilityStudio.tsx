import { useState } from 'react';
import { useTransactionExplanation } from "@/core/api/hooks/useExplainability";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShapWaterfallChart } from "@/components/charts/ShapWaterfallChart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ExplainabilityStudio = () => {
  const [txId, setTxId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  
  const { data: explanation, isLoading } = useTransactionExplanation(txId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTxId(searchInput.trim());
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Explainability Studio" 
        description="Deep dive into AI decision matrices using SHAP & LIME." 
      />

      <Card className="glass-panel max-w-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              placeholder="Enter Transaction ID to Analyze..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-background/50"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              Analyze
            </Button>
          </form>
        </CardContent>
      </Card>

      {txId && isLoading && (
        <div className="flex justify-center p-12"><Loader2 className="h-12 w-12 animate-spin text-muted-foreground" /></div>
      )}

      {explanation && explanation.explanation_type === 'nlp' && (
        <Card className="glass-panel border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-emerald-500">Customer Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg opacity-90">{explanation.summary}</p>
            <p className="text-sm opacity-50 mt-4">Calculated Probability: {(explanation.probability * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
      )}

      {explanation && explanation.explanation_type === 'technical' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>SHAP Waterfall (Feature Contributions)</CardTitle>
            </CardHeader>
            <CardContent>
              <ShapWaterfallChart 
                baseValue={explanation.shap_summary.base_value} 
                features={explanation.shap_summary.features} 
              />
            </CardContent>
          </Card>
          
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Technical Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm opacity-70">Fraud Probability: </span>
                <Badge variant="outline" className={explanation.probability > 0.75 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"}>
                  {(explanation.probability * 100).toFixed(2)}%
                </Badge>
              </div>
              <div className="text-sm opacity-70">
                <p>This transaction was processed by the Hybrid Ensemble model.</p>
                <p className="mt-2">Top driving features for this prediction were <strong>Amount</strong> and <strong>V17</strong>.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
