import { useSecurityEvents } from "@/core/api/hooks/useOps";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, ShieldAlert, Lock, Activity } from "lucide-react";
import { SecurityShield } from "@/components/3d/SecurityShield";

export const SecurityCenter = () => {
  const { data: security, isLoading } = useSecurityEvents();

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="OWASP Security Center" 
        description="Monitor active JWT revocations, rate limit violations, and automated bot defenses." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <SecurityShield />
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="glass-panel border-rose-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-rose-500 flex items-center text-lg"><Lock className="w-4 h-4 mr-2" /> Failed Logins</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-3xl font-bold">{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : security?.failed_logins}</h3>
              <p className="text-xs opacity-50 mt-1">Trailing 24 hours</p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-500 flex items-center text-lg"><Activity className="w-4 h-4 mr-2" /> Rate Limit Drops</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-3xl font-bold">{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : security?.rate_limit_violations}</h3>
              <p className="text-xs opacity-50 mt-1">API Requests Dropped (HTTP 429)</p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-indigo-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-indigo-500 flex items-center text-lg"><ShieldAlert className="w-4 h-4 mr-2" /> JWT Revocations</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-3xl font-bold">{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : security?.jwt_revocations}</h3>
              <p className="text-xs opacity-50 mt-1">Active tokens forcefully invalidated</p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-emerald-500 flex items-center text-lg"><ShieldCheck className="w-4 h-4 mr-2" /> OWASP Score</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-3xl font-bold">{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${security?.owasp_score}/100`}</h3>
              <p className="text-xs opacity-50 mt-1">System Hardening Rating</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Dummy import to satisfy compiler since I used it above
import { ShieldCheck } from "lucide-react";
