import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      await supabase.auth.signOut();
    }
  } catch {
    // Continuar si hay error de Supabase
  }


  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(`${origin}/`, {
    status: 303,
  });

  response.cookies.delete('agrocontrol_session');
  response.cookies.delete('agrocontrol_email');

  return response;
}
