import { NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';
import { getRpInfo } from '@/lib/webauthn';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isAdminConfigured()) {
      return NextResponse.json({ error: 'Admin no configurado.' }, { status: 500 });
    }
    const admin = createAdminClient();

    const cookieHeader = request.headers.get('cookie') || '';
    const challengeMatch = cookieHeader.match(/webauthn_challenge=([^;]+)/);
    const userMatch = cookieHeader.match(/webauthn_user=([^;]+)/);
    const challenge = challengeMatch ? decodeURIComponent(challengeMatch[1]) : null;
    const userId = userMatch ? decodeURIComponent(userMatch[1]) : null;

    if (!challenge || !userId) {
      return NextResponse.json({ error: 'Desafío expirado o inválido.' }, { status: 400 });
    }

    const credentialId = body?.id;
    if (!credentialId) {
      return NextResponse.json({ error: 'Credencial inválida.' }, { status: 400 });
    }

    const { data: rows } = await admin.from('passkeys').select('*').eq('user_id', userId).eq('credential_id', credentialId);
    const cred = rows?.[0];
    if (!cred) {
      return NextResponse.json({ error: 'Credencial no encontrada.' }, { status: 404 });
    }

    const { rpID, origin } = getRpInfo(request);

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: cred.credential_id,
        publicKey: Buffer.from(cred.public_key, 'base64'),
        counter: Number(cred.counter),
      },
    });

    if (!verification.verified) {
      return NextResponse.json({ error: 'Verificación fallida.' }, { status: 400 });
    }

    // Actualizar counter
    await admin.from('passkeys').update({ counter: verification.authenticationInfo.newCounter }).eq('id', cred.id);

    // Obtener usuario para generar enlace de sesión
    const { data: userData } = await admin.auth.admin.getUserById(userId);
    const email = userData?.user?.email;
    if (!email) {
      return NextResponse.json({ error: 'Usuario sin correo.' }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `${siteUrl}/auth/callback` },
    });

    if (linkError || !linkData?.properties?.hashed_token) {
      return NextResponse.json({ error: linkError?.message || 'No se pudo crear la sesión.' }, { status: 500 });
    }

    const response = NextResponse.json({
      ok: true,
      email,
      token_hash: linkData.properties.hashed_token,
    });
    response.cookies.delete('webauthn_challenge');
    response.cookies.delete('webauthn_user');
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error verificando autenticación.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
