import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import type { Result, Prediction } from '@/data/olympicEvents';

interface PredictionContextType {
  predictions: Record<string, Record<number, Prediction>>; // userId -> eventId -> Prediction
  results: Record<number, Result>; // eventId -> Result
  profiles: Record<string, string>; // userId -> displayName
  isLoading: boolean;
  setPrediction: (eventId: number, prediction: Omit<Prediction, 'eventId'>) => Promise<void>;
  getPrediction: (userId: string, eventId: number) => Prediction | null;
  setResult: (eventId: number, result: Omit<Result, 'eventId'>) => Promise<{ error: string | null }>;
  calculateScore: (userId: string) => number;
  getLeaderboard: () => { userId: string; name: string; score: number }[];
}

const PredictionContext = createContext<PredictionContextType | null>(null);

export const usePredictions = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePredictions must be used within a PredictionProvider');
  }
  return context;
};

export const PredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Record<string, Record<number, Prediction>>>({});
  const [results, setResults] = useState<Record<number, Result>>({});
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchPredictions(), fetchResults(), fetchProfiles()]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPredictions = async () => {
    const { data, error } = await supabase
      .from('predictions')
      .select('*');
    
    if (error) {
      console.error('Error fetching predictions:', error);
      return;
    }

    const predictionsMap: Record<string, Record<number, Prediction>> = {};
    data?.forEach((p) => {
      if (!predictionsMap[p.user_id]) {
        predictionsMap[p.user_id] = {};
      }
      predictionsMap[p.user_id][p.event_id] = {
        eventId: p.event_id,
        gold: p.gold,
        silver: p.silver,
        bronze: p.bronze
      };
    });
    setPredictions(predictionsMap);
  };

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from('results')
      .select('*');
    
    if (error) {
      console.error('Error fetching results:', error);
      return;
    }

    const resultsMap: Record<number, Result> = {};
    data?.forEach((r) => {
      resultsMap[r.event_id] = {
        eventId: r.event_id,
        gold: r.gold,
        silver: r.silver,
        bronze: r.bronze
      };
    });
    setResults(resultsMap);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, display_name');
    
    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }

    const profilesMap: Record<string, string> = {};
    data?.forEach((p) => {
      profilesMap[p.user_id] = p.display_name;
    });
    setProfiles(profilesMap);
  };

  const setPrediction = async (eventId: number, prediction: Omit<Prediction, 'eventId'>) => {
    if (!user) return;

    const { error } = await supabase
      .from('predictions')
      .upsert({
        user_id: user.id,
        event_id: eventId,
        gold: prediction.gold,
        silver: prediction.silver,
        bronze: prediction.bronze
      }, { onConflict: 'user_id,event_id' });

    if (error) {
      console.error('Error saving prediction:', error);
      return;
    }

    // Update local state
    setPredictions(prev => ({
      ...prev,
      [user.id]: {
        ...prev[user.id],
        [eventId]: { eventId, ...prediction }
      }
    }));
  };

  const getPrediction = (userId: string, eventId: number): Prediction | null => {
    return predictions[userId]?.[eventId] || null;
  };

  const setResult = async (eventId: number, result: Omit<Result, 'eventId'>): Promise<{ error: string | null }> => {
    const { error } = await supabase
      .from('results')
      .upsert({
        event_id: eventId,
        gold: result.gold,
        silver: result.silver,
        bronze: result.bronze
      }, { onConflict: 'event_id' });

    if (error) {
      console.error('Error saving result:', error);
      return { error: error.message };
    }

    // Update local state
    setResults(prev => ({
      ...prev,
      [eventId]: { eventId, ...result }
    }));

    return { error: null };
  };

  const calculateScore = (userId: string): number => {
    const userPredictions = predictions[userId] || {};
    let score = 0;

    Object.entries(userPredictions).forEach(([eventIdStr, prediction]) => {
      const eventId = Number(eventIdStr);
      const result = results[eventId];
      if (result) {
        if (prediction.gold === result.gold) score += 3;
        if (prediction.silver === result.silver) score += 2;
        if (prediction.bronze === result.bronze) score += 1;
      }
    });

    return score;
  };

  const getLeaderboard = () => {
    return Object.entries(profiles).map(([userId, name]) => ({
      userId,
      name,
      score: calculateScore(userId)
    })).sort((a, b) => b.score - a.score);
  };

  return (
    <PredictionContext.Provider value={{
      predictions,
      results,
      profiles,
      isLoading,
      setPrediction,
      getPrediction,
      setResult,
      calculateScore,
      getLeaderboard
    }}>
      {children}
    </PredictionContext.Provider>
  );
};
