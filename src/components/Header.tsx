import React from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { LogOut, Trophy, Calendar, BarChart3, Home, Settings } from 'lucide-react';
import opodiumLogo from '@/assets/opodium-logo.jpeg';

interface HeaderProps {
  activeTab: 'events' | 'leaderboard' | 'stats';
  setActiveTab: (tab: 'events' | 'leaderboard' | 'stats') => void;
  onBackToHome?: () => void;
  onOpenResultsAdmin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onBackToHome, onOpenResultsAdmin }) => {
  const { currentPlayer, isAdmin, logout } = usePlayer();

  const handleLogout = () => {
    logout();
    onBackToHome?.();
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBackToHome}
                className="text-muted-foreground hover:text-foreground mr-1"
              >
                <Home className="w-5 h-5" />
              </Button>
            )}
            <img 
              src={opodiumLogo} 
              alt="Opodium Logo" 
              className="w-10 h-10 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="font-bold text-foreground leading-tight">Opodium</h1>
              <p className="text-xs text-muted-foreground">Olympic Podium</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg">
            {/* Events tab - only for non-admin players */}
            {!isAdmin && (
              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'events'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Tippen</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Rangliste</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'stats'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Statistiken</span>
            </button>
          </nav>

          {/* User Info & Admin */}
          <div className="flex items-center gap-2">
            {isAdmin && onOpenResultsAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenResultsAdmin}
                className="text-muted-foreground hover:text-foreground"
                title="Ergebnisse eintragen (Admin)"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{currentPlayer?.name}</p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? 'Admin' : 'Angemeldet'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
