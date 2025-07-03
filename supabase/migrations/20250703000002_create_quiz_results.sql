-- Create quiz results table for tracking quiz completions
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  xp_earned INTEGER DEFAULT 0,
  questions_answered JSONB DEFAULT '[]',
  time_taken INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_course_id ON quiz_results(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_course ON quiz_results(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_passed ON quiz_results(passed);

-- Create unique constraint to allow only one passed quiz per user per course
-- (Users can retake failed quizzes, but only one passing result is kept)
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_results_unique_passed 
ON quiz_results(user_id, course_id) 
WHERE passed = true;

-- Enable RLS
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own quiz results" ON quiz_results
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results" ON quiz_results
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz results" ON quiz_results
FOR UPDATE USING (auth.uid() = user_id);

-- Function to get user's quiz progress
CREATE OR REPLACE FUNCTION get_user_quiz_progress(p_user_id UUID)
RETURNS TABLE (
  course_id TEXT,
  score INTEGER,
  passed BOOLEAN,
  completed_at TIMESTAMP WITH TIME ZONE,
  xp_earned INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    qr.course_id,
    qr.score,
    qr.passed,
    qr.completed_at,
    qr.xp_earned
  FROM quiz_results qr
  WHERE qr.user_id = p_user_id
  AND qr.passed = true
  ORDER BY qr.completed_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can access a course
CREATE OR REPLACE FUNCTION can_user_access_course(p_user_id UUID, p_course_id TEXT, p_prerequisites TEXT[])
RETURNS BOOLEAN AS $$
DECLARE
  prereq TEXT;
  has_passed BOOLEAN;
BEGIN
  -- Foundation course is always accessible
  IF p_course_id = 'foundation' THEN
    RETURN true;
  END IF;
  
  -- Check each prerequisite
  FOREACH prereq IN ARRAY p_prerequisites
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM quiz_results 
      WHERE user_id = p_user_id 
      AND course_id = prereq 
      AND passed = true
    ) INTO has_passed;
    
    IF NOT has_passed THEN
      RETURN false;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to get course prerequisites
CREATE OR REPLACE FUNCTION get_course_prerequisites(p_course_id TEXT)
RETURNS TEXT[] AS $$
BEGIN
  RETURN CASE p_course_id
    WHEN 'foundation' THEN ARRAY[]::TEXT[]
    WHEN 'defi-fundamentals' THEN ARRAY['foundation']
    WHEN 'degen' THEN ARRAY['foundation', 'defi-fundamentals']
    WHEN 'advanced-trading' THEN ARRAY['foundation', 'defi-fundamentals']
    WHEN 'development' THEN ARRAY['foundation', 'defi-fundamentals']
    WHEN 'nft-creation' THEN ARRAY['foundation']
    WHEN 'content-creation' THEN ARRAY['foundation']
    WHEN 'web3-security' THEN ARRAY['foundation', 'defi-fundamentals']
    WHEN 'dao-governance' THEN ARRAY['foundation', 'defi-fundamentals']
    WHEN 'web3-gaming' THEN ARRAY['foundation']
    WHEN 'crypto-tax' THEN ARRAY['foundation', 'defi-fundamentals']
    WHEN 'web3-social' THEN ARRAY['foundation']
    ELSE ARRAY[]::TEXT[]
  END;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_quiz_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_quiz_results_updated_at ON quiz_results;
CREATE TRIGGER trigger_update_quiz_results_updated_at
  BEFORE UPDATE ON quiz_results
  FOR EACH ROW
  EXECUTE FUNCTION update_quiz_results_updated_at();
