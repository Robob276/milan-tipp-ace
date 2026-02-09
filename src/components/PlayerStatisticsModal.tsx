import React from 'react';
import { usePredictions } from '@/contexts/PredictionContext';
import { olympicEvents } from '@/data/olympicEvents';
import { ruhpoldingEvents } from '@/data/ruhpoldingEvents';
import { Target, Trophy, Flag, TrendingUp, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getFlagFromCode, getFlagFromName } from '@/lib/countryFlags';
import { isPredictionMatch } from '@/lib/medalUtils';

interface PlayerStatisticsModalProps {
  playerId: string;
  playerName: string;
  isOpen: boolean;
  onClose: () => void;
  competitionId: string;
}

const PlayerStatisticsModal: React.FC<PlayerStatisticsModalProps> = ({
  playerId,
  playerName,
  isOpen,
  onClose,
  competitionId
}) => {
  const { predictions, results, calculateScore } = usePredictions();

  // Get events based on competition
  const events = competitionId === 'ruhpolding-2026' ? ruhpoldingEvents : olympicEvents;
  
  // Get player predictions for current competition
  const playerPredictions = predictions[playerId] || {};
  const competitionPredictions = Object.entries(playerPredictions).filter(([eventIdStr]) => {
    const eventId = parseInt(eventIdStr);
    return events.some(e => e.id === eventId);
  });

  // Calculate correct gold predictions
  let correctGoldCount = 0;
  let totalGoldPredictions = 0;
  
  competitionPredictions.forEach(([eventIdStr, prediction]) => {
    const eventId = parseInt(eventIdStr);
    const result = results[eventId];
    if (result) {
      totalGoldPredictions++;
      if (isPredictionMatch(prediction.gold, result.gold)) correctGoldCount++;
    }
  });

  const goldHitRate = totalGoldPredictions > 0 
    ? Math.round((correctGoldCount / totalGoldPredictions) * 100) 
    : 0;

  // Calculate overall hit rate
  let correctPredictions = 0;
  let totalPossiblePredictions = 0;
  
  competitionPredictions.forEach(([eventIdStr, prediction]) => {
    const eventId = parseInt(eventIdStr);
    const result = results[eventId];
    if (result) {
      totalPossiblePredictions += 3;
      if (isPredictionMatch(prediction.gold, result.gold)) correctPredictions++;
      if (isPredictionMatch(prediction.silver, result.silver)) correctPredictions++;
      if (isPredictionMatch(prediction.bronze, result.bronze)) correctPredictions++;
    }
  });
  
  const overallHitRate = totalPossiblePredictions > 0 
    ? Math.round((correctPredictions / totalPossiblePredictions) * 100) 
    : 0;

  // Calculate top 3 countries predicted
  const countryCount: Record<string, number> = {};
  competitionPredictions.forEach(([, prediction]) => {
    // Extract country from athlete name (format: "Name (Country)")
    const extractCountry = (athleteName: string) => {
      const match = athleteName.match(/\(([^)]+)\)$/);
      return match ? match[1] : athleteName;
    };
    
    const goldCountry = extractCountry(prediction.gold);
    const silverCountry = extractCountry(prediction.silver);
    const bronzeCountry = extractCountry(prediction.bronze);
    
    countryCount[goldCountry] = (countryCount[goldCountry] || 0) + 1;
    countryCount[silverCountry] = (countryCount[silverCountry] || 0) + 1;
    countryCount[bronzeCountry] = (countryCount[bronzeCountry] || 0) + 1;
  });

  const topCountries = Object.entries(countryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const score = calculateScore(playerId);
  const totalTipps = competitionPredictions.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Statistiken: {playerName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-xl p-3 text-center">
              <Target className="w-6 h-6 text-gold mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{correctGoldCount}</p>
              <p className="text-xs text-muted-foreground">Richtige Gold-Tipps</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <TrendingUp className="w-6 h-6 text-gold mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{goldHitRate}%</p>
              <p className="text-xs text-muted-foreground">Gold-Trefferquote</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <Trophy className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{score}</p>
              <p className="text-xs text-muted-foreground">Punkte</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <Target className="w-6 h-6 text-accent mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{overallHitRate}%</p>
              <p className="text-xs text-muted-foreground">Trefferquote Gesamt</p>
            </div>
          </div>

          {/* Top Countries */}
          {topCountries.length > 0 && (
            <div className="glass-card rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Flag className="w-4 h-4 text-primary" />
                Top 3 getippte Länder
              </h4>
              <div className="space-y-2">
                {topCountries.map(([country, count], index) => (
                  <div 
                    key={country}
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        index === 0 ? 'gradient-gold text-white' :
                        index === 1 ? 'gradient-silver text-white' :
                        'gradient-bronze text-white'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-lg">{getFlagFromName(country) || getFlagFromCode(country) || '🏳️'}</span>
                      <span className="font-medium text-foreground">{country}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{count}x getippt</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="text-center text-sm text-muted-foreground">
            {totalTipps} Tipps abgegeben
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerStatisticsModal;
