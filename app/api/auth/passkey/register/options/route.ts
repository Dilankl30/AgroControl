import { NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';
import { getRpInfo } from '@/lib/webauthn';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }

    const { rpID, origin } = getRpInfo(request);

    // Obtener credenciales existentes
    let excludeCredentials: { id: string; transports?: AuthenticatorTransport[] }[] = [];
    if (isAdminConfigured()) {
      const admin = createAdminClient();
      const { data } = await admin.from('passkeys').select('credential_id, transports').eq('user_id', user.id);
      excludeCredentials = (data || []).map((r: { credential_id: string; transports: string[] | null }) => ({
        id: r.credential_id,
        transports: (r.transports as AuthenticatorTransport[]) || undefined,
      }));
    }

    const options = await generateRegistrationOptions({
      rpName: 'AgroControl',
      rpID,
      userID: new TextEncoder().encode(user.id),
      userName: user.email || user.id,
      userDisplayName: (user.user_metadata?.full_name as string) || user.email || 'Usuario',
      timeout: 60000,
      attestationType: 'none',
      excludeCredentials,
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    const response = NextResponse.json(options);
    response.cookies.set('webauthn_challenge', options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300,
      path: '/',
    });
    // store user id in cookie for verify step
    response.cookies.set('webauthn_user', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300,
      path: '/',
    });
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error generando opciones.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
