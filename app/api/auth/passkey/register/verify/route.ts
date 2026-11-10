import { NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';
import { getRpInfo } from '@/lib/webauthn';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }

    const challenge = request.headers.get('cookie')?.match(/webauthn_challenge=([^;]+)/)?.[1];
    const decodedChallenge = challenge ? decodeURIComponent(challenge) : null;
    if (!decodedChallenge) {
      return NextResponse.json({ error: 'Desafío expirado o inválido.' }, { status: 400 });
    }

    const { rpID, origin } = getRpInfo(request);

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: decodedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: 'Verificación fallida.' }, { status: 400 });
    }

    const { credential } = verification.registrationInfo;
    const credentialID = Buffer.from(credential.id).toString('base64url');
    const publicKey = Buffer.from(credential.publicKey).toString('base64');
    const counter = credential.counter;

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: 'Admin no configurado.' }, { status: 500 });
    }
    const admin = createAdminClient();
    const { error: insertError } = await admin.from('passkeys').insert({
      user_id: user.id,
      credential_id: credentialID,
      public_key: publicKey,
      counter,
      transports: body.response?.transports || null,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.delete('webauthn_challenge');
    response.cookies.delete('webauthn_user');
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error verificando registro.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
