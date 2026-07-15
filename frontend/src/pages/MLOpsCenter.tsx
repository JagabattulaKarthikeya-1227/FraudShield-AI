import { useMLOpsRegistry } from "@/core/api/hooks/useOps";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, GitCommit, Settings, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const MLOpsCenter = () => {
  const { data: mlops, isLoading } = useMLOpsRegistry();

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="MLOps & Model Lifecycle" 
        description="Monitor active pipeline artifacts, deployment statuses, and calibration techniques." 
      />

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-12 h-12 animate-spin opacity-50" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-blue-500 flex items-center"><Settings className="w-5 h-5 mr-2" /> Active Production Artifacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-60">Version</p>
                    <p className="font-mono">{mlops?.current_model.version}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-60">Git Commit</p>
                    <p className="font-mono flex items-center"><GitCommit className="w-4 h-4 mr-1 opacity-50" /> {mlops?.current_model.git_commit}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-60">Calibration Method</p>
                    <p>{mlops?.current_model.calibration}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-60">Status</p>
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">{mlops?.current_model.status}</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm opacity-60 mb-2">Loaded Pipelines (.pkl / .h5)</p>
                  <div className="flex flex-wrap gap-2">
                    {mlops?.current_model.artifacts.map((art: string, i: number) => (
                      <Badge key={i} variant="outline" className="font-mono text-xs">{art}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Deployment Lifecycle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-border/50 ml-4 pl-6 space-y-6 py-2">
                {mlops?.lifecycle.map((stage: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[31px] p-1 rounded-full border ${
                      stage.status === 'Completed' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' :
                      'bg-blue-500/20 border-blue-500 text-blue-500 animate-pulse'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{stage.phase}</h4>
                      <p className="text-xs opacity-50">{new Date(stage.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
