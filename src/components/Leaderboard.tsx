import React, { useState } from 'react';
import { usePredictions } from '@/contexts/PredictionContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { olympicEvents } from '@/data/olympicEvents';
import { Trophy, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlayerDetail from './PlayerDetail';

const Leaderboard: React.FC = () => {
  const { getLeaderboard, predictions, results } = usePredictions();
  const { currentPlayer } = usePlayer();
  const leaderboard = getLeaderboard();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [eventPage, setEventPage] = useState(0);
  const eventsPerPage = 3;

  // Get events that have results
  const eventsWithResults = olympicEvents.filter(e => results[e.id]);
  const totalPages = Math.ceil(eventsWithResults.length / eventsPerPage);
  const displayedEvents = eventsWithResults.slice(eventPage * eventsPerPage, (eventPage + 1) * eventsPerPage);

  const getTippCount = (userId: string) => {
    return Object.keys(predictions[userId] || {}).length;
  };

  const getEventScore = (userId: string, eventId: number): number => {
    const prediction = predictions[userId]?.[eventId];
    const result = results[eventId];
    if (!prediction || !result) return 0;
    
    let score = 0;
    if (prediction.gold === result.gold) score += 3;
    if (prediction.silver === result.silver) score += 2;
    if (prediction.bronze === result.bronze) score += 1;
    return score;
  };

  const getPositionChange = (userId: string): number => {
    // This would need historical data to calculate properly
    // For now, return 0 (no change)
    return 0;
  };

  const getPositionIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  // Show player detail view if a player is selected
  if (selectedPlayerId !== null) {
    return <PlayerDetail odplayerId={selectedPlayerId} onBack={() => setSelectedPlayerId(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="glass-card rounded-2xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-olympic mb-4">
          <Trophy className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Tippübersicht</h2>
        <p className="text-muted-foreground mt-2">Wer wird Olympia-Tippmeister 2026?</p>
      </div>

      {/* Kicktipp-style Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {/* Table Header with Event Navigation */}
        {eventsWithResults.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border/50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEventPage(Math.max(0, eventPage - 1))}
              disabled={eventPage === 0}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2 text-xs text-muted-foreground">
              {displayedEvents.map(event => (
                <div key={event.id} className="text-center min-w-[50px]">
                  <div className="font-medium text-foreground">{event.discipline.slice(0, 6)}</div>
                  <div className="text-[10px]">{event.gender.slice(0, 1)}</div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEventPage(Math.min(totalPages - 1, eventPage + 1))}
              disabled={eventPage >= totalPages - 1}
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground w-12">Pos</th>
                <th className="text-center py-3 px-1 text-xs font-medium text-muted-foreground w-8">+/-</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Name</th>
                {displayedEvents.map(event => (
                  <th key={event.id} className="text-center py-3 px-2 text-xs font-medium text-muted-foreground min-w-[40px]">
                    -:-
                  </th>
                ))}
                <th className="text-center py-3 px-2 text-xs font-medium text-muted-foreground w-10">T</th>
                <th className="text-right py-3 px-3 text-xs font-medium text-muted-foreground w-14">Ges</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => {
                const isCurrentUser = player.playerId === currentPlayer?.id;
                const positionChange = getPositionChange(player.playerId);
                
                return (
                  <tr
                    key={player.playerId}
                    onClick={() => setSelectedPlayerId(player.playerId)}
                    className={`border-b border-border/30 last:border-b-0 cursor-pointer transition-colors hover:bg-secondary/30 ${
                      isCurrentUser ? 'bg-gold/20' : ''
                    }`}
                  >
                    {/* Position */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        index === 0 ? 'gradient-gold text-white' :
                        index === 1 ? 'gradient-silver text-white' :
                        index === 2 ? 'gradient-bronze text-white' :
                        'bg-secondary text-secondary-foreground'
                      }`}>
                        {index + 1}
                      </span>
                    </td>

                    {/* Position Change */}
                    <td className="py-3 px-1 text-center">
                      {getPositionIcon(positionChange)}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-3">
                      <span className="font-medium text-foreground">
                        {player.name}
                        {isCurrentUser && (
                          <span className="ml-1 text-xs text-muted-foreground">(Du)</span>
                        )}
                      </span>
                    </td>

                    {/* Event Scores */}
                    {displayedEvents.map(event => {
                      const score = getEventScore(player.playerId, event.id);
                      const hasPrediction = predictions[player.playerId]?.[event.id];
                      
                      return (
                        <td key={event.id} className="py-3 px-2 text-center">
                          {hasPrediction ? (
                            <span className={`text-sm font-medium ${
                              score >= 5 ? 'text-green-600 font-bold' :
                              score >= 3 ? 'text-primary font-semibold' :
                              score > 0 ? 'text-foreground' :
                              'text-muted-foreground'
                            }`}>
                              {score}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">-:-</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Tips Count */}
                    <td className="py-3 px-2 text-center text-sm text-muted-foreground">
                      {getTippCount(player.playerId)}
                    </td>

                    {/* Total Score */}
                    <td className="py-3 px-3 text-right">
                      <span className="text-lg font-bold text-foreground">{player.score}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            Noch keine Spieler registriert
          </div>
        )}
      </div>

      {/* Scoring Info */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Punktevergabe
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-gold/10">
            <div className="w-8 h-8 rounded-full gradient-gold mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <p className="text-sm font-medium text-foreground">Gold</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-silver/10">
            <div className="w-8 h-8 rounded-full gradient-silver mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <p className="text-sm font-medium text-foreground">Silber</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-bronze/10">
            <div className="w-8 h-8 rounded-full gradient-bronze mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <p className="text-sm font-medium text-foreground">Bronze</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
