-- Enable pgvector extension for RAG
create extension if not exists vector;

-- Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  skill_level text check (skill_level in ('beginner', 'intermediate', 'advanced')),
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Roadmaps Table
create table public.roadmaps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users not null,
  title text not null,
  content jsonb not null, -- The full tree structure
  status text default 'active' check (status in ('active', 'completed', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Progress Table
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users not null,
  roadmap_id uuid references public.roadmaps not null,
  stage_id text not null,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  quiz_scores jsonb,
  completed_at timestamp with time zone
);

-- AI Feedback Logs (for RAG)
create table public.ai_feedback_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users not null,
  challenge_id text not null,
  user_code text,
  ai_response jsonb,
  score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.roadmaps enable row level security;
alter table public.user_progress enable row level security;
alter table public.ai_feedback_logs enable row level security;

-- Basic Policies (Demo: Allow all for prototype or authenticated)
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

create policy "Users can view own roadmaps" on public.roadmaps for select using (auth.uid() = user_id);
create policy "Users can insert own roadmaps" on public.roadmaps for insert with check (auth.uid() = user_id);
