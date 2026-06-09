import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Admin autentifikatsiyasini tekshiradi.
 * JWT tokenni decode qiladi va foydalanuvchi admin ekanligini tekshiradi.
 */
export async function verifyAdmin(
  req: Request,
  supabaseUrl: string,
  supabaseServiceKey: string
): Promise<{ admin: AdminUser | null; error: string | null }> {
  try {
    // Authorization headerni olish
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { admin: null, error: 'Authorization header missing or invalid' };
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Service Role Client (faqat admin uchun)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Userni tokendan olish
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return { admin: null, error: 'Invalid or expired token' };
    }

    // Profiledan admin ekanligini tekshirish
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, username, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { admin: null, error: 'Profile not found' };
    }

    if (profile.role !== 'admin' && profile.role !== 'super_admin') {
      return { admin: null, error: 'Access denied. Admin only.' };
    }

    return {
      admin: {
        id: profile.id,
        email: profile.username || '',
        role: profile.role,
      },
      error: null,
    };
  } catch (err) {
    return { admin: null, error: `Authentication error: ${err.message}` };
  }
}

/**
 * Admin log yozish
 */
export async function logAdminAction(
  supabaseUrl: string,
  supabaseServiceKey: string,
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await supabase.from('admin_logs').insert({
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata,
  });
}

/**
 * CORS headers
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * CORS tekshiruvi
 */
export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}