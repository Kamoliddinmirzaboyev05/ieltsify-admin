import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { verifyAdmin, corsHeaders, handleCors, logAdminAction } from '../_shared/admin-auth.ts';

serve(async (req) => {
  // CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Admin tekshiruvi
    const { admin, error } = await verifyAdmin(req, supabaseUrl, supabaseServiceKey);
    if (error || !admin) {
      return new Response(JSON.stringify({ error: error || 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Dashboard statistikasini olish
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Asosiy statistika
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    const adminUsers = await supabase
      .from('user_profiles')
      .select('id')
      .in('role', ['admin', 'super_admin']);

    const regularUsers = (totalUsers || 0) - (adminUsers.data?.length || 0);

    const { count: activeSubscriptions } = await supabase
      .from('user_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { data: coinsData } = await supabase
      .from('user_coins')
      .select('balance, total_earned');

    const totalCoinsDistributed = coinsData?.reduce((sum, c) => sum + (c.total_earned || 0), 0) || 0;
    const totalCoinsBalance = coinsData?.reduce((sum, c) => sum + (c.balance || 0), 0) || 0;

    const { count: pendingPayments } = await supabase
      .from('payment_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Bugungi faol foydalanuvchilar
    const today = new Date().toISOString().split('T')[0];
    const { count: todayActive } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_active_at', today)
      .not('role', 'in', '("admin","super_admin")');

    // Subscriptions bo'yicha taqsimot
    const { data: planDistribution } = await supabase
      .from('user_subscriptions')
      .select('plan_type, status');

    const activePlans = planDistribution?.filter(p => p.status === 'active') || [];
    const planCounts: Record<string, number> = {};
    activePlans.forEach(p => {
      planCounts[p.plan_type] = (planCounts[p.plan_type] || 0) + 1;
    });

    // To'lov statistikasi
    const { data: paymentStats } = await supabase
      .from('payment_requests')
      .select('status, amount');

    const totalApprovedAmount = paymentStats
      ?.filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    const totalPendingAmount = paymentStats
      ?.filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    // Log
    await logAdminAction(
      supabaseUrl, supabaseServiceKey,
      admin.id, 'view_dashboard', 'system', 'dashboard',
      {}
    );

    return new Response(JSON.stringify({
      success: true,
      data: {
        overview: {
          total_users: regularUsers,
          active_subscriptions: activeSubscriptions || 0,
          total_coins_distributed: totalCoinsDistributed,
          total_coins_in_circulation: totalCoinsBalance,
          pending_payments: pendingPayments || 0,
          today_active_users: todayActive || 0,
        },
        subscriptions: {
          total: planDistribution?.length || 0,
          active: activeSubscriptions || 0,
          plan_distribution: planCounts,
        },
        payments: {
          total_approved_amount: totalApprovedAmount,
          total_pending_amount: totalPendingAmount,
          pending_count: pendingPayments || 0,
        },
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: `Internal error: ${err.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});