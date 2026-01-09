import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePredictions } from '@/contexts/PredictionContext';
import { olympicEvents, sportCategories } from '@/data/olympicEvents';
import { BarChart3, Target, Trophy, Users, TrendingUp, PieChart } from 'lucide-react';

const Statistics: React.FC = () => {
  const { user } = useAuth();
  const { predictions, profiles, calculateScore } = usePredictions();

  // Calculate statistics
  const userPredictions = user ? predictions[user.id] || {} : {};
  const totalTipps = Object.keys(userPredictions).length;
  const totalEvents = olympicEvents.length;
  const completionRate = Math.round((totalTipps / totalEvents) * 100);
  const myScore = user ? calculateScore(user.id) : 0;
  const totalPlayers = Object.keys(profiles).length;

  // Most picked countries
  const countryPicks: Record<string, number> = {};
  Object.values(predictions).forEach(userPreds => {
    Object.values(userPreds).forEach(pred => {
      countryPicks[pred.gold] = (countryPicks[pred.gold] || 0) + 3;
      countryPicks[pred.silver] = (countryPicks[pred.silver] || 0) + 2;
      countryPicks[pred.bronze] = (countryPicks[pred.bronze] || 0) + 1;
    });
  });

  const topCountries = Object.entries(countryPicks)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Category stats for current user
  const categoryStats = sportCategories.slice(1).map(category => {
    const categoryEvents = olympicEvents.filter(e => e.category === category);
    const tippedCount = categoryEvents.filter(e => userPredictions[e.id]).length;
    return {
      name: category,
      total: categoryEvents.length,
      tipped: tippedCount,
      percentage: categoryEvents.length > 0 ? Math.round((tippedCount / categoryEvents.length) * 100) : 0
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-olympic mb-4">
          <BarChart3 className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Statistiken</h2>
        <p className="text-muted-foreground mt-2">Deine Tippübersicht im Detail</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <Target className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalTipps}</p>
          <p className="text-sm text-muted-foreground">Tipps abgegeben</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <PieChart className="w-8 h-8 text-accent mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
          <p className="text-sm text-muted-foreground">Vollständigkeit</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Trophy className="w-8 h-8 text-gold mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{myScore}</p>
          <p className="text-sm text-muted-foreground">Deine Punkte</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalPlayers}</p>
          <p className="text-sm text-muted-foreground">Spieler</p>
        </div>
      </div>

      {/* Progress by Category */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Fortschritt nach Sportart
        </h3>
        <div className="space-y-4">
          {categoryStats.map(stat => (
            <div key={stat.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-foreground">{stat.name}</span>
                <span className="text-muted-foreground">{stat.tipped}/{stat.total}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-olympic transition-all duration-500"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Countries */}
      {topCountries.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold" />
            Meistgetippte Länder (alle Spieler)
          </h3>
          <div className="space-y-3">
            {topCountries.map(([country, points], index) => (
              <div key={country} className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'gradient-gold text-white' :
                  index === 1 ? 'gradient-silver text-white' :
                  index === 2 ? 'gradient-bronze text-white' :
                  'bg-secondary text-secondary-foreground'
                }`}>
                  {index + 1}
                </span>
                <span className="flex-1 font-medium text-foreground">{country}</span>
                <span className="text-sm text-muted-foreground">{points} Punkte</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Timeline Info */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-3">📅 Event-Übersicht</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Erster Wettkampf</p>
            <p className="font-medium text-foreground">6. Februar 2026</p>
          </div>
          <div>
            <p className="text-muted-foreground">Letzter Wettkampf</p>
            <p className="font-medium text-foreground">22. Februar 2026</p>
          </div>
          <div>
            <p className="text-muted-foreground">Anzahl Sportarten</p>
            <p className="font-medium text-foreground">16 Sportarten</p>
          </div>
          <div>
            <p className="text-muted-foreground">Medaillenentscheidungen</p>
            <p className="font-medium text-foreground">{totalEvents} Events</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
