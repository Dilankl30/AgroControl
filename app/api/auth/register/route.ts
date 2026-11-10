import { NextResponse } from 'next/server';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';
import { sendEmail, isEmailConfigured } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim();
    const password = String(body?.password || '');
    const fullName = String(body?.fullName || '').trim();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: 'El servidor no está configurado (falta SUPABASE_SERVICE_ROLE_KEY).' },
        { status: 500 }
      );
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: 'El envío de correo no está configurado. Completa las variables SMTP del servidor.' },
        { status: 503 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const admin = createAdminClient();

    const { data, error } = await admin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        data: { full_name: fullName || undefined },
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error || !data?.properties?.email_otp) {
      return NextResponse.json(
        { error: error?.message || 'No se pudo crear la cuenta.' },
        { status: 400 }
      );
    }

    const code = data.properties.email_otp;
    await sendEmail({
      to: email,
      subject: 'Tu código de verificación de AgroControl',
      text: `Tu código de verificación de AgroControl es ${code}. Introdúcelo en la pantalla de registro para confirmar tu correo. Si no solicitaste esta cuenta, ignora este mensaje.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#16332e;">
          <h2 style="color:#093f33;">Verifica tu correo</h2>
          <p>Usa este código para confirmar tu cuenta de AgroControl:</p>
          <p style="margin:28px 0;text-align:center;">
            <span style="display:inline-block;padding:14px 24px;border-radius:14px;background:#eaf7f0;color:#093f33;font-size:32px;font-weight:bold;letter-spacing:8px;">${code}</span>
          </p>
          <p>Ingresa el código en la pantalla de registro. Si no solicitaste esta cuenta, ignora este mensaje.</p>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: 'Te enviamos un código de 6 dígitos para confirmar tu correo.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error inesperado.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
