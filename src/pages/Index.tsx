import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PredictionProvider } from '@/contexts/PredictionContext';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';
import HomeScreen from '@/components/HomeScreen';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full gradient-olympic mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }
  
  if (!selectedGame) {
    return <HomeScreen onSelectGame={setSelectedGame} />;
  }
  
  return isAuthenticated ? (
    <PredictionProvider>
      <Dashboard onBackToHome={() => setSelectedGame(null)} />
    </PredictionProvider>
  ) : (
    <LoginPage onBackToHome={() => setSelectedGame(null)} />
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
