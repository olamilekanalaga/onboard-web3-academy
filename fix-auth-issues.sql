-- Fix Authentication Issues
-- Run this in Supabase SQL Editor to fix signup/login problems

-- 1. Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email, country_id, timezone, phone)
  VALUES (
    NEW.id,
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. Fix any existing users without profiles
INSERT INTO public.profiles (id, full_name, avatar_url, email)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  COALESCE(au.raw_user_meta_data->>'avatar_url', ''),
  au.email
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 4. Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create policy for profiles if not exists
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 6. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.countries TO anon, authenticated;

-- 7. Check if everything is working
SELECT 'Setup complete! Check the results below:' as status;

-- Show all users and their profiles
SELECT 
  au.email,
  au.created_at as user_created,
  p.full_name,
  p.created_at as profile_created,
  CASE WHEN p.id IS NULL THEN 'MISSING PROFILE' ELSE 'PROFILE EXISTS' END as profile_status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
