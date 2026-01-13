import React from 'react';
import { usePredictions } from '@/contexts/PredictionContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { olympicEvents } from '@/data/olympicEvents';
import { ruhpoldingEvents } from '@/data/ruhpoldingEvents';
import { Medal, Trophy, Clock, CheckCircle, Lock, User } from 'lucide-react';
import { getFlagFromCode } from '@/lib/countryFlags';

interface ResultsOverviewProps {
  competitionId: string;
}

const ResultsOverview: React.FC<ResultsOverviewProps> = ({ competitionId }) => {
  const { results, predictions, profiles, isEventStarted } = usePredictions();
  const { players, currentPlayer } = usePlayer();
  
  // Get events based on competition
  const events = competitionId === 'ruhpolding-2026' ? ruhpoldingEvents : olympicEvents;
  
  // Get non-admin players for the columns
  const regularPlayers = players.filter(p => !p.is_admin);
  
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    return dateA.getTime() - dateB.getTime();
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getEventStatus = (event: typeof events[0]) => {
    const eventDate = new Date(event.date + 'T' + event.time);
    const now = new Date();
    const hasResult = results[event.id];
    
    if (hasResult) return 'finished';
    if (eventDate < now) return 'started';
    return 'upcoming';
  };

  const getMedalIcon = (position: 'gold' | 'silver' | 'bronze') => {
    const colors = {
      gold: 'text-amber-500',
      silver: 'text-gray-400',
      bronze: 'text-orange-600'
    };
    return <Medal className={`w-4 h-4 ${colors[position]}`} />;
  };

  const getPlayerPrediction = (playerId: string, eventId: number, position: 'gold' | 'silver' | 'bronze') => {
    const prediction = predictions[playerId]?.[eventId];
    return prediction?.[position] || null;
  };

  const isPredictionCorrect = (playerId: string, eventId: number, position: 'gold' | 'silver' | 'bronze') => {
    const result = results[eventId];
    const prediction = predictions[playerId]?.[eventId];
    if (!result || !prediction) return false;
    return prediction[position] === result[position];
  };

  const calculatePlayerEventScore = (playerId: string, eventId: number) => {
    const result = results[eventId];
    const prediction = predictions[playerId]?.[eventId];
    if (!result || !prediction) return 0;
    
    let score = 0;
    if (prediction.gold === result.gold) score += 3;
    if (prediction.silver === result.silver) score += 2;
    if (prediction.bronze === result.bronze) score += 1;
    return score;
  };

  // Render athlete name with flag
  const renderAthlete = (name: string | null, isCorrect?: boolean, isResult?: boolean) => {
    if (!name) return <span className="text-muted-foreground text-xs">—</span>;
    
    // Extract country code if present in format "Name (COD)"
    const match = name.match(/\(([A-Z]{3})\)$/);
    const countryCode = match ? match[1] : null;
    const displayName = countryCode ? name.replace(` (${countryCode})`, '') : name;
    const flag = countryCode ? getFlagFromCode(countryCode) : '';
    
    return (
      <span className={`text-xs flex items-center gap-1 ${
        isResult 
          ? 'font-semibold text-foreground' 
          : isCorrect 
            ? 'text-green-600 font-medium' 
            : 'text-muted-foreground'
      }`}>
        {flag && <span className="text-sm">{flag}</span>}
        <span className="truncate max-w-[100px]" title={displayName}>{displayName}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ergebnisse & Tipps</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Übersicht aller Ergebnisse und Tipps pro Event
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" /> Richtig
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" /> Versteckt
          </span>
        </div>
      </div>

      {/* Events Table - Kicktipp style */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {sortedEvents.map((event) => {
            const status = getEventStatus(event);
            const result = results[event.id];
            const isStarted = isEventStarted(event.id);
            
            return (
              <div key={event.id} className="mb-6 glass-card rounded-xl overflow-hidden">
                {/* Event Header */}
                <div className="bg-secondary/50 px-4 py-3 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        status === 'finished' ? 'bg-green-500/20 text-green-600' :
                        status === 'started' ? 'bg-amber-500/20 text-amber-600' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {status === 'finished' ? <Trophy className="w-4 h-4" /> :
                         status === 'started' ? <Clock className="w-4 h-4" /> :
                         <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {event.discipline} {event.gender}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(event.date)} • {event.time} Uhr
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      status === 'finished' ? 'bg-green-500/10 text-green-600' :
                      status === 'started' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {status === 'finished' ? 'Ergebnis' : status === 'started' ? 'Läuft' : 'Anstehend'}
                    </div>
                  </div>
                </div>

                {/* Results & Predictions Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground w-16">Platz</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground min-w-[140px]">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            Ergebnis
                          </div>
                        </th>
                        {regularPlayers.map((player) => (
                          <th key={player.id} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground min-w-[120px]">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span className={player.id === currentPlayer?.id ? 'text-primary font-semibold' : ''}>
                                {player.name}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(['gold', 'silver', 'bronze'] as const).map((position, idx) => (
                        <tr key={position} className={idx < 2 ? 'border-b border-border/30' : ''}>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              {getMedalIcon(position)}
                              <span className="text-xs text-muted-foreground capitalize">
                                {position === 'gold' ? '1.' : position === 'silver' ? '2.' : '3.'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2 bg-secondary/30">
                            {result ? (
                              renderAthlete(result[position], undefined, true)
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </td>
                          {regularPlayers.map((player) => {
                            const prediction = getPlayerPrediction(player.id, event.id, position);
                            const isCorrect = result && isPredictionCorrect(player.id, event.id, position);
                            const canSee = isStarted || player.id === currentPlayer?.id;
                            
                            return (
                              <td 
                                key={player.id} 
                                className={`px-3 py-2 ${
                                  isCorrect ? 'bg-green-500/10' : ''
                                } ${player.id === currentPlayer?.id ? 'bg-primary/5' : ''}`}
                              >
                                {canSee ? (
                                  prediction ? (
                                    renderAthlete(prediction, isCorrect)
                                  ) : (
                                    <span className="text-muted-foreground text-xs">—</span>
                                  )
                                ) : (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Lock className="w-3 h-3" />
                                    <span className="text-xs">versteckt</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      
                      {/* Score Row */}
                      {result && (
                        <tr className="bg-secondary/20 border-t border-border/50">
                          <td className="px-4 py-2 text-xs font-medium text-muted-foreground" colSpan={2}>
                            Punkte
                          </td>
                          {regularPlayers.map((player) => {
                            const score = calculatePlayerEventScore(player.id, event.id);
                            return (
                              <td 
                                key={player.id} 
                                className={`px-3 py-2 ${player.id === currentPlayer?.id ? 'bg-primary/5' : ''}`}
                              >
                                <span className={`text-sm font-bold ${
                                  score === 6 ? 'text-amber-500' :
                                  score >= 4 ? 'text-green-600' :
                                  score > 0 ? 'text-foreground' :
                                  'text-muted-foreground'
                                }`}>
                                  {score}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card rounded-xl p-4">
        <h4 className="font-medium text-sm text-foreground mb-2">Punktevergabe</h4>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Medal className="w-4 h-4 text-amber-500" /> Gold richtig: 3 Punkte
          </span>
          <span className="flex items-center gap-1">
            <Medal className="w-4 h-4 text-gray-400" /> Silber richtig: 2 Punkte
          </span>
          <span className="flex items-center gap-1">
            <Medal className="w-4 h-4 text-orange-600" /> Bronze richtig: 1 Punkt
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResultsOverview;
