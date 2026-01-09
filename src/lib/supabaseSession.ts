import { supabase } from '@/integrations/supabase/client';

/**
 * Sets the current player ID in the PostgreSQL session.
 * This is used by RLS policies to verify ownership.
 */
export const setPlayerSession = async (playerId: string): Promise<void> => {
  await supabase.rpc('set_config', {
    setting_name: 'app.current_player_id',
    setting_value: playerId,
    is_local: true
  });
};

/**
 * Wrapper to execute a database operation with player session set.
 * This ensures RLS policies can verify the current player.
 */
export const withPlayerSession = async <T>(
  playerId: string,
  operation: () => Promise<T>
): Promise<T> => {
  // Set the session variable first
  await supabase.rpc('set_config', {
    setting_name: 'app.current_player_id', 
    setting_value: playerId,
    is_local: true
  });
  
  // Then execute the operation
  return operation();
};
