import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Player {
  id: string;
  name: string;
  is_admin: boolean;
  has_pin: boolean;
}

interface PlayerContextType {
  currentPlayer: Player | null;
  players: Player[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (playerId: string, pin: string) => Promise<{ error: string | null }>;
  setupPin: (playerId: string, pin: string) => Promise<{ error: string | null }>;
  logout: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
    
    // Check for stored session
    const storedPlayerId = localStorage.getItem('currentPlayerId');
    if (storedPlayerId) {
      restoreSession(storedPlayerId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchPlayers = async () => {
    // Fetch regular players from public view (doesn't expose is_admin)
    const { data: regularPlayers, error: regularError } = await supabase
      .from('players_public')
      .select('id, name, has_pin')
      .order('name');
    
    // Fetch admin players from admin view
    const { data: adminPlayers, error: adminError } = await supabase
      .from('players_admin')
      .select('id, name, has_pin')
      .order('name');
    
    if (regularError || adminError) {
      console.error('Error fetching players:', regularError || adminError);
      return;
    }

    const allPlayers = [
      ...(regularPlayers?.map(p => ({ ...p, is_admin: false })) || []),
      ...(adminPlayers?.map(p => ({ ...p, is_admin: true })) || [])
    ];

    setPlayers(allPlayers);
  };

  const restoreSession = async (playerId: string) => {
    const { data, error } = await supabase
      .from('players')
      .select('id, name, is_admin, pin')
      .eq('id', playerId)
      .single();
    
    if (error || !data) {
      localStorage.removeItem('currentPlayerId');
      setIsLoading(false);
      return;
    }

    setCurrentPlayer({
      id: data.id,
      name: data.name,
      is_admin: data.is_admin,
      has_pin: !!data.pin
    });
    setIsLoading(false);
  };

  const login = async (playerId: string, pin: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase
      .from('players')
      .select('id, name, is_admin, pin')
      .eq('id', playerId)
      .single();
    
    if (error || !data) {
      return { error: 'Spieler nicht gefunden.' };
    }

    if (!data.pin) {
      return { error: 'Bitte zuerst eine PIN setzen.' };
    }

    if (data.pin !== pin) {
      return { error: 'Falsche PIN.' };
    }

    const player: Player = {
      id: data.id,
      name: data.name,
      is_admin: data.is_admin,
      has_pin: true
    };

    setCurrentPlayer(player);
    localStorage.setItem('currentPlayerId', player.id);
    return { error: null };
  };

  const setupPin = async (playerId: string, pin: string): Promise<{ error: string | null }> => {
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      return { error: 'PIN muss 4 Ziffern haben.' };
    }

    const { data: playerData, error: fetchError } = await supabase
      .from('players')
      .select('id, name, is_admin, pin')
      .eq('id', playerId)
      .single();

    if (fetchError || !playerData) {
      return { error: 'Spieler nicht gefunden.' };
    }

    if (playerData.pin) {
      return { error: 'PIN bereits gesetzt. Bitte anmelden.' };
    }

    const { error } = await supabase
      .from('players')
      .update({ pin })
      .eq('id', playerId);

    if (error) {
      console.error('Error setting PIN:', error);
      return { error: 'Fehler beim Setzen der PIN.' };
    }

    const player: Player = {
      id: playerData.id,
      name: playerData.name,
      is_admin: playerData.is_admin,
      has_pin: true
    };

    setCurrentPlayer(player);
    localStorage.setItem('currentPlayerId', player.id);
    
    // Refresh players list
    await fetchPlayers();
    
    return { error: null };
  };

  const logout = () => {
    setCurrentPlayer(null);
    localStorage.removeItem('currentPlayerId');
  };

  return (
    <PlayerContext.Provider value={{
      currentPlayer,
      players,
      isAuthenticated: !!currentPlayer,
      isAdmin: currentPlayer?.is_admin || false,
      isLoading,
      login,
      setupPin,
      logout
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
