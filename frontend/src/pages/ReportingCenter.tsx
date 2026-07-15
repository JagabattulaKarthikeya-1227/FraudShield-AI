import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Database, ShieldAlert } from "lucide-react";

export const ReportingCenter = () => {
  const handleExport = (type: string) => {
    // Simulate generation of a CSV blob and triggering download
    const csvContent = `Report Type,${type}\nStatus,Generated\nDate,${new Date().toISOString()}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `fraudshield_${type}_report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Reporting & Audit Center" 
        description="Generate and export compliance logs, prediction audit trails, and platform metrics." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="glass-panel hover:bg-background/40 transition-colors cursor-pointer" onClick={() => handleExport('prediction_audit')}>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-500">
              <FileText className="w-5 h-5 mr-2" />
              Prediction Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm opacity-70">A complete historic log of every transaction scored by the AI engine, including raw probabilities and resulting risk classifications.</p>
            <Button variant="outline" className="w-full"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
          </CardContent>
        </Card>

        <Card className="glass-panel hover:bg-background/40 transition-colors cursor-pointer" onClick={() => handleExport('security_events')}>
          <CardHeader>
            <CardTitle className="flex items-center text-rose-500">
              <ShieldAlert className="w-5 h-5 mr-2" />
              Security & Override Log
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm opacity-70">A ledger of all manual Analyst overrides from the Priority Queue, and any unauthorized API access attempts.</p>
            <Button variant="outline" className="w-full text-rose-500 hover:text-rose-400"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
          </CardContent>
        </Card>

        <Card className="glass-panel hover:bg-background/40 transition-colors cursor-pointer" onClick={() => handleExport('model_drift')}>
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-500">
              <Database className="w-5 h-5 mr-2" />
              Model Stability Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm opacity-70">Data export detailing global SHAP average drift across the 28 principal components over the trailing 90 days.</p>
            <Button variant="outline" className="w-full text-emerald-500 hover:text-emerald-400"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
