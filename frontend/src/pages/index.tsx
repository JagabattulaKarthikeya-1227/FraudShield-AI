import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { Settings as SettingsIcon } from "lucide-react";

export { ExplainabilityStudio } from './ExplainabilityStudio';
export { ModelRegistry } from './ModelRegistry';
export { AnalyticsCenter } from './AnalyticsCenter';
export { SystemConfiguration } from './SystemConfiguration';
export { AuditCenter } from './AuditCenter';
export { ChampionChallenger } from './ChampionChallenger';
export { AlertsCenter } from './AlertsCenter';

export const Settings = () => (
  <div className="space-y-8">
    <PageHeader title="Settings" description="Platform configurations and user preferences." />
    <EmptyState title="Settings Loading" description="System configurations are currently locked in this phase." icon={<SettingsIcon className="h-8 w-8" />} />
  </div>
);

export const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
    <p className="text-muted-foreground">The module you are looking for does not exist.</p>
  </div>
);
