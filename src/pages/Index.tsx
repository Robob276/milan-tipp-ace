import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PredictionProvider } from '@/contexts/PredictionContext';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';
import HomeScreen from '@/components/HomeScreen';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  
  // Show home screen first to select a game
  if (!selectedGame) {
    return <HomeScreen onSelectGame={setSelectedGame} />;
  }
  
  // Then show login or dashboard based on auth status
  return isAuthenticated ? (
    <Dashboard onBackToHome={() => setSelectedGame(null)} />
  ) : (
    <LoginPage onBackToHome={() => setSelectedGame(null)} />
  );
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
