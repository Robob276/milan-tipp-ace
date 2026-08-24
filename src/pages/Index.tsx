import { useState } from 'react';
import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext';
import { PredictionProvider } from '@/contexts/PredictionContext';

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
  
  // Admin login flow (nur noch optional erreichbar)
  if (loginMode === 'admin' && !isAuthenticated) {
    return <AdminLoginPage onBackToHome={() => setLoginMode(null)} />;
  }

  // Kein Login mehr nötig – direkt ins Spiel
  if (!selectedGame) {
    return (
      <HomeScreen 
        onSelectGame={(gameId, isArchived) => setSelectedGame({ id: gameId, isArchived: isArchived || false })}
      />
    );
  }

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

};

const Index = () => {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
};

export default Index;
