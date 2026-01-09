import React from 'react';
import { Snowflake, Sun, MapPin, Calendar } from 'lucide-react';
import opodiumLogo from '@/assets/opodium-logo.jpeg';

interface OlympicGame {
  id: string;
  year: number;
  season: 'winter' | 'summer';
  city: string;
  country: string;
  dates: string;
  available: boolean;
  emoji: string;
}

const olympicGames: OlympicGame[] = [
  {
    id: 'milano-2026',
    year: 2026,
    season: 'winter',
    city: 'Mailand-Cortina',
    country: 'Italien',
    dates: '6. - 22. Februar 2026',
    available: true,
    emoji: '🇮🇹'
  },
  {
    id: 'la-2028',
    year: 2028,
    season: 'summer',
    city: 'Los Angeles',
    country: 'USA',
    dates: '14. - 30. Juli 2028',
    available: false,
    emoji: '🇺🇸'
  },
  {
    id: 'alps-2030',
    year: 2030,
    season: 'winter',
    city: 'Französische Alpen',
    country: 'Frankreich',
    dates: 'Februar 2030',
    available: false,
    emoji: '🇫🇷'
  },
  {
    id: 'brisbane-2032',
    year: 2032,
    season: 'summer',
    city: 'Brisbane',
    country: 'Australien',
    dates: '23. Juli - 8. August 2032',
    available: false,
    emoji: '🇦🇺'
  }
];

interface HomeScreenProps {
  onSelectGame: (gameId: string) => void;
  onAdminLogin?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectGame, onAdminLogin }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-olympic opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <div className="relative container mx-auto px-4 pt-12 pb-8 text-center">
          <img 
            src={opodiumLogo} 
            alt="Opodium Logo" 
            className="w-32 h-32 object-contain mb-4 animate-fade-in"
          />
          
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1 animate-fade-in">
            Opodium
          </h1>
          <p className="text-xl text-muted-foreground mb-3 animate-fade-in">
            Olympisches Tippspiel
          </p>
          <p className="text-muted-foreground text-base max-w-md mx-auto animate-fade-in">
            Wähle ein Turnier und tippe auf deine Favoriten
          </p>
          
          {/* Olympic Rings */}
          <div className="flex justify-center gap-1 mt-6 animate-fade-in">
            <div className="w-6 h-6 rounded-full border-2 border-olympic-blue" />
            <div className="w-6 h-6 rounded-full border-2 border-foreground -ml-2" />
            <div className="w-6 h-6 rounded-full border-2 border-olympic-red -ml-2" />
            <div className="w-6 h-6 rounded-full border-2 border-olympic-yellow -ml-2 mt-2" />
            <div className="w-6 h-6 rounded-full border-2 border-olympic-green -ml-2 mt-2" />
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="container mx-auto px-4 pb-12 -mt-2">
        <div className="grid gap-4 max-w-2xl mx-auto">
          {olympicGames.map((game, index) => (
            <button
              key={game.id}
              onClick={() => game.available && onSelectGame(game.id)}
              disabled={!game.available}
              className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 animate-fade-in ${
                game.available
                  ? 'glass-card hover:scale-[1.02] hover:shadow-xl cursor-pointer'
                  : 'bg-secondary/30 opacity-60 cursor-not-allowed'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Season Indicator */}
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-20 ${
                game.season === 'winter' ? 'bg-blue-400' : 'bg-orange-400'
              }`} />
              
              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                  game.season === 'winter' 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-400' 
                    : 'bg-gradient-to-br from-orange-500 to-yellow-400'
                }`}>
                  {game.season === 'winter' 
                    ? <Snowflake className="w-7 h-7 text-white" />
                    : <Sun className="w-7 h-7 text-white" />
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{game.emoji}</span>
                    <h3 className="text-xl font-bold text-foreground">
                      {game.season === 'winter' ? 'Winterspiele' : 'Sommerspiele'} {game.year}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{game.city}, {game.country}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{game.dates}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {game.available ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                      Aktiv
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      Bald
                    </span>
                  )}
                </div>
              </div>

              {/* Hover Arrow */}
              {game.available && (
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Admin Login Button */}
        {onAdminLogin && (
          <div className="text-center mt-8">
            <button
              onClick={onAdminLogin}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Admin-Login
            </button>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Weitere Turniere werden freigeschaltet, sobald sie verfügbar sind.
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
