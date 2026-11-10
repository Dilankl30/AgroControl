# AgroControl — Gemelo Digital 3D & Sistema de Acceso

Proyecto desarrollado con **Next.js 15+ (App Router)**, **TypeScript**, **Tailwind CSS** y **Supabase Auth**.

## 🚀 Inicio Rápido

1. **Configurar variables de entorno:**
   Copia el archivo `.env.local.example` a `.env.local` y coloca tu URL y clave de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
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

## 📁 Estructura del Proyecto

- `app/page.tsx`: Landing page con el Gemelo Digital 3D, secciones y modal de login.
- `app/dashboard/page.tsx`: Espacio privado tras autenticación exitosa.
- `app/auth/callback/route.ts`: Manejador de intercambio de códigos OAuth (Google) y Magic Links.
- `components/hero/Greenhouse3D.tsx`: Lienzo 3D interactivo con órbita 360°, nodos sensores y tarjetas de telemetría.
- `components/hero/SensorInspectorModal.tsx`: Inspector flotante con visor isométrico 3D.
- `components/auth/LoginModal.tsx`: Modal Split Card con Google OAuth, Correo OTP y Passkeys.
- `components/auth/OtpVerification.tsx`: Entrada de 6 dígitos con auto-pegado y temporizador.
- `lib/supabase/`: Clientes de Supabase para servidor, navegador y middleware.
