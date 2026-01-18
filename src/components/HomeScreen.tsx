import React from 'react';
import { Snowflake, Sun, MapPin, Calendar, Target, ChevronRight } from 'lucide-react';
import opodiumLogo from '@/assets/opodium-logo.jpeg';

interface Competition {
  id: string;
  type: 'worldcup' | 'olympics';
  name: string;
  year: number;
  season: 'winter' | 'summer';
  city: string;
  country: string;
  dates: string;
  available: boolean;
  archived?: boolean;
  emoji: string;
}

const competitions: Competition[] = [
  {
    id: 'milano-2026',
    type: 'olympics',
    name: 'Winterspiele',
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
    type: 'olympics',
    name: 'Sommerspiele',
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
    type: 'olympics',
    name: 'Winterspiele',
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
    type: 'olympics',
    name: 'Sommerspiele',
    year: 2032,
    season: 'summer',
    city: 'Brisbane',
    country: 'Australien',
    dates: '23. Juli - 8. August 2032',
    available: false,
    emoji: '🇦🇺'
  },
  {
    id: 'ruhpolding-2026',
    type: 'worldcup',
    name: 'Biathlon Weltcup',
    year: 2026,
    season: 'winter',
    city: 'Ruhpolding',
    country: 'Deutschland',
    dates: '14. - 18. Januar 2026',
    available: true,
    archived: true,
    emoji: '🇩🇪'
  }
];

interface HomeScreenProps {
  onSelectGame: (gameId: string, isArchived?: boolean) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectGame }) => {

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section - Minimal */}
      <div className="flex flex-col items-center justify-center pt-16 pb-10">
        <img 
          src={opodiumLogo} 
          alt="Opodium Logo" 
          className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-3xl shadow-2xl animate-fade-in"
        />
      </div>

      {/* Competitions Grid */}
      <div className="container mx-auto px-4 pb-12 -mt-2">
        <div className="grid gap-4 max-w-2xl mx-auto">
          {competitions.map((comp, index) => (
            <button
              key={comp.id}
              onClick={() => comp.available && onSelectGame(comp.id, comp.archived)}
              disabled={!comp.available}
              className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 animate-fade-in ${
                comp.available
                  ? 'glass-card hover:scale-[1.02] hover:shadow-xl cursor-pointer'
                  : 'bg-secondary/30 opacity-60 cursor-not-allowed'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Season Indicator */}
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-20 ${
                comp.season === 'winter' ? 'bg-blue-400' : 'bg-orange-400'
              }`} />
              
              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                  comp.type === 'worldcup'
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-400'
                    : comp.season === 'winter' 
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-400' 
                      : 'bg-gradient-to-br from-orange-500 to-yellow-400'
                }`}>
                  {comp.type === 'worldcup' 
                    ? <Target className="w-7 h-7 text-white" />
                    : comp.season === 'winter' 
                      ? <Snowflake className="w-7 h-7 text-white" />
                      : <Sun className="w-7 h-7 text-white" />
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{comp.emoji}</span>
                    <h3 className="text-xl font-bold text-foreground">
                      {comp.name} {comp.year}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{comp.city}, {comp.country}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{comp.dates}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {comp.archived ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      Archiviert
                    </span>
                  ) : comp.available ? (
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
              {comp.available && (
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


        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Weitere Turniere werden freigeschaltet, sobald sie verfügbar sind.
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
