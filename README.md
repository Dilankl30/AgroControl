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

## Acceso con correo y Passkeys

- El registro crea la cuenta mediante un enlace de confirmación enviado por correo. Para enviarlo, configura las variables `SUPABASE_SERVICE_ROLE_KEY` y las `SMTP_*` en `.env.local` (ver `.env.local.example`). Si no hay SMTP, en desarrollo se devuelve el enlace directamente.
- El acceso disponible es con correo y contraseña o con una Passkey. El dispositivo elige el método de verificación disponible (rostro, huella, PIN o bloqueo local); la aplicación nunca recibe los datos biométricos.
- Al crear una cuenta, Supabase envía un enlace de confirmación por correo. Para entregarlo a usuarios externos, configura un servidor SMTP propio en **Supabase → Authentication → Emails / SMTP**; el SMTP de prueba restringe los destinatarios.
- En **Supabase → Authentication → URL Configuration**, define `http://localhost:3000` como URL del sitio y permite `http://localhost:3000/auth/callback`. Cuando se despliegue, agrega también el dominio HTTPS de Vercel a esos valores.
- Las Passkeys usan Supabase Auth nativo y no requieren una clave `service_role` ni tablas públicas propias. En el Dashboard de Supabase, abre **Authentication → Passkeys**, habilita la función y configura:
  - Relying Party Display Name: `AgroControl`
  - Relying Party ID: `agro-control-nu.vercel.app` (mantenerlo estable; cambiarlo invalida las Passkeys registradas)
  - Relying Party Origins: `https://agro-control-nu.vercel.app`
- Para probar Passkeys en desarrollo local, usa un proyecto Supabase separado con Relying Party ID `localhost` y origen `http://localhost:3000`; no mezcles ambos dominios bajo el RP ID de producción.
- El usuario inicia sesión con correo y contraseña y registra su Passkey desde **Dashboard → Tus Métodos de Acceso**. La autenticación Passkey no pide el correo; el autenticador identifica la cuenta.

## 📁 Estructura del Proyecto

- `app/page.tsx`: Landing page con el Gemelo Digital 3D, secciones y modal de login.
- `app/dashboard/page.tsx`: Espacio privado tras autenticación exitosa.
- `app/auth/callback/route.ts`: Manejador del enlace de confirmación de cuenta.
- `components/hero/Greenhouse3D.tsx`: Lienzo 3D interactivo con órbita 360°, nodos sensores y tarjetas de telemetría.
- `components/hero/SensorInspectorModal.tsx`: Inspector flotante con visor isométrico 3D.
- `components/auth/LoginModal.tsx`: Modal de acceso con correo/contraseña y Passkeys.
- `lib/supabase/`: Clientes de Supabase para servidor, navegador y middleware.
