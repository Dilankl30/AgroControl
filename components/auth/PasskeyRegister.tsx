'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Fingerprint, RefreshCw, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';

type PasskeyItem = { id: string; friendly_name?: string; created_at: string; last_used_at?: string };

export function PasskeyRegister() {
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
      toast('Passkey registrada. Usa la opción de verificación que ofrezca tu dispositivo.');
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

  const handleDelete = async (passkey: PasskeyItem) => {
    const name = passkey.friendly_name || 'esta Passkey';
    const confirmed = window.confirm(
      `¿Eliminar ${name} de tu cuenta AgroControl? Este dispositivo dejará de poder iniciar sesión con esa Passkey. Si es la única registrada, aún podrás entrar con tu correo y contraseña.`,
    );
    if (!confirmed) return;

    setDeletingId(passkey.id);
    setError(null);
    setMsg(null);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase.auth.passkey.delete({ passkeyId: passkey.id });
      if (deleteError) throw deleteError;

      setPasskeys((current) => current.filter((item) => item.id !== passkey.id));
      setMsg('Passkey eliminada de tu cuenta.');
      toast('Passkey eliminada de AgroControl.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error eliminando la Passkey.';
      setError(message);
    } finally {
      setDeletingId(null);
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
            <div className="text-sm font-bold text-white">Biometría o método de acceso</div>
            <div className="text-xs text-[#a0c7b9]">Biometría, PIN o llave, según el dispositivo</div>
          </div>
        </div>
        <button
          onClick={handleRegister}
          disabled={loading || listLoading || deletingId !== null}
          className="self-start min-[480px]:self-auto shrink-0 min-h-11 px-4 py-2 rounded-xl bg-[#13795b] hover:bg-[#1a9470] disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Fingerprint className="w-3.5 h-3.5" />}
          {loading ? 'Configurando...' : 'Configurar método'}
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
        La verificación ocurre en el dispositivo con la opción compatible que elijas. AgroControl no recibe ni guarda fotos ni plantillas biométricas; Supabase valida la Passkey registrada.
      </p>

      <div className="border-t border-white/10 pt-3">
        <div className="text-xs font-semibold text-[#b8d5cb] mb-2">Passkeys registradas</div>
        {listLoading ? (
          <div className="text-xs text-[#a0c7b9]">Consultando tu cuenta…</div>
        ) : passkeys.length ? (
          <ul className="space-y-2">
            {passkeys.map((passkey) => (
              <li key={passkey.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white">
                <div className="min-w-0">
                  <div className="break-words">{passkey.friendly_name || 'Passkey de dispositivo'}</div>
                  <div className="text-[#a0c7b9]">
                    Registrada {new Date(passkey.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(passkey)}
                  disabled={deletingId !== null || loading}
                  aria-label={`Eliminar ${passkey.friendly_name || 'Passkey de dispositivo'}`}
                  title="Eliminar Passkey"
                  className="ml-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-red-300/20 text-red-200 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === passkey.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
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
