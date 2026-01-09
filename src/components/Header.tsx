import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Medal, LogOut, Trophy, Calendar, BarChart3, Home, Settings, MessageCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'events' | 'leaderboard' | 'stats' | 'chat';
  setActiveTab: (tab: 'events' | 'leaderboard' | 'stats' | 'chat') => void;
  onBackToHome?: () => void;
  onOpenResultsAdmin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onBackToHome, onOpenResultsAdmin }) => {
  const { user, displayName, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
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
            <div className="w-10 h-10 rounded-full gradient-olympic flex items-center justify-center shadow-md">
              <Medal className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-foreground leading-tight">Olympia 2026</h1>
              <p className="text-xs text-muted-foreground">Mailand-Cortina</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'events'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Events</span>
            </button>
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
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
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
              <p className="text-sm font-medium text-foreground">{displayName || user?.email}</p>
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
