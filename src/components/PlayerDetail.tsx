import React from 'react';
import { usePredictions } from '@/contexts/PredictionContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { olympicEvents, sportIcons } from '@/data/olympicEvents';
import { ArrowLeft, Trophy, Medal, Check, X, Calendar, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface PlayerDetailProps {
  odplayerId: string;
  onBack: () => void;
}

const PlayerDetail: React.FC<PlayerDetailProps> = ({ odplayerId, onBack }) => {
  const { predictions, results, profiles, calculateScore, isEventStarted, getVisiblePrediction } = usePredictions();
  const { currentPlayer } = usePlayer();
  const displayName = profiles[odplayerId] || 'Unbekannt';
  const userPredictions = predictions[odplayerId] || {};
  const score = calculateScore(odplayerId);
  const isOwnProfile = currentPlayer?.id === odplayerId;

  const getEventPredictions = () => {
    return Object.entries(userPredictions).map(([eventIdStr, prediction]) => {
      const eventId = Number(eventIdStr);
      const event = olympicEvents.find(e => e.id === eventId);
      const result = results[eventId];
      
      if (!event) return null;

      // Only show prediction details if event has started or it's the user's own profile
      const canSeePrediction = isEventStarted(eventId) || isOwnProfile;
      
      if (!canSeePrediction) {
        return {
          event,
          prediction: null,
          result,
          points: 0,
          hasResult: !!result,
          hidden: true
        };
      }

      let points = 0;
      if (result) {
        if (prediction.gold === result.gold) points += 3;
        if (prediction.silver === result.silver) points += 2;
        if (prediction.bronze === result.bronze) points += 1;
      }

      return {
        event,
        prediction,
        result,
        points,
        hasResult: !!result,
        hidden: false
      };
    }).filter(Boolean).sort((a, b) => {
      const dateA = new Date(a!.event.date);
      const dateB = new Date(b!.event.date);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const eventPredictions = getEventPredictions();

  const stats = {
    totalPredictions: eventPredictions.length,
    eventsWithResults: eventPredictions.filter(p => p?.hasResult).length,
    correctGold: eventPredictions.filter(p => p?.hasResult && p?.prediction.gold === p?.result?.gold).length,
    correctSilver: eventPredictions.filter(p => p?.hasResult && p?.prediction.silver === p?.result?.silver).length,
    correctBronze: eventPredictions.filter(p => p?.hasResult && p?.prediction.bronze === p?.result?.bronze).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Rangliste
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-olympic flex items-center justify-center">
            <Trophy className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{displayName}</h2>
            <p className="text-muted-foreground">
              {eventPredictions.length} Tipps abgegeben • {score} Punkte
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-full gradient-gold mx-auto mb-2 flex items-center justify-center text-white font-bold">
            {stats.correctGold}
          </div>
          <p className="text-sm text-muted-foreground">Gold richtig</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-full gradient-silver mx-auto mb-2 flex items-center justify-center text-white font-bold">
            {stats.correctSilver}
          </div>
          <p className="text-sm text-muted-foreground">Silber richtig</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-full gradient-bronze mx-auto mb-2 flex items-center justify-center text-white font-bold">
            {stats.correctBronze}
          </div>
          <p className="text-sm text-muted-foreground">Bronze richtig</p>
        </div>
      </div>

      {/* Predictions List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-secondary/30">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Alle Tipps ({eventPredictions.length})
          </h3>
        </div>
        
        {eventPredictions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Noch keine Tipps abgegeben
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {eventPredictions.map((item) => {
              if (!item) return null;
              const { event, prediction, result, points, hasResult } = item;
              
              return (
                <div key={event.id} className="p-4">
                  {/* Event Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{sportIcons[event.sport] || '🏅'}</span>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {event.sport} - {event.discipline}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.gender} • {format(new Date(event.date), 'dd. MMM yyyy', { locale: de })}
                      </p>
                    </div>
                    {item.hidden ? (
                      <div className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Versteckt
                      </div>
                    ) : hasResult && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        points > 0 
                          ? 'bg-green-500/10 text-green-600' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        +{points} Pkt
                      </div>
                    )}
                  </div>

                  {/* Predictions Grid - only show if not hidden */}
                  {item.hidden ? (
                    <div className="p-4 bg-muted/30 rounded-lg text-center text-muted-foreground text-sm">
                      Tipps werden sichtbar, wenn das Event startet
                    </div>
                  ) : prediction && (
                    <div className="grid grid-cols-3 gap-2">
                      {/* Gold */}
                      <div className={`p-3 rounded-lg ${
                        hasResult 
                          ? prediction.gold === result?.gold 
                            ? 'bg-green-500/10 border border-green-500/30' 
                            : 'bg-red-500/5 border border-red-500/20'
                          : 'bg-gold/5 border border-gold/20'
                      }`}>
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-4 h-4 rounded-full gradient-gold" />
                          <span className="text-xs font-medium text-muted-foreground">Gold</span>
                          {hasResult && (
                            prediction.gold === result?.gold 
                              ? <Check className="w-3 h-3 text-green-500 ml-auto" />
                              : <X className="w-3 h-3 text-red-400 ml-auto" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">{prediction.gold}</p>
                        {hasResult && prediction.gold !== result?.gold && (
                          <p className="text-xs text-green-600 mt-1">→ {result?.gold}</p>
                        )}
                      </div>

                      {/* Silver */}
                      <div className={`p-3 rounded-lg ${
                        hasResult 
                          ? prediction.silver === result?.silver 
                            ? 'bg-green-500/10 border border-green-500/30' 
                            : 'bg-red-500/5 border border-red-500/20'
                          : 'bg-silver/5 border border-silver/20'
                      }`}>
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-4 h-4 rounded-full gradient-silver" />
                          <span className="text-xs font-medium text-muted-foreground">Silber</span>
                          {hasResult && (
                            prediction.silver === result?.silver 
                              ? <Check className="w-3 h-3 text-green-500 ml-auto" />
                              : <X className="w-3 h-3 text-red-400 ml-auto" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">{prediction.silver}</p>
                        {hasResult && prediction.silver !== result?.silver && (
                          <p className="text-xs text-green-600 mt-1">→ {result?.silver}</p>
                        )}
                      </div>

                      {/* Bronze */}
                      <div className={`p-3 rounded-lg ${
                        hasResult 
                          ? prediction.bronze === result?.bronze 
                            ? 'bg-green-500/10 border border-green-500/30' 
                            : 'bg-red-500/5 border border-red-500/20'
                          : 'bg-bronze/5 border border-bronze/20'
                      }`}>
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-4 h-4 rounded-full gradient-bronze" />
                          <span className="text-xs font-medium text-muted-foreground">Bronze</span>
                          {hasResult && (
                            prediction.bronze === result?.bronze 
                              ? <Check className="w-3 h-3 text-green-500 ml-auto" />
                              : <X className="w-3 h-3 text-red-400 ml-auto" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">{prediction.bronze}</p>
                        {hasResult && prediction.bronze !== result?.bronze && (
                          <p className="text-xs text-green-600 mt-1">→ {result?.bronze}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDetail;
