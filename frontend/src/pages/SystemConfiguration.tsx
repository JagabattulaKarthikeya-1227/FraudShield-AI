import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export const SystemConfiguration = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="System Configuration" 
        description="Global Administrator settings, Risk Thresholds, and API Limits." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Risk Thresholds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm opacity-70">High Risk Boundary (Triggers Auto-Decline or Review)</label>
              <Input defaultValue="0.75" type="number" step="0.01" max="1" min="0" className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm opacity-70">Review Required Boundary (Triggers Analyst Queue)</label>
              <Input defaultValue="0.15" type="number" step="0.01" max="1" min="0" className="bg-background/50" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full"><Save className="w-4 h-4 mr-2" /> Save Thresholds</Button>
          </CardFooter>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Security & Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm opacity-70">JWT Access Token Expiration (Minutes)</label>
              <Input defaultValue="15" type="number" className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm opacity-70">API Rate Limit (Requests per minute)</label>
              <Input defaultValue="120" type="number" className="bg-background/50" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Update Policies</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
