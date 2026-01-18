import React, { useState } from 'react';
import Header from './Header';
import EventsList from './EventsList';
import Statistics from './Statistics';
import ResultsAdmin from './ResultsAdmin';
import ResultsOverview from './ResultsOverview';
import { usePlayer } from '@/contexts/PlayerContext';

interface DashboardProps {
  onBackToHome?: () => void;
  isAdminMode?: boolean;
  competitionId: string;
  isArchived?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onBackToHome, isAdminMode, competitionId, isArchived = false }) => {
  const { isAdmin } = usePlayer();
  
  // Admin starts at leaderboard, players at events
  const [activeTab, setActiveTab] = useState<'events' | 'stats' | 'results'>(
    isAdmin ? 'stats' : 'events'
  );
  const [showResultsAdmin, setShowResultsAdmin] = useState(false);

  if (showResultsAdmin && !isArchived) {
    return <ResultsAdmin onBack={() => setShowResultsAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onBackToHome={onBackToHome}
        onOpenResultsAdmin={isArchived ? undefined : () => setShowResultsAdmin(true)}
        isArchived={isArchived}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {activeTab === 'events' && !isAdmin && <EventsList competitionId={competitionId} isArchived={isArchived} />}
        {activeTab === 'events' && isAdmin && <Statistics competitionId={competitionId} />}
        {activeTab === 'stats' && <Statistics competitionId={competitionId} />}
        {activeTab === 'results' && <ResultsOverview competitionId={competitionId} />}
      </main>
    </div>
  );
};

export default Dashboard;
