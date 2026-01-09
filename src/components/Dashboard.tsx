import React, { useState } from 'react';
import Header from './Header';
import EventsList from './EventsList';
import Leaderboard from './Leaderboard';
import Statistics from './Statistics';
import ResultsAdmin from './ResultsAdmin';
import Chat from './Chat';
import { usePlayer } from '@/contexts/PlayerContext';

interface DashboardProps {
  onBackToHome?: () => void;
  isAdminMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onBackToHome, isAdminMode }) => {
  const { isAdmin } = usePlayer();
  
  // Admin starts at leaderboard, players at events
  const [activeTab, setActiveTab] = useState<'events' | 'leaderboard' | 'stats' | 'chat'>(
    isAdmin ? 'leaderboard' : 'events'
  );
  const [showResultsAdmin, setShowResultsAdmin] = useState(false);

  if (showResultsAdmin) {
    return <ResultsAdmin onBack={() => setShowResultsAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onBackToHome={onBackToHome}
        onOpenResultsAdmin={() => setShowResultsAdmin(true)}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {activeTab === 'events' && !isAdmin && <EventsList />}
        {activeTab === 'events' && isAdmin && <Leaderboard />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'stats' && <Statistics />}
        {activeTab === 'chat' && <Chat />}
      </main>
    </div>
  );
};

export default Dashboard;
