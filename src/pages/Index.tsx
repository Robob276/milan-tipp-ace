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
  const [selectedGame, setSelectedGame] = useState<{ id: string; isArchived: boolean } | null>(null);
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
  
  // Not authenticated - show login page first (new flow)
  if (!isAuthenticated && loginMode !== 'admin') {
    return <PlayerLoginPage onAdminLogin={() => setLoginMode('admin')} />;
  }

  // Admin login flow
  if (loginMode === 'admin' && !isAuthenticated) {
    return <AdminLoginPage onBackToHome={() => setLoginMode(null)} />;
  }

  // Authenticated - show event selection if no game selected
  if (isAuthenticated && !selectedGame) {
    return (
      <HomeScreen 
        onSelectGame={(gameId, isArchived) => setSelectedGame({ id: gameId, isArchived: isArchived || false })}
      />
    );
  }

  // Authenticated with game selected - show dashboard
  if (isAuthenticated && selectedGame) {
    return (
      <PredictionProvider>
        <Dashboard 
          onBackToHome={() => setSelectedGame(null)} 
          isAdminMode={isAdmin}
          competitionId={selectedGame.id}
          isArchived={selectedGame.isArchived}
        />
      </PredictionProvider>
    );
  }

  return <PlayerLoginPage onAdminLogin={() => setLoginMode('admin')} />;
};

const Index = () => {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
};

export default Index;
