import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { corsHeaders, handleCors } from '../_shared/admin-auth.ts';

// Bu Edge Function faqat bir marta ishlatiladi — birinchi admin yaratish uchun
serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await req.json();
    const { email, password, full_name } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email va password required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. User yaratish (Supabase Auth)
    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name || 'Admin', role: 'admin' },
    });

    if (createError) {
      if (createError.message?.includes('already')) {
        return new Response(JSON.stringify({ 
          error: 'Bu email allaqachon mavjud. Iltimos, Supabase Dashboard orqali role ni o\'zgartiring.' 
        }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      throw createError;
    }

    if (!authUser?.user) {
      throw new Error('User yaratilmadi');
    }

    // 2. Profileda role = 'super_admin' qilish
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ 
        role: 'super_admin',
        full_name: full_name || 'Admin',
        is_active: true,
      })
      .eq('id', authUser.user.id);

    if (profileError) throw profileError;

    // 3. Coin wallet yaratilganligiga ishonch hosil qilish
    const { data: existingWallet } = await supabase
      .from('user_coins')
      .select('id')
      .eq('user_id', authUser.user.id)
      .single();

    if (!existingWallet) {
      await supabase.from('user_coins').insert({
        user_id: authUser.user.id,
        balance: 0,
        total_earned: 0,
        total_spent: 0,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Admin user muvaffaqiyatli yaratildi!',
      data: { 
        id: authUser.user.id,
        email: authUser.user.email,
        role: 'super_admin',
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});