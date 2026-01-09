import React, { createContext, useContext, useState, useEffect } from 'react';
import { Prediction, Result } from '@/data/olympicEvents';

interface PredictionContextType {
  predictions: Record<number, Record<number, Prediction>>; // userId -> eventId -> Prediction
  results: Record<number, Result>; // eventId -> Result
  setPrediction: (userId: number, eventId: number, prediction: Prediction) => void;
  getPrediction: (userId: number, eventId: number) => Prediction | null;
  setResult: (eventId: number, result: Result) => void;
  calculateScore: (userId: number) => number;
  getLeaderboard: () => { userId: number; name: string; score: number }[];
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
  const [predictions, setPredictions] = useState<Record<number, Record<number, Prediction>>>({});
  const [results, setResults] = useState<Record<number, Result>>({});

  // Load predictions from localStorage
  useEffect(() => {
    const savedPredictions = localStorage.getItem('olympia_predictions');
    if (savedPredictions) {
      setPredictions(JSON.parse(savedPredictions));
    }
    
    const savedResults = localStorage.getItem('olympia_results');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  const savePredictions = (newPredictions: Record<number, Record<number, Prediction>>) => {
    localStorage.setItem('olympia_predictions', JSON.stringify(newPredictions));
    setPredictions(newPredictions);
  };

  const saveResults = (newResults: Record<number, Result>) => {
    localStorage.setItem('olympia_results', JSON.stringify(newResults));
    setResults(newResults);
  };

  const setPrediction = (userId: number, eventId: number, prediction: Prediction) => {
    const newPredictions = {
      ...predictions,
      [userId]: {
        ...predictions[userId],
        [eventId]: prediction
      }
    };
    savePredictions(newPredictions);
  };

  const getPrediction = (userId: number, eventId: number): Prediction | null => {
    return predictions[userId]?.[eventId] || null;
  };

  const setResult = (eventId: number, result: Result) => {
    const newResults = {
      ...results,
      [eventId]: result
    };
    saveResults(newResults);
  };

  const calculateScore = (userId: number): number => {
    const userPredictions = predictions[userId] || {};
    let score = 0;

    Object.entries(userPredictions).forEach(([eventId, prediction]) => {
      const result = results[Number(eventId)];
      if (result) {
        if (prediction.gold === result.gold) score += 3;
        if (prediction.silver === result.silver) score += 2;
        if (prediction.bronze === result.bronze) score += 1;
      }
    });

    return score;
  };

  const getLeaderboard = () => {
    const { users } = require('@/data/olympicEvents');
    return users.map((user: { id: number; name: string }) => ({
      userId: user.id,
      name: user.name,
      score: calculateScore(user.id)
    })).sort((a: { score: number }, b: { score: number }) => b.score - a.score);
  };

  return (
    <PredictionContext.Provider value={{
      predictions,
      results,
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
