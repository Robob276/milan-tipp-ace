import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PredictionProvider } from '@/contexts/PredictionContext';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
};

const Index = () => {
  return (
    <AuthProvider>
      <PredictionProvider>
        <AppContent />
      </PredictionProvider>
    </AuthProvider>
  );
};

export default Index;
