-- =====================================================
-- IELTSify Admin — SUPER ADMIN QO'SHISH (TO'G'RI)
-- =====================================================
-- user_profiles jadvalingiz: id, username, first_name, last_name, role, ...
-- =====================================================

-- QADAM 1: Avval mavjud adminlarni tekshirish
SELECT id, username, first_name, last_name, role FROM public.user_profiles WHERE role IN ('admin', 'super_admin');

-- Agar admin yo'q bo'lsa, quyidagi amallarni bajaring:

-- =============================================
-- QADAM 2: Supabase Dashboard orqali user yaratish
-- =============================================
-- 1. https://supabase.com/dashboard saytiga kiring
-- 2. gaqqwlnwlznytufddyuq projectni tanlang
-- 3. Authentication → Users → Add User
-- 4. Ma'lumotlarni kiriting:
--    Email: admin@ieltsify.uz
--    Password: Admin123!
--    Auto Confirm User: ✅
-- 5. Create user tugmasini bosing
--
-- Bu user yaratilganda "handle_new_user" triggeri ishga tushadi
-- va avtomatik ravishda user_profiles ga qo'shadi.
-- username = emailning @ dan oldingi qismi bo'ladi (masalan: "admin")

-- =============================================
-- QADAM 3: User yaratilganmi tekshirish
-- =============================================
SELECT id, username, role FROM public.user_profiles;

-- =============================================
-- QADAM 4: Super admin qilish
-- =============================================
UPDATE public.user_profiles 
SET role = 'super_admin',
    first_name = 'Super',
    last_name = 'Admin'
WHERE username = 'admin';

-- =============================================
-- QADAM 5: Tekshirish
-- =============================================
SELECT id, username, first_name, last_name, role FROM public.user_profiles WHERE role = 'super_admin';

-- =============================================
-- Agar trigger ishlamasa (user_profiles ga qo'shilmagan bo'lsa),
-- quyidagi triggerni yangilang:
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, role, first_name, is_vip)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        false
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();