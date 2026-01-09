-- Create a secure login function that verifies PIN without exposing it
CREATE OR REPLACE FUNCTION public.verify_player_pin(
  player_id uuid,
  pin_attempt text
)
RETURNS TABLE (
  id uuid,
  name text,
  is_admin boolean,
  valid boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.is_admin,
    (p.pin IS NOT NULL AND p.pin = pin_attempt) as valid
  FROM public.players p
  WHERE p.id = player_id;
END;
$$;