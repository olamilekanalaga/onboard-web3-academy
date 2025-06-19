
-- Add missing email column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update the handle_new_user function to handle the email column properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, email, country_id, timezone, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    NEW.email,
    CASE 
      WHEN NEW.raw_user_meta_data->>'country_id' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'country_id')::INTEGER 
      ELSE NULL 
    END,
    COALESCE(NEW.raw_user_meta_data->>'timezone', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  
  -- Also ensure user_stats entry is created
  INSERT INTO public.user_stats (user_id, unlocked_courses) 
  VALUES (NEW.id, ARRAY['foundation'])
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
