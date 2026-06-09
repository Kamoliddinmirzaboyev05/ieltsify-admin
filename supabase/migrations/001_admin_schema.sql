-- =====================================================
-- IELTSify Admin Panel — To'liq SQL Schema
-- =====================================================

-- 1. PROFILES jadvaliga admin role qo'shish
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_band DECIMAL(3,1) DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_band DECIMAL(3,1) DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS exam_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weak_skills TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

-- 2. USER COINS
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

-- 3. COIN TRANSACTIONS (Log)
CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,  -- positive = qo'shilgan, negative = ayirilgan
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'purchase', 'referral_bonus', 'admin_adjustment', 'subscription_payment',
        'daily_reward', 'test_completion', 'refund', 'other'
    )),
    description TEXT,
    reference_id TEXT,  -- payment_request_id yoki boshqa reference
    admin_id UUID REFERENCES auth.users(id),  -- agar admin tomonidan qilingan bo'lsa
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. USER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'quarterly', 'yearly', 'lifetime', 'trial')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    auto_renew BOOLEAN DEFAULT true,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method TEXT,
    admin_id UUID REFERENCES auth.users(id),  -- agar admin yoqqan bo'lsa
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. PAYMENT REQUESTS
CREATE TABLE IF NOT EXISTS public.payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'UZS',
    payment_type TEXT NOT NULL CHECK (payment_type IN ('coin_purchase', 'subscription', 'other')),
    plan_type TEXT,  -- agar subscription bo'lsa
    coins_requested BIGINT DEFAULT 0,  -- agar coin purchase bo'lsa
    receipt_image_url TEXT,  -- Supabase Storage URL
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_id UUID REFERENCES auth.users(id),  -- tasdiqlagan admin
    admin_note TEXT,  -- rad etish sababi yoki izoh
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. REFERRAL HISTORY
CREATE TABLE IF NOT EXISTS public.referral_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bonus_coins BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(referred_id)  -- har bir foydalanuvchi faqat bir marta referral bo'lishi mumkin
);

-- 7. ADMIN LOGS
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    action TEXT NOT NULL,  -- masalan: 'user_coin_add', 'payment_approve', 'subscription_toggle'
    target_type TEXT,  -- 'user', 'payment', 'subscription', 'content'
    target_id TEXT,  -- targetning ID si
    metadata JSONB DEFAULT '{}',  -- qo'shimcha ma'lumotlar
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. ARTICLES (Smart Articles)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    featured_image TEXT,
    is_active BOOLEAN DEFAULT true,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. LISTENING / PODCAST MATERIALS
CREATE TABLE IF NOT EXISTS public.listening_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT,
    youtube_url TEXT,
    transcript TEXT,
    category TEXT NOT NULL CHECK (category IN ('podcast', 'lecture', 'conversation', 'monologue', 'other')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    duration_minutes INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. SHADOWING MATERIALS
CREATE TABLE IF NOT EXISTS public.shadowing_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    audio_url TEXT,
    video_url TEXT,
    script TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    is_active BOOLEAN DEFAULT true,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. MOCK TESTS
CREATE TABLE IF NOT EXISTS public.mock_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('listening', 'reading', 'writing', 'speaking', 'full')),
    html_content TEXT,
    audio_url TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    is_active BOOLEAN DEFAULT true,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. VOCAB SETS
CREATE TABLE IF NOT EXISTS public.vocab_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    is_active BOOLEAN DEFAULT true,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. VOCAB WORDS
CREATE TABLE IF NOT EXISTS public.vocab_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vocab_set_id UUID NOT NULL REFERENCES public.vocab_sets(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    definition TEXT NOT NULL,
    example_sentence TEXT,
    synonyms TEXT[] DEFAULT '{}',
    translation_uz TEXT,  -- O'zbek tarjimasi
    part_of_speech TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- INDEXES (Performance uchun)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_coins_user ON public.user_coins(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user ON public.coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_type ON public.coin_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_created ON public.coin_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user ON public.payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON public.payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_referral_history_referrer ON public.referral_history(referrer_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON public.admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON public.admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_level ON public.articles(level);
CREATE INDEX IF NOT EXISTS idx_listening_materials_category ON public.listening_materials(category);
CREATE INDEX IF NOT EXISTS idx_mock_tests_type ON public.mock_tests(type);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Admin users can read all profiles
CREATE POLICY "Admins can read all profiles" 
    ON public.profiles FOR SELECT 
    USING (auth.role() = 'authenticated' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- Admin users can update profiles
CREATE POLICY "Admins can update any profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.role() = 'authenticated' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- Enable RLS on all tables
ALTER TABLE public.user_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Admin policies for new tables
CREATE POLICY "Admins full access user_coins" ON public.user_coins 
    FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

CREATE POLICY "Admins full access coin_transactions" ON public.coin_transactions 
    FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

CREATE POLICY "Admins full access user_subscriptions" ON public.user_subscriptions 
    FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

CREATE POLICY "Admins full access payment_requests" ON public.payment_requests 
    FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

CREATE POLICY "Admins full access referral_history" ON public.referral_history 
    FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

CREATE POLICY "Admins full access admin_logs" ON public.admin_logs 
    FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- =====================================================
-- HANDLE NEW USER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, email, role, full_name, is_active, last_active_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        true,
        now()
    );
    
    -- Create coin wallet
    INSERT INTO public.user_coins (user_id, balance, total_earned, total_spent)
    VALUES (NEW.id, 0, 0, 0);
    
    RETURN NEW;
END;
$$;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- GET ADMIN DASHBOARD STATS FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    total_users BIGINT;
    active_subs BIGINT;
    total_coins BIGINT;
    pending_payments BIGINT;
    today_active BIGINT;
BEGIN
    -- Total users
    SELECT COUNT(*) INTO total_users FROM public.profiles WHERE role = 'user';
    
    -- Active subscriptions
    SELECT COUNT(*) INTO active_subs FROM public.user_subscriptions WHERE status = 'active';
    
    -- Total coins distributed
    SELECT COALESCE(SUM(total_earned), 0) INTO total_coins FROM public.user_coins;
    
    -- Pending payments
    SELECT COUNT(*) INTO pending_payments FROM public.payment_requests WHERE status = 'pending';
    
    -- Today's active users
    SELECT COUNT(*) INTO today_active FROM public.profiles 
    WHERE last_active_at >= CURRENT_DATE AND role = 'user';
    
    result := jsonb_build_object(
        'total_users', total_users,
        'active_subscriptions', active_subs,
        'total_coins_distributed', total_coins,
        'pending_payments', pending_payments,
        'today_active_users', today_active
    );
    
    RETURN result;
END;
$$;