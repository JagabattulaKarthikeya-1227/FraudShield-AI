import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LandingPage } from '@/pages/LandingPage';
import { CustomerDashboard } from '@/pages/CustomerDashboard';
import { FraudAnalystWorkspace } from '@/pages/FraudAnalystWorkspace';
import { 
  FraudIntelligenceCenter, 
  ExplainabilityStudio, 
  ModelRegistry, 
  AdminConsole,
  NotFound,
  AnalyticsCenter,
  SystemHealth,
  ReportingCenter,
  SecurityCenter,
  MLOpsCenter,
  KnowledgeCenter,
  SystemConfiguration,
  AuditCenter,
  PrivacyCenter,
  ComplianceDashboard,
  ResponsibleAI,
  IncidentManagement,
  ExperimentTracking,
  DriftDetection,
  ChampionChallenger,
  FeatureStore
} from '@/pages/index';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Authenticated Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/workspace" element={<FraudAnalystWorkspace />} />
        <Route path="/transactions" element={<FraudAnalystWorkspace />} />
        <Route path="/intelligence" element={<FraudIntelligenceCenter />} />
        <Route path="/analytics" element={<AnalyticsCenter />} />
        <Route path="/explainability" element={<ExplainabilityStudio />} />
        <Route path="/studio" element={<ExplainabilityStudio />} />
        <Route path="/models" element={<ModelRegistry />} />
        <Route path="/health" element={<SystemHealth />} />
        <Route path="/mlops" element={<MLOpsCenter />} />
        <Route path="/registry" element={<ModelRegistry />} />
        <Route path="/experiments" element={<ExperimentTracking />} />
        <Route path="/drift" element={<DriftDetection />} />
        <Route path="/champion" element={<ChampionChallenger />} />
        <Route path="/features" element={<FeatureStore />} />
        <Route path="/reporting" element={<ReportingCenter />} />
        <Route path="/security" element={<SecurityCenter />} />
        <Route path="/incidents" element={<IncidentManagement />} />
        <Route path="/audit" element={<AuditCenter />} />
        <Route path="/privacy" element={<PrivacyCenter />} />
        <Route path="/compliance" element={<ComplianceDashboard />} />
        <Route path="/responsible-ai" element={<ResponsibleAI />} />
        <Route path="/knowledge" element={<KnowledgeCenter />} />
        <Route path="/settings" element={<SystemConfiguration />} />
        <Route path="/admin" element={<AdminConsole />} />
        
        {/* Catch-all for inside the layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
