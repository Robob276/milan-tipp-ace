import React from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { usePredictions } from '@/contexts/PredictionContext';
import { olympicEvents } from '@/data/olympicEvents';
import { ruhpoldingEvents } from '@/data/ruhpoldingEvents';
import { BarChart3, Target, Trophy, Users, PieChart, Medal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Historische Daten seit 2016
const allTimeMedalStandings = [
  { name: 'Robert B', gold: 2, silver: 2, bronze: 1, participations: 5 },
  { name: 'Marcus G', gold: 2, silver: 1, bronze: 0, participations: 3 },
  { name: 'Marcel K', gold: 1, silver: 1, bronze: 2, participations: 5 },
  { name: 'Marcus B', gold: 0, silver: 1, bronze: 2, participations: 4 },
  { name: 'Sebastian S', gold: 0, silver: 0, bronze: 0, participations: 5 },
  { name: 'Domi N', gold: 0, silver: 0, bronze: 0, participations: 2 },
].sort((a, b) => {
  if (b.gold !== a.gold) return b.gold - a.gold;
  if (b.silver !== a.silver) return b.silver - a.silver;
  return b.bronze - a.bronze;
});

// Jahres-Ergebnisse
const yearlyResults = [
  {
    year: 2024,
    name: 'Paris 2024',
    type: 'Sommer',
    results: [
      { place: 1, name: 'Robert B' },
      { place: 2, name: 'Marcel K' },
      { place: 3, name: 'Marcus B' },
      { place: 4, name: 'Sebastian S' },
    ]
  },
  {
    year: 2022,
    name: 'Peking 2022',
    type: 'Winter',
    results: [
      { place: 1, name: 'Marcel K' },
      { place: 2, name: 'Robert B' },
      { place: 3, name: 'Marcus B' },
      { place: 4, name: 'Sebastian S' },
    ]
  },
  {
    year: 2021,
    name: 'Tokio 2020',
    type: 'Sommer',
    results: [
      { place: 1, name: 'Robert B' },
      { place: 2, name: 'Marcus G' },
      { place: 3, name: 'Marcel K' },
      { place: 4, name: 'Sebastian S' },
    ]
  },
  {
    year: 2018,
    name: 'PyeongChang 2018',
    type: 'Winter',
    results: [
      { place: 1, name: 'Marcus G' },
      { place: 2, name: 'Robert B' },
      { place: 3, name: 'Marcel K' },
      { place: 4, name: 'Marcus B' },
      { place: 5, name: 'Domi N' },
      { place: 6, name: 'Sebastian S' },
    ]
  },
  {
    year: 2016,
    name: 'Rio 2016',
    type: 'Sommer',
    results: [
      { place: 1, name: 'Marcus G' },
      { place: 2, name: 'Marcus B' },
      { place: 3, name: 'Robert B' },
      { place: 4, name: 'Sebastian S' },
      { place: 5, name: 'Domi N' },
      { place: 6, name: 'Marcel K' },
    ]
  },
];

const getMedalEmoji = (place: number) => {
  if (place === 1) return '🥇';
  if (place === 2) return '🥈';
  if (place === 3) return '🥉';
  return `${place}.`;
};

interface StatisticsProps {
  competitionId: string;
}

const Statistics: React.FC<StatisticsProps> = ({ competitionId }) => {
  const { currentPlayer } = usePlayer();
  const { predictions, profiles, calculateScore, getLeaderboard, results } = usePredictions();

  // Get events based on competition
  const events = competitionId === 'ruhpolding-2026' ? ruhpoldingEvents : olympicEvents;
  
  // Get leaderboard
  const leaderboard = getLeaderboard();

  // Calculate statistics
  const userPredictions = currentPlayer ? predictions[currentPlayer.id] || {} : {};
  const totalTipps = Object.keys(userPredictions).filter(id => {
    const eventId = parseInt(id);
    return events.some(e => e.id === eventId);
  }).length;
  const totalEvents = events.length;
  const myScore = currentPlayer ? calculateScore(currentPlayer.id) : 0;
  const totalPlayers = Object.keys(profiles).length;

  // Calculate correct predictions percentage
  let correctPredictions = 0;
  let totalPossiblePredictions = 0;
  
  if (currentPlayer) {
    Object.entries(userPredictions).forEach(([eventIdStr, prediction]) => {
      const eventId = parseInt(eventIdStr);
      const result = results[eventId];
      if (result) {
        // Count each medal position separately
        totalPossiblePredictions += 3;
        if (prediction.gold === result.gold) correctPredictions++;
        if (prediction.silver === result.silver) correctPredictions++;
        if (prediction.bronze === result.bronze) correctPredictions++;
      }
    });
  }
  
  const correctRate = totalPossiblePredictions > 0 
    ? Math.round((correctPredictions / totalPossiblePredictions) * 100) 
    : 0;

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
          <p className="text-2xl font-bold text-foreground">{correctRate}%</p>
          <p className="text-sm text-muted-foreground">Trefferquote</p>
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

      {/* Current Leaderboard */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Aktuelle Rangliste
        </h3>
        <div className="space-y-2">
          {leaderboard.map((player, index) => {
            const isCurrentUser = player.playerId === currentPlayer?.id;
            return (
              <div 
                key={player.playerId}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    index === 0 ? 'gradient-gold text-white' :
                    index === 1 ? 'gradient-silver text-white' :
                    index === 2 ? 'gradient-bronze text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium text-foreground">
                    {player.name}
                    {isCurrentUser && <span className="ml-1 text-xs text-muted-foreground">(Du)</span>}
                  </span>
                </div>
                <span className="text-xl font-bold text-foreground">{player.score}</span>
              </div>
            );
          })}
          {leaderboard.length === 0 && (
            <p className="text-center text-muted-foreground py-4">Noch keine Spieler registriert</p>
          )}
        </div>
      </div>

      {/* All-Time Medal Standings */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Medal className="w-5 h-5 text-gold" />
          Ewiger Medaillenspiegel (seit 2016)
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">🥇</TableHead>
                <TableHead className="text-center">🥈</TableHead>
                <TableHead className="text-center">🥉</TableHead>
                <TableHead className="text-center">Teilnahmen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTimeMedalStandings.map((player, index) => (
                <TableRow key={player.name}>
                  <TableCell className="font-medium">
                    {index === 0 && '🏆'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && (index + 1)}
                  </TableCell>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell className="text-center font-bold text-gold">{player.gold}</TableCell>
                  <TableCell className="text-center font-bold text-silver">{player.silver}</TableCell>
                  <TableCell className="text-center font-bold text-bronze">{player.bronze}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{player.participations}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Yearly Results Accordion */}
        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="yearly-details" className="border-none">
            <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground py-2">
              📅 Alle Jahres-Ergebnisse anzeigen
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {yearlyResults.map((year) => (
                  <div key={year.year} className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">{year.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        year.type === 'Sommer' 
                          ? 'bg-orange-500/20 text-orange-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {year.type}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {year.results.map((result) => (
                        <div 
                          key={result.name} 
                          className={`flex items-center gap-2 text-sm py-1 px-2 rounded ${
                            result.place <= 3 ? 'bg-background/50' : ''
                          }`}
                        >
                          <span className="w-8 text-center">{getMedalEmoji(result.place)}</span>
                          <span className={result.place <= 3 ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                            {result.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Scoring Info */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-3 text-sm">Punktevergabe</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-gold/10">
            <div className="w-8 h-8 rounded-full gradient-gold mx-auto mb-1 flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <p className="text-xs font-medium text-foreground">Gold</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-silver/10">
            <div className="w-8 h-8 rounded-full gradient-silver mx-auto mb-1 flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <p className="text-xs font-medium text-foreground">Silber</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-bronze/10">
            <div className="w-8 h-8 rounded-full gradient-bronze mx-auto mb-1 flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <p className="text-xs font-medium text-foreground">Bronze</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Statistics;
