import { useState } from 'react';
import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext';
import { PredictionProvider } from '@/contexts/PredictionContext';
import PlayerLoginPage from '@/components/PlayerLoginPage';
import AdminLoginPage from '@/components/AdminLoginPage';
import Dashboard from '@/components/Dashboard';
import HomeScreen from '@/components/HomeScreen';

type LoginMode = 'player' | 'admin' | null;

const AppContent = () => {
  const { isAuthenticated, isAdmin, isLoading } = usePlayer();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [loginMode, setLoginMode] = useState<LoginMode>(null);
  
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
  
  // If not selecting a game yet, show home screen
  if (!selectedGame && !loginMode) {
    return (
      <HomeScreen 
        onSelectGame={(gameId) => {
          setSelectedGame(gameId);
          setLoginMode('player');
        }}
        onAdminLogin={() => setLoginMode('admin')}
      />
    );
  }

  // Admin login flow
  if (loginMode === 'admin' && !isAuthenticated) {
    return <AdminLoginPage onBackToHome={() => setLoginMode(null)} />;
  }

  // Player login flow  
  if (selectedGame && !isAuthenticated) {
    return <PlayerLoginPage onBackToHome={() => {
      setSelectedGame(null);
      setLoginMode(null);
    }} />;
  }

  // Authenticated - show dashboard
  if (isAuthenticated) {
    return (
      <PredictionProvider>
        <Dashboard 
          onBackToHome={() => {
            setSelectedGame(null);
            setLoginMode(null);
          }} 
          isAdminMode={isAdmin && loginMode === 'admin'}
        />
      </PredictionProvider>
    );
  }

  return <HomeScreen 
    onSelectGame={(gameId) => {
      setSelectedGame(gameId);
      setLoginMode('player');
    }}
    onAdminLogin={() => setLoginMode('admin')}
  />;
};

const Index = () => {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
};

export default Index;
