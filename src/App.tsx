import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { useUIStore } from './stores/uiStore';
import { startOllamaHealthCheck } from './services/ollama';
import { initializeTestData } from './services/localStorage';
import { notificationManager } from './services/notificationManager';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { GoalsPage } from './pages/GoalsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PersonalInformationPage } from './pages/PersonalInformationPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

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
    </BrowserRouter>
  );
}

export default App;

