import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePlayer } from './PlayerContext';
import type { Result, Prediction, OlympicEvent } from '@/data/olympicEvents';
import { olympicEvents } from '@/data/olympicEvents';

interface PredictionContextType {
  predictions: Record<string, Record<number, Prediction>>; // playerId -> eventId -> Prediction
  results: Record<number, Result>; // eventId -> Result
  profiles: Record<string, string>; // playerId -> displayName
  isLoading: boolean;
  setPrediction: (eventId: number, prediction: Omit<Prediction, 'eventId'>) => Promise<void>;
  deletePrediction: (eventId: number) => Promise<void>;
  getPrediction: (playerId: string, eventId: number) => Prediction | null;
  getVisiblePrediction: (playerId: string, eventId: number) => Prediction | null;
  setResult: (eventId: number, result: Omit<Result, 'eventId'>) => Promise<{ error: string | null }>;
  deleteResult: (eventId: number) => Promise<void>;
  calculateScore: (playerId: string) => number;
  getLeaderboard: () => { playerId: string; name: string; score: number }[];
  isEventStarted: (eventId: number) => boolean;
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
  const { currentPlayer, players } = usePlayer();
  const [predictions, setPredictions] = useState<Record<string, Record<number, Prediction>>>({});
  const [results, setResults] = useState<Record<number, Result>>({});
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, [currentPlayer, players]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchPredictions(), fetchResults(), buildProfiles()]);
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

  const buildProfiles = () => {
    // Build profiles from players list (non-admin players)
    const profilesMap: Record<string, string> = {};
    players.filter(p => !p.is_admin).forEach((p) => {
      profilesMap[p.id] = p.name;
    });
    setProfiles(profilesMap);
  };

  const isEventStarted = (eventId: number): boolean => {
    const event = olympicEvents.find(e => e.id === eventId);
    if (!event) return true; // If event not found, assume started for safety
    const eventDate = new Date(event.date + 'T' + event.time);
    return eventDate < new Date();
  };

  const setPrediction = async (eventId: number, prediction: Omit<Prediction, 'eventId'>) => {
    if (!currentPlayer) return;

    const { error } = await supabase
      .from('predictions')
      .upsert({
        user_id: currentPlayer.id,
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
      [currentPlayer.id]: {
        ...prev[currentPlayer.id],
        [eventId]: { eventId, ...prediction }
      }
    }));
  };

  const deletePrediction = async (eventId: number) => {
    if (!currentPlayer) return;

    const { error } = await supabase
      .from('predictions')
      .delete()
      .eq('user_id', currentPlayer.id)
      .eq('event_id', eventId);

    if (error) {
      console.error('Error deleting prediction:', error);
      return;
    }

    // Update local state
    setPredictions(prev => {
      const newPredictions = { ...prev };
      if (newPredictions[currentPlayer.id]) {
        const playerPredictions = { ...newPredictions[currentPlayer.id] };
        delete playerPredictions[eventId];
        newPredictions[currentPlayer.id] = playerPredictions;
      }
      return newPredictions;
    });
  };

  const getPrediction = (playerId: string, eventId: number): Prediction | null => {
    return predictions[playerId]?.[eventId] || null;
  };

  // Get prediction only if it should be visible (own prediction or event has started)
  const getVisiblePrediction = (playerId: string, eventId: number): Prediction | null => {
    const prediction = predictions[playerId]?.[eventId];
    if (!prediction) return null;
    
    // Always show own predictions
    if (currentPlayer && playerId === currentPlayer.id) return prediction;
    
    // Show other players' predictions only if event has started
    if (isEventStarted(eventId)) return prediction;
    
    return null;
  };

  const setResult = async (eventId: number, result: Omit<Result, 'eventId'>): Promise<{ error: string | null }> => {
    console.log('setResult called with:', { eventId, result });
    
    const { data, error } = await supabase
      .from('results')
      .upsert({
        event_id: eventId,
        gold: result.gold,
        silver: result.silver,
        bronze: result.bronze
      }, { onConflict: 'event_id' })
      .select();

    console.log('setResult response:', { data, error });

    if (error) {
      console.error('Error saving result:', error);
      return { error: error.message };
    }

    // Update local state
    setResults(prev => ({
      ...prev,
      [eventId]: { eventId, ...result }
    }));

    // Refetch all results to ensure sync
    await fetchResults();

    return { error: null };
  };

  const deleteResult = async (eventId: number) => {
    const { error } = await supabase
      .from('results')
      .delete()
      .eq('event_id', eventId);

    if (error) {
      console.error('Error deleting result:', error);
      return;
    }

    // Update local state
    setResults(prev => {
      const newResults = { ...prev };
      delete newResults[eventId];
      return newResults;
    });
  };

  const calculateScore = (playerId: string): number => {
    const playerPredictions = predictions[playerId] || {};
    let score = 0;

    Object.entries(playerPredictions).forEach(([eventIdStr, prediction]) => {
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
    return Object.entries(profiles).map(([playerId, name]) => ({
      playerId,
      name,
      score: calculateScore(playerId)
    })).sort((a, b) => b.score - a.score);
  };

  return (
    <PredictionContext.Provider value={{
      predictions,
      results,
      profiles,
      isLoading,
      setPrediction,
      deletePrediction,
      getPrediction,
      getVisiblePrediction,
      setResult,
      deleteResult,
      calculateScore,
      getLeaderboard,
      isEventStarted
    }}>
      {children}
    </PredictionContext.Provider>
  );
};
