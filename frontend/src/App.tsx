import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LandingPage } from '@/pages/LandingPage';
import { CustomerDashboard } from '@/pages/CustomerDashboard';
import { FraudAnalystWorkspace } from '@/pages/FraudAnalystWorkspace';
import { 
  ExplainabilityStudio, 
  ModelRegistry, 
  NotFound,
  AnalyticsCenter,
  SystemConfiguration,
  AuditCenter,
  ChampionChallenger,
  AlertsCenter
} from '@/pages/index';

import { CopilotProvider } from '@/core/context/CopilotContext';
import { AcademicModeProvider } from '@/core/context/AcademicModeContext';

function App() {
  return (
    <AcademicModeProvider>
      <CopilotProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Authenticated Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/transactions" element={<FraudAnalystWorkspace />} />
            <Route path="/alerts" element={<AlertsCenter />} />
            <Route path="/analytics" element={<AnalyticsCenter />} />
            <Route path="/explainability" element={<ExplainabilityStudio />} />
            <Route path="/models" element={<ModelRegistry />} />
            <Route path="/champion" element={<ChampionChallenger />} />
            <Route path="/audit" element={<AuditCenter />} />
            <Route path="/settings" element={<SystemConfiguration />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CopilotProvider>
    </AcademicModeProvider>
  );
}

export default App;
