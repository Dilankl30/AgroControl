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

    if (error || !data?.properties?.action_link) {
      return NextResponse.json(
        { error: error?.message || 'No se pudo crear la cuenta.' },
        { status: 400 }
      );
    }

    const link = data.properties.action_link;

    if (isEmailConfigured()) {
      await sendEmail({
        to: email,
        subject: 'Confirma tu cuenta de AgroControl',
        text: `Hola, confirma tu cuenta abriendo este enlace: ${link}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
            <h2 style="color:#093f33;">Bienvenido a AgroControl</h2>
            <p>Para activar tu cuenta, confirma tu correo electrónico haciendo clic en el siguiente botón:</p>
            <p style="text-align:center;margin:24px 0;">
              <a href="${link}" style="display:inline-block;padding:12px 24px;background:#093f33;color:#fff;text-decoration:none;border-radius:12px;font-weight:bold;">Confirmar cuenta</a>
            </p>
            <p style="font-size:12px;color:#527068;">Si no solicitaste esta cuenta, ignora este mensaje.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      ok: true,
      message: isEmailConfigured()
        ? 'Te enviamos un correo para confirmar tu cuenta.'
        : 'Cuenta creada. Configura SMTP para enviar el correo de confirmación.',
      // Solo en desarrollo: devolver el enlace si no hay SMTP
      devLink: isEmailConfigured() ? undefined : link,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error inesperado.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
