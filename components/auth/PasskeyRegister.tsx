'use client';

import React, { useState } from 'react';
import { Fingerprint, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';
import { useToast } from '@/components/ui/Toast';

export function PasskeyRegister() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    setMsg(null);
    try {
      const optRes = await fetch('/api/auth/passkey/register/options', { method: 'POST' });
      const optJson = await optRes.json();
      if (!optRes.ok) {
        setLoading(false);
        setError(optJson?.error || 'No se pudo iniciar el registro.');
        return;
      }

      const attestation = await startRegistration({ optionsJSON: optJson });

      const verifyRes = await fetch('/api/auth/passkey/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attestation),
      });
      const verifyJson = await verifyRes.json();
      if (!verifyRes.ok) {
        setLoading(false);
        setError(verifyJson?.error || 'Verificación fallida.');
        return;
      }

      setLoading(false);
      setMsg('Passkey registrada correctamente en este dispositivo.');
      toast('Passkey registrada. Ya puedes entrar con biometría.');
    } catch (err: unknown) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'Error registrando passkey.';
      setError(message);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Fingerprint className="w-5 h-5 text-[#56f3bd]" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">Registrar Passkey</div>
          <div className="text-xs text-[#a0c7b9]">Huella, reconocimiento facial o PIN de este dispositivo</div>
        </div>
      </div>
      <button
        onClick={handleRegister}
        disabled={loading}
        className="px-4 py-2 rounded-xl bg-[#13795b] hover:bg-[#1a9470] disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center gap-2"
      >
        {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Fingerprint className="w-3.5 h-3.5" />}
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
      {error && (
        <div className="text-xs text-red-400 flex items-center gap-1 mt-2">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </div>
      )}
      {msg && (
        <div className="text-xs text-[#56f3bd] flex items-center gap-1 mt-2">
          <CheckCircle className="w-3.5 h-3.5" /> {msg}
        </div>
      )}
    </div>
  );
}
