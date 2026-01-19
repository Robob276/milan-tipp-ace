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
    const init = async () => {
      const allPlayers = await fetchPlayers();

      // Restore stored session after players are loaded
      const storedPlayerId = localStorage.getItem('currentPlayerId');
      if (storedPlayerId) {
        const playerData = allPlayers.find((p) => p.id === storedPlayerId);
        if (playerData) {
          setCurrentPlayer(playerData);
        } else {
          localStorage.removeItem('currentPlayerId');
        }
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const fetchPlayers = async (): Promise<Player[]> => {
    // Prefer RPCs (SECURITY DEFINER) over direct SELECT on views.
    // This avoids client permission/RLS edge-cases and keeps the login flow robust.
    const { data: regularPlayers, error: regularError } = await supabase.rpc('list_public_players');
    const { data: adminPlayers, error: adminError } = await supabase.rpc('list_admin_players');

    if (regularError || adminError) {
      console.error('Error fetching players:', regularError || adminError);
      setPlayers([]);
      return [];
    }

    const allPlayers: Player[] = [
      ...((regularPlayers ?? []) as any[]).map((p) => ({
        id: p.id,
        name: p.name,
        has_pin: !!p.has_pin,
        is_admin: false,
      })),
      ...((adminPlayers ?? []) as any[]).map((p) => ({
        id: p.id,
        name: p.name,
        has_pin: !!p.has_pin,
        is_admin: true,
      })),
    ];

    setPlayers(allPlayers);
    return allPlayers;
  };

  const login = async (playerId: string, pin: string): Promise<{ error: string | null }> => {
    // Use secure RPC function to verify PIN without exposing it
    const { data, error } = await supabase
      .rpc('verify_player_pin', { 
        player_id: playerId, 
        pin_attempt: pin 
      });
    
    if (error || !data || data.length === 0) {
      console.error('Login error:', error);
      return { error: 'Spieler nicht gefunden.' };
    }

    const result = data[0];
    
    if (!result.valid) {
      return { error: 'Falsche PIN.' };
    }

    const player: Player = {
      id: result.id,
      name: result.name,
      is_admin: result.is_admin,
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

    // Use secure RPC function to set PIN
    const { data, error } = await supabase
      .rpc('setup_player_pin', {
        player_id: playerId,
        new_pin: pin
      });

    if (error) {
      console.error('Error setting PIN:', error);
      return { error: 'Fehler beim Setzen der PIN.' };
    }

    if (!data || data.length === 0 || !data[0].success) {
      if (data?.[0]?.player_name) {
        return { error: 'PIN bereits gesetzt. Bitte anmelden.' };
      }
      return { error: 'Spieler nicht gefunden.' };
    }

    const result = data[0];
    const player: Player = {
      id: playerId,
      name: result.player_name,
      is_admin: result.player_is_admin,
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
