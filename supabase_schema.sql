-- =============================================
-- IshTop.uz — Supabase SQL Schema
-- Supabase Dashboard > SQL Editor ga joylashtiring
-- =============================================

-- Foydalanuvchilar profili (auth.users bilan bog'liq)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text default 'jobseeker', -- 'jobseeker' | 'employer' | 'admin'
  phone text,
  resume_url text,
  company_name text,
  company_logo text,
  created_at timestamptz default now()
);

-- Vakansiyalar
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  company text not null,
  city text not null,
  job_type text not null, -- 'fulltime' | 'parttime' | 'remote' | 'freelance'
  category text not null,
  salary_min integer,
  salary_max integer,
  description text,
  requirements text,
  benefits text,
  contact text,
  is_featured boolean default false,
  is_active boolean default true,
  views integer default 0,
  created_at timestamptz default now()
);

-- Arizalar
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade,
  applicant_id uuid references public.profiles(id) on delete cascade,
  cover_letter text,
  status text default 'pending', -- 'pending' | 'reviewed' | 'accepted' | 'rejected'
  created_at timestamptz default now(),
  unique(job_id, applicant_id)
);

-- Saqlangan vakansiyalar
create table public.saved_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, job_id)
);

-- Row Level Security yoqish
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.saved_jobs enable row level security;

-- Profiles policies
create policy "Hamma profillarni ko'rishi mumkin" on public.profiles for select using (true);
create policy "Foydalanuvchi o'z profilini yangilashi" on public.profiles for update using (auth.uid() = id);

-- Jobs policies
create policy "Hamma aktiv vakansiyalarni ko'rishi mumkin" on public.jobs for select using (is_active = true);
create policy "Employer vakansiya qo'shishi" on public.jobs for insert with check (auth.uid() = employer_id);
create policy "Employer o'z vakansiyasini yangilashi" on public.jobs for update using (auth.uid() = employer_id);
create policy "Employer o'z vakansiyasini o'chirishi" on public.jobs for delete using (auth.uid() = employer_id);

-- Applications policies
create policy "Applicant o'z arizalarini ko'rishi" on public.applications for select using (auth.uid() = applicant_id);
create policy "Employer o'z vakansiyalariga kelgan arizalarni ko'rishi" on public.applications for select using (
  exists (select 1 from public.jobs where jobs.id = applications.job_id and jobs.employer_id = auth.uid())
);
create policy "Ariza yuborish" on public.applications for insert with check (auth.uid() = applicant_id);
create policy "Applicant arizani o'chirishi" on public.applications for delete using (auth.uid() = applicant_id);

-- Saved jobs policies
create policy "Foydalanuvchi saqlangan vakansiyalarini ko'rishi" on public.saved_jobs for select using (auth.uid() = user_id);
create policy "Vakansiyani saqlash" on public.saved_jobs for insert with check (auth.uid() = user_id);
create policy "Saqlangan vakansiyani o'chirish" on public.saved_jobs for delete using (auth.uid() = user_id);

-- Trigger: yangi foydalanuvchi ro'yxatdan o'tganda profil yaratish
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Namunaviy ma'lumotlar
insert into public.jobs (employer_id, title, company, city, job_type, category, salary_min, salary_max, description, requirements, contact, is_featured) values
  ('00000000-0000-0000-0000-000000000000', 'Frontend Developer', 'Uzum Market', 'Toshkent', 'fulltime', 'IT', 12000000, 18000000, 'Biz React va TypeScript bilgan dasturchi izlayapmiz.', 'React, TypeScript, 2+ yil tajriba', 'hr@uzum.uz', true),
  ('00000000-0000-0000-0000-000000000000', 'UX/UI Designer', 'Humans.uz', 'Toshkent', 'remote', 'Dizayn', 10000000, 15000000, 'Figma da ishlay oladigan dizayner kerak.', 'Figma, 1+ yil tajriba', 'jobs@humans.uz', false),
  ('00000000-0000-0000-0000-000000000000', 'Python Developer', 'IT Park', 'Toshkent', 'remote', 'IT', 20000000, 30000000, 'Backend ishlab chiqish uchun Python developer.', 'Python, Django/FastAPI, 2+ yil', 'hr@itpark.uz', true);
