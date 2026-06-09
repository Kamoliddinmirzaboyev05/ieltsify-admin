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
    const path = url.pathname.replace('/admins-payments', '');

    // GET /payments — barcha to'lov so'rovlari
    if (req.method === 'GET' && (path === '/payments' || path === '/')) {
      const status = url.searchParams.get('status') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      let query = supabase
        .from('payment_requests')
        .select('*, user_profiles!payment_requests_user_id_fkey(username, first_name, last_name)', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      const { data: payments, count, error: fetchError } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (fetchError) throw fetchError;

      return new Response(JSON.stringify({
        success: true,
        data: payments || [],
        pagination: { total: count || 0, page, limit, total_pages: Math.ceil((count || 0) / limit) },
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // POST /payments/approve — to'lovni tasdiqlash
    if (req.method === 'POST' && path === '/payments/approve') {
      const body = await req.json();
      const { payment_id } = body;

      if (!payment_id) {
        return new Response(JSON.stringify({ error: 'payment_id required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // To'lov so'rovini olish
      const { data: payment, error: paymentError } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('id', payment_id)
        .single();

      if (paymentError || !payment) {
        return new Response(JSON.stringify({ error: 'Payment request not found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (payment.status !== 'pending') {
        return new Response(JSON.stringify({ error: 'Payment already processed' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Transactionni boshlash (Supabase transactions emas, lekin biz ketma-ket ishlaymiz)
      
      // 1. To'lovni tasdiqlash
      const { error: updateError } = await supabase
        .from('payment_requests')
        .update({
          status: 'approved',
          admin_id: admin.id,
          processed_at: new Date().toISOString(),
        })
        .eq('id', payment_id);

      if (updateError) throw updateError;

      // 2. Agar coin purchase bo'lsa, coin qo'shish
      if (payment.payment_type === 'coin_purchase' && payment.coins_requested > 0) {
        const { data: coinWallet } = await supabase
          .from('user_coins')
          .select('*')
          .eq('user_id', payment.user_id)
          .single();

        const newBalance = (coinWallet?.balance || 0) + Number(payment.coins_requested);
        const newEarned = (coinWallet?.total_earned || 0) + Number(payment.coins_requested);

        const { error: coinError } = await supabase
          .from('user_coins')
          .update({
            balance: newBalance,
            total_earned: newEarned,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', payment.user_id);

        if (coinError) throw coinError;

        // Coin transaction log
        const { error: txError } = await supabase
          .from('coin_transactions')
          .insert({
            user_id: payment.user_id,
            amount: payment.coins_requested,
            transaction_type: 'purchase',
            description: `To'lov tasdiqlandi: ${payment.amount} ${payment.currency}`,
            reference_id: payment_id,
            admin_id: admin.id,
          });

        if (txError) throw txError;
      }

      // 3. Agar subscription bo'lsa, subscription yoqish
      if (payment.payment_type === 'subscription' && payment.plan_type) {
        const { error: subError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: payment.user_id,
            plan_type: payment.plan_type,
            status: 'active',
            price: payment.amount,
            payment_method: 'payment_request',
            admin_id: admin.id,
            started_at: new Date().toISOString(),
          }, { onConflict: 'user_id, plan_type' })
          .select()
          .single();

        if (subError) throw subError;
      }

      // Log
      await logAdminAction(supabaseUrl, supabaseServiceKey, admin.id, 'approve_payment', 'payment', payment_id, {
        amount: payment.amount,
        type: payment.payment_type,
        user_id: payment.user_id,
      });

      return new Response(JSON.stringify({ success: true, data: { payment_id, status: 'approved' } }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /payments/reject — to'lovni rad etish
    if (req.method === 'POST' && path === '/payments/reject') {
      const body = await req.json();
      const { payment_id, reason } = body;

      if (!payment_id) {
        return new Response(JSON.stringify({ error: 'payment_id required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: payment, error: paymentError } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('id', payment_id)
        .single();

      if (paymentError || !payment) {
        return new Response(JSON.stringify({ error: 'Payment request not found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (payment.status !== 'pending') {
        return new Response(JSON.stringify({ error: 'Payment already processed' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error: updateError } = await supabase
        .from('payment_requests')
        .update({
          status: 'rejected',
          admin_id: admin.id,
          admin_note: reason || null,
          processed_at: new Date().toISOString(),
        })
        .eq('id', payment_id);

      if (updateError) throw updateError;

      // Log
      await logAdminAction(supabaseUrl, supabaseServiceKey, admin.id, 'reject_payment', 'payment', payment_id, {
        amount: payment.amount,
        reason,
        user_id: payment.user_id,
      });

      return new Response(JSON.stringify({ success: true, data: { payment_id, status: 'rejected', reason } }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /logs — admin loglari
    if (req.method === 'GET' && path === '/logs') {
      const action = url.searchParams.get('action') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = (page - 1) * limit;

      let query = supabase
        .from('admin_logs')
        .select('*, user_profiles!admin_logs_admin_id_fkey(username, first_name, last_name)', { count: 'exact' });

      if (action) {
        query = query.eq('action', action);
      }

      const { data: logs, count, error: logsError } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (logsError) throw logsError;

      return new Response(JSON.stringify({
        success: true,
        data: logs || [],
        pagination: { total: count || 0, page, limit, total_pages: Math.ceil((count || 0) / limit) },
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // GET /coin-transactions — coin transaction loglari
    if (req.method === 'GET' && path === '/coin-transactions') {
      const userId = url.searchParams.get('user_id') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = (page - 1) * limit;

      let query = supabase
        .from('coin_transactions')
        .select('*, user_profiles!coin_transactions_user_id_fkey(username, first_name, last_name)', { count: 'exact' });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: transactions, count, error: txError } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (txError) throw txError;

      return new Response(JSON.stringify({
        success: true,
        data: transactions || [],
        pagination: { total: count || 0, page, limit, total_pages: Math.ceil((count || 0) / limit) },
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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