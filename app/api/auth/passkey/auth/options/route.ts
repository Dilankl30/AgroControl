import { NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';
import { getRpInfo } from '@/lib/webauthn';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim();
    if (!email) {
      return NextResponse.json({ error: 'Correo requerido.' }, { status: 400 });
    }
    if (!isAdminConfigured()) {
      return NextResponse.json({ error: 'Admin no configurado.' }, { status: 500 });
    }

    const admin = createAdminClient();
    // Find user by email
    const { data: users } = await admin.auth.admin.listUsers();
    const user = users?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) {
      return NextResponse.json({ error: 'No existe una cuenta con ese correo.' }, { status: 404 });
    }

    const { data: creds } = await admin.from('passkeys').select('credential_id, transports').eq('user_id', user.id);
    if (!creds || creds.length === 0) {
      return NextResponse.json({ error: 'Este usuario no tiene passkeys registradas.' }, { status: 404 });
    }

    const { rpID } = getRpInfo(request);
    const options = await generateAuthenticationOptions({
      rpID,
      timeout: 60000,
      allowCredentials: creds.map((c: { credential_id: string; transports: string[] | null }) => ({
        id: c.credential_id,
        transports: (c.transports as AuthenticatorTransport[]) || undefined,
      })),
      userVerification: 'preferred',
    });

    const response = NextResponse.json({ options, userId: user.id });
    response.cookies.set('webauthn_challenge', options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300,
      path: '/',
    });
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
