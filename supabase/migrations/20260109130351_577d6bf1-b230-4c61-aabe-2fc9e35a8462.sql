-- First delete the orphaned predictions (ones with user_ids not in players table)
DELETE FROM public.predictions 
WHERE user_id NOT IN (SELECT id FROM public.players);

-- Drop the existing foreign key constraint that references auth.users (if exists)
ALTER TABLE public.predictions 
DROP CONSTRAINT IF EXISTS predictions_user_id_fkey;

-- Add new foreign key constraint that references players table
ALTER TABLE public.predictions
ADD CONSTRAINT predictions_player_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.players(id) ON DELETE CASCADE;