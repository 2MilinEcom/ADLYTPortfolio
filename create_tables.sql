-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    object_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questionnaire_responses table
CREATE TABLE IF NOT EXISTS questionnaire_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    niche TEXT NOT NULL,
    product TEXT NOT NULL,
    ad_output_range TEXT NOT NULL,
    search_tags TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for temporary videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('temp-videos', 'temp-videos', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for videos table
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own videos" ON videos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own videos" ON videos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" ON videos
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for questionnaire_responses table
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own questionnaire responses" ON questionnaire_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own questionnaire responses" ON questionnaire_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage policies
CREATE POLICY "Users can upload to temp-videos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'temp-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own temp videos" ON storage.objects
    FOR SELECT USING (bucket_id = 'temp-videos' AND auth.uid()::text = (storage.foldername(name))[1]); 