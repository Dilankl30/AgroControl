import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AgroControlLogo } from '@/components/ui/AgroControlLogo';
import { PasskeyRegister } from '@/components/auth/PasskeyRegister';
import { ShieldCheck, LogOut, ArrowLeft, Cpu, Activity, Fingerprint, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let user = null;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }
  } catch {
    user = null;
  }

  if (!user) redirect('/?auth=required');
  const userName = 'Usuario';

  return (
    <div className="min-h-screen bg-[#041f1b] text-[#edf6f0] flex flex-col">
      {/* Topbar del Dashboard */}
      <header className="border-b border-white/10 bg-[#062923]/80 backdrop-blur-md px-6 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <AgroControlLogo variant="light" className="h-8 w-auto" />
          </Link>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#13795b]/30 border border-[#56f3bd]/30 text-xs font-semibold text-[#94ffb1]">
            Monitoreo · datos de demostración
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-white capitalize">{userName}</div>
            <div className="text-xs text-[#a0c7b9]">Sesión privada</div>
          </div>

          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/15 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Cerrar sesión</span>
            </button>
          </form>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto p-6 sm:p-10">
        {/* Banner de Bienvenida y Acceso Confirmado */}
        <div className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-[#08372f] to-[#0a483e] border border-[#56f3bd]/25 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#56f3bd] mb-2">
                <CheckCircle className="w-4 h-4" />
                <span>Acceso Confirmado · Sesión Válida</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                Hola, <span className="capitalize">{userName}</span>.
              </h1>
              <p className="text-sm text-[#d0ede0] max-w-xl">
                Todo listo para continuar en AgroControl. La sesión se autenticó mediante los esquemas
                seguros de Supabase Auth.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la vista 3D</span>
            </Link>
          </div>
        </div>

        {/* Resumen de Sensores y Nodos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-[#062923]/90 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#b8d5cb] uppercase tracking-wider">Temperatura</span>
              <Activity className="w-4 h-4 text-[#56f3bd]" />
            </div>
            <div className="text-3xl font-extrabold text-white mb-1">23.8 °C</div>
            <div className="text-xs text-[#56f3bd]">Dentro del rango agronómico óptimo</div>
          </div>

          <div className="p-6 rounded-2xl bg-[#062923]/90 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#b8d5cb] uppercase tracking-wider">Humedad Relativa</span>
              <Activity className="w-4 h-4 text-[#56f3bd]" />
            </div>
            <div className="text-3xl font-extrabold text-white mb-1">68 %</div>
            <div className="text-xs text-[#56f3bd]">Estable en canopia</div>
          </div>

          <div className="p-6 rounded-2xl bg-[#062923]/90 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#b8d5cb] uppercase tracking-wider">Radiación PAR</span>
              <Activity className="w-4 h-4 text-[#efc369]" />
            </div>
            <div className="text-3xl font-extrabold text-white mb-1">850 W/m²</div>
            <div className="text-xs text-[#efc369]">Alta radiación solar</div>
          </div>
        </div>

        {/* Tarjeta de Métodos de Acceso y Passkey */}
        <div className="p-8 rounded-3xl bg-[#062923]/80 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#56f3bd]" />
                <span>Tus Métodos de Acceso</span>
              </h3>
              <p className="text-xs text-[#a0c7b9]">
                Gestiona tus credenciales biométricas y dispositivos autorizados.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#13795b]/30 text-xs font-semibold text-[#56f3bd] border border-[#56f3bd]/20">
              Autenticación FIDO2 / WebAuthn
            </span>
          </div>

          <PasskeyRegister />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-[#56f3bd]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Dispositivo actual</div>
                  <div className="text-xs text-[#a0c7b9]">Passkeys pendientes de implementar</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#56f3bd]">Pendiente</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-[#56f3bd]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Esquema en Supabase</div>
                  <div className="text-xs text-[#a0c7b9]">auth.users & agrocontrol_app.profiles</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#56f3bd]">Sin verificar</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
