import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { useUIStore } from './stores/uiStore';
import { startOllamaHealthCheck } from './services/ollama';
import { initializeTestData } from './services/localStorage';
import { notificationManager } from './services/notificationManager';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage').then((m) => ({ default: m.TransactionsPage })));
const BudgetsPage = lazy(() => import('./pages/BudgetsPage').then((m) => ({ default: m.BudgetsPage })));
const GoalsPage = lazy(() => import('./pages/GoalsPage').then((m) => ({ default: m.GoalsPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const PersonalInformationPage = lazy(() => import('./pages/PersonalInformationPage').then((m) => ({ default: m.PersonalInformationPage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })));

function App() {
  const { initialize } = useAuthStore();
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    initialize();

    // Initialize test data if not already present
    const hasInitialized = localStorage.getItem('smartspend_initialized');
    if (!hasInitialized) {
      initializeTestData('user1');
      localStorage.setItem('smartspend_initialized', 'true');
    }

    // Start Ollama health checks on app initialization
    startOllamaHealthCheck(30000); // Check every 30 seconds

    // Initialize theme on app start
    setTheme(theme);

    // Start notification manager for authenticated users
    const unsubscribe = useAuthStore.subscribe((state) => {
      if (state.user?.email && state.user?.id !== 'user1') {
        notificationManager.startPeriodicChecks(state.user.id, state.user.email);
      } else {
        notificationManager.stopPeriodicChecks();
      }
    });

    // Cleanup on unmount
    return () => {
      notificationManager.stopPeriodicChecks();
      unsubscribe();
    };
  }, [initialize, theme, setTheme]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><AppLayout><TransactionsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute><AppLayout><BudgetsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><AppLayout><GoalsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><AppLayout><ReportsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/personal-information" element={<ProtectedRoute><AppLayout><PersonalInformationPage /></AppLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

