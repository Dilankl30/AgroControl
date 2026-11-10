import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured } from './client';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const protectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const deny = () => {
    const url = new URL('/', request.url);
    url.searchParams.set('auth', 'required');
    const result = NextResponse.redirect(url);
    response.cookies.getAll().forEach(cookie => result.cookies.set(cookie));
    result.cookies.delete('agrocontrol_session');
    result.cookies.delete('agrocontrol_email');
    return result;
  };
  if (!isSupabaseConfigured()) return protectedRoute ? deny() : response;
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies) {
        cookies.forEach(({name, value}) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookies.forEach(({name, value, options}) => response.cookies.set(name, value, options));
      },
    },
  });
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (protectedRoute && (error || !user)) return deny();
  } catch {
    if (protectedRoute) return deny();
  }
  return response;
}
