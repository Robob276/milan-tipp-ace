import React, { useState } from 'react';
import Header from './Header';
import EventsList from './EventsList';
import Leaderboard from './Leaderboard';
import Statistics from './Statistics';
import ResultsAdmin from './ResultsAdmin';

interface DashboardProps {
  onBackToHome?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<'events' | 'leaderboard' | 'stats'>('events');
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
        {activeTab === 'events' && <EventsList />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'stats' && <Statistics />}
      </main>
    </div>
  );
};

export default Dashboard;
