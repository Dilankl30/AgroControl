'use client';

import React, { useState } from 'react';
import { ArrowLeft, Fingerprint, RefreshCw, AlertCircle, Mail } from 'lucide-react';
import { startAuthentication } from '@simplewebauthn/browser';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';

export function PasskeyAuth({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePasskeyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Escribe un correo válido.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const optRes = await fetch('/api/auth/passkey/auth/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const optJson = await optRes.json();
      if (!optRes.ok) {
        setLoading(false);
        setErrorMsg(optJson?.error || 'No se pudo iniciar la autenticación.');
        return;
      }

      const assertion = await startAuthentication({ optionsJSON: optJson.options });

      const verifyRes = await fetch('/api/auth/passkey/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assertion),
      });
      const verifyJson = await verifyRes.json();
      if (!verifyRes.ok) {
        setLoading(false);
        setErrorMsg(verifyJson?.error || 'Verificación fallida.');
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email: verifyJson.email,
        token_hash: verifyJson.token_hash,
        type: 'magiclink',
      });

      if (error) {
        setLoading(false);
        setErrorMsg('No se pudo establecer la sesión.');
        return;
      }

      toast('¡Acceso con passkey exitoso! 🌱');
      setLoading(false);
      setTimeout(() => onSuccess(), 300);
    } catch (err: unknown) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'Error de autenticación.';
      if (message.toLowerCase().includes('not allowed') || message.toLowerCase().includes('cancelled')) {
        setErrorMsg('Operación cancelada o no permitida por el dispositivo.');
      } else {
        setErrorMsg(message);
      }
    }
  };

  return (
    <div className="flex flex-col h-full justify-between animate-in fade-in duration-200">
      <div>
        <button
          onClick={onBack}
          type="button"
          className="text-xs font-semibold text-[#527068] hover:text-[#093f33] transition-colors mb-6 cursor-pointer"
        >
          ← Volver a opciones
        </button>

        <div className="text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-2">
          Acceso biométrico
        </div>
        <h2 className="text-3xl font-black text-[#093f33] mb-2">Passkey / Biometría</h2>
        <p className="text-sm text-[#527068] leading-relaxed mb-6">
          Ingresa tu correo y usa la huella, reconocimiento facial o PIN de tu dispositivo.
        </p>

        <form onSubmit={handlePasskeyLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#093f33] mb-1.5 uppercase tracking-wider">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#cbe0d6] focus:border-[#13795b] text-[#093f33] font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[#13795b]/15 transition-all"
              />
              <Mail className="w-4 h-4 text-[#8ea49c] absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#072f28] to-[#041d18] hover:from-[#0a3f36] hover:to-[#072f28] disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Fingerprint className="w-4 h-4" />
                <span>Entrar con Passkey</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="pt-6 border-t border-[#e2ece7] text-xs text-[#527068]">
        Requiere haber registrado una passkey previamente en tu cuenta.
      </div>
    </div>
  );
}
