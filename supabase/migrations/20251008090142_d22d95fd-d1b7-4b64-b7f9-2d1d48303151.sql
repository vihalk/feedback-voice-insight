-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_text TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  sentiment TEXT,
  sentiment_score NUMERIC(3,2),
  positive_keywords TEXT[],
  negative_keywords TEXT[],
  ai_response TEXT,
  ai_suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert feedback (public feature)
CREATE POLICY "Anyone can insert feedback"
  ON public.feedback
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anyone to read feedback
CREATE POLICY "Anyone can read feedback"
  ON public.feedback
  FOR SELECT
  USING (true);

-- Create index for better query performance
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at DESC);
CREATE INDEX idx_feedback_language ON public.feedback(language);
CREATE INDEX idx_feedback_sentiment ON public.feedback(sentiment);

-- Enable realtime for the feedback table
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;