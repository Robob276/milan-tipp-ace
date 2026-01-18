import React from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, BarChart3, Home, Settings, ClipboardList } from 'lucide-react';
import opodiumLogo from '@/assets/opodium-logo.jpeg';

interface HeaderProps {
  activeTab: 'events' | 'stats' | 'results';
  setActiveTab: (tab: 'events' | 'stats' | 'results') => void;
  onBackToHome?: () => void;
  onOpenResultsAdmin?: () => void;
  isArchived?: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onBackToHome, onOpenResultsAdmin, isArchived }) => {
  const { currentPlayer, isAdmin, logout } = usePlayer();

  const handleLogout = () => {
    logout();
    onBackToHome?.();
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-border/50 pt-[max(env(safe-area-inset-top,0px)+16px,32px)]">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        {/* Top row: Logo, Title, User Info */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {onBackToHome && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBackToHome}
                className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            )}
            <img 
              src={opodiumLogo} 
              alt="Opodium Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <div>
              <h1 className="font-bold text-foreground leading-tight text-sm sm:text-base">Opodium</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Olympic Podium</p>
            </div>
          </div>

          {/* User Info & Admin */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {isAdmin && onOpenResultsAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenResultsAdmin}
                className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10"
                title="Ergebnisse eintragen (Admin)"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
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
              className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Bottom row: Navigation */}
        <nav className="flex items-center justify-center gap-1 bg-secondary/50 p-1 rounded-lg">
          {/* Events tab - only for non-admin players */}
          {!isAdmin && (
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'events'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Tippen</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Stats</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'results'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Ergebnis</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
