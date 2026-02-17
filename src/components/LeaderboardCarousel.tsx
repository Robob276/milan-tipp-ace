import React, { useState, useMemo } from 'react';
import { Trophy, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { usePredictions } from '@/contexts/PredictionContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { olympicEvents } from '@/data/olympicEvents';
import { getPlayerFlag, isImageFlag } from '@/lib/playerFlags';
import { calculateEventScore, isPredictionMatch } from '@/lib/medalUtils';

interface LeaderboardCarouselProps {
  competitionId: string;
  onPlayerClick: (player: { id: string; name: string }) => void;
}

const COMPETITION_DAYS = [
  '2026-02-07',
  '2026-02-08',
  '2026-02-09',
  '2026-02-10',
  '2026-02-11',
  '2026-02-12',
  '2026-02-13',
  '2026-02-14',
  '2026-02-15',
  '2026-02-16',
  '2026-02-17',
];

const formatDateShort = (dateStr: string) => {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
};

type ViewMode = 'current' | 'cumulative' | 'daily';

const LeaderboardCarousel: React.FC<LeaderboardCarouselProps> = ({ competitionId, onPlayerClick }) => {
  const { currentPlayer } = usePlayer();
  const { predictions, profiles, results } = usePredictions();

  // Views: daily days (0-6), cumulative days (7-13), current (14)
  // Navigate: left = earlier, right = later/current
  const totalSlides = COMPETITION_DAYS.length * 2 + 1; // 7 daily + 7 cumulative + 1 current
  const [slideIndex, setSlideIndex] = useState(totalSlides - 1); // Start at "current"

  const getViewInfo = (index: number): { mode: ViewMode; dayIndex?: number; label: string; subtitle: string } => {
    if (index === totalSlides - 1) {
      return { mode: 'current', label: 'Aktuelle Rangliste', subtitle: 'Gesamtstand' };
    }
    if (index >= COMPETITION_DAYS.length) {
      // Cumulative: index 7-13
      const dayIdx = index - COMPETITION_DAYS.length;
      return {
        mode: 'cumulative',
        dayIndex: dayIdx,
        label: `Stand nach ${formatDateShort(COMPETITION_DAYS[dayIdx])}`,
        subtitle: 'Kumuliert',
      };
    }
    // Daily: index 0-6
    return {
      mode: 'daily',
      dayIndex: index,
      label: `Tageswertung ${formatDateShort(COMPETITION_DAYS[index])}`,
      subtitle: 'Nur dieser Tag',
    };
  };

  const calculateLeaderboard = useMemo(() => {
    return (mode: ViewMode, dayIndex?: number) => {
      const playerIds = Object.keys(profiles);

      const getPlayerStats = (playerId: string) => {
        const playerPredictions = predictions[playerId] || {};
        let score = 0;
        let correctGold = 0;
        let correctSilver = 0;
        let correctBronze = 0;

        Object.entries(playerPredictions).forEach(([eventIdStr, prediction]) => {
          const eventId = Number(eventIdStr);
          const event = olympicEvents.find(e => e.id === eventId);
          if (!event) return;

          const result = results[eventId];
          if (!result) return;

          let include = false;
          if (mode === 'current') {
            include = true;
          } else if (mode === 'cumulative' && dayIndex !== undefined) {
            include = event.date <= COMPETITION_DAYS[dayIndex];
          } else if (mode === 'daily' && dayIndex !== undefined) {
            include = event.date === COMPETITION_DAYS[dayIndex];
          }

          if (include) {
            score += calculateEventScore(prediction, result);
            if (isPredictionMatch(prediction.gold, result.gold)) correctGold++;
            if (isPredictionMatch(prediction.silver, result.silver)) correctSilver++;
            if (isPredictionMatch(prediction.bronze, result.bronze)) correctBronze++;
          }
        });

        return { score, correctGold, correctSilver, correctBronze };
      };

      const entries = playerIds
        .map(playerId => {
          const stats = getPlayerStats(playerId);
          return {
            playerId,
            name: profiles[playerId],
            ...stats,
          };
        })
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          if (b.correctGold !== a.correctGold) return b.correctGold - a.correctGold;
          if (b.correctSilver !== a.correctSilver) return b.correctSilver - a.correctSilver;
          return b.correctBronze - a.correctBronze;
        });

      // Assign ranks (same rank for truly equal players)
      return entries.map((entry, idx) => {
        let rank = idx + 1;
        if (idx > 0) {
          const prev = entries[idx - 1];
          if (
            entry.score === prev.score &&
            entry.correctGold === prev.correctGold &&
            entry.correctSilver === prev.correctSilver &&
            entry.correctBronze === prev.correctBronze
          ) {
            rank = (entries as any)[idx - 1]._rank;
          }
        }
        (entry as any)._rank = rank;
        return { ...entry, rank };
      });
    };
  }, [predictions, profiles, results]);

  // Calculate daily podium finishes per player (how often 1st, 2nd, 3rd in daily standings)
  const dailyPodiums = useMemo(() => {
    const podiums: Record<string, { first: number; second: number; third: number }> = {};
    const playerIds = Object.keys(profiles);
    playerIds.forEach(id => { podiums[id] = { first: 0, second: 0, third: 0 }; });

    COMPETITION_DAYS.forEach((_, dayIdx) => {
      const dayBoard = calculateLeaderboard('daily', dayIdx);
      // Only count if at least one player scored > 0 (day has results)
      if (dayBoard.every(p => p.score === 0)) return;
      dayBoard.forEach(p => {
        if (p.rank === 1) podiums[p.playerId].first++;
        else if (p.rank === 2) podiums[p.playerId].second++;
        else if (p.rank === 3) podiums[p.playerId].third++;
      });
    });
    return podiums;
  }, [calculateLeaderboard, profiles]);

  const viewInfo = getViewInfo(slideIndex);
  const leaderboard = calculateLeaderboard(viewInfo.mode, viewInfo.dayIndex);

  const goLeft = () => setSlideIndex(prev => Math.max(0, prev - 1));
  const goRight = () => setSlideIndex(prev => Math.min(totalSlides - 1, prev + 1));

  return (
    <div className="glass-card rounded-xl p-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-1">
        <button
          onClick={goLeft}
          disabled={slideIndex === 0}
          className="p-2 rounded-lg hover:bg-primary/10 disabled:opacity-20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>

        <div className="text-center flex-1">
          <h3 className="font-semibold text-foreground flex items-center justify-center gap-2">
            {viewInfo.mode === 'current' ? (
              <Trophy className="w-5 h-5 text-primary" />
            ) : (
              <Calendar className="w-5 h-5 text-primary" />
            )}
            {viewInfo.label}
          </h3>
          <p className="text-xs text-muted-foreground">{viewInfo.subtitle}</p>
        </div>

        <button
          onClick={goRight}
          disabled={slideIndex === totalSlides - 1}
          className="p-2 rounded-lg hover:bg-primary/10 disabled:opacity-20 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1 mb-4">
        {/* Daily dots */}
        <div className="flex gap-0.5">
          {COMPETITION_DAYS.map((_, i) => (
            <button
              key={`d-${i}`}
              onClick={() => setSlideIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                slideIndex === i ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
        <div className="w-px h-3 bg-muted-foreground/20 mx-1" />
        {/* Cumulative dots */}
        <div className="flex gap-0.5">
          {COMPETITION_DAYS.map((_, i) => (
            <button
              key={`c-${i}`}
              onClick={() => setSlideIndex(COMPETITION_DAYS.length + i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                slideIndex === COMPETITION_DAYS.length + i ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
        <div className="w-px h-3 bg-muted-foreground/20 mx-1" />
        {/* Current dot */}
        <button
          onClick={() => setSlideIndex(totalSlides - 1)}
          className={`w-2 h-2 rounded-full transition-colors ${
            slideIndex === totalSlides - 1 ? 'bg-primary' : 'bg-muted-foreground/30'
          }`}
        />
      </div>

      {/* Player click hint */}
      <p className="text-xs text-muted-foreground mb-3">Klicke auf einen Spieler für Details</p>

      {/* Leaderboard list */}
      <div className="space-y-2">
        {leaderboard.map((player, index) => {
          const isCurrentUser = player.playerId === currentPlayer?.id;
          return (
            <div
              key={player.playerId}
              onClick={() => onPlayerClick({ id: player.playerId, name: player.name })}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer hover:bg-primary/5 ${
                isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  player.rank === 1 ? 'gradient-gold text-white' :
                  player.rank === 2 ? 'gradient-silver text-white' :
                  player.rank === 3 ? 'gradient-bronze text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {player.rank}
                </span>
                <span className="font-medium text-foreground flex items-center">
                  {getPlayerFlag(player.name) && (
                    isImageFlag(getPlayerFlag(player.name)) ? (
                      <img
                        src={getPlayerFlag(player.name)}
                        alt="flag"
                        className="w-6 h-4 mr-1.5 object-contain"
                      />
                    ) : (
                      <span className="mr-1.5">{getPlayerFlag(player.name)}</span>
                    )
                  )}
                  {player.name}
                  {isCurrentUser && <span className="ml-1 text-xs text-muted-foreground">(Du)</span>}
                </span>
                {viewInfo.mode === 'current' && dailyPodiums[player.playerId] && (
                  (() => {
                    const p = dailyPodiums[player.playerId];
                    if (p.first === 0 && p.second === 0 && p.third === 0) return null;
                    return (
                      <span className="flex items-center gap-1 ml-2 shrink-0">
                        {p.first > 0 && <span className="inline-flex items-center text-gold text-xs"><Trophy className="w-3 h-3 mr-px" />{p.first}</span>}
                        {p.second > 0 && <span className="inline-flex items-center text-silver text-xs"><Trophy className="w-3 h-3 mr-px" />{p.second}</span>}
                        {p.third > 0 && <span className="inline-flex items-center text-bronze text-xs"><Trophy className="w-3 h-3 mr-px" />{p.third}</span>}
                      </span>
                    );
                  })()
                )}
              </div>
              <div className="flex items-center gap-2">
                {(player.correctGold > 0 || player.correctSilver > 0 || player.correctBronze > 0) && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {player.correctGold > 0 && <span>🥇{player.correctGold}</span>}
                    {player.correctSilver > 0 && <span>🥈{player.correctSilver}</span>}
                    {player.correctBronze > 0 && <span>🥉{player.correctBronze}</span>}
                  </span>
                )}
                <span className="text-xl font-bold text-foreground min-w-[2rem] text-right">{player.score}</span>
              </div>
            </div>
          );
        })}
        {leaderboard.length === 0 && (
          <p className="text-center text-muted-foreground py-4">Noch keine Spieler registriert</p>
        )}
      </div>
    </div>
  );
};

export default LeaderboardCarousel;
