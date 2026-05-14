-- ============================================================
-- IshTop.uz — Supabase ma'lumotlar bazasi
-- Supabase > SQL Editor da ushbu kodni ishga tushiring
-- ============================================================

-- 1. PROFILES jadval
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'seeker' CHECK (role IN ('seeker','employer','admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. JOBS jadval
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company_name TEXT,
  city TEXT,
  job_type TEXT,
  sector TEXT,
  salary_min BIGINT,
  salary_max BIGINT,
  description TEXT,
  requirements TEXT,
  contact TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  logo_color TEXT DEFAULT '#eff6ff',
  logo_text_color TEXT DEFAULT '#1e40af',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. APPLICATIONS jadval
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','accepted','rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- 4. RLS (Row Level Security) yoqish
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 5. PROFILES policies
CREATE POLICY "Har kim o'z profilini ko'rishi mumkin"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Foydalanuvchi o'z profilini yangilashi mumkin"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Yangi profil yaratish"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. JOBS policies
CREATE POLICY "Tasdiqlangan vakansiyalarni hamma ko'rishi mumkin"
  ON jobs FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Ish beruvchilar vakansiya joylashi mumkin"
  ON jobs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Ish beruvchi o'z vakansiyasini yangilashi mumkin"
  ON jobs FOR UPDATE USING (auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "O'chirish"
  ON jobs FOR DELETE USING (auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 7. APPLICATIONS policies
CREATE POLICY "O'z arizalarini ko'rish"
  ON applications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Ariza yuborish"
  ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Test ma'lumotlar (ixtiyoriy)
-- INSERT INTO jobs (title, company_name, city, job_type, sector, salary_min, salary_max, status, is_featured)
-- VALUES ('Frontend Developer', 'Uzum Market', 'Toshkent', 'To''liq stavka', 'IT', 10000000, 18000000, 'approved', true);

-- 9. Admin foydalanuvchi yaratish (ro'yxatdan o'tgandan keyin)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
