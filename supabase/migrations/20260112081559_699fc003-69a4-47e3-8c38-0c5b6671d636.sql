-- Create athletes table for storing athlete data per event
CREATE TABLE public.athletes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT,
  bib_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries by event
CREATE INDEX idx_athletes_event_id ON public.athletes(event_id);

-- Enable Row Level Security
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;

-- Athletes are publicly readable (everyone can see who's competing)
CREATE POLICY "Athletes are viewable by everyone" 
ON public.athletes 
FOR SELECT 
USING (true);

-- Only admins can insert/update/delete athletes
CREATE POLICY "Admins can manage athletes" 
ON public.athletes 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.players 
    WHERE id = current_setting('app.current_player_id', true)::uuid 
    AND is_admin = true
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_athletes_updated_at
BEFORE UPDATE ON public.athletes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();