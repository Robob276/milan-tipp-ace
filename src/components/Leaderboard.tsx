import React from 'react';
import { usePredictions } from '@/contexts/PredictionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Medal, TrendingUp } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const { getLeaderboard, predictions } = usePredictions();
  const { currentUser } = useAuth();
  const leaderboard = getLeaderboard();

  const getMedalStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'gradient-gold text-white shadow-lg';
      case 1:
        return 'gradient-silver text-white';
      case 2:
        return 'gradient-bronze text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5" />;
      case 1:
        return <Medal className="w-5 h-5" />;
      case 2:
        return <Medal className="w-5 h-5" />;
      default:
        return <span className="text-sm font-bold">{index + 1}</span>;
    }
  };

  const getTippCount = (userId: number) => {
    return Object.keys(predictions[userId] || {}).length;
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="glass-card rounded-2xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-olympic mb-4">
          <Trophy className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Rangliste</h2>
        <p className="text-muted-foreground mt-2">Wer wird Olympia-Tippmeister 2026?</p>
      </div>

      {/* Leaderboard */}
      <div className="glass-card rounded-xl overflow-hidden">
        {leaderboard.map((player, index) => (
          <div
            key={player.userId}
            className={`flex items-center gap-4 p-4 border-b border-border/50 last:border-b-0 transition-all ${
              player.userId === currentUser?.id ? 'bg-primary/5' : ''
            }`}
          >
            {/* Rank */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getMedalStyle(index)}`}>
              {getMedalIcon(index)}
            </div>

            {/* Player Info */}
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {player.name}
                {player.userId === currentUser?.id && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Du
                  </span>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {getTippCount(player.userId)} Tipps abgegeben
              </p>
            </div>

            {/* Score */}
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{player.score}</p>
              <p className="text-xs text-muted-foreground">Punkte</p>
            </div>
          </div>
        ))}
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
