'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Fingerprint, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';

type PasskeyItem = { id: string; friendly_name?: string; created_at: string; last_used_at?: string };

export function PasskeyRegister() {
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [passkeys, setPasskeys] = useState<PasskeyItem[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadPasskeys = useCallback(async () => {
    setListLoading(true);
    const supabase = createClient();
    const { data, error: listError } = await supabase.auth.passkey.list();
    if (listError) {
      setError(listError.message);
    } else {
      setPasskeys(data ?? []);
    }
    setListLoading(false);
  }, []);

  useEffect(() => {
    void loadPasskeys();
  }, [loadPasskeys]);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    setMsg(null);
    try {
      const supabase = createClient();
      const { error: registerError } = await supabase.auth.registerPasskey();
      if (registerError) throw registerError;

      setMsg('Acceso biométrico configurado en este dispositivo.');
      toast('Passkey registrada. Cuando el dispositivo lo permita, podrás verificar con el rostro.');
      await loadPasskeys();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error registrando Passkey.';
      const normalized = message.toLowerCase();
      if (normalized.includes('not allowed') || normalized.includes('cancel')) {
        setError('Registro cancelado o no permitido por el dispositivo.');
      } else if (normalized.includes('passkey_disabled')) {
        setError('El acceso con Passkey todavía no está activado en Supabase.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-0 p-3 sm:p-4 rounded-2xl bg-black/30 border border-white/10 space-y-4">
      <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Fingerprint className="w-5 h-5 text-[#56f3bd]" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Rostro con Passkey</div>
            <div className="text-xs text-[#a0c7b9]">Face ID o Windows Hello, si el dispositivo lo admite</div>
          </div>
        </div>
        <button
          onClick={handleRegister}
          disabled={loading || listLoading}
          className="self-start min-[480px]:self-auto shrink-0 min-h-11 px-4 py-2 rounded-xl bg-[#13795b] hover:bg-[#1a9470] disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Fingerprint className="w-3.5 h-3.5" />}
          {loading ? 'Configurando...' : 'Configurar rostro'}
        </button>
      </div>

      {error && (
        <div className="text-xs text-red-300 flex items-start gap-1.5" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {error}
        </div>
      )}
      {msg && (
        <div className="text-xs text-[#56f3bd] flex items-center gap-1.5" role="status">
          <CheckCircle className="w-3.5 h-3.5" /> {msg}
        </div>
      )}

      <p className="text-xs leading-relaxed text-[#a0c7b9]">
        La verificación ocurre en el dispositivo: AgroControl no recibe ni guarda fotos del rostro. Si el dispositivo no admite reconocimiento facial, puede ofrecer otro método local, como huella o PIN.
      </p>

      <div className="border-t border-white/10 pt-3">
        <div className="text-xs font-semibold text-[#b8d5cb] mb-2">Passkeys registradas</div>
        {listLoading ? (
          <div className="text-xs text-[#a0c7b9]">Consultando tu cuenta…</div>
        ) : passkeys.length ? (
          <ul className="space-y-2">
            {passkeys.map((passkey) => (
              <li key={passkey.id} className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs text-white">
                <span>{passkey.friendly_name || 'Passkey de dispositivo'}</span>
                <span className="text-[#a0c7b9]">
                  Registrada {new Date(passkey.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-[#a0c7b9]">Aún no has registrado una Passkey.</div>
        )}
      </div>
    </div>
  );
}
