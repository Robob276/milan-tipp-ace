-- Remove plain text PINs now that they are hashed
UPDATE public.players SET pin = NULL WHERE pin_hash IS NOT NULL;

-- Drop the old pin column (keeping it nullable for backwards compatibility during transition)
-- We'll keep it for now but ensure it's always NULL
-- ALTER TABLE public.players DROP COLUMN pin;