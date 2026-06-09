-- =====================================================
-- IELTSify Admin — TO'LIQ O'RNATISH (1 daqiqa)
-- =====================================================
-- BU SQL NI SUAPBASE DASHBOARD → SQL EDITOR GA
-- COPY-PASTE QILIB, RUN TUGMASINI BOSING
-- =====================================================

-- =============================================
-- 1-QADAM: PROFILES jadvalini yaratish
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    full_name TEXT,
    avatar_url TEXT,
    current_band DECIMAL(3,1) DEFAULT 0,
    target_band DECIMAL(3,1) DEFAULT 0,
    exam_date DATE,
    weak_skills TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- 2-QADAM: QOLGAN JADVALLAR
-- =============================================

-- USER COINS
CREATE TABLE IF NOT EXISTS public.user_coins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance BIGINT NOT NULL DEFAULT 0 CHECK (balance >= 0),
    total_earned BIGINT NOT NULL DEFAULT 0,
    total_spent BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- COIN TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase','referral_bonus','admin_adjustment','subscription_payment','daily_reward','test_completion','refund','other')),
    description TEXT,
    reference_id TEXT,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- USER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly','quarterly','yearly','lifetime','trial')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','cancelled','expired')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    auto_renew BOOLEAN DEFAULT true,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method TEXT,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PAYMENT REQUESTS
CREATE TABLE IF NOT EXISTS public.payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'UZS',
    payment_type TEXT NOT NULL CHECK (payment_type IN ('coin_purchase','subscription','other')),
    plan_type TEXT,
    coins_requested BIGINT DEFAULT 0,
    receipt_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    admin_id UUID REFERENCES auth.users(id),
    admin_note TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- REFERRAL HISTORY
CREATE TABLE IF NOT EXISTS public.referral_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bonus_coins BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','cancelled')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(referred_id)
);

-- ADMIN LOGS
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    action TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    metadata JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- 3-QADAM: AVTOMATIK PROFIL YARATISH TRIGGERI
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role, full_name, is_active, last_active_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        true,
        now()
    );
    INSERT INTO public.user_coins (user_id, balance, total_earned, total_spent)
    VALUES (NEW.id, 0, 0, 0);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 4-QADAM: RLS POLICIES
-- =============================================
ALTER TABLE public.user_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Admin polices
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT 
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE 
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

CREATE POLICY "Admins full access user_coins" ON public.user_coins FOR ALL 
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins full access coin_transactions" ON public.coin_transactions FOR ALL 
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins full access user_subscriptions" ON public.user_subscriptions FOR ALL 
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins full access payment_requests" ON public.payment_requests FOR ALL 
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins full access referral_history" ON public.referral_history FOR ALL 
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins full access admin_logs" ON public.admin_logs FOR ALL 
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- =============================================
-- 5-QADAM: SUPER ADMIN USER YARATISH
-- =============================================
-- Avval Supabase Authentication orqali user yarating:
-- Dashboard → Authentication → Users → Add User
-- Email: admin@ieltsify.uz
-- Password: Admin123!
-- Auto Confirm User: ✅
--
-- KEYIN shu SQL ni RUN qiling:

-- Mavjud userlarni ko'rish
SELECT id, email FROM auth.users;

-- User yaratilgan bo'lsa, uni super_admin qilish
UPDATE public.profiles 
SET role = 'super_admin', 
    full_name = 'Super Admin',
    is_active = true
WHERE email = 'admin@ieltsify.uz';

-- Tekshirish
SELECT email, role, full_name FROM public.profiles WHERE email = 'admin@ieltsify.uz';

-- Agar user yo'q bo'lsa, avval Authentication → Users ga o'tib yarating