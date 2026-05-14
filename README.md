# IshTop.uz — Vakansiyalar sayti

O'zbek, rus va ingliz tillarini qo'llab-quvvatlovchi to'liq funksional vakansiyalar sayti.

## Texnologiyalar
- **Frontend**: React 18 + React Router v6
- **Backend/DB**: Supabase (PostgreSQL + Auth)
- **i18n**: O'zbek, Rus, Ingliz tillari
- **Xabarlar**: react-hot-toast

## Rollar
| Rol | Imkoniyatlar |
|-----|-------------|
| `seeker` | Vakansiyalarni ko'rish, ariza berish |
| `employer` | Vakansiya joylash, o'z vakansiyalarini boshqarish |
| `admin` | Hamma vakansiyalarni tasdiqlash/rad etish, foydalanuvchilarni boshqarish |

## O'rnatish

### 1. Supabase sozlash
1. [supabase.com](https://supabase.com) da loyiha yarating
2. SQL Editor da `SUPABASE_SETUP.sql` faylini ishga tushiring
3. Project URL va anon key ni oling

### 2. Loyihani o'rnatish
```bash
# .env fayl yarating
cp .env.example .env

# .env faylini tahrirlang
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Paketlarni o'rnating
npm install

# Ishga tushiring
npm start
```

### 3. Admin yaratish
1. Saytda ro'yxatdan o'ting
2. Supabase da SQL ishlatib admin qiling:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## Sahifalar
- `/` — Bosh sahifa (qidirish, filtrlar, vakansiyalar ro'yxati)
- `/login` — Kirish
- `/register` — Ro'yxatdan o'tish
- `/post-job` — Vakansiya joylash (faqat employer)
- `/my-jobs` — Mening vakansiyalarim (faqat employer)
- `/admin` — Admin panel (faqat admin)

## Til almashtirish
Navbar da til tugmalarini bosib UZ / RU / EN ga o'tish mumkin.
