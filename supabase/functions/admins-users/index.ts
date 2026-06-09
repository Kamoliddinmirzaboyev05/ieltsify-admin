import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { verifyAdmin, corsHeaders, handleCors, logAdminAction } from '../_shared/admin-auth.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const { admin, error } = await verifyAdmin(req, supabaseUrl, supabaseServiceKey);
    if (error || !admin) {
      return new Response(JSON.stringify({ error: error || 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const url = new URL(req.url);
    const path = url.pathname.replace('/admins-users', '');

    // GET /users — barcha foydalanuvchilar ro'yxati
    if (req.method === 'GET' && (path === '/users' || path === '/')) {
      const search = url.searchParams.get('search') || '';
      const roleFilter = url.searchParams.get('role') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      let query = supabase
        .from('user_profiles')
        .select('*, user_coins(balance, total_earned), user_subscriptions(plan_type, status, expires_at)', { count: 'exact' });

      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,username.ilike.%${search}%`);
      }

      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }

      const { data: users, count, error: fetchError } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (fetchError) throw fetchError;

      await logAdminAction(supabaseUrl, supabaseServiceKey, admin.id, 'list_users', 'user', 'list', { search, page });

      return new Response(JSON.stringify({
        success: true,
        data: users || [],
        pagination: { total: count || 0, page, limit, total_pages: Math.ceil((count || 0) / limit) },
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // GET /users/:id — bitta foydalanuvchi profili
    if (req.method === 'GET' && path.startsWith('/users/')) {
      const userId = path.split('/')[2];
      const { data: user, error: userError } = await supabase
        .from('user_profiles')
        .select('*, user_coins(*), user_subscriptions(*), coin_transactions(*)')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      return new Response(JSON.stringify({ success: true, data: user }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /users/coins — coin qo'shish/ayirish
    if (req.method === 'POST' && path === '/users/coins') {
      const body = await req.json();
      const { user_id, amount, description } = body;

      if (!user_id || !amount) {
        return new Response(JSON.stringify({ error: 'user_id va amount required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Transaction type
      const transactionType = amount > 0 ? 'admin_adjustment' : 'admin_adjustment';

      // Coins jadvalini yangilash
      const { data: coinWallet, error: walletError } = await supabase
        .from('user_coins')
        .select('*')
        .eq('user_id', user_id)
        .single();

      if (walletError) throw walletError;

      const newBalance = (coinWallet?.balance || 0) + amount;
      if (newBalance < 0) {
        return new Response(JSON.stringify({ error: 'Insufficient coins' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update wallet
      const updates: Record<string, any> = { balance: newBalance, updated_at: new Date().toISOString() };
      if (amount > 0) updates.total_earned = (coinWallet?.total_earned || 0) + amount;

      const { error: updateError } = await supabase
        .from('user_coins')
        .update(updates)
        .eq('user_id', user_id);

      if (updateError) throw updateError;

      // Transaction log
      const { error: txError } = await supabase
        .from('coin_transactions')
        .insert({
          user_id,
          amount,
          transaction_type: transactionType,
          description: description || `Admin (${admin.email}) tomonidan ${amount > 0 ? 'qo\'shildi' : 'ayirildi'}`,
          admin_id: admin.id,
        });

      if (txError) throw txError;

      await logAdminAction(supabaseUrl, supabaseServiceKey, admin.id, 'adjust_coins', 'user', user_id, { amount, description });

      return new Response(JSON.stringify({
        success: true,
        data: { user_id, new_balance: newBalance, amount },
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // POST /users/subscription — subscription yoqish/ o'chirish
    if (req.method === 'POST' && path === '/users/subscription') {
      const body = await req.json();
      const { user_id, plan_type, status, expires_at } = body;

      if (!user_id || !plan_type || !status) {
        return new Response(JSON.stringify({ error: 'user_id, plan_type, status required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (status === 'active') {
        const { error: subError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id,
            plan_type,
            status: 'active',
            expires_at: expires_at || null,
            admin_id: admin.id,
            started_at: new Date().toISOString(),
          }, { onConflict: 'user_id, plan_type' });

        if (subError) throw subError;
      } else {
        const { error: subError } = await supabase
          .from('user_subscriptions')
          .update({ status, cancelled_at: new Date().toISOString(), admin_id: admin.id })
          .eq('user_id', user_id)
          .eq('status', 'active');

        if (subError) throw subError;
      }

      await logAdminAction(supabaseUrl, supabaseServiceKey, admin.id, 'toggle_subscription', 'user', user_id, { plan_type, status });

      return new Response(JSON.stringify({ success: true, data: { user_id, plan_type, status } }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /referrals/top — eng ko'p referral qilganlar
    if (req.method === 'GET' && path === '/referrals/top') {
      const { data: topReferrers, error: refError } = await supabase
        .from('referral_history')
        .select('referrer_id, count:referrer_id.count(), user_profiles!referral_history_referrer_id_fkey(username, first_name, last_name)')
        .eq('status', 'completed')
        .order('count', { ascending: false })
        .limit(20);

      if (refError) throw refError;

      return new Response(JSON.stringify({ success: true, data: topReferrers || [] }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: `Internal error: ${err.message}` }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});