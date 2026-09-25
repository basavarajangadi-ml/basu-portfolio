-- ==============================================================================
-- SUPABASE SCHEMA FOR AI & ML DEVELOPER PORTFOLIO
-- Execute this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL DEFAULT '[YOUR NAME]',
    tagline TEXT NOT NULL DEFAULT 'AI & Machine Learning Student | Developer | Problem Solver',
    short_bio TEXT NOT NULL DEFAULT 'I am a B.Tech Artificial Intelligence & Machine Learning student passionate about Artificial Intelligence, Machine Learning, software development, and building real-world applications.',
    career_objective TEXT NOT NULL DEFAULT 'Seeking internship and placement opportunities in AI, Machine Learning, and Software Development to leverage strong analytical and programming skills in building high-impact intelligent systems.',
    degree TEXT NOT NULL DEFAULT 'B.Tech',
    branch TEXT NOT NULL DEFAULT 'Artificial Intelligence & Machine Learning',
    college TEXT NOT NULL DEFAULT '[YOUR COLLEGE]',
    location TEXT NOT NULL DEFAULT '[LOCATION]',
    email TEXT NOT NULL DEFAULT '[YOUR EMAIL]',
    profile_photo_url TEXT,
    career_interests TEXT[] DEFAULT ARRAY['Artificial Intelligence', 'Machine Learning', 'Full Stack Development', 'Generative AI', 'Data Engineering'],
    technical_interests TEXT[] DEFAULT ARRAY['Deep Learning', 'Computer Vision', 'NLP', 'Distributed Systems', 'Cloud Computing'],
    github_username TEXT NOT NULL DEFAULT '[GITHUB USERNAME]',
    linkedin_url TEXT NOT NULL DEFAULT '[LINKEDIN URL]',
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    detailed_description TEXT NOT NULL,
    image_url TEXT,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    category TEXT NOT NULL CHECK (category IN ('AI/ML', 'Web Development', 'Full Stack', 'Data Science', 'Generative AI', 'Other')),
    features TEXT[] NOT NULL DEFAULT '{}',
    github_url TEXT NOT NULL,
    live_demo_url TEXT,
    date TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    credential_id TEXT,
    certificate_image_url TEXT,
    certificate_pdf_url TEXT,
    verification_url TEXT,
    description TEXT,
    skills TEXT[] NOT NULL DEFAULT '{}',
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Programming', 'Web Development', 'AI & Machine Learning', 'Database', 'Tools')),
    icon_name TEXT,
    proficiency_level TEXT DEFAULT 'Intermediate',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    branch TEXT NOT NULL,
    start_year TEXT NOT NULL,
    end_year TEXT NOT NULL,
    grade TEXT,
    description TEXT,
    coursework TEXT[] NOT NULL DEFAULT '{}',
    achievements TEXT[] NOT NULL DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    is_current BOOLEAN DEFAULT false,
    description TEXT NOT NULL,
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    technologies TEXT[] NOT NULL DEFAULT '{}',
    company_url TEXT,
    company_logo_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Hackathon', 'Competition', 'Award', 'Workshop', 'Academic', 'Coding', 'Event', 'Other')),
    organization TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    document_url TEXT,
    link_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public READ policies for portfolio presentation
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public certificates are viewable by everyone" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Public skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public education is viewable by everyone" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public experience is viewable by everyone" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public achievements are viewable by everyone" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public social links are viewable by everyone" ON public.social_links FOR SELECT USING (true);

-- Authenticated Admin FULL ACCESS policies (Insert, Update, Delete)
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to certificates" ON public.certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to education" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to experience" ON public.experience FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to achievements" ON public.achievements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to social links" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Contact messages policies (Public can insert, only Authenticated Admin can view/edit/delete)
CREATE POLICY "Anyone can submit a contact message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view and manage contact messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. STORAGE BUCKET CONFIGURATION
-- Insert public bucket for portfolio assets if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
CREATE POLICY "Portfolio assets are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated users can upload portfolio assets" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated users can update their portfolio assets" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated users can delete portfolio assets" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'portfolio-assets');

-- 13. SEED INITIAL DATA
-- Initial Profile
INSERT INTO public.profiles (
    id, full_name, tagline, short_bio, career_objective, degree, branch, college, location, email, github_username, linkedin_url
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '[YOUR NAME]',
    'AI & Machine Learning Student | Developer | Problem Solver',
    'I am a B.Tech Artificial Intelligence & Machine Learning student passionate about Artificial Intelligence, Machine Learning, software development, and building real-world applications.',
    'Seeking internship and placement opportunities in AI, Machine Learning, and Software Development to leverage analytical problem-solving skills.',
    'B.Tech',
    'Artificial Intelligence & Machine Learning',
    '[YOUR COLLEGE]',
    '[LOCATION]',
    '[YOUR EMAIL]',
    '[GITHUB USERNAME]',
    '[LINKEDIN URL]'
) ON CONFLICT (id) DO NOTHING;

-- Initial Skills as requested
INSERT INTO public.skills (name, category, order_index) VALUES
-- Programming
('Python', 'Programming', 1),
('Java', 'Programming', 2),
('C', 'Programming', 3),
('JavaScript', 'Programming', 4),
-- Web Development
('HTML', 'Web Development', 5),
('CSS', 'Web Development', 6),
('React', 'Web Development', 7),
('Next.js', 'Web Development', 8),
('Tailwind CSS', 'Web Development', 9),
-- AI & Machine Learning
('Machine Learning', 'AI & Machine Learning', 10),
('Deep Learning', 'AI & Machine Learning', 11),
('NLP', 'AI & Machine Learning', 12),
('Generative AI', 'AI & Machine Learning', 13),
('Computer Vision', 'AI & Machine Learning', 14),
-- Database
('SQL', 'Database', 15),
('MySQL', 'Database', 16),
('MongoDB', 'Database', 17),
-- Tools
('Git', 'Tools', 18),
('GitHub', 'Tools', 19),
('VS Code', 'Tools', 20),
('Power BI', 'Tools', 21)
ON CONFLICT DO NOTHING;

-- Initial Education placeholder
INSERT INTO public.education (degree, institution, branch, start_year, end_year, description, coursework, achievements, order_index) VALUES
('Bachelor of Technology (B.Tech)', '[YOUR COLLEGE]', 'Artificial Intelligence & Machine Learning', '2023', '2027', 'Specializing in intelligent algorithms, machine learning systems, data structures, and computational intelligence.', ARRAY['Data Structures & Algorithms', 'Machine Learning', 'Deep Learning', 'Database Management Systems', 'Operating Systems', 'Probability & Statistics'], ARRAY['Active member of AI & Tech Club'], 1)
ON CONFLICT DO NOTHING;

-- Initial Social Links
INSERT INTO public.social_links (platform, url, icon, is_active, order_index) VALUES
('GitHub', 'https://github.com/[GITHUB USERNAME]', 'github', true, 1),
('LinkedIn', 'https://linkedin.com/in/[LINKEDIN URL]', 'linkedin', true, 2),
('Email', 'mailto:[YOUR EMAIL]', 'mail', true, 3)
ON CONFLICT DO NOTHING;
