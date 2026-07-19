import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AlertTriangle, Clock, ShieldAlert, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const alerts = [
  { id: "ALT-9921", time: "10 mins ago", title: "Velocity Anomaly Detected", desc: "User u_9823 attempted 14 transactions within 60 seconds.", risk: "Critical", icon: ShieldAlert, color: "rose" },
  { id: "ALT-9920", time: "45 mins ago", title: "New IP Geolocation", desc: "Login from high-risk subnet (RU) on trusted account.", risk: "High", icon: AlertTriangle, color: "amber" },
  { id: "ALT-9919", time: "2 hours ago", title: "Amount Threshold Exceeded", desc: "Wire transfer of $45,000 exceeds daily limits.", risk: "Medium", icon: AlertCircle, color: "indigo" },
  { id: "ALT-9918", time: "5 hours ago", title: "Failed 3D Secure", desc: "Multiple sequential failures on card ending in 4921.", risk: "Medium", icon: AlertCircle, color: "indigo" },
];

export const AlertsCenter = () => {
  return (
    <div className="space-y-6 pb-12 w-full animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <PageHeader 
          title="Security Alerts" 
          description="Review queue and automated system flags." 
        />
        <div className="flex gap-3">
          <Button variant="outline" className="text-sm bg-white border-slate-200 text-slate-600">
            Acknowledge All
          </Button>
          <Button className="text-sm bg-rose-600 hover:bg-rose-700 text-white border-none">
            Review Critical (2)
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[1.25rem] border border-slate-200 shadow-sm p-6 lg:p-8">
        
        <h3 className="text-sm font-semibold text-slate-900 mb-8 uppercase tracking-wider">Active Timeline</h3>

        <div className="relative border-l border-slate-200 ml-4 space-y-10 pb-4">
          
          {alerts.map((alert, idx) => (
            <div key={idx} className="relative pl-8">
              
              {/* Timeline Dot */}
              <div className={`absolute -left-[17px] top-1 p-1.5 rounded-full bg-white border-2 border-${alert.color}-500 shadow-sm`}>
                <alert.icon className={`w-4 h-4 text-${alert.color}-500`} />
              </div>

              {/* Content */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all group">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-bold text-slate-900">{alert.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider
                      ${alert.risk === 'Critical' ? 'bg-rose-100 text-rose-700' : 
                        alert.risk === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}
                    `}>
                      {alert.risk}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {alert.time}
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-4">{alert.desc}</p>
                
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 mt-2">
                  <span className="font-mono text-xs text-slate-400">{alert.id}</span>
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-slate-600 group-hover:text-emerald-600">
                    Investigate <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Button>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};
