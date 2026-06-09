-- =====================================================
-- IELTSify Admin Panel — Admin User Yaratish
-- =====================================================
-- BU SQL NI SUAPBASE DASHBOARD -> SQL EDITOR DA ISHLATING
-- =====================================================

-- 1. Avval mavjud admin userlarni tekshirish
SELECT id, email, role, full_name FROM public.profiles WHERE role IN ('admin', 'super_admin');

-- 2. Agar admin yo'q bo'lsa, Supabase Auth orqali admin yaratish kerak:
--    Buning uchun ikkita usul:
--    
--    USUL 1: Supabase Dashboard -> Authentication -> Users -> Add User
--    - Email: admin@ieltsify.uz
--    - Password: (kuchli parol)
--    - Auto Confirm: true
--    Keyin quyidagi SQL bilan role ni o'zgartiring:
--    
--    UPDATE public.profiles 
--    SET role = 'super_admin', 
--        full_name = 'Admin',
--        is_active = true
--    WHERE email = 'admin@ieltsify.uz';
--    
--    USUL 2: Agar user allaqachon mavjud bo'lsa, role ni o'zgartirish:
--    UPDATE public.profiles 
--    SET role = 'admin'
--    WHERE email = 'your-email@example.com';

-- 3. Edge Function orqali yaratish (agar supabase CLI o'rnatilgan bo'lsa):
--    supabase functions deploy admins-create-first
--    curl -X POST https://your-project.supabase.co/functions/v1/admins-create-first \
--      -H "Content-Type: application/json" \
--      -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
--      -d '{"email":"admin@ieltsify.uz","password":"Admin123!","full_name":"Super Admin"}'

-- 4. Mavjud userlarni admin qilish (agar allaqachon ro'yxatdan o'tgan bo'lsa):
--    UPDATE public.profiles 
--    SET role = 'admin' 
--    WHERE email IN ('user1@example.com', 'user2@example.com');