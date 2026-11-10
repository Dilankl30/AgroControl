import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  if (code && isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL('/dashboard', origin));
    } catch { /* No crear sesiones en caso de fallo. */ }
  }
  return NextResponse.redirect(new URL('/?error=auth_failed', origin));
}
