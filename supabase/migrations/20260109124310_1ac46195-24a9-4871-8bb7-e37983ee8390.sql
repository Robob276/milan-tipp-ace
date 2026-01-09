-- Create set_config function to set session variables
CREATE OR REPLACE FUNCTION public.set_config(
  setting_name text,
  setting_value text,
  is_local boolean DEFAULT true
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config(setting_name, setting_value, is_local);
END;
$$;