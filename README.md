# AgroControl — Gemelo Digital 3D & Sistema de Acceso

Proyecto desarrollado con **Next.js 15+ (App Router)**, **TypeScript**, **Tailwind CSS** y **Supabase Auth**.

## 🚀 Inicio Rápido

1. **Configurar variables de entorno:**
   Copia `.env.local.example` a `.env.local` y reemplaza los valores por la URL y la clave pública (publishable/anon) del proyecto. No uses la clave `service_role` en el navegador ni la subas a GitHub.
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

2. **Ejecutar migraciones en Supabase:**
   Copia y ejecuta en el **SQL Editor** de tu consola de Supabase el archivo:
   `supabase/migrations/20261024_init_agrocontrol.sql`

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Acceso con correo y Google

- El acceso por correo envía un código OTP mediante Supabase Auth. Para entregarlo a usuarios externos, configura un servidor SMTP propio en **Supabase → Authentication → Emails / SMTP**; el SMTP compartido de Supabase sirve solo para pruebas y restringe destinatarios. No uses la contraseña normal de Gmail como clave SMTP.
- Para Google OAuth, activa Google en **Supabase → Authentication → Sign In / Providers** y registra allí el ID y secreto OAuth. En Google Cloud, la URI de redirección autorizada del cliente OAuth debe ser `https://your-project-ref.supabase.co/auth/v1/callback`.
- En **Supabase → Authentication → URL Configuration**, define `http://localhost:3000` como URL del sitio y permite `http://localhost:3000/auth/callback`. Cuando se despliegue, agrega también el dominio HTTPS de Vercel a esos valores.

## 📁 Estructura del Proyecto

- `app/page.tsx`: Landing page con el Gemelo Digital 3D, secciones y modal de login.
- `app/dashboard/page.tsx`: Espacio privado tras autenticación exitosa.
- `app/auth/callback/route.ts`: Manejador de intercambio de códigos OAuth (Google) y Magic Links.
- `components/hero/Greenhouse3D.tsx`: Lienzo 3D interactivo con órbita 360°, nodos sensores y tarjetas de telemetría.
- `components/hero/SensorInspectorModal.tsx`: Inspector flotante con visor isométrico 3D.
- `components/auth/LoginModal.tsx`: Modal Split Card con Google OAuth, Correo OTP y Passkeys.
- `components/auth/OtpVerification.tsx`: Entrada de 6 dígitos con auto-pegado y temporizador.
- `lib/supabase/`: Clientes de Supabase para servidor, navegador y middleware.
