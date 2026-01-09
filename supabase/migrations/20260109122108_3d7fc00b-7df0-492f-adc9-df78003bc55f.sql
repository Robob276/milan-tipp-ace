-- Create players table for PIN-based login
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  pin TEXT, -- NULL until player sets their own PIN
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Everyone can view player names (for dropdown)
CREATE POLICY "Anyone can view players"
ON public.players
FOR SELECT
USING (true);

-- Players can update their own record (to set PIN)
CREATE POLICY "Players can update own record"
ON public.players
FOR UPDATE
USING (true);

-- Insert the predefined players
INSERT INTO public.players (name, is_admin) VALUES
  ('Sebastian', false),
  ('Marcel', false),
  ('Marcus B', false),
  ('Marcus G', false),
  ('Robert', false),
  ('Admin', true);

-- Add trigger for updated_at
CREATE TRIGGER update_players_updated_at
BEFORE UPDATE ON public.players
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();