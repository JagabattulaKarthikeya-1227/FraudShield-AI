import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import React, { Suspense, lazy } from 'react';
import { GlobalLoader } from '@/components/layout/GlobalLoader';
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.LandingPage })));
import { 
  CustomerDashboard,
  FraudAnalystWorkspace,
  ExplainabilityStudio, 
  ModelRegistry, 
  NotFound,
  AnalyticsCenter,
  AlertsCenter,
  Settings,
  PlatformPage,
  PricingPage,
  AboutPage,
  ContactPage,
  LoginPage,
  RiskScoreCalculator
} from '@/pages/index';

import { CopilotProvider } from '@/core/context/CopilotContext';
import { AcademicModeProvider } from '@/core/context/AcademicModeContext';

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="w-full min-h-screen"
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <AcademicModeProvider>
      <CopilotProvider>
        <Suspense fallback={<GlobalLoader />}>
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname.split('/')[1] || '/'}>
                {/* Public Routes */}
                <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
                <Route path="/platform" element={<PageTransition><PlatformPage /></PageTransition>} />
                <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
                <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
                <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                <Route path="/register" element={<PageTransition><LoginPage /></PageTransition>} />
                
                {/* Authenticated Dashboard Routes */}
                <Route element={<PageTransition><DashboardLayout /></PageTransition>}>
                  <Route path="/calculate" element={<RiskScoreCalculator />} />
                  <Route path="/dashboard" element={<CustomerDashboard />} />
                  <Route path="/transactions" element={<FraudAnalystWorkspace />} />
                  <Route path="/alerts" element={<AlertsCenter />} />
                  <Route path="/analytics" element={<AnalyticsCenter />} />
                  <Route path="/explainability" element={<ExplainabilityStudio />} />
                  <Route path="/models" element={<ModelRegistry />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </ErrorBoundary>
        </Suspense>
      </CopilotProvider>
    </AcademicModeProvider>
  );
}

export default App;

